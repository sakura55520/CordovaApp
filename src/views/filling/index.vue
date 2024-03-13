<!--装埚-->
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
    </el-form>

    <div class="scroller-main">
      <scroller ref="scroller" :on-refresh="refreshDirList" :on-infinite="infinite" noDataText="已显示全部数据"  class="directional">
        <div v-for="(item, index) in list" :key="index" class="card-item">
          <!-- head -->
          <div class="headLine">
            <div>
              <span class="headLine-name">炉次号&nbsp;&nbsp; </span>
              <span class="headLine-value">{{ item.code }}</span>
            </div>
            <!-- <img src="@/assets/imgs/frame.png" alt=""> -->
            <div>
              <el-tag v-if="item.processType === 1" type="danger">返工</el-tag>
              <el-tag v-if="!item.wipStorageStatus" effect="plain" type="info">待进站</el-tag>
              <el-tag v-else-if="item.wipStorageStatus === 1" effect="plain">待出站</el-tag>
            </div>
          </div>
          <!-- body -->
          <div :class="'grid-container'">
            <div class="grid-item">
              <span class="grid-item-name">生产批号&nbsp;&nbsp;</span>
              <span class="grid-item-value">{{ item.dataObj.productionBatchNo }}</span>
            </div>
            <div class="grid-item">
              <span class="grid-item-name">产品名称&nbsp;&nbsp;</span>
              <span class="grid-item-value">{{ item.dataObj.productName }}</span>
            </div>
            <div class="grid-item">
              <span class="grid-item-name">产品配方&nbsp;&nbsp;</span>
              <span class="grid-item-value">{{ item.dataObj.productBomName }}</span>
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
                <span class="grid-item-name">预计投料时间&nbsp;&nbsp;</span>
                <span class="grid-item-value">{{ item.expectedFeedingTime }}</span>
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
          <el-button class="menu" type="primary" plain @click="handle('配料装埚',item)">配料装埚</el-button>
        </div>
      </scroller>
    </div>
  </div>
</template>

<script>
import * as Api from '@/api/filling/filling.js'
import { getSeleteData } from "@/utils/select";
import {getAfterTimeByMinute} from "@/utils/tool.js";

export default {
  name: 'Filling',
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
    }
  },
  mounted() {

  },
  methods: {
    handleClear() {
      this.searchList.code = ''
      this.refreshDirList()
    },
    // 操作
    handle(typeName='',data){
      if(typeName === '配料装埚'){
        this.$router.push({ path: '/overStation', query: { processingOrderCode:data.code }})
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
        ...this.searchList,
        processCode:'ZG',
        page:this.page,
        rows:this.rows
      }).then(res=>{
        this.list = res.data.rows || []

        let expectedFeedingTime = []
        getSeleteData('expectedFeedingTime',expectedFeedingTime).then(()=>{
          expectedFeedingTime.forEach((item,index)=>{
            if(item.name === '配料装埚'){
              this.list.forEach((item2,index2)=>{
                this.$set(this.list[index2],'expectedFeedingTime',getAfterTimeByMinute(item2.processGmtCreate,item.value))
              })
            }
          })
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

