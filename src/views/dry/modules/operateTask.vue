<!--
  烘干
  submitType进站状态 0是待进站，1 是待出站，2是已出站
  operateType操作物料类型 0：S原料 1：T原料 2：石墨件（坩埚） 3：石墨件（其他）
-->
<template>
  <div class="detailBox">
    <!-- 顶部信息卡片 -->
    <!-- 已合批 -->
    <div v-if="isCombined" class="topInfoCard">
      <div class="headLine">
        <div>
          <span class="headLine-name">烘干批次号 &nbsp;&nbsp; </span>
          <span class="headLine-value">{{ detailForm.combinedBatchNo }}</span>
        </div>
        <div>
          <span class="headLine-name">烘干类型 &nbsp;&nbsp; </span>
          <span class="headLine-value">{{ detailForm.operateType }}</span>
        </div>
      </div>
      <div class="grid-item" style="padding: 5px;">
        <span class="grid-item-name" style="min-width: 82px">混合批次：</span>
        <span class="grid-item-value">{{ detailForm.combinedMixBatch }}</span>
      </div>
      <div :class="'grid-container'">
        <div class="grid-item">
          <span class="grid-item-name">数量：</span>
          <span class="grid-item-value">{{ detailForm.totalWeight }}</span>
        </div>
      </div>
    </div>

    <!-- 未合批 -->
    <div v-else class="topInfoCard">
      <div class="headLine">
        <div>
          <span class="headLine-name">清洗批次号 &nbsp;&nbsp; </span>
          <span class="headLine-value">{{ detailForm.cleanBatchNo }}</span>
        </div>
        <div>
          <span class="headLine-name">{{ calcBatchLabel }} &nbsp;&nbsp; </span>
          <span class="headLine-value">{{ detailForm.materialBatchNo }}</span>
        </div>
      </div>
      <div :class="'grid-container'">
        <div class="grid-item">
          <span class="grid-item-name">物料编码：</span>
          <span class="grid-item-value">{{ detailForm.materialCode }}</span>
        </div>
        <div class="grid-item">
          <span class="grid-item-name">物料名称：</span>
          <span class="grid-item-value">{{ detailForm.materialName }}</span>
        </div>

        <!-- S原料时 -->
        <div v-if="detailForm.operateType === 0"  class="grid-item">
          <span class="grid-item-name">规格：</span>
          <span class="grid-item-value">{{ detailForm.spec }}</span>
        </div>
        <div class="grid-item">
          <span class="grid-item-name">{{ formatWeightLabel(detailForm.operateType) }}：</span>
          <span class="grid-item-value">{{ detailForm.totalWeight }}</span>
        </div>
      </div>
    </div>

    <!-- 其他表单卡片 -->
    <div class="fromCard">
      <div class="fromCard">
        <div class="headLine">
          <div class="headLine-title">录入工序数据</div>
        </div>
        <el-form ref="dryForm" :model="detailForm" class="main-wrap" label-width="120px" :rules="rules">
          <el-row>
            <el-col :span="12">
              <el-form-item label="烘干机编号" prop="dryerMachineNo">
                <el-select v-model="detailForm.dryerMachineNo" style="width: 100%;">
                  <el-option v-for="(item,i) in eqpMap" :key="i" :value="item.code"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col v-if="isStart" :span="12">
              <el-form-item label="烘干操作人" prop="operatorName">
                <SelectUserinfo
                  v-model="detailForm.operatorName"
                  style="width: 100%;"
                />
              </el-form-item>
            </el-col>

            <el-col v-if="isFinish" :span="12">
              <el-form-item label="烘干确认人" prop="confirmName">
                <SelectUserinfo
                  v-model="detailForm.confirmName"
                  style="width: 100%;"
                />
              </el-form-item>
            </el-col>

            <el-col v-if="typeS || typeGraphite" :span="12">
              <el-form-item label="气体流量" prop="gasVelocity">
                <el-input-number v-model="detailForm.gasVelocity" :min="0" @focus="$event.target.select()" :controls="false"></el-input-number>
              </el-form-item>
            </el-col>

            <el-col v-if="eqpMatchedA && typeGraphite" :span="12">
              <el-form-item label="烘干时长h" prop="dryerTime">
                <el-input-number v-model="detailForm.dryerTime" @focus="$event.target.select()" :precision="2" :min="0" :controls="false" style="width: 100%;"></el-input-number>
              </el-form-item>
            </el-col>

            <el-col v-if="totalTimeVisible" :span="12">
              <el-form-item label="烘干总时间h">
                <el-input-number v-model="detailForm.dryerTotalTime" @focus="$event.target.select()" :precision="2" :min="0" :controls="false" style="width: 100%;"></el-input-number>
              </el-form-item>
            </el-col>

            <el-col v-if="startTimeVisible" :span="12">
              <el-form-item label="开始烘干时间" prop="dryerStartTime">
                <el-date-picker
                  v-model="detailForm.dryerStartTime"
                  type="datetime"
                  placeholder="开始烘干时间"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  style="width: 100%;"
                  @change="handleTimeChange"
                />
              </el-form-item>
            </el-col>

            <el-col v-if="totalTimeVisible" :span="12">
              <el-form-item label="结束烘干时间" prop="dryerEndTime">
                <el-date-picker
                  v-model="detailForm.dryerEndTime"
                  type="datetime"
                  placeholder="结束烘干时间"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  style="width: 100%;"
                  @change="handleTimeChange"
                />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="设定温度" prop="setTemperature">
                <el-input-number v-model="detailForm.setTemperature" :min="0" @focus="$event.target.select()" :controls="false"></el-input-number>
              </el-form-item>
            </el-col>

            <template v-if="typeS">
              <el-col :span="12">
                <el-form-item label="恒温时间" prop="incubationTime">
                  <el-input-number v-model="detailForm.incubationTime" :min="0" @focus="$event.target.select()" :controls="false"></el-input-number>
                </el-form-item>
              </el-col>
            </template>

            <template v-if="isFinish && typeS">
              <el-col :span="24">
                <el-form-item label="结果判定" prop="result">
                  <el-radio-group v-model="detailForm.result" @change="handleResultChange">
                    <el-radio label="合格">合格</el-radio>
                    <el-radio label="部分返工">部分返工</el-radio>
                    <el-radio label="全部返工">全部返工</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <template v-if="detailForm.result !== '合格'">
                <el-col :span="12">
                  <el-form-item label="去向" prop="destination">
                    <el-radio-group v-model="detailForm.destination">
                      <el-radio label="返洗">返洗</el-radio>
                      <el-radio label="返筛">返筛</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="返工重量" prop="reworkWeight">
                    <el-input-number v-model="detailForm.reworkWeight" :min="0" @focus="$event.target.select()" :controls="false"></el-input-number>
                  </el-form-item>
                </el-col>
              </template>
            </template>


            <el-col v-if="(typeS || typeT) && isFinish" :span="12">
              <el-form-item label="烘干后重量" prop="dryWeight">
                <el-input-number v-model="detailForm.dryWeight" :min="0" @focus="$event.target.select()" :controls="false"></el-input-number>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="备注" prop="remark">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4}"
                  placeholder="请输入内容"
                  v-model="detailForm.remark">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="添加附件">
                <!-- 图片 -->
                <PhotoNew
                  v-model="imageList"
                  :name="'CHECK_DEVICE'"
                ></PhotoNew>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>

    <!-- 页面操作 -->
    <div class="pageHandleBox">
      <el-button class="save" @click="handleSave">保存</el-button>
      <el-button v-if="isStart" class="submit" type="primary" @click="handleStart">开始烘干</el-button>
      <el-button v-else-if="isFinish" class="submit" type="primary" @click="handleFinish">结束烘干</el-button>
    </div>

    <!-- 打印弹窗组件 -->
    <print-dialog
      :print-list="printList"
      :visible.sync="printVisible"
      :print-data="printData"
      num-visible
      @handleData="back"
    />
  </div>
</template>

<script>
import * as Api from '@/api/dry'
import CodeScanner from '@/components/CodeScanner';
import PhotoNew from "@/views/components/photoNew.vue";
import PrintDialog from "@/views/components/printDialog.vue";
import {equipmentListByPage} from "@/api/eqp";
import SelectUserinfo from "@/components/select_userinfo.vue";
import moment from 'moment'

const deflutForm = {
  dryerMachineNo:'', // 烘干机编号
  operatorName: '', // 烘干操作人
  confirmName: '', // 烘干确认人
  gasVelocity: undefined, // 气体流量
  dryerTime: undefined, // 烘干时长h
  dryerTotalTime: undefined, // 烘干总时间h
  dryerStartTime: '', // 开始烘干时间
  dryerEndTime: '', // 结束烘干时间
  setTemperature: undefined, // 设定温度
  incubationTime: undefined, // 恒温时间
  result: null, // 结果判定
  destination: null, // 去向
  reworkWeight: undefined, // 返工重量
  dryWeight: undefined, // 烘干后重量
  remark: '', // 备注

}
export default {
  name: 'OperateTask',
  components:{
    SelectUserinfo,
    PhotoNew,
    CodeScanner,
    PrintDialog
  },
  data() {
    return {
      printVisible:false,
      printData: {
        data: '', // 打印基础信息
        documentMould: '清洗烘干-清洗批次号打印', // 	打印模版名称
        printNum: 1,
        type: 1 // 执行类型：0：不填充数据，1：填充数据
      },
      imageList:[],
      printList:[],
      eqpMap:[],
      detailForm: Object.assign({}, deflutForm),
      rules:{
        dryerMachineNo: [{ required: true, message: '必选项', trigger: 'change' }],
        operatorName: [{ required: true, message: '必选项', trigger: 'change' }],
        confirmName: [{ required: true, message: '必选项', trigger: 'change' }],
        gasVelocity: [{ required: true, message: '必填项', trigger: 'change' }],
        dryerTime: [{ required: true, message: '必填项', trigger: 'change' }],
        dryerStartTime: [{ required: true, message: '必选项', trigger: 'change' }],
        setTemperature: [{ required: true, message: '必填项', trigger: 'change' }],
        incubationTime: [{ required: true, message: '必填项', trigger: 'change' }],
        result: [{ required: true, message: '必选项', trigger: 'change' }],
        destination: [{ required: true, message: '必选项', trigger: 'change' }],
        dryWeight: [{ required: true, message: '必填项', trigger: 'change' }],
      }
    }
  },
  computed:{
    // 是否为合批
    isCombined() {
      return Boolean(this.$route.query.combinedBatchNo)
    },
    sessionKey() {
      const { combinedBatchNo, cleanBatchNo } = this.$route.query
      return `烘干详情数据${this.isCombined ? combinedBatchNo : cleanBatchNo}`
    },
    // 待进站-开始烘干操作时
    isStart() {
      return Number(this.detailForm.submitType) === 0
    },
    // 待出站-结束烘干操作时
    isFinish() {
      return Number(this.detailForm.submitType) === 1
    },
    // 操作物料类型为'S原料'
    typeS() {
      return this.detailForm.operateType === 0
    },
    // 操作物料类型为'T原料'
    typeT() {
      return this.detailForm.operateType === 1
    },
    // 操作物料类型为'石墨件（坩埚）'
    typeGraphite() {
      const { operateType } = this.detailForm
      //       合批          || 操作物料类型为'石墨件（坩埚）'   || '石墨件（其他）'
      return this.isCombined || operateType === 2 || operateType === 3
    },
    // 设备编号中有A
    eqpMatchedA() {
      return (this.detailForm.dryerMachineNo || '').includes('A')
    },
    // 烘干总时间, 结束时间 显示隐藏
    totalTimeVisible() {
      let visible = false
      if (this.isFinish) {
        if (this.isCombined) return true
        switch (this.detailForm.operateType) {
          case 0:
          case 1:
          case 3:
            visible = true
            break
          case 2:
            visible = !this.eqpMatchedA
            break
        }
      }
      return visible
    },
    // 开始时间 显示隐藏
    startTimeVisible() {
      let visible = false
      if (this.isCombined) return !this.eqpMatchedA
      switch (this.detailForm.operateType) {
        case 0:
        case 1:
          visible = true
          break
        case 2:
          visible = !this.eqpMatchedA
          break
        case 3:
          // 开始时, A以外  显示
          // 结束时, 一直显示
          visible = this.isStart && !this.eqpMatchedA || this.isFinish
          break
      }
      return visible
    },
    calcBatchLabel() {
      let label = ''
      switch (this.detailForm.operateType) {
        case 0: label = '混合批次号'; break
        case 1: label = '批次号'; break
        case 2: label = '唯一码'; break
        case 3: label = '混合唯一码'; break
      }
      return label
    },
    // 烘干总时间
    dryerTotalTime() {
      return moment(this.detailForm.dryerEndTime).diff(this.detailForm.dryerStartTime, 'hours', true) || 0
    }
  },
  created(){
    this.init()
    this.getEquipmentList()
  },
  methods: {
    // 页面初始化
    async init(){
      await this.fetchInfo()
      const storageData = sessionStorage.getItem(this.sessionKey)
      if(storageData){
        const { attachment, ...detailForm } = JSON.parse(storageData)
        this.detailForm = Object.assign({}, deflutForm, this.detailForm, detailForm)
        try {
          this.imageList = JSON.parse(attachment)
        } catch (e) {}
      }
    },
    //获取详情信息
    fetchInfo(){
      if (this.isCombined) {
        this.detailForm = Object.assign({}, deflutForm, this.$route.query)
        return
      }

      return Api.getDetail(this.$route.query.id).then(res => {
        this.detailForm = Object.assign({}, deflutForm, res.data)
        if (!this.detailForm.result) this.detailForm.result = '合格'

        if (this.totalTimeVisible) {
          this.detailForm.dryerEndTime = this.$store.getters.NowServerDate // 结束烘干时间
          this.handleTimeChange()
        }

        this.$nextTick(()=>this.$refs.dryForm.clearValidate())
      })
    },
    handleTimeChange() {
      if (this.totalTimeVisible) {
        this.detailForm.dryerTotalTime = this.dryerTotalTime // 烘干总时间
      }
    },
    //处理打印后数据
    back(){
      this.$router.push({ path: '/dry'})
    },
    handleSave() {
      const FormData = JSON.stringify(this.transform())
      sessionStorage.setItem(this.sessionKey,FormData)
      this.$message.success('保存成功!')
      this.back()
    },
    // 开始烘干
    handleStart(){
      this.$refs.dryForm.validate((valid) => {
        if (valid) {
          const data = this.transform()
          data.submitType = 1 // 提交状态 0是待进站，1 是待出站，2是已出站
          const post = this.isCombined ? Api.batchUpdate : Api.update
          post(data).then(res => {
            this.$message.success(`开始烘干操作成功!`)
            sessionStorage.removeItem(this.sessionKey)
            this.back()
          })
        }
      })
    },
    // 结束烘干
    handleFinish(){
      this.$refs.dryForm.validate((valid) => {
        if (valid) {
          const data = this.transform()
          data.submitType = 2 // 提交状态 0是待进站，1 是待出站，2是已出站
          const post = this.isCombined ? Api.batchEnd : Api.dryEnd
          post(data).then(res => {
            this.$message.success(`结束烘干操作成功!`)
            sessionStorage.removeItem(this.sessionKey)
            if (res.data) {
              // 打印
              this.printList = res.data
              this.printVisible = true
              if (this.isCombined) {
                this.printData.documentMould = '合批烘干-条码打印'
                this.printData.data = this.$route.query.combinedBatchNo
              } else {
                this.printData.documentMould = '清洗烘干-清洗批次号打印'
                this.printData.data = this.$route.query.cleanBatchNo
              }
            }
          })
        }
      })
    },
    transform() {
      const data = {
        ...this.detailForm,
        attachment: JSON.stringify(this.imageList)
      }
      return data
    },
    formatWeightLabel(type) {
      let label = ''
      switch (type) {
        case 0: label = '混合料总重量'; break
        case 1: label = '重量'; break
        default: label = '数量'
      }
      return label
    },
    // 查询烘干机设备列表
    getEquipmentList() {
      equipmentListByPage({
        page: 1,
        rows: 10000,
        search_EQ_deviceTypeName: '干燥箱',
        search_EQ_enableState: 1, // 启用状态
      }).then(res=>{
        this.eqpMap = res.rows || []
      })
    },
    handleResultChange(result) {
      if (result === '全部返工') {
        this.detailForm.reworkWeight = this.detailForm.totalWeight
      }
    }
  }
}
</script>

<style scoped>
.el-input-number {
  width: 100%;
}
</style>
