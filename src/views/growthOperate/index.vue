<!--长晶-->
<template>
  <div :class="{ 'form-disabled': $route.query.view }" class="detailBox">
    <!-- 顶部信息卡片 -->
    <div class="topInfoCard">
      <div class="grid-container">
        <div class="grid-item">
          <span class="grid-item-name">批次号：</span>
          <span class="grid-item-value">{{ formData.processOrderCode }}</span>
          <span class="end" v-if="isEnd">END</span>
        </div>
        <div class="grid-item" v-if="productionEquipment">
          <span class="grid-item-name">生产设备：</span>
          <span class="grid-item-value">{{ productionEquipment }}</span>
        </div>
        <div class="grid-item" v-if="executionEquipment">
          <span class="grid-item-name">执行设备：</span>
          <span class="grid-item-value">{{ executionEquipment }}</span>
        </div>
      </div>
    </div>

    <div class="fromCard remark">
      <el-form>
        <el-form-item label="生产备注" class="form-item-cover">
          <el-input class="value" v-model="formData.productionRemark" />
        </el-form-item>
      </el-form>
    </div>

    <div v-loading="loading" class="fromCard growth-main">
      <el-tabs
        v-if="tabsVisible"
        v-model="currentStepName"
        tab-position="left"
        @tab-click="handleStepClick"
      >
        <el-tab-pane
          v-for="(stepName, index) in calcStepNameList"
          :name="stepName"
          :key="stepName + index"
        >
          <span
            slot="label"
            :class="{ 'tabs-label': checkNotFilled(stepName) }"
            >{{ stepName }}</span
          >
          <TabItem
            ref="TabItem"
            :step-data="steps[stepName]"
            :step-name="stepName"
            :can-add-record="calcAddRecordMap[stepName]"
            :crystal-growth-err-list="getStepErrList(stepName)"
            :all-step-data="steps"
            :process-order-code="formData.processOrderCode"
          />
        </el-tab-pane>
        <el-tab-pane name="单晶异常">
          <span slot="label">单晶异常</span>
          <TabError
            ref="TabError"
            :steps="steps"
            :step-name-list="calcStepNameList"
            :crystal-growth-err-list="crystalGrowthErrList"
          />
        </el-tab-pane>
        <el-tab-pane name="留档文档">
          <span slot="label">留档文档</span>
          <TabFile ref="TabFile" :step-data="steps['留档文档']" />
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 页面操作 -->
    <div class="page-handle-box" v-if="!$route.query.view">
      <el-button class="cancel" @click="back(null, 'confirm')">取消</el-button>
      <el-button class="save" @click="handle('保存')">保存</el-button>
      <el-button class="submit" type="primary" @click="handle('提交')"
        >{{ storageLabel }}确认</el-button
      >
    </div>

    <el-dialog title="请确认时长" :visible.sync="dialogVisible">
      <el-form
        ref="dialogForm"
        :model="dialogForm"
        :rules="dialogRules"
        label-width="130px"
      >
        <el-form-item label="化料开始时间" prop="startTime">
          <el-date-picker
            style="width: 100%"
            v-model="dialogForm.startTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="(val) => handleStartTimeChange(val)"
          />
        </el-form-item>
        <el-form-item label="工艺结束时间" prop="endTime">
          <el-date-picker
            style="width: 100%"
            v-model="dialogForm.endTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="(val) => handleEndTimeChange(val)"
          />
        </el-form-item>
        <el-form-item label="时长">
          <el-input style="width: 100%" v-model="duration" disabled>
            <template slot="append">H</template>
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="submit" @click="dialogVisible = false"
          >取 消</el-button
        >
        <el-button class="submit" type="primary" @click="handleConfirm"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as Api from "@/api/inStation";
import TabItem from "./TabItem";
import TabError from "./TabError";
import TabFile from "./TabFile";
import { fetchModelForm } from "@/api/modelform";
import { getSeleteData } from "@/utils/select";
import overStation from "@/mixins/overStation";
import moment from "moment";
import { get } from "lodash-es";

const defaultItem = {
  extKey: null,
  extValue: null,
};

export default {
  name: "GrowthOperate",
  mixins: [overStation],
  components: {
    TabItem,
    TabError,
    TabFile,
  },
  data() {
    return {
      currentStepName: "",
      name2form: {},
      formData: {},
      steps: {},
      rules: {},
      loading: true,
      tabsVisible: false,
      enabledInput: false,
      crystalGrowthErrList: [], // 拉晶异常list
      originalSteps: {},
      eapSteps: [
        "抽真空",
        "检漏",
        "化料",
        "稳温",
        "引晶",
        "放肩",
        "转肩",
        "等径",
        "收尾",
        "升温",
      ],
      dialogVisible: false,
      dialogForm: {
        startTime: null,
        endTime: null,
      },
      dialogRules: {
        startTime: [
          {
            required: true,
            message: "化料开始时间不能为空",
            trigger: "blur",
          },
        ],
        endTime: [
          {
            required: true,
            message: "工艺结束时间不能为空",
            trigger: "blur",
          },
        ],
      },
      wipSwitches: [],
      evacuateFirstCheck: null,
    };
  },
  computed: {
    storageLabel() {
      return this.$route.query.wipStorageStatus === "1" ? "出站" : "进站";
    },
    stepTabs() {
      return [
        {
          stepName: "拆炉",
          canAddRecord: true, // 允许添加记录
        },
        {
          stepName: "抽真空",
        },
        {
          stepName: "检漏",
        },
        {
          stepName: "升温",
          canAddRecord: true, // 允许添加记录
        },
        {
          stepName: "化料",
        },
        {
          stepName: "稳温",
        },
        {
          stepName: "引晶",
        },
        {
          stepName: "放肩",
        },
        {
          stepName: "等径",
        },
        {
          stepName: "收尾",
        },
        {
          stepName: "冷却",
          canAddRecord: true,
        },
        {
          stepName: "吊单晶",
          canAddRecord: true,
          recordMax: 1,
        },
        {
          stepName: "回熔",
          canAddRecord: true,
        },
        {
          stepName: "吊肩",
          canAddRecord: true,
        },
        {
          stepName: "补掺",
          canAddRecord: true,
        },
      ];
    },
    calcAddRecordMap() {
      const map = {};
      this.stepTabs.forEach(
        (item) => (map[item.stepName] = item.canAddRecord ? item : null)
      );
      return map;
    },
    calcStepNameList() {
      const list = [];
      this.stepTabs.forEach(({ stepName, canAddRecord }) => {
        if (!this.steps[stepName] && !canAddRecord) return;
        list.push(stepName);
      });
      return list;
    },
    duration() {
      const { startTime, endTime } = this.dialogForm;
      if (!startTime || !endTime) return 0;
      return moment(endTime).diff(startTime, "hours", true).toFixed(1);
    },
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      getSeleteData("wipSwitches", this.wipSwitches).then(() => {
        let evacuateFirstCheckMatched = this.wipSwitches.find(
          (item) => item.name === "evacuateFirstCheck"
        );
        evacuateFirstCheckMatched &&
          (this.evacuateFirstCheck = evacuateFirstCheckMatched.value);
      });

      // 长晶输入框是否可以输入
      const enabledList = [];
      await getSeleteData("isEnabledGrowthInput", enabledList);
      this.enabledInput =
        enabledList && enabledList[0] && enabledList[0].value === "可输入";

      // 拉晶异常list
      await getSeleteData("crystalGrowthErr", this.crystalGrowthErrList);

      let formData = {};
      try {
        formData = JSON.parse(this.$route.query.fromData);
      } catch (e) {
        console.log(e);
      }

      const { steps, ...rest } = formData;
      this.steps = Object.assign({}, steps);
      this.originalSteps = Object.assign({}, steps);
      if (!this.steps["留档文档"]) {
        this.$set(this.steps, "留档文档", [{ fiels: [] }]);
      }
      this.formData = rest;

      // 查询动态表单配置
      await this.initFormContent();
      this.loading = false;
      this.tabsVisible = true;
      this.currentStepName = this.calcStepNameList[0];
    },
    // 操作
    async handle(typeName) {
      if (typeName === "保存") {
        Api.updateGrowthBuffer(this.transform()).then((res) => {
          const msg = "保存成功!";
          this.back(msg);
        });
      } else if (typeName === "提交") {
        let allValid = await this.validAll();
        if (!allValid) return;

        this.dialogVisible = true;

        let startTechs = get(this.steps, "化料.[0].techs", []);
        let endTechs = get(this.steps, "冷却.[0].techs", []);

        let startObj =
          startTechs.find((item) => item.extKey === "化料开始时间") || {};
        let endObj =
          endTechs.find((item) => item.extKey === "工艺结束时间") || {};

        this.dialogForm.startTime = startObj.extValue;
        this.dialogForm.endTime = endObj.extValue;
      }
    },
    handleStartTimeChange(val) {
      let techs = get(this.steps, "化料.[0].techs", []);
      let index = techs.findIndex((item) => item.extKey === "化料开始时间");
      if (index > -1)
        this.$set(this.steps["化料"][0].techs[index], "extValue", val);
    },
    handleEndTimeChange(val) {
      let techs = get(this.steps, "冷却.[0].techs", []);
      let index = techs.findIndex((item) => item.extKey === "工艺结束时间");
      if (index > -1)
        this.$set(this.steps["冷却"][0].techs[index], "extValue", val);
    },
    async handleConfirm() {
      const valid = await this.$refs.dialogForm.validate();
      if (!valid) return;

      if (this.dialogForm.startTime >= this.dialogForm.endTime)
        return this.$message.warning("化料开始时间不能大于等于工艺结束时间");

      const {
        equipmentCode,
        processUuid,
        processingOrderCode,
        wipStorageStatus,
      } = this.$route.query;
      Api.inOrOutStation({
        param: {
          FormData: JSON.stringify(this.transform()),
        },
        equipmentCode, // 设备
        processUuid, // 当前工序唯一标识
        processingOrderCode, // 工单号
        wipStorageStatus, // 进出站状态
      }).then(() => {
        this.dialogVisible = false;
        const msg = `【${this.storageLabel}】操作成功`;
        this.back(msg);
      });
    },
    transform() {
      const steps = JSON.parse(JSON.stringify(this.steps));
      Object.keys(steps).forEach((stepName) => {
        const stepData = steps[stepName];
        if (!stepData || !stepData.length) return delete steps[stepName];
        stepData.forEach((recordItem) => {
          this.transformExts(recordItem.exts);
          this.transformChecks(recordItem.checks);
          this.transformTechs(recordItem.techs);

          // errors
          recordItem.errors = (recordItem._errors || []).map(
            (errorMessage) => ({ errorMessage })
          );
          delete recordItem._errors;
        });
      });
      return {
        ...this.formData,
        steps,
      };
    },
    transformExts(arr) {
      if (!Array.isArray(arr)) return;
      for (let index = 0; index < arr.length; index++) {
        const { extValue, vModel } = arr[index];
        if (
          [
            "userCreate",
            "userOperate2",
            "errorTime",
            "totalQty",
            "goodQty",
            "scrapQty",
            "errors",
          ].includes(vModel)
        ) {
          arr.splice(index, 1);
          index--;
          continue;
        }
        if (extValue && typeof extValue === "object") {
          arr[index].extValue = JSON.stringify(extValue);
        }
        this.deleteNeedlessFields(arr[index]);
      }
    },
    transformChecks(arr) {
      if (!Array.isArray(arr)) return;
      for (let index = 0; index < arr.length; index++) {
        this.deleteNeedlessFields(arr[index]);
      }
    },
    transformAccessoryLife(arr, index) {
      const formItem = arr[index];
      const { extValue, tag, disabled } = formItem;
      if (tag === "SelectAccessoryLife" && typeof extValue === "object") {
        const { objScan, objCode, objLife } = extValue;
        if (disabled) {
          arr.splice(index, 1, objCode, objLife);
        } else {
          arr.splice(index, 1, objScan, objCode, objLife);
        }
      } else if (
        tag === "SelectBellCoverType" &&
        typeof extValue === "object"
      ) {
        const { objScan, objType } = extValue;
        if (disabled) {
          arr.splice(index, 1, objType);
        } else {
          arr.splice(index, 1, objScan, objType);
        }
      } else if (tag === "SelectDopantCode" && typeof extValue === "object") {
        const { objScan, objDosage } = extValue;
        if (disabled) {
          arr.splice(index, 1, objDosage);
        } else {
          arr.splice(index, 1, objScan, objDosage);
        }
      }
    },
    transformTechs(arr) {
      if (!Array.isArray(arr)) return;
      for (let index = 0; index < arr.length; index++) {
        this.transformAccessoryLife(arr, index);
        const { extKey, extValue } = arr[index];
        if (!extKey) {
          arr.splice(index, 1);
          index--;
          continue;
        }
        if (extValue && typeof extValue === "object") {
          arr[index].extValue = JSON.stringify(extValue);
        }
        this.deleteNeedlessFields(arr[index]);
      }
    },
    deleteNeedlessFields(item) {
      const needlessFields = [
        "_ext",
        "androidType",
        "append",
        "border",
        "changeTag",
        "clearable",
        "defaultValue",
        "disabled",
        "dictCode",
        "document",
        "fieldLife",
        "fieldScan",
        "filterable",
        "formId",
        "format",
        "label",
        "labelWidth",
        "layout",
        "maxlength",
        "multiple",
        "options",
        "optionType",
        "placeholder",
        "prefix-icon",
        "prepend",
        "readonly",
        "regList",
        "renderKey",
        "required",
        "show-word-limit",
        "size",
        "span",
        "style",
        "suffix-icon",
        "tag",
        "tagIcon",
        "type",
        "vModel",
        "value-format",
      ];
      needlessFields.forEach((field) => delete item[field]);
    },
    initFormContent() {
      return fetchModelForm({
        search_LLIKE_name: "长晶-",
      }).then((res) => {
        res.data.forEach((form) => {
          this.name2form[form.name] = form;
        });
        this.calcStepNameList.forEach((stepName) => {
          if (!this.steps[stepName]) {
            this.$set(this.steps, stepName, []);
            this.initStepData(stepName);
            return;
          }

          this.steps[stepName].forEach((recordItem, recordIdx) => {
            this.initStepData(stepName, recordIdx);
          });
        });

        if (!this.steps["留档文档"]) this.$set(this.steps, "留档文档", []);
      });
    },
    initStepData(stepName, recordIdx) {
      this.initError(stepName, recordIdx);
      this.initExt(stepName, recordIdx);
      this.initCheck(stepName, recordIdx);
      this.initTech(stepName, recordIdx);
    },
    // 点检项
    initCheck(stepName, recordIdx) {
      const form = this.name2form[`长晶-${stepName}-点检项`];
      if (!form) return;

      const stepData = this.steps[stepName];
      if (this.calcAddRecordMap[stepName]) {
        if (!stepData._defaultStepData) stepData._defaultStepData = {};
        if (!stepData._defaultStepData.checks) {
          stepData._defaultStepData.checks = form.content.map((formItem) => ({
            ...formItem,
            checkItem: formItem.vModel,
          }));
        }
      }

      if (typeof recordIdx !== "number") return;
      const label2value = {};
      if (Array.isArray(stepData[recordIdx].checks)) {
        stepData[recordIdx].checks.forEach((data) => {
          if (!data.checkItem) return;
          label2value[data.checkItem] = data;
        });
      }
      this.$set(
        stepData[recordIdx],
        "checks",
        form.content.map((formItem) => ({
          ...formItem,
          ...(label2value[formItem.vModel] || label2value[formItem.label]),
          checkItem: formItem.vModel,
        }))
      );
    },
    // 辅料寿命
    initAccessoryLife(formItem, label2value) {
      const { fieldScan, fieldLife, label } = formItem;
      return {
        objCode: label2value[label] || defaultItem, // 编号
        objScan: label2value[fieldScan] || defaultItem, // 编号(扫码)
        objLife: label2value[fieldLife] || defaultItem, // 已使用寿命/额定寿命
      };
    },
    //钟罩类型
    initBellCoverType(formItem, label2value) {
      const { fieldScan, fieldType, label } = formItem;
      return {
        objCode: label2value[label] || defaultItem, // 编号
        objScan: label2value[fieldScan] || defaultItem, // 编号(扫码)
        objType: label2value[fieldType] || defaultItem, // 已使用寿命/额定寿命
      };
    },
    //掺杂剂编号
    initDopantCode(formItem, label2value) {
      const { fieldScan, fieldDosage, label } = formItem;
      return {
        objCode: label2value[label] || defaultItem, // 编号
        objScan: label2value[fieldScan] || defaultItem, // 编号(扫码)
        objDosage: label2value[fieldDosage] || defaultItem, // 补掺量
      };
    },
    // 工艺参数
    initTech(stepName, recordIdx) {
      const form = this.name2form[`长晶-${stepName}-工艺参数`];
      if (!form) return;

      const stepData = this.steps[stepName];
      if (this.calcAddRecordMap[stepName]) {
        if (!stepData._defaultStepData) stepData._defaultStepData = {};
        if (!stepData._defaultStepData.techs) {
          stepData._defaultStepData.techs = form.content.map((formItem) => ({
            ...formItem,
            extKey: formItem.vModel,
            disabled: !this.enabledInput && formItem.disabled,
          }));
        }
      }

      if (typeof recordIdx !== "number") return;
      const label2value = {};
      if (Array.isArray(stepData[recordIdx].techs)) {
        stepData[recordIdx].techs.forEach((data) => {
          if (!data.extKey) return;
          label2value[data.extKey] = data;
        });
      }
      this.$set(
        stepData[recordIdx],
        "techs",
        form.content.map((formItem) => {
          const { vModel, tag, label } = formItem;
          let { extValue } = label2value[vModel] || {};
          if (tag === "SelectAccessoryLife") {
            extValue = this.initAccessoryLife(formItem, label2value);
          }
          if (tag === "SelectBellCoverType") {
            extValue = this.initBellCoverType(formItem, label2value);
          }
          if (tag === "SelectDopantCode") {
            extValue = this.initDopantCode(formItem, label2value);
          }
          if ((label == "热炉漏率" || label == "热炉极限真空") && this.isEnd)
            formItem.required = true;

          return {
            ...formItem,
            ...label2value[vModel],
            extValue,
            extKey: vModel,
            disabled: !this.enabledInput && formItem.disabled,
          };
        })
      );
    },
    // 其余参数
    initExt(stepName, recordIdx) {
      const form = this.name2form[`长晶-${stepName}-其余参数`];
      if (!form) return;

      const stepData = this.steps[stepName];
      if (this.calcAddRecordMap[stepName]) {
        if (!stepData._defaultStepData) stepData._defaultStepData = {};
        if (!stepData._defaultStepData.exts) {
          stepData._defaultStepData.exts = form.content.map((formItem) => ({
            ...formItem,
            extKey: formItem.label,
            disabled: this.enabledInput ? formItem.disabled : true,
          }));
        }
      }

      if (typeof recordIdx !== "number") return;
      const label2value = {};
      if (Array.isArray(stepData[recordIdx].exts)) {
        stepData[recordIdx].exts.forEach((data) => {
          label2value[data.extKey] = data;
        });
      }
      this.$set(
        stepData[recordIdx],
        "exts",
        form.content.map((formItem) => ({
          ...formItem,
          ...label2value[formItem.label],
          extKey: formItem.label,
          disabled: !this.enabledInput && formItem.disabled,
        }))
      );
    },
    // 异常
    initError(stepName, recordIdx) {
      const form = this.name2form[`长晶-${stepName}-其余参数`];
      if (!form) return;

      const stepData = this.steps[stepName];
      const errFormItemIdx = form.content.findIndex(
        ({ label }) => label === "单晶异常"
      );
      let _showErrors = false;
      let _requiredErrors = false;
      if (errFormItemIdx > -1) {
        _showErrors = true;
        _requiredErrors = form.content[errFormItemIdx].required;
        form.content.splice(errFormItemIdx, 1);
      }
      if (_showErrors) stepData._showErrors = _showErrors;
      if (_requiredErrors) stepData._requiredErrors = _requiredErrors;
      if (this.calcAddRecordMap[stepName]) {
        if (!stepData._defaultStepData) stepData._defaultStepData = {};
        if (!stepData._defaultStepData._errors) {
          stepData._defaultStepData._errors = [];
          stepData._defaultStepData._showErrors = _showErrors;
          stepData._defaultStepData._requiredErrors = _requiredErrors;
        }
      }

      if (typeof recordIdx !== "number") return;
      this.$set(stepData[recordIdx], "_showErrors", stepData._showErrors);
      this.$set(
        stepData[recordIdx],
        "_requiredErrors",
        stepData._requiredErrors
      );
      this.$set(
        stepData[recordIdx],
        "_errors",
        (stepData[recordIdx].errors || []).map((item) => item.errorMessage)
      );
    },
    handleStepClick({ name }) {
      switch (name) {
        case "单晶异常":
          this.$nextTick(() => {
            if (this.$refs.TabError && this.$refs.TabError.init)
              this.$refs.TabError.init();
          });
          break;
        case "留档文档":
          this.$nextTick(() => {
            if (this.$refs.TabFile && this.$refs.TabFile.init)
              this.$refs.TabFile.init();
          });
          break;
        default:
      }
    },
    async validAll() {
      if (
        this.evacuateFirstCheck === "打开" &&
        this.formData.processOrderCode.endsWith("1") &&
        !this.calcStepNameList.some((item) => item == "抽真空")
      ) {
        this.$message.warning("抽真空记录不能为空");
        return false;
      }
      for (const ref of this.$refs.TabItem) {
        let valid = await ref.valid();
        if (!valid) return false;
      }
      let fileValid = await this.$refs.TabFile.valid();
      if (!fileValid) return false;
      return true;
    },
    checkNotFilled(stepName) {
      if (!this.eapSteps.includes(stepName) || !this.originalSteps[stepName])
        return false;
      let notFilled = false;
      this.steps[stepName].forEach((item) => {
        item.exts.forEach((ele) => {
          if (!item[ele.vModel]) notFilled = true;
        });
        item.techs.forEach((ele) => {
          if (!ele.extValue && !ele.disabled) notFilled = true;
        });
      });
      return notFilled;
    },
    getStepErrList(step) {
      return this.crystalGrowthErrList.filter((item) => item.name === step);
    },
  },
};
</script>

<style lang="scss" scoped>
.growth-main {
  /deep/ {
    .el-tabs {
      overflow: visible;
    }
    .el-tabs__content {
      //overflow: visible;
    }
    .el-tabs__header {
      position: sticky;
      top: 50px;
    }
    .el-collapse-item > div:first-child {
      /*border-bottom: 1px solid #EBEEF5;*/
      /*position: sticky;
      top: 50px;*/
    }
    .el-collapse-item__header {
      height: 60px;
      /*border-bottom: none;*/
      padding-left: 26px;
      font-size: 20px;
    }
    .el-collapse-item__arrow {
      position: absolute;
      left: 0;
      color: #409eff;
      font-weight: bold;
    }
    .el-tabs__nav {
      padding: 0;
    }
    .el-tabs__item {
      border-radius: 5px;
      font-size: 16px;
      text-align: center;
    }
    .el-tabs__item.is-active {
      font-weight: bold;
      background: rgb(217, 236, 255);
    }
    .headLine {
      padding: 0;
      border-bottom: 0;
      margin-top: -20px;
    }
    .headLine-title {
      font-size: 16px;
    }
    .check-item {
      .el-form-item__label {
        min-width: 200px;
        text-align: left;
      }
    }
    .growth-record {
      padding-left: 12px;
    }
    .growth-section {
    }
    .el-card + .el-card {
      margin-top: 20px;
    }
  }
}

.tabs-label {
  position: relative;
}

.tabs-label::before {
  content: " ";
  border: 3px solid red; /*设置红色*/
  border-radius: 3px; /*设置圆角*/
  position: absolute;
  z-index: 1000;
  left: -10px;
  top: 6px;
}

.remark {
  padding: 20px 20px 0px 20px;
}
</style>
