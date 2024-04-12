<template>
  <div class="scroller-flex-wrap">
    <div class="admin-table-wrap">
      <el-tabs v-model="activeName" @tab-click="searchRows">
        <el-tab-pane label="待过站" name="待过站">
          <wait-out-station ref="wait"/>
        </el-tab-pane>
        <el-tab-pane label="历史过站记录" name="历史过站记录">
          <historical-over-station-records ref="records"/>
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
