<!--留档文档-->
<template>
  <el-form
    ref="detailForm"
    :model="detailForm"
    class="growth-record"
    inline
    :disabled="$route.query.view"
  >
    <el-card>
      <div class="headLine">
        <div class="headLine-title required">留档文档记录</div>
      </div>
      <div class="growth-section">
        <el-form-item
          :rules="[
            {
              required: true,
              message: '留档文档记录不能为空',
              trigger: 'change',
            },
          ]"
          prop="_files"
        >
          <PhotoRemarkNew
            v-model="detailForm._files"
            :componentDisabled="false"
            :name="'CHECK_DEVICE'"
            @input="handleFileChange"
          />
        </el-form-item>
      </div>
    </el-card>
  </el-form>
</template>

<script>
import PhotoRemarkNew from "@/views/components/photoRemarkNew";

export default {
  name: "TabFile",
  props: {
    stepData: {
      type: Array | null,
      default() {
        return [];
      },
    },
  },
  components: {
    PhotoRemarkNew,
  },
  data() {
    return {
      detailForm: {
        _files: [],
      },
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.detailForm._files = (this.stepData[0].files || []).map(
        (fileItem) => ({
          ...fileItem,
          big_url: fileItem.fileUrl,
          thumb_url: fileItem.fileUrl,
        })
      );
    },
    handleFileChange() {
      this.$refs.detailForm.validate();
      const files = (this.detailForm._files || []).map(
        ({ big_url, thumb_url, ...item }) => ({
          ...item,
          fileUrl: big_url,
        })
      );
      this.$set(this.stepData[0], "files", files);
    },
    async valid() {
      let allValid = true;
      try {
        await this.$refs.detailForm.validate();
      } catch (err) {
        this.$message.warning("留档文档未填写完整");
        allValid = false;
      }
      return allValid;
    },
  },
};
</script>

<style scoped>
.required::before {
  content: "*";
  color: red;
  margin-right: 5px;
}
</style>
