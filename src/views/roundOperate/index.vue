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
          <div class="headLine-title">{{ storageLabel }}数据录入</div>
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
                label="滚圆实测直径头"
                prop="circleDiameterHead"
                label-width="140px"
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
                label="滚圆实测直径尾"
                prop="circleDiameterTail"
                label-width="140px"
              >
                <el-input
                  v-model="formData.circleDiameterTail"
                  type="number"
                  v-direction="{ x: 2, y: 3 }"
                >
                  <template slot="append">mm</template>
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
import { cloneDeep, round } from "lodash-es";
import moment from "moment";
import overStation from "@/mixins/overStation";
import PrintDialog from "@/components/PrintDialog/index.vue";

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
  },
  created() {
    this.initKeyup();
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      let fromData = {};
      // 查询保存的数据
      const res = await Api.fetchBuffer(this.buffParams);
      if (res.data) {
        fromData = res.data;
      } else {
        try {
          fromData = JSON.parse(this.$route.query.fromData);
        } catch (e) {
          console.log(e);
        }
      }

      this.formData = Object.assign({}, defaultForm, fromData);
      this.initLength();
      this.calcDegreesMinute();
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
      this.formData.crystalDeviation = (
        Math.sqrt(
          Math.pow(crystallinePhaseA - crystallinePhaseC, 2) +
            Math.pow(crystallinePhaseB - crystallinePhaseD, 2)
        ) / 2
      ).toFixed(2);
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

      this.formData.crystalDeviation = (
        Math.sqrt(
          Math.pow(crystallinePhaseA - crystallinePhaseC, 2) +
            Math.pow(crystallinePhaseB - crystallinePhaseD, 2)
        ) / 2
      ).toFixed(2);
    },
    formatDegree(value) {
      value = Math.abs(value);
      let v1 = Math.floor(value);
      let v2 = Math.floor((value - v1) * 60);
      return [v1, v2];
    },
    formatCrystallinePhase(degrees, minute) {
      return (Number(degrees) + Number(minute) / 60).toFixed(4);
    },
    // 操作
    handle(typeName) {
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
        this.$refs.formData.validate((valid) => {
          if (valid) {
            this.$confirm("确认提交当前操作数据?", "提示", {
              type: "warning",
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
</style>