<!--
  清洗烘干/创建清洗任务
  operateType操作物料类型 0：S原料 1：T原料 2：石墨件（坩埚） 3：石墨件（其他）
-->
<template>
  <div class="detailBox">
    <CodeScanner v-model="scanCode" :placeholder="`请扫描或输入${scanLabel}`" style="margin-top: 10px;" @has-done="hasDon"/>

    <div class="topInfoCard" v-for="(item,i) in scanList" :key="i">
      <!-- body -->
      <div :class="'grid-container'">
        <el-button class="c-del" type="danger" size="mini" @click="deleteItem(i)">删除</el-button>
        <div class="grid-item">
          <span class="grid-item-name">批次号：</span>
          <strong class="grid-item-value">{{ item.materialBatchNo }}</strong>
        </div>

        <div v-if="typeS" class="grid-item">
          <span class="grid-item-name">出库单：</span>
          <span class="grid-item-value">{{ item.outputBillNo }}</span>
        </div>

        <template v-if="typeCruciblePiece || typeOtherPiece">
          <div class="grid-item">
            <span class="grid-item-name">唯一码：</span>
            <span class="grid-item-value">{{ item.uniqueCode }}</span>
          </div>
          <div class="grid-item">
            <span class="grid-item-name">数量：</span>
            <span class="grid-item-value">1</span>
          </div>
        </template>

        <div class="grid-item">
          <span class="grid-item-name">物料{{ typeS || typeT ? '料号' : '编码' }}：</span>
          <span class="grid-item-value">{{ item.materialCode }}</span>
        </div>
        <div class="grid-item">
          <span class="grid-item-name">物料名称：</span>
          <span class="grid-item-value">{{ item.materialName }}</span>
        </div>

        <!-- S原料时 -->
        <div v-show="typeS" class="grid-item">
          <span class="grid-item-name">规格：</span>
          <span class="grid-item-value">{{ item.spec }}</span>
        </div>

        <!-- S原料 / T原料 时 -->
        <div v-show="typeS || typeT" class="grid-item">
          <span class="grid-item-name">重量kg：</span>
          <span class="grid-item-value">{{ item.weight }}</span>
        </div>
      </div>
    </div>

    <!-- 其他表单卡片 -->
    <div class="fromCard">
      <div class="fromCard">
        <div class="headLine">
          <div class="headLine-title">录入工序数据</div>
        </div>
        <el-form ref="detailForm" :model="detailForm" class="main-wrap" label-width="120px" :rules="rules">
          <el-row>
            <el-col :span="12">
              <el-form-item label="清洗机编号" prop="cleanMachineNo">
                <el-select v-model="detailForm.cleanMachineNo" style="width: 100%;">
                  <el-option v-for="(item,i) in cleanMachineNoMap" :key="i" :value="item.code"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="清洗操作人" prop="operatorName">
                <SelectUserinfo
                  v-model="detailForm.operatorName"
                  style="width: 100%;"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="清洗方式" prop="cleanType">
                <el-select v-model="detailForm.cleanType" style="width: 100%;">
                  <el-option v-for="(item, i) in cleanTypeMap" :key="i" :value="item"/>
                </el-select>
              </el-form-item>
            </el-col>

            <!-- S原料 / 石墨件（其他） 时 -->
            <el-col v-if="typeS || typeOtherPiece" :span="12">
              <el-form-item label="纯水电阻率" prop="waterResistivity">
                <el-input-number v-model="detailForm.waterResistivity" :min="0" @focus="$event.target.select()" :controls="false"></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <template v-if="detailForm.cleanType === '机洗'">
              <!-- S原料 / T原料 时 -->
              <el-col v-if="typeS || typeT" :span="12">
                <el-form-item label="超声频率Hz" prop="ultrasonicFrequency">
                  <el-input v-trim v-model="detailForm.ultrasonicFrequency"/>
                </el-form-item>
              </el-col>

              <!-- S原料 / T原料 / 石墨件（坩埚） 时 -->
              <el-col v-if="typeS || typeT || typeCruciblePiece" :span="12">
                <el-form-item label="转速" prop="speed">
                  <el-input v-trim v-model="detailForm.speed"/>
                </el-form-item>
              </el-col>

              <!-- 石墨件（其他） 时 -->
              <el-col v-if="typeOtherPiece" :span="12">
                <el-form-item label="开始清洗时间" prop="cleanStartTime">
                  <el-date-picker
                    v-model="detailForm.cleanStartTime"
                    type="datetime"
                    placeholder="开始清洗时间"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    style="width: 100%;"
                  />
                </el-form-item>
              </el-col>
            </template>

            <el-col :span="24">
              <el-form-item label="备注" prop="cleanMachineMark">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4}"
                  placeholder="请输入内容"
                  v-model="detailForm.cleanMachineMark">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="添加附件" prop="attachment">
                <!-- 图片 -->
                <PhotoNew
                  v-model="imageList"
                ></PhotoNew>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>

    <!-- 页面操作 -->
    <div class="pageHandleBox">
      <el-button class="submit" type="primary" @click="generate">生成清洗批次</el-button>
    </div>

    <!--选择批次 弹窗-->
    <SelectBatchDialog
      :visible.sync="batchDialogVisible"
      :list="batchList"
      @has-confirm="handleSelectBatch"
    />

    <!-- 打印弹窗组件 -->
    <print-dialog
      :print-list="printList"
      :visible.sync="printVisible"
      :print-data="printData"
      @handleData="handleData"
    />
  </div>
</template>

<script>
import * as Api from '@/api/cleanDry'
import CodeScanner from '@/components/CodeScanner';
import PhotoNew from "@/views/components/photoNew.vue";
import PrintDialog from "@/views/components/printDialog.vue";
import SelectUserinfo from "@/components/select_userinfo.vue";
import {operateTypeList} from "@/constants";
import {equipmentListByPage} from "@/api/eqp";
import SelectBatchDialog from "./SelectBatchDialog.vue";

const deflutFrom = {
  attachment:'',
  cleanType: '', // 清洗方式
  waterResistivity:'', // 纯水电阻率
  ultrasonicFrequency: '', // 超声频率Hz
  speed: '', // 转速
  cleanStartTime: '', // 开始清洗时间
  cleanMachineNo:'',
  operatorName:'', // 清洗操作人
  cleanMachineMark:''
}
export default {
  name: 'CreateFrom',
  components:{
    SelectBatchDialog,
    SelectUserinfo,
    PhotoNew,
    CodeScanner,
    PrintDialog
  },
  data() {
    return {
      detailInfo:{}, // 描述信息
      scanCode:'',
      scanList:[],
      batchList:[],
      batchDialogVisible:false,
      cleanTypeMap: ['人工洗', '机洗'], // 清洗方式map
      printVisible:false,
      printData: {
        data: '', // 打印基础信息
        documentMould: '清洗烘干-清洗批次号打印', // 	打印模版名称
        printNum: 1,
        type: 1 // 执行类型：0：不填充数据，1：填充数据
      },
      imageList:[],
      printList:[],
      cleanMachineNoMap:[],
      detailForm:{},
      rules:{
        cleanMachineNo:[{ required: true, message: '必填项', trigger: 'change' }],
        waterResistivity:[{ required: true, message: '必填项', trigger: 'change' }],
        cleanType:[{ required: true, message: '必选项', trigger: 'change' }],
      }
    }
  },
  computed:{
    // 操作物料类型为'S原料'
    typeS() {
      return this.detailForm.operateType === 0
    },
    // 操作物料类型为'T原料'
    typeT() {
      return this.detailForm.operateType === 1
    },
    // 操作物料类型为'石墨件（坩埚）'
    typeCruciblePiece() {
      return this.detailForm.operateType === 2
    },
    // 操作物料类型为'石墨件（其他）'
    typeOtherPiece() {
      return this.detailForm.operateType === 3
    },
    scanLabel() {
      return this.typeS || this.typeT ? '物料批次号' : '物料唯一码'
    },
    calcTypeLabel() {
      const matched = operateTypeList.find(item => item.value === this.detailForm.operateType)
      return matched ? matched.label : ''
    },

  },
  created(){
    this.detailForm = Object.assign({},deflutFrom)
    // 接收路由传参数据
    this.detailInfo = this.$route.query || {}
    const operateType = Number(this.detailInfo.operateType || 0)
    this.detailForm.operateType = operateType
    if (operateType === 3) {
      // 石墨件（其他） 时
      this.detailForm.cleanType = '机洗'
    }

    this.$route.meta.text = `创建${this.calcTypeLabel}清洗任务`

    this.getEquipmentList()
  },
  methods: {
    //处理打印后数据
    handleData(){
      this.$router.push({ path: '/cleanDry'})
    },
    //扫码获取物料数据
    hasDon(){
      const scanCode = this.scanCode
      this.scanCode = ''
      if (!scanCode) return

      Api.warehouseListAll({
        [this.typeS || this.typeT ? 'search_EQ_batchNo' : 'search_EQ_uniqueCode']: scanCode,
        search_EQ_useType: 0
      }).then(res => {
        if (!res.data || !res.data.length) return this.$message.warning('无数据!')

        if (this.typeS && res.data.length > 1) {
          this.batchDialogVisible = true
          this.batchList = res.data
          return
        }

        const row = res.data[0]
        if (this.scanList.length) {
          if (this.typeT || this.typeCruciblePiece) return this.$message.warning(`只能扫描一个${this.scanLabel}!`)

          if (row.materialModelCode !== this.scanList[0].materialCode) {
            return this.$message.warning(`${this.scanLabel}不一致!`)
          }
        }

        if (this.scanList.some(item => item.materialWarehouseItem.id === row.id)) return

        this.pushScanList(row)
      });
    },
    pushScanList(row) {
      this.scanList.push({
        materialWarehouseItem: row,
        materialBatchNo: row.batchNo,
        outputBillNo: row.outputBillNo,
        materialTypeName: row.materialTypeName,
        materialCode: row.materialModelCode,
        materialName: row.materialModelName,
        weight: row.outputCount,
        spec: row.specification,
        uniqueCode: row.uniqueCode
      })
    },
    handleSelectBatch(list) {
      const used = {}
      this.scanList.forEach(row => used[row.materialWarehouseItem.id] = true)
      list.forEach(row => {
        if (used[row.id]) return
        if (this.scanList.length && row.materialModelCode !== this.scanList[0].materialCode) return // 物料号要一致
        this.pushScanList(row)
      })
    },
    //生成批次
    generate(){
      if(this.scanList.length === 0)return this.$message.warning('请扫描物料')
      this.$refs.detailForm.validate((valid) => {
        if (valid) {
          this.detailForm.attachment = JSON.stringify(this.imageList)
          const materialDetails = []
          const materialWarehouse = []
          let totalWeight = 0
          const {materialCode,materialName,materialTypeName,spec,} = this.scanList[0]
          this.scanList.forEach(({ materialWarehouseItem, ...item }) => {
            materialDetails.push(item)
            materialWarehouse.push(materialWarehouseItem)
            totalWeight += item.weight
          })
          const saveData = {
            materialCode,
            materialName,
            materialTypeName,
            spec,
            submitType:0,
            operateType:this.detailForm.operateType,
            materialDetails, // 清洗物料详情信息
            materialWarehouse, // 清洗物料详情信息
            crucibleCleanProcess:this.detailForm,
            totalWeight // 混合料总重量
          }
          Api.create(saveData).then(res => {
            this.$message.success('创建成功')
            this.$router.push({ path: '/cleanDry'})
          })
        }
      });
    },
    //删除
    deleteItem(i){
      this.scanList.splice(i,1)
    },
    // 查询清洗机设备列表
    getEquipmentList() {
      equipmentListByPage({
        page: 1,
        rows: 10000,
        search_EQ_deviceTypeName: '清洗机',
        search_EQ_enableState: 1, // 启用状态
      }).then(res => {
        this.cleanMachineNoMap = res.rows || []
      });

    }
  }
}
</script>

<style lang="scss" scoped>
.el-input-number {
  width: 100%;
}
.c-del {
  position: absolute;
  top: 8px;
  right: 8px;
}
</style>
