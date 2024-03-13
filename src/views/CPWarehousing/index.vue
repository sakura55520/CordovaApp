<!--装炉长晶/成品入库-->
<template>
  <div class="scroller-flex-wrap">
    <el-form
      :model="searchList"
      class="search-bar"
      @submit.native.prevent
    >
      <el-form-item>
        <el-input
          v-model="searchList.search_LLIKE_crystalNo"
          class="input-with-select"
          placeholder="请输入晶体编号"
          @keyup.enter.native="refreshDirList"
        >
          <i
            v-show="searchList.search_LLIKE_crystalNo"
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
      <div style="width: 100%;">
        <el-button class="block-btn" type="primary" plain @click="handleReset">重新判定</el-button>
      </div>
    </el-form>

    <div class="scroller-main">
      <scroller ref="scroller" :on-refresh="refreshDirList" :on-infinite="infinite" noDataText="已显示全部数据"  class="directional">
        <div
          v-for="(item, index) in dirList"
          :key="index"
          class="card-item"
          :class="{
          selected: lotNo2selected[item.lotNo],
          disabled: warehouseNumber && warehouseNumber !== item._warehouseNumber || !item._warehouseNumber
        }"
          @click="handleItemClick(item)"
        >
          <!-- head -->
          <el-alert v-if="!item._warehouseNumber" :closable="false" type="warning">无对应仓库!</el-alert>
          <div class="headLine">
            <div>
              <span class="headLine-name">晶体编号 &nbsp;&nbsp; </span>
              <span class="headLine-value">{{ item.crystalNo }}</span>
            </div>
            <div>
              <span class="headLine-name">批次号 &nbsp;&nbsp; </span>
              <span class="headLine-value">{{ item.lotNo }}</span>
            </div>
            <div>
              <el-tag>待入库</el-tag>
              <el-radio v-model="lotNo2selected[item.lotNo]" class="select" :label="true">&nbsp;</el-radio>
            </div>
          </div>
          <!-- body -->
          <div :class="'grid-container'">
            <div class="grid-item">
              <span class="grid-item-name">料号：</span>
              <span class="grid-item-value">{{ item.productCode }}</span>
            </div>
            <div class="grid-item">
              <span class="grid-item-name">数量：</span>
              <span class="grid-item-value">{{ item.num }}{{ item.unit }}</span>
            </div>
            <div class="grid-item">
              <span class="grid-item-name">产品信息：</span>
              <span class="grid-item-value">{{ item.productName }}</span>
            </div>
            <div class="grid-item">
              <span class="grid-item-name">规格：</span>
              <span class="grid-item-value">{{ item.spec }}</span>
            </div>
            <div class="grid-item">
              <span class="grid-item-name">晶体等级：</span>
              <span class="grid-item-value">{{ item.crystalGrade }}</span>
            </div>
            <div class="grid-item">
              <span class="grid-item-name">晶体去向：</span>
              <span class="grid-item-value">{{ item.destination }}</span>
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
        </div>
      </scroller>
      <!-- 页面操作 -->
      <div class="pageHandleBox">
        <el-button
          :disabled="!selectedCount"
          class="submit"
          type="primary"
          @click="warehousing()"
        >
          <template v-if="selectedCount">已选{{ selectedCount }}条, 发起入库</template>
          <template v-else>请选择</template>
        </el-button>
      </div>

      <WarehousingDialog
        :dialogVisible.sync="dialogVisible"
        :warehouseNumber="warehouseNumber"
        :fromTable="fromTable"
        @getByPage="fetchDirByPage"
      />
    </div>
  </div>

</template>

<script>
import * as Api from '@/api/CPWarehousing'
import WarehousingDialog from './modules/warehousingDialog';
import { getSeleteData } from '@/utils/select'

export default {
  name: 'CPWarehousing',
  components:{
    WarehousingDialog
  },
  data() {
    return {
      searchList: {
        search_LLIKE_crystalNo: null
      },
      page:1,
      rows:10,
      fromTable:[],
      dialogVisible:false,
      dirList:[],// 列表数据
      lotNo2selected: {},
      warehouseNumber: '', // 入库仓库编号
      warehouseRuleMap: {}, // 入库仓库规则, 晶体去向_晶体等级 to 入库仓库编号
      destination2unit: {}, // 晶体去向 to 单位
    }
  },
  computed: {
    selectedCount() {
      if (this.dirList.length) {
        let count = 0
        for (const lotNo in this.lotNo2selected) {
          if (this.lotNo2selected[lotNo]) count++
        }
        return count
      }
      return 0
    }
  },
  methods: {
    reset() {
      this.lotNo2selected = {}
      this.warehouseNumber = ''
    },
    // 选中判断
    handleItemClick({ lotNo, _warehouseNumber }){
      const selected = !this.lotNo2selected[lotNo]
      this.$set(this.lotNo2selected, lotNo, selected)
      if (selected) {
        this.warehouseNumber = _warehouseNumber
      } else if (!this.selectedCount) {
        this.warehouseNumber = ''
      }
    },
    // 发起入库
    warehousing(){
      this.fromTable = this.dirList.filter(({ lotNo }) => this.lotNo2selected[lotNo])
      this.fromTable = this.fromTable.map(item => {
        return {
          ...item,
          materialCode: item.productCode,
          materialName: item.productName,
        }
      })
      if(this.fromTable.length === 0)return this.$message.warning('请选择要出库的数据')
      this.dialogVisible = true
    },
    handleClear() {
      this.searchList.search_LLIKE_crystalNo = ''
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
    async fetchDirByPage(done){
      if (JSON.stringify(this.warehouseRuleMap) === '{}') {
        await this.fetchWarehouseRule()
      }
      if (JSON.stringify(this.destination2unit) === '{}') {
        await this.fetchPackDestination()
      }
      Api.listByPage({
        ...this.searchList,
        processName:'成品入库',
        page:this.page,
        rows:this.rows
      }).then(res=>{
        this.dirList = res.data.rows || []
        this.dirList.forEach(row => {
          // 晶体去向_晶体等级 to 入库仓库编号
          const { destination, crystalGrade } = row
          if (destination && crystalGrade) {
            row._warehouseNumber = this.warehouseRuleMap[destination + '_' + crystalGrade]
          }
          row.num = 1 // 应收主数量
          row.shouldUnit = this.destination2unit[destination] // 应收数量单位
        })
        if (res.data && res.data.total <= this.rows) {
          return done && done(true)
        }
        done && done()
      }).catch(err=>{
        done && done(true)
      })
    },
    async fetchWarehouseRule() {
      // 入库仓库规则
      const list = []
      await getSeleteData('zjZjbzMaterialCode', list)
      list.forEach(o => {
        // 晶体去向_晶体等级 to 入库仓库编号
        this.warehouseRuleMap[o.name + '_' + o.value] = o.extendValue1
      })
    },
    async fetchPackDestination() {
      // 晶体去向
      const list = []
      await getSeleteData('packDestination', list)
      list.forEach(o => {
        // 晶体去向 to 单位
        this.destination2unit[o.name] = o.extendValue1
      })
    },
    handleReset() {
      this.$router.push('/CPWarehousing/CPReset')
    }
  }
}
</script>

<style lang="scss" scoped>
.el-alert {
  display: inline;
}
</style>


