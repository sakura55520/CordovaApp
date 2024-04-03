<template>
  <div
    :class="[$store.getters.fromPC ? 'admin_wrapper' : 'scroller-flex-wrap']"
  >
    <!--   PC端展示   -->
    <el-form v-if="$store.getters.fromPC" v-model="searchList" inline size="small">
      <div class="search-header-style">
        <el-form-item label="进站时间">
          <el-date-picker
            v-model="dateTime"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          />
        </el-form-item>
        <el-form-item label="作业站">
          <el-select v-model="searchList.search_EQ_processCode" clearable filterable style="width: 184px;">
            <el-option v-for="item in processList" :label="item.name" :value="item.code" :key="item.code"/>
          </el-select>
        </el-form-item>
        <el-form-item label="批次号">
          <el-input v-model="searchList.search_LIKE_code" clearable/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="searchRows">查询</el-button>
          <el-button icon="el-icon-refresh-left" @click="clearData">清除</el-button>
        </el-form-item>
      </div>
    </el-form>

    <div class="admin-table-wrap">
      <el-tabs v-model="activeName" @tab-click="searchRows">
        <el-tab-pane label="待过站" name="待过站">
          <wait-out-station ref="wait" :prop-search="computedSearchForm"/>
        </el-tab-pane>
        <el-tab-pane label="历史过站记录" name="历史过站记录">
          <historical-over-station-records ref="records" :prop-search="computedSearchForm"/>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import waitOutStation from "./modules/waitOutStation.vue";
import HistoricalOverStationRecords from "./modules/historicalOverStationRecords.vue";
import {getfactoryModelTree} from "@/api/overStationExecution/overStation";
import {initDate} from "@/utils/initDate";

const defaultSearchList = {
  search_EQ_processCode: null,
  search_LIKE_code: null
}

export default {
  components: { waitOutStation, HistoricalOverStationRecords },
  data() {
    return {
      activeName: '待过站',
      searchList: Object.assign({}, defaultSearchList),
      dateTime: [],
      processList: [],
    };
  },
  computed: {
    computedSearchForm() {
      if (!this.$store.getters.fromPC) return {}
      const dateTime = this.dateTime || []
      if (this.activeName === '待过站') {
        return {
          ...this.searchList,
          search_GTE_inTime: dateTime[0],
          search_LTE_inTime: dateTime[1]
        }
      } else {
        const { search_LIKE_code, ...search } = this.searchList
        return {
          ...search,
          search_LIKE_processingOrderCode: search_LIKE_code, // 批次号
          search_GTE_startTime: dateTime[0],
          search_LTE_startTime: dateTime[1]
        }
      }
    },
  },
  async created() {
    if (this.$store.getters.fromPC) {
      await this.fetchProcessList()
      if (this.processList && this.processList[0]) {
        this.searchList.search_EQ_processCode = this.processList[0].code
      }
      this.dateTime = initDate(31)
      this.searchRows()
    }
  },
  methods: {
    searchRows() {
      this.$nextTick(() => {
        let ref = this.activeName === '待过站' ? 'wait' : 'records'
        this.$refs[ref] && this.$refs[ref].searchRows && this.$refs[ref].searchRows()
      })
    },
    clearData() {
      this.searchList = Object.assign({}, defaultSearchList)
      this.searchRows()
    },
    fetchProcessList() {
      return getfactoryModelTree().then(res => {
        const workshopList = res.data[0].children[0].children
        workshopList.forEach(({ children }) => {
          if (!children) return
          children.forEach(processItem => {
            this.processList.push(processItem)
          })
        })
      })
    },
  }
};
</script>

<style>
</style>
