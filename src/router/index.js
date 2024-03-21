import Vue from 'vue'
import Router from 'vue-router'

/*
* name: 'routername'             必须唯一
* meta: {
    HeadsHide: false             默认false, 显示顶部导航栏
    text: '工作中心'              显示在顶部导航栏中的标题名字
    btnReturnHide: false         默认false, 显示后退按钮
    returnPath: '/'              设置后退路径, 默认'/'
  }
* */

Vue.use(Router)
export const constantRouterMap = [
  {
    path: '/',
    name: 'root',
    redirect: '/dashboard',
    hidden: true,
    meta: {text: '工作中心'}
  },
  {
    name: 'dashboard',
    path: '/dashboard',
    component: () => import('@/views/dashboard/index'),
    hidden: true,
    meta: {text: '工作中心', btnReturnHide: true}
  },
  {
    path: '/login',
    name: 'login',
    text: 'login',
    component: () => import('@/views/login/index'),
    hidden: true,
    meta: {text: '登录', HeadsHide: true, btnReturnHide: true, UserHide: true}
  },
  // 生产管理
  {
    name: 'feed',
    path: '/feed',
    component: () => import('@/views/feed/index'),
    hidden: true,
    meta: {text: '装炉'}
  },
  {
    name: 'feedOperate',
    path: '/feed/operateTask',
    component: () => import('@/views/feed/modules/operateTask.vue'),
    hidden: true,
    meta: { text: '装炉(操作)', returnPath: '/feed'}
  },
  {
    name: 'accessory',
    path: '/accessory',
    component: () => import('@/views/accessory/index'),
    hidden: true,
    meta: {text: '热场更换'}
  },
  // ------原料合成------
  // 生产发料
  {
    name: 'producIssueStuff',
    path: '/producIssueStuff',
    component: () => import('@/views/producIssueStuff/index'),
    hidden: true,
    meta: {text: '返工发料'}
  },
  {
    name: 'producIssueStuffDetail',
    path: '/producIssueStuff/producIssueStuffDetail',
    component: () => import('@/views/producIssueStuff/modules/producIssueStuffDetail.vue'),
    hidden: true,
    meta: { text: '返工发料', returnPath: '/producIssueStuff'}
  },
  // 配料装埚
  {
    name: 'filling',
    path: '/filling',
    component: () => import('@/views/filling/index'),
    hidden: true,
    meta: {text: '装埚'}
  },
  {
    name: 'materialMixiDetail',
    path: '/filling/materialMixiDetail',
    component: () => import('@/views/filling/modules/materialMixiDetail.vue'),
    hidden: true,
    meta: { text: '原料混合', returnPath: '/filling'}
  },
  {
    name: 'fillingDetail',
    path: '/filling/fillingDetail',
    component: () => import('@/views/filling/modules/fillingDetail.vue'),
    hidden: true,
    meta: { text: '装埚', returnPath: '/filling'}
  },
  // 开埚
  {
    name: 'boil',
    path: '/boil',
    component: () => import('@/views/boil/index'),
    hidden: true,
    meta: {text: '开埚'}
  },
  {
    name: 'boilDetail',
    path: '/boil/boilDetail',
    component: () => import('@/views/boil/modules/boilDetail.vue'),
    hidden: true,
    meta: { text: '开埚', returnPath: '/boil'}
  },
  // 氧化
  {
    name: 'oxidize',
    path: '/oxidize',
    component: () => import('@/views/oxidize/index'),
    hidden: true,
    meta: {text: '氧化'}
  },
  {
    name: 'oxidizeDetail',
    path: '/oxidize/oxidizeDetail',
    component: () => import('@/views/oxidize/modules/oxidizeDetail.vue'),
    hidden: true,
    meta: { text: '氧化', returnPath: '/oxidize'},
    props: true
  },
  // 破碎
  {
    name: 'crush',
    path: '/crush',
    component: () => import('@/views/crush/index'),
    hidden: true,
    meta: {text: '破碎'}
  },
  {
    name: 'crushDetail',
    path: '/crush/crushDetail',
    component: () => import('@/views/crush/modules/crushDetail.vue'),
    hidden: true,
    meta: { text: '破碎', returnPath: '/crush'}
  },
  // 筛分
  {
    name: 'screen',
    path: '/screen',
    component: () => import('@/views/screen/index'),
    hidden: true,
    meta: {text: '筛分'}
  },
  {
    name: 'screenDetail',
    path: '/screen/screenDetail',
    component: () => import('@/views/screen/modules/screenDetail.vue'),
    hidden: true,
    meta: { text: '筛分', returnPath: '/screen'}
  },
  // 终检包装
  {
    name: 'finalInspectionPackage',
    path: '/finalInspectionPackage',
    component: () => import('@/views/finalInspectionPackage/index'),
    hidden: true,
    meta: {text: '终检包装'}
  },
  {
    name: 'finalInspectionPackageDetail',
    path: '/finalInspectionPackage/finalInspectionPackageDetail',
    component: () => import('@/views/finalInspectionPackage/modules/finalInspectionPackageDetail.vue'),
    hidden: true,
    meta: { text: '终检包装', returnPath: '/finalInspectionPackage'}
  },
  // 原料合成/成品入库
  {
    name: 'Warehousing',
    path: '/Warehousing',
    component: () => import('@/views/Warehousing/index'),
    hidden: true,
    meta: {text: '成品入库'}
  },
  // {
  //   name: 'WarehousingDetail',
  //   path: '/Warehousing/WarehousingDetail',
  //   component: () => import('@/views/Warehousing/modules/WarehousingDetail.vue'),
  //   hidden: true,
  //   meta: { text: '成品入库', returnPath: '/Warehousing'}
  // },

  // ------装炉长晶------
  // 装料
  {
    name: 'charge',
    path: '/charge',
    component: () => import('@/views/charge/index'),
    hidden: true,
    meta: {text: '装料'},
  },
  {
    name: 'createFrom',
    path: '/charge/createFrom',
    component: () => import('@/views/charge/modules/createFrom'),
    hidden: true,
    meta: {text: '创建装料任务', returnPath: '/charge'},
  },
  {
    name: 'operateTask',
    path: '/charge/operateTask',
    component: () => import('@/views/charge/modules/operateTask'),
    hidden: true,
    meta: {text: '装料(操作任务)', returnPath: '/charge'},
  },
  //清洗
  {
    name: 'cleanDry',
    path: '/cleanDry',
    component: () => import('@/views/cleanDry/index'),
    hidden: true,
    meta: {text: '清洗'},
  },
  {
    name: 'cleanDry',
    path: '/cleanDry/createFrom',
    component: () => import('@/views/cleanDry/modules/createFrom.vue'),
    hidden: true,
    meta: { text: '创建清洗任务', returnPath: '/cleanDry'}
  },
  {
    name: 'cleanDryOperate',
    path: '/cleanDry/operateTask',
    component: () => import('@/views/cleanDry/modules/operateTask.vue'),
    hidden: true,
    meta: { text: '清洗任务', returnPath: '/cleanDry'}
  },
  //烘干
  {
    name: 'dry',
    path: '/dry',
    component: () => import('@/views/dry/index'),
    hidden: true,
    meta: {text: '烘干'},
  },
  {
    name: 'dryBatch',
    path: '/dry/dryBatch',
    component: () => import('@/views/dry/modules/dryBatch.vue'),
    hidden: true,
    meta: { text: '创建批量烘干', returnPath: '/dry' },
  },
  {
    name: 'dryOperate',
    path: '/dry/operateTask',
    component: () => import('@/views/dry/modules/operateTask.vue'),
    hidden: true,
    meta: { text: '烘干任务', returnPath: '/dry'}
  },
  // ------籽晶粘贴------
  //来料检验
  {
    name: 'incomingInspection',
    path: '/incomingInspection',
    component: () => import('@/views/incomingInspection/index'),
    hidden: true,
    meta: {text: '来料检验'},
  },
  {
    name: 'incomingInspectionDetail',
    path: '/incomingInspection/detailFrom',
    component: () => import('@/views/incomingInspection/modules/detailFrom.vue'),
    hidden: true,
    meta: { text: '来料检验', returnPath: '/incomingInspection'}
  },
  // 生产发料
  {
    name: 'pasteProducIssueStuff',
    path: '/pasteProducIssueStuff',
    component: () => import('@/views/pasteProducIssueStuff/index'),
    hidden: true,
    meta: {text: '生产发料'}
  },
  {
    name: 'pasteProducIssueStuffDetail',
    path: '/pasteProducIssueStuff/pasteProducIssueStuffDetail',
    component: () => import('@/views/pasteProducIssueStuff/modules/pasteProducIssueStuffDetail.vue'),
    hidden: true,
    meta: { text: '生产发料', returnPath: '/pasteProducIssueStuff'}
  },
  // 工序1-1
  {
    name: 'process1-1',
    path: '/process1-1',
    component: () => import('@/views/process1-1/index.vue'),
    hidden: true,
    meta: { text: '工序1-1' }
  },
  {
    name: 'process1-1Detail',
    path: '/process1-1/process1-1Detail',
    component: () => import('@/views/process1-1/modules/process1-1Detail.vue'),
    hidden: true,
    meta: { text: '工序1-1', returnPath: '/process1-1'}
  },
  // 工序1-2
  {
    name: 'process1-2',
    path: '/process1-2',
    component: () => import('@/views/process1-2/index.vue'),
    hidden: true,
    meta: { text: '工序1-2' }
  },
  {
    name: 'process1-2Rack',
    path: '/process1-2/process1-2Rack',
    component: () => import('@/views/process1-2/modules/process1-2Rack.vue'),
    hidden: true,
    meta: { text: '工序1-2批量上料', returnPath: '/process1-2'}
  },
  {
    name: 'process1-2Detail',
    path: '/process1-2/process1-2Detail',
    component: () => import('@/views/process1-2/modules/process1-2Detail.vue'),
    hidden: true,
    meta: { text: '工序1-2', returnPath: '/process1-2'}
  },
  // 工序2-1
  {
    name: 'process2-1',
    path: '/process2-1',
    component: () => import('@/views/process2-1/index.vue'),
    hidden: true,
    meta: { text: '工序2-1' }
  },
  {
    name: 'process2-1Detail',
    path: '/process2-1/process2-1Detail',
    component: () => import('@/views/process2-1/modules/process2-1Detail.vue'),
    hidden: true,
    meta: { text: '工序2-1', returnPath: '/process2-1'}
  },
  // 工序2-2
  {
    name: 'process2-2',
    path: '/process2-2',
    component: () => import('@/views/process2-2/index.vue'),
    hidden: true,
    meta: { text: '工序2-2' }
  },
  {
    name: 'process2-2Rack',
    path: '/process2-2/process2-2Rack',
    component: () => import('@/views/process2-2/modules/process2-2Rack.vue'),
    hidden: true,
    meta: { text: '工序2-2批量上料', returnPath: '/process2-2'}
  },
  {
    name: 'process2-2Detail',
    path: '/process2-2/process2-2Detail',
    component: () => import('@/views/process2-2/modules/process2-2Detail.vue'),
    hidden: true,
    meta: { text: '工序2-2', returnPath: '/process2-2'}
  },
  // 工序3-1
  {
    name: 'process3-1',
    path: '/process3-1',
    component: () => import('@/views/process3-1/index.vue'),
    hidden: true,
    meta: { text: '工序3-1' }
  },
  {
    name: 'process3-1Rack',
    path: '/process3-1/process3-1Rack',
    component: () => import('@/views/process3-1/modules/process3-1Rack.vue'),
    hidden: true,
    meta: { text: '工序3-1批量上料', returnPath: '/process3-1'}
  },
  {
    name: 'process3-1Detail',
    path: '/process3-1/process3-1Detail',
    component: () => import('@/views/process3-1/modules/process3-1Detail.vue'),
    hidden: true,
    meta: { text: '工序3-1', returnPath: '/process3-1'}
  },
  // 工序3-2
  {
    name: 'process3-2',
    path: '/process3-2',
    component: () => import('@/views/process3-2/index.vue'),
    hidden: true,
    meta: { text: '工序3-2' }
  },
  {
    name: 'process3-2Detail',
    path: '/process3-2/process3-2Detail',
    component: () => import('@/views/process3-2/modules/process3-2Detail.vue'),
    hidden: true,
    meta: { text: '工序3-2', returnPath: '/process3-2'}
  },
  // 籽晶粘贴/终检包装
  {
    name: 'seedFinalInspection',
    path: '/seedFinalInspection',
    component: () => import('@/views/seedFinalInspection/index.vue'),
    hidden: true,
    meta: { text: '终检包装' }
  },
  {
    name: 'seedFinalInspectionDetail',
    path: '/seedFinalInspection/seedFinalInspectionDetail',
    component: () => import('@/views/seedFinalInspection/modules/seedFinalInspectionDetail.vue'),
    hidden: true,
    meta: { text: '终检包装', returnPath: '/seedFinalInspection'}
  },
  // 籽晶粘贴/成品入库
  {
    name: 'seedWarehousing',
    path: '/seedWarehousing',
    component: () => import('@/views/seedWarehousing/index.vue'),
    hidden: true,
    meta: { text: '成品入库' }
  },
  {
    name: 'seedReset',
    path: '/seedWarehousing/seedReset',
    component: () => import('@/views/seedWarehousing/modules/seedReset.vue'),
    hidden: true,
    meta: { text: '重新判定', returnPath: '/seedWarehousing' }
  },
  // 籽晶安装
  {
    name: 'seedCrystal',
    path: '/seedCrystal',
    component: () => import('@/views/seedCrystal/index'),
    hidden: true,
    meta: {text: '籽晶安装'}
  },
  {
    name: 'seedCrystalOperate',
    path: '/seedCrystal/operateTask',
    component: () => import('@/views/seedCrystal/modules/operateTask.vue'),
    hidden: true,
    meta: { text: '籽晶安装', returnPath: '/seedCrystal'}
  },
  // 坩埚组装
  {
    name: 'crucibleAssembly',
    path: '/crucibleAssembly',
    component: () => import('@/views/crucibleAssembly/index'),
    hidden: true,
    meta: {text: '坩埚组装'}
  },
  {
    name: 'crucibleAssemblyOperate',
    path: '/crucibleAssembly/operateTask',
    component: () => import('@/views/crucibleAssembly/modules/operateTask.vue'),
    hidden: true,
    meta: { text: '坩埚组装', returnPath: '/crucibleAssembly'}
  },
  // 开炉初检
  {
    name: 'KLInitialInspection',
    path: '/KLInitialInspection',
    component: () => import('@/views/KLInitialInspection/index'),
    hidden: true,
    meta: {text: '开炉初检'}
  },
  // 开炉进站
  {
    name: 'KLBlowIn',
    path: '/KLInitialInspection/KLBlowIn',
    component: () => import('@/views/KLInitialInspection/modules/KLBlowIn.vue'),
    hidden: true,
    meta: { text: '开炉初检-进站', returnPath: '/KLInitialInspection'}
  },
  // 开炉出站
  {
    name: 'KLInitialInspectionOperate',
    path: '/KLInitialInspection/operateTask',
    component: () => import('@/views/KLInitialInspection/modules/operateTask.vue'),
    hidden: true,
    meta: { text: '开炉初检-出站', returnPath: '/KLInitialInspection'}
  },
  // 终检包装
  {
    name: 'finalInspectionPack',
    path: '/finalInspectionPack',
    component: () => import('@/views/finalInspectionPack/index'),
    hidden: true,
    meta: {text: '终检包装'}
  },
  {
    name: 'finalInspectionPackOperate',
    path: '/finalInspectionPack/operateTask',
    component: () => import('@/views/finalInspectionPack/modules/operateTask.vue'),
    hidden: true,
    meta: { text: '终检包装', returnPath: '/finalInspectionPack'}
  },
  // 装炉长晶/成品入库
  {
    name: 'CPWarehousing',
    path: '/CPWarehousing',
    component: () => import('@/views/CPWarehousing/index'),
    hidden: true,
    meta: {text: '成品入库'}
  },
  {
    name: 'cpReset',
    path: '/CPWarehousing/CPReset',
    component: () => import('@/views/CPWarehousing/modules/cpReset.vue'),
    hidden: true,
    meta: { text: '重新判定', returnPath: '/CPWarehousing' }
  },
  // ------菜单栏------
  {
    name: 'overStation',
    path: '/overStation',
    component: () => import('@/views/overStation/index'),
    hidden: true,
    meta: {text: '过站操作'},
    props: true
  },

  // 其他
  {
    name: 'trendsform',
    path: '/trendsform',
    component: () => import('@/views/trendsform/index'),
    hidden: true,
    meta: {text: '动态表单', returnPath: '/'}
  },

  {
    name: 'overStationExecution',
    path: '/overStationExecution',
    component: () => import('@/views/overStation/index'),
    hidden: true,
    meta: {text: '过站操作'},
    props: true
  }
]

export default new Router({
  // mode: 'history',
  routes: constantRouterMap
})
