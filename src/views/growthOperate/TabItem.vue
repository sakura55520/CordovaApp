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
        ref="recordItem"
        :model="recordItem"
        class="growth-record"
        label-width="140px"
        inline
        :disabled="$route.query.view"
      >
        <!--   其余参数     -->
        <el-card
          v-if="Array.isArray(recordItem.exts) && recordItem.exts.length"
        >
          <div class="growth-section">
            <el-form-item
              v-for="(formItem, formItemIdx) in recordItem.exts"
              :key="formItemIdx"
              :label="formItem.label"
            >
              <Render
                :key="formItem.renderKey"
                :conf="formItem"
                :prop-value="
                  /^field/.test(formItem.vModel)
                    ? formItem.extValue
                    : recordItem[formItem.vModel]
                "
                @input="
                  handleExtsInput(
                    $event,
                    recordIdx,
                    formItemIdx,
                    formItem.vModel
                  )
                "
              />
            </el-form-item>

            <el-form-item
              v-if="recordItem._showErrors"
              class="block-form-item"
              label="单晶异常"
            >
              <el-select v-model="recordItem._errors" multiple filterable allow-create default-first-option clearable placeholder="填写或选择">
                <span class="tip">填写后按下回车键即可添加</span>
                <el-option
                  v-for="item in crystalGrowthErrList"
                  :key="item.id"
                  :value="item.value"
                  :label="item.label"
                />
              </el-select>
            </el-form-item>
          </div>
        </el-card>

        <!--   点检项确认     -->
        <el-card
          v-if="Array.isArray(recordItem.checks) && recordItem.checks.length"
        >
          <div class="headLine">
            <div class="headLine-title">点检项确认</div>
          </div>
          <div class="growth-section">
            <div v-for="(formItem, formItemIdx) in recordItem.checks" :key="formItemIdx">
              <el-form-item :label="formItem.label" class="check-item">
                <el-radio-group v-model="formItem.isError">
                  <el-radio :label="false">正常</el-radio>
                  <el-radio :label="true">异常</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item
                v-if="formItem.isError"
                label="异常备注"
                :rules="[
                  {
                    required: true,
                    message: '异常备注不能为空',
                    trigger: 'blur',
                  },
                ]"
                :prop="'checks.' + formItemIdx + '.errorMessage'"
              >
                <el-input
                  v-model="formItem.errorMessage"
                  type="textarea"
                  placeholder="请输入异常描述及处理建议"
                />
              </el-form-item>
            </div>
          </div>
        </el-card>

        <!--   设备/工艺参数确认     -->
        <el-card
          v-if="Array.isArray(recordItem.techs) && recordItem.techs.length"
        >
          <div class="headLine">
            <div class="headLine-title">设备/工艺参数确认</div>
          </div>
          <div class="growth-section">
            <template v-for="(formItem, formItemIdx) in recordItem.techs">
              <component
                :is="calcComponentName(formItem.noFormItem)"
                :key="formItemIdx"
                :label="formItem.label"
                :rules="[
                {
                  required: formItem.required,
                  message: formItem.label + '不能为空',
                  trigger: 'change',
                },
              ]"
                :prop="'techs.' + formItemIdx + '.extValue'"
              >
                <Render
                  :key="formItem.renderKey"
                  :conf="formItem"
                  :prop-value="formItem.extValue"
                  @input="handleTechsInput($event, recordIdx, formItemIdx)"
                />
              </component>
            </template>

          </div>

          <!--    等径记录      -->
          <div v-if="recordItem.equivalentCrystalVariables && recordItem.equivalentCrystalVariables.length" class="growth-section">
            <SubTitle label="等径记录"/>
            <el-table
              :data="recordItem.equivalentCrystalVariables[0]"
              max-height="666"
              border
              fit
              highlight-current-row
              class="admin_table"
            >
              <el-table-column
                v-for="(val, key) in recordItem.equivalentCrystalVariables[0][0]"
                :key="key"
                :label="key"
                :prop="key"
                :formatter="formatCol"
                min-width="140"
              />
            </el-table>
          </div>
        </el-card>
      </el-form>
    </el-collapse-item>

    <el-button
      v-if="addVisible"
      class="block-btn"
      type="primary"
      plain
      @click="handleIncrease"
      ><i class="el-icon-plus" />添加{{ stepName }}记录</el-button
    >
  </el-collapse>
</template>

<script>
import Render from "@/components/renderForm/render.vue";
import { isEmpty } from "lodash-es";
import * as Api from "@/api/inStation";
import moment from "moment"

export default {
  name: "TabItem",
  components: {
    Render,
  },
  props: {
    stepData: {
      type: Array | null,
      default() {
        return [];
      },
    },
    stepName: {
      type: String,
      required: true,
    },
    canAddRecord: {
      type: Object | null,
      required: true,
    },
    crystalGrowthErrList: Array,
  },
  data() {
    return {
      detailForm: {},
      activeCollapse: ["0"],
    };
  },
  computed: {
    addVisible() {
      if (!this.canAddRecord) return false
      const { recordMax } = this.canAddRecord
      if (typeof recordMax === 'number' && recordMax <= this.stepData.length) return false
      return true
    }
  },
  created() {
    this.activeCollapse = ["0"];
  },
  methods: {
    handleExtsInput(event, recordIdx, formItemIdx, vModel) {
      if (/^field/.test(vModel)) {
        this.$set(
          this.stepData[recordIdx].exts[formItemIdx],
          "extValue",
          event
        );
      } else {
        this.$set(this.stepData[recordIdx], vModel, event);
      }
    },
    handleTechsInput(event, recordIdx, formItemIdx) {
      this.$set(this.stepData[recordIdx].techs[formItemIdx], "extValue", event);

      const { techs } = this.stepData[recordIdx]
      const { extKey } = techs[formItemIdx]
      switch (extKey) {
        case '籽晶编号':
          this.handleSeedChange(event, techs)
          break
        case '掺杂剂编号':
          this.handleDopantChange(event, techs)
          break
        case '冷却开始时间':
        case '冷却结束时间':
          this.handleCoolTimeChange(techs)
          break
        case '吊单晶开始时间':
        case '吊单晶结束时间':
          this.handleHangUpTimeChange(techs)
          break
      }
    },
    // 补掺-籽晶编号 change
    handleSeedChange(event, techs) {
      Api.getSeed({uniqueCode: event}).then((res) => {
        let index = techs.findIndex(
          (item) => item.extKey === "籽晶寿命"
        );
        this.$set(
          techs[index],
          "extValue",
          res.data.usefulLife
        );
      });
    },
    // 补掺-掺杂剂编号 change
    handleDopantChange(event, techs) {
      Api.findByCode({code: event}).then((res) => {
        let typeIndex = techs.findIndex(
          (item) => item.extKey === "掺杂剂类型"
        );
        let dosageIndex = techs.findIndex(
          (item) => item.extKey === "补掺量"
        );
        this.$set(
          techs[typeIndex],
          "extValue",
          res.data.materialTypeName
        );
        this.$set(
          techs[dosageIndex],
          "extValue",
          res.data.qty
        );
      });
    },
    // 冷却-冷却开始时间 冷却结束时间
    handleCoolTimeChange(techs) {
      const startItem = techs.find((item) => item.extKey === "冷却开始时间")
      if (!startItem) return
      const start = startItem.extValue
      const endItem = techs.find((item) => item.extKey === "冷却结束时间")
      if (!endItem) return
      const end = endItem.extValue
      const durationItem = techs.find(item => item.extKey === "冷却时长")
      this.$set(
        durationItem,
        "extValue",
        moment(end).diff(start, "hours")
      )
    },
    // 吊单晶-吊单晶开始时间 吊单晶结束时间
    handleHangUpTimeChange(techs) {
      const startItem = techs.find((item) => item.extKey === "吊单晶开始时间")
      if (!startItem) return
      const start = startItem.extValue
      const endItem = techs.find((item) => item.extKey === "吊单晶结束时间")
      if (!endItem) return
      const end = endItem.extValue
      const durationItem = techs.find(item => item.extKey === "吊单晶时长")
      this.$set(
        durationItem,
        "extValue",
        moment(end).diff(start, "hours")
      )
    },
    handleIncrease() {
      const stepData = JSON.parse(
        JSON.stringify(this.stepData._defaultStepData)
      );
      stepData.userCreate = this.$store.getters.realName;
      this.stepData.push(stepData);
      this.$message.success(
        `已添加【${this.stepName}记录${this.stepData.length}】! `
      );
    },
    async valid() {
      if (this.stepName === "冷却" && isEmpty(this.stepData)) {
        this.$message.warning(this.stepName + "记录不能为空")
        return false
      }
      if (isEmpty(this.$refs.recordItem)) return true;
      let allValid = true;
      try {
        for (const ref of this.$refs.recordItem) {
          await ref.validate();
        }
      } catch (err) {
        this.$message.warning(this.stepName + "存在未填写的数据");
        allValid = false;
      }
      return allValid;
    },
    calcComponentName(noFormItem) {
      return noFormItem ? 'div' : 'elFormItem'
    },
    formatCol(row, column, val) {
      if (val && typeof val === 'object') {
        return (val.value || '') + (val.unit || '')
      }
      return val
    }
  },
};
</script>
