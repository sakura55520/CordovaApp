<!--
  清洗
  operateType操作物料类型 0：S原料 1：T原料 2：石墨件（坩埚） 3：石墨件（其他）
-->
<template>
  <div class="detailBox">
    <!-- 顶部信息卡片 -->
    <div class="topInfoCard">
      <!-- head -->
      <div class="headLine">
        <div>
          <span class="headLine-name">清洗批次号 &nbsp;&nbsp; </span>
          <span class="headLine-value">{{ detailData.cleanBatchNo }}</span>
        </div>
        <div>
          <span class="headLine-name">{{ calcBatchLabel }} &nbsp;&nbsp; </span>
          <span class="headLine-value">{{detailData.materialDetails ? detailData.materialDetails.map(item =>item.materialBatchNo).join(',') : '' }}</span>
        </div>
      </div>
      <!-- body -->
      <div :class="'grid-container'">
        <div class="grid-item">
          <span class="grid-item-name">物料编码：</span>
          <span class="grid-item-value">{{ detailData.materialCode }}</span>
        </div>
        <div class="grid-item">
          <span class="grid-item-name">物料名称：</span>
          <span class="grid-item-value">{{ detailData.materialName }}</span>
        </div>

        <!-- S原料时 -->
        <div v-if="detailData.operateType === 0"  class="grid-item">
          <span class="grid-item-name">规格：</span>
          <span class="grid-item-value">{{ detailData.spec }}</span>
        </div>
        <div class="grid-item">
          <span class="grid-item-name">{{ formatWeightLabel(detailData.operateType) }}：</span>
          <span class="grid-item-value">{{ detailData.totalWeight }}</span>
        </div>
      </div>
    </div>

    <!-- 其他表单卡片 -->
    <div class="fromCard">
      <div class="fromCard">
        <div class="headLine">
          <div class="headLine-title">录入工序数据</div>
        </div>
        <el-form ref="cleanDryForm" :model="detailForm" class="main-wrap" label-width="120px" :rules="rules">
          <el-row>
            <el-col :span="12">
              <el-form-item label="清洗机编号" prop="cleanMachineNo">
                <el-select v-model="detailForm.cleanMachineNo" style="width: 100%;">
                  <el-option v-for="(item,i) in cleanMachineNoMap" :key="i" :value="item.code"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="清洗确认人" prop="confirmName">
                <SelectUserinfo
                  v-model="detailForm.confirmName"
                  style="width: 100%;"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="清洗方式" prop="cleanType">
                <el-select v-model="detailForm.cleanType" style="width: 100%;">
                  <el-option v-for="(item,i) in cleanTypeMap" :key="i" :value="item"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <!-- S原料 / 石墨件（其他） 时 -->
            <el-col v-if="typeS || typeOtherPiece" :span="12">
              <el-form-item label="纯水电阻率" prop="waterResistivity">
                <el-input-number v-model="detailForm.waterResistivity" :min="0" @focus="$event.target.select()" :controls="false"></el-input-number>
              </el-form-item>
            </el-col>

            <!-- T原料 时 -->
            <el-col v-if="typeT" :span="12">
              <el-form-item label="超声时长m" prop="ultrasonicTime">
                <el-input-number v-model="detailForm.ultrasonicTime" :min="0" @focus="$event.target.select()" :controls="false"></el-input-number>
              </el-form-item>
            </el-col>

            <el-col v-if="cleanTimeVisible" :span="12">
              <el-form-item label="清洗时长h" prop="cleanTime">
                <el-input-number v-model="detailForm.cleanTime" @focus="$event.target.select()" :precision="2" :min="0" :controls="false" style="width: 100%;"></el-input-number>
              </el-form-item>
            </el-col>

            <!-- (T原料 && 清洗方式为人工) || '石墨件（其他）' 时 -->
            <el-col v-if="(typeT && detailForm.cleanType === '人工洗') || typeOtherPiece" :span="12">
              <el-form-item
                :label="`${typeOtherPiece ? '当前' : ''}清洗次数`"
                prop="cleanCount">
                <el-input-number v-model="detailForm.cleanCount" @focus="$event.target.select()" :precision="0" :min="0" :controls="false" style="width: 100%;"></el-input-number>
              </el-form-item>
            </el-col>

            <!-- 机洗 时 -->
            <template v-if="cleanMechanical">
              <!-- S原料 / T原料 / 石墨件（其他） 时 -->
              <el-col v-if="typeS || typeT || typeOtherPiece" :span="12">
                <el-form-item label="超声频率Hz" prop="ultrasonicFrequency">
                  <el-input v-trim v-model="detailForm.ultrasonicFrequency"/>
                </el-form-item>
              </el-col>
            </template>

            <!-- 机洗 && (S原料 || T原料) || 石墨件（坩埚） 时 -->
            <el-col v-if="(cleanMechanical && (typeS || typeT)) || typeCruciblePiece" :span="12">
              <el-form-item label="转速" prop="speed">
                <el-input v-trim v-model="detailForm.speed"/>
              </el-form-item>
            </el-col>

            <!-- 石墨件（其他） 时 -->
            <template v-if="typeOtherPiece">
              <el-col v-if="cleanMechanical" :span="12">
                <el-form-item label="清洗总时间h">
                  <el-input-number v-model="detailForm.cleanTotalTime" :min="0" @focus="$event.target.select()" :precision="2" :controls="false"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="人工预清洗" prop="preClean">
                  <el-radio-group v-model="detailForm.preClean">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="开始清洗时间" prop="cleanStartTime">
                  <el-date-picker
                    v-model="detailForm.cleanStartTime"
                    type="datetime"
                    placeholder="开始清洗时间"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    style="width: 100%;"
                    @change="handleTimeChange"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="结束清洗时间" prop="cleanEndTime">
                  <el-date-picker
                    v-model="detailForm.cleanEndTime"
                    type="datetime"
                    placeholder="结束清洗时间"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    style="width: 100%;"
                    @change="handleTimeChange"
                  />
                </el-form-item>
              </el-col>
            </template>

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
      <el-button class="save" @click="handle('保存')">保存</el-button>
      <el-button class="submit" type="primary" @click="handle('提交')">提交</el-button>
    </div>
  </div>
</template>

<script>
import * as Api from '@/api/cleanDry'
import CodeScanner from '@/components/CodeScanner';
import PhotoNew from "@/views/components/photoNew.vue";
import {equipmentListByPage} from "@/api/eqp";
import SelectUserinfo from "@/components/select_userinfo.vue";
import moment from 'moment'

const deflutForm = {
  cleanMachineNo:'', // 清洗机编号
  confirmName: '', // 清洗确认人
  cleanType:'', // 清洗方式
  waterResistivity:'', // 纯水电阻率
  ultrasonicTime:'', // 超声时长m
  cleanTime:'', // 清洗时长h
  cleanCount:'', // 清洗次数
  ultrasonicFrequency: '', // 超声频率Hz
  speed: '', // 转速
  cleanTotalTime: '', // 清洗总时间h
  preClean: 1, // 人工预清洗
  cleanStartTime: '', // 开始清洗时间
  cleanEndTime: '', // 结束清洗时间
  remark: '', // 备注

}
export default {
  name: 'DirList',
  components:{
    SelectUserinfo,
    PhotoNew,
    CodeScanner,
  },
  data() {
    return {
      detailData:{},
      imageList:[],
      cleanMachineNoMap:[],
      cleanTypeMap:['人工洗', '机洗'], // 清洗方式map
      detailForm: Object.assign({}, deflutForm),
      rules:{
        cleanMachineNo:[{ required: true, message: '必填项', trigger: 'change' }],
        cleanTime:[{ required: true, message: '必填项', trigger: 'change' }],
        cleaningTime:[{ required: true, message: '必填项', trigger: 'change' }],
        cleanType:[{ required: true, message: '必填项', trigger: 'change' }]
      }
    }
  },
  computed:{
    // 操作物料类型为'S原料'
    typeS() {
      return this.detailData.operateType === 0
    },
    // 操作物料类型为'T原料'
    typeT() {
      return this.detailData.operateType === 1
    },
    // 操作物料类型为'石墨件（坩埚）'
    typeCruciblePiece() {
      return this.detailData.operateType === 2
    },
    // 操作物料类型为'石墨件（其他）'
    typeOtherPiece() {
      return this.detailData.operateType === 3
    },
    calcBatchLabel() {
      let label = ''
      switch (this.detailData.operateType) {
        case 0: label = '混合批次号'; break
        case 1: label = '批次号'; break
        case 2: label = '唯一码'; break
        case 3: label = '混合唯一码'; break
      }
      return label
    },
    cleanMechanical() {
      return this.detailForm.cleanType === '机洗'
    },
    // 清洗时长 显示隐藏
    cleanTimeVisible() {
      let visible = false
      switch (this.detailData.operateType) {
        case 0:
          visible = true
          break
        case 1:
          if (this.cleanMechanical) visible = true
          break
        case 2:
          visible = true
          break
      }
      return visible
    },
    // 清洗总时间
    cleanTotalTime() {
      return moment(this.detailForm.cleanEndTime).diff(this.detailForm.cleanStartTime, 'hours', true) || 0
    }
  },
  created(){
    this.init()

    this.getEquipmentList()
  },
  mounted() {
    this.init()
  },
  methods: {
    // 页面初始化
    async init(){
      await this.getDetail()
      const storageData = sessionStorage.getItem(`清洗详情数据${this.$route.query.cleanBatchNo}`)
      if(storageData){
        const { attachment, ...detailForm } = JSON.parse(storageData)
        this.detailForm = Object.assign({}, deflutForm, this.detailForm, detailForm)
        try {
          this.imageList = JSON.parse(attachment)
        } catch (e) {}
      }
    },
    //获取详情信息
    getDetail(){
      return Api.getDetail(this.$route.query.id).then(res => {
        this.detailData = res.data
        this.detailForm = Object.assign({}, deflutForm, this.detailData.crucibleCleanProcess)

        if (this.typeOtherPiece) {
          this.detailForm.cleanEndTime = this.$store.getters.NowServerDate // 结束清洗时间
          this.handleTimeChange()
        }
        this.$nextTick(()=>this.$refs.cleanDryForm.clearValidate())
      })
    },
    handleTimeChange() {
      if (this.typeOtherPiece && this.cleanMechanical) {
        this.detailForm.cleanTotalTime = this.cleanTotalTime // 清洗总时间
      }
    },
    //处理打印后数据
    handleData(){
      this.$router.push({ path: '/cleanDry'})
    },
    // 操作
    handle(typeName){
      if(typeName === '保存'){
        const FormData = JSON.stringify({
          ...this.detailForm,
          attachment: JSON.stringify(this.imageList)
        })
        sessionStorage.setItem(`清洗详情数据${this.$route.query.cleanBatchNo}`,FormData)
        this.$message.success('保存成功')
        this.$router.push('/cleanDry')
      } else if(typeName === '提交') {
        this.$refs.cleanDryForm.validate((valid) => {
          if (valid) {
            const data = this.transform()
            data.submitType = 1 // 提交状态 0是未提交 1是提交
            Api.update(data).then(res => {
              this.$message.success(`提交成功`)
              sessionStorage.removeItem(`清洗详情数据${this.$route.query.cleanBatchNo}`)
              this.$router.push('/cleanDry')
            })
          }
        });
      }
    },
    transform() {
      const data = JSON.parse(JSON.stringify(this.detailData))
      this.detailForm.attachment = JSON.stringify(this.imageList)
      data.crucibleCleanProcess = this.detailForm
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
    // 查询清洗机设备列表
    getEquipmentList() {
      equipmentListByPage({
        page: 1,
        rows: 10000,
        search_EQ_deviceTypeName: '清洗机',
        search_EQ_enableState: 1, // 启用状态
      }).then(res=>{
        this.cleanMachineNoMap = res.rows || []
      })
    }
  }
}
</script>

<style scoped>
.el-input-number {
  width: 100%;
}
</style>
