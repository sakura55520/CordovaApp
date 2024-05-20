const station = {
  state: {
    processingOrderCode: '', // 加工工单
    stationVisible: false,
    stationList: [], // 站点集合
    stationPostData: null, // inOrOutStation接口的传参
    stationCallback: '', // 过站后的回调
    processingOrderCodeScan: '', // 过站执行-晶编扫码
  },
  mutations: {
    SET_PROCESSING_ORDER_CODE: (state, processingOrderCode) => {
      state.processingOrderCode = processingOrderCode
    },
    SET_STATION_VISIBLE: (state, stationVisible) => {
      state.stationVisible = stationVisible
    },
    SET_STATION_LIST: (state, stationList) => {
      state.stationList = stationList
    },
    SET_STATION_POST_DATA: (state, stationPostData) => {
      state.stationPostData = stationPostData
    },
    SET_STATION_CALLBACK: (state, stationCallback) => {
      state.stationCallback = stationCallback
    },
    SET_PROCESSING_ORDER_CODE_SCAN: (state, processingOrderCodeScan) => {
      state.processingOrderCodeScan = processingOrderCodeScan
    },
  },
  actions: {
    SetProcessingOrderCode({ commit }, processingOrderCode) {
      commit('SET_PROCESSING_ORDER_CODE', processingOrderCode)
    },
    SetStationVisible({ commit }, stationVisible) {
      commit('SET_STATION_VISIBLE', stationVisible)
    },
    SetStationList({ commit }, stationList) {
      commit('SET_STATION_VISIBLE', true)
      commit('SET_STATION_LIST', stationList)
    },
    SetStationPostData({ commit }, stationPostData) {
      commit('SET_STATION_POST_DATA', stationPostData)
    },
    SetStationCallback({ commit }, stationCallback) {
      commit('SET_STATION_CALLBACK', stationCallback)
    },
    SetProcessingOrderCodeScan({ commit }, processingOrderCodeScan) {
      commit('SET_PROCESSING_ORDER_CODE_SCAN', processingOrderCodeScan)
    },
  }
}
export default station
