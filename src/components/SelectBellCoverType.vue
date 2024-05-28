<!--辅料寿命-->
<template>
  <el-row :gutter="9">
    <el-col v-if="!disabled" :span="12">
      <el-form-item :label="calcScanLabel" class="pre-label">
        <CodeScanner v-model="valueScan" @has-done="findByCode"/>
      </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item :label="`钟罩类型`" class="pre-label">
        <el-input :value="coverType" disabled/>
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
          // 编号
          objCode: {
            extKey: this.label,
            extValue: ''
          },
          // 编号(扫码)
          objScan: {
            extKey: this.fieldScan,
            extValue: ''
          },
          // 已使用寿命/额定寿命
          coverType: {
            extKey: this.fieldLife,
            extValue: ''
          },
        }
      }
    },
    fieldScan: {
      type: String,
      default: ''
    },
    fieldLife: {
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
    // 编号
    valueCode() {
      const { objCode } = this.value || {}
      return objCode ? objCode.extValue : ''
    },
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
    coverType: {
      get() {
        const { coverType } = this.value || {}
        return coverType ? coverType.extValue : ''
      },
      set(extValue) {
        this.$emit('input', {
          ...this.value,
          coverType: {
            ...this.value.coverType,
            extKey: this.fieldLife,
            extValue
          }
        })
      }
    },
    calcScanLabel() {
      return this.fieldScan.replace(/[（(]/, match => '\n' + match)
    },
    calcLifeLabel() {
      return this.fieldLife.replace(/\//, match => '\n' + match)
    }
  },
  methods: {
    findByCode(code) {
      if (!code) return
      if (this.valueCode && code !== this.valueCode) return this.$message.warning(`扫描编号必须为${this.valueCode}`)
      findInventoryByCode({
        search_EQ_uniqueCode: code
      }).then(res => {
        let coverType
        const { data } = res
        if (data && data.rows && data.rows[0]) {
          coverType = data.rows[0].materialTypeName
        } else {
          this.$message.warning(`【${code}】未查询到库存信息!`)
        }
        this.coverType = (coverType || '')
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

