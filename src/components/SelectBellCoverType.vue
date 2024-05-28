<!--辅料寿命-->
<template>
  <el-row :gutter="8">
    <el-col v-if="!disabled" :span="12">
      <el-form-item :label="calcScanLabel" class="pre-label">
        <CodeScanner v-model="valueScan" @has-done="fetchOne"/>
      </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item :label="`钟罩类型`" class="pre-label">
        <el-input :value="valueType" disabled/>
      </el-form-item>
    </el-col>
  </el-row>
</template>

<script>

import {findInventoryByCode} from "@/api/inStation";

export default {
  name: "SelectBellCoverType",
  props: {
    label: {
      type: String,
      default: ''
    },
    value: {
      type: Object,
      default() {
        return {
          // 编号(扫码)
          objScan: {
            extKey: this.fieldScan,
            extValue: ''
          },
          // 已使用寿命/额定寿命
          objType: {
            extKey: this.fieldType,
            extValue: ''
          },
        }
      }
    },
    fieldScan: {
      type: String,
      default: ''
    },
    fieldType: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      warnStatus: 0, // 0: 未预警, 1: 已预警
    }
  },
  computed: {
    // 扫码value
    valueScan: {
      get() {
        const { objScan } = this.value || {}
        return objScan ? objScan.extValue : ''
      },
      set(extValue) {
        this.$emit('input', {
          ...this.value,
          objScan: {
            ...this.value.objScan,
            extKey: this.fieldScan,
            extValue
          }
        })
      }
    },
    valueType: {
      get() {
        const { objType } = this.value || {}
        return objType ? objType.extValue : ''
      },
      set(extValue) {
        this.$emit('input', {
          ...this.value,
          objType: {
            ...this.value.objType,
            extKey: this.fieldType,
            extValue
          }
        })
      }
    },
    calcScanLabel() {
      return this.fieldScan.replace(/[（(]/, match => '\n' + match)
    },
    calcLifeLabel() {
      return this.fieldType.replace(/\//, match => '\n' + match)
    }
  },
  methods: {
    fetchOne(code) {
      if (!code) return
      findInventoryByCode({
        search_EQ_uniqueCode: code
      }).then(res => {
        let materialTypeName
        const { data } = res
        if (data && data.rows && data.rows[0]) {
          materialTypeName = data.rows[0].materialTypeName
          this.$message.success(`【${code}】钟罩库存查询成功!`)
        } else {
          this.$message.warning(`【${code}】未查询到钟罩库存信息!`)
        }
        this.valueType = (materialTypeName || '')
      })
    },
  },
};
</script>

<style scoped>
.el-form-item {
  width: 100% !important;
}
</style>

