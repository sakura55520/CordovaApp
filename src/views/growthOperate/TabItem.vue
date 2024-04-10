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
        :disabled="$route.query.view"
      >
        <!--   其余参数     -->
        <el-card v-if="Array.isArray(recordItem.exts) && recordItem.exts.length">
          <div class="growth-section">
            <el-form-item v-for="(formItem, formItemIdx) in recordItem.exts" :key="formItemIdx" :label="formItem.label">
              <Render
                :key="formItem.renderKey"
                :conf="formItem"
                :prop-value="/^field/.test(formItem.vModel) ? formItem.extValue : recordItem[formItem.vModel]"
                @input="handleExtsInput($event, recordIdx, formItemIdx, formItem.vModel)"
              />
            </el-form-item>

            <el-form-item v-if="recordItem._showErrors" class="block-form-item" label="单晶异常">
              <el-select v-model="recordItem._errors" multiple clearable>
                <el-option v-for="item in crystalGrowthErrList" :key="item.id" :value="item.value" :label="item.label"/>
              </el-select>
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
              <el-form-item :label="formItem.label" class="check-item">
                <el-radio-group v-model="formItem.isError">
                  <el-radio :label="false">正常</el-radio>
                  <el-radio :label="true">异常</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item v-if="formItem.isError" label="异常备注">
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
            <el-form-item v-for="(formItem, formItemIdx) in recordItem.techs" :key="formItemIdx" :label="formItem.label">
              <Render
                :key="formItem.renderKey"
                :conf="formItem"
                :prop-value="formItem.extValue"
                @input="handleTechsInput($event, recordIdx, formItemIdx)"
                />
            </el-form-item>
          </div>
        </el-card>

      </el-form>
    </el-collapse-item>

    <el-button v-if="canAddRecord" class="block-btn" type="primary" plain @click="handleIncrease"><i class="el-icon-plus"/>添加{{ stepName }}记录</el-button>
  </el-collapse>
</template>

<script>
import Render from '@/components/renderForm/render.vue'

export default {
  name: 'TabItem',
  components: {
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
    },
    canAddRecord: {
      type: Boolean,
      required: true
    },
    crystalGrowthErrList: Array
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
    handleExtsInput(event, recordIdx, formItemIdx, vModel) {
      if (/^field/.test(vModel)) {
        this.$set(this.stepData[recordIdx].exts[formItemIdx], 'extValue', event)
      } else {
        this.$set(this.stepData[recordIdx], vModel, event)
      }
    },
    handleTechsInput(event, recordIdx, formItemIdx) {
      this.$set(this.stepData[recordIdx].techs[formItemIdx], 'extValue', event)
    },
    handleIncrease() {
      const stepData = JSON.parse(JSON.stringify(this.stepData._defaultStepData))
      stepData.userCreate = this.$store.getters.realName
      this.stepData.push(stepData)
      this.$message.success(`已添加【${this.stepName}记录${this.stepData.length}】! `)
    }
  }
}
</script>
