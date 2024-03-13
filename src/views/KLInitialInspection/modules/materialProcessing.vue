<!--开炉(出站)-长晶-->
<template>
  <div class="fromCard">
      <div class="fromCard">
        <el-form :model="detailForm" label-width="120px" :rules="rules" ref="materialForm" style="padding: 0 10px 0 0;">
          <el-row>
            <el-col :span="24">
              <div class="headLine">
                <div class="headLine-title">录入辅料数据</div>
              </div>
            </el-col>
            <el-col :span="12">
              <el-form-item label="坩埚编号" prop="rawCrucibleNo">
                <el-input v-trim v-model="detailForm.rawCrucibleNo" placeholder="请输入坩埚编号" disabled/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="结果判定" prop="rawResultJudgment">
                <el-select v-model="detailForm.rawResultJudgment">
                  <el-option v-for="item in resultDeterminationMap" :label="item.name" :key="item.value" :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4}"
                  placeholder="请输入内容"
                  v-model="detailForm.rawMark">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="添加附件">
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
              <el-form-item label="坩埚段1编号" prop="rawCrucibleOneNo">
                <el-input v-trim v-model="detailForm.rawCrucibleOneNo" disabled/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="结果判定" prop="rawCrucibleOneNoJg">
                <el-select v-model="detailForm.rawCrucibleOneNoJg">
                  <el-option v-for="item in resultDeterminationMap" :key="item.name" :label="item.name" :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="顶盖编号" prop="rawDgNo">
                <el-input v-trim v-model="detailForm.rawDgNo" disabled/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="结果判定" prop="rawDgNoJg">
                <el-select v-model="detailForm.rawDgNoJg">
                  <el-option v-for="item in resultDeterminationMap" :key="item.name" :label="item.name" :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="顶环编号" prop="rawDhNo">
                <el-input v-trim v-model="detailForm.rawDhNo" disabled/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="结果判定" prop="rawDhNoJg">
                <el-select v-model="detailForm.rawDhNoJg">
                  <el-option v-for="item in resultDeterminationMap" :key="item.name" :label="item.name" :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="支撑环编号" prop="supportRingNo">
                <el-input v-trim v-model="detailForm.supportRingNo" disabled/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="结果判定" prop="supportRingNoJg">
                <el-select v-model="detailForm.supportRingNoJg">
                  <el-option v-for="item in resultDeterminationMap" :key="item.name" :label="item.name" :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="上板编号" prop="upperBoardNo">
                <el-input v-trim v-model="detailForm.upperBoardNo" disabled/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="结果判定" prop="upperBoardNoJg">
                <el-select v-model="detailForm.upperBoardNoJg">
                  <el-option v-for="item in resultDeterminationMap" :key="item.name" :label="item.name" :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="段2编号" prop="accessSegTwoNo">
                <el-input v-trim v-model="detailForm.accessSegTwoNo" disabled/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item v-if="detailForm.accessSegTwoNo" label="结果判定" prop="accessSegTwoNoJg" key="accessSegTwoNoJg">
                <el-select v-model="detailForm.accessSegTwoNoJg">
                  <el-option v-for="item in resultDeterminationMap" :key="item.name" :label="item.name" :value="item.value"/>
                </el-select>
              </el-form-item>
              <el-form-item v-else label="结果判定" key="accessSegTwoNoJg2">
                <el-input disabled/>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="C段2编号" prop="ccAccessSegTwoNo">
                <el-input v-trim v-model="detailForm.ccAccessSegTwoNo" disabled/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item v-if="detailForm.ccAccessSegTwoNo" label="结果判定" prop="ccAccessSegTwoNoJg" key="ccAccessSegTwoNoJg">
                <el-select v-model="detailForm.ccAccessSegTwoNoJg">
                  <el-option v-for="item in resultDeterminationMap" :key="item.name" :label="item.name" :value="item.value"/>
                </el-select>
              </el-form-item>
              <el-form-item v-else label="结果判定" key="ccAccessSegTwoNoJg2">
                <el-input disabled/>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="限位环编号" prop="accessStopRingNo">
                <el-input v-trim v-model="detailForm.accessStopRingNo" disabled/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="结果判定" prop="accessStopRingNoJg">
                <el-select v-model="detailForm.accessStopRingNoJg">
                  <el-option v-for="item in resultDeterminationMap" :key="item.name" :label="item.name" :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <div class="headLine">
                <div class="headLine-title">录入回收料数据</div>
                <el-button type="primary" plain @click="convexityMeasure.push({ classification:'', weight:0})">增加分类</el-button>
              </div>
            </el-col>
            <el-col :span="24">
            <el-table :data="convexityMeasure">
              <el-table-column label="目数" prop="classification">
                <template slot-scope="{row}">
                  <el-select v-model="row['classification']" style="width:100%" @change="handleClassChange($event, row)">
                    <el-option v-for="item in powderMap" :key="item.name" :value="item.name"/>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="料号" prop="materialCode"/>
              <el-table-column label="物料名称" prop="materialName"/>
              <el-table-column label="重量g" prop="weight">
                <template slot-scope="{row}">
                  <el-input-number v-model="row._weight_g" style="width:100%" :min="0" @focus="$event.target.select()" :controls="false" @blur="handleWeightBlur(row)"/>
                  <i>{{ row.weight }} kg</i>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="70px">
                <template slot-scope="scope">
                  <el-button type="text" style="color:red" icon="el-icon-delete" @click="deleteItem(scope.$index)"></el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
</template>

<script>
import {getSeleteData} from '@/utils/select.js'
import CodeScanner from '@/components/CodeScanner';
import PhotoNew from "@/views/components/photoNew.vue";
import * as seedCrystal from '@/api/seedCrystal'
import * as crucibleAssembly from '@/api/crucibleAssembly'
import GetValByInput from "@/views/components/getValByInput.vue";
import {round} from "lodash-es";

const deflutFrom = {
  rawAnnex:'',
  rawMark:'',
  recycledMaterials:'',
  rawDhNoJg:'',
  rawDhNo:'',
  rawDgNoJg:'',
  rawDgNo:'',
  rawCrucibleOneNoJg:'',
  rawCrucibleOneNo:'',
  rawResultJudgment:'',
  rawCrucibleNo:'',
  supportRingNo: null, // 支撑环编号
  supportRingNoJg: null, // 支撑环编号判定结果
  upperBoardNo: null, // 上板编号
  upperBoardNoJg: null, // 上板编号判定结果
  accessSegTwoNo:'', // 段2编号
  accessSegTwoNoJg:'', // 段2编号判定结果
  accessStopRingNo:'', // 限位环编号
  accessStopRingNoJg:'', // 限位环编号判定结果
  ccAccessSegTwoNo:'', // C段2编号
  ccAccessSegTwoNoJg:'', // C段2编号判定结果
}
export default {
  name: 'MaterialProcessing',
  components:{
    GetValByInput,
    PhotoNew,
    CodeScanner
  },
  props:{
    fromData:{
      type:Object,
      require:true
    }
  },
  data() {
    return {
      disabled:true,
      imageList:[],
      convexityMeasure:[],//回收料数据
      resultDeterminationMap:[],//结果判定字典
      powderMap:[],// 目数map
      detailForm:{},
      rules: {
        rawAnnex: [{required: true, message: "必填项", trigger: 'change'}],
        rawMark: [{required: true, message: "必填项", trigger: 'change'}],
        recycledMaterials: [{required: true, message: "必填项", trigger: 'change'}],
        rawDhNoJg: [{required: true, message: "必填项", trigger: 'change'}],
        rawDgNoJg: [{required: true, message: "必填项", trigger: 'change'}],
        rawCrucibleOneNoJg: [{required: true, message: "必填项", trigger: 'change'}],
        rawResultJudgment: [{required: true, message: "必填项", trigger: 'change'}],
        rawCrucibleNo: [{required: true, message: "必填项", trigger: 'change'}],
        supportRingNoJg: [{required: true, message: "必填项", trigger: 'change'}],
        upperBoardNoJg: [{required: true, message: "必填项", trigger: 'change'}],
        accessSegTwoNoJg: [{required: true, message: "必填项", trigger: 'change'}],
        accessStopRingNoJg: [{required: true, message: "必填项", trigger: 'change'}],
        ccAccessSegTwoNoJg: [{required: true, message: "必填项", trigger: 'change'}],
      },

    }
  },
  mounted() {
    getSeleteData('accessoriesStatus',this.resultDeterminationMap)
    getSeleteData('RecycledMesh ',this.powderMap) // 目数map
  },
  methods: {
    //初始化数据处理
    getDetail(){
      this.detailForm = Object.assign({},deflutFrom,this.fromData)
      //处理回收料数据
      if(this.detailForm.recycledMaterials){
        this.convexityMeasure = JSON.parse(this.detailForm.recycledMaterials)
      }
      if(this.convexityMeasure.length === 0){
        this.convexityMeasure = [
          {
            classification:'',
            weight:0
          }
        ]
      }
      //获取籽晶数据
      seedCrystal.listAll({search_EQ_lotNo:this.fromData.processingOrderCode}).then(res => {
        if(res.data && res.data.length > 0){
          const seedCrystalData = res.data[0]
          // 顶盖编号
          this.detailForm.rawDgNo = seedCrystalData.accessTopCapNo
          // 顶环编号
          this.detailForm.rawDhNo = seedCrystalData.topRingCode
          // 支撑环编号
          this.detailForm.supportRingNo = seedCrystalData.accessSupportRingNo
          // 上板编号
          this.detailForm.upperBoardNo = seedCrystalData.accessUpperRingNo
        }
      })

      //获取坩埚数据
      crucibleAssembly.listByLotNo(this.fromData.processingOrderCode).then(res => {
        if(res.data && res.data){
          const data = res.data
          // 辅料信息-段1编号
          this.detailForm.rawCrucibleOneNo = data.accessSegOneNo
          // 坩埚编号
          this.detailForm.rawCrucibleNo = data.crucibleCode
          // 段2编号
          this.detailForm.accessSegTwoNo = data.accessSegTwoNo
          // 限位环编号
          this.detailForm.accessStopRingNo = data.accessStopRingNo
          // C段2编号
          this.detailForm.ccAccessSegTwoNo = data.ccAccessSegTwoNo
        }
      })
      this.$nextTick(() => {
        this.$refs.materialForm.clearValidate()
      })
    },
    //删除
    deleteItem(index){
      if(this.convexityMeasure.length === 1) return
      this.convexityMeasure.splice(index,1)
    },
    //from表单验证
    async getRules(){
      try {
        this.detailForm.rawAnnex = JSON.stringify(this.imageList)
        this.detailForm.recycledMaterials = JSON.stringify(this.convexityMeasure)
        const viod = await this.$refs['materialForm'].validate()
        return {
          viod: typeof viod === 'boolean',
          fromData:this.detailForm
        }
      } catch (error) {
        return {
          viod: false,
          fromData:this.detailForm
        }
      }
    },
    handleClassChange($event, row) {
      const matched = this.powderMap.find(item => item.name === $event)
      row.materialCode = matched ? matched.extendValue : ''
      row.materialName = matched ? matched.extendValue1 : ''
    },
    handleWeightBlur(row) {
      // g 转换为 kg
      let kg = row._weight_g / 1000
      kg = Number((kg).toFixed(4))
      this.$set(row, 'weight', round(kg, 4) || 0)

    }
  }
}
</script>
<style lang="scss" scoped>
.el-input-number,
.el-select {
  width: 100%;
}
</style>
