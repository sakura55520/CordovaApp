<!--坩埚组装-->
<template>
  <div class="scroller-flex-wrap">
    <el-form
      :model="searchList"
      class="search-bar"
      @submit.native.prevent
    >
      <el-form-item>
        <el-input
          v-model="searchList.search_LLIKE_lotNo"
          class="input-with-select"
          placeholder="请输入炉次号"
          @keyup.enter.native="refreshDirList"
        >
          <i
            v-show="searchList.search_LLIKE_lotNo"
            slot="suffix"
            class="el-input__icon el-icon-circle-close"
            @click="handleClear"
          />
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="refreshDirList"
          />
        </el-input>
      </el-form-item>
    </el-form>

    <div class="scroller-main">
      <scroller ref="scroller" :on-refresh="refreshDirList" :on-infinite="infinite" noDataText="已显示全部数据"  class="directional">
        <div v-for="(item, index) in dirList" :key="index" class="card-item">
          <!-- head -->
          <div class="headLine">
            <div>
              <span class="headLine-name">炉次号 &nbsp;&nbsp; </span>
              <span class="headLine-value">{{ item.lotNo }}</span>
            </div>
            <el-tag v-if="!item.wipStorageStatus" effect="plain" type="info">待进站</el-tag>
            <el-tag v-else-if="item.wipStorageStatus === 1" effect="plain">待出站</el-tag>
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
          <div style="display: flex;">
            <el-button class="menu" @click="operateTask(item)">操作任务</el-button>
          </div>
        </div>
      </scroller>
    </div>
  </div>
</template>

<script>
import * as Api from '@/api/crucibleAssembly'

export default {
  name: 'CrucibleAssembly',
  data() {
    return {
      searchList: {
        search_LLIKE_lotNo: null
      },
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
    handleClear() {
      this.searchList.search_LLIKE_lotNo = ''
      this.refreshDirList()
    },
    // 下拉刷新
    refreshDirList(done){
      this.page = 1
      this.rows = this.page * 10
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
        processName:'坩埚组装',
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
