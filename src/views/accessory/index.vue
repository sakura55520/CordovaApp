<!--
  辅材更换
  status
    0 待上机
    1 上机中
    2 退库待确认
    3 待出库
-->
<template>
  <div class="from">
    <el-form :model="searchList" class="acc-form" @submit.native.prevent>
      <el-form-item>
        <el-radio-group v-model="listType" @change="searchRows">
          <el-radio-button label="accessory">辅材明细</el-radio-button>
          <el-radio-button label="apply">申请单</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item style="flex: 1">
        <el-input
          v-model="searchList.search_EQ_equipmentCode"
          class="input-with-select"
          placeholder="请输入设备编号"
          @keyup.enter.native="searchRows"
        >
          <i
            v-show="searchList.search_EQ_equipmentCode"
            slot="suffix"
            class="el-input__icon el-icon-circle-close"
            @click="clearData"
          />
          <el-button slot="append" icon="el-icon-search" @click="searchRows" />
        </el-input>
      </el-form-item>
    </el-form>

    <div class="card-item">
      <div class="menu">
        <el-form :model="dialogForm">
          <el-form-item label="预警状态" v-if="listType === 'accessory'">
            <el-checkbox-group v-model="dialogForm.warnStatus" size="">
              <el-checkbox-button
                v-for="(item, index) in warnStatusMap"
                :label="item.name"
                :key="index"
                >{{ item.name }}</el-checkbox-button
              >
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="使用状态" v-if="listType === 'accessory'">
            <el-checkbox-group v-model="dialogForm.status" size="">
              <el-checkbox-button
                v-for="(item, index) in useStatusMap"
                :label="item.name"
                :key="index"
                >{{ item.name }}</el-checkbox-button
              >
              <!-- <el-checkbox-button v-if="listType === 'apply'" style="margin-left: 1px;" label="待出库"></el-checkbox-button> -->
            </el-checkbox-group>
          </el-form-item>

          <el-button
            @click="handle('批量退库')"
            icon="el-icon-back"
            type="primary"
            size="small"
            >批量退库</el-button
          >
          <el-button
            @click="handle('批量上机')"
            icon="el-icon-top"
            type="primary"
            size="small"
            >批量上机</el-button
          >

          <el-form-item label="使用状态" v-if="listType === 'apply'">
            <el-checkbox-group v-model="dialogForm.status" size="">
              <el-checkbox-button
                v-for="(item, index) in usewordStatusMap"
                :label="item.name"
                :key="index"
                >{{ item.name }}</el-checkbox-button
              >
              <!-- <el-checkbox-button v-if="listType === 'apply'" style="margin-left: 1px;" label="待出库"></el-checkbox-button> -->
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        ref="table"
        :cell-style="cellStyle"
        :data="tableList"
        fit
        highlight-current-row
        class="admin_table"
        @selection-change="handleSelectionChange"
        row-key="id"
      >
        <el-table-column type="selection" width="55" fixed reserve-selection />
        <el-table-column
          prop="materialCode"
          key="materialCode"
          label="料号"
          width="140"
          fixed="left"
        />
        <el-table-column
          prop="materialName"
          key="materialName"
          label="物料名称"
          min-width="150"
        />
        <el-table-column
          prop="equipmentCode"
          key="equipmentCode"
          label="设备"
          min-width="150"
        />

        <template v-if="listType === 'accessory'">
          <el-table-column
            prop="uniqueCode"
            key="uniqueCode"
            label="唯一码"
            width="150"
          />
          <el-table-column
            prop="ratedLife"
            key="ratedLife"
            label="额定寿命"
            width="100"
          />
          <el-table-column
            prop="usefulLife"
            key="usefulLife"
            label="已使用寿命"
            width="100"
          />
          <el-table-column
            prop="remainingLife"
            key="remainingLife"
            label="剩余寿命"
            width="100"
          />
          <el-table-column prop="warnLife" label="预警寿命" width="100">
            <template slot-scope="scope">
              <div>
                {{ scope.row.warnLife
                }}<img
                  v-show="scope.row.warnStatus == 1"
                  src="@/assets/gif/warning.gif"
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="accessoryStatus"
            key="accessoryStatus"
            label="物料状态"
            width="100"
          >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.transMap" class="tag">{{
                scope.row.transMap.accessoryStatusName
              }}</el-tag>
            </template>
          </el-table-column>
        </template>

        <el-table-column
          prop="status"
          key="status"
          label="使用状态"
          width="110"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-tag class="tag">{{ transformStatus(scope.row.status) }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column fixed="right" label="操作" width="160">
          <div slot-scope="scope" class="btns">
            <template v-if="listType === 'accessory'">
              <el-button
                v-if="scope.row.status === 0 || scope.row.status === 1"
                icon="el-icon-document-remove"
                type="danger"
                plain
                @click="handleReturn(scope.row)"
                >退库</el-button
              >

              <el-button
                v-if="scope.row.status === 0"
                icon="el-icon-document-remove"
                type="danger"
                plain
                @click="upComputer(scope.row)"
                >上机</el-button
              >

              <el-button
                v-if="scope.row.status === 2"
                icon="el-icon-document-delete"
                type="info"
                plain
                @click="handleCancelReturn(scope.row)"
                >取消退库</el-button
              >

              <el-button
                v-if="scope.row.status === 2"
                icon="el-icon-document-copy"
                type="primary"
                plain
                @click="handleApply(scope.row)"
                >申请</el-button
              >
            </template>

            <template v-else>
              <el-button
                v-if="scope.row.status === 0"
                icon="el-icon-document-delete"
                type="info"
                plain
                @click="handleCancelApply(scope.row)"
                >取消申请</el-button
              >
            </template>
          </div>
        </el-table-column>
      </el-table>

      <el-pagination
        :total="total"
        :current-page="currentPage"
        layout="total, prev, pager, next"
        class="admin_pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!--退库弹窗-->
    <!--v-if 修复: 新组件的弹窗会闪烁-->
    <component
      v-if="dialogVisible"
      :is="currentComponent"
      :visible.sync="dialogVisible"
      :row-data="row"
      :accessories-status-map="accessoriesStatusMap"
      @has-down="hasDone"
    />

    <!-- 批量退库弹窗 -->
    <BatchBackDialog
      ref="BatchBackDialog"
      v-if="batchBackDialogVisible"
      :dialogVisible="batchBackDialogVisible"
      :dialogState="batchBackDialogState"
      :changeParentData="changeParentData"
      :thatRefs="thatRefs"
      :dialogForm="batchBackDialogForm"
      :has-done="hasDone"
    />

    <!-- 批量上机弹窗 -->
    <BatchUpperDialog
      v-if="batchUpperVisible"
      :visible.sync="batchUpperVisible"
      :changeParentData="changeParentData"
      :dialogForm="batchUpperForm"
      :has-done="hasDone"
    />
  </div>
</template>

<script>
import * as Api from "@/api/accessory";
import { getSeleteData, getEnumDatas } from "@/utils/select";
import ReturnDialog from "./ReturnDialog";
import ApplyDialog from "./ApplyDialog";
import DownDialog from "./DownDialog";
import BatchBackDialog from "./BatchBackDialog.vue";
import BatchUpperDialog from "./BatchUpperDialog.vue";

const defaultSearchList = {
  search_EQ_equipmentCode: null,
};
// 根据data返回的每一行的数据判断,再修改这一行的样式

export default {
  name: "Accessory",
  components: {
    BatchBackDialog,
    BatchUpperDialog,
  },
  data() {
    return {
      listType: "accessory",
      searchList: Object.assign({}, defaultSearchList),
      tableList: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      dialogVisible: false,
      row: {},
      checkAll: false,
      isIndeterminate: true,
      accessoriesStatusMap: [], // 物料状态map
      useStatusMap: [], // 使用状态map
      currentComponent: null,
      warnStatusMap: [],
      usewordStatusMap: [],
      warnStatusChange: false,
      dialogForm: {
        warnStatus: [""],
        status: [""],
      },

      batchBackDialogVisible: false,
      batchBackDialogState: "批量退库",
      batchBackDialogForm: {}, //批量退库表单

      batchUpperVisible: false, // 批量上机
      batchUpperForm: {},

      multipleSelection: [],
    };
  },
  watch: {
    dialogForm: {
      handler(val) {
        this.currentPage = 1;
        this.fetchData();
      },
      deep: true,
    },
  },
  created() {
    getEnumDatas("辅材物料状态", this.accessoriesStatusMap); // 物料状态
    getSeleteData("useStatus", this.useStatusMap); // 使用状态map
    getSeleteData("warnStatus", this.warnStatusMap);
    getSeleteData("wordUseStatus", this.usewordStatusMap);
    this.fetchData();
  },
  methods: {
    cellStyle(data) {
      if (data.row.warnStatus == 1) {
        return {
          background: "#FEF3BD",
        };
      }
    },
    fetchData() {
      const fetch =
        this.listType === "accessory" ? Api.fetchData : Api.fetchApply;
      let statussList = [];
      if (this.listType === "accessory") {
        statussList = this.dialogForm.status
          .filter((item) => this.useStatusMap.some((val) => item === val.name))
          .map(
            (item) => this.useStatusMap.find((val) => item === val.name).value
          );
      } else {
        statussList = this.dialogForm.status
          .filter((item) =>
            this.usewordStatusMap.some((val) => item === val.name)
          )
          .map(
            (item) =>
              this.usewordStatusMap.find((val) => item === val.name).value
          );
      }

      const warnStatusList = this.dialogForm.warnStatus
        .filter((item) => this.warnStatusMap.some((val) => item === val.name))
        .map(
          (item) => this.warnStatusMap.find((val) => item === val.name).value
        );

      console.log(statussList.join(","), "statussList"),
        fetch({
          search_IN_warnStatus: warnStatusList.join(","),
          search_IN_status: statussList.join(","),
          ...this.searchList,
          rows: this.pageSize,
          page: this.currentPage,
        }).then((res) => {
          this.tableList = res.data.rows;
          this.total = parseInt(res.data.total);
          this.$nextTick(() => {
            this.$refs["table"].doLayout();
          });
        });
    },
    // 退库
    handleReturn(row) {
      this.dialogVisible = true;
      this.currentComponent = ReturnDialog;
      this.row = row;
    },
    //下机
    downComputer(row) {
      this.currentComponent = DownDialog;
      this.dialogVisible = true;
      this.row = row;
    },
    //上机
    upComputer({ id, materialCode }) {
      this.$confirm(`${materialCode} 即将进行【上机】操作, 请确定`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          Api.upComputer(id).then((res) => {
            this.$message({ type: "success", message: "已上机!" });
            this.$refs["table"].clearSelection();
            this.fetchData();
          });
        })
        .catch(() => {});
    },
    // 取消退库
    handleCancelReturn({ id, materialCode }) {
      this.$confirm(
        `${materialCode} 即将进行【取消退库】操作, 请确定`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          Api.cancelStockReturn(id).then((res) => {
            this.$message({ type: "success", message: "已取消退库!" });
            this.$refs["table"].clearSelection();
            this.fetchData();
          });
        })
        .catch(() => {});
    },
    // 申请
    handleApply(row) {
      this.currentComponent = ApplyDialog;
      this.dialogVisible = true;
      this.row = row;
    },
    // 取消申请
    handleCancelApply({ id, materialCode }) {
      this.$confirm(
        `${materialCode} 即将进行【取消申请】操作, 请确定`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          Api.cancelApplyAccessory(id).then((res) => {
            this.$message({ type: "success", message: "已取消申请!" });
            this.$refs["table"].clearSelection();
            this.fetchData();
          });
        })
        .catch(() => {});
    },
    transformStatus(status) {
      let matched = "";
      if (this.listType === "accessory") {
        matched = this.useStatusMap.find(
          (item) => item.value === String(status)
        );
      } else {
        matched = this.usewordStatusMap.find(
          (item) => item.value === String(status)
        );
      }
      return matched ? matched.name : status;
    },
    searchRows() {
      this.currentPage = 1;
      this.fetchData();
    },
    clearData() {
      this.searchList = Object.assign({}, defaultSearchList);
      this.searchRows();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchData();
    },
    // 改变当前页面数据，供子组件调用
    changeParentData(key, value) {
      this[key] = JSON.parse(JSON.stringify(value));
    },
    handle(state) {
      if (state === "批量退库") {
        if (this.multipleSelection.length < 1)
          return this.$message.warning("请选择物料");
        this.changeParentData("batchBackDialogVisible", true);
        this.changeParentData("batchBackDialogState", state);
        this.changeParentData("batchBackDialogForm", {
          list: this.multipleSelection.filter(
            (item) => item.status == 0 || item.status == 1
          ),
        });
        return;
      }
      if (state === "批量上机") {
        if (this.multipleSelection.length < 1)
          return this.$message.warning("请选择物料");
        this.changeParentData("batchUpperVisible", true);
        this.changeParentData("batchUpperForm", {
          list: this.multipleSelection.filter((item) => item.status == 0),
        });
        return;
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    hasDone() {
      this.$refs["table"].clearSelection();
      this.fetchData();
    },
  },
};
</script>

<style lang="scss" scoped>
.menu {
  padding: 5px;
  width: 100%;
  border: none;
}
.acc-form {
  margin-top: 16px;
  display: flex;
  gap: 8px;
  .el-form-item {
    margin: 0;
  }
  /deep/ {
    .el-radio-button__inner {
      height: 40px;
      padding: 0 40px;
      font-size: 18px;
      line-height: 40px;
    }
  }
}
.tag {
  font-size: 12px;
}
.btns {
  .el-button {
    width: 100%;
    margin: 0;
    font-size: 16px;
    padding: 10px 0;
  }
  .el-button + .el-button {
    margin-top: 6px;
  }
}
</style>
