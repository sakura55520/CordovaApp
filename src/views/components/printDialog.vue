<!--打印弹窗组件-->
<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="浏览标签"
    width="95%"
    top="5vh"
    append-to-body
  >
    <div class="print-wrap">
      <el-image v-for="(src,index) in printList" :key="index" :src="src">
        <div slot="error" class="image-slot">
          <i class="el-icon-picture-outline" style="font-size: 40px"></i>
        </div>
      </el-image>
    </div>

    <el-form v-if="numVisible">
      <el-form-item label="打印份数">
        <el-input-number v-model="printNum" :min="1" :max="20" @focus="$event.target.select()"/>
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
      printNum: 1
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
        this.$emit('handleData')
      }
    }
  },
  methods: {
    init() {
      this.printNum = this.printData.printNum || 1
    },
    confirmPrint() {
      if (!this.printData) return this.$message('打印接口的传参为空!')
      if (Array.isArray(this.printData)) {
        // 循环调用打印接口
        const promises = this.printData.map(data => print({
          ...data,
          printNum: this.numVisible ? this.printNum : data.printNum
        }))
        Promise.all(promises).then(this.handleSuccess)
      } else {
        const data = this.printData
        print({
          ...data,
          printNum: this.numVisible ? this.printNum : data.printNum
        }).then(this.handleSuccess)
      }
    },
    handleSuccess() {
      this.$message.success('正在打印标签...')
      // this.dialogVisible = false
      // this.$emit('handleData');
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
