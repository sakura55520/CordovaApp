<!--来料检验-->
<template>
  <div class="scroller-flex-wrap">
    <el-tabs
      v-model="searchList.search_LIKE_formType"
      class="search-tabs"
      @tab-click="handleTabsClick">
      <el-tab-pane
        v-for="(item, index) in formTypeList"
        :label="item"
        :name="item"
        :key="index"
      />
    </el-tabs>

    <div class="scroller-main">
      <scroller ref="scroller" :on-refresh="refreshDirList" :on-infinite="infinite" noDataText="已显示全部数据"  class="directional">
        <div v-for="(item, index) in dirList" :key="index" class="card-item">
          <!-- head -->
          <div class="headLine">
            <div>
              <span class="headLine-name">任务工单 &nbsp;&nbsp; </span>
              <span class="headLine-value">{{ item.billNo }}</span>
            </div>
          </div>
          <!-- body -->
          <div :class="'grid-container'">
            <div class="grid-item">
              <span class="grid-item-name">数量：</span>
              <span class="grid-item-value"><span style="color: green;">{{ item.checkedCount }}</span>/<span>{{ item.count }}</span></span>
            </div>
            <div class="grid-item">
              <span class="grid-item-name">物料编码：</span>
              <span class="grid-item-value">{{ item.materialCode }}</span>
            </div>
            <div class="grid-item">
              <span class="grid-item-name">物料名称：</span>
              <span class="grid-item-value">{{ item.materialName }}</span>
            </div>
            <div class="grid-item">
              <span class="grid-item-name">任务创建时间：</span>
              <span class="grid-item-value">{{ item.createTime }}</span>
            </div>
          </div>
          <!-- menu -->
          <el-button class="menu" type="primary" plain @click="handle(item)">进入检验</el-button>
        </div>
      </scroller>
    </div>
  </div>
</template>

<script>
import * as Api from '@/api/incomingInspection'
import {initDate} from "@/utils/initDate";

export default {
  name: 'IncomingInspection',
  data() {
    return {
      searchList: {
        search_LIKE_formType: '籽晶',
      },
      formTypeList: ['籽晶', '石墨件'],
      page:1,
      rows:10,
      dirList:[],// 列表数据
    }
  },
  methods: {
    handleTabsClick() {
      this.refreshDirList()
    },
    // 操作
    handle(data){
      this.$router.push({ path: '/incomingInspection/detailFrom', query: { ...data }})
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
        rows:this.rows,
        search_GTE_createTime:initDate(31)[0], // 30天前至今
      }).then(res=>{
        this.dirList = res.data.rows || []
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
