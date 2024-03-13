<!--装炉长晶/终检包装-->
<template>
  <div class="scroller-wrap">
    <scroller ref="scroller" :on-refresh="refreshDirList" :on-infinite="infinite" noDataText="已显示全部数据"  class="directional">
      <div v-for="(item, index) in dirList" :key="index" class="card-item">
        <!-- head -->
        <div class="headLine">
          <div>
            <span class="headLine-name">炉次号 &nbsp;&nbsp; </span>
            <span class="headLine-value">{{ item.lotNo }}</span>
          </div>
          <el-tag effect="plain">待出站</el-tag>
        </div>
        <!-- body -->
        <div :class="'grid-container'">
          <div class="grid-item">
            <span class="grid-item-name">晶体编号：</span>
            <span class="grid-item-value">{{ item.lotNo }}</span>
          </div>
          <div class="grid-item">
            <span class="grid-item-name">订单号：</span>
            <span class="grid-item-value">{{ item.planOrderNo }}</span>
          </div>
          <div class="grid-item">
            <span class="grid-item-name">产品名称：</span>
            <span class="grid-item-value">{{ item.productName }}</span>
          </div>
          <div class="grid-item">
            <span class="grid-item-name">产品配方：</span>
            <span class="grid-item-value">{{ item.productFormula }}</span>
          </div>
          <div class="grid-item">
            <span class="grid-item-name">进站时间：</span>
            <span class="grid-item-value">{{ item.createTime }}</span>
          </div>
          <div class="grid-item">
            <span class="grid-item-name">停留时间：</span>
            <span class="grid-item-value residence-time">{{ $hoursFromNow(item.createTime) }}</span>
          </div>
        </div>
        <!-- menu -->
        <div style="display: flex;">
          <el-button class="menu" @click="operateTask(item)">操作任务</el-button>
        </div>
      </div>
    </scroller>
  </div>
</template>

<script>
import * as Api from '@/api/finalInspectionPack'

export default {
  name: 'FinalInspectionPack',
  data() {
    return {
      page:1,
      rows:10,
      dirList:[],// 列表数据
    }
  },
  methods: {
    // 操作
    operateTask(data){
      this.$router.push({ path: '/overStation', query: { processingOrderCode:data.lotNo }})
    },
    //取消(删除)
    deleteItem(item){
      this.$confirm('是否取消?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Api.chargeDelete({ids:item.id}).then(res => {
          this.$message.success('取消成功')
          this.refreshDirList()
        })
      })
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
        processName:'终检包装',
        page:this.page,
        rows:this.rows
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
