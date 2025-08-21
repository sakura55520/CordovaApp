<template>
  <div class="scroller-flex-wrap">
    <div class="outStationExecution-container">
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
      <el-divider class="divider" />
      <h3>
        出站数据录入<i class="el-icon-refresh refresh" @click="refresh" />
      </h3>
      <div class="outStation-form">
        <el-form
          ref="formRef"
          :model="formData"
          label-position="left"
          label-width="200px"
          :rules="formRules"
          :disabled="$route.query.view"
        >
          <div class="base-form">
            <el-form-item label="操作者" prop="userCreate" class="item">
              <el-input v-model="formData.userCreate" disabled></el-input>
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
          <div class="form">
            <div class="form-title">设备/工艺参数确认</div>
            <div class="row">
              <el-form-item
                label="计划长度"
                prop="planLength"
                class="item"
                label-width="90px"
              >
                <div class="input">
                  <el-input
                    class="value"
                    v-model="formData.planLength"
                    disabled
                  >
                    <template slot="append">mm</template>
                  </el-input>
                </div>
              </el-form-item>
              <el-form-item
                label="检测实测长度"
                prop="originLength"
                class="item"
                label-width="120px"
              >
                <div class="input">
                  <el-input
                    class="value"
                    v-model="formData.originLength"
                    @input="handleLengthChange"
                    v-direction="{ x: 3, y: 1 }"
                  >
                    <template slot="append">mm</template>
                  </el-input>
                </div>
              </el-form-item>
              <el-form-item
                label="崩边长度"
                prop="chippingLength"
                class="item"
                label-width="90px"
              >
                <div class="input">
                  <el-input
                    class="value"
                    v-model="formData.chippingLength"
                    @input="handleLengthChange"
                    v-direction="{ x: 4, y: 1 }"
                  >
                    <template slot="append">mm</template>
                  </el-input>
                </div>
              </el-form-item>
              <el-form-item
                label="椭圆长度"
                prop="ellipticLength"
                class="item"
                label-width="90px"
              >
                <div class="input">
                  <el-input
                    class="value"
                    v-model="formData.ellipticLength"
                    @input="handleLengthChange"
                    v-direction="{ x: 5, y: 1 }"
                  >
                    <template slot="append">mm</template>
                  </el-input>
                </div>
              </el-form-item>
              <el-form-item
                label="合格长度"
                prop="qualifiedLength"
                class="item"
                label-width="90px"
              >
                <div class="input">
                  <el-input
                    class="value"
                    v-model="formData.qualifiedLength"
                    disabled
                  >
                    <template slot="append">mm</template>
                  </el-input>
                </div>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item
                label="实测主参考面晶向"
                prop="mainReferenceSurfaceCrystalOrientation"
                class="item"
                label-width="140px"
              >
                <div class="inputs">
                  <el-form-item
                    label=""
                    prop="mainReferenceSurfaceCrystalOrientationDegrees"
                  >
                    <el-input
                      v-model="
                        formData.mainReferenceSurfaceCrystalOrientationDegrees
                      "
                      v-direction="{ x: 1, y: 2 }"
                      @input="handleNext"
                    >
                      <template slot="append">°</template>
                    </el-input>
                  </el-form-item>
                  <el-form-item
                    label=""
                    prop="mainReferenceSurfaceCrystalOrientationMinute"
                  >
                    <el-input
                      v-model="
                        formData.mainReferenceSurfaceCrystalOrientationMinute
                      "
                      v-direction="{ x: 2, y: 2 }"
                      @input="handleNext"
                    >
                      <template slot="append">'</template>
                    </el-input>
                  </el-form-item>
                </div>
              </el-form-item>
              <el-form-item
                label="实测主参考面长度"
                prop="mainReferenceSurfaceLength"
                class="item"
                label-width="140px"
              >
                <div class="input">
                  <el-input
                    class="value"
                    v-model="formData.mainReferenceSurfaceLength"
                    v-direction="{ x: 3, y: 2 }"
                  >
                    <template slot="append">mm</template>
                  </el-input>
                </div>
              </el-form-item>
              <el-form-item
                label="实测主参考面宽度头"
                prop="mainReferenceSurfaceWidthHead"
                class="item"
                label-width="160px"
              >
                <div class="input">
                  <el-input
                    class="value"
                    v-model="formData.mainReferenceSurfaceWidthHead"
                    v-direction="{ x: 4, y: 2 }"
                  >
                    <template slot="append">mm</template>
                  </el-input>
                </div>
              </el-form-item>
              <el-form-item
                label="实测主参考面宽度尾"
                prop="mainReferenceSurfaceWidthTail"
                class="item"
                label-width="160px"
              >
                <div class="input">
                  <el-input
                    class="value"
                    v-model="formData.mainReferenceSurfaceWidthTail"
                    v-direction="{ x: 5, y: 2 }"
                  >
                    <template slot="append">mm</template>
                  </el-input>
                </div>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item
                label="主副侧夹角"
                prop="mainAuxiliaryAngle"
                class="item"
                label-width="95px"
              >
                <div class="inputs">
                  <el-form-item label="" prop="mainAuxiliaryAngleDegrees">
                    <el-input
                      v-model="formData.mainAuxiliaryAngleDegrees"
                      v-direction="{ x: 1, y: 3 }"
                      @input="handleNext"
                    >
                      <template slot="append">°</template>
                    </el-input>
                  </el-form-item>
                  <el-form-item label="" prop="mainAuxiliaryAngleMinute">
                    <el-input
                      v-model="formData.mainAuxiliaryAngleMinute"
                      v-direction="{ x: 2, y: 3 }"
                      @input="handleNext"
                    >
                      <template slot="append">'</template>
                    </el-input>
                  </el-form-item>
                </div>
              </el-form-item>
              <el-form-item
                label="实测副参考面长度"
                prop="auxiliaryReferenceSurfaceLength"
                class="item"
                label-width="140px"
              >
                <div class="input">
                  <el-input
                    class="value"
                    v-model="formData.auxiliaryReferenceSurfaceLength"
                    v-direction="{ x: 3, y: 3 }"
                  >
                    <template slot="append">mm</template>
                  </el-input>
                </div>
              </el-form-item>
              <el-form-item
                label="实测副参考面宽度头"
                prop="auxiliaryReferenceSurfaceHead"
                class="item"
                label-width="160px"
              >
                <div class="input">
                  <el-input
                    class="value"
                    v-model="formData.auxiliaryReferenceSurfaceHead"
                    v-direction="{ x: 4, y: 3 }"
                  >
                    <template slot="append">mm</template>
                  </el-input>
                </div>
              </el-form-item>
              <el-form-item
                label="实测副参考面宽度尾"
                prop="auxiliaryReferenceSurfaceTail"
                class="item"
                label-width="160px"
              >
                <div class="input">
                  <el-input
                    class="value"
                    v-model="formData.auxiliaryReferenceSurfaceTail"
                    v-direction="{ x: 5, y: 3 }"
                  >
                    <template slot="append">mm</template>
                  </el-input>
                </div>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item
                label="实测三参侧夹角"
                prop="thirdAngle"
                class="item"
                label-width="130px"
              >
                <div class="inputs">
                  <el-form-item label="" prop="thirdAngleDegrees">
                    <el-input
                      v-model="formData.thirdAngleDegrees"
                      v-direction="{ x: 1, y: 4 }"
                      @input="handleNext"
                    >
                      <template slot="append">°</template>
                    </el-input>
                  </el-form-item>
                  <el-form-item label="" prop="thirdAngleMinute">
                    <el-input
                      v-model="formData.thirdAngleMinute"
                      v-direction="{ x: 2, y: 4 }"
                      @input="handleNext"
                    >
                      <template slot="append">'</template>
                    </el-input>
                  </el-form-item>
                </div>
              </el-form-item>
              <el-form-item
                label="实测三参考面长度"
                prop="thirdReferenceSurfaceLength"
                class="item"
                label-width="140px"
              >
                <div class="input">
                  <el-input
                    class="value"
                    v-model="formData.thirdReferenceSurfaceLength"
                    v-direction="{ x: 3, y: 4 }"
                  >
                    <template slot="append">mm</template>
                  </el-input>
                </div>
              </el-form-item>
              <el-form-item
                label="实测三参考面宽度头"
                prop="thirdReferenceSurfaceWidthHead"
                class="item"
                label-width="160px"
              >
                <div class="input">
                  <el-input
                    class="value"
                    v-model="formData.thirdReferenceSurfaceWidthHead"
                    v-direction="{ x: 4, y: 4 }"
                  >
                    <template slot="append">mm</template>
                  </el-input>
                </div>
              </el-form-item>
              <el-form-item
                label="实测三参考面宽度尾"
                prop="thirdReferenceSurfaceWidthTail"
                class="item"
                label-width="160px"
              >
                <div class="input">
                  <el-input
                    class="value"
                    v-model="formData.thirdReferenceSurfaceWidthTail"
                    v-direction="{ x: 5, y: 4 }"
                  >
                    <template slot="append">mm</template>
                  </el-input>
                </div>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item
                label="实测四参侧夹角"
                prop="fourthAngle"
                class="item"
                label-width="130px"
              >
                <div class="inputs">
                  <el-form-item label="" prop="fourthAngleDegrees">
                    <el-input
                      v-model="formData.fourthAngleDegrees"
                      v-direction="{ x: 1, y: 5 }"
                      @input="handleNext"
                    >
                      <template slot="append">°</template>
                    </el-input>
                  </el-form-item>
                  <el-form-item label="" prop="fourthAngleMinute">
                    <el-input
                      v-model="formData.fourthAngleMinute"
                      v-direction="{ x: 2, y: 5 }"
                      @input="handleNext"
                    >
                      <template slot="append">'</template>
                    </el-input>
                  </el-form-item>
                </div>
              </el-form-item>
              <el-form-item
                label="实测四参考面长度"
                prop="fourthReferenceSurfaceLength"
                class="item"
                label-width="140px"
              >
                <div class="input">
                  <el-input
                    class="value"
                    v-model="formData.fourthReferenceSurfaceLength"
                    v-direction="{ x: 3, y: 5 }"
                  >
                    <template slot="append">mm</template>
                  </el-input>
                </div>
              </el-form-item>
              <el-form-item
                label="实测四参考面宽度头"
                prop="fourthReferenceSurfaceWidthHead"
                class="item"
                label-width="160px"
              >
                <div class="input">
                  <el-input
                    class="value"
                    v-model="formData.fourthReferenceSurfaceWidthHead"
                    v-direction="{ x: 4, y: 5 }"
                  >
                    <template slot="append">mm</template>
                  </el-input>
                </div>
              </el-form-item>
              <el-form-item
                label="实测四参考面宽度尾"
                prop="fourthReferenceSurfaceWidthTail"
                class="item"
                label-width="160px"
              >
                <div class="input">
                  <el-input
                    class="value"
                    v-model="formData.fourthReferenceSurfaceWidthTail"
                    v-direction="{ x: 5, y: 5 }"
                  >
                    <template slot="append">mm</template>
                  </el-input>
                </div>
              </el-form-item>
            </div>
            <div class="row">
              <div class="item">
                <el-row>
                  <el-col :span="6">
                    <el-form-item
                      label="V槽深度"
                      prop="vslotDepth"
                      label-width="80px"
                    >
                      <div class="input">
                        <el-input
                          class="value"
                          v-model="formData.vslotDepth"
                          v-direction="{ x: 1, y: 6 }"
                        >
                          <template slot="append">mm</template>
                        </el-input>
                      </div>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
          <div class="form">
            <div class="form-title">参数说明</div>
            <div class="row">合格长度计算公式：<br /></div>
            <div class="row">
              合格长度（{{ formData.qualifiedLength }} mm） = 检测实测长度（{{
                formData.originLength
              }}
              mm） - 崩边长度（{{ formData.chippingLength }} mm） - 椭圆长度（{{
                formData.ellipticLength
              }}
              mm）<br />
            </div>
          </div>
        </el-form>
      </div>
    </div>
    <div class="page-handle-box" v-if="!$route.query.view">
      <el-button class="cancel" @click="back(null, 'confirm')">取消</el-button>
      <el-button type="primary" plain class="save" @click="save"
        >保存</el-button
      >
      <el-button type="primary" class="submit" @click="confirm"
        >出站确认</el-button
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
import * as Api from "@/api/inStation";
import overStation from "@/mixins/overStation";
import PrintDialog from "@/components/PrintDialog/index.vue";
import { getSeleteData } from "@/utils/select";
import { getCurrentWipStorageClearData } from "@/api/overStation/overStation.js";
import { isEmpty } from "lodash-es";

export default {
  mixins: [overStation],
  components: {
    PrintDialog,
  },
  data() {
    return {
      formData: {
        userCreate: null,
        goodQty: null,
        scrapQty: null,
        planLength: null,
        originLength: null,
        chippingLength: null,
        ellipticLength: null,
        qualifiedLength: null,
        mainReferenceSurfaceCrystalOrientation: null,
        mainReferenceSurfaceCrystalOrientationDegrees: null,
        mainReferenceSurfaceCrystalOrientationMinute: null,
        mainReferenceSurfaceLength: null,
        mainReferenceSurfaceWidthHead: null,
        mainReferenceSurfaceWidthTail: null,
        mainAuxiliaryAngle: null,
        mainAuxiliaryAngleDegrees: null,
        mainAuxiliaryAngleMinute: null,
        auxiliaryReferenceSurfaceLength: null,
        auxiliaryReferenceSurfaceHead: null,
        auxiliaryReferenceSurfaceTail: null,
        thirdAngle: null,
        thirdAngleDegrees: null,
        thirdAngleMinute: null,
        thirdReferenceSurfaceLength: null,
        thirdReferenceSurfaceWidthHead: null,
        thirdReferenceSurfaceWidthTail: null,
        fourthAngle: null,
        fourthAngleDegrees: null,
        fourthAngleMinute: null,
        fourthReferenceSurfaceLength: null,
        fourthReferenceSurfaceWidthHead: null,
        fourthReferenceSurfaceWidthTail: null,
        vslotDepth: null,
      },
      formRules: {
        userCreate: [
          { required: true, message: "操作者不能为空", trigger: "change" },
        ],
        goodQty: [
          { required: true, message: "合格数量不能为空", trigger: "change" },
        ],
        scrapQty: [
          { required: true, message: "报废数量不能为空", trigger: "change" },
        ],
        planLength: [
          { required: true, message: "计划长度不能为空", trigger: "change" },
        ],
        originLength: [
          {
            required: true,
            message: "检测实测长度不能为空",
            trigger: "change",
          },
        ],
        chippingLength: [
          { required: true, message: "崩边长度不能为空", trigger: "change" },
        ],
        ellipticLength: [
          { required: true, message: "椭圆长度不能为空", trigger: "change" },
        ],
        qualifiedLength: [
          { required: true, message: "合格长度不能为空", trigger: "change" },
        ],
      },
      printVisible: false,
      printData: {},
      wipSwitches: [],
    };
  },
  computed: {
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
      getSeleteData("wipSwitches", this.wipSwitches);

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
      this.formData = { ...this.formData, ...fromData };

      this.handleInitData();
    },
    async handleInitData() {
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
        mainReferenceSurfaceCrystalOrientation,
        mainAuxiliaryAngle,
        thirdAngle,
        fourthAngle,
      } = this.formData;
      let mainReferenceSurfaceCrystalOrientationDegreesMinute =
        this.formatDegree(mainReferenceSurfaceCrystalOrientation);
      let mainAuxiliaryAngleDegreesMinute =
        this.formatDegree(mainAuxiliaryAngle);
      let thirdAngleDegreesMinute = this.formatDegree(thirdAngle);
      let fourthAngleDegreesMinute = this.formatDegree(fourthAngle);

      this.formData.mainReferenceSurfaceCrystalOrientationDegrees =
        mainReferenceSurfaceCrystalOrientationDegreesMinute[0];
      this.formData.mainReferenceSurfaceCrystalOrientationMinute =
        mainReferenceSurfaceCrystalOrientationDegreesMinute[1];

      this.formData.mainAuxiliaryAngleDegrees =
        mainAuxiliaryAngleDegreesMinute[0];
      this.formData.mainAuxiliaryAngleMinute =
        mainAuxiliaryAngleDegreesMinute[1];

      this.formData.thirdAngleDegrees = thirdAngleDegreesMinute[0];
      this.formData.thirdAngleMinute = thirdAngleDegreesMinute[1];

      this.formData.fourthAngleDegrees = fourthAngleDegreesMinute[0];
      this.formData.fourthAngleMinute = fourthAngleDegreesMinute[1];
    },
    calcAngle() {
      const {
        mainReferenceSurfaceCrystalOrientationDegrees,
        mainReferenceSurfaceCrystalOrientationMinute,
        mainAuxiliaryAngleDegrees,
        mainAuxiliaryAngleMinute,
        thirdAngleDegrees,
        thirdAngleMinute,
        fourthAngleDegrees,
        fourthAngleMinute,
      } = this.formData;

      this.formData.mainReferenceSurfaceCrystalOrientation = this.formatAngle(
        mainReferenceSurfaceCrystalOrientationDegrees,
        mainReferenceSurfaceCrystalOrientationMinute
      );
      this.formData.mainAuxiliaryAngle = this.formatAngle(
        mainAuxiliaryAngleDegrees,
        mainAuxiliaryAngleMinute
      );
      this.formData.thirdAngle = this.formatAngle(
        thirdAngleDegrees,
        thirdAngleMinute
      );
      this.formData.fourthAngle = this.formatAngle(
        fourthAngleDegrees,
        fourthAngleMinute
      );
    },
    formatDegree(value) {
      value = Math.abs(value);
      let v1 = Math.floor(value);
      let v2 = Math.round((value - v1) * 60);
      return [v1, v2];
    },
    formatAngle(degrees, minute) {
      return (Number(degrees) + Number(minute) / 60).toFixed(4);
    },
    async save() {
      this.calcAngle();
      await Api.upldateBuffer(this.buffParams, this.formData);
      const msg = "保存成功!";
      this.back(msg);
    },
    async confirm() {
      this.calcAngle();
      const valid = await this.$refs.formRef.validate();
      if (!valid) return;

      let wipSwitch = this.wipSwitches.find(
        (item) => item.name === "validateLengthSwitchSlicing"
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
      await this.$confirm("确认提交当前操作数据?", "提示", {
        type: "warning",
      });
      const {
        equipmentCode,
        processUuid,
        processingOrderCode,
        wipStorageStatus,
      } = this.$route.query;
      await Api.inOrOutStation({
        equipmentCode,
        param: {
          FormData: JSON.stringify(this.formData),
        },
        processUuid,
        processingOrderCode,
        wipStorageStatus,
      });
      const msg = "出站成功";
      Api.deleteBuffer(this.buffParams);
      this.back(msg);
    },
    handleLengthChange() {
      let { originLength, chippingLength, ellipticLength } = this.formData;
      this.formData.qualifiedLength = (
        (originLength || 0) -
        (chippingLength || 0) -
        (ellipticLength || 0)
      ).toFixed(2);
    },
    handleNext(val) {
      if ((val + "").length >= 2) this.$getDirection().next();
    },
    handlePrint(code) {
      this.printData.data = code;
      this.printVisible = true;
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
.outStationExecution-container {
  padding: 12px 12px 100px 12px;
  background-color: rgb(245, 245, 245);
  .info-container {
    background-color: rgb(245, 245, 245);
    display: flex;
    flex-wrap: wrap;
  }
  .info {
    display: flex;
    width: 50%;
    margin-bottom: 8px;
    .info-label {
      width: 40%;
    }
    .info-value {
      width: 60%;
    }
  }
  .outStation-form {
    border: 1px solid rgba(0, 0, 0, 0.1);
    min-height: 200px;
    margin-top: 10px;
    padding: 12px;
    background-color: white;
  }
}
.divider {
  margin: 8px 0px;
}
.btn {
  position: fixed;
  bottom: 0px;
  background-color: rgb(245, 247, 250);
  padding-bottom: 20px;
  z-index: 999;
  width: 100%;
  display: flex;
  gap: 8px;
  .cancel-btn {
    flex: 1;
  }
  .save-btn {
    flex: 1;
  }
  .confirm-btn {
    flex: 2;
  }
}
.base-form {
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
}
.unit {
  width: 60px;
}
.inputs {
  display: flex;
  gap: 4px;
}
.multiple-form-item /deep/ {
  margin-bottom: 0px !important;
  .el-form-item__label {
    height: 40px !important;
  }
}
.row {
  display: flex;
  gap: 10px;
  width: 100%;
  .item /deep/ {
    flex: 1;
    .el-input-group__append {
      padding: 0 10px;
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
