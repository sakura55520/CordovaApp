<template>
  <div>
    <div>
      <el-form :model="formData">
        <div class="form-columns">
          <el-form-item label="">
            <el-input
              v-model="formData.search_LIKE_wheel"
              placeholder="轮次号"
              @change="fetchData"
            ></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-input
              v-model="formData.search_LIKE_equipmentCode"
              placeholder="单晶炉设备号"
              @change="fetchData"
            ></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-input
              v-model="formData.search_LIKE_processingOrderCode"
              placeholder="工单"
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
          <el-form-item label="">
            <el-date-picker
              class="date-picker"
              v-model="formData.endTimeRange"
              type="datetimerange"
              range-separator="至"
              start-placeholder="出站开始时间"
              end-placeholder="出站结束时间"
              value-format="yyyy-MM-dd HH:mm:ss"
              @change="fetchData"
            >
            </el-date-picker>
          </el-form-item>
        </div>
      </el-form>
      <div v-if="list.length !== 0">
        <div class="card" v-for="item in list" :key="item.processingOrderCode">
          <div class="header">
            <div>{{ item.processingOrderCode }}</div>
            <i
              class="el-icon-document form-icon"
              @click="handleDetailView(item)"
            ></i>
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
            <el-table-column
              label="进站时间"
              prop="startTime"
              min-width="100"
            />
            <el-table-column label="出站时间" prop="endTime" min-width="100" />
            <el-table-column label="创建人" prop="createUserName" />
          </el-table>
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
  </div>
</template>

<script>
import * as Api from "@/api/overStationExecution/overStation.js";
import { fetchDetail } from "@/api/inStation";
import { isEmpty } from "lodash-es";

export default {
  name: "HistoricalOverStationRecords",
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      total: 0,
      list: [],
      formData: {
        search_LIKE_wheel: null,
        search_LIKE_equipmentCode: null,
        search_LIKE_processingOrderCode: null,
        startTimeRange: "",
        endTimeRange: "",
      },
      detailUrlMap: {
        ZL: {
          path: "/chargeOperate",
          url: "/wipChargeOut",
        },
        ZJ: {
          path: "/growthOperate",
          url: "/wipCrystalGrowthOut",
        },
        DJSF: {
          path: "/crystalDelivery",
          url: "/wipDelivery",
        },
        QTWQY: {
          path: "/headAndTailSampling",
          url: "/wipCuttingSample",
        },
        JDJY: {
          path: "/ingotDetection",
          url: "/wipcrystalcheck",
        },
        FDZL: {
          path: "/segmentedInstruction",
          url: "/wip/segmentedInstruction",
        },
        GD: {
          path: "/cutting",
          url: "/wipSlicingOut",
        },
        GYZZ: {
          path: "/roundTransferOperate",
          url: "/wipTransferOut",
        },
        GY: {
          path: "/roundOperate",
          url: "/wipRollingCircleOut",
        },
        JC: {
          path: "/addParameter",
          url: "/wipAddReferenceOut",
        },
        RKJC: {
          path: "/warehouseDetection",
          url: "/wipInboundDetectionOut",
        },
      },
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
      Api.fetchHistoricalOverStationRecords({
        search_EQ_processCode: this.$route.query.station,
        rows: this.pageSize,
        page: this.currentPage,
        search_Like_wheel: this.formData.search_LIKE_wheel,
        search_LIKE_equipmentCode: this.formData.search_LIKE_equipmentCode,
        search_LIKE_processingOrderCode:
          this.formData.search_LIKE_processingOrderCode,
        search_GTE_startTime: !isEmpty(this.formData.startTimeRange)
          ? this.formData.startTimeRange[0]
          : null,
        search_LT_startTime: !isEmpty(this.formData.startTimeRange)
          ? this.formData.startTimeRange[1]
          : null,
        search_GTE_endTime: !isEmpty(this.formData.endTimeRange)
          ? this.formData.endTimeRange[0]
          : null,
        search_LT_endTime: !isEmpty(this.formData.endTimeRange)
          ? this.formData.endTimeRange[1]
          : null,
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
    async handleDetailView(row) {
      let url = this.detailUrlMap[row.processCode].url;
      let res = await fetchDetail({
        url,
        page: 1,
        rows: 10,
        search_EQ_wipStorageId: row.id,
      });
      let list = res.data.rows;
      if (isEmpty(list)) {
        this.$message.warning("该条记录无表单数据");
        return;
      }
      let fromData = list[0];

      if (row.processCode === "FDZL") {
        let resFDZL = await fetchDetail({
          url: "/wip/segmentedInstructionDetail",
          page: 1,
          rows: 100,
          search_LIKE_segmentNo: row.processingOrderCode,
        });
        fromData.segmentedInstructionDetailVos = resFDZL.data.rows.sort(
          (a, b) => a.headPosition - b.headPosition
        );
      }

      this.$router.push({
        path: this.detailUrlMap[row.processCode].path,
        query: {
          ...row,
          processingOrderCode: row.processingOrderCode,
          fromData: JSON.stringify(fromData),
          view: true,
        },
      });
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
.form-icon {
  font-size: 24px;
}
</style>
