<!--坩埚组装(操作任务)-->
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
        <!--        <div class="grid-item">-->
        <!--          <span class="grid-item-name">产品配方：</span>-->
        <!--          <span class="grid-item-value">{{ detailForm.productFormula }}</span>-->
        <!--        </div>-->
      </div>
    </div>
    <!-- 其他表单卡片 -->
    <div class="fromCard">
      <div class="fromCard">
        <el-form :model="detailForm" label-width="120px" :rules="rules" ref="detailForm">
          <el-row>
<!--            <el-col :span="24">-->
<!--              <div class="headLine">-->
<!--                <div class="headLine-title">籽晶数据</div>-->
<!--              </div>-->
<!--            </el-col>-->

<!--            <el-col :span="24">-->
<!--              <div :class="'grid-container'" style="padding: 20px;background-color: #b3d8ff96">-->
<!--                <div class="grid-item">-->
<!--                  <span class="grid-item-name">籽晶编号：</span>-->
<!--                  <span class="grid-item-value">{{ seedCrystalData.seedCode }}</span>-->
<!--                </div>-->
<!--                <br>-->
<!--                <div class="grid-item">-->
<!--                  <span class="grid-item-name">等级：</span>-->
<!--                  <span class="grid-item-value">{{ seedCrystalData.seedGrade }}</span>-->
<!--                </div>-->
<!--                <div class="grid-item">-->
<!--                  <span class="grid-item-name">类别：</span>-->
<!--                  <span class="grid-item-value">{{ seedCrystalData.seedType }}</span>-->
<!--                </div>-->
<!--                <div class="grid-item">-->
<!--                  <span class="grid-item-name">籽晶表现状态：</span>-->
<!--                  <span class="grid-item-value">{{ seedCrystalData.seedPerformance }}</span>-->
<!--                </div>-->
<!--                <div class="grid-item">-->
<!--                  <span class="grid-item-name">石墨纸状态：</span>-->
<!--                  <span class="grid-item-value">{{ seedCrystalData.graphiteStatus }}</span>-->
<!--                </div>-->
<!--                <div class="grid-item">-->
<!--                  <span class="grid-item-name">顶盖编号：</span>-->
<!--                  <span class="grid-item-value">{{ seedCrystalData.accessTopCapNo }}</span>-->
<!--                </div>-->
<!--              </div>-->
<!--            </el-col>-->
            <div class="headLine">
              <div class="headLine-title">原料数据</div>
            </div>
            <div class="main-wrap">
              <el-form-item label="坩埚编号" label-width="100px" prop="crucibleCode">
                <CodeScanner v-model="detailForm.crucibleCode" placeholder="请扫描或输入坩埚编号" @has-done="hasCrucible"/>
                <div class="crucibleCode-info">
                  炉次号{{ crucibleCodeData.lotNo }}
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  原料批次{{crucibleCodeData.materialBatch}}
                </div>
              </el-form-item>
              <el-table v-if="crucibleCodeData.details && crucibleCodeData.details.length > 0" :data="crucibleCodeData.details">
                <el-table-column label="目数" prop="meshNum"></el-table-column>
                <el-table-column label="高度mm" prop="materialActualHeight"></el-table-column>
                <el-table-column label="重量kg" prop="materialActualWeight"></el-table-column>
              </el-table>
            </div>
            <el-col :span="24">
              <div class="headLine">
                <div class="headLine-title">填写组装数据</div>
              </div>
            </el-col>
          </el-row>

          <div class="main-wrap">
            <el-row>
              <el-col :span="12">
                <el-form-item label="段1编号" prop="accessSegOneNo">
                  <CodeScanner v-model="detailForm.accessSegOneNo" @has-done="hasNo('accessSegOneNo')" placeholder="请扫描或输入段1编号"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="限位环编号" prop="accessStopRingNo">
                  <CodeScanner v-model="detailForm.accessStopRingNo" placeholder="请扫描或输入限位环编号" @has-done="hasNo('accessStopRingNo')"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="段2/C段2" prop="_segType">
                  <el-select v-model="detailForm._segType" style="width: 100%;">
                    <el-option v-for="(item, index) in segTypeList" :key="index" :value="item"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="段2编号" prop="accessSegTwoNo">
                  <CodeScanner v-model="detailForm.accessSegTwoNo" placeholder="请扫描或输入段2编号" @has-done="hasNo('accessSegTwoNo')"/>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item label="C段2编号" prop="ccAccessSegTwoNo">
                  <CodeScanner v-model="detailForm.ccAccessSegTwoNo" placeholder="请扫描或输入C段2编号" @has-done="hasNo('ccAccessSegTwoNo')"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="C段2等级" prop="ccAccessSegTwoGrade">
                  <el-select v-model="detailForm.ccAccessSegTwoGrade" style="width: 100%;">
                    <el-option v-for="item in ccGradeList" :key="item.value" :value="item.value" :label="item.label"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item label="X原料编号" prop="xrawNo">
                  <el-input v-trim v-model="detailForm.xrawNo" style="width: 100%;" @blur="handleXrawNoBlur"/>
                  <div class="crucibleCode-info">使用次数&nbsp;&nbsp;&nbsp;&nbsp;{{ cleanCount1 }}</div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="X加入量g" prop="_xrawAdd_g">
                  <el-input-number v-model="detailForm._xrawAdd_g" :min="0" :precision="1" :controls="false" style="width: 100%;" @focus="$event.target.select()" @blur="handleXrawAddGBlur"/>
                  <i>{{ detailForm.xrawAdd }} kg</i>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item label="X加工方式" prop="xrawType">
                  <el-select v-model="detailForm.xrawType" style="width: 100%;">
                    <el-option v-for="item in xrawTypeList" :key="item.value" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="X原料等级" prop="xrawGrade">
                  <el-select v-model="detailForm.xrawGrade">
                    <el-option v-for="(item, index) in xrawGradeList" :key="index" :value="item.value" :label="item.label"/>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item label="XX原料编号" prop="xxrawNo">
                  <el-input v-trim v-model="detailForm.xxrawNo" placeholder="请输入物料批次号" style="width: 100%;"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="XX加入量" prop="xxrawAdd">
                  <el-input-number v-model="detailForm.xxrawAdd" :min="0" :precision="1" :controls="false" style="width: 100%;" @focus="$event.target.select()"/>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item label="XX加工方式" prop="xxrawType">
                  <el-select v-model="detailForm.xxrawType" style="width: 100%;">
                    <el-option v-for="item in xxrawTypeList" :key="item.value" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item label="#编号" prop="rawNo">
                  <el-input v-trim v-model="detailForm.rawNo" placeholder="请输入物料批次号" style="width: 100%;"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="#加入量" prop="rawAdd">
                  <el-input-number v-model="detailForm.rawAdd" :min="0" :precision="1" :controls="false" style="width: 100%;" @focus="$event.target.select()"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="#加工方式" prop="rawType">
                  <el-select v-model="detailForm.rawType" style="width: 100%;">
                    <el-option v-for="item in rawTypeList" :key="item.value" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="24">
                <el-form-item label="备注">
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
                    v-model="imageList"
                    :componentDisabled="disabled"
                    :photoNum="6"
                    :name="'CHECK_DEVICE'"
                  ></PhotoNew>
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <el-row>
            <el-col :span="24">
              <div class="headLine">
                <div class="headLine-title">上炉功率及本炉要求</div>
              </div>
            </el-col>
          </el-row>

          <div class="main-wrap">
            <el-table :data="furnaceDataList" ref="furnace">
              <el-table-column label="炉次号" prop="lotNo"></el-table-column>
              <el-table-column label="功率">
                <template slot-scope="{row}">
                  <el-input v-trim v-if="row.change" v-model="row.power" ></el-input>
                  <template v-else>{{ row.power }}</template>
                </template>
              </el-table-column>
              <el-table-column label="温度" prop="temperature">
                <template slot-scope="{row}">
                  <el-input v-trim v-if="row.change" v-model="row.temperature" ></el-input>
                  <template v-else>{{ row.temperature }}</template>
                </template>
              </el-table-column>
              <el-table-column label="长速g/hr" prop="velocity">
                <template slot-scope="{row}">
                  <el-input v-trim v-if="row.change" v-model="row.velocity" ></el-input>
                  <template v-else>{{ row.velocity }}</template>
                </template>
              </el-table-column>
              <el-table-column label="失重/蒸发%" prop="evaporation">
                <template slot-scope="{row}">
                  <el-input v-trim v-if="row.change" v-model="row.evaporation" ></el-input>
                  <template v-else>{{ row.evaporation }}</template>
                </template>
              </el-table-column>
            </el-table>
            <br>
            <el-form-item label="保温条件" label-width="90px" required>
              <div v-for="item in insulationMethod" :key="item.value" style="display: flex;">
                <el-input v-trim v-model="item.attr1">
                  <template slot="prepend">Φ</template>
                </el-input>
                <el-input v-trim v-model="item.attr2">
                  <template slot="prepend">/Φ</template>
                </el-input>
                <el-input v-trim v-model="item.attr3">
                  <template slot="prepend">X</template>
                </el-input>
                <el-input v-trim v-model="item.attr4">
                  <template slot="prepend">X</template>
                </el-input>
              </div>
            </el-form-item>
          </div>

          <div class="headLine">
            <div class="headLine-title">填写工艺卡</div>
          </div>

          <div class="main-wrap">
            <el-row>
              <el-col :span="12">
                <el-form-item label="N2流量sccm" prop="flowNtwo">
                  <div style="display: flex;">
                    <el-input-number v-model="detailForm.flowNtwo" @focus="$event.target.select()" style="width: 100%;" :precision="2" :min="0" :controls="false"/>
                    <el-input-number v-model="detailForm.flowNtwoUpper" @focus="$event.target.select()" style="width: 100%;" :precision="2" :min="0" :controls="false"/>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="Ar流量sccm" prop="flowAr">
                  <el-input-number v-model="detailForm.flowAr" @focus="$event.target.select()" style="width: 100%;" :precision="2" :min="0" :controls="false"></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="坩埚位置mm" prop="cruciblePosition">
                  <el-input-number v-model="detailForm.cruciblePosition" @focus="$event.target.select()" style="width: 100%;" :precision="2" :controls="false"></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item class="mulline-label" label="多孔石墨板尺寸mm" prop="graphitePlateSize">
                  <div style="display: flex;">
                    <el-input v-trim type="number" v-model="detailForm.graphitePlateSize">
                      <template slot="prepend">Φ</template>
                    </el-input>
                    <el-input v-trim type="number" v-model="detailForm.graphitePlateThickness">
                      <template slot="append">mm</template>
                    </el-input>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item class="mulline-label" label="顶盖抬起高度mm" prop="topCoverLiftHeight">
                  <el-input-number v-model="detailForm.topCoverLiftHeight" @focus="$event.target.select()" style="width: 100%;" :precision="2" :min="0" :controls="false"></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="顶保温挡板" prop="topInsulationBaffle">
                  <el-select v-model="detailForm.topInsulationBaffle">
                    <el-option v-for="item in topInsulationBaffleMap" :key="item.value" :value="item.value" :label="item.label"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item class="mulline-label" label="石墨板开孔mm" prop="openGraphitePlate">
                  <el-input-number v-model="detailForm.openGraphitePlate" @focus="$event.target.select()" style="width: 100%;" :precision="2" :min="0" :controls="false"></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="软毡层数" prop="softFeltMax">
                  <div style="display: flex;">
                    <el-input v-trim type="number" v-model="detailForm.softFeltMin">
                      <template slot="prepend">Φ</template>
                    </el-input>
                    <el-input v-trim type="number" v-model="detailForm.softFeltMax">
                      <template slot="append">层</template>
                    </el-input>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="充气方式" prop="aerateType">
                  <el-select v-model="detailForm.aerateType">
                    <el-option v-for="item in inflationMethod" :key="item.value" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="烧料时长h" prop="burnTime">
                  <el-input-number v-model="detailForm.burnTime" @focus="$event.target.select()" style="width: 100%;" :precision="2" :min="0" :controls="false"></el-input-number>
                </el-form-item>
              </el-col>


              <el-col :span="12">
                <el-form-item label="降压工艺" prop="depressurizationProcess">
                  <el-input v-trim v-model="detailForm.depressurizationProcess"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="工艺情况" prop="processSituation">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4}"
                    placeholder="请输入内容"
                    v-model="detailForm.processSituation">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item>
                  <el-button type="primary">查看上炉数据</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
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
import {getSeleteData} from '@/utils/select.js'
import * as Api from '@/api/crucibleAssembly'
import * as seedCrystal from '@/api/seedCrystal'
import * as inStation from '@/api/inStation'
import CodeScanner from '@/components/CodeScanner';
import ObtainInput from '@/views/components/obtainInput';
import PhotoNew from "@/views/components/photoNew.vue";
import cleanDry from "../../cleanDry/index.vue";
import {CrucibleCleanDryProcessDetail, fetchCount} from "@/api/crucibleAssembly";
import * as charge from "@/api/charge";

const deflutFrom = {
  seedCode:'',
  crucibleCode:'',
  accessSegOneNo:'', // 段1编号
  accessSegTwoNo:'', // 段2编号
  accessStopRingNo:'', // 限位环编号
  _segType:'', // C段/C段2
  ccAccessSegTwoNo:'', // C段2编号
  ccAccessSegTwoGrade:'', // C段2等级
  xxxxProcessType:'',
  insulationCondition:'',
  flowNtwo: undefined, // N2流量下限
  flowNtwoUpper: undefined, // N2流量上限
  productFormula:'',
  flowAr:'',
  mark:'',
  lotNo:'',
  cruciblePosition:'',
  graphitePlateSize:'', // 石墨板尺寸
  graphitePlateThickness:'', // 石墨板厚度mm
  topCoverLiftHeight:'',
  topInsulationBaffle:'',
  openGraphitePlate:'',
  softFeltMax:'',
  softFeltMin:'',
  aerateType:'',
  burnTime:'', // 烧料时长h
  depressurizationProcess:'',
  processSituation:'',
  xrawNo: null, // X原料编号
  _xrawAdd_g: 0, // X加入量g
  xrawAdd: 0, // X加入量kg
  xrawType: null, // X加工方式
  xrawGrade: null, // X原料等级
  xxrawNo: null, // XX原料编号
  xxrawAdd: null, // XX加入量
  xxrawType: null, // XX加工方式
  rawNo: null, // #编号
  rawAdd: null, // #加入量
  rawType: null, // #加工方式
  submitType:0,
  annex:'[]'
}
export default {
  name: 'OperateTask',
  computed: {
    cleanDry() {
      return cleanDry
    }
  },
  components:{
    PhotoNew,
    CodeScanner,
    ObtainInput
  },
  data() {
    return {
      disabled:true,
      seedCrystalData:{},//籽晶安装信息
      crucibleCodeData:{},//原料信息
      overStation:{},//过站信息
      imageList:[],
      rawMaterialList:[],
      segTypeList:['段2', 'C段2'],
      ccGradeList:[], // C段2等级list
      xrawTypeList:[], // X加工方式list
      xrawGradeList:[], // X原料等级list
      xxrawTypeList:[], // XX加工方式list
      rawTypeList:[], // #加工方式list
      insulationMethod: Array.from({ length: 7 }, x => ({
        attr1:'',
        attr3:'',
        attr2:'',
        attr4:''
      })),
      inflationMethod:[],
      furnaceDataList:[], // 前2炉list和本炉目标
      topInsulationBaffleMap:[], // 顶保温挡板map
      detailForm:Object.assign({},deflutFrom),
      rules: {
        seedCode: [{required: true, message: "必填项", trigger: 'change'}],
        crucibleCode: [{required: true, message: "必填项", trigger: 'change'}],
        accessSegOneNo: [{required: true, message: "必填项", trigger: 'change'}],
        accessStopRingNo: [{required: true, message: "必填项", trigger: 'change'}],
        _segType: [{required: true, message: "必选项", trigger: 'change'}],
        accessSegTwoNo: [{required: false, message: "必选项", trigger: 'change'}],
        ccAccessSegTwoNo: [{required: false, message: "必选项", trigger: 'change'}],
        ccAccessSegTwoGrade: [{required: false, message: "必选项", trigger: 'change'}],
        xxxxProcessType: [{required: true, message: "必填项", trigger: 'change'}],
        insulationCondition: [{required: true, message: "必填项", trigger: 'change'}],
        flowNtwo: [{required: true, message: "必填项", trigger: 'change'}],
        flowNtwoUpper: [{required: true, message: "必填项", trigger: 'change'}],
        productFormula: [{required: true, message: "必填项", trigger: 'change'}],
        flowAr: [{required: true, message: "必填项", trigger: 'change'}],
        lotNo: [{required: true, message: "必填项", trigger: 'change'}],
        cruciblePosition: [{required: true, message: "必填项", trigger: 'change'}],
        graphitePlateSize: [{required: true, message: "必填项", trigger: 'change'}],
        topCoverLiftHeight: [{required: true, message: "必填项", trigger: 'change'}],
        topInsulationBaffle: [{required: true, message: "必填项", trigger: 'change'}],
        openGraphitePlate: [{required: true, message: "必填项", trigger: 'change'}],
        softFeltMax: [{required: true, message: "必填项", trigger: 'change'}],
        softFeltMin: [{required: true, message: "必填项", trigger: 'change'}],
        aerateType: [{required: true, message: "必填项", trigger: 'change'}],
        depressurizationProcess: [{required: true, message: "必填项", trigger: 'change'}],
        processSituation: [{required: true, message: "必填项", trigger: 'change'}],
        xrawNo: [{required: true, message: "必填项", trigger: 'change'}],
        _xrawAdd_g: [{required: true, message: "必填项", trigger: 'change'}],
        xrawType: [{required: true, message: "必填项", trigger: 'change'}],
        xxrawNo: [{required: true, message: "必填项", trigger: 'change'}],
        xxrawAdd: [{required: true, message: "必填项", trigger: 'change'}],
        xxrawType: [{required: true, message: "必填项", trigger: 'change'}],
        rawNo: [{required: true, message: "必填项", trigger: 'change'}],
        rawAdd: [{required: true, message: "必填项", trigger: 'change'}],
        rawType: [{required: true, message: "必填项", trigger: 'change'}],
        submitType: [{required: true, message: "必填项", trigger: 'change'}],
      },
      cleanCount1: '0',
      cleanCount2: '',
    }
  },
  watch: {
    'detailForm._segType': function(segType) {
      if (!segType) return
      const isSeg2 = segType === '段2'
      // 段2编号
      this.rules.accessSegTwoNo[0].required = isSeg2
      // C段2编号
      this.rules.ccAccessSegTwoNo[0].required = !isSeg2
      // C段2等级
      this.rules.ccAccessSegTwoGrade[0].required = !isSeg2
    }
  },
  created(){
    this.detailForm = Object.assign({},deflutFrom)
    //接收路由传参数据
    this.overStation = this.$route.query || {}
  },
  mounted() {
    getSeleteData('ccAccessSegTwoGrade',this.ccGradeList) // C段2等级list
    getSeleteData('x-processing-method',this.xrawTypeList) // X加工方式list
    getSeleteData('xx-processing-method',this.xxrawTypeList) // XX加工方式list
    getSeleteData('xlevel',this.xrawGradeList) // X原料等级list
    getSeleteData('#-processing-method',this.rawTypeList) // #加工方式list
    getSeleteData('inflationMethod',this.inflationMethod)
    getSeleteData('topInsulationBaffle',this.topInsulationBaffleMap) // 顶保温挡板map

    this.getDetail()
  },
  methods: {
    //数据完善
    getDetail(){
      if(!this.overStation.processingOrderCode)return this.$message.error('过站信息有误,请验证后重新操作')
      const storageData = sessionStorage.getItem('ggzz' + this.overStation.processingOrderCode)
      if(storageData){
        //有上次保存数据进行数据还原
        const saveData = JSON.parse(storageData)
        this.detailForm = saveData.detailForm

        //还原上炉功率及本炉要求
        this.furnaceDataList = saveData.furnaceDataList

        //还原保温条件
        if(this.detailForm.insulationCondition){
          this.insulationMethod = JSON.parse(this.detailForm.insulationCondition)
        }
        //获取坩埚扫描数据
        this.hasCrucible()
      }else{
        // 站点跳转后获取基本数据
        this.fetchInfo()

        // 获取上炉功率及本炉要求
        this.fetchDemand()
      }

      this.$nextTick(() => {
        this.$refs.detailForm.clearValidate()
      })
    },
    // 站点跳转后获取基本数据
    fetchInfo() {
      Api.listByPage({
        processName: '坩埚组装',
        search_EQ_lotNo: this.overStation.processingOrderCode,
        page: 1,
        rows: 10
      }).then(res => {
        if (res.data && res.data.rows.length > 0) {
          this.detailForm = Object.assign({}, deflutFrom, JSON.parse(JSON.stringify(res.data.rows[0])))
        }
      });
    },
    // 获取上炉功率及本炉要求
    fetchDemand() {
      if(this.furnaceDataList.length === 0){
        this.furnaceDataList = [{
          lotNo:'本炉目标',
          power:'',
          change:true,
          temperature:'',
          velocity:'',
          evaporation:''
        }]
      }
      const { processingOrderCode } = this.overStation
      if (!processingOrderCode) return

      Api.getHistoryLotInfo({
        lotNo: this.overStation.processingOrderCode
      }).then(res => {
        // 显示前两炉信息
        const historyList = []
        for (let i = 0; i < 2; i++) {
          if (!res.data[i]) continue
          const { insulationCondition, ...row } = res.data[i]
          historyList.push(row)
        }
        this.furnaceDataList.unshift(...historyList)

        // 保温条件自动获取上炉次的
        if (res.data.length) {
          const prevLot = res.data[historyList.length - 1]
          try {
            const prevInsulation = JSON.parse(prevLot.insulationCondition)
            prevInsulation.forEach((row, i) => {
              this.$set(this.insulationMethod, i, {
                ...this.insulationMethod[i],
                ...row
              })
            })
          } catch (e) {
            console.error(e)
          }
        }
      })
    },
    //扫描坩埚编号获取原料数据
    hasCrucible(){
      if(!this.detailForm.crucibleCode)return
      Api.listByCrucibleCode({search_EQ_crucibleCode:this.detailForm.crucibleCode}).then(res => {
        if(res.data){
          this.crucibleCodeData = res.data
        }else{
          this.crucibleCodeData = {}
        }
      })
    },
    //保存数据 保存到前端,提交到后端
    saveDetail(type){
      const furnace = JSON.parse(JSON.stringify(this.furnaceDataList[this.furnaceDataList.length - 1]))
      furnace.lotNo = this.overStation.processingOrderCode
      this.detailForm.seedCode = this.seedCrystalData.seedCode

      const detailForm = JSON.parse(JSON.stringify(this.detailForm))
      detailForm.annex = JSON.stringify(this.imageList)
      detailForm.insulationCondition = JSON.stringify(this.insulationMethod)
      detailForm.lotNo = this.overStation.processingOrderCode
      detailForm.crucibleChargeLotNo = this.crucibleCodeData.lotNo // 装料表的炉次号
      detailForm.furnaceTarget = JSON.stringify(furnace)

      if(!type){
        // 保存
        const saveData = {
          detailForm,
          furnaceDataList: this.furnaceDataList
        }
        sessionStorage.setItem('ggzz' + this.overStation.processingOrderCode, JSON.stringify(saveData))
        this.$message.success(`保存成功`)
        this.$router.push({ path: '/crucibleAssembly'})
      }else{
        // 提交
        detailForm.submitType = 1
        this.generate(detailForm)
      }
    },
    //完成籽晶安装数据填写
    generate(data){
      this.$refs['detailForm'].validate(valid => {
        if(valid){
          const form = {
            processingOrderCode:this.overStation.processingOrderCode,
            param:{'坩埚拆装_坩埚组装_出站':JSON.stringify(data)},
            flowLineLable:'',
            processUuid:this.overStation.processUuid
          }
          inStation.outStation(form).then(res => {
            this.$message.success('提交成功')
            sessionStorage.removeItem('ggzz' + this.overStation.processingOrderCode)
            this.$router.push({ path: '/crucibleAssembly'})
          })
        }
      })
    },
    // 查询清洗次数
    handleXrawNoBlur() {
      fetchCount({
        batchNo: this.detailForm.xrawNo
      }).then(res => {
        this.cleanCount1 = res.data || '0'
      })
    },
    // 查询清洗次数
    handleXxrawNoBlur() {
      CrucibleCleanDryProcessDetail({
        search_EQ_cleanBatchNo: this.detailForm.xxrawNo
      }).then(res => {
        if (!res.data.rows.length) {
          this.detailForm.xxrawNo = ''
          this.cleanCount2 = ''
          this.$message.warning('无数据')
          return
        }
        this.cleanCount2 = res.data.rows[0].cleanCount
      })
    },
    //扫码验证
    hasNo(filed){
      if(!this.detailForm[filed])return
      charge.listAllLife({search_EQ_uniqueCode:this.detailForm[filed],search_EQ_status:0}).then(res => {
        if(res.data.length <= 0){
          this.$message.warning('无数据')
          this.$set(this.detailForm,filed,'')
        }
      })
    },
    handleXrawAddGBlur() {
      // g 转换为 kg
      let kg = this.detailForm._xrawAdd_g / 1000
      kg = Number((kg).toFixed(4))
      this.detailForm.xrawAdd = kg // X加入量kg
    }
  }
}
</script>

<style lang="scss" scoped>

.table-title{
  color: #409eff;
  height: 40px;
  line-height: 40px;
  font-size: 20px;
  margin: 5px 0;
  text-indent: 10px;
  background-color: #f5f5f5;
}
.crucibleCode-info{
  text-indent: 10px;
  margin: 2px 0;
  background-color: #b3d8ff96;
}
.grid-container {
    display: grid;
    grid-template-columns: repeat(2, minmax(120px, 1fr));
    grid-gap: 10px;
    padding: 5px;
    .grid-item{
      display: flex;
      align-items: center;
      .grid-item-value{
        color: black;
      }
    }
  }

.pageHandleBox{
  background-color: #FFF;
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
  padding: 10px;
  align-items: center;
  justify-content: space-between;
  .save{
    padding: 10px 20%;
    margin: 0px;
  }
  .submit{
    margin: 0px 10px;
    padding: 10px 20%;
  }
}
.el-select {
  width: 100%;
}
</style>
