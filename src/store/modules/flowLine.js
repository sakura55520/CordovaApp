const flowLine = {
  state: {
    flowLineVisible: false,
    flowLineList: []
  },
  mutations: {
    SET_FLOW_LINE_VISIBLE: (state, flowLineVisible) => {
      state.flowLineVisible = flowLineVisible
    },
    SET_FLOW_LINE_LIST: (state, flowLineList) => {
      state.flowLineList = flowLineList
    },
  },
  actions: {
    SetFlowLineList({ commit }, flowLineList) {
      commit('SET_FLOW_LINE_VISIBLE', true)
      commit('SET_FLOW_LINE_LIST', flowLineList)
    },
    SetFlowLineVisible({ commit }, flowLineVisible) {
      commit('SET_FLOW_LINE_VISIBLE', flowLineVisible)
    },
  }
}
export default flowLine
