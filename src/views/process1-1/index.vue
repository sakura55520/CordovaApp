<!--工序1-1-->
<template>
  <div class="scroller-flex-wrap">
    <el-form
      :model="searchList"
      class="search-bar"
      @submit.native.prevent
    >
      <div class="search-row">
        <el-form-item>
          <CodeScanner v-model="searchList.processingCode" placeholder="请扫描籽晶编号" style="" @has-done="refreshList" @clear="refreshList"/>
        </el-form-item>
        <el-button class="search-btn" type="primary" icon="el-icon-search" @click="refreshList">查询</el-button>
      </div>
    </el-form>

    <div class="scroller-main">
      <scroller ref="scroller" :on-refresh="refreshList" :on-infinite="infinite" noDataText="已显示全部数据" class="directional">
        <div v-for="(item, index) in list" :key="index" class="card-item">
          <!-- head -->
          <div class="headLine">
            <div>
              <span class="headLine-name">籽晶编号 &nbsp;&nbsp; </span>
              <span class="headLine-value">{{ item.uniqueCode }}</span>
            </div>
            <el-tag effect="plain">待出站</el-tag>
          </div>
          <!-- body -->
          <div :class="'grid-container'">
            <div class="grid-item">
              <span class="grid-item-name">订单号：</span>
              <span class="grid-item-value">
              <span>{{ item.planOrderNo }}</span>
            </span>
            </div>
            <div class="grid-item">
              <span class="grid-item-name">产品名称：</span>
              <span class="grid-item-value">{{ item.materialName }}</span>
            </div>
            <div class="grid-item">
              <span class="grid-item-name">进站时间：</span>
              <span class="grid-item-value">{{ item.inTime }}</span>
            </div>
            <div class="grid-item">
              <span class="grid-item-name">停留时间：</span>
              <span class="grid-item-value residence-time">{{ $hoursFromNow(item.inTime) }}</span>
            </div>
          </div>
          <!-- menu -->
          <el-button class="menu" type="primary" plain @click="handle(item)">操作任务</el-button>
        </div>
      </scroller>
    </div>
  </div>
</template>

<script>
import * as Api from '@/api/process1-1'
import CodeScanner from "@/components/CodeScanner.vue";

export default {
  name: 'process1-1',
  components: {CodeScanner},
  data() {
    return {
      searchList: {
        processingCode: null
      },
      page: 1,
      rows: 10,
      list: [],// 列表数据
    }
  },
  methods: {
    // 操作
    handle(data) {
      this.$router.push({ path: '/overStation', query: { processingOrderCode: data.uniqueCode }})
    },
    // 下拉刷新
    refreshList(done) {
      this.page = 1
      this.rows = this.page * 20
      this.fetchByPage(done)
    },
    // 滚动加载
    infinite(done) {
      this.rows += this.page * 10
      this.fetchByPage(done)
    },
    // 加载数据
    fetchByPage(done) {
      Api.listByPage({
        ...this.searchList,
        page: this.page,
        rows: this.rows,
        processName: '工序1-1',
        wipStorageStatus: 1, // 在制品状态，1：已进站，0：待进站
      }).then(res => {
        this.list = res.data.rows || []
        if (res.data && res.data.total <= this.rows) {
          return done && done(true)
        }
        done && done()
      }).catch(err => {
        done && done(true)
      })
    },
  }
}
</script>

<style lang="scss" scoped>

</style>
