export default {
  methods: {
    postMessage(msg) {
      if (!window._pc_window) return
      window._pc_window.postMessage({
        msg,
        tag: 'close dialog'
      }, process.env.BASE_PC)
    }
  }
}
