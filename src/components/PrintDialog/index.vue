<!--弹窗: 打印组件-->
<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="打印预览"
    width="95%"
    top="5vh"
    append-to-body
  >
    <div class="print-wrap">
      <el-image v-for="(src, index) in imgList" :key="index" :src="src">
        <div slot="error" class="image-slot">
          <i class="el-icon-picture-outline" style="font-size: 40px"></i>
        </div>
      </el-image>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-form>
        <el-form-item label="打印机区域">
          <el-select
            v-model="documentMould"
            filterable
            @change="preview"
            clearable
          >
            <el-option
              v-for="(item, index) in documentMoulds"
              :key="index"
              :label="item.documentMould"
              :value="item.documentMould"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="打印份数">
          <el-input-number
            v-model="printNum"
            :min="1"
            :max="20"
            @focus="$event.target.select()"
          />
        </el-form-item>
      </el-form>
      <el-button class="save" @click="dialogVisible = false">取 消</el-button>
      <el-button
        class="submit"
        type="primary"
        @click="confirmPrint"
        v-if="documentMould"
        >打印标签</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import * as Api from "@/api/billPrint";

export default {
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    // 打印类型
    printType: String,
    // 调用打印接口的传参
    // 如果是数组, 则循环调用打印接口
    printData: {
      type: Object | Array,
      require: true,
    },
  },
  data() {
    return {
      imgList: [],
      printNum: 1,
      documentMould: null,
      documentMoulds: [],
    };
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible;
      },
      set(visible) {
        this.$emit("update:visible", visible);
      },
    },
  },
  watch: {
    dialogVisible(visible) {
      if (visible) {
        this.init();
      } else {
        this.$emit("handleData");
      }
    },
  },
  methods: {
    init() {
      this.fetchDocumentMoulds();
      this.printNum = this.printData.printNum || 1;
      this.imgList = [];
      this.documentMould = null;
    },
    fetchDocumentMoulds() {
      Api.fetchAllDocumentMould({
        search_EQ_printType: this.printType,
      }).then((res) => {
        this.documentMoulds = res.data;
      });
    },
    async preview() {
      this.imgList = [];
      if (!this.documentMould) return;
      if (Array.isArray(this.printData)) {
        for (let i = 0; i < this.printData.length; i++) {
          await this.postPreview(this.printData[i]);
        }
      } else {
        this.postPreview(this.printData);
      }
    },
    postPreview(data) {
      return Api.docketPrintPreview({
        data: data.data, // 打印基础信息
        type: 1, // 执行类型：0：不填充数据，1：填充数据
        printNum: 1, // 打印份数
        documentMould: this.documentMould,
      }).then((res) => {
        if (!res.data) return $message.error("暂无预览数据");
        if (Array.isArray(res.data) && res.data.length) {
          this.imgList.push(...res.data);
        }
      });
    },
    confirmPrint() {
      if (Array.isArray(this.printData)) {
        const promises = this.printData.map(this.postPrint);
        Promise.all(promises).then(this.handlePrintRes);
      } else {
        this.postPrint(this.printData).then(this.handlePrintRes);
      }
    },
    postPrint(data) {
      return Api.docketPrint({
        data: data.data, // 打印基础信息
        type: 1, // 执行类型：0：不填充数据，1：填充数据
        printNum: this.printNum, // 打印份数
        documentMould: this.documentMould,
      });
    },
    handlePrintRes() {
      this.$message.success("正在打印标签...");
      this.dialogVisible = false;
      this.$emit("has-finished");
    },
  },
};
</script>
<style lang="scss" scoped>
.print-wrap {
  max-height: calc(100vh - 300px);
  margin-bottom: 20px;
  overflow-y: auto;
}
</style>
