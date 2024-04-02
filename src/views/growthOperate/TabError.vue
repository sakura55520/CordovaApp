<!--单晶异常-->
<template>
  <el-form
    ref="detailForm"
    :model="detailForm"
    class="growth-record"
    inline
  >
    <el-card>
      <div class="headLine">
        <div class="headLine-title">异常记录录入</div>
      </div>
      <div class="growth-section">
        <div v-for="(formItem, formItemIdx) in detailForm.list" :key="formItemIdx" class="card-list-wrap">
          <div class="card-list">
            <div class="card-list-title">
              <el-tag size="mini">{{ formItemIdx+1 }}</el-tag>
              <el-select v-model="formItem.stepAndRecord" style="width: 200px;" @change="handleStepRecordChange($event, formItemIdx)">
                <el-option v-for="item in stepRecordList" :key="item.id" :value="item.stepAndRecord" :disabled="selectedRecord[item.stepAndRecord]"/>
              </el-select>
            </div>
            <div class="card-list-tip">
              <i class="el-icon-error delete-icon" @click="handleDelete(formItemIdx)"/>
            </div>
          </div>
          <div>
            <el-form-item label="单晶异常" class="error-form">
              <el-select v-model="formItem._errors" multiple clearable @change="updateErrors">
                <el-option v-for="item in crystalGrowthErrList" :key="item.id" :value="item.value" :label="item.label"/>
              </el-select>
            </el-form-item>
          </div>
        </div>

        <el-button class="block-btn" type="primary" plain @click="handleIncrease"><i class="el-icon-plus"/>添加异常记录</el-button>
      </div>
    </el-card>
  </el-form>
</template>

<script>


export default {
  name: 'TabError',
  props: {
    steps: {
      type: Array | null,
      default() {
        return {}
      }
    },
    stepNameList: Array,
    crystalGrowthErrList: Array
  },
  data() {
    return {
      detailForm: {
        list: [],
      },
      stepRecordList: [],
    }
  },
  computed: {
    selectedRecord() {
      const selected = {}
      this.detailForm.list.forEach(({ stepAndRecord }) => selected[stepAndRecord] = true)
      return selected
    }
  },
  methods: {
    init() {
      this.detailForm.list = []
      this.stepRecordList = []
      this.stepNameList.forEach(stepName => {
        if (!this.steps[stepName]) return
        this.steps[stepName].forEach((recordItem, recordIdx) => {
          const { _errors } = recordItem
          const stepAndRecord = stepName + ' - 记录' + (recordIdx + 1)
          const option = {
            stepName,
            recordIdx,
            stepAndRecord,
          }
          this.stepRecordList.push(option)
          if (!_errors || !_errors.length) return
          this.detailForm.list.push({
            ...option,
            _errors
          })
        })
      })
    },
    handleIncrease() {
      this.detailForm.list.push({
        stepName: null,
        recordIdx: null,
        _errors: []
      })
    },
    handleStepRecordChange(stepAndRecord, formItemIdx) {
      const matched = this.stepRecordList.find(item => item.stepAndRecord === stepAndRecord)
      if (!matched) return
      this.detailForm.list[formItemIdx].recordIdx = matched.recordIdx
      this.detailForm.list[formItemIdx].stepName = matched.stepName
    },
    handleDelete(formItemIdx) {
      const { stepName, recordIdx } = this.detailForm.list[formItemIdx]
      if (stepName && typeof recordIdx === 'number') {
        this.$set(this.steps[stepName][recordIdx], '_errors', [])
      }
      this.detailForm.list.splice(formItemIdx, 1)
    },
    updateErrors() {
      this.detailForm.list.forEach(({ stepName, recordIdx, _errors }) => {
        if (!stepName || !_errors || !_errors.length) return
        this.$set(this.steps[stepName][recordIdx], '_errors', _errors)
        this.$set(this.steps[stepName][recordIdx], '_showErrors', true)
      })
    }
  }
}
</script>

<style scoped>
.error-form {
  width: 100% !important;
  margin-bottom: 0;
}
</style>
