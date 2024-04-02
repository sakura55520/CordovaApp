<!--留档文档-->
<template>
  <el-form
    ref="detailForm"
    :model="detailForm"
    class="growth-record"
    inline
  >
    <el-card>
      <div class="headLine">
        <div class="headLine-title">留档文档记录</div>
      </div>
      <div class="growth-section">
        <PhotoNew
          v-model="detailForm._files"
          :componentDisabled="false"
          :name="'CHECK_DEVICE'"
          @input="handleFileChange"
        />
      </div>
    </el-card>
  </el-form>
</template>

<script>
import PhotoNew from '@/views/components/photoNew'

export default {
  name: 'TabFile',
  props: {
    stepData: {
      type: Array | null,
      default() {
        return []
      }
    },
  },
  components: {
    PhotoNew,
  },
  data() {
    return {
      detailForm: {
        _files: []
      },
    }
  },
  methods: {
    init() {
      if (!this.steps['留档文档']) {
        this.$set(this.steps, '留档文档', [{ fiels: [] }])
      }
      this.detailForm._files = this.stepData[0].files.map(fileItem => ({
        ...fileItem,
        big_url: fileItem.fileUrl,
        thumb_url: fileItem.fileUrl,
      }))
    },
    handleFileChange() {
      const files = (this.detailForm._files || []).map(({ big_url, thumb_url, ...item }) => ({
        ...item,
        fileUrl: big_url
      }))
      this.$set(this.stepData[0], 'files', files)
    }
  }
}
</script>

<style scoped>

</style>
