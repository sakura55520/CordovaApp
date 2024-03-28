<template>
  <div>
    <div class="card" v-for="item in list" :key="item.code">
      <div class="header">{{ item.code }}</div>
      <el-divider class="divider" />
      <el-table
        :data="[item]"
        key="dataOrderCode"
        :header-cell-style="{
          background: 'rgba(242, 242, 242)',
          color: '#606266',
        }"
      >
        <el-table-column
          label="产品料号"
          prop="dataOrderCode"
          min-width="100"
        />
        <el-table-column label="产品类型" prop="orderType" min-width="100">
          <template slot-scope="scope">{{
            JSON.parse(scope.row.data).productCategory
          }}</template>
        </el-table-column>
        <el-table-column label="进站时间" prop="inTime" min-width="100" />
        <el-table-column label="上站" prop="preStation" />
        <el-table-column label="下站" prop="nextStation" />
      </el-table>
      <div class="btn">
        <el-button
          v-if="item.wipStorageStatus === 0"
          type="primary"
          class="in-station"
          @click="handleOverStationExecutionClick(item.code)"
        >
          进站执行
        </el-button>
        <el-button
          v-if="item.wipStorageStatus === 1"
          type="warning"
          plain
          class="back-station"
          @click="handleExitStationClick(item)"
          >退站操作</el-button
        >
        <el-button
          v-if="item.wipStorageStatus === 1"
          type="primary"
          class="out-station"
          @click="handleOverStationExecutionClick(item.code)"
          >出站执行</el-button
        >
      </div>
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
import * as Api from "@/api/overStationExecution/overStation.js";
import { getCurrentWipStorageData } from "@/api/overStation/overStation.js";

export default {
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      total: 0,
      list: [],
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
    handleOverStationExecutionClick(code) {
      this.$router.push({
        path: "/overStation",
        query: { processingOrderCode: code },
      });
    },
    async handleExitStationClick(row) {
      await this.$confirm(`是否退站`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      });
      let wipRes = await getCurrentWipStorageData(row.code);

      let res = await Api.exitStation({
        processingOrderCode: row.code,
        processUuid: wipRes.processUuid,
      });
      if (res.code === 0) {
        this.$message({ type: "success", message: "退站成功" });
        this.fetchData();
      }
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
.card {
  padding: 12px;
  background-color: rgb(233, 243, 253);
  margin-bottom: 12px;
  .header {
    color: rgb(2, 107, 194);
  }
  .btn {
    display: flex;
    gap: 20px;
    margin-top: 12px;
    .in-station {
      flex: 1;
    }
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