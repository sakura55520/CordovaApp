<!--
 组件名: 扫码组件
  1.使用防抖响应input事件
  2.回调事件是: 'has-done'
-->
<template>
  <div style="display: flex;">
    <el-input v-trim v-model.trim="codeText" :placeholder="placeholder" clearable v-on="$listeners" class="scan-input" @input.native="debounceInput" @keyup.enter.native="emitHasDone" @clear="emitClear">
      <!-- <div v-if="codeText" slot="append">
        <img  src="../assets/imgs/icon-del.png" class="scanClearStyle" @click="codeText=''" />
      </div> -->
    </el-input>
    <el-button type="primary" size="mini" style="margin-left: 5px;" @click="sweepCode">
      <div style="display: flex;">
        <svg-icon icon-class="scan" style="width: 20px; height: 20px;"/>
        <div style="font-size: 16px;line-height: 22px;margin:0 5px;">{{ label }}</div>
      </div>
    </el-button>
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
  },
  placeholder: {
    default: '请扫码',
    type: String
  },
  label: {
    default: '扫码',
    type: String
  },
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
created() {
  this.debounceInput = debounce(this.emitHasDone, 1000)
},
beforeDestory() {
  this.debounceInput = null
},
methods: {
  sweepCode() {
    try {
      cordova.plugins.gizscanqrcode.scan(
        {
          'baseColor': '#4e8dec',             // (边框、按钮、导航栏等背景颜色，优先级最低，单独设置可覆盖)

            // bar
          'title': '扫码',                 // (标题文字)
          'barColor': '4e8dec',               // (导航栏颜色)
          'statusBarColor': 'white',          // (状态栏字体颜色 white为白，不填为默认)

            // describe string
          'describe': '扫二维码/条码',            // (提示用户文字，支持 \n 换行，多行文字需注意小屏幕设备适配问题)
          'describeFontSize': '15',          // (字体大小)
          'describeLineSpacing': '8',        // (行间距)
          'describeColor': 'ffffff',         // (文字颜色)

            // scan border
          'borderColor': '4e8dec',           // (扫描框颜色)
          'borderScale': '0.6',              // (边框大小，0.1 ~ 1)

            // choose photo button
          'choosePhotoEnable': 'true',       // (支持相册选取, 默认false)
          'choosePhotoBtnTitle': '相册',      // (选取按钮文字)
          'choosePhotoBtnColor': '4e8dec',   // (选取按钮颜色)

            // flashlight
          'flashlightEnable': 'false'         // (支持手电筒, 默认false)
        },
          (res) => {
            /*
            * callback:
            {"resultCode": "Int",//(0: unknown; 1: success; 2: error; 3: cancel)
             "result": "String" //( QR code(success); reason(error); cancel(cancel) )
            }
            * */
            const { resultCode, result } = JSON.parse(res)
            // alert(typeof resultCode)
            // alert(resultCode)
            if (resultCode === 1) {
              this.codeText = result
              this.emitHasDone()
            } else {
              this.$message.info('请重新扫码!')
            }
          },
          (error) => {
            console.log(error) // 原因
            // alert(JSON.stringify(error))
          }
      )
    } catch (e) {
      console.log('请在客户端使用', e)
    }
  },
  emitHasDone() {
    this.$emit('has-done')
  },
  emitClear(){
    this.$emit('clear')
  }
}
}
</script>

<style lang="scss" scoped>
.scanClearStyle {
width: 16px;
height: 20px;
margin-right: 5px;
object-fit: contain;
position: absolute;
left: -21px;
}
.scanImgStyle {
width: 50px;
height: 22px;
object-fit: contain;
}
.scan-input /deep/ {
.el-input-group__append {
  padding-left: 0;
}
input {
  padding: 0 8px;
}
}
.scan-input >>> .el-input-group__append {
display: inline-flexbox;
padding: 0px;
align-items: center;
justify-content: start;
width: 50px;
background-color: #FFF;
}
</style>
