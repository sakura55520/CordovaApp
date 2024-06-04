import {postMessage} from "@/utils/overStation";
import {getSeleteData} from "@/utils/select";

export default {
  data() {
    return {
      enableMap: {} // 字段是否允许编辑
    }
  },
  computed: {
    isEnd() {
      return JSON.parse(this.$route.query.orderInfo || "{}").isEnd;
    }
  },
  methods: {
    async back(msg, operator) {
      if (operator === 'confirm') {
        await this.$confirm('系统不会保存您填写的内容, 确认取消吗？', '提示', {
          type: 'warning'
        })
      }
      if (window._pc_window) {
        postMessage(msg)
      }
      else {
        msg && this.$message.success(msg)
        this.$router.back()
      }
    },
    fetchSwitchDict() {
      const nameSpace = this.$route.query.wipStorageCode
      const list = []
      this.enableMap = {}
      // 系统全局开关 字典
      getSeleteData('global_switch', list).then(() => {
        list.forEach(({ name, value, extendValue, extendValue1 }) => {
          if (name !== nameSpace || !value) return

          const enable = extendValue === '1'
          this.$set(this.enableMap, value, enable)

          const required = extendValue1 === '1'
          if (this.formRules[value] && this.formRules[value][0]) {
            this.formRules[value][0].required = required
          } else if (required) {
            this.$set(this.formRules, value, [{ required, message: "必填项", trigger: "change" }])
          }
        })
      })
    }
  }
}
