<template>
  <div>
    <el-date-picker
      class="date-picker"
      v-model="timeRange"
      type="datetimerange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
    >
    </el-date-picker>
    <div class="card" v-for="item in list" :key="item.title">
      <div class="header">
        <div>{{ item.title }}</div>
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
        <el-table-column label="产品料号" prop="number" min-width="100" />
        <el-table-column label="产品类型" prop="type" min-width="100" />
        <el-table-column
          label="进站时间"
          prop="inStationTime"
          min-width="100"
        />
        <el-table-column label="上站" prop="preStation" />
        <el-table-column label="下站" prop="nextStation" />
      </el-table>
    </div>
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
      Api.fetchWaitOutStationPage({
        search_EQ_processCode: this.$route.query.station,
        rows: this.pageSize,
        page: this.currentPage,
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