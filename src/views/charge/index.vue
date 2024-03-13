<!--装料-->
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
        <el-button class="create_button" type="primary" icon="el-icon-plus" plain @click="dialogVisible = true">创建任务</el-button>
        <div v-for="(item, index) in dirList" :key="index" class="card-item">
          <!-- head -->
          <div class="headLine">
            <div>
              <span class="headLine-name">炉次号 &nbsp;&nbsp; </span>
              <span class="headLine-value">{{ item.code }}</span>
            </div>
          </div>
          <!-- body -->
          <div :class="'grid-container'">
            <div class="grid-item">
              <span class="grid-item-name">订单号：</span>
              <span class="grid-item-value">{{ item.productOrderName }}</span>
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
            <el-button class="menu" @click="deleteItem(item)">取消</el-button>
            <el-button class="menu" pain @click="operateTask(item)">操作任务</el-button>
          </div>
        </div>
      </scroller>
    </div>

    <el-dialog
      :visible.sync="dialogVisible"
      title="请选择工序"
      width="70%"
    >
      <el-radio-group v-model="operateType" class="operate-type-list">
        <el-radio-button v-for="item in operateTypeList" :label="item" :key="item">{{ item }}</el-radio-button>
      </el-radio-group>
      <div slot="footer" class="dialog-footer">
        <el-button class="save" @click="dialogVisible=false">取 消</el-button>
        <el-button class="submit" type="primary" @click="create">确认选择</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as Api from '@/api/charge'

export default {
  name: 'Charge',
  data() {
    return {
      searchList: {
        search_LLIKE_lotNo: null
      },
      page:1,
      rows:10,
      dirList:[],// 列表数据
      dialogVisible:false,
      operateType: '预处理',
      operateTypeList: ['预处理', '长晶']
    }
  },
  methods: {
    // 操作
    operateTask(data){
      this.$router.push({ path: '/charge/operateTask', query: { ...data }})
    },
    // 创建
    create(){
      this.$router.push({
        path: '/charge/createFrom',
        query: {
          operateType: this.operateType
        }
      })
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
        processName:'装料',
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
