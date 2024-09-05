<!--单晶异常-->
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
        <div class="headLine-title">异常记录录入</div>
      </div>
      <div class="growth-section">
        <div class="card-list-container">
          <div
            v-for="(formItem, formItemIdx) in detailForm.list"
            :key="formItemIdx"
            class="card-list-wrap"
            :style="{ order: recordIndexMap[formItem.stepAndRecord] }"
          >
            <div class="card-list">
              <div class="card-list-title card-list-header">
                <el-tag size="mini">{{
                  recordIndexMap[formItem.stepAndRecord] + 1
                }}</el-tag>
                <el-select
                  v-model="formItem.stepAndRecord"
                  style="width: 200px"
                  @change="handleStepRecordChange($event, formItemIdx)"
                >
                  <el-option
                    v-for="item in stepRecordList"
                    :key="item.id"
                    :value="item.stepAndRecord"
                    :disabled="selectedRecord[item.stepAndRecord]"
                  />
                </el-select>
                <el-date-picker
                  v-model="formItem.errorTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  @change="updateErrorTime($event, formItemIdx)"
                />
              </div>
              <div class="card-list-tip">
                <i
                  class="el-icon-error delete-icon"
                  @click="handleDelete(formItemIdx)"
                />
              </div>
            </div>
            <div>
              <el-form-item label="单晶异常" class="error-form">
                <el-select
                  v-model="formItem._errors"
                  multiple
                  filterable
                  allow-create
                  default-first-option
                  clearable
                  placeholder="填写或选择"
                  @change="(val) => updateErrors(val, formItemIdx)"
                >
                  <span class="tip">填写后按下回车键即可添加</span>
                  <el-option
                    v-for="item in currentCrystalGrowthErrList"
                    :key="item.id"
                    :value="item.value"
                    :label="item.value"
                    :disabled="
                      (formItem._errors.includes('无') && item.value != '无') ||
                      (!formItem._errors.includes('无') &&
                        formItem._errors.length > 0 &&
                        item.value === '无')
                    "
                  />
                </el-select>
              </el-form-item>
            </div>
          </div>
        </div>

        <el-button
          class="block-btn"
          type="primary"
          plain
          @click="handleIncrease"
          ><i class="el-icon-plus" />添加异常记录</el-button
        >
      </div>
    </el-card>
  </el-form>
</template>

<script>
import moment from "moment";
import { cloneDeep } from "lodash-es";

export default {
  name: "TabError",
  props: {
    steps: {
      type: Array | null,
      default() {
        return {};
      },
    },
    stepNameList: Array,
    crystalGrowthErrList: Array,
  },
  data() {
    return {
      detailForm: {
        list: [],
      },
      stepRecordList: [],
    };
  },
  computed: {
    selectedRecord() {
      const selected = {};
      this.detailForm.list.forEach(
        ({ stepAndRecord }) => (selected[stepAndRecord] = true)
      );
      return selected;
    },
    recordIndexMap() {
      let map = {};
      let list = cloneDeep(this.detailForm.list);
      list
        .sort((a, b) => {
          if (!a.errorTime) return 1;
          if (!b.errorTime) return -1;
          let aTime = moment(a.errorTime).valueOf();
          let bTime = moment(b.errorTime).valueOf();
          return aTime - bTime;
        })
        .forEach((item, index) => {
          map[item.stepAndRecord] = index;
        });
      return map;
    },
    currentCrystalGrowthErrList() {
      let map = {};
      this.crystalGrowthErrList.forEach((item) => {
        map[item.value] = item;
      });
      return Object.values(map);
    },
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.detailForm.list = [];
      this.stepRecordList = [];
      this.stepNameList.forEach((stepName) => {
        if (!this.steps[stepName]) return;
        this.steps[stepName].forEach((recordItem, recordIdx) => {
          const { _errors, errorTime } = recordItem;
          const stepAndRecord = stepName + " - 记录" + (recordIdx + 1);
          const option = {
            stepName,
            recordIdx,
            stepAndRecord,
            errorTime,
          };
          this.stepRecordList.push(option);
          if (!_errors || !_errors.length) return;
          this.detailForm.list.push({
            ...option,
            _errors,
          });
        });
      });
    },
    handleIncrease() {
      this.detailForm.list.push({
        stepName: null,
        recordIdx: null,
        errorTime: null,
        _errors: [],
      });
    },
    handleStepRecordChange(stepAndRecord, formItemIdx) {
      const matched = this.stepRecordList.find(
        (item) => item.stepAndRecord === stepAndRecord
      );
      if (!matched) return;
      this.detailForm.list[formItemIdx].recordIdx = matched.recordIdx;
      this.detailForm.list[formItemIdx].stepName = matched.stepName;
      this.detailForm.list[formItemIdx].errorTime = matched.errorTime;
    },
    handleDelete(formItemIdx) {
      const { stepName, recordIdx } = this.detailForm.list[formItemIdx];
      if (stepName && typeof recordIdx === "number") {
        this.$set(this.steps[stepName][recordIdx], "_errors", []);
      }
      this.detailForm.list.splice(formItemIdx, 1);
    },
    updateErrors(errors, formItemIdx) {
      if ((errors || []).includes("无")) {
        const { stepName, recordIdx } = this.detailForm.list[formItemIdx];
        this.$set(this.detailForm.list[formItemIdx], "errorTime", null);
        stepName &&
          this.$set(this.steps[stepName][recordIdx], "errorTime", null);
      }
      this.detailForm.list.forEach(({ stepName, recordIdx, _errors }) => {
        if (!stepName || !_errors || !_errors.length) return;
        this.$set(this.steps[stepName][recordIdx], "_errors", _errors);
        this.$set(this.steps[stepName][recordIdx], "_showErrors", true);
      });
    },
    updateErrorTime() {
      this.detailForm.list.forEach(({ stepName, recordIdx, errorTime }) => {
        if (!stepName) return;
        this.$set(this.steps[stepName][recordIdx], "errorTime", errorTime);
      });
    },
  },
};
</script>

<style scoped>
.error-form {
  width: 100% !important;
  margin-bottom: 0;
}

.card-list-container {
  display: flex;
  flex-direction: column;
}

.card-list-header {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
