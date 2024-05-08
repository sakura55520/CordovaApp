<!--交接班-->
<template>
  <div class="from">
    <el-form :model="searchList" inline>
      <div class="search-header-style">
        <el-form-item>
          <el-input v-trim v-model="searchList.search_LIKE_shiftTakerName" placeholder="请输入接班人"/>
        </el-form-item>
        <el-form-item>
          <el-input v-trim v-model="searchList.search_LIKE_handOverName" placeholder="请输入交班人"/>
        </el-form-item>
        <el-form-item>
          <el-input v-trim v-model="searchList.search_LIKE_deviceNumber" placeholder="请输入设备编号"/>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="dateTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="searchRows">查询</el-button>
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleCreate">新增</el-button>
        </el-form-item>
      </div>
    </el-form>

    <div class="card-item">
      <el-table
        ref="table"
        :data="tableList"
        fit
        highlight-current-row
        class="admin_table"
      >
        <el-table-column type="index" width="50" fixed/>
        <el-table-column prop="shiftTakerName" label="接班人" width="140" fixed/>
        <el-table-column prop="handOverName" label="交班人" width="140"/>
        <el-table-column prop="handOverTime" label="交接班时间" width="160"/>
        <el-table-column prop="deviceNumber" label="设备编号" width="90"/>
        <el-table-column :formatter="formatRepair" prop="repair" label="是否维修" width="90"/>
        <el-table-column prop="repairResult" label="维修结果" width="90"/>
        <el-table-column prop="currentProcess" label="当前工序" width="90"/>
        <el-table-column prop="diameter" label="等径长度" width="90"/>
        <el-table-column prop="otherContent" label="其他内容" min-width="300"/>
        <el-table-column label="操作" width="140" fixed="right">
          <template slot-scope="scope">
            <el-button class="table-rowBtn" type="text" @click="handleDetail(scope.row)">详情</el-button>
            <el-button class="table-rowBtn" icon="el-icon-edit" type="text" @click="handleUpdate(scope.row)"/>
            <el-button class="table-rowBtn table-delBtn" icon="el-icon-delete" type="text" @click="handleDelete(scope.row)"/>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        :total="total"
        :current-page="currentPage"
        layout="total, prev, pager, next"
        class="admin_pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"/>
    </div>

  </div>
</template>

<script>
import * as Api from "@/api/shiftChange";
import {initDate} from "@/utils/initDate";

const defaultSearchList = {
  search_LIKE_shiftTakerName: null,
  search_LIKE_handOverName: null,
  search_LIKE_deviceNumber: null,
}

const defaultForm = {
  shiftTakerName: null, // 接班人
  handOverName: null, // 交班人
  handOverTime: null, // 交接班时间
  deviceNumber: null, // 设备编号
  repair: 1, // 是否维修
  repairResult: null, // 维修结果
  currentProcess: null, // 当前工序
  diameter: null, // 等径长度
  otherContent: null, // 其他内容
  arrPhoto: null,
  photo: null // 留档文档记录
};
export default {
  name: "ShiftChange",
  data() {
    return {
      dateTime: initDate(31),
      searchList: Object.assign({}, defaultSearchList),
      tableList: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
    };
  },
  computed: {
    computedSearch() {
      const dateTime = this.dateTime || []
      return {
        ...this.searchList,
        search_GTE_handOverTime: dateTime[0],
        search_LTE_handOverTime: dateTime[1]
      }
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      Api.fetchData({
        ...this.computedSearch,
        rows: this.pageSize,
        page: this.currentPage
      }).then(res => {
        this.tableList = res.data.rows
        this.total = parseInt(res.data.total)
      })
    },
    searchRows() {
      this.currentPage = 1
      this.fetchData()
    },
    clearData() {
      this.searchList = Object.assign({}, defaultSearchList)
      this.searchRows()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchData()
    },
    handleCreate() {
      this.$router.push({
        name: 'shiftChangeOperate',
        query: {
          status: 'create'
        }
      })
    },
    handleDetail({ id }) {
      this.$router.push({
        name: 'shiftChangeOperate',
        query: {
          id,
          status: 'detail'
        }
      })
    },
    handleUpdate({ id }) {
      this.$router.push({
        name: 'shiftChangeOperate',
        query: {
          id,
          status: 'update'
        }
      })
    },
    handleDelete(row) {
      this.$confirm('是否确定要删除？删除后无法恢复', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Api.deleteData({ ids: row.id }).then(res => {
          this.$message({ type: 'success', message: '删除成功' })
          this.fetchData()
        })
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消删除' })
      })
    },
    formatRepair(row, column, cellValue) {
      if (typeof cellValue !== 'number') return cellValue
      return cellValue ? '异常' : '正常'
    },
  },
};
</script>

<style lang="scss" scoped>
.search-header-style {
  padding-top: 16px;
}
.card-item {
  margin-top: 0;
  padding-top: 10px;
}
</style>
