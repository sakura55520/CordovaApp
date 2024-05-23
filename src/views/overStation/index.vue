<!--过站操作-->
<template>
  <div v-show="visible" class="detailBox">
    <el-form ref="dataForm" :model="temp" :rules="rules" class="topInfoCard">
      <el-form-item label="晶编" prop="processingOrderCode">
        <CodeScanner
          ref="CodeScanner"
          v-model="temp.processingOrderCode"
          placeholder="请扫描或输入晶编"
          @has-done="codeScannerCallBack"
          @clear="onCodeScannerClear"
        />
      </el-form-item>
      <el-form-item
        v-if="storage && storage.isNeedsDevice"
        label="设备"
        prop="deviceCode"
      >
        <DeviceCodeScanner
          ref="CodeScanner"
          v-model="temp.deviceCode"
          placeholder="请扫描或输入设备"
          :deviceTypeIds="temp.deviceTypeIds"
        />
      </el-form-item>
    </el-form>

    <div v-show="stationList && stationList.length" class="fromCard">
      <div class="headLine">
        <div class="headLine-title">选择站点</div>
      </div>
      <el-radio-group v-model="wipStorageName" class="over-station-list">
        <el-radio
          v-for="(item, index) in stationList"
          :key="index"
          :label="item.wipStorageName"
          class="list-radio"
          border
          @click.native="handleClickSite(item, index)"
        >
          {{ item.wipStorageName }}
        </el-radio>
      </el-radio-group>
    </div>

    <div class="page-handle-box tool" v-if="storage">
      <div class="btn">
        <el-button
          type="warning"
          plain
          class="back-station"
          @click="handleExitStationClick"
          >退站操作</el-button
        >
        <el-button
          v-if="storage.wipStorageStatus === 0"
          type="primary"
          class="in-station"
          @click="handleOverStationExecutionClick"
        >
          进站执行
        </el-button>
        <el-button
          v-if="storage.wipStorageStatus === 1"
          type="primary"
          class="out-station"
          @click="handleOverStationExecutionClick"
          >出站执行</el-button
        >
      </div>
    </div>

    <el-dialog title="退站" :visible.sync="exitStationDialogVisible">
      <el-radio-group
        v-if="existLastWipStorage"
        v-model="selectProcessUuid"
        style="width: 100%"
      >
        <div v-for="(item, index) in stationList" :key="index">
          <el-radio
            v-if="item.lastWipStorageName"
            class="list-radio"
            border
            :label="item.processUuid"
          >
            {{ item.lastWipStorageName }}
          </el-radio>
        </div>
      </el-radio-group>
      <el-empty v-else description="无上一站点" :image-size="100"></el-empty>
      <span slot="footer" class="dialog-footer">
        <el-button class="submit" @click="closeExitstationDialog"
          >取 消</el-button
        >
        <el-button
          class="submit"
          type="primary"
          @click="handleExitStation"
          v-if="existLastWipStorage"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as Api from "@/api/overStation/overStation.js";
import CodeScanner from "@/components/CodeScanner";
import {
  calcIsSkip,
  calcStationOperator,
  handleInOrOutStation,
} from "@/utils/overStation";
import { isEmpty } from "lodash-es";
import { fetchStorage } from "@/utils/overStation";
import { exitStation } from "@/api/overStationExecution/overStation.js";

const defaultForm = {
  processingOrderCode: null,
  deviceCode: null,
  deviceTypeIds: null,
};

export default {
  components: {
    CodeScanner,
  },
  data() {
    return {
      temp: Object.assign({}, defaultForm),
      visible: false,
      wipStorageName: null, //工序绑定项
      storage: null, //当前选中工序数据
      stationList: [], //工序列表
      selectProcessUuid: null,
      exitStationDialogVisible: false,
    };
  },
  computed: {
    calcStationOperator() {
      const { skipStatus, wipStorageStatus } = this.storage;
      return calcStationOperator(skipStatus, wipStorageStatus);
    },
    calcIsSkip() {
      return calcIsSkip(this.storage.skipStatus);
    },
    // 尝试立即跳转到表单页
    routerReplace() {
      return this.$route.query.routerReplace;
    },
    rules() {
      return {
        processingOrderCode: [
          { required: true, message: "请输入编号", trigger: "change" },
        ],
        deviceCode: [
          {
            required: this.storage && this.storage.isNeedsDevice,
            message: "请输入设备",
            trigger: "change",
          },
        ],
      };
    },
    existLastWipStorage() {
      return this.stationList.some((item) => item.lastWipStorageName);
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    // 初始化逻辑
    init() {
      this.visible = !this.routerReplace;

      // 判断是否直接扫码
      if (this.$route.query.isScanner) {
        this.$refs.CodeScanner.sweepCode();
      }

      if (this.$route.query.processingOrderCode) {
        this.temp.processingOrderCode = this.$route.query.processingOrderCode;
        this.codeScannerCallBack();
      }

      let processingOrderCodeScan = this.global.processingOrderCodeScan;
      if (processingOrderCodeScan) {
        this.temp.processingOrderCode = processingOrderCodeScan;
        this.codeScannerCallBack();
        this.global.setProcessingOrderCodeScan("");
      }
    },
    handleInOrOutStation() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          const { deviceCode } = this.temp;
          handleInOrOutStation(
            {
              ...this.storage,
              equipmentCode: deviceCode,
              deviceCode,
            },
            this.temp.processingOrderCode
          );
        }
      });
    },
    // 当选中工序时
    handleClickSite(row, index) {
      this.storage = {
        ...row,
        index,
      };
      if (row.deviceCode) this.temp.deviceCode = row.deviceCode;
      this.temp.deviceTypeIds = row.deviceTypeIds;
    },
    // 扫码回调
    codeScannerCallBack() {
      Api.getCurrentWipStorageData(this.temp.processingOrderCode)
        .then((res) => {
          if (!res.data || !res.data.length)
            return Message.warning("未查询到过站信息!");
          const list = res.data;
          this.stationList = list;
          if (
            this.routerReplace &&
            list.length === 1 &&
            !list[0].isNeedsDevice
          ) {
            this.storage = list[0];
            this.handleInOrOutStation();
          } else {
            if (!isEmpty(list)) {
              this.wipStorageName = list[0].wipStorageName;
              this.handleClickSite(list[0], 0);
            }
            this.visible = true;
          }
        })
        .catch((err) => {
          this.resetData();
        });
    },
    // 当扫码框清空时
    onCodeScannerClear() {
      this.resetData();
    },
    // 重置页面数据
    resetData() {
      this.temp = Object.assign({}, defaultForm);
      this.wipStorageName = null;
      this.storage = null;
      this.stationList = [];
      this.$nextTick(() => {
        this.$refs.dataForm.clearValidate();
      });
    },
    closeExitstationDialog() {
      this.exitStationDialogVisible = false;
      this.selectProcessUuid = null;
    },
    async handleExitStation() {
      if (!this.selectProcessUuid) {
        this.$message.warning("请选择站点");
        return;
      }
      await exitStation({
        processingOrderCode: this.temp.processingOrderCode,
        processUuid: this.selectProcessUuid,
      });
      this.$message({ type: "success", message: "退站成功" });
      this.codeScannerCallBack();
      this.closeExitstationDialog();
    },
    async handleExitStationClick() {
      this.exitStationDialogVisible = true;
      this.selectProcessUuid = this.storage.processUuid;
    },
    handleOverStationExecutionClick() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          const { deviceCode } = this.temp;
          handleInOrOutStation(
            {
              ...this.storage,
              equipmentCode: deviceCode,
              deviceCode,
            },
            this.temp.processingOrderCode
          );
          this.$store.dispatch("SetStationCallback", this.codeScannerCallBack);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.headLine {
  border-bottom: none;
}

.topBox {
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;

  .topBox-label {
    font-weight: 600;
  }
}

.over-station-list {
  width: 100%;
  padding: 0 16px;
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
</style>
