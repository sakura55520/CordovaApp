<template>
  <div>
    <div>
      <el-form :model="formData">
        <div class="form-columns">
          <el-form-item label="">
            <el-input
              v-model="formData.search_LIKE_code"
              placeholder="批次号"
              @change="fetchData"
            ></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-input
              v-model="formData.search_LIKE_extend2"
              placeholder="生产设备"
              @change="fetchData"
            ></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-input
              v-model="formData.search_LIKE_equipmentCode"
              placeholder="执行设备"
              @change="fetchData"
            ></el-input>
          </el-form-item>
        </div>
        <div class="form-columns">
          <el-form-item label="">
            <el-date-picker
              class="date-picker"
              v-model="formData.startTimeRange"
              type="datetimerange"
              range-separator="至"
              start-placeholder="进站开始时间"
              end-placeholder="进站结束时间"
              value-format="yyyy-MM-dd HH:mm:ss"
              @change="fetchData"
            >
            </el-date-picker>
          </el-form-item>
        </div>
      </el-form>
      <div
        v-if="list.length !== 0"
        class="card"
        v-for="item in list"
        :key="item.code"
      >
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
            v-if="item.extend2"
            label="生产设备"
            prop="extend2"
            min-width="100"
          />
          <el-table-column
            v-if="item.equipmentCode"
            label="执行设备"
            prop="equipmentCode"
            min-width="100"
          />
          <el-table-column
            label="产品料号"
            prop="materialCode"
            min-width="110"
          />
          <el-table-column
            label="产品类型"
            prop="data.productCategory"
            min-width="100"
          />
          <el-table-column label="数量" prop="number" />
          <el-table-column label="段位" prop="data.segmentNum" min-width="90" />
          <el-table-column label="轮编号" prop="extend1" min-width="90" />
          <el-table-column label="进站时间" prop="inTime" min-width="150" />
          <el-table-column label="操作者" prop="processUserCreate" />
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
        <div 
          v-for="(item, index) in preStationList"
          :key="index"
        >
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
      <span slot="footer" class="dialog-footer">
        <el-button class="submit" @click="closeExitstationDialog"
          >取 消</el-button
        >
        <el-button class="submit" type="primary" @click="handleExitStation"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as Api from "@/api/overStationExecution/overStation.js";
import { getCurrentWipStorageData } from "@/api/overStation/overStation.js";
import { isEmpty } from "lodash-es";
import { inOrOutStation } from "@/api/inStation";
import { fetchStorage } from "@/utils/overStation";

export default {
  name: "WaitOutStation",
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      total: 0,
      list: [],
      formData: {
        search_LIKE_extend2: null,
        search_LIKE_equipmentCode: null,
        search_LIKE_code: null,
        startTimeRange: "",
      },
      selectRow: null,
      selectProcessUuid: null,
      preStationList: [],
      exitStationDialogVisible: false,
      siteList: [],
      currentSite: {},
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    searchRows() {
      this.currentPage = 1;
      this.fetchData();
    },
    fetchData() {
      const {
        search_LIKE_extend2,
        search_LIKE_equipmentCode,
        search_LIKE_code,
        startTimeRange,
      } = this.formData;
      Api.fetchWaitOutStationPage({
        search_EQ_status: 1, // 加工状态 0：待加工；1：加工中；2：加工完成；3：入库完成
        search_IN_wipStorageStatus: "0,1", // 站点状态 0：待进站；1：已经站；2：已出站
        search_EQ_processCode: this.$route.query.station,
        rows: this.pageSize,
        page: this.currentPage,
        search_LIKE_extend2,
        search_LIKE_equipmentCode,
        search_LIKE_code,
        search_GTE_inTime: !isEmpty(startTimeRange) ? startTimeRange[0] : null,
        search_LT_inTime: !isEmpty(startTimeRange) ? startTimeRange[1] : null,
      }).then((res) => {
        this.list = res.data.rows;
        this.total = parseInt(res.data.total);
      });
    },
    handleOverStationExecutionClick(code) {
      this.processingOrderCode = code;
      fetchStorage(code);
      this.$store.dispatch("SetStationCallback", this.fetchData);
    },
    async getCurrentWipStorageData() {
      // 在制品查询站点
      const res = await getCurrentWipStorageData(this.processingOrderCode);
      this.siteList = res.data || [];
      const { length } = this.siteList;
      if (!length) return this.$message.warning("未查询到过站信息!");
      if (length === 1) {
        const { wipStorageStatus, operationType } = this.siteList[0];
        this.currentSite = this.siteList[0];
        // operationType 0：直接出站/直接进站，1：自定义表单，2：定制化页面

        // 调用接口
        switch (operationType) {
          case 0:
            break;
          case 1:
            break;
          case 2:
            this.$router.push({
              path: this.currentSite.operationData,
              query: {
                ...this.currentSite,
                processingOrderCode: this.processingOrderCode,
                fromData: JSON.stringify(this.currentSite.fromData),
                orderInfo: JSON.stringify(this.currentSite.orderInfo)
              },
            });
            break;
        }
        if (operationType === 0) {
          // 直接进站
          // this.$confirm(`是否确定${wipStorageStatus === 0 ? '进站' : '出站'}？`, '提示', {
          //   confirmButtonText: '确定',
          //   cancelButtonText: '取消',
          //   type: 'warning'
          // }).then(() => {
          //   this.inOrOutStation()
          // })
        }
      } else {
      }
    },

    inOrOutStation(flowLineLable) {
      inOrOutStation({
        param: {},
        flowLineLable: this.currentSite.flowLineLable || flowLineLable,
        equipmentCode: this.currentSite.deviceCode,
        processUuid: this.currentSite.processUuid,
        processingOrderCode: this.processingOrderCode,
        wipStorageStatus: this.currentSite.wipStorageStatus,
      });
    },
    closeExitstationDialog() {
      this.preStationList = [];
      this.exitStationDialogVisible = false;
      this.selectRow = null;
      this.selectProcessUuid = null;
    },
    async handleExitStationClick(row) {
      const res = await getCurrentWipStorageData(row.code);
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
.form-columns {
  display: flex;
  gap: 5px;
  width: 100%;
  > div {
    flex: 1;
  }
}
.date-picker {
  width: 100%;
}
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
