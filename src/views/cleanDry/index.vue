<!--清洗-->
<template>
  <div class="scroller-flex-wrap">
    <el-form
      :model="searchList"
      class="search-bar"
      @submit.native.prevent
    >
      <el-form-item>
        <el-input
          v-model="searchList.search_LIKE_cleanBatchNo"
          class="input-with-select"
          placeholder="请输入清洗批次号"
          @keyup.enter.native="refreshDirList"
        >
          <i
            v-show="searchList.search_LIKE_cleanBatchNo"
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
        <el-button class="create_button" type="primary" icon="el-icon-plus" plain @click="dialogVisible = true">创建清洗批次</el-button>
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
            <el-tag effect="plain">待出站</el-tag>
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
          <el-button class="menu" plain @click="operateTask(item)">操作任务</el-button>
        </div>
      </scroller>

      <el-dialog
        :visible.sync="dialogVisible"
        :before-close="handleDialogClose"
        title="请选择清洗类型"
        width="70%"
      >
        <el-radio-group v-model="operateType" class="operate-type-list">
          <el-radio-button v-for="item in operateTypeList" :label="item.value" :key="item.value">{{ item.label }}</el-radio-button>
        </el-radio-group>
        <div slot="footer" class="dialog-footer">
          <el-button class="save" @click="handleDialogClose">取 消</el-button>
          <el-button class="submit" type="primary" @click="create">确认选择</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import * as Api from '@/api/cleanDry'
import {operateTypeList} from '@/constants'

export default {
  name: 'CleanDry',
  data() {
    return {
      searchList: {
        search_LIKE_cleanBatchNo: null
      },
      page:1,
      rows:10,
      dirList:[],// 列表数据
      dialogVisible:false,
      operateType:0,
      operateTypeList // 清洗类型list
    }
  },
  methods: {
    // 操作
    operateTask(data){
      this.$router.push({ path: '/cleanDry/operateTask', query: { ...data }})
    },
    // 创建
    create(){
      this.$router.push({ path: '/cleanDry/createFrom', query: { operateType:this.operateType }})
    },
    handleDialogClose(){
      this.dialogVisible = false
    },
    handleClear() {
      this.searchList.search_LIKE_cleanBatchNo = ''
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
    fetchDirByPage(done){
      Api.listByPage({
        ...this.searchList,
        search_EQ_submitType:0,
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
    }
  }
}
</script>
