<template>
  <div>
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
import * as Api from "@/api/overStationExecution/overStation.js";

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
      Api.fetchWaitOutStationPage({
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