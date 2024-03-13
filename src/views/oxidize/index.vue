<!--氧化-->
<template>
  <div class="scroller-flex-wrap">
    <el-form
      :model="searchList"
      class="search-bar"
      @submit.native.prevent
    >
      <el-form-item>
        <el-input
          v-model="searchList.code"
          class="input-with-select"
          placeholder="请输入炉次号"
          @keyup.enter.native="refreshDirList"
        >
          <i
            v-show="searchList.code"
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
      <div style="width: 100%;margin-top: 5px;">
        <p v-if="isCreateBatchProcessing" style="width: 100%;text-align: center;color: #409eff;line-height: 35px;">请选择需要合批加工的任务单</p>
        <el-button v-else style="width: 100%;" type="primary" plain @click="handle('创建合批加工')">+ 创建合批加工</el-button>
      </div>
    </el-form>

    <div class="scroller-main">
      <scroller ref="scroller" :on-refresh="refreshDirList" :on-infinite="infinite" noDataText="已显示全部数据"  class="directional">
        <div
          v-for="(item, index) in list"
          :key="index"
          class="card-item"
          :class="[isCreateBatchProcessing && id2selected[item.id] ? 'selected' : '']"
          @click="handleItemClick(item)"
        >
          <!-- head -->
          <div class="headLine">
            <div>
              <span class="headLine-name">炉次号&nbsp;&nbsp; </span>
              <span class="headLine-value">{{ item.code }}</span>
            </div>
            <div>
              <el-tag v-if="item.processType" type="danger">返工</el-tag>
              <el-tag v-if="!item.wipStorageStatus" effect="plain" type="info">待进站</el-tag>
              <el-tag v-else-if="item.wipStorageStatus === 1" effect="plain">待出站</el-tag>
              <el-radio v-if="isCreateBatchProcessing" v-model="id2selected[item.code]" class="select" :label="true">&nbsp;</el-radio>
            </div>
          </div>
          <!-- body -->
          <div :class="'grid-container'">
            <div class="grid-item">
              <span class="grid-item-name">生产批号&nbsp;&nbsp;</span>
              <span v-if="item.dataObj" class="grid-item-value">{{ item.dataObj.productionBatchNo }}</span>
            </div>
            <div class="grid-item">
              <span class="grid-item-name">产品名称&nbsp;&nbsp;</span>
              <span v-if="item.dataObj" class="grid-item-value">{{ item.dataObj.productName }}</span>
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
          <el-button v-if="!isCreateBatchProcessing" class="menu" type="primary" plain @click="handle('操作任务',item)">操作任务</el-button>
        </div>
      </scroller>

      <!-- 页面操作 -->
      <div v-if="isCreateBatchProcessing" class="pageHandleBox">
        <el-button class="save" @click="handle('取消')">取消</el-button>
        <el-button
          :disabled="!selectedCount"
          class="submit"
          type="primary"
          @click="handle('确认选择')"
        >
          <template v-if="selectedCount">已选{{ selectedCount }}条, 确认选择</template>
          <template v-else>请选择</template>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import * as Api from '@/api/oxidize/oxidize.js'

export default {
  name: 'Oxidize',
  data() {
    return {
      statusList: [
        { value: '0', label: '待进站' },
        { value: '1', label: '待出站' },
      ],
      searchList: {
        code: null,
        search_EQ_wipStorageStatus: '0'
      },
      page:1,
      rows:10,
      list:[],// 列表数据
      isCreateBatchProcessing:false,
      id2selected: {},
    }
  },
  computed: {
    selectedCount() {
      if (this.list.length) {
        let count = 0
        for (const code in this.id2selected) {
          if (this.id2selected[code]) count++
        }
        return count
      }
      return 0
    }
  },
  methods: {
    reset() {
      this.id2selected = {}
    },
    // 操作
    handle(typeName='',data){
      if(typeName === '操作任务'){
        this.$router.push({ path: '/overStation', query: { processingOrderCode:data.code }})
      }
      if(typeName === '创建合批加工'){
        this.isCreateBatchProcessing = true
        this.reset()
      }
      if(typeName === '取消'){
        this.isCreateBatchProcessing = false
      }
      if(typeName === '确认选择'){
        if (!this.selectedCount) return this.$message.error('请至少选择一条任务单!')

        const orderCodes = this.list
          .filter(({ code }) => this.id2selected[code])
          .map(({ code }) => code)
        Api.getCurrentWipStorageData({processingOrderCode: orderCodes[0]}).then(res=>{
          let data = {
            orderCodes,
            processUuid:res.data[0].processUuid,
            wipStorageStatus:res.data[0].wipStorageStatus
          }
          Api.orderBlending(data).then(res=>{
            this.$message.success('合批成功')
            this.isCreateBatchProcessing = false
          })
        })
      }
    },
    handleClear() {
      this.searchList.code = ''
      this.refreshDirList()
    },
    // 下拉刷新
    refreshDirList(done){
      this.reset()
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
        processCode:'YH',
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
    handleItemClick({ code }) {
      if (this.isCreateBatchProcessing) {
        this.$set(this.id2selected, code, !this.id2selected[code])
      }
    }
  }
}
</script>

