export default {
  methods: {
    async back(msg, operator) {
      if (operator === 'confirm') {
        await this.$confirm('系统不会保存您填写的内容, 确认取消吗？', '提示', {
          type: 'warning'
        })
      }
      if (window._pc_window) {
        this.postMessage(msg)
        return
      }
      this.$router.back()
    },
    postMessage(msg) {
      if (!window._pc_window) return
      window._pc_window.postMessage({
        msg,
        tag: 'close dialog'
      }, process.env.BASE_PC)
    }
  }
}
