<template>
  <div>
    <!--   PC端展示   -->
    <div v-if="$store.getters.fromPC">
      <el-table
        :data="list"
        max-height="666"
        border
        fit
        highlight-current-row
        class="admin_table"
        style="width: 100%"
      >
        <el-table-column type="index" width="50"/>
        <el-table-column label="批次号" prop="code" min-width="140"/>
        <el-table-column label="设备" prop="equipmentCode"/>
        <el-table-column label="产品料号" prop="dataOrderCode" min-width="140"/>
        <el-table-column label="产品类型" prop="">
          <template slot-scope="scope">{{
              JSON.parse(scope.row.data).productCategory
            }}</template>
        </el-table-column>
        <el-table-column label="数量" prop="number" width="100" />
        <el-table-column label="作业站名称" prop="processName" width="140" />
        <el-table-column label="进站时间" prop="inTime" width="140" />
        <el-table-column label="创建者" prop="createUserName" width="140" />
        <el-table-column label="操作" width="100" fixed="right">
          <template slot-scope="{ row }">
            <el-button class="table-rowBtn" type="text" @click="handleExitStationClick(row)">退站</el-button>
            <el-button v-if="row.wipStorageStatus === 0" class="table-rowBtn" type="text" @click="handleOverStationExecutionClick(row.code)">进站</el-button>
            <el-button v-if="row.wipStorageStatus === 1" class="table-rowBtn" type="text" @click="handleOverStationExecutionClick(row.code)">出站</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--   PAD端展示   -->
    <div v-else>
      <div v-if="list.length !== 0" class="card" v-for="item in list" :key="item.code">
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
      <el-empty v-else :image-size="100"></el-empty>
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
import { isEmpty } from "lodash-es";

export default {
  name: 'WaitOutStation',
  props: {
    propSearch: {
      required: true,
      type: Object
    }
  },
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
    if (!this.$store.getters.fromPC) this.fetchData();
  },
  methods: {
    searchRows() {
      this.currentPage = 1
      this.fetchData()
    },
    fetchData() {
      Api.fetchWaitOutStationPage({
        search_EQ_status: 1, // 加工状态 0：待加工；1：加工中；2：加工完成；3：入库完成
        search_IN_wipStorageStatus: '0,1', // 站点状态 0：待进站；1：已经站；2：已出站
        search_EQ_processCode: this.$route.query.station,
        ...this.propSearch,
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
      if (!isEmpty(this.preStationList))
        this.selectProcessUuid = this.preStationList[0].processUuid;
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
        flex: 2;
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
