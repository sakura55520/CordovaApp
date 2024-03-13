<!--打印弹窗组件-->
<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="浏览标签"
    width="95%"
    top="5vh"
  >
    <div class="print-wrap">
      <el-image v-for="(src,index) in printList" :key="index" :src="src">
        <div slot="error" class="image-slot">
          <i class="el-icon-picture-outline" style="font-size: 40px"></i>
        </div>
      </el-image>
    </div>

    <el-form>
      <el-form-item label="打印车间">
        <el-radio-group v-model="documentMould">
          <el-radio v-for="item in documentMouldList" :label="item.documentMould" :key="item.documentMould">{{ item.workshop }}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button class="save" @click="dialogVisible=false">取 消</el-button>
      <el-button class="submit" type="primary" @click="confirmPrint">打印标签</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {print} from "@/api/screen/screen";

export default {
  name: 'PrintDialog',
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    // 打印预览的图片集合
    printList: {
      type: Array,
      require: true
    },
    // 调用打印接口的传参
    // 如果是数组, 则循环调用打印接口
    printData: {
      type: Object | Array,
      require: true
    },
    // 显示隐藏 打印份数
    numVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      documentMould: '',
      documentMouldList: [
        // 车间             打印模版名称
        { workshop: '籽晶', documentMould: '籽晶粘贴-来料检条码' },
        { workshop: '合成', documentMould: '合成车间-来料检条码' },
        { workshop: '清洗', documentMould: '清洗车间-来料检条码' },
        { workshop: '坩埚', documentMould: '坩埚车间-来料检条码' },
        { workshop: '办公室', documentMould: '办公室-来料检条码' },
      ]
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set(visible) {
        this.$emit('update:visible', visible)
      }
    }
  },
  watch: {
    dialogVisible(visible) {
      if (visible) {
        this.init()
      } else {
        this.$emit('handle-close')
      }
    }
  },
  methods: {
    init() {
      this.documentMould = ''
    },
    confirmPrint() {
      if (!this.printData) return this.$message('打印接口的传参为空!')
      if (!this.documentMould) return this.$message('请选择打印车间!')
      const data = this.printData
      print({
        ...data,
        documentMould: this.documentMould
      }).then(this.handleSuccess)
    },
    handleSuccess() {
      this.$message.success('正在打印标签...')
    }
  }
}
</script>
<style lang="scss" scoped>
.print-wrap {
  max-height: calc(100vh - 300px);
  margin-bottom: 20px;
  overflow-y: auto;
}
</style>
