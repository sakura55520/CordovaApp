<!--
 组件名: 扫码组件
  1.使用防抖响应input事件
  2.回调事件是: 'has-done'
-->
<template>
  <div style="margin-top: 3px;">
    <el-input v-trim v-model.trim="codeText" :placeholder="placeholder" size="mini" v-on="$listeners" :clearable="false" class="scan-input" @input.native="debounceInput" @keyup.enter.native="emitHasDone">
      <div style="margin-left: 30%;margin-top: -2px;" slot="append">
        <img v-if="codeText" src="../../../assets/imgs/icon-del.png" class="scanClearStyle" @click="codeText=''" />
        <img v-if="isSensor" src="../../../assets/imgs/nfcFull.png" class="scanImgStyle" @click="handleSensor" />
        <img v-else src="../../../assets/imgs/nfc.png" class="scanImgStyle" @click="handleSensor" />
      </div>
    </el-input>
  </div>
</template>

<script>
import { debounce } from '@/utils'

export default {
name: 'CodeScanner',
props: {
  value: {
    required: true,
    type: String | undefined | null
  }
},
computed: {
  codeText: {
    get() {
      return this.value
    },
    set(val) {
      this.$emit('input', val)
    }
  }
},
data(){
  return {
    placeholder:'请开启感应器获取数据',
    isSensor:false,
    errorData:'错误信息：---',
    sensorID:null
  }
},
created() {
  this.debounceInput = debounce(this.emitHasDone, 1000)
},
beforeDestory() {
  this.debounceInput = null
},
methods: {
  handleSensor() {
    if(this.isSensor){
      this.$message.info('正在读取')
      return
    }else{
      try {
        this.sensorID = setInterval(() => {
          this.isSensor = true
          this.placeholder = '正在感应中...'
          window.WebViewJavascriptBridge.callHandler(
            'readLabel',
            '',
            (responseData)=>{
              if(responseData.indexOf('失败') !== -1){
                clearInterval(this.sensorID)
                this.$message.error(responseData)
                this.isSensor = false
                this.codeText = ''
                this.placeholder = '请开启感应器获取数据'
              }else{
                this.$message.success('读取成功')
                this.codeText = responseData
                this.placeholder = '请开启感应器获取数据'
                // 控制扫码状态  单次扫描||轮询扫描
                this.isSensor = false
                clearInterval(this.sensorID)
              }
            }
          )
        }, 500);
      } catch (error) {
        clearInterval(this.sensorID)
        this.errorData = error
        this.isSensor = false
        this.placeholder = '请开启感应器获取数据'
        console.log('请在客户端使用', error)
        this.$message.warning('请在客户端使用该感应器功能')
      }
    }
  },
  emitHasDone() {
    this.$emit('has-done')
  }
}
}
</script>

<style lang="scss" scoped>
.scanClearStyle {
width: 16px;
height: 30px;
margin-right: 5px;
object-fit: contain;
position: absolute;
left: -21px;
}
.scanImgStyle {
width: 30px;
height: 30px;
object-fit: contain;
}
.scan-input ::v-deep {
.el-input-group__append {
  padding-left: 0;
}
input {
  padding: 0 8px;
}
}
::v-deep .el-input-group__append{
border: none !important;
background-color: transparent;
}
</style>
