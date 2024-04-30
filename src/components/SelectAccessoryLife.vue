<!--辅料寿命-->
<template>
  <el-row :gutter="8">
    <el-col v-if="!disabled" :span="9">
      <el-form-item :label="calcScanLabel" class="pre-label">
        <CodeScanner v-model="valueScan" @has-done="fetchAccessory"/>
      </el-form-item>
    </el-col>
    <el-col :span="9" :offset="disabled ? 9 : 0">
      <el-form-item :label="label">
        <el-input :value="valueCode" disabled/>
      </el-form-item>
    </el-col>
    <el-col :span="6">
      <el-form-item :label="`已使用寿命\n/额定寿命`" class="pre-label">
        <el-input :value="valueLife" disabled/>
      </el-form-item>
    </el-col>
  </el-row>
</template>

<script>
import {fetchAccessory} from "@/api/accessory";

export default {
  name: "SelectAccessoryLife",
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
          objLife: {
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
    valueLife: {
      get() {
        const { objLife } = this.value || {}
        return objLife ? objLife.extValue : ''
      },
      set(extValue) {
        this.$emit('input', {
          ...this.value,
          objLife: {
            ...this.value.objLife,
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
    fetchAccessory(code) {
      if (!code) return
      if (this.valueCode && code !== this.valueCode) return this.$message.warning(`扫描编号必须为${this.valueCode}`)
      fetchAccessory({
        search_EQ_uniqueCode: code
      }).then(res => {
        let number
        let ratedLife
        const { data } = res
        if (data && data[0]) {
          number = data[0].number
          ratedLife = data[0].ratedLife
          this.warnStatus = data[0].warnStatus
          if (this.warnStatus) {
            this.$message.warning(`【${code}】寿命达到预警值!`)
          } else {
            this.$message.success(`【${code}】寿命查询成功!`)
          }
        } else {
          this.$message.warning(`【${code}】未查询到寿命信息!`)
        }
        this.valueLife = (number || '') + '/' + (ratedLife || '')
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

