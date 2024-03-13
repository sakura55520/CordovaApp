<template>
  <el-dialog
    :visible.sync="dialogFormVisible"
    title="浏览入库单"
    custom-class="dialog"
    top="5vh"
    width="95%"
    append-to-body
    destroy-on-close
  >
    <el-form :model="fromData" label-width="50px" style="padding: 0 16px;">
      <div class="topInfoCard">
        <div :class="'grid-container'">
          <div class="grid-item">
            <span class="grid-item-name">申请人</span>
            <span class="grid-item-value">
              <span>{{ fromData.applyUserName }}</span>
            </span>
          </div>
          <div class="grid-item">
            <span class="grid-item-name">组织编码</span>
            <span class="grid-item-value">{{ fromData.organization }}</span>
          </div>
          <div class="grid-item">
            <span class="grid-item-name">入库仓库编号</span>
            <span class="grid-item-value">{{ fromData.warehouse }}</span>
          </div>
          <div class="grid-item">
            <span class="grid-item-name">生产部门名称</span>
            <span class="grid-item-value">{{ fromData.department }}</span>
          </div>
        </div>
      </div>

      <div class="topInfoCard">
        <el-table :data="fromTable">
          <el-table-column prop="batchNo" label="批次号" min-width="180"></el-table-column>
          <el-table-column prop="materialCode" label="物料编码"></el-table-column>
          <el-table-column prop="materialName" label="物料名称"></el-table-column>
          <el-table-column prop="specification" label="规格" width="60"></el-table-column>
          <el-table-column prop="quantity" label="数量" width="60"></el-table-column>
          <el-table-column prop="unitName" label="单位" width="60"></el-table-column>
        </el-table>
      </div>


      <div class="topInfoCard">
        <el-form-item label="备注">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入内容"
            v-model="fromData.remark">
          </el-input>
        </el-form-item>
      </div>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button class="save" @click="dialogFormVisible = false">取 消</el-button>
      <el-button class="submit" type="primary" @click="saveTable">确认入库</el-button>
    </div>

    <!-- 打印弹窗组件 -->
    <print-dialog
      :print-list="printList"
      :visible.sync="printVisible"
      :print-data="printData"
      @handleData="close"
    />
  </el-dialog>
</template>

<script>
import * as Api from '@/api/seedWarehousing'
import {getSeleteData} from '@/utils/select.js'
import {getFactoryModel} from "@/api/tool";

export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    fromTable: {
      type: Array,
      require: true
    }
  },
  data() {
    return {
      fromData: {
        applyUserName: window.sessionStorage.getItem('realName'), // 申请人
        applyUserId: sessionStorage.getItem('userId'),
        organization: '003', // 组织编码
        warehouse: '',
        department: '籽晶车间', // 部门
        remark: '',
      },
      printVisible: false,
      printData: [],
      printList: [],
    }
  },
  computed: {
    dialogFormVisible: {
      get() {
        return this.visible
      },
      set(visible) {
        this.$emit('update:visible', visible)
      }
    },
  },
  created() {
    this.fetchWarehouseCode() // 获取入库仓库编号
  },
  methods: {
    async saveTable() {
      const data = []
      this.fromTable.forEach(row => {
        data.push({
          ...row,
          ...this.fromData
        })
      })
      // 调用入库接口
      await Api.inputStorage(data).then(res => {
        this.$message.success('入库成功')
      })
      this.close()
    },
    close() {
      this.dialogFormVisible = false
      this.$emit('has-down')
    },
    // 获取入库仓库编号
    async fetchWarehouseCode() {
      const warehouseCodeMap = []
      await getSeleteData('warehouseCode', warehouseCodeMap)
      const matched = warehouseCodeMap.find(item => item.name === '籽晶')
      if (matched) this.fromData.warehouse = matched.value
    }
  }
}
</script>
