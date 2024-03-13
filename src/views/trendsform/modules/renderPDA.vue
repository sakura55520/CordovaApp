<template>
  <div v-if="componentData.ComponentConfig" :style="componentData.style">
    <!-- {{showData}} -->
    <!-- 描述列表 -->
    <template v-if="componentData.tag === 'el-descriptions'">
      <component :is="componentData.tag" v-bind="componentData.ComponentConfig">
          <component v-for="(item,index) in componentData.ComponentConfig.childrenConfig" :key="index" :is="'el-descriptions-item'" v-bind="item">{{ item.value || item.defaultValue }}</component>
      </component>
    </template>
    <!-- 扫码组件 -->
    <template v-if="componentData.tag === 'CodeScanner'">
      <component :is="componentData.tag" v-bind="componentData.ComponentConfig" v-model="formObj[componentData.vModel]"/>
    </template>
    <!-- 磁卡感应器组件 -->
    <template v-if="componentData.tag === 'NFCSensor'">
      <component :is="componentData.tag" v-bind="componentData.ComponentConfig" v-model="formObj[componentData.vModel]"/>
    </template>
  </div>
</template>

<script>
import CodeScanner from './CodeScanner.vue';
import NFCSensor from './nfcSensor.vue';

// import testRequest from '@/utils/testRequest'
import request from '@/utils/req'



export default {
  components: {
    CodeScanner,
    NFCSensor
  },
  props: {
    // 用来判断是填写表单还是设计表单操作， designForm为设计表单, fillForm为填写表单
    componentData: {
      type: Object,
      default(){
        return {}
      }
    },
    isGetData: {
      type: Boolean,
      default: false
    },
    params:{
      type: Object,
      default(){
        return {}
      }
    },
    formObj:{
      type: Object,
      default(){
        return {}
      }
    }
  },
  data() {
    return {
      myParams:{},
      showData:{a:'1'}
    }
  },
  created() {
  },
  watch: {
  },
  mounted() {
    this.getData()
  },
  methods: {
    fetchData(url,method,params) {
      this.showData = {
        url,
        method,
        params
      }
      return request({
        url,
        method,
        params
      })
    },
    getData(){
      if(!(this.componentData.tag === 'el-descriptions' && this.isGetData)) return
      this.myParams = {
        processingOrderCode:this.params.processingOrderCode
      }
      if(!Array.isArray(this.componentData.ComponentConfig.urlParams)){
        this.$set(this.componentData.ComponentConfig,'urlParams',[])
      }
      this.componentData.ComponentConfig.urlParams.forEach(item => {
        this.myParams[item.paramsName] = item.paramsValue
      });
      this.fetchData(this.componentData.ComponentConfig.apiUrl,'get',this.myParams).then(res=>{
        console.log(this.componentData,'this.componentData.ComponentConfig.childrenConfig');
        this.componentData.ComponentConfig.childrenConfig.forEach((item,index)=>{
          this.$set(this.componentData.ComponentConfig.childrenConfig[index], 'value',res.data[item.vModel] || '')
        })
      })
    }
  }
}
</script>

<style lang='scss'>

</style>