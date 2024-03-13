<!--
装炉
orderType: 1合成, 2原料预处理, 3长晶
 -->
<template>
  <div class="scroller-flex-wrap">
    <el-form
      :model="searchList"
      class="search-bar"
      @submit.native.prevent
    >
      <el-form-item>
        <el-input
          v-model="searchList.search_LLIKE_code"
          class="input-with-select"
          placeholder="请输入炉次号"
          @keyup.enter.native="refreshDirList"
        >
          <i
            v-show="searchList.search_LLIKE_code"
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
      <el-tabs
        v-model="searchList.search_EQ_wipStorageStatus"
        class="search-tabs"
        @tab-click="refreshDirList">
        <el-tab-pane
          v-for="(item, index) in statusList"
          :label="item.label"
          :name="item.value"
          :key="index"
        />
      </el-tabs>
    </el-form>

    <div class="scroller-main">
      <scroller ref="scroller" :on-refresh="refreshDirList" :on-infinite="infinite" noDataText="已显示全部数据"  class="directional">
        <div v-for="(item, index) in dirList" :key="index" class="card-item">
          <!-- head -->
          <div class="headLine">
            <div>
              <span class="headLine-name">炉次号： </span>
              <span class="headLine-value">{{ item.lotNo }}</span>
            </div>

            <!-- 长晶 -->
            <!-- 炉次号 晶体编号 是一样的 -->
            <div v-if="item.orderType === 3">
              <span class="headLine-name">晶体编号： </span>
              <span class="headLine-value">{{ item.lotNo }}</span>
            </div>

            <div>
              <el-tag effect="plain" :type="getType(item.orderType)"> {{ getText(item.orderType) }} </el-tag>
              <el-tag v-if="!item.wipStorageStatus" effect="plain" type="info">待进站</el-tag>
              <el-tag v-else-if="item.wipStorageStatus === 1" effect="plain">待出站</el-tag>
            </div>
          </div>
          <!-- body -->
          <div :class="'grid-container'">
            <!-- 合成 -->
            <div v-if="item.orderType === 1" class="grid-item">
              <span class="grid-item-name">生产批次号：</span>
              <span class="grid-item-value">{{ item.lotNo }}</span>
            </div>

            <!-- 原料预处理 -->
            <div v-if="item.orderType === 2" class="grid-item">
              <span class="grid-item-name">生产工单：</span>
              <span class="grid-item-value">{{ item.planOrderNo }}</span>
            </div>

            <!-- 长晶 -->
            <div v-if="item.orderType === 3" class="grid-item">
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
              <span class="grid-item-name">预计产出时间：</span>
              <span class="grid-item-value">{{ item.estimateProductionTime }}</span>
            </div>

            <!-- 待进站 -->
            <template v-if="!item.wipStorageStatus">
              <div class="grid-item">
                <span class="grid-item-name">创建时间：</span>
                <span class="grid-item-value">{{ item.processGmtCreate }}</span>
              </div>
              <div class="grid-item">
                <span class="grid-item-name">停留时间：</span>
                <span class="grid-item-value residence-time">{{ item._durationIn }}</span>
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
                <span class="grid-item-value residence-time">{{ item._durationOut }}</span>
              </div>
            </template>
          </div>

          <div style="display: flex;">
            <el-button
              :class="{'menu-danger': item._markRed}"
              class="menu"
              :type="item._markRed ? 'danger' : 'primary'"
              plain
              @click="operateTask(item)"
            >
              <span v-if="item._diffEstimate" class="menu-icon">{{ item._diffEstimate }}</span>
              操作任务
            </el-button>
          </div>
        </div>
      </scroller>
    </div>
  </div>
</template>

<script>
import * as Api from '@/api/feed'

export default {
  name: 'Feed',
  data() {
    return {
      statusList: [
        { value: '0', label: '待进站' },
        { value: '1', label: '待出站' },
      ],
      searchList: {
        search_LLIKE_code: null,
        search_EQ_wipStorageStatus: '0'
      },
      page:1,
      rows:10,
      dirList:[],// 列表数据
    }
  },
  methods: {
    getType(type){
      switch (type) {
        case 1:
          return 'success'
        case 2:
          return ''
        case 3:
          return 'warning'
        default:
          return 'success'
      }
    },
    getText(type){
      switch (type) {
        case 1:
          return '合成'
        case 2:
          return '原料预处理'
        case 3:
          return '长晶'
        default:
          return type
      }
    },
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
      this.searchList.search_LLIKE_code = ''
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
        search_EQ_processName:'装炉',
        page:this.page,
        rows:this.rows
      }).then(res=>{
        this.dirList = res.data.rows || []
        this.dirList.forEach(item => {
          if (!item.wipStorageStatus) {
            // 待进站
            item._durationIn = this.$hoursFromNow(item.processGmtCreate)
          } else {
            item._durationOut = this.$hoursFromNow(item.inTime)
          }
          if (item.estimateProductionTime) {
            // 计算'预计产出时间' 至今 的时间差
            item._diffEstimate = this.$hoursFromNow(item.estimateProductionTime, true)
            item._markRed = item._diffEstimate && Number.parseFloat(item._diffEstimate) < 12
          }
        })
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



