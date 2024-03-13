<!--
 组件名: 获取数据输入框
-->
<template>
  <el-input v-trim v-model.trim="codeText" :type="type" :placeholder="placeholder">
<!--    <template slot="append" @click="getVal">获取</template>-->
  </el-input>
</template>

<script>
export default {
  name: 'ObtainInput',
  props: {
    value: {
      required: true,
      type: String | undefined | null
    },
    type: {
      default:''
    },
    placeholder: {
      default: '请填写或点击获取',
      type: String
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
  methods: {
    //获取数据
    getVal(){

    }
  }
}
</script>
