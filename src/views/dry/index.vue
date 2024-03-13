<!--烘干-->
<template>
  <div class="scroller-flex-wrap">
    <el-form
      :model="searchList"
      class="search-bar"
      @submit.native.prevent
    >
      <el-form-item>
        <el-input
          v-model="searchList.batchNo"
          class="input-with-select"
          :placeholder="`请输入${isCombined ? '烘干批次号' : '清洗批次号'}`"
          @keyup.enter.native="refreshDirList"
        >
          <i
            v-show="searchList.batchNo"
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

    <el-tabs
      v-model="formType"
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

        <el-button
          v-show="!isCombined"
          class="create_button"
          type="primary"
          plain
          style="margin-top: 0"
          @click="handleBatch"
        >
          批量烘干
        </el-button>

        <!--   已合批     -->
        <template v-if="isCombined">
          <div v-for="(item, index) in dirList" :key="index" class="card-item">
            <!-- head -->
            <div class="headLine">
              <div>
                <span class="headLine-name">烘干批次号 &nbsp;&nbsp; </span>
                <span class="headLine-value">{{ item.combinedBatchNo }}</span>
              </div>
              <div>
                <span class="headLine-name">烘干类型 &nbsp;&nbsp; </span>
                <span class="headLine-value">{{ item.operateType }}</span>
              </div>
              <div>
                <el-tag v-if="!item.submitType" effect="plain" type="info">待进站</el-tag>
                <el-tag v-else effect="plain">待出站</el-tag>
              </div>
            </div>
            <!-- body -->
            <div class="grid-item" style="padding: 5px;">
              <span class="grid-item-name" style="min-width: 82px">混合批次：</span>
              <span class="grid-item-value">{{ item.combinedMixBatch }}</span>
            </div>
            <div :class="'grid-container'">
              <div class="grid-item">
                <span class="grid-item-name">合批时间：</span>
                <span class="grid-item-value">{{ item.createTime }}</span>
              </div>
              <div class="grid-item">
                <span class="grid-item-name">数量：</span>
                <span class="grid-item-value">{{ item.totalWeight }}</span>
              </div>


              <!-- 待出站 时显示 -->
              <template v-if="item.submitType === 1">
                <div class="grid-item">
                  <span class="grid-item-name">停留时间：</span>
                  <span class="grid-item-value residence-time">{{ item.residenceTime }}</span>
                </div>
              </template>
            </div>
            <!-- menu -->
            <el-button class="menu" plain @click="operateTask(item)">操作任务</el-button>
          </div>
        </template>

        <!--   未合批     -->
        <template v-else>
          <div v-for="(item, index) in dirList" :key="index" class="card-item">
            <!-- head -->
            <div class="headLine">
              <div>
                <span class="headLine-name">清洗批次号 &nbsp;&nbsp; </span>
                <span class="headLine-value">{{ item.cleanBatchNo }}</span>
              </div>
              <div>
                <span class="headLine-name">清洗类型 &nbsp;&nbsp; </span>
                <span class="headLine-value">{{ formatOperateType(item.operateType) }}</span>
              </div>
              <div>
                <el-tag v-if="!item.submitType" effect="plain" type="info">待进站</el-tag>
                <el-tag v-else effect="plain">待出站</el-tag>
              </div>
            </div>
            <!-- body -->
            <div :class="'grid-container'">
              <div class="grid-item">
                <span class="grid-item-name">物料编码：</span>
                <span class="grid-item-value">{{ item.materialCode }}</span>
              </div>
              <div class="grid-item">
                <span class="grid-item-name">物料名称：</span>
                <span class="grid-item-value">{{ item.materialName }}</span>
              </div>

              <!-- S原料时 -->
              <div v-show="item.operateType === 0" class="grid-item">
                <span class="grid-item-name">规格：</span>
                <span class="grid-item-value">{{ item.spec }}</span>
              </div>
              <div class="grid-item">
                <span class="grid-item-name">{{ formatWeightLabel(item.operateType) }}：</span>
                <span class="grid-item-value">{{ item.totalWeight }}</span>
              </div>

              <!-- 待出站 时显示 -->
              <template v-if="item.submitType === 1">
                <div class="grid-item">
                  <span class="grid-item-name">进站时间：</span>
                  <span class="grid-item-value">{{ item.inTime }}</span>
                </div>
                <div class="grid-item">
                  <span class="grid-item-name">停留时间：</span>
                  <span class="grid-item-value residence-time">{{ item.residenceTime }}</span>
                </div>
              </template>
            </div>
            <!-- menu -->
            <el-button class="menu" plain @click="operateTask(item)">操作任务</el-button>
          </div>
        </template>
      </scroller>
    </div>

  </div>
</template>

<script>
import * as Api from '@/api/dry'
import {operateTypeList} from '@/constants'
import {hoursFromNow} from "@/utils/tool";

export default {
  name: 'Dry',
  data() {
    return {
      searchList: {
        batchNo: null
      },
      formType: '未合批',
      formTypeList: ['未合批', '已合批'],
      page:1,
      rows:10,
      dirList:[],// 列表数据
      operateType:0,
      operateTypeList // 清洗类型list
    }
  },
  computed: {
    // 是否为合批
    isCombined() {
      return this.formType === '已合批'
    }
  },
  methods: {
    handleTabsClick() {
      this.searchList.batchNo = ''
      this.refreshDirList()
    },
    // 操作
    operateTask(data){
      this.$router.push({ path: '/dry/operateTask', query: { ...data }})
    },
    handleClear() {
      this.searchList.batchNo = ''
      this.refreshDirList()
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
    fetchDirByPage(done) {
      if (this.isCombined) {
        // 已合批
        Api.fetchBatchList({
          search_LLIKE_combinedBatchNo: this.searchList.batchNo,
          search_IN_submitType: '0,1',
          page:this.page,
          rows:this.rows
        }).then(res=>{
          this.dirList = res.data.rows || []
          this.dirList.forEach(row => {
            row.residenceTime = hoursFromNow(row.createTime)
          })
          if (res.data && res.data.total <= this.rows) {
            return done && done(true)
          }
          done && done()
        }).catch(err=>{
          done && done(true)
        })
      } else {
        // 未合批
        Api.listByPage({
          search_LLIKE_cleanBatchNo: this.searchList.batchNo,
          search_EQ_combinedFlag: 0, // 未合批
          search_IN_submitType: '0,1',
          page: this.page,
          rows: this.rows
        }).then(res=>{
          this.dirList = res.data.rows || []
          this.dirList.forEach(row => {
            row.residenceTime = hoursFromNow(row.inTime)
          })
          if (res.data && res.data.total <= this.rows) {
            return done && done(true)
          }
          done && done()
        }).catch(err=>{
          done && done(true)
        })
      }
    },
    formatOperateType(type) {
      const matched = this.operateTypeList.find(item => item.value === type)
      return matched ? matched.label : type
    },
    formatWeightLabel(type) {
      let label = ''
      switch (type) {
        case 0: label = '混合料总重量'; break
        case 1: label = '重量'; break
        default: label = '数量'
      }
      return label
    },
    handleBatch() {
      this.$router.push({ path: '/dry/dryBatch' })
    }
  }
}
</script>
