<!--装炉长晶/成品入库-->
<template>
  <el-dialog
    :visible.sync="dialogFormVisible"
    custom-class="dialog"
    top="5vh"
    width="95%"
    title="浏览入库单"
    append-to-body
    destroy-on-close
  >
    <el-form :model="fromData" label-suffix=":" label-width="120px" style="padding: 0 16px;">
      <div class="topInfoCard">
        <el-row>
          <el-col :span="12">
            <el-form-item label="申请人">
              {{ fromData.applicant }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="组织编码">
              {{ fromData.organizationNumber }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入库仓库编号">
              {{ fromData.warehouseNumber }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生产部门名称">
              {{ fromData.productionDepartment }}
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <div class="topInfoCard">
        <el-table :data="fromTable">
          <el-table-column prop="crystalNo" label="晶体编号" width="140" fixed></el-table-column>
          <el-table-column prop="crystalNo" label="批次号" width="140"></el-table-column>
          <el-table-column prop="materialCode" label="物料编码" width="140"></el-table-column>
          <el-table-column prop="materialName" label="物料名称" width="160"></el-table-column>
          <el-table-column prop="spec" label="规格"></el-table-column>
          <el-table-column prop="crystalGrade" label="晶体等级" width="140"></el-table-column>
          <el-table-column prop="destination" label="晶体去向" width="140"></el-table-column>
          <el-table-column label="应收主数量" width="100" fixed="right">
            <template slot-scope="{ row }">
              {{ row.num }}{{ row.unit }}
            </template>
          </el-table-column>
          <el-table-column label="应收数量" width="90" fixed="right">
            <template slot-scope="{ row }">
              {{ row.shouldQuantity }}{{ row.shouldUnit }}
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="topInfoCard">
        <el-form-item label="备注" label-width="50px">
          <el-input
            v-model="fromData.remark"
            :autosize="{ minRows: 3 }"
            type="textarea"
          />
        </el-form-item>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button class="cancle" @click="closeDialog">取 消</el-button>
      <el-button class="submit" type="primary" @click="saveTable">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import * as Api from '@/api/CPWarehousing'
import {getSeleteData} from '@/utils/select.js'
import {getFactoryModel} from "@/api/tool";
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      required: true
    },
    // 入库仓库编号
    warehouseNumber: {
      type: String,
      required: true
    },
    fromTable:{
      type: Array,
      require: true
    }
  },
  data() {
    return {
      warehouseCodeMap:[],
      fromData:{
        applicant:window.sessionStorage.getItem('realName'),
        organizationNumber:'003',
        warehouseNumber:'', // 入库仓库编号
        productionDepartment:'晶体生长车间',
        remark:'',
        crucibleProductStorageBatchDetails:this.fromTable
      }
    }
  },
  computed: {
    dialogFormVisible: {
      get() {
        return this.dialogVisible
      },
      set(visible) {
        this.$emit('update:dialogVisible', visible)
      }
    }
  },
  watch: {
    dialogFormVisible(visible) {
      if (visible) {
        this.fromData.warehouseNumber = this.warehouseNumber // 入库仓库编号
      }
    }
  },
  methods: {
    closeDialog() {
      this.dialogFormVisible = false
      this.$emit('getByPage');
    },
    saveTable(){
      this.dialogFormVisible = false
      const saveData = JSON.parse(JSON.stringify(this.fromData))
      saveData.crucibleProductStorageBatchDetails = this.fromTable
      Api.create(saveData).then(res => {
        this.$message.success('入库成功')
        this.closeDialog()
      })
    },
  }
}
</script>
