<!--创建批量烘干-->
<template>
  <div class="detailBox">
    <div class="topInfoCard">
      <CodeScanner v-model="scanCode" placeholder="请扫描石墨件清洗批次号" style="margin-bottom: 12px;" @has-done="fetchInfo"/>
    </div>
    <!-- 其他表单卡片 -->
    <div class="fromCard">
      <div class="headLine">
        <div class="headLine-title">上料清单</div>
        <el-button type="primary" plain @click="openSelectOrder">选择清洗批次号</el-button>
      </div>

      <div class="main-wrap">
        <el-table :data="list">
          <el-table-column prop="cleanBatchNo" label="清洗批次号"/>
          <el-table-column prop="materialCode" label="物料编码"/>
          <el-table-column prop="materialName" label="物料名称"/>
          <el-table-column :formatter="formatOperateType" prop="operateType" label="清洗类型"/>
          <el-table-column prop="totalWeight" label="数量" width="60"/>
          <el-table-column label="操作" width="90">
            <template slot-scope="scope">
              <el-button icon="el-icon-delete" type="danger" @click="handleDelete(scope.$index)"/>
            </template>
          </el-table-column>
        </el-table>
      </div>

    </div>

    <!-- 页面操作 -->
    <div class="pageHandleBox">
      <el-button class="save" @click="handle('保存')">保存</el-button>
      <el-button class="submit" type="primary" @click="handle('提交')">提交</el-button>
    </div>

    <!--选择清洗批次号 弹窗-->
    <SelectOrderDialog
      :visible.sync="dialogVisible"
      wip-storage-status="0"
      select-type="multiple"
      @has-confirm="handleSelectOrder"
    />
  </div>
</template>

<script>
import CodeScanner from "@/components/CodeScanner.vue";
import SelectOrderDialog from "./SelectOrderDialog.vue";
import * as Api from '@/api/dry'
import {operateTypeList} from "@/constants";

export default {
  name: 'DryBatch',
  components: {
    CodeScanner,
    SelectOrderDialog
  },
  data() {
    return {
      scanCode: '',
      list: [], // 籽晶列表
      dialogVisible: false,
      processUuid: '',
      operateTypeList // 清洗类型list
    }
  },
  created() {
    this.init()
  },
  methods: {
    // 页面初始化
    init() {
      this.reset()
      let storageData = sessionStorage.getItem(`批量烘干`)
      if (storageData) {
        let {list} = JSON.parse(storageData)
        this.list = list
      }
    },
    reset() {
      this.list = []
    },
    // 操作
    async handle(typeName = '') {
      if (typeName === '保存') {
        let saveData = {
          list: this.list
        }
        sessionStorage.setItem(`批量烘干`, JSON.stringify(saveData))
        this.$message.success('保存成功')
        this.$router.push('/dry')
      }
      if (typeName === '提交') {
        if (!this.list.length) return this.$message.error('上料清单为空, 请扫码/选择清洗批次号!')
        this.$confirm('确认创建批量烘干?', '提示', {
          type: 'warning'
        }).then(async () => {
          Api.createBatch(this.list).then(res => {
            this.$message.success('创建成功!')
            sessionStorage.removeItem(`批量烘干`)
            this.reset()
          })
        })
      }
    },
    async fetchInfo() {
      const cleanBatchNo = this.scanCode
      if (!cleanBatchNo) return

      // 根据籽晶编号查询详情
      this.scanCode = ''
      const res = await Api.listByPage({
        search_EQ_cleanBatchNo: cleanBatchNo, // 清洗批次号
        search_IN_submitType: '0', // 待进站
        search_IN_operateType: '2,3', // 操作物料类型 0：S原料 1：T原料 2：石墨件（坩埚） 3：石墨件（其他）
      })
      const { rows } = res.data
      if (!rows || !rows.length) return this.$message.info(`${cleanBatchNo} 不是待进站状态!`)

      const { id } = rows[0]
      const exist = this.list.some(row => row.id === id)
      if (exist) return

      // 加入清单
      this.list.push(rows[0])
      this.$message.success(`扫码成功, ${cleanBatchNo} 加入上料清单!`)

    },
    handleDelete(index) {
      this.list.splice(index, 1)
      // this.$confirm('是否确定要删除？', '提示', {
      //   type: 'warning'
      // }).then(() => {
      //   this.list.splice(index, 1)
      // }).catch(() => {})
    },
    openSelectOrder() {
      this.dialogVisible = true
    },
    handleSelectOrder(list) {
      list.forEach(row => {
        const { id } = row
        const exist = this.list.some(row => row.id === id)
        if (exist) return
        this.list.push(row)
      })
    },
    formatOperateType(row, column, type) {
      const matched = this.operateTypeList.find(item => item.value === type)
      return matched ? matched.label : type
    },
  }
}
</script>
