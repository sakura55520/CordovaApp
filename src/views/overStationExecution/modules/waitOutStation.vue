<template>
  <div>
    <div v-if="list.length !== 0">
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
          <el-table-column label="数量" prop="number" />
          <el-table-column label="进站时间" prop="inTime" min-width="100" />
          <el-table-column label="创建者" prop="createUserName" />
        </el-table>
        <div class="tool">
          <div v-if="item.status === 2" class="btn">
            <el-button disabled type="primary" class="in-station">
              加工完成
            </el-button>
          </div>
          <div v-else class="btn">
            <el-button
              type="warning"
              plain
              class="back-station"
              @click="handleExitStationClick(item)"
              >退站操作</el-button
            >
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
              type="primary"
              class="out-station"
              @click="handleOverStationExecutionClick(item.code)"
              >出站执行</el-button
            >
          </div>
        </div>
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
    <el-dialog title="退站" :visible.sync="exitStationDialogVisible">
      <el-radio-group v-model="selectProcessUuid" style="width: 100%">
        <el-radio
          v-for="(item, index) in preStationList"
          :key="index"
          class="bodyBox-list-radio"
          :label="item.processUuid"
          >{{ item.wipStorageName }}</el-radio
        >
      </el-radio-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeExitstationDialog">取 消</el-button>
        <el-button type="primary" @click="handleExitStation">确 定</el-button>
      </span>
    </el-dialog>
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
      selectRow: null,
      selectProcessUuid: null,
      preStationList: [],
      exitStationDialogVisible: false,
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
    closeExitstationDialog() {
      this.preStationList = [];
      this.exitStationDialogVisible = false;
      this.selectRow = null;
      this.selectProcessUuid = null;
    },
    async handleExitStationClick(row) {
      let res = await getCurrentWipStorageData(row.code);
      this.preStationList = res.data;
      this.exitStationDialogVisible = true;
      this.selectRow = row;
    },
    async handleExitStation() {
      if (!this.selectProcessUuid) {
        this.$message.warning("请选择站点");
        return;
      }
      await Api.exitStation({
        processingOrderCode: this.selectRow.code,
        processUuid: this.selectProcessUuid,
      });
      this.$message({ type: "success", message: "退站成功" });
      this.fetchData();
      this.closeExitstationDialog();
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
    font-size: 20px;
    color: rgb(2, 107, 194);
  }
  .tool {
    width: 100%;
    .btn {
      width: 100%;
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
}
.divider {
  margin: 8px 0px;
}
.pagination {
  display: flex;
  justify-content: end;
}
.dialog-footer {
  display: flex;
  justify-content: end;
}
</style>