<!--开炉(进站) / 长晶  晶体开炉-->
<template>
  <div class="fromCard">
    <div class="fromCard">
      <el-form :model="detailForm" label-width="155px" :rules="rules" ref="KLForm" style="padding: 0 10px 0 0;">
        <el-row>
          <el-col :span="24">
            <div class="headLine">
              <div class="headLine-title">晶体信息</div>
            </div>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生长后盖重g" prop="_growthTopWeight_g">
              <el-input-number v-model="detailForm._growthTopWeight_g" :min="0" @focus="$event.target.select()" :controls="false" @blur="handleGrowthTopBlur"/>
              <i>{{ detailForm.growthTopWeight }} kg</i>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生长后全套重g" prop="_growthTotalWeight_g">
              <el-input-number v-model="detailForm._growthTotalWeight_g" :min="0" @focus="$event.target.select()" :controls="false" @blur="handleGrowthTotalBlur"/>
              <i>{{ detailForm.growthTotalWeight }} kg</i>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="生长时间h" prop="growthTime">
              <el-input-number v-model="detailForm.growthTime" :min="0" @focus="$event.target.select()" :controls="false"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="生长重量kg" prop="growthWeight">
              <el-input-number v-model="detailForm.growthWeight" disabled :controls="false" placeholder="计算公式计算"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="失重蒸发比%">
              <el-input-number :value="calcEvaporation" disabled :controls="false" placeholder="计算公式计算"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生长速率(重量)g/h">
              <el-input-number :value="calcGrowthRatel" :controls="false" disabled placeholder="计算公式计算"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生长速度(高度)μm/h">
              <el-input-number :value="calcGrowthRate" :controls="false" disabled placeholder="计算公式计算"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="相变直径mm" prop="transitionDiameter">
              <el-select v-model="detailForm.transitionDiameter">
                <el-option v-for="item in transitionDiameterMap" :key="item.name" :label="item.name" :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="多晶直径mm" prop="polycrystallineDiameter">
              <el-input-number v-model="detailForm.polycrystallineDiameter" :min="0" @focus="$event.target.select()" :controls="false"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="小面直径mm" prop="minorDiameter">
              <el-input-number v-model="detailForm.minorDiameter" :min="0" @focus="$event.target.select()" :controls="false"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="顶盖间隙mm" prop="_gap1">
              <div style="display: flex;">
                <el-form-item label-width="0" prop="_gap1">
                  <el-input v-trim type="number" v-model="detailForm._gap1"/>
                </el-form-item>
                <el-form-item label-width="0" prop="_gap2">
                  <el-input v-trim type="number" v-model="detailForm._gap2"/>
                </el-form-item>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最大直径" prop="maxDiameter">
              <el-input-number v-model="detailForm.maxDiameter" :precision="2" :min="0" @focus="$event.target.select()" :controls="false"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最小直径" prop="minDiameter">
              <el-input-number v-model="detailForm.minDiameter" :precision="2" :min="0" @focus="$event.target.select()" :controls="false"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="晶体表面等级" prop="crystalDesc">
              <el-select v-model="detailForm.crystalDesc">
                <el-option v-for="item in crystalDescMap" :key="item" :value="item"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="背面亮点情况" prop="backHighlight">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入内容"
                v-model="detailForm.backHighlight">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="晶体图示" prop="crystalIcon">
              <el-button plain @click="getCrystalIcon()">进入画板</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="下炉调整方向" prop="adjustmentDirection">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入内容"
                v-model="detailForm.adjustmentDirection">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="晶体厚度" prop="adjustmentDirectionHb">
              <el-button plain @click="getThickness()">进入画板</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <div class="table-title"><strong>凸度测量</strong></div>
            <el-table :data="convexityMeasure" style="margin-bottom: 12px;">
              <el-table-column prop="val"></el-table-column>
              <el-table-column label="0" prop="0">
                <template slot-scope="{row}">
                  <el-input-number :min="0" @focus="$event.target.select()" style="width: 98%;" :controls="false" v-model="row['0']"/>
                </template>
              </el-table-column>
              <el-table-column label="20" prop="20">
                <template slot-scope="{row}">
                  <el-input-number :min="0" @focus="$event.target.select()" style="width: 98%;" :controls="false" v-model="row['20']"/>
                </template>
              </el-table-column>
              <el-table-column label="40" prop="40">
                <template slot-scope="{row}">
                  <el-input-number :min="0" @focus="$event.target.select()" style="width: 98%;" :controls="false" v-model="row['40']"/>
                </template>
              </el-table-column>
              <el-table-column label="60" prop="60">
                <template slot-scope="{row}">
                  <el-input-number :min="0" @focus="$event.target.select()" style="width: 98%;" :controls="false" v-model="row['60']"/>
                </template>
              </el-table-column>
              <el-table-column label="70" prop="70">
                <template slot-scope="{row}">
                  <el-input-number :min="0" @focus="$event.target.select()" style="width: 98%;" :controls="false" v-model="row['70']"/>
                </template>
              </el-table-column>
              <el-table-column label="75" prop="75">
                <template slot-scope="{row}">
                  <el-input-number :min="0" @focus="$event.target.select()" style="width: 98%;" :controls="false" v-model="row['75']"/>
                </template>
              </el-table-column>
              <el-table-column label="80" prop="80">
                <template slot-scope="{row}">
                  <el-input-number :min="0" @focus="$event.target.select()" style="width: 98%;" :controls="false" v-model="row['80']"/>
                </template>
              </el-table-column>
              <el-table-column label="100" prop="100">
                <template slot-scope="{row}">
                  <el-input-number :min="0" @focus="$event.target.select()" style="width: 98%;" :controls="false" v-model="row['100']"/>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
          <el-col :span="24">
            <el-form-item class="mulline-label" label="结果描述和缺陷分析" prop="resultEscription">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入内容"
                v-model="detailForm.resultEscription">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <div class="headLine">
              <div class="headLine-title">其他信息</div>
            </div>
          </el-col>
          <el-col :span="12">
            <el-form-item label="X原料编号">
              <el-input v-model="detailForm.xrawNo" disabled/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="X取出重量g" prop="xoutWeight">
              <el-input-number v-model="detailForm.xoutWeight" :min="0" @focus="$event.target.select()" :controls="false"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="X等级" prop="xlevel">
              <el-select v-model="detailForm.xlevel">
                <el-option v-for="(item, index) in xlevelMap" :key="index" :value="item.value" :label="item.label"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="X结晶等级" prop="xcrystalLevel">
              <el-select v-model="detailForm.xcrystalLevel">
                <el-option v-for="(item, index) in xcrystalLevelMap" :key="index" :value="item.value" :label="item.label"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="X结晶重量g" prop="xcrystalWeight">
              <el-input-number v-model="detailForm.xcrystalWeight" :min="0" :precision="1" @focus="$event.target.select()" :controls="false"></el-input-number>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="XX中心结晶厚度" prop="xxCenter">
              <el-input-number v-model="detailForm.xxCenter" :min="0" @focus="$event.target.select()" :controls="false"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="XX边缘结晶厚度" prop="xxEdge">
              <el-input-number v-model="detailForm.xxEdge" :min="0" @focus="$event.target.select()" :controls="false"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="限位环厚度腐蚀">
              <div class="c-corrosion">
                <el-input-number v-model="detailForm.corrosionXwhThickness1" :min="0" :precision="2" @focus="$event.target.select()" :controls="false" placeholder="数值1"/>
                <el-input-number v-model="detailForm.corrosionXwhThickness2" :min="0" :precision="2" @focus="$event.target.select()" :controls="false" placeholder="数值2"/>
                <el-input-number v-model="detailForm.corrosionXwhThickness3" :min="0" :precision="2" @focus="$event.target.select()" :controls="false" placeholder="数值3"/>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="限位环宽度腐蚀mm">
              <div class="c-corrosion">
                <el-input-number v-model="detailForm.corrosionXwhWidth1" :min="0" :precision="2" @focus="$event.target.select()" :controls="false" placeholder="数值1"/>
                <el-input-number v-model="detailForm.corrosionXwhWidth2" :min="0" :precision="2" @focus="$event.target.select()" :controls="false" placeholder="数值2"/>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="顶盖结晶情况" prop="corrosionDhjj">
              <el-input v-trim v-model="detailForm.corrosionDhjj" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="限位环腐蚀速率" prop="corrosionXwhRate">
              <el-input-number v-model="detailForm.corrosionXwhRate" :min="0" @focus="$event.target.select()" :controls="false"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="段2腐蚀速率" prop="paragraphTwoRate">
              <el-input-number v-model="detailForm.paragraphTwoRate" :min="0" @focus="$event.target.select()" :controls="false"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="段2出炉情况">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入内容"
                v-model="detailForm.paragraphTwoDesc">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="C段2等级" prop="ccAccessSegTwoGrade">
              <el-select v-model="detailForm.ccAccessSegTwoGrade">
                <el-option v-for="item in gradeMap" :key="item.name" :label="item.name" :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="坩埚结晶情况" prop="xcorrosion">
              <el-input v-model="detailForm.xcorrosion" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="#状态一" prop="status1">
              <el-input v-trim v-model="detailForm.status1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="#状态二" prop="status2">
              <el-input v-trim v-model="detailForm.status2" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="#状态二" prop="status3">
              <el-input v-trim v-model="detailForm.status3" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生长后小坩埚重量g" prop="xsmallCrucibleWeight">
              <el-input-number v-model="detailForm.xsmallCrucibleWeight" :min="0" :precision="2" @focus="$event.target.select()" :controls="false"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="小坩埚满2(g)" prop="crucibleFull1">
              <el-input-number v-model="detailForm.crucibleFull1" :min="0" :precision="2" :controls="false" @focus="$event.target.select()"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="小坩埚满3(g)" prop="crucibleFull2">
              <el-input-number v-model="detailForm.crucibleFull2" :min="0" :precision="2" :controls="false" @focus="$event.target.select()"/>
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
            <el-form-item label="添加附件" prop="_imageList">
              <!-- 图片 -->
              <PhotoNew
                v-model="detailForm._imageList"
                @input="handleImageChange"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <!--  晶体图示-画板  -->
    <Fabric
      :dialogVisible.sync="dialogVisible"
      :backGroundImg="fabricRound"
      :fabricFromJson.sync="detailForm._crystalIcon_fabric"
      @getfabricFromJson="getfabricFromJson"
    />

    <!--  晶体厚度-画板  -->
    <FabricThickness
      :dialogVisible.sync="thicknessVisible"
      :backGroundImg="textRound"
      :fabricFromJson.sync="detailForm._adjustmentDirectionHb_fabric"
      :thicknessForm.sync="thicknessForm"
      @getfabricFromJson="getThicknessJson"
    />
  </div>
</template>

<script>
import {getSeleteData} from '@/utils/select.js'
import ObtainInput from '@/views/components/obtainInput';
import PhotoNew from "@/views/components/photoNew.vue";
import Fabric from "@/views/components/Fabric.vue";
import FabricThickness from "@/views/components/FabricThickness.vue";
import fabricRound from '@/assets/page_imgs/fabricRound.png'
import textRound from '@/assets/page_imgs/text-round.png'
import {fetchCrystalAssemble, fetchCrystalInstall} from "@/api/seedCrystal";
import {uploadImage} from "@/api/file";
import {base64ToBlob} from "@/utils";
import {round} from "lodash-es";

const defaultForm = {
  mark: '',
  xlevel: '',
  xoutWeight: undefined,
  xcrystalLevel: '', // X结晶等级
  xcrystalWeight: undefined, // X结晶重量g
  xxCenter: undefined,
  xxEdge: undefined,
  corrosionXwhThickness1: undefined, // 限位环厚度腐蚀1
  corrosionXwhThickness2: undefined, // 限位环厚度腐蚀2
  corrosionXwhThickness3: undefined, // 限位环厚度腐蚀3
  corrosionXwhWidth1: undefined, // 限位环宽度腐蚀1
  corrosionXwhWidth2: undefined, // 限位环宽度腐蚀2
  corrosionDhjj: '', // 顶盖结晶情况
  corrosionXwhRate: undefined, // 限位环腐蚀速率
  paragraphTwoRate: undefined, // 段2腐蚀速率
  paragraphTwoDesc: '', // 段2出炉情况
  ccAccessSegTwoGrade: null, //	C段2等级
  xcorrosion: null, // 坩埚结晶情况
  status1: null, //	#状态一
  status2: null, //	#状态二
  status3: null, //	#状态三
  xsmallCrucibleWeight: undefined, //	生长后小坩埚重量g
  crucibleFull1: undefined, // 小坩埚满2(g)
  crucibleFull2: undefined, // 小坩埚满3(g)
  resultEscription: '',
  adjustmentDirection: '',
  crystalIcon: '',
  backHighlight: '',
  minorDiameter: undefined, // 小面直径mm
  gap: '', // 顶盖间隙mm
  _gap1: '',
  _gap2: '',
  maxDiameter: undefined, // 最大直径
  minDiameter: undefined, // 最小直径
  crystalDesc: '', // 晶体表面等级
  polycrystallineDiameter: undefined,
  transitionDiameter: '无',
  growthRatel: '', // 生长速率(重量)
  growthRate: '', // 生长速率(高度)
  growthWeight: undefined,
  growthTime: undefined, // 生长时间
  evaporation: '', // 失重蒸发比%
  _growthTotalWeight_g: undefined,
  growthTotalWeight: undefined,
  adjustmentDirectionHb: "", // 晶体厚度
  _growthTopWeight_g: undefined,
  growthTopWeight: undefined,
  annex: '[]',
  _imageList: [], // 附件
}
export default {
  name: 'CrystalKL',
  props: {
    fromData: {
      type: Object,
      require: true
    }
  },
  components: {
    PhotoNew,
    ObtainInput,
    Fabric,
    FabricThickness,
  },
  data() {
    return {
      detailInfo: {}, // 描述信息
      accessCoverWeight: 0, // 生长前重量(籽晶盖重量)
      fullSet: 0, // 生长前全套重
      convexityMeasure: [
        {"0":0,"20":0,"40":0,"60":0,"70":0,"75":0,"80":0,"100":0,"val":"实测"},
        {"0":0,"20":0,"40":0,"60":0,"70":0,"75":0,"80":0,"100":0,"val":"品控"}
      ],
      xlevelMap: [], // X等级 list
      xcrystalLevelMap: [], // X结晶等级 list
      transitionDiameterMap: [], // 相变直径 list
      crystalDescMap: ['P1', 'P2', 'P3', 'P4'], // 晶体表面等级 list
      gradeMap: [], // C段2等级
      detailForm: Object.assign({}, JSON.parse(JSON.stringify(defaultForm))),
      dialogVisible: false,
      thicknessVisible: false,
      fabricRound,
      textRound,
      field: '',
      thicknessForm: {},
      rules: {
        mark:[{required: true, message: "必填项", trigger: "blur"}],
        corrosionDhjj:[{required:true,message:"必填项",trigger:"change"}],
        xlevel:[{required:true,message:"必选项",trigger:"change"}],
        xcrystalLevel:[{required:true,message:"必选项",trigger:"change"}],
        xoutWeight:[{required:true,message:"必填项",trigger:"blur"}],
        xxCenter:[{required:true,message:"必填项",trigger:"change"}],
        xxEdge:[{required:true,message:"必填项",trigger:"change"}],
        resultEscription:[{required:true,message:"必填项",trigger:"blur"}],
        crystalIcon:[{required:true,message:"必填项",trigger:"blur"}],
        backHighlight:[{required:true,message:"必填项",trigger:"blur"}],
        minorDiameter:[{required:true,message:"必填项",trigger:"blur"}],
        _gap1:[{required:true,message:"必填项",trigger:"blur"}],
        _gap2:[{required:true,message:"必填项",trigger:"blur"}],
        maxDiameter:[{required:true,message:"必填项",trigger:"blur"}],
        minDiameter:[{required:true,message:"必填项",trigger:"blur"}],
        crystalDesc:[{required:true,message:"必选项",trigger:"change"}],
        polycrystallineDiameter:[{required:true,message:"必填项",trigger:"blur"}],
        transitionDiameter:[{required:true,message:"必选项",trigger:"change"}],
        growthTime:[{required:true,message:"必填项",trigger:"blur"}],
        _growthTotalWeight_g:[{required:true,message:"必填项",trigger:"blur"}],
        _growthTopWeight_g:[{required:true,message:"必填项",trigger:"blur"}],
        _imageList:[{type: 'array',required:true,message:"请添加附件",trigger:"change"}],
      },
    }
  },
  computed: {
    // 计算 失重蒸发比%
    calcEvaporation() {
      const { growthTotalWeight, growthWeight } = this.detailForm
      // 失重 = 生长前全套重 - 生长后全套重
      const loss = this.fullSet - growthTotalWeight
      // 蒸发 = 失重 + 生长重量
      const evaporation = loss + growthWeight
      // 失重蒸发比% = 失重 / 蒸发 * 100%
      let rate = loss / evaporation * 100
      if (rate === Infinity || isNaN(rate)) rate = 0
      return Number(rate.toFixed())
    },
    calcGrowthRatel() {
      // 生长速率(重量)g/h = 生长重量kg * 1000 / 生长时间
      const { growthWeight, growthTime } = this.detailForm
      let rate = growthWeight * 1000 / growthTime
      if (rate === Infinity || isNaN(rate)) rate = 0
      return Number(rate.toFixed(2))
    },
    calcGrowthRate() {
      // 生长速率(高度) = (0度 - 0.5) / 生长时间 * 1000
      const { growthTime } = this.detailForm
      let rate = Math.abs(this.convexityMeasure[0][0] - 0.5) / growthTime * 1000
      if (rate === Infinity || isNaN(rate)) rate = 0
      return Number(rate.toFixed(2))
    }
  },
  watch: {
    'detailForm.growthTopWeight': function() {
      // 生长重量 = 生长后盖重- 生长前盖重
      let growthWeight = this.detailForm.growthTopWeight - this.accessCoverWeight
      if (isNaN(growthWeight)) growthWeight = 0
      this.detailForm.growthWeight = round(growthWeight, 4)
    },
  },
  mounted() {
    getSeleteData('transitionDiameter', this.transitionDiameterMap) // 相变直径 list
    getSeleteData('ccAccessSegTwoGrade', this.gradeMap) // C段2等级
    getSeleteData('xlevel', this.xlevelMap) // X等级
    getSeleteData('xcrystalLevel', this.xcrystalLevelMap) // X结晶等级
    // this.getDetail()

  },
  methods: {
    // public方法, 在父级调用
    // 获取填写验证
    async getRules(type) {
      let { _crystalIcon_img, _adjustmentDirectionHb_img, _gap1, _gap2, _imageList, ...form } = this.detailForm
      if (type) {
        // 提交时
        try {
          await this.$refs['KLForm'].validate()
        } catch (e) {
          this.$message.warning('请完善数据!')
          return Promise.reject(false)
        }
        delete form._crystalIcon_fabric
        delete form._adjustmentDirectionHb_fabric
      }

      form.growthRatel = this.calcGrowthRatel // 生长速率(重量)
      form.growthRate = this.calcGrowthRate // 生长速率(高度)
      form.evaporation = this.calcEvaporation // 失重蒸发比%
      form.gap = `${_gap1 || ''}-${_gap2 || ''}` // 顶盖间隙
      form.convexityMeasurement = JSON.stringify(this.convexityMeasure) // 凸度测量
      form._thicknessForm = this.thicknessForm
      form.annex = JSON.stringify(_imageList) // 附件
      delete form._imageList
      return form
    },
    //获取详情
    getDetail() {
      this.detailForm = Object.assign({}, JSON.parse(JSON.stringify(defaultForm)), this.fromData)
      const { convexityMeasurement, annex, _thicknessForm } = this.detailForm
      //凹度测量数据复原
      if (convexityMeasurement) {
        this.convexityMeasure = JSON.parse(convexityMeasurement)
      }
      if (this.convexityMeasure.length === 0) {
        const keyList = ['0', '20', '40', '60', '70', '75', '80', '100']
        const valList = [{val: '实测'}, {val: '品控'}]
        this.convexityMeasure = []
        valList.forEach((item, i) => {
          keyList.forEach(element => {
            item[element] = 0
          })
          this.convexityMeasure.push(item)
        })
      }
      if (annex) {
        this.detailForm._imageList = JSON.parse(annex)
      }
      if (_thicknessForm) {
        this.thicknessForm = _thicknessForm
      }
      this.$forceUpdate()

      // 查询生长前重量
      this.fetchCrystalInstall()
      // this.fetchCrystalAssemble()

      this.$nextTick(() => {
        this.$refs.KLForm.clearValidate()
      })
    },
    //处理画板数据
    getCrystalIcon() {
      this.field = 'crystalIcon'
      this.dialogVisible = true
    },
    //画板数据回填
    getfabricFromJson(fabricFromJson, imgBase64) {
      this.detailForm._crystalIcon_fabric = fabricFromJson
      if (this.detailForm._crystalIcon_img !== imgBase64) {
        this.detailForm._crystalIcon_img = imgBase64
        this.uploadImage(imgBase64)
      }
    },
    getThickness() {
      this.field = 'adjustmentDirectionHb'
      this.thicknessVisible = true
    },
    //画板数据回填
    getThicknessJson(fabricFromJson, imgBase64) {
      this.detailForm._adjustmentDirectionHb_fabric = fabricFromJson
      if (this.detailForm._adjustmentDirectionHb_img !== imgBase64) {
        this.detailForm._adjustmentDirectionHb_img = imgBase64
        this.uploadImage(imgBase64)
      }
    },
    uploadImage(imgBase64) {
      const data = new FormData()
      const base64String = imgBase64.replace('data:image/png;base64,', '')
      const blob = base64ToBlob(base64String, 'explain.png')
      data.append('file', blob, 'explain.png')
      this.detailForm[this.field] = ''
      uploadImage(data).then(res => {
        const imageBaseUrl = process.env.BASE_API_FILEPREVIEW
        this.detailForm[this.field] = imageBaseUrl + res.data.bigurl
        this.$nextTick(() => {
          this.$refs.KLForm.validateField(this.field)
        })
      })
    },
    fetchCrystalInstall() {
      const lotNo = this.$route.query.processingOrderCode
      fetchCrystalInstall(lotNo).then(res => {
        // 生长前重量(籽晶盖重量)
        this.accessCoverWeight = res.data.accessCoverWeight
        // 生长前全套重
        this.fullSet = res.data.fullSet
      })
    },
    handleImageChange(list) {
      if (list && list.length) {
        this.$refs.KLForm.validateField('_imageList')
      }
    },
    handleGrowthTopBlur() {
      // g 转换为 kg
      const kg = this.detailForm._growthTopWeight_g / 1000
      this.$set(this.detailForm, 'growthTopWeight', round(kg, 4) || 0)
    },
    handleGrowthTotalBlur() {
      // g 转换为 kg
      const kg = this.detailForm._growthTotalWeight_g / 1000
      this.$set(this.detailForm, 'growthTotalWeight', round(kg, 4) || 0)
    },
    // fetchCrystalAssemble() {
    //   const lotNo = this.$route.query.processingOrderCode
    //   fetchCrystalAssemble(lotNo).then(res => {
    //   })
    // },
  }
}
</script>
<style lang="scss" scoped>
.el-input-number,
.el-select {
  width: 100%;
}
.c-corrosion {
  display: flex;
  .el-input-number {
    flex: 1;
  }
  /deep/ input {
    padding-right: 0 !important;
  }
}
</style>
