import { Message, MessageBox } from 'element-ui'
import store from '@/store'
import router from '@/router'
import { getCurrentWipStorageData } from '@/api/overStation/overStation'
import { inOrOutStation } from "@/api/inStation";

// 根据加工工单查询站点
export function fetchStorage(processingOrderCode) {
  getCurrentWipStorageData(processingOrderCode).then(res => {
    if (!res.data || !res.data.length) return Message.warning('未查询到过站信息!')

    const list = res.data
    if (list.length === 1 && !list[0].isNeedsDevice) {
      handleInOrOutStation(list[0], processingOrderCode)
    } else {
      store.dispatch('SetProcessingOrderCode', processingOrderCode)
      store.dispatch('SetStationList', list)
    }
  })
}

// 进站/出站
export function handleInOrOutStation(storage, processingOrderCode) {
  switch (storage.operationType) {
    // operationType 0：直接出站/直接进站，1：自定义表单，2：定制化页面
    case 0:
      directInOrOut(storage, processingOrderCode)
      break
    case 1:
      trendsform(storage, processingOrderCode)
      break
    case 2:
      goOperationPage(storage, processingOrderCode);
      break
  }
}

// 直接进站/出站
function directInOrOut(storage, processingOrderCode) {
  const { skipStatus, wipStorageStatus } = storage
  const operator = calcStationOperator(skipStatus, wipStorageStatus)
  MessageBox.confirm(`是否${operator}？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    inOrOutStation({
      param: {},
      equipmentCode: storage.deviceCode,
      processUuid: storage.processUuid,
      processingOrderCode,
      wipStorageStatus
    }).then(() => {
      Message.success(`【${operator}】操作成功!`)
    })
  }).catch((e) => {
    console.log(e)
  })
}

// 自定义表单
function trendsform(storage, processingOrderCode) {
  console.log('自定义表单')
}

export function calcIsSkip(skipStatus) {
  return skipStatus === 1 || skipStatus === 2 || skipStatus === 3
}

export function calcStationOperator(skipStatus, wipStorageStatus) {
  return (calcIsSkip(skipStatus) ? '跳过' : '确定') + (wipStorageStatus === 0 ? '进站' : '出站')
}

// 跳转到操作页面
function goOperationPage(storage, processingOrderCode) {
  const go = router.app._route.query.routerReplace ? 'replace' : 'push'
  router[go]({
    path: storage.operationData,
    query: {
      ...storage,
      processingOrderCode,
      fromData: JSON.stringify(storage.fromData)
    }
  })
  resetStationStore()
}

export function resetStationStore() {
  store.dispatch('SetStationCallback', null)
  store.dispatch('SetStationVisible', false)
  store.dispatch('SetFlowLineVisible', false)
}
