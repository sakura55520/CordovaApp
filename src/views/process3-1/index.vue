<!--工序3-1-->
<template>
  <div class="scroller-wrap">
    <scroller ref="scroller" :on-refresh="refreshList" :on-infinite="infinite" noDataText="已显示全部数据" class="ectional">

      <el-button class="create_button" type="text" plain @click="handleRack">
        <!-- 统计待进站数量, badge设置为null则不显示 -->
        <el-badge :value="pendingCount" :max="99" class="tag-badge">批量上料</el-badge>
      </el-button>

      <div v-for="(item, index) in list" :key="index" class="card-item">
        <!-- head -->
        <div class="headLine">
          <div>
            <span class="headLine-name">设备号 &nbsp;&nbsp; </span>
            <span class="headLine-value">{{ item.equipmentCode }}</span>
          </div>
          <el-tag effect="plain">待出站</el-tag>
        </div>
        <!-- body -->
        <div :class="'grid-container'">
          <div class="grid-item">
            <span class="grid-item-name">籽晶数量：</span>
            <span class="grid-item-value">
              <span>{{ item.total }}</span>
            </span>
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
</template>

<script>
import * as Api from '@/api/process3-1'

export default {
  name: 'process3-1',
  data() {
    return {
      page: 1,
      rows: 10,
      list: [],// 列表数据
      pendingCount: null
    }
  },
  created() {
    this.getPendingCount()
  },
  methods: {
    // 操作
    handle(data) {
      this.$router.push({
        path: '/process3-1/process3-1Detail',
        query: {
          ...data,
          deviceCode: data.equipmentCode,
        }
      })
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
      Api.groupByDevice({
        page: this.page,
        rows: this.rows,
        processName: '工序3-1',
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
    handleRack() {
      this.$router.push({ path: '/process3-1/process3-1Rack' })
    },
    // 获取待进站数量
    getPendingCount() {
      Api.listByPage({
        page: 1,
        rows: 100, // 最多100条, 超过100时, 显示99+
        processName: '工序3-1',
        wipStorageStatus: 0, // 在制品状态，1：已进站，0：待进站
      }).then(res => {
        this.pendingCount = res.data.total || null
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
