<!--
 组件名: 弹框输入框
-->
<template>
  <div>
    <el-input v-trim v-model.trim="inputText" :type="type" @focus="focus" :placeholder="placeholder"/>
    <el-dialog :visible.sync="dialogFormVisible" :title="title" width="640px">
      <el-input
        type="textarea"
        autofocus
        ref="input_textarea"
        :autosize="{ minRows: 10, maxRows: 10}"
        placeholder="请输入内容"
        v-model="dialogText"/>
      <div slot="footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveText">确 定</el-button>
    </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'DialogInput',
  props: {
    value: {
      required: true,
      type: String | undefined | null
    },
    type: {
      default:''
    },
    title: {
      type:String,
      default:''
    },
    placeholder: {
      default: '点击录入',
      type: String
    }
  },
  data(){
    return {
      dialogFormVisible:false,
      dialogText:''
    }
  },
  computed: {
    inputText: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
    //保存数据
    saveText(){
      this.inputText = this.dialogText
      this.dialogFormVisible = false
    },
    focus(){
      this.dialogFormVisible = true
      this.$nextTick(()=>this.$refs.input_textarea.focus())
    }
  }
}
</script>
