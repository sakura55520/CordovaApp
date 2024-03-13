<!--籽晶粘贴/成品入库-->
<template>
  <div class="scroller-flex-wrap">
    <el-form
      :model="searchList"
      class="search-bar"
      label-width="85px"
      @submit.native.prevent
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="籽晶编号">
            <el-input
              v-model="searchList.search_LIKE_uniqueCode"
              class="input-with-select"
              placeholder="请输入籽晶编号"
              @keyup.enter.native="refreshDirList"
            >
              <i
                v-show="searchList.search_LIKE_uniqueCode"
                slot="suffix"
                class="el-input__icon el-icon-circle-close"
                @click="handleClear"
              />
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="等级">
            <el-select v-model="searchList.search_EQ_materialLevel" placeholder="请选择等级" clearable style="width: 100%;" @change="refreshDirList">
              <el-option v-for="(item, index) in checkLevelList" :key="index" :value="item.value" :label="item.label"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <div class="seed-date">
        <el-form-item label="进站时间">
          <el-date-picker
            v-model="dateTime"
            :picker-options="pickerOptions"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            style="width: 100%;"
            @change="refreshDirList"
          />
        </el-form-item>
        <el-button class="search-btn" type="primary" icon="el-icon-search" @click="refreshDirList">查询</el-button>
      </div>

      <div style="width: 100%;margin-top: 5px;">
        <el-button class="block-btn" type="primary" plain @click="handleReset">重新判定</el-button>
      </div>

    </el-form>

    <div class="scroller-main">
      <scroller ref="scroller" :on-refresh="refreshDirList" :on-infinite="infinite" noDataText="已显示全部数据" class="directional">
        <div
          v-for="(item, index) in list"
          :key="index"
          class="card-item"
          :class="[id2selected[item.id] || selectedId === item.id ? 'selected' : '']"
          @click="handleItemClick(item)"
        >
          <!-- head -->
          <div class="headLine">
            <div>
              <span class="headLine-name">籽晶编号</span>
              <span class="headLine-value">{{ item.uniqueCode }}</span>
            </div>
            <div>
              <span class="headLine-name">等级</span>
              <span class="headLine-value">{{ item.materialLevel }}</span>
            </div>
            <div>
              <el-tag>待入库</el-tag>
              <el-radio v-model="id2selected[item.id]" class="select" :label="true">&nbsp;</el-radio>
            </div>
          </div>
          <!-- body -->
          <div :class="'grid-container'">
            <div class="grid-item">
              <span class="grid-item-name">物料编码(料号)：</span>
              <span class="grid-item-value">{{ item.materialCode }}</span>
            </div>
            <div class="grid-item">
              <span class="grid-item-name">产品名称：</span>
              <span class="grid-item-value">{{ item.materialName }}</span>
            </div>
            <!--          <div class="grid-item">-->
            <!--            <span class="grid-item-name">直径：</span>-->
            <!--            <span class="grid-item-value">{{ item.diameter }}</span>-->
            <!--          </div>-->
            <div class="grid-item">
              <span class="grid-item-name">规格：</span>
              <span class="grid-item-value">{{ item.specification }}</span>
            </div>
            <div class="grid-item">
              <span class="grid-item-name">类型：</span>
              <span class="grid-item-value">{{ item.materialType }}</span>
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
        </div>
      </scroller>
      <!-- 页面操作 -->
      <div class="pageHandleBox">
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
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
        :visible.sync="dialogVisible"
        :fromTable="fromTable"
        @has-down="refreshDirList"
      />
    </div>
  </div>
</template>

<script>
import * as Api from '@/api/seedWarehousing'
import WarehousingDialog from './modules/warehousingDialog';
import {getSeleteData} from "@/utils/select";

export default {
  name: 'seedWarehousing',
  components: {
    WarehousingDialog
  },
  data() {
    return {
      checkLevelList: [],
      dateTime: [],
      pickerOptions: {
        shortcuts: [
          {
            text: '最近三天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }
        ]
      },
      searchList: {
        search_LIKE_uniqueCode: null,
        search_EQ_materialLevel: null,
      },
      page: 1,
      rows: 10,
      fromTable: [],
      dialogVisible: false,
      list: [],// 列表数据
      id2selected: {},
      selectedId: null,
      isIndeterminate: false,
      checkAll: false,
    }
  },
  computed: {
    computedSearch() {
      const dateTime = this.dateTime || []
      return {
        ...this.searchList,
        search_GTE_inTime: dateTime[0],
        search_LTE_inTime: dateTime[1],
      }
    },
    selectedCount() {
      let count = 0
      if (this.list.length) {
        for (const id in this.id2selected) {
          if (this.id2selected[id]) count++
        }
      }
      return count
    }
  },
  created() {
    getSeleteData('seedCrystalLevel', this.checkLevelList) // 籽晶等级list
  },
  methods: {
    reset() {
      this.isIndeterminate = false
      this.checkAll = false
      this.id2selected = {}
    },
    handleCheckAllChange(val) {
      this.isIndeterminate = false
      if (val) {
        this.list.forEach(({ id }) => {
          this.$set(this.id2selected, id, true)
        })
      } else {
        this.id2selected = {}
      }
    },
    //选中判断
    handleItemClick({ id }) {
      this.$set(this.id2selected, id, !this.id2selected[id])
      this.checkAll = this.selectedCount === this.list.length
      this.isIndeterminate = this.selectedCount > 0 && this.selectedCount < this.list.length
    },
    // 发起入库
    warehousing() {
      if (!this.selectedCount) return this.$message.error('请至少选择一条数据!')
      this.fromTable = this.list.filter(({ id }) => this.id2selected[id])
      this.fromTable.forEach(row => {
        // 批次号生成规则：籽晶编号+籽晶类型+直径，如：CE330320衬底157
        const levelMap = {
          U: '籽晶',
          P: '衬底',
          D: '测试',
        }
        row.batchNo = (row.uniqueCode || '') + (levelMap[row.materialLevel] || '') + (row.diameter || '')
        row.quantity = 1
        row.unitName = '颗'
        delete row.status
      })
      this.dialogVisible = true
    },
    handleClear() {
      this.searchList.search_LIKE_uniqueCode = ''
      this.refreshDirList()
    },
    // 下拉刷新
    refreshDirList(done) {
      this.reset()
      this.page = 1
      this.rows = this.page * 10
      this.fetchDirByPage(done)
    },
    // 滚动加载
    infinite(done) {
      this.rows += this.page * 10
      this.fetchDirByPage(done)
    },
    // 加载数据
    fetchDirByPage(done) {
      Api.listByPage({
        ...this.computedSearch,
        search_EQ_status: '待入库',
        page: this.page,
        rows: this.rows
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
    handleReset() {
      this.$router.push('/seedWarehousing/seedReset')
    }
  }
}
</script>

<style scoped>
.seed-date {
  display: flex;
  gap: 20px;
  > .el-form-item {
    flex: 1;
  }
}
</style>
