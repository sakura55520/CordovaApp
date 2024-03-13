<!--籽晶安装(操作任务)-->
<template>
  <div class="detailBox">
    <!-- 顶部信息卡片 -->
    <div class="topInfoCard">
      <!-- head -->
      <div class="headLine">
        <div>
          <span class="headLine-name">炉次号 &nbsp;&nbsp; </span>
          <span class="headLine-value">{{ detailForm.lotNo }}</span>
        </div>
      </div>
      <!-- body -->
      <div :class="'grid-container'">
        <div class="grid-item">
          <span class="grid-item-name">订单号：</span>
          <span class="grid-item-value">{{ detailForm.planOrderNo }}</span>
        </div>
        <div class="grid-item">
          <span class="grid-item-name">产品名称：</span>
          <span class="grid-item-value">{{ detailForm.productName }}</span>
        </div>
        <div class="grid-item">
          <span class="grid-item-name">产品配方：</span>
          <span class="grid-item-value">{{ detailForm.productFormula }}</span>
        </div>
      </div>
    </div>
    <!-- 其他表单卡片 -->
    <div class="fromCard">
      <div class="fromCard">
        <el-form ref="detailForm" :model="detailForm" class="main-wrap" :rules="rules" label-width="124px">
          <el-row>
            <el-col :span="24">
              <div class="headLine">
                <div class="headLine-title">录入籽晶数据</div>
              </div>
            </el-col>
            <el-col :span="24">
              <el-form-item label="产品配方" prop="productFormula">
                <el-select v-model="detailForm.productFormula" style="width: 100%;">
                  <el-option v-for="item in bomList" :key="item.id" :label="item.bomName" :value="item.bomName"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="籽晶编号" prop="seedCode">
                <CodeScanner v-model="detailForm.seedCode" placeholder="请扫描或输入籽晶编号" @has-done="hasCrucible"/>
                <div class="crucibleCode-info">
                  <div class="info"><div>直径mm</div><div>{{ detailForm.seedDiameter }}</div></div>
                  <div class="info"><div>规格</div><div>{{ detailForm.seedSpec }}</div></div>
                  <div class="info"><div>类型</div><div>{{detailForm.seedType}}</div></div>
                  <div class="info"><div>等级</div><div>{{detailForm.seedGrade}}</div></div>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="籽晶表面状态" prop="seedPerformance">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4}"
                  placeholder="请输入内容"
                  v-model="detailForm.seedPerformance">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="石墨纸状态" prop="graphiteStatus">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4}"
                  placeholder="请输入内容"
                  v-model="detailForm.graphiteStatus">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="籽晶照片">
                <!-- 图片 -->
                <PhotoNew
                  v-model="imageList"
                  :componentDisabled="disabled"
                  :photoNum="6"
                  :name="'CHECK_DEVICE'"
                ></PhotoNew>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="工艺代号" prop="technology">
                <el-select v-model="detailForm.technology" style="width: 100%;">
                  <el-option v-for="(item, index) in technologyList" :key="index" :label="item.label" :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>


            <el-col :span="24">
              <div class="headLine">
                <div class="headLine-title">录入辅料数据</div>
              </div>
            </el-col>
            <el-col :span="12">
              <el-form-item label="上段高度mm" prop="upperHeight">
                <el-input-number v-model="detailForm.upperHeight" @focus="$event.target.select()" style="width: 100%;" :precision="2" :min="0" :controls="false"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="顶盖深度mm" prop="topCoverDepth">
                <el-input-number v-model="detailForm.topCoverDepth" @focus="$event.target.select()" style="width: 100%;" :precision="2" :min="0" :controls="false"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="inline-item" label="顶盖间隙mm" prop="topCoverClearance">
                <div class="inline-box">
                  <el-form-item class="inline-item" label-width="0" prop="_topCoverClearanceMin">
                    <el-input-number
                      v-model="detailForm._topCoverClearanceMin"
                      :precision="2"
                      :min="0"
                      :controls="false"
                      style="width: 100%;"
                      @focus="$event.target.select()"
                      @change="handleTopCoverChange"
                    />
                  </el-form-item>
                  -
                  <el-form-item class="inline-item" label-width="0" prop="_topCoverClearanceMax">
                    <el-input-number
                      v-model="detailForm._topCoverClearanceMax"
                      :precision="2"
                      :min="0"
                      :controls="false"
                      style="width: 100%;"
                      @focus="$event.target.select()"
                      @change="handleTopCoverChange"
                    />
                  </el-form-item>
                </div>
              </el-form-item>

            </el-col>
            <el-col :span="12">
              <el-form-item label="段盖间隙mm" prop="gapCoverClearance">
                <el-input v-trim v-model="detailForm.gapCoverClearance"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="顶盖编号" prop="accessTopCapNo">
                <CodeScanner v-model="detailForm.accessTopCapNo" @has-done="hasNo('accessTopCapNo')" placeholder="请扫描或输入顶盖编号"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="顶环编号" prop="topRingCode">
                <CodeScanner v-model="detailForm.topRingCode" @has-done="hasNo('topRingCode')" placeholder="请扫描或输入顶环编号"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="支撑环编号" prop="accessSupportRingNo">
                <CodeScanner v-model="detailForm.accessSupportRingNo" @has-done="hasNo('accessSupportRingNo')" placeholder="请扫描或输入支撑环编号"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="上板编号" prop="accessUpperRingNo">
                <CodeScanner v-model="detailForm.accessUpperRingNo" @has-done="hasNo('accessUpperRingNo')" placeholder="请扫描或输入上板编号"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="mulline-label" label="S籽晶与顶盖理论间隙" prop="accessTheoreticalGapSeed">
                <el-input-number v-model="detailForm.accessTheoreticalGapSeed" style="width: 100%;" :min="0" @focus="$event.target.select()" :controls="false"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="mulline-label" label="A/A1籽晶与顶盖理论间隙" prop="accessTheoreticalGapAseed">
                <el-input-number v-model="detailForm.accessTheoreticalGapAseed" style="width: 100%;" :min="0" @focus="$event.target.select()" :controls="false"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="上传照片" prop="dryerMachineAnnex">
                <!-- 图片 -->
                <PhotoNew
                  v-model="imageList2"
                  :componentDisabled="disabled"
                  :photoNum="6"
                  :name="'CHECK_DEVICE'"
                ></PhotoNew>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="盖重g" prop="_accessCoverWeight_g">
                <el-input-number v-model="detailForm._accessCoverWeight_g" style="width: 100%;" :min="0" :controls="false" @focus="$event.target.select()" @blur="handleCoverWeightBlur"/>
                <i>{{ detailForm.accessCoverWeight }} kg</i>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="全套重g" prop="_fullSet_g">
                <el-input-number v-model="detailForm._fullSet_g" style="width: 100%;" :min="0" :controls="false" @focus="$event.target.select()" @blur="handleFullSetBlur"/>
                <i>{{ detailForm.fullSet }} kg</i>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注" prop="mark">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4}"
                  placeholder="请输入内容"
                  v-model="detailForm.mark">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="添加附件">
                <!-- 图片 -->
                <PhotoNew
                  v-model="imageList1"
                  :componentDisabled="disabled"
                  :photoNum="6"
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
      <el-button class="save" @click="saveDetail(0)">保存</el-button>
      <el-button class="submit" type="primary" @click="saveDetail(1)">提交数据</el-button>
    </div>
  </div>
</template>

<script>
import * as Api from '@/api/seedCrystal'
import * as charge from '@/api/charge'
import * as inStation from '@/api/inStation'
import { getSeleteData } from "@/utils/select";
import CodeScanner from '@/components/CodeScanner';
import Collapse from '@/views/components/collapse';
import PhotoNew from "@/views/components/photoNew.vue";
import ObtainInput from "@/views/components/obtainInput.vue";
import { round } from "lodash-es"

const deflutFrom = {
  upperHeight:'',
  topCoverDepth:'',
  topCoverClearance:'',
  _topCoverClearanceMin:'',
  _topCoverClearanceMax:'',
  gapCoverClearance:'',
  accessSupportRingNo:'',
  productFormula:'',
  accessTheoreticalGapAseed:'',
  accessTheoreticalGapSeed:'',
  accessTopCapNo:'',
  topRingCode:'', // 顶环编号
  accessUpperRingNo:'',
  graphiteStatus:'',
  technology: '', // 工艺代号
  _accessCoverWeight_g: undefined,
  accessCoverWeight: undefined, // 盖重kg
  _fullSet_g: undefined,
  fullSet: undefined, // 全套重kg
  mark:'',
  lotNo:'',
  seedCode:'',
  seedDiameter:'',
  seedGrade:'',
  seedSpec:'',
  seedPerformance:'',
  seedType:'',
  submitType:0,
  annex:'[]',
  accessPhoto:'[]',
  seedPhoto:'[]',
}
export default {
  name: 'DirList',
  components:{
    ObtainInput,
    PhotoNew,
    CodeScanner,
    Collapse
  },
  data() {
    return {
      overStation:{}, // 过站信息
      disabled:true,
      bomList:[],//bom信息
      imageList:[],
      imageList1:[],
      imageList2:[],
      technologyList: [], // 工艺代号list
      detailForm:Object.assign({},deflutFrom),
      rules:{
        upperHeight:[{ required: true, message: '必填项', trigger: 'change' }],
        topCoverDepth:[{ required: true, message: '必填项', trigger: 'change' }],
        topCoverClearance:[{ required: true, message: '必填项', trigger: 'change' }],
        _topCoverClearanceMin:[{ required: true, message: '必填项', trigger: 'change' }],
        _topCoverClearanceMax:[{ required: true, message: '必填项', trigger: 'change' }],
        gapCoverClearance:[{ required: true, message: '必填项', trigger: 'change' }],
        accessSupportRingNo:[{ required: true, message: '必填项', trigger: 'change' }],
        accessTheoreticalGapAseed:[{ required: true, message: '必填项', trigger: 'change' }],
        accessTheoreticalGapSeed:[{ required: true, message: '必填项', trigger: 'change' }],
        accessTopCapNo:[{ required: true, message: '必填项', trigger: 'change' }],
        topRingCode:[{ required: true, message: '必填项', trigger: 'change' }],
        accessUpperRingNo:[{ required: true, message: '必填项', trigger: 'change' }],
        graphiteStatus:[{ required: true, message: '必填项', trigger: 'change' }],
        technology:[{ required: true, message: '必填项', trigger: 'change' }],
        seedCode:[{ required: true, message: '必填项', trigger: 'change' }],
        productFormula:[{ required: true, message: '必填项', trigger: 'change' }],
        seedPerformance:[{ required: true, message: '必填项', trigger: 'change' }],
        _accessCoverWeight_g:[{ required: true, message: '必填项', trigger: 'change' }],
        _fullSet_g:[{ required: true, message: '必填项', trigger: 'change' }],
      }
    }
  },
  created(){
    this.detailForm = Object.assign({},deflutFrom)
    //接收路由传参数据
    this.overStation = this.$route.query || {}
    this.getDetail()
    getSeleteData('seedInstallTechnology', this.technologyList) // 工艺代号list
  },
  methods: {
    //获取详情
    getDetail(){
      if(!this.overStation.processingOrderCode)return this.$message.error('过站信息有误,请验证后重新操作')
      const data = sessionStorage.getItem('zjaz' + this.overStation.processingOrderCode)
      if(data){
        this.detailForm = JSON.parse(data)
        this.getBomList()
      }else{
        Api.listByPage({processName:'籽晶安装',search_EQ_lotNo:this.overStation.processingOrderCode,page:1,rows:10}).then(res => {
          if(res.data && res.data.rows.length > 0){
            this.detailForm = Object.assign({},deflutFrom,JSON.parse(JSON.stringify(res.data.rows[0])))
            this.getBomList()
          }
        })
      }
    },
    //扫码验证
    hasNo(filed){
      if(!this.detailForm[filed])return
      const {accessTopCapNo,accessSupportRingNo,accessUpperRingNo} = this.detailForm
      const list = [accessTopCapNo,accessSupportRingNo,accessUpperRingNo]
      const filedList = list.filter(item => item === this.detailForm[filed])
      if(filedList.length > 1){
        this.detailForm[filed] = ''
        return this.$message.warning('编码不可重复')
      }
      charge.listAllLife({search_EQ_uniqueCode:this.detailForm[filed],search_EQ_status:0}).then(res => {
        if(res.data.length <= 0){
          this.$message.warning('无数据')
          this.$set(this.detailForm,filed,'')
        }
      })
    },
    //获取产品配方下拉列表
    getBomList(){
      if(this.detailForm.productCode){
        Api.listBomAll({search_EQ_materialCode:this.detailForm.productCode,search_EQ_status: 1}).then(res => {
          this.bomList = res.data
        })
      }
    },
    //扫描籽晶编号
    hasCrucible(){
      if(!this.detailForm.seedCode)return
      Api.seedListByPage({processingCode:this.detailForm.seedCode}).then(res => {
        if(res.data){
          this.detailForm.seedDiameter = res.data.diameter
          this.detailForm.seedGrade = res.data.materialLevel
          this.detailForm.seedType = res.data.materialType
          this.detailForm.seedSpec = res.data.specification
        }else{
          this.detailForm.seedDiameter = ''
          this.detailForm.seedGrade = ''
          this.detailForm.seedType = ''
          this.detailForm.seedSpec = ''
          this.detailForm.seedCode = ''
          this.$message.warning('无数据')
        }
      })
    },
    //保存数据 保存到前端,提交到后端
    saveDetail(type){
      const saveData = JSON.parse(JSON.stringify(this.detailForm))
      saveData.annex = JSON.stringify(this.imageList1)//附件
      saveData.seedPhoto = JSON.stringify(this.imageList2)//照片
      saveData.accessPhoto = JSON.stringify(this.imageList)//籽晶照片
      saveData.submitType = 1
      if(!type){
        sessionStorage.setItem('zjaz' + this.overStation.processingOrderCode,JSON.stringify(saveData))
        this.$message.success(`保存成功`)
        this.$router.push({ path: '/seedCrystal'})
      }else{
        this.generate(saveData)
      }
    },
    //完成籽晶安装数据填写
    generate(data){
      this.$refs['detailForm'].validate(valid => {
        if(valid){
          const saveData = {
            processingOrderCode:this.overStation.processingOrderCode,
            param:{'坩埚拆装_籽晶安装_出站':JSON.stringify(data)},
            flowLineLable:'',
            processUuid:this.overStation.processUuid
          }
          inStation.outStation(saveData).then(res => {
            this.$message.success(`提交成功`)
            sessionStorage.removeItem('zjaz' + this.overStation.processingOrderCode)
            this.$router.push({ path: '/seedCrystal'})
          })
        }
      })
    },
    handleTopCoverChange() {
      this.detailForm.topCoverClearance = `${this.detailForm._topCoverClearanceMin}-${this.detailForm._topCoverClearanceMax}`
    },
    handleCoverWeightBlur() {
      // g 转换为 kg
      const kg = this.detailForm._accessCoverWeight_g / 1000
      this.detailForm.accessCoverWeight = round(kg, 4) || 0 // 盖重kg
    },
    handleFullSetBlur() {
      // g 转换为 kg
      const kg = this.detailForm._fullSet_g / 1000
      this.detailForm.fullSet = round(kg, 4) || 0 // 全套重kg
    }
  }
}
</script>

<style lang="scss" scoped>
.crucibleCode-info{
  text-indent: 10px;
  margin: 2px 0;
  background-color: #b3d8ff96;
  display: flex;
  justify-content: space-around;
  .info{
    width: 100%;
    display: flex;
    justify-content: space-evenly;
  }
}
.inline-box {
  display: flex;
  gap: 8px;
}
.inline-item {
  flex: 1;
}
</style>
