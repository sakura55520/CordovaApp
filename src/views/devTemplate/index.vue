<!--装料-->
<template>
  <div class="scroller-wrap">
    <scroller ref="scroller" :on-refresh="refreshDirList" :on-infinite="infinite" noDataText="已显示全部数据"  class="directional">
      <div v-for="(item, index) in list" :key="index" class="card-item">
        <!-- head -->
        <div class="headLine">
          <div>
            <span class="headLine-name">工单批次号 &nbsp;&nbsp; </span>
            <span class="headLine-value">{{ item.orderNo }}</span>
          </div>
          <el-tag type="danger">{{item.orderType}}</el-tag>
        </div>
        <!-- body -->
        <div :class="'grid-container'">
          <div class="grid-item">
            <span class="grid-item-name">计划量：</span>
            <span class="grid-item-value">{{ item.planNumber }}</span>
          </div>
          <div class="grid-item">
            <span class="grid-item-name">已发量：</span>
            <span class="grid-item-value">{{ item.issuedNumber }}</span>
          </div>
          <div class="grid-item">
            <span class="grid-item-name">产品名称：</span>
            <span class="grid-item-value">{{ item.productName }}</span>
          </div>
          <div class="grid-item">
            <span class="grid-item-name">产品配方：</span>
            <span class="grid-item-value">{{ item.productBom }}</span>
          </div>
          <div class="grid-item">
            <span class="grid-item-name">预计投料时间：</span>
            <span class="grid-item-value">{{ item.planTime }}</span>
          </div>
        </div>
        <!-- menu -->
        <el-button class="menu" type="primary" plain @click="handle('生产发料',item)">生产发料</el-button>
      </div>
    </scroller>
  </div>
</template>

<script>
import * as Api from '@/api/producIssueStuff/producIssueStuff.js'

export default {
  name: 'DirList',
  data() {
    return {
      page:1,
      rows:10,
      list:[],// 列表数据
    }
  },
  mounted() {

  },
  methods: {
    // 操作
    handle(typeName='',data){
      if(typeName === '生产发料'){
        this.$router.push({ path: '/producIssueStuff/producIssueStuffDetail', query: { ...data }})
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


