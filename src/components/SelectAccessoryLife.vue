<!--辅料寿命-->
<template>
  <div>
    <div>
      {{ fieldScan }}:
      {{ valueScan }}:
      <CodeScanner v-model="valueScan"/>
    </div>
    <div>
      {{ label }}:{{ value.extValue }}
    </div>
    <div>
      {{ fieldLife }}:{{ valueLife }}
    </div>
    <el-button @click="fnTest">btn</el-button>
  </div>
</template>

<script>
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
          code: null, // 编号
          valueScan: null, // 编号(扫码)
          valueLife: null // 已使用寿命/额定寿命
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
  },
  data() {
    return {}
  },
  computed: {
    // 扫码value
    valueScan: {
      get() {
        let { objScan } = this.value
        if (this.value.objScan)
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
        let { objLife } = this.value
        if (this.value.objLife)
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
  },
  watch: {

  },
  methods: {
    fnTest() {
      console.log(this.formData)
this.valueScan = 'abc'
    },

  },
};
</script>

