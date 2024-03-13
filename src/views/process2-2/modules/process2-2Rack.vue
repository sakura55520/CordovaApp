<!--工序2-2批量上料-->
<template>
  <div class="detailBox">
    <el-form ref="detailForm" :model="detailForm" label-width="120px" :rules="rules" style="padding: 0 10px 0 0;">
      <div class="topInfoCard">
        <el-row>
          <el-col :span="12">
            <el-form-item label="热压机编号" prop="equipmentCode">
              <el-select v-model="detailForm.equipmentCode" style="width: 100%;" @change="handleEqpChange">
                <el-option v-for="(item, index) in eqpList" :key="index" :value="item.code"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工艺" prop="technology">
              <el-select v-model="detailForm.technology" filterable style="width: 100%;">
                <el-option v-for="(item, index) in technologyList" :key="index" :value="item.value" :label="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <!-- 其他表单卡片 -->
      <div class="fromCard">
        <div class="headLine">
          <div class="headLine-title">录入上料数据</div>
          <el-button type="primary" plain @click="openSelectOrder">选择工单</el-button>
        </div>
        <div class="main-wrap">
          <el-row v-if="fieldVisible">
            <el-col :span="12">
              <el-form-item label="石墨底座" prop="graphiteBase">
                <el-input v-trim v-model="detailForm.graphiteBase" placeholder="请输入石墨底座"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="盖" prop="lid">
                <el-input v-trim v-model="detailForm.lid" placeholder="请输入盖"/>
              </el-form-item>
            </el-col>
          </el-row>

          <div>
            <div v-for="(item, index) in detailForm.list" :key="index" class="barrelList">
              <div class="barrelListHeadLine">
                <div class="barrelListHeadLine-title"> <el-tag size="mini">{{ index+1 }}</el-tag> </div>
                <div class="barrelListHeadLine-tip">
                  <el-button type="danger" size="mini" @click="handleDelete(index)">删除</el-button>
                </div>
              </div>
              <div>

                <el-form-item
                  :prop="'list.' + index + '.uniqueCode'"
                  :rules="{required: true, message: '请扫描籽晶编号', trigger: 'change'}"
                  label-width="0px"
                >
                  <CodeScanner ref="CodeScanner" v-model="item.uniqueCode" :placeholder="'请扫描籽晶编号'" @has-done="fetchInfo(index, true)"/>
                </el-form-item>

                <div v-if="item.planOrderNo" class="flex-container">
                  <div class="grid-item">
                    <span class="grid-item-name">订单号</span>
                    <span class="grid-item-value">{{ item.planOrderNo }}</span>
                  </div>
                  <div class="grid-item">
                    <span class="grid-item-name">类型</span>
                    <span class="grid-item-value">{{ item.materialType }}</span>
                  </div>
                  <div class="grid-item">
                    <span class="grid-item-name">直径</span>
                    <span class="grid-item-value">{{ item.diameter }}</span>
                  </div>
                  <div class="grid-item">
                    <span class="grid-item-name">规格</span>
                    <span class="grid-item-value">{{ item.specification }}</span>
                  </div>
                  <div class="grid-item">
                    <span class="grid-item-name">等级</span>
                    <span class="grid-item-value">{{ item.materialLevel }}</span>
                  </div>
                </div>

                <el-row>
                  <el-col v-if="fieldVisible" :span="12">
                    <el-form-item
                      label="籽晶位置"
                      :prop="'list.' + index + '.seedPosition'"
                      :rules="{required: true, message: '必选项', trigger: 'change'}"
                      @click.native="openPosition(index)"
                    >
                      <el-input v-trim v-model="item.seedPosition" placeholder="请选择籽晶位置" readonly/>
                    </el-form-item>
                  </el-col>
                  <!--最后一个籽晶取消“压块”的录入-->
                  <el-col v-if="index < detailForm.list.length - 1" :span="12">
                    <el-form-item
                      label="压块"
                      :prop="'list.' + index + '.block'"
                      :rules="{required: true, message: '必填项', trigger: 'blur'}"
                    >
                      <el-input v-trim v-model="item.block" placeholder="请输入压块"/>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>

          <el-button class="block-btn" type="primary" plain @click="handleIncrease"><i class="el-icon-plus"/>添加籽晶</el-button>
        </div>
        <br>
      </div>
    </el-form>

    <!-- 页面操作 -->
    <div class="pageHandleBox">
      <el-button class="save" @click="handle('保存')">保存</el-button>
      <el-button class="submit" type="primary" @click="handle('提交')">提交上料</el-button>
    </div>

    <!--选择工单 弹窗-->
    <SelectOrderDialog
      :visible.sync="dialogVisible"
      wip-storage-status="0"
      select-type="multiple"
      @has-confirm="handleSelectOrder"
    />

    <!-- 弹窗 选择位置 -->
    <SelectPositionDialog
      :visible.sync="positionVisible"
      :list="list"
      :position="position"
      :used-position="totalUsedPosition"
      @has-confirm="handleSelectPosition"
    />
  </div>
</template>

<script>
import {getSeleteData} from "@/utils/select";
import CodeScanner from "@/components/CodeScanner.vue";
import SelectPositionDialog from "@/views/components/SelectPositionDialog.vue";
import {inStation} from "@/api/trendsform/trendsform";
import {getCurrentWipStorageData} from "@/api/overStation/overStation";
import * as Api from '@/api/process2-2'
import SelectOrderDialog from "./SelectOrderDialog.vue";
import {equipmentListByPage} from "@/api/eqp";

const defaultItem = {
  uniqueCode: null, // 籽晶编号
  seedPosition: null, // 籽晶位置
  block: null, // 压块
}

const defaultForm = {
  equipmentCode: null, // 热压机编号
  equipmentId: null,
  technology: null, // 热压机工艺
  graphiteBase: null, // 石墨底座
  lid: null, // 盖
  list: [{ ...defaultItem }]
}
export default {
  name: 'process2-2Rack',
  components: {
    SelectOrderDialog,
    CodeScanner,
    SelectPositionDialog
  },
  data() {
    return {
      detailForm: Object.assign({}, JSON.parse(JSON.stringify(defaultForm))),
      rules: {
        equipmentCode: [{ required: true, message: '必选项', trigger: 'change' }],
        technology: [{ required: true, message: '必选项', trigger: 'change' }],
      },
      disabled: true,
      eqpList: [],
      technologyList: [], // 工艺list
      scanCode: '',
      dialogVisible: false,
      processUuid: '',
      positionVisible: false,
      position: '',
      list: [
      {
        "label": "1",
        "children": [
          {
            "label": "A",
            "value": "1-A"
          },
          {
            "label": "B",
            "value": "1-B"
          },
          // {
          //   "label": "C",
          //   "value": "1-C"
          // },
          // {
          //   "label": "D",
          //   "value": "1-D"
          // },
          // {
          //   "label": "E",
          //   "value": "1-E"
          // },
          // {
          //   "label": "F",
          //   "value": "1-F"
          // },
          // {
          //   "label": "G",
          //   "value": "1-G"
          // }
        ]
      },
    ], // 列表数据
      usedPosition: {}, // 已占用的位置 obj
      totalUsedPosition: {},
      currentIdx: 0,
    }
  },
  computed: {
    fieldVisible() {
      // 退火炉为 '1#R贴蜡机' 时, 隐藏一些字段
      return this.detailForm.equipmentCode !== '1#R贴蜡机'
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
        this.detailForm.list[0].uniqueCode = processingOrderCode
        this.fetchInfo(0, true)
      } else {
        let storageData = sessionStorage.getItem(`工序2-2批量上料`)
        if (storageData) {
          let {detailForm} = JSON.parse(storageData)
          this.detailForm = Object.assign({}, defaultForm, detailForm)
        }
      }

      this.fetchEqpList() // 获取热压机list
      getSeleteData('process2-2Tec', this.technologyList) // 工艺list
    },
    reset() {
      this.detailForm = Object.assign({}, JSON.parse(JSON.stringify(defaultForm)))
      this.$nextTick(() => {
        this.$refs.detailForm.clearValidate()
      })
    },
    // 操作
    async handle(typeName = '') {
      if (typeName === '保存') {
        let saveData = {
          detailForm: this.detailForm
        }
        sessionStorage.setItem(`工序2-2批量上料`, JSON.stringify(saveData))
        this.$message.success('保存成功')
        this.$router.push('/process2-2')
      }
      if (typeName === '提交') {
        this.$refs.detailForm.validate((valid) => {
          if (valid) {
            const { list, ...form } = this.detailForm
            if (!list.length) return this.$message.error('上料籽晶, 请添加籽晶!')
            this.$confirm('确认进行批量上料?', '提示', {
              type: 'warning'
            }).then(async () => {
              // 1.根据籽晶编号查询当前在制品信息, 获取processUuid
              if (!this.processUuid) {
                const uniqueCode = list[0].uniqueCode // 籽晶编号
                const resWip = await getCurrentWipStorageData(uniqueCode)
                if (resWip.data && resWip.data[0]) {
                  if (resWip.data[0].operationData !== this.$route.path) {
                    return this.$message.warning(`【${uniqueCode}】已经不再当前站点, 请刷新列表后重新操作!`)
                  }
                  this.processUuid = resWip.data[0].processUuid
                }
              }

              if (!(this.processUuid && typeof this.processUuid === 'string')) return this.$message.warning('获取在制品信息失败! 请重试')

              sessionStorage.removeItem(`工序2-2批量上料`)

              // 2.循环调用进站接口, 一次请求成功后, 再继续请求
              for (let i = 0; i < list.length; i++) {
                await this.inStation({
                  ...list[i],
                  ...form
                })
              }

              this.$message.success('批量上料操作成功!')
              this.reset()
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
    // 获取热压机list
    fetchEqpList() {
      equipmentListByPage({
        search_EQ_enableState: 1, // 启用状态
        search_EQ_deviceTypeName: '热压机',
        rows: 1000,
        page: 1
      }).then(res => {
        this.eqpList = res.rows || []
      })
    },
    // 判断籽晶编号是否已经存在了
    isExist(uniqueCode, index) {
      const { list } = this.detailForm
      if (!list || !uniqueCode) return false
      for (let i = 0; i < list.length; i++) {
        if (i === index) continue
        if (uniqueCode === list[i].uniqueCode) return true
      }
      return false
    },
    async fetchInfo(index = 0, showMsg = true) {
      const row = this.detailForm.list[index] || {}
      const { uniqueCode } = row
      if (!uniqueCode) return
      if (this.isExist(uniqueCode, index)) {
        this.detailForm.list[index].uniqueCode = ''
        this.$message.warning(uniqueCode + '已存在, 请不要重复录入!')
        return
      }

      // 根据籽晶编号查询详情
      this.scanCode = ''
      const res = await Api.getByScan({
        processingCode: uniqueCode,
        wipStorageStatus: 0, // 在制品状态，1：已进站，0：待进站
      })
      if (!res.data) {
        this.detailForm.list[index].uniqueCode = ''
        return this.$message.warning(`${uniqueCode} 不是工序2-2待进站状态!`)
      }
      this.$set(this.detailForm.list, index, Object.assign(row, res.data))
      // this.$forceUpdate()
      if (showMsg) this.$message.success(`扫码成功, ${uniqueCode} 加入上料!`)
    },
    handleIncrease() {
      this.detailForm.list.push({ ...defaultItem })
    },
    handleDelete(index) {
      this.detailForm.list.splice(index, 1)
      // this.$confirm('是否确定要删除？', '提示', {
      //   type: 'warning'
      // }).then(() => {
      //   this.detailForm.list.splice(index, 1)
      // }).catch(() => {})
    },
    async handleEqpChange(code) {
      this.detailForm.equipmentId = null
      this.usedPosition = {}
      const valid = await this.validateEqp(code)
      if (!valid) {
        this.$message.warning(`${code} 正在加工中, 请重新选择!`)
        this.detailForm.equipmentCode = ''
        return
      }

      let matched
      if (code) {
        matched = this.eqpList.find(item => item.code === code)
      }
      if (matched) {
        this.detailForm.equipmentId = matched.id

        // 籽晶位置
        const { position } = matched
        const arrUsedPostion = (position || '').split(',')
        arrUsedPostion.forEach(posItem => {
          this.usedPosition[posItem] = true
        })
      }
    },
    async validateEqp(code) {
      const res = await Api.processingOrderListByPage({
        search_EQ_processName: '工序2-2',
        search_EQ_status: 1, // 工单状态（0：待加工；1：加工中；2：加工完成；3：入库完成）
        search_EQ_wipStorageStatus: 1, // 待出站
        search_EQ_equipmentCode: code,
      })
      // 查出有数据, 就提示设备在使用
      return res.data.total === 0
    },
    openSelectOrder() {
      this.dialogVisible = true
    },
    handleSelectOrder(list) {
      const used = {}
      this.detailForm.list.forEach(({ uniqueCode }) => used[uniqueCode] = true)
      list.forEach(({ uniqueCode }) => {
        if (used[uniqueCode]) return
        const row = {
          ...defaultItem,
          uniqueCode
        }
        const emptyIdx = this.detailForm.list.findIndex(({ uniqueCode }) => !uniqueCode)
        let currentIdx
        if (emptyIdx > -1) {
          currentIdx = emptyIdx
          this.$set(this.detailForm.list, emptyIdx, row)
        } else {
          const length = this.detailForm.list.push(row)
          currentIdx = length - 1
        }

        // 获取详情
        this.fetchInfo(currentIdx, false)
      })
    },
    openPosition(index) {
      if (!this.detailForm.equipmentCode) return this.$message.error('请先选择热压机编号!')

      this.totalUsedPosition = { ...this.usedPosition }
      this.detailForm.list.forEach(({ seedPosition }, i) => {
        if (seedPosition && i !== index) this.totalUsedPosition[seedPosition] = true
      })
      this.positionVisible = true
      this.currentIdx = index
      this.position = this.detailForm.list[index].seedPosition || ''
    },
    handleSelectPosition(seedPosition) {
      this.detailForm.list[this.currentIdx].seedPosition = seedPosition
    }
  }
}
</script>
