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
      >
        <el-table-column type="index" width="50"/>
        <el-table-column label="批次号" prop="processingOrderCode" min-width="140"/>
        <el-table-column label="设备" prop="equipmentCode"/>
        <el-table-column label="数量" prop="number" />
        <el-table-column label="作业站名称" prop="processName" min-width="140" />
        <el-table-column label="进站时间" prop="startTime" width="140" />
        <el-table-column label="进站操作人" prop="inUserName" width="140" />
        <el-table-column label="出站时间" prop="endTime" width="140" />
        <el-table-column label="进站操作人" prop="outUserName" width="140" />
        <el-table-column label="操作" width="100" fixed="right">
          <template slot-scope="{ row }">
            <el-button class="table-rowBtn" type="text">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--   PAD端展示   -->
    <div v-else>
      <div class="search">
        <el-date-picker
          class="date-picker"
          v-model="startTimeRange"
          type="datetimerange"
          range-separator="至"
          start-placeholder="进站开始时间"
          end-placeholder="进站结束时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          @change="fetchData"
        >
        </el-date-picker>
        <el-date-picker
          class="date-picker"
          v-model="endTimeRange"
          type="datetimerange"
          range-separator="至"
          start-placeholder="出站开始时间"
          end-placeholder="出站结束时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          @change="fetchData"
        >
        </el-date-picker>
      </div>
      <div v-if="list.length !== 0">
        <div class="card" v-for="item in list" :key="item.processingOrderCode">
          <div class="header">
            <div>{{ item.processingOrderCode }}</div>
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
            <!-- <el-table-column label="产品料号" prop="number" min-width="100" />
          <el-table-column label="产品类型" prop="type" min-width="100" /> -->
            <el-table-column label="数量" prop="number" min-width="80" />
            <el-table-column label="进站时间" prop="startTime" min-width="100" />
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
import { isEmpty } from "lodash-es";

export default {
  name: 'HistoricalOverStationRecords',
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
      startTimeRange: "",
      endTimeRange: "",
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
      Api.fetchHistoricalOverStationRecords({
        search_EQ_processCode: this.$route.query.station,
        rows: this.pageSize,
        page: this.currentPage,
        search_GTE_startTime: !isEmpty(this.startTimeRange)
          ? this.startTimeRange[0]
          : null,
        search_LT_startTime: !isEmpty(this.startTimeRange)
          ? this.startTimeRange[1]
          : null,
        search_GTE_endTime: !isEmpty(this.endTimeRange)
          ? this.endTimeRange[0]
          : null,
        search_LT_endTime: !isEmpty(this.endTimeRange)
          ? this.endTimeRange[1]
          : null,
        ...this.propSearch
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
.search {
  display: flex;
  gap: 10px;
}
.date-picker {
  margin-bottom: 8px;
  flex: 1;
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
</style>
