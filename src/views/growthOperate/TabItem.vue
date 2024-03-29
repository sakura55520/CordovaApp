<!--工步表单内容-->
<template>
  <el-collapse v-model="activeCollapse">
    <el-collapse-item
      v-for="(recordItem, recordIdx) in stepData"
      :title="stepName + '记录' + (recordIdx + 1)"
      :name="String(recordIdx)"
      :key="recordIdx"
    >
      <el-form
        ref="detailForm"
        :model="detailForm"
        class="growth-record"
        label-width="140px"
        inline
      >
        <!--   其余参数     -->
        <el-card v-if="Array.isArray(recordItem.exts) && recordItem.exts.length">
          <div class="growth-section">
            <el-form-item v-for="(formItem, formItemIdx) in recordItem.exts" :key="formItemIdx" :label="formItem.extKey">
              <Render
                :key="formItem.renderKey"
                :conf="formItem"
                field="extValue"
                @input="handleExtsInput($event, recordIdx, formItemIdx)"
              />
            </el-form-item>
          </div>
        </el-card>

        <!--   点检项确认     -->
        <el-card v-if="Array.isArray(recordItem.checks) && recordItem.checks.length">
          <div class="headLine">
            <div class="headLine-title">点检项确认</div>
          </div>
          <div class="growth-section">
            <div v-for="(formItem, index) in recordItem.checks" :key="index">
              <el-form-item :label="formItem.checkItem" class="check-item" label-width="auto">
                <el-radio-group v-model="formItem.isError">
                  <el-radio :label="true">正常</el-radio>
                  <el-radio :label="false">异常</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item v-if="formItem.isError === false" label="异常备注">
                <el-input v-model="formItem.errorMessage" type="textarea" placeholder="请输入异常描述及处理建议"/>
              </el-form-item>
            </div>
          </div>
        </el-card>

        <!--   设备/工艺参数确认     -->
        <el-card v-if="Array.isArray(recordItem.techs) && recordItem.techs.length">
          <div class="headLine">
            <div class="headLine-title">设备/工艺参数确认</div>
          </div>
          <div class="growth-section">
            <el-form-item v-for="(formItem, formItemIdx) in recordItem.techs" :key="formItemIdx" :label="formItem.extKey">
              <Render
                :key="formItem.renderKey"
                :conf="formItem"
                field="extValue"
                @input="handleTechsInput($event, recordIdx, formItemIdx)"
                />
            </el-form-item>
          </div>
        </el-card>



      </el-form>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
import SelectUserinfo from '@/components/select_userinfo.vue'
import { fetchModelForm } from '@/api/modelform'
import Render from '@/components/renderForm/render.vue'

export default {
  name: 'TabItem',
  components: {
    SelectUserinfo,
    Render
  },
  props: {
    stepData: {
      type: Array | null,
      default() {
        return []
      }
    },
    stepName: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      detailForm: {},
      activeCollapse: ['0'],
    }
  },
  created() {
    this.activeCollapse = ['0']
  },
  methods: {
    handleExtsInput(event, recordIdx, formItemIdx) {
      this.$set(this.stepData[recordIdx].exts[formItemIdx], 'extValue', event)
    },
    handleTechsInput(event, recordIdx, formItemIdx) {
      this.$set(this.stepData[recordIdx].techs[formItemIdx], 'extValue', event)
    }
  }
}
</script>


<style scoped lang="scss">

</style>
