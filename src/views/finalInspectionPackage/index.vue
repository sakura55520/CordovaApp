<!--原料合成/终检包装-->
<template>
  <div class="scroller-flex-wrap">
    <el-tabs
      v-model="searchList.meshNumber"
      class="search-tabs"
      @tab-click="handleTabsClick">
      <el-tab-pane
        v-for="(item, index) in meshList"
        :label="item"
        :name="item"
        :key="index"
      />
    </el-tabs>

    <div class="scroller-main">
      <scroller
        ref="scroller"
        v-if="meshList && meshList.length && searchList.meshNumber"
        :on-refresh="refreshDirList"
        :on-infinite="infinite"
        noDataText="已显示全部数据"
        class="directional"
      >
        <div v-for="(item, index) in list" :key="index" class="card-item">
          <!-- head -->
          <div class="headLine">
            <div>
              <span class="headLine-name">炉次号&nbsp;&nbsp; </span>
              <span class="headLine-value">{{ item.code }}</span>
            </div>
            <div>
              <el-tag v-if="item.processType === 0" type="success">正常</el-tag>
              <el-tag v-if="item.processType === 1" type="danger">返工</el-tag>
              <el-tag v-if="!item.wipStorageStatus" effect="plain" type="info">待进站</el-tag>
              <el-tag v-else-if="item.wipStorageStatus === 1" effect="plain">待出站</el-tag>
            </div>
          </div>
          <!-- body -->
          <div :class="'grid-container'">
            <div class="grid-item">
              <span class="grid-item-name">生产批号&nbsp;&nbsp;</span>
              <span class="grid-item-value">{{ item.dataObj.productionBatchNo }}</span>
            </div>
            <div class="grid-item">
              <span class="grid-item-name">目数&nbsp;&nbsp;</span>
              <span class="grid-item-value">{{ item.dataObj.meshNumber }}</span>
            </div>
            <div class="grid-item">
              <span class="grid-item-name">包装重量&nbsp;&nbsp;</span>
              <span class="grid-item-value">{{ item.number }}</span>
            </div>
            <div class="grid-item">
              <span class="grid-item-name">产品名称&nbsp;&nbsp;</span>
              <span class="grid-item-value">{{ item.dataObj.productName }}</span>
            </div>

            <!-- 待进站 -->
            <template v-if="!item.wipStorageStatus">
              <div class="grid-item">
                <span class="grid-item-name">创建时间：</span>
                <span class="grid-item-value">{{ item.processGmtCreate }}</span>
              </div>
              <div class="grid-item">
                <span class="grid-item-name">停留时间：</span>
                <span class="grid-item-value residence-time">{{ $hoursFromNow(item.processGmtCreate) }}</span>
              </div>
              <div class="grid-item">
                <span class="grid-item-name">创建人：</span>
                <span class="grid-item-value">{{ item.processUserCreate }}</span>
              </div>
            </template>

            <!-- 待出站 -->
            <template v-else>
              <div class="grid-item">
                <span class="grid-item-name">进站时间：</span>
                <span class="grid-item-value">{{ item.inTime }}</span>
              </div>
              <div class="grid-item">
                <span class="grid-item-name">停留时间：</span>
                <span class="grid-item-value residence-time">{{ $hoursFromNow(item.inTime) }}</span>
              </div>
            </template>
          </div>
          <!-- menu -->
          <el-button class="menu" type="primary" plain @click="handle('终检包装',item)">终检包装</el-button>
        </div>
      </scroller>
    </div>
  </div>
</template>

<script>
import * as Api from '@/api/finalInspectionPackage/finalInspectionPackage.js'
import { getSeleteData } from "@/utils/select";

export default {
  name: 'FinalInspectionPackage',
  data() {
    return {
      searchList: {
        meshNumber: '',
        processCode:'ZJBZ-Y',
      },
      meshList: [], // 目数list
      page:1,
      rows:10,
      list:[],// 列表数据
    }
  },
  async mounted() {
    const meshList = []
    await getSeleteData('SICpowder', meshList) // 目数list
    this.meshList = [...new Set(meshList.map(item => item.name))] // 去重
    if (this.meshList && this.meshList.length) {
      this.searchList.meshNumber = this.meshList[0]
    }
  },
  methods: {
    handleTabsClick() {
      this.refreshDirList()
    },
    // 操作
    handle(typeName='',data){
      if(typeName === '终检包装'){
        this.$router.push({ path: '/overStation', query: { processingOrderCode:data.code }})
      }
    },
    // 下拉刷新
    refreshDirList(done){
      this.page = 1
      this.rows = this.page * 20
      this.fetchDirByPage(done)
    },
    // 滚动加载
    infinite(done){
      this.rows += this.page * 10
      this.fetchDirByPage(done)
    },
    // 加载数据
    fetchDirByPage(done){
      Api.listByPage({
        ...this.searchList,
        page:this.page,
        rows:this.rows
      }).then(res=>{
        this.list = res.data.rows || []
        if (res.data && res.data.total <= this.rows) {
          return done && done(true)
        }
        done && done()
      }).catch(err=>{
        done && done(true)
      })
    },
  }
}
</script>
