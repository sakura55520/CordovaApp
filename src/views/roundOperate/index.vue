<!--滚圆-->
<template>
  <div class="detailBox">
    <!-- 顶部信息卡片 -->
    <div class="topInfoCard">
      <div class="grid-container">
        <div class="grid-item">
          <span class="grid-item-name">批次号：</span>
          <span class="grid-item-value">{{ formData.processOrderCode }}</span>
          <span class="end" v-if="isEnd">END</span>
        </div>
        <div class="grid-item" v-if="productionEquipment">
          <span class="grid-item-name">生产设备：</span>
          <span class="grid-item-value">{{ productionEquipment }}</span>
        </div>
        <div class="grid-item" v-if="executionEquipment">
          <span class="grid-item-name">执行设备：</span>
          <span class="grid-item-value">{{ executionEquipment }}</span>
        </div>
      </div>
    </div>

    <div class="fromCard">
      <div class="fromCard">
        <div class="headLine">
          <div class="headLine-title">
            {{ storageLabel }}数据录入<i
              class="el-icon-refresh refresh"
              @click="refresh"
            />
          </div>
        </div>
        <el-form
          ref="formData"
          :model="formData"
          label-width="150px"
          :rules="formRules"
          inline
          :disabled="$route.query.view"
        >
          <div>
            <el-form-item label="操作者">
              <el-input v-model="formData.userCreate" disabled />
            </el-form-item>
            <el-form-item label="" class="item">
              <el-button
                type="primary"
                size="small"
                class="print-btn"
                @click="handlePrint(formData.processOrderCode)"
                >小标签打印</el-button
              >
            </el-form-item>
          </div>

          <div class="headLine">
            <div class="headLine-title">设备/工艺参数确认</div>
          </div>
          <div class="form-container">
            <div class="row">
              <el-form-item
                label="计划长度"
                prop="planLength"
                label-width="90px"
              >
                <el-input v-model="formData.planLength" type="number" disabled>
                  <template slot="append">mm</template>
                </el-input>
              </el-form-item>
              <el-form-item
                label="检测实测长度"
                prop="originLength"
                label-width="120px"
              >
                <el-input
                  v-model="formData.originLength"
                  type="number"
                  @input="calcQualifLength"
                  v-direction="{ x: 1, y: 1 }"
                >
                  <template slot="append">mm</template>
                </el-input>
              </el-form-item>
              <el-form-item
                label="崩边长度"
                prop="chippingLength"
                label-width="90px"
              >
                <el-input
                  v-model="formData.chippingLength"
                  type="number"
                  @input="calcQualifLength"
                  v-direction="{ x: 2, y: 1 }"
                >
                  <template slot="append">mm</template>
                </el-input>
              </el-form-item>
              <el-form-item
                label="椭圆长度"
                prop="ellipticLength"
                label-width="90px"
              >
                <el-input
                  v-model="formData.ellipticLength"
                  type="number"
                  @input="calcQualifLength"
                  v-direction="{ x: 3, y: 1 }"
                >
                  <template slot="append">mm</template>
                </el-input>
              </el-form-item>
              <el-form-item
                label="合格长度"
                prop="qualifiedLength"
                label-width="90px"
              >
                <el-input
                  v-model="formData.qualifiedLength"
                  type="number"
                  disabled
                >
                  <template slot="append">mm</template>
                </el-input>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item
                label="A点晶向"
                class="multiple-form-item"
                label-width="90px"
              >
                <template slot="label">
                  <div class="multiple-form-item-label">A点晶向</div>
                </template>
                <div class="inputs">
                  <el-form-item label="" prop="aDegrees">
                    <el-input
                      v-model="formData.aDegrees"
                      @change="calcCrystallinePhase"
                      v-direction="{ x: 1, y: 2 }"
                      @input="handleNext"
                    >
                      <template slot="append">°</template>
                    </el-input>
                  </el-form-item>
                  <el-form-item label="" prop="aMinute">
                    <el-input
                      v-model="formData.aMinute"
                      @change="calcCrystallinePhase"
                      v-direction="{ x: 2, y: 2 }"
                      @input="handleNext"
                    >
                      <template slot="append">'</template>
                    </el-input>
                  </el-form-item>
                </div>
              </el-form-item>
              <el-form-item
                label="B点晶向"
                prop="crystallinePhaseB"
                class="multiple-form-item"
                label-width="90px"
              >
                <template slot="label">
                  <div class="multiple-form-item-label">B点晶向</div>
                </template>
                <div class="inputs">
                  <el-form-item label="" prop="bDegrees">
                    <el-input
                      v-model="formData.bDegrees"
                      @change="calcCrystallinePhase"
                      v-direction="{ x: 3, y: 2 }"
                      @input="handleNext"
                    >
                      <template slot="append">°</template>
                    </el-input>
                  </el-form-item>
                  <el-form-item label="" prop="bMinute">
                    <el-input
                      v-model="formData.bMinute"
                      @change="calcCrystallinePhase"
                      v-direction="{ x: 4, y: 2 }"
                      @input="handleNext"
                    >
                      <template slot="append">'</template>
                    </el-input>
                  </el-form-item>
                </div>
              </el-form-item>
              <el-form-item
                label="C点晶向"
                prop="crystallinePhaseC"
                class="multiple-form-item"
                label-width="90px"
              >
                <template slot="label">
                  <div class="multiple-form-item-label">C点晶向</div>
                </template>
                <div class="inputs">
                  <el-form-item label="" prop="cDegrees">
                    <el-input
                      v-model="formData.cDegrees"
                      @change="calcCrystallinePhase"
                      v-direction="{ x: 5, y: 2 }"
                      @input="handleNext"
                    >
                      <template slot="append">°</template>
                    </el-input>
                  </el-form-item>
                  <el-form-item label="" prop="cMinute">
                    <el-input
                      v-model="formData.cMinute"
                      @change="calcCrystallinePhase"
                      v-direction="{ x: 6, y: 2 }"
                      @input="handleNext"
                    >
                      <template slot="append">'</template>
                    </el-input>
                  </el-form-item>
                </div>
              </el-form-item>
              <el-form-item
                label="D点晶向"
                prop="crystallinePhaseD"
                class="multiple-form-item"
                label-width="90px"
              >
                <template slot="label">
                  <div class="multiple-form-item-label">D点晶向</div>
                </template>
                <div class="inputs">
                  <el-form-item label="" prop="dDegrees">
                    <el-input
                      v-model="formData.dDegrees"
                      @change="calcCrystallinePhase"
                      v-direction="{ x: 7, y: 2 }"
                      @input="handleNext"
                    >
                      <template slot="append">°</template>
                    </el-input>
                  </el-form-item>
                  <el-form-item label="" prop="dMinute">
                    <el-input
                      v-model="formData.dMinute"
                      @change="calcCrystallinePhase"
                      v-direction="{ x: 8, y: 2 }"
                      @input="handleNext"
                    >
                      <template slot="append">'</template>
                    </el-input>
                  </el-form-item>
                </div>
              </el-form-item>
              <el-form-item
                label="晶向偏差"
                prop="crystalDeviation"
                label-width="90px"
                class="item"
              >
                <el-input v-model="formData.crystalDeviation" disabled>
                  <template slot="append">°</template>
                </el-input>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item
                label="滚圆实测直径min"
                prop="circleDiameterHead"
                label-width="160px"
              >
                <el-input
                  v-model="formData.circleDiameterHead"
                  type="number"
                  v-direction="{ x: 1, y: 3 }"
                >
                  <template slot="append">mm</template>
                </el-input>
              </el-form-item>
              <el-form-item
                label="滚圆实测直径max"
                prop="circleDiameterTail"
                label-width="160px"
              >
                <el-input
                  v-model="formData.circleDiameterTail"
                  type="number"
                  v-direction="{ x: 2, y: 3 }"
                >
                  <template slot="append">mm</template>
                </el-input>
              </el-form-item>
              <el-form-item label="偏离量mm" label-width="120px">
                <el-input
                  v-model="formData.deviation"
                  type="number"
                  clearable
                />
              </el-form-item>
              <el-form-item label="偏离扣减" label-width="100px">
                <el-input
                  v-model="formData.crystalPhaseReduction"
                  type="number"
                  disabled
                >
                  <template slot="append">mm</template>
                </el-input>
              </el-form-item>
              <el-form-item label="未滚出长度" label-width="100px">
                <el-input v-model="formData.unRolledLen" type="number">
                  <template slot="append">mm</template>
                </el-input>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item
                label="工单编号"
                prop="workOrderNo"
                label-width="90px"
              >
                <el-input v-model="formData.workOrderNo" disabled> </el-input>
              </el-form-item>
              <el-form-item
                label="产品类别"
                prop="productCategory"
                label-width="90px"
              >
                <el-input v-model="formData.productCategory" disabled>
                </el-input>
              </el-form-item>
              <el-form-item label="mm直径" prop="diametermm" label-width="90px">
                <el-input v-model="formData.diametermm" disabled>
                  <template slot="append">mm</template>
                </el-input>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item
                label="籽晶类型"
                prop="seedCrystal"
                label-width="90px"
              >
                <el-input v-model="formData.seedCrystal" disabled> </el-input>
              </el-form-item>
              <el-form-item
                label="晶向偏离"
                prop="crystalOrientationOffset"
                label-width="90px"
              >
                <el-input v-model="formData.crystalOrientationOffset" disabled>
                </el-input>
              </el-form-item>
              <el-form-item
                label="参考面类型"
                prop="referenceSurfaceType"
                label-width="120px"
              >
                <el-input v-model="formData.referenceSurfaceType" disabled>
                </el-input>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item
                label="主参"
                prop="mainReferenceSurfaceLength"
                label-width="90px"
              >
                <el-input
                  v-model="formData.mainReferenceSurfaceLength"
                  disabled
                >
                </el-input>
              </el-form-item>
              <el-form-item
                label="主参考面偏差"
                prop="mainReferenceSurfaceOffset"
                label-width="120px"
              >
                <el-input
                  v-model="formData.mainReferenceSurfaceOffset"
                  disabled
                >
                </el-input>
              </el-form-item>
              <el-form-item
                label="主参考面位置"
                prop="mainReferenceSurfaceSite"
                label-width="120px"
              >
                <el-input v-model="formData.mainReferenceSurfaceSite" disabled>
                </el-input>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item
                label="副参"
                prop="secondReferenceSurfaceLength"
                label-width="90px"
              >
                <el-input
                  v-model="formData.secondReferenceSurfaceLength"
                  disabled
                >
                </el-input>
              </el-form-item>
              <el-form-item
                label="副参考面偏差"
                prop="secondReferenceSurfaceOffset"
                label-width="120px"
              >
                <el-input
                  v-model="formData.secondReferenceSurfaceOffset"
                  disabled
                >
                </el-input>
              </el-form-item>
              <el-form-item
                label="副参考面位置"
                prop="secondReferenceSurfaceSite"
                label-width="120px"
              >
                <el-input
                  v-model="formData.secondReferenceSurfaceSite"
                  disabled
                >
                </el-input>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item
                label="三参"
                prop="thirdReferenceSurfaceLength"
                label-width="90px"
              >
                <el-input
                  v-model="formData.thirdReferenceSurfaceLength"
                  disabled
                >
                </el-input>
              </el-form-item>
              <el-form-item
                label="三参考面偏差"
                prop="thirdReferenceSurfaceOffset"
                label-width="120px"
              >
                <el-input
                  v-model="formData.thirdReferenceSurfaceOffset"
                  disabled
                >
                </el-input>
              </el-form-item>
              <el-form-item
                label="三参考面位置"
                prop="thirdReferenceSurfaceSite"
                label-width="120px"
              >
                <el-input v-model="formData.thirdReferenceSurfaceSite" disabled>
                </el-input>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item
                label="四参"
                prop="fourthReferenceSurfaceLength"
                label-width="90px"
              >
                <el-input
                  v-model="formData.fourthReferenceSurfaceLength"
                  disabled
                >
                </el-input>
              </el-form-item>
              <el-form-item
                label="四参考面偏差"
                prop="fourthReferenceSurfaceOffset"
                label-width="120px"
              >
                <el-input
                  v-model="formData.fourthReferenceSurfaceOffset"
                  disabled
                >
                </el-input>
              </el-form-item>
              <el-form-item
                label="四参考面位置"
                prop="fourthReferenceSurfaceSite"
                label-width="120px"
              >
                <el-input
                  v-model="formData.fourthReferenceSurfaceSite"
                  disabled
                >
                </el-input>
              </el-form-item>
            </div>
            <div class="form">
              <div class="form-title">参数说明</div>
              <div class="row">合格长度计算公式：<br /></div>
              <div class="row">
                合格长度（{{ formData.qualifiedLength }} mm） = 检测实测长度（{{
                  formData.originLength
                }}
                mm） - 崩边长度（{{ formData.chippingLength }} mm） -
                椭圆长度（{{ formData.ellipticLength }} mm）<br />
              </div>
            </div>
          </div>
        </el-form>
      </div>
    </div>

    <!-- 页面操作 -->
    <div class="page-handle-box" v-if="!$route.query.view">
      <el-button class="cancel" @click="back(null, 'confirm')">取消</el-button>
      <el-button class="save" @click="handle('保存')">保存</el-button>
      <el-button class="submit" type="primary" @click="handle('提交')"
        >{{ storageLabel }}确认</el-button
      >
    </div>

    <!--弹窗: 打印组件-->
    <PrintDialog
      :visible.sync="printVisible"
      :print-data="printData"
      print-type="小标签"
    />
  </div>
</template>

<script>
import CodeScanner from "@/components/CodeScanner";
import SelectUserinfo from "@/components/select_userinfo";
import * as Api from "@/api/inStation";
import moment from "moment";
import overStation from "@/mixins/overStation";
import PrintDialog from "@/components/PrintDialog/index.vue";
import { getSeleteData } from "@/utils/select";
import { isEmpty } from "lodash-es";
import { getCurrentWipStorageClearData } from "@/api/overStation/overStation.js";

const defaultForm = {
  planLength: null, // 计划长度
  originLength: null, // 检测实测长度
  chippingLength: null, // 崩边长度
  ellipticLength: null, // 椭圆长度
  qualifiedLength: null, // 合格长度
  circleDiameterHead: null, // 滚圆实测直径头
  circleDiameterTail: null, // 滚圆实测直径尾
  crystallinePhaseA: null, // A点晶向
  crystallinePhaseB: null, // B点晶向
  crystallinePhaseC: null, // C点晶向
  crystallinePhaseD: null, // D点晶向
  aDegrees: null,
  bDegrees: null,
  cDegrees: null,
  dDegrees: null,
  aMinute: null,
  bMinute: null,
  cMinute: null,
  dMinute: null,
  crystalDeviation: null, //偏差
  deviation: null,
  crystalPhaseReduction: null,
  unRolledLen: null,
};

export default {
  name: "ChargeOperate",
  mixins: [overStation],
  components: {
    CodeScanner,
    SelectUserinfo,
    PrintDialog,
  },
  data() {
    return {
      formData: Object.assign({}, defaultForm), // 表单列表
      formRules: {
        planLength: [
          { required: true, message: "请输入计划长度", trigger: "change" },
        ],
        originLength: [
          { required: true, message: "请输入检测实测长度", trigger: "change" },
        ],
        chippingLength: [
          { required: true, message: "请输入崩边长度", trigger: "change" },
        ],
        ellipticLength: [
          { required: true, message: "请输入椭圆长度", trigger: "change" },
        ],
        qualifiedLength: [
          { required: true, message: "请输入合格长度", trigger: "change" },
        ],
        circleDiameterHead: [
          {
            required: true,
            message: "请输入滚圆实测直径头",
            trigger: "change",
          },
        ],
        circleDiameterTail: [
          {
            required: true,
            message: "请输入滚圆实测直径尾",
            trigger: "change",
          },
        ],
        aDegrees: [
          { required: true, message: "请输入A点晶向(度)", trigger: "change" },
        ],
        aMinute: [
          { required: true, message: "请输入A点晶向(分)", trigger: "change" },
        ],
        bDegrees: [
          { required: true, message: "请输入B点晶向(度)", trigger: "change" },
        ],
        bMinute: [
          { required: true, message: "请输入B点晶向(分)", trigger: "change" },
        ],
        cDegrees: [
          { required: true, message: "请输入C点晶向(度)", trigger: "change" },
        ],
        cMinute: [
          { required: true, message: "请输入C点晶向(分)", trigger: "change" },
        ],
        dDegrees: [
          { required: true, message: "请输入D点晶向(度)", trigger: "change" },
        ],
        dMinute: [
          { required: true, message: "请输入D点晶向(分)", trigger: "change" },
        ],
      },
      printVisible: false,
      printData: {},
      wipSwitches: [],
      deviationOptions: [],
    };
  },
  computed: {
    storageLabel() {
      return this.$route.query.wipStorageStatus === "1" ? "出站" : "进站";
    },
    buffParams() {
      const { processUuid, processingOrderCode } = this.$route.query;
      return { processUuid, processingOrderCode };
    },
    calcCrystalPhaseReduction() {
      let crystalPhaseReduction = 0;
      let crystalDeviation = this.formData.crystalDeviation;
      let deviation = this.formData.deviation;
      this.deviationOptions.forEach((item) => {
        let deviationMin = item.value.split("-")[0];
        let deviationMax = item.value.split("-")[1];
        let crystalDeviationMin = item.extendValue.split("-")[0];
        let crystalDeviationMax = item.extendValue.split("-")[1];

        if (deviation) {
          if (
            (deviationMin === "" ||
              Number(deviation) >= Number(deviationMin)) &&
            (deviationMax === "" || Number(deviation) < Number(deviationMax))
          )
            crystalPhaseReduction = item.extendValue1;
        } else {
          if (
            (crystalDeviationMin === "" ||
              Number(crystalDeviation) >= Number(crystalDeviationMin)) &&
            (crystalDeviationMax === "" ||
              Number(crystalDeviation) < Number(crystalDeviationMax))
          )
            crystalPhaseReduction = item.extendValue1;
        }
      });
      return crystalPhaseReduction;
    },
  },
  watch: {
    calcCrystalPhaseReduction: {
      immediate: true,
      deep: true,
      handler(val) {
        this.formData.crystalPhaseReduction = val;
      },
    },
  },
  created() {
    this.initKeyup();
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      getSeleteData("wipSwitches", this.wipSwitches);

      let fromData = {};
      // 查询保存的数据
      const res = await Api.fetchBuffer(this.buffParams);
      if (res.data) {
        const { deductionStatus, calculateDiameterb } = JSON.parse(
          this.$route.query.fromData
        );
        fromData = { ...res.data, deductionStatus, calculateDiameterb };
      } else {
        try {
          fromData = JSON.parse(this.$route.query.fromData);
        } catch (e) {
          console.log(e);
        }
      }

      this.formData = Object.assign({}, defaultForm, fromData);

      this.handleInitData();
    },
    async handleInitData() {
      this.initLength();
      this.calcDegreesMinute();

      const { deductionStatus, calculateDiameterb } = this.formData;
      if (deductionStatus == "是") {
        if (!calculateDiameterb)
          return this.$message.warning("计算直径(B工单)不存在");
        let deviationList = [];
        await getSeleteData("deviation_amount", deviationList);
        let deviationOptions = deviationList.filter(
          (item) => item.name == calculateDiameterb
        );
        if (isEmpty(deviationOptions))
          this.$message.warning("该计算直径未维护对应扣减关系");
        else this.deviationOptions = deviationOptions;
      }
    },
    initKeyup() {
      let direction = this.$getDirection();
      direction.on("keyup", function (e, val) {
        if (e.keyCode === 39) {
          direction.next();
        }
        if (e.keyCode === 37) {
          direction.previous();
        }
        if (e.keyCode === 38) {
          direction.previousLine();
        }
        if (e.keyCode === 40) {
          direction.nextLine();
        }
      });
    },
    initLength() {
      const { originLength, planLength, chippingLength, ellipticLength } =
        this.formData;
      this.formData.originLength = originLength || planLength || 0;
      this.formData.chippingLength = chippingLength || 0;
      this.formData.ellipticLength = ellipticLength || 0;
      this.formData.qualifiedLength = (
        this.formData.originLength -
        this.formData.chippingLength -
        this.formData.ellipticLength
      ).toFixed(2);
    },
    calcDegreesMinute() {
      const {
        crystallinePhaseA,
        crystallinePhaseB,
        crystallinePhaseC,
        crystallinePhaseD,
      } = this.formData;
      let aDegreesMinute = this.formatDegree(crystallinePhaseA);
      let bDegreesMinute = this.formatDegree(crystallinePhaseB);
      let cDegreesMinute = this.formatDegree(crystallinePhaseC);
      let dDegreesMinute = this.formatDegree(crystallinePhaseD);
      this.formData.aDegrees = aDegreesMinute[0];
      this.formData.aMinute = aDegreesMinute[1];
      this.formData.bDegrees = bDegreesMinute[0];
      this.formData.bMinute = bDegreesMinute[1];
      this.formData.cDegrees = cDegreesMinute[0];
      this.formData.cMinute = cDegreesMinute[1];
      this.formData.dDegrees = dDegreesMinute[0];
      this.formData.dMinute = dDegreesMinute[1];
      let result =
        Math.sqrt(
          Math.pow(crystallinePhaseA - crystallinePhaseC, 2) +
            Math.pow(crystallinePhaseB - crystallinePhaseD, 2)
        ) / 2;
      if (result + "" == NaN) this.formData.crystalDeviation = null;
      else this.formData.crystalDeviation = result.toFixed(2);
    },
    calcCrystallinePhase() {
      const {
        aDegrees,
        aMinute,
        bDegrees,
        bMinute,
        cDegrees,
        cMinute,
        dDegrees,
        dMinute,
      } = this.formData;

      let crystallinePhaseA = this.formatCrystallinePhase(aDegrees, aMinute);
      let crystallinePhaseB = this.formatCrystallinePhase(bDegrees, bMinute);
      let crystallinePhaseC = this.formatCrystallinePhase(cDegrees, cMinute);
      let crystallinePhaseD = this.formatCrystallinePhase(dDegrees, dMinute);
      this.formData.crystallinePhaseA = crystallinePhaseA;
      this.formData.crystallinePhaseB = crystallinePhaseB;
      this.formData.crystallinePhaseC = crystallinePhaseC;
      this.formData.crystallinePhaseD = crystallinePhaseD;
      let result =
        Math.sqrt(
          Math.pow(crystallinePhaseA - crystallinePhaseC, 2) +
            Math.pow(crystallinePhaseB - crystallinePhaseD, 2)
        ) / 2;
      if (result + "" == NaN) this.formData.crystalDeviation = null;
      else this.formData.crystalDeviation = result.toFixed(2);
    },
    formatDegree(value) {
      value = Math.abs(value);
      let v1 = Math.floor(value);
      let v2 = Math.round((value - v1) * 60);
      return [v1, v2];
    },
    formatCrystallinePhase(degrees, minute) {
      return (Number(degrees) + Number(minute) / 60).toFixed(4);
    },
    // 操作
    async handle(typeName) {
      this.formData.deviation = this.formData.deviation || null;
      this.formData.crystalPhaseReduction =
        this.formData.crystalPhaseReduction || 0;
      this.formData.unRolledLen = this.formData.unRolledLen || 0;
      const { ...form } = this.formData;
      const FormData = JSON.stringify({
        ...form,
      });
      if (typeName === "保存") {
        Api.upldateBuffer(this.buffParams, this.formData).then((res) => {
          const msg = "保存成功!";
          this.back(msg);
        });
      } else if (typeName === "提交") {
        const valid = await this.$refs.formData.validate();
        if (!valid) return;

        let wipSwitch = this.wipSwitches.find(
          (item) => item.name === "validateLengthSwitchRounding"
        );
        if (wipSwitch && wipSwitch.value === "打开") {
          let { originLength, planLength } = this.formData;
          let value = wipSwitch.extendValue;
          if (Math.abs(originLength - planLength) > value) {
            this.$message.warning(
              `检测实测长度与计划长度的差值不能超过${value}mm`
            );
            return;
          }
        }
        let text = "确认提交当前操作数据?";
        let crystallinePhaseCheckList = [];
        if (Number(this.formData.crystallinePhaseA) > 20)
          crystallinePhaseCheckList.push("<div>A点晶向大于20°</div>");
        if (Number(this.formData.crystallinePhaseB) > 20)
          crystallinePhaseCheckList.push("<div>B点晶向大于20°</div>");
        if (Number(this.formData.crystallinePhaseC) > 20)
          crystallinePhaseCheckList.push("<div>C点晶向大于20°</div>");
        if (Number(this.formData.crystallinePhaseD) > 20)
          crystallinePhaseCheckList.push("<div>D点晶向大于20°</div>");
        if (crystallinePhaseCheckList.length > 0) {
          text = "<div>以下数据超过上限，是否继续提交当前操作数据?</div>";
          text += crystallinePhaseCheckList.join(" ");
        }

        this.$confirm(text, "提示", {
          type: "warning",
          dangerouslyUseHTMLString: true,
        }).then(() => {
          const {
            equipmentCode,
            processUuid,
            processingOrderCode,
            wipStorageStatus,
          } = this.$route.query;
          Api.inOrOutStation({
            param: {
              FormData,
            },
            equipmentCode, // 设备
            processUuid, // 当前工序唯一标识
            processingOrderCode, // 工单号
            wipStorageStatus, // 进出站状态
          }).then(() => {
            const msg = `【${this.storageLabel}】操作成功`;
            Api.deleteBuffer(this.buffParams);
            this.back(msg);
          });
        });
      }
    },
    calcQualifLength() {
      let qualifiedLength = this.formData.originLength; // 检测实测长度
      qualifiedLength -= this.formData.chippingLength || 0; // 崩边长度
      qualifiedLength -= this.formData.ellipticLength || 0; // 椭圆长度
      this.formData.qualifiedLength = qualifiedLength.toFixed(2);
    },
    calcCrystalDeviation() {},
    handleNext(val) {
      if ((val + "").length >= 2) this.$getDirection().next();
    },
    handlePrint(code) {
      this.printData.data = code;
      this.printVisible = true;
    },
    handleDeviationClear() {
      this.formData.crystalPhaseReduction = null;
    },
    async refresh() {
      await this.$confirm(`请确认是否删除历史数据?`, "重新加载", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      });
      const res = await getCurrentWipStorageClearData(
        this.formData.processOrderCode
      );
      if (isEmpty(res.data)) return this.$message.warning("未查询到过站信息!");
      const fromData = res.data[0].fromData;
      this.formData = {
        ...this.formData,
        ...fromData,
      };
      this.handleInitData();
    },
  },
};
</script>
<style lang="scss" scoped>
.inputs {
  display: flex;
  gap: 8px;
}
.multiple-form-item /deep/ {
  flex: 1;
  margin-bottom: 0px !important;
  .el-form-item__label {
    height: 40px !important;
  }
}
.multiple-form-item-label:before {
  content: "* ";
  color: red;
}
.row /deep/ {
  display: flex;
  gap: 10px;
  width: 100%;
  justify-content: space-between;
  .item {
    flex: 1;
  }
  .el-input-group__append {
    padding: 0 5px;
  }
}
.form-container {
  padding: 20px 12px;
}
.form {
  margin-top: 20px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  min-height: 100px;
  padding: 20px 12px 12px;
  position: relative;
  display: flex;
  flex-wrap: wrap;
  gap: 2%;
  .item {
    width: 49%;
    .input {
      display: flex;
      gap: 8px;
      .value {
        flex: 1;
      }
      .unit {
        width: 30px;
      }
    }
  }
  .form-title {
    position: absolute;
    top: -10px;
    left: 20px;
    background: white;
  }
  .add-btn {
    position: absolute;
    right: 10px;
  }
}
.row {
  display: flex;
  gap: 10px;
  width: 100%;
  .item /deep/ {
    flex: 1;
    .el-input-group__append {
      padding: 0 5px;
    }
  }
}
.print-btn {
  float: right;
}

.refresh {
  color: #409eff;
  cursor: pointer;
}
</style>