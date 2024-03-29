<template>
  <div>
    <!-- <el-date-picker
      class="date-picker"
      v-model="timeRange"
      type="datetimerange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      value-format="yyyy-MM-DD HH:mm:ss"
      @change="fetchData"
    >
    </el-date-picker> -->
    <div v-if="list.length !== 0">
      <div class="card" v-for="item in list" :key="item.processingOrderCode">
        <div class="header">
          <div>{{ item.processingOrderCode }}</div>
          <i class="el-icon-document"></i>
        </div>
        <el-divider class="divider" />
        <el-table
          :data="[item]"
          key="number"
          :header-cell-style="{
            background: 'rgba(242, 242, 242)',
            color: '#606266',
          }"
        >
          <!-- <el-table-column label="产品料号" prop="number" min-width="100" />
        <el-table-column label="产品类型" prop="type" min-width="100" /> -->
          <el-table-column label="数量" prop="number" min-width="80" />
          <el-table-column label="进站时间" prop="startTime" min-width="100" />
          <el-table-column label="出站时间" prop="endTime" min-width="100" />
          <el-table-column label="创建人" prop="createUserName" />
        </el-table>
      </div>
    </div>
    <el-empty v-else :image-size="100"></el-empty>
    <div class="pagination">
      <el-pagination
        :total="total"
        :current-page="currentPage"
        class="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import * as Api from "@/api/overStationExecution/overStation.js";
export default {
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      total: 0,
      list: [],
      timeRange: [],
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      Api.fetchHistoricalOverStationRecords({
        search_EQ_processCode: this.$route.query.station,
        rows: this.pageSize,
        page: this.currentPage,
        search_GTE_createTime: this.timeRange[0],
        search_LT_createTime: this.timeRange[1],
      }).then((res) => {
        this.list = res.data.rows;
        this.total = parseInt(res.data.total);
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchData();
    },
  },
};
</script>

<style lang="scss" scoped>
.date-picker {
  margin-bottom: 8px;
  width: 100%;
}
.card {
  padding: 12px;
  background-color: rgb(233, 243, 253);
  margin-bottom: 12px;
  .header {
    font-size: 20px;
    color: rgb(2, 107, 194);
    display: flex;
    justify-content: space-between;
  }
  .btn {
    display: flex;
    gap: 20px;
    margin-top: 12px;
    .back-station {
      flex: 1;
    }
    .out-station {
      flex: 2;
    }
  }
}
.divider {
  margin: 8px 0px;
}
.pagination {
  display: flex;
  justify-content: end;
}
</style>