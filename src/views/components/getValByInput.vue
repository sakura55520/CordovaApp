<!--
 组件名: 获取数据输入框
-->
<template v-if="refModel && paramName">
  <el-input v-trim v-model="refModel[paramName]" :type="type" :placeholder="placeholder" @input="$emit('input')" @change="$emit('change',refModel[paramName])">
    <template slot="append"><span @click="getVal" style="color: #409eff !important;cursor: pointer;">获取</span></template>
  </el-input>
</template>

<script>
import { regPositiveNumber } from "@/utils/tool.js";

export default {
  props: {
    refModel:{
      type: Object,
      require:true,
      default:()=>{}
    },
    type: {
      default:''
    },
    disabled:{
      type:Boolean,
      default:false
    },
    placeholder: {
      default: '请填写或点击获取',
      type: String
    },
    paramName:{
      type:String,
      require:true
    }
  },
  computed: {
  },
  data(){
    return {
      regPositiveNumber,
    }
  },
  methods: {
    //获取数据
    getVal(){
      let num = Math.random()
      num = Number(num.toFixed(1))
      this.$set(this.refModel,this.paramName,num)
      this.$emit('change',this.refModel[this.paramName])
    }
  }
}
</script>
