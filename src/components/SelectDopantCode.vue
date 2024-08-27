<!--辅料寿命-->
<template>
  <el-row :gutter="8">
    <el-col v-if="!disabled" :span="12">
      <el-form-item :label="calcScanLabel" class="pre-label">
        <DopantCodeScanner
          v-model="valueScan"
          @has-done="addDosage"
          @clear="clear"
        />
      </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item label="补掺量" class="pre-label">
        <el-input :value="valueDosage" disabled />
      </el-form-item>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: "SelectDopantCode",
  props: {
    label: {
      type: String,
      default: "",
    },
    value: {
      type: Object,
      default() {
        return {
          // 编号(扫码)
          objScan: {
            extKey: this.fieldScan,
            extValue: "",
          },
          // 已使用寿命/额定寿命
          objDosage: {
            extKey: this.fieldDosage,
            extValue: "",
          },
        };
      },
    },
    fieldScan: {
      type: String,
      default: "",
    },
    fieldDosage: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    // 扫码value
    valueScan: {
      get() {
        const { objScan } = this.value || {};
        return objScan ? objScan.extValue : "";
      },
      set(extValue) {
        this.$emit("input", {
          ...this.value,
          objScan: {
            ...this.value.objScan,
            extKey: this.fieldScan,
            extValue,
          },
        });
      },
    },
    valueDosage: {
      get() {
        const { objDosage } = this.value || {};
        return objDosage ? objDosage.extValue : "";
      },
      set(extValue) {
        this.$emit("input", {
          ...this.value,
          objDosage: {
            ...this.value.objDosage,
            extKey: this.fieldDosage,
            extValue,
          },
        });
      },
    },
    calcScanLabel() {
      return this.fieldScan.replace(/[（(]/, (match) => "\n" + match);
    },
    calcLifeLabel() {
      return this.fieldDosage.replace(/\//, (match) => "\n" + match);
    },
  },
  methods: {
    addDosage(dosage) {
      if (!dosage) return;
      setTimeout(() => {
        this.valueDosage = (
          Number(this.valueDosage || 0) + Number(dosage || 0)
        ).toFixed(3);
      }, 100);
    },
    clear() {
      setTimeout(() => {
        this.valueDosage = "";
      }, 100);
    },
  },
};
</script>

<style scoped>
.el-form-item {
  width: 100% !important;
}
</style>

