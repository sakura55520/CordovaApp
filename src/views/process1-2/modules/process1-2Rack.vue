<!--工序1-2批量上料-->
<template>
  <div class="detailBox">
    <div class="topInfoCard">
      <el-form ref="detailForm" :model="detailForm" label-width="120px" :rules="rules" style="padding: 0 10px 0 0;">
        <el-row>
          <el-col :span="12">
            <el-form-item label="管式炉编号" prop="equipmentCode">
              <el-select v-model="detailForm.equipmentCode" style="width: 100%;" @change="handleEqpChange">
                <el-option v-for="(item, index) in eqpList" :key="index" :value="item.code"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="管式炉工艺" prop="technology">
              <el-select v-model="detailForm.technology" filterable style="width: 100%;">
                <el-option v-for="(item, index) in technologyList" :key="index" :value="item.value" :label="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 其他表单卡片 -->
    <div class="fromCard">
      <div class="headLine">
        <div class="headLine-title">上料清单</div>
        <el-button type="primary" plain @click="openSelectOrder">选择工单</el-button>
      </div>

      <div class="main-wrap">
        <CodeScanner v-model="scanCode" placeholder="请扫描籽晶编号" style="margin-bottom: 12px;" @has-done="fetchInfo"/>

        <el-table :data="list">
          <el-table-column prop="uniqueCode" label="籽晶编号"/>
          <el-table-column prop="planOrderNo" label="订单号"/>
          <el-table-column prop="materialType" label="类型"/>
          <el-table-column prop="diameter" label="直径" width="60"/>
          <el-table-column prop="specification" label="规格" width="60"/>
          <el-table-column prop="materialLevel" label="等级" width="60"/>
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

    <!--选择工单 弹窗-->
    <SelectOrderDialog
      :visible.sync="dialogVisible"
      wip-storage-status="0"
      select-type="multiple"
      @has-confirm="handleSelectOrder"
    />
  </div>
</template>

<script>
import {getSeleteData} from "@/utils/select";
import CodeScanner from "@/components/CodeScanner.vue";
import SelectOrderDialog from "./SelectOrderDialog.vue";
import {inStation} from "@/api/trendsform/trendsform";
import {getCurrentWipStorageData} from "@/api/overStation/overStation";
import * as Api from '@/api/process1-2'
import {equipmentListByPage} from "@/api/eqp";

const defaultForm = {
  equipmentCode: null, // 管式炉编号
  equipmentId: null,
  technology: null, // 管式炉工艺
}
export default {
  name: 'process1-2Rack',
  components: {
    CodeScanner,
    SelectOrderDialog
  },
  data() {
    return {
      detailForm: Object.assign({}, defaultForm),
      rules: {
        equipmentCode: [{ required: true, message: '必选项', trigger: 'change' }],
        technology: [{ required: true, message: '必选项', trigger: 'change' }],
      },
      disabled: true,
      eqpList: [],
      technologyList: [],
      scanCode: '',
      list: [], // 籽晶列表
      dialogVisible: false,
      processUuid: '',
    }
  },
  created() {
    this.init()
  },
  methods: {
    // 页面初始化
    init() {
      this.reset()
      const { processUuid, processingOrderCode } = this.$route.query
      if (processingOrderCode) {
        this.processUuid = processUuid
        this.scanCode = processingOrderCode
        this.fetchInfo()
      } else {
        let storageData = sessionStorage.getItem(`工序1-2批量上料`)
        if (storageData) {
          let {detailForm, list} = JSON.parse(storageData)
          this.detailForm = Object.assign({}, defaultForm, detailForm)
          this.list = list
        }
      }

      this.fetchEqpList() // 获取管式炉list
      getSeleteData('process1-2Tec', this.technologyList) // 工艺list
    },
    reset() {
      this.list = []
      this.detailForm = Object.assign({}, defaultForm)
      this.$nextTick(() => {
        this.$refs.detailForm.clearValidate()
      })
    },
    // 操作
    async handle(typeName = '') {
      if (typeName === '保存') {
        let saveData = {
          detailForm: this.detailForm,
          list: this.list
        }
        sessionStorage.setItem(`工序1-2批量上料`, JSON.stringify(saveData))
        this.$message.success('保存成功')
        this.$router.push('/process1-2')
      }
      if (typeName === '提交') {
        this.$refs.detailForm.validate((valid) => {
          if (valid) {
            if (!this.list.length) return this.$message.error('上料清单为空, 请扫码/选择工单!')
            this.$confirm('确认进行批量上料?', '提示', {
              type: 'warning'
            }).then(async () => {
              // 1.根据籽晶编号查询当前在制品信息, 获取processUuid
              if (!this.processUuid) {
                const uniqueCode = this.list[0].uniqueCode // 籽晶编号
                const resWip = await getCurrentWipStorageData(uniqueCode)
                if (resWip.data && resWip.data[0]) {
                  if (resWip.data[0].operationData !== this.$route.path) {
                    return this.$message.warning(`【${uniqueCode}】已经不再当前站点, 请刷新列表后重新操作!`)
                  }
                  this.processUuid = resWip.data[0].processUuid
                }
              }

              if (!(this.processUuid && typeof this.processUuid === 'string')) return this.$message.info('获取在制品信息失败! 请重试')

              // 2.循环调用进站接口
              const postList = this.list.map(row => {
                return this.inStation({
                  ...row,
                  ...this.detailForm
                })
              })

              Promise.all(postList).then(res => {
                this.$message.success('批量上料操作成功!')
                this.reset()
              })
              sessionStorage.removeItem(`工序1-2批量上料`)
            })
          }
        })
      }
    },
    inStation({ processUuid, ...data }) {
      return inStation({
        equipmentCode: data.equipmentCode, // 设备号
        param: {
          FormData: JSON.stringify(data)
        },
        processUuid: this.processUuid, // 当前工序唯一标识
        processingOrderCode: data.processOrderCode // 工单号
      })
    },
    // 获取管式炉list
    fetchEqpList() {
      equipmentListByPage({
        search_EQ_enableState: 1, // 启用状态
        search_EQ_deviceTypeName: '管式炉',
        rows: 1000,
        page: 1
      }).then(res => {
        this.eqpList = res.rows || []
      })
    },
    handleEqpChange(code) {
      let matched
      if (code) {
        matched = this.eqpList.find(item => item.code === code)
      }
      this.detailForm.equipmentId = matched ? matched.id : null
    },
    async fetchInfo() {
      const processingCode = this.scanCode
      if (!processingCode) return

      // 根据籽晶编号查询详情
      this.scanCode = ''
      const res = await Api.getByScan({
        processingCode,
        wipStorageStatus: 0, // 在制品状态，1：已进站，0：待进站
      })
      if (!res.data) return this.$message.info(`${processingCode} 不是工序1-2待进站状态!`)

      const { uniqueCode } = res.data
      const exist = this.list.some(row => row.uniqueCode === uniqueCode)
      if (exist) return

      // 加入清单
      this.list.push(res.data)
      this.$message.success(`扫码成功, ${processingCode} 加入上料清单!`)

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
        const { uniqueCode } = row
        const exist = this.list.some(row => row.uniqueCode === uniqueCode)
        if (exist) return
        this.list.push(row)
      })
    }
  }
}
</script>
