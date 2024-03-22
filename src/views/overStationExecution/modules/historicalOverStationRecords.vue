<template>
  <div>
    <el-date-picker
      v-model="timeRange"
      type="datetimerange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
    >
    </el-date-picker>
    <el-pagination
      :total="total"
      :current-page="currentPage"
      layout="total, prev, pager, next"
      class="admin_pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      total: 0,
      list: [
        {
          title: "Z0116504581",
          number: "123456",
          type: "晶锭123",
          inboundTime: "2022-08-13 09:10:23",
          preStation: "单晶送付",
          nextStation: "晶锭检测",
        },
      ],
    };
  },
  mounted() {},
  methods: {
    fetchData() {
      Api.fetchHistoricalOverStationRecordsPage({
        station: "123",
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

<style>
</style>