<template>
  <div>
    <el-dialog
      :title="'查看打印标签'"
      :visible.sync="dialogVisible"
      width="80%"
      class="black-dialog print-dialog"
      :before-close="handleClose">
      <el-image v-for="(src,index) in dialogForm.tplSrc" :key="index" :src="src">
        <div slot="error" class="image-slot">
          <i class="el-icon-picture-outline" style="font-size: 40px"></i>
        </div>
      </el-image>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submitData">打印</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import * as Api from "@/api/boil/boil.js";


export default {
  components: {
  },
  props: {
    dialogVisible: {
      type: Boolean,
      required: true
    },
    // 修改父组件数据
    changeParentData: {
      type: Function,
      required: true
    },
    dialogForm:{
      type: Object,
      require: true,
      default:()=>{}
    },
  },
  data() {
    return {
      
    }
  },
  computed: {

  },
  watch: {

  },
  created() {

  },
  mounted() {
  },
  methods: {
    submitData() {
      this.$emit('submit')
    },
    handleClose() {
      this.changeParentData('previewDialogVisible', false)
      this.$emit('close')
    },
  }
}
</script>

<style scoped lang="scss">

</style>
