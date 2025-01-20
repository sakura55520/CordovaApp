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
          <div class="grid-item" v-if="segmentNum">
            <span class="grid-item-name">段位：</span>
            <span class="grid-item-value">{{ segmentNum }}</span>
          </div>
        </div>
      </div>
      <el-divider class="divider" />
      <h3>
        出站数据录入
        <i class="el-icon-refresh refresh" @click="refresh" />
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
          </div>
          <div class="base-form">
            <el-form-item
              label="合格状态"
              prop="status"
              class="item"
              label-width="90px"
            >
              <el-select
                v-model="formData.status"
                clearable
                style="width: 100%"
              >
                <el-option label="合格" :value="1"></el-option>
                <el-option label="不合格" :value="0"></el-option>
              </el-select>
            </el-form-item>
            <template v-if="formData.status">
              <el-form-item
                label="入库原因"
                prop="inStorageReason"
                class="item"
                label-width="110px"
              >
                <el-select
                  key="inStorageReason"
                  v-model="formData.inStorageReason"
                  clearable
                  filterable
                  style="width: 100%"
                >
                  <el-option
                    :label="item.label"
                    :value="item.value"
                    v-for="(item, index) in wipStorageInStorageReasonList"
                    :key="index"
                  ></el-option>
                </el-select>
              </el-form-item>
            </template>
            <template v-else>
              <el-form-item
                label="不合格原因"
                prop="unqualifiedReason"
                class="item"
                label-width="110px"
              >
                <el-select
                  key="unqualifiedReason"
                  v-model="formData.unqualifiedReason"
                  clearable
                  multiple
                  filterable
                  style="width: 100%"
                >
                  <el-option
                    :label="item.label"
                    :value="item.value"
                    v-for="(
                      item, index
                    ) in wipStorageDisqualificationReasonList"
                    :key="index"
                  ></el-option>
                </el-select>
              </el-form-item>
            </template>
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
                    :disabled="!enableMap.planLength"
                  >
                    <template slot="append">mm</template>
                  </el-input>
                </div>
              </el-form-item>
              <el-form-item
                label="长度MIN"
                prop="originLength"
                class="item"
                label-width="120px"
              >
                <div class="input">
                  <el-input
                    class="value"
                    v-model="formData.originLength"
                    :disabled="!enableMap.originLength"
                    @input="handleLengthChange"
                    v-direction="{ x: 2, y: 1 }"
                  >
                    <template slot="append">mm</template>
                  </el-input>
                </div>
              </el-form-item>
              <el-form-item
                label="长度MAX"
                prop="maxLength"
                class="item"
                label-width="120px"
              >
                <div class="input">
                  <el-input
                    class="value"
                    v-model="formData.maxLength"
                    v-direction="{ x: 3, y: 1 }"
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
                    :disabled="!enableMap.qualifiedLength"
                  >
                    <template slot="append">mm</template>
                  </el-input>
                </div>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item
                label="头部实测电阻率"
                prop="resHead"
                class="item"
                label-width="130px"
              >
                <el-input
                  class="value"
                  v-model="formData.resHead"
                  :disabled="!enableMap.resHead"
                  v-direction="{ x: 1, y: 2 }"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="尾部实测电阻率"
                prop="resTail"
                class="item"
                label-width="130px"
              >
                <el-input
                  class="value"
                  v-model="formData.resTail"
                  :disabled="!enableMap.resTail"
                  v-direction="{ x: 2, y: 2 }"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="最小直径"
                prop="circleDiameterHead"
                class="item"
                label-width="100px"
              >
                <div class="input">
                  <el-input
                    class="value"
                    v-model="formData.circleDiameterHead"
                    :disabled="
                      !enableMap.circleDiameterHead &&
                      !formData.needRollingCircle
                    "
                    v-direction="{ x: 3, y: 2 }"
                  >
                    <template slot="append">mm</template>
                  </el-input>
                </div>
              </el-form-item>
              <el-form-item
                label="最大直径"
                prop="circleDiameterTail"
                class="item"
                label-width="100px"
              >
                <div class="input">
                  <el-input
                    class="value"
                    v-model="formData.circleDiameterTail"
                    :disabled="
                      !enableMap.circleDiameterTail &&
                      !formData.needRollingCircle
                    "
                    v-direction="{ x: 4, y: 2 }"
                  >
                    <template slot="append">mm</template>
                  </el-input>
                </div>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item
                label="实际称重"
                prop="weighingQty"
                class="item"
                label-width="90px"
              >
                <div class="input">
                  <el-input
                    class="value"
                    v-model="formData.weighingQty"
                    :disabled="!enableMap.weighingQty"
                    v-direction="{ x: 1, y: 3 }"
                  >
                    <template slot="append">kg</template>
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
                    :disabled="!enableMap.chippingLength"
                    @input="handleLengthChange"
                    v-direction="{ x: 2, y: 3 }"
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
                    :disabled="!enableMap.ellipticLength"
                    @input="handleLengthChange"
                    v-direction="{ x: 3, y: 3 }"
                  >
                    <template slot="append">mm</template>
                  </el-input>
                </div>
              </el-form-item>
              <el-form-item label="晶向偏差" class="item" label-width="90px">
                <div class="input">
                  <el-input
                    class="value"
                    v-model="formData.crystalDeviation"
                    :disabled="true"
                  >
                    <template slot="append">°</template>
                  </el-input>
                </div>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="偏离量mm" class="item" label-width="90px">
                <div class="input">
                  <el-input
                    class="value"
                    v-model="formData.deviation"
                    :disabled="true"
                  >
                    <template slot="append">mm</template>
                  </el-input>
                </div>
              </el-form-item>
              <el-form-item label="晶偏扣减" class="item" label-width="90px">
                <div class="input">
                  <el-input
                    class="value"
                    v-model="formData.crystalPhaseReduction"
                    :disabled="true"
                  >
                    <template slot="append">mm</template>
                  </el-input>
                </div>
              </el-form-item>
              <el-form-item label="未滚出长度" class="item" label-width="100px">
                <div class="input">
                  <el-input
                    class="value"
                    v-model="formData.unRolledLen"
                    @input="handleLengthChange"
                  >
                    <template slot="append">mm</template>
                  </el-input>
                </div>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item
                label="滚圆实测主参考面宽度头"
                prop="mainReferenceSurfaceWidthHead"
                class="item"
                label-width="190px"
              >
                <div class="input">
                  <el-input
                    class="value"
                    v-model="formData.mainReferenceSurfaceWidthHead"
                    :disabled="!enableMap.mainReferenceSurfaceWidthHead"
                    v-direction="{ x: 1, y: 4 }"
                  >
                    <template slot="append">mm</template>
                  </el-input>
                </div>
              </el-form-item>
              <el-form-item
                label="滚圆实测主参考面宽度尾"
                prop="mainReferenceSurfaceWidthTail"
                class="item"
                label-width="190px"
              >
                <div class="input">
                  <el-input
                    class="value"
                    v-model="formData.mainReferenceSurfaceWidthTail"
                    :disabled="!enableMap.mainReferenceSurfaceWidthTail"
                    v-direction="{ x: 2, y: 4 }"
                  >
                    <template slot="append">mm</template>
                  </el-input>
                </div>
              </el-form-item>
              <el-form-item
                label="滚圆实测主参考面长度"
                prop="mainReferenceSurfaceLength"
                class="item"
                label-width="175px"
              >
                <div class="input">
                  <el-input
                    class="value"
                    v-model="formData.mainReferenceSurfaceLength"
                    :disabled="!enableMap.mainReferenceSurfaceLength"
                    v-direction="{ x: 3, y: 4 }"
                  >
                    <template slot="append">mm</template>
                  </el-input>
                </div>
              </el-form-item>
              <el-form-item
                label="滚圆实测主参考面晶向"
                prop="mainReferenceSurfaceCrystalOrientation"
                class="item"
                label-width="175px"
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
                      :disabled="
                        !enableMap.mainReferenceSurfaceCrystalOrientationDegrees
                      "
                      v-direction="{ x: 4, y: 4 }"
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
                      :disabled="
                        !enableMap.mainReferenceSurfaceCrystalOrientationMinute
                      "
                      v-direction="{ x: 5, y: 4 }"
                      @input="handleNext"
                    >
                      <template slot="append">'</template>
                    </el-input>
                  </el-form-item>
                </div>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item
                label="滚圆实测副参考面宽度头"
                prop="auxiliaryReferenceSurfaceHead"
                class="item"
                label-width="190px"
              >
                <div class="input">
                  <el-input
                    class="value"
                    v-model="formData.auxiliaryReferenceSurfaceHead"
                    :disabled="!enableMap.auxiliaryReferenceSurfaceHead"
                    v-direction="{ x: 1, y: 5 }"
                  >
                    <template slot="append">mm</template>
                  </el-input>
                </div>
              </el-form-item>
              <el-form-item
                label="滚圆实测副参考面宽度尾"
                prop="auxiliaryReferenceSurfaceTail"
                class="item"
                label-width="190px"
              >
                <div class="input">
                  <el-input
                    class="value"
                    v-model="formData.auxiliaryReferenceSurfaceTail"
                    :disabled="!enableMap.auxiliaryReferenceSurfaceTail"
                    v-direction="{ x: 2, y: 5 }"
                  >
                    <template slot="append">mm</template>
                  </el-input>
                </div>
              </el-form-item>
              <el-form-item
                label="滚圆实测副参考面长度"
                prop="auxiliaryReferenceSurfaceLength"
                class="item"
                label-width="175px"
              >
                <div class="input">
                  <el-input
                    class="value"
                    v-model="formData.auxiliaryReferenceSurfaceLength"
                    :disabled="!enableMap.auxiliaryReferenceSurfaceLength"
                    v-direction="{ x: 3, y: 5 }"
                  >
                    <template slot="append">mm</template>
                  </el-input>
                </div>
              </el-form-item>
              <el-form-item
                label="滚圆主副侧夹角"
                prop="mainAuxiliaryAngle"
                class="item"
                label-width="130px"
              >
                <div class="inputs">
                  <el-form-item label="" prop="mainAuxiliaryAngleDegrees">
                    <el-input
                      v-model="formData.mainAuxiliaryAngleDegrees"
                      :disabled="!enableMap.mainAuxiliaryAngleDegrees"
                      v-direction="{ x: 4, y: 5 }"
                      @input="handleNext"
                    >
                      <template slot="append">°</template>
                    </el-input>
                  </el-form-item>
                  <el-form-item label="" prop="mainAuxiliaryAngleMinute">
                    <el-input
                      v-model="formData.mainAuxiliaryAngleMinute"
                      :disabled="!enableMap.mainAuxiliaryAngleMinute"
                      v-direction="{ x: 5, y: 5 }"
                      @input="handleNext"
                    >
                      <template slot="append">'</template>
                    </el-input>
                  </el-form-item>
                </div>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item
                label="滚圆实测三参考面宽度头"
                prop="thirdReferenceSurfaceWidthHead"
                class="item"
                label-width="190px"
              >
                <div class="input">
                  <el-input
                    class="value"
                    v-model="formData.thirdReferenceSurfaceWidthHead"
                    :disabled="!enableMap.thirdReferenceSurfaceWidthHead"
                    v-direction="{ x: 1, y: 6 }"
                  >
                    <template slot="append">mm</template>
                  </el-input>
                </div>
              </el-form-item>
              <el-form-item
                label="滚圆实测三参考面宽度尾"
                prop="thirdReferenceSurfaceWidthTail"
                class="item"
                label-width="190px"
              >
                <div class="input">
                  <el-input
                    class="value"
                    v-model="formData.thirdReferenceSurfaceWidthTail"
                    :disabled="!enableMap.thirdReferenceSurfaceWidthTail"
                    v-direction="{ x: 2, y: 6 }"
                  >
                    <template slot="append">mm</template>
                  </el-input>
                </div>
              </el-form-item>
              <el-form-item
                label="滚圆实测三参考面长度"
                prop="thirdReferenceSurfaceLength"
                class="item"
                label-width="175px"
              >
                <div class="input">
                  <el-input
                    class="value"
                    v-model="formData.thirdReferenceSurfaceLength"
                    :disabled="!enableMap.thirdReferenceSurfaceLength"
                    v-direction="{ x: 3, y: 6 }"
                  >
                    <template slot="append">mm</template>
                  </el-input>
                </div>
              </el-form-item>
              <el-form-item
                label="滚圆实测三参侧夹角"
                prop="thirdAngle"
                class="item"
                label-width="170px"
              >
                <div class="inputs">
                  <el-form-item label="" prop="thirdAngleDegrees">
                    <el-input
                      v-model="formData.thirdAngleDegrees"
                      :disabled="!enableMap.thirdAngleDegrees"
                      v-direction="{ x: 4, y: 6 }"
                      @input="handleNext"
                    >
                      <template slot="append">°</template>
                    </el-input>
                  </el-form-item>
                  <el-form-item label="" prop="thirdAngleMinute">
                    <el-input
                      v-model="formData.thirdAngleMinute"
                      :disabled="!enableMap.thirdAngleMinute"
                      v-direction="{ x: 5, y: 6 }"
                      @input="handleNext"
                    >
                      <template slot="append">'</template>
                    </el-input>
                  </el-form-item>
                </div>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item
                label="滚圆实测四参考面宽度头"
                prop="fourthReferenceSurfaceWidthHead"
                class="item"
                label-width="190px"
              >
                <div class="input">
                  <el-input
                    class="value"
                    v-model="formData.fourthReferenceSurfaceWidthHead"
                    :disabled="!enableMap.fourthReferenceSurfaceWidthHead"
                    v-direction="{ x: 1, y: 7 }"
                  >
                    <template slot="append">mm</template>
                  </el-input>
                </div>
              </el-form-item>
              <el-form-item
                label="滚圆实测四参考面宽度尾"
                prop="fourthReferenceSurfaceWidthTail"
                class="item"
                label-width="190px"
              >
                <div class="input">
                  <el-input
                    class="value"
                    v-model="formData.fourthReferenceSurfaceWidthTail"
                    :disabled="!enableMap.fourthReferenceSurfaceWidthTail"
                    v-direction="{ x: 2, y: 7 }"
                  >
                    <template slot="append">mm</template>
                  </el-input>
                </div>
              </el-form-item>
              <el-form-item
                label="滚圆实测四参考面长度"
                prop="fourthReferenceSurfaceLength"
                class="item"
                label-width="175px"
              >
                <div class="input">
                  <el-input
                    class="value"
                    v-model="formData.fourthReferenceSurfaceLength"
                    :disabled="!enableMap.fourthReferenceSurfaceLength"
                    v-direction="{ x: 3, y: 7 }"
                  >
                    <template slot="append">mm</template>
                  </el-input>
                </div>
              </el-form-item>
              <el-form-item
                label="滚圆实测四参侧夹角"
                prop="fourthAngle"
                class="item"
                label-width="170px"
              >
                <div class="inputs">
                  <el-form-item label="" prop="fourthAngleDegrees">
                    <el-input
                      v-model="formData.fourthAngleDegrees"
                      :disabled="!enableMap.fourthAngleDegrees"
                      v-direction="{ x: 4, y: 7 }"
                      @input="handleNext"
                    >
                      <template slot="append">°</template>
                    </el-input>
                  </el-form-item>
                  <el-form-item label="" prop="fourthAngleMinute">
                    <el-input
                      v-model="formData.fourthAngleMinute"
                      :disabled="!enableMap.fourthAngleMinute"
                      v-direction="{ x: 5, y: 7 }"
                      @input="handleNext"
                    >
                      <template slot="append">'</template>
                    </el-input>
                  </el-form-item>
                </div>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item
                label="备注"
                prop="remarks"
                class="item"
                label-width="60px"
              >
                <el-input
                  type="textarea"
                  class="value"
                  v-model="formData.remarks"
                  :disabled="!enableMap.remarks"
                />
              </el-form-item>
            </div>
          </div>
          <div class="form">
            <div class="form-title">参数说明</div>
            <div class="row">合格长度计算公式：<br /></div>
            <div class="row">
              合格长度（{{ formData.qualifiedLength }} mm） = 长度MIN（{{
                formData.originLength
              }}
              mm） - 崩边长度（{{ formData.chippingLength }} mm） - 椭圆长度（{{
                formData.ellipticLength
              }}
              mm） - 晶偏扣减（{{ formData.crystalPhaseReduction }} mm） -
              未滚出长度（{{ formData.unRolledLen }} mm）<br />
            </div>
          </div>
        </el-form>
      </div>
    </div>
    <div class="page-handle-box" v-if="!$route.query.view">
      <el-button plain class="cancel" @click="back(null, 'confirm')"
        >取消</el-button
      >
      <el-button type="primary" plain class="save" @click="save"
        >保存</el-button
      >
      <el-button type="primary" class="submit" @click="confirm"
        >出站确认</el-button
      >
    </div>
  </div>
</template>

<script>
import * as Api from "@/api/inStation";
import SelectLinesideTree from "@/components/SelectLinesideTree";
import overStation from "@/mixins/overStation";
import { getSeleteData } from "@/utils/select";
import { getCurrentWipStorageClearData } from "@/api/overStation/overStation.js";
import { isEmpty } from "lodash-es";

export default {
  mixins: [overStation],
  components: {
    SelectLinesideTree,
  },
  data() {
    return {
      formData: {
        userCreate: null,
        weighingQty: null,
        planLength: null,
        originLength: null,
        maxLength: null,
        chippingLength: null,
        ellipticLength: null,
        qualifiedLength: null,
        crystalDeviation: null,
        crystalPhaseReduction: null,
        deviation: null,
        unRolledLen: null,
        resHead: null,
        resTail: null,
        circleDiameterHead: null,
        circleDiameterTail: null,
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
        lineWarehouseLocation: null,
        remarks: null,
        status: null,
        inStorageReason: "",
        unqualifiedReason: [],
        reason: null,
      },
      formRules: {
        userCreate: [
          { required: true, message: "操作者不能为空", trigger: "change" },
        ],
        weighingQty: [
          { required: true, message: "实际称重不能为空", trigger: "change" },
        ],
        planLength: [
          { required: true, message: "计划长度不能为空", trigger: "change" },
        ],
        originLength: [
          {
            required: true,
            message: "长度MIN不能为空",
            trigger: "change",
          },
        ],
        maxLength: [
          {
            required: true,
            message: "长度MAX不能为空",
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
        circleDiameterHead: [
          { required: true, message: "最小直径不能为空", trigger: "change" },
        ],
        circleDiameterTail: [
          { required: true, message: "最大直径不能为空", trigger: "change" },
        ],
        status: [{ required: true, message: "请选择", trigger: "change" }],
        inStorageReason: [
          { required: true, message: "请选择", trigger: "blur" },
        ],
        unqualifiedReason: [
          { required: true, message: "请选择", trigger: "blur" },
        ],
      },
      wipSwitches: [],
      wipStorageDisqualificationReasonList: [],
      wipStorageInStorageReasonList: [],
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
      this.fetchSwitchDict();
      getSeleteData("wipSwitches", this.wipSwitches);
      getSeleteData(
        "wipStorageDisqualificationReason",
        this.wipStorageDisqualificationReasonList
      );
      getSeleteData(
        "wipStorageInStorageReason",
        this.wipStorageInStorageReasonList
      );
      let fromData = {};
      // 查询保存的数据
      const res = await Api.fetchBuffer(this.buffParams);
      if (res.data) {
        fromData = res.data;
      } else {
        try {
          fromData = JSON.parse(this.$route.query.fromData);
          fromData.resHead = undefined;
          fromData.resTail = undefined;
        } catch (e) {
          console.log(e);
        }
      }

      this.formData = { ...this.formData, ...fromData };

      this.handleInitData();
    },
    async handleInitData() {
      this.formRules.circleDiameterHead[0].required =
        this.formRules.circleDiameterTail[0].required =
          !!this.formData.needRollingCircle;

      const { status, reason } = this.formData;
      if (status) {
        this.formData.inStorageReason = reason;
        this.formData.unqualifiedReason = [];
      } else {
        this.formData.inStorageReason = "";
        this.formData.unqualifiedReason = reason ? reason.split(",") : [];
      }

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
      const {
        originLength,
        planLength,
        chippingLength,
        ellipticLength,
        crystalPhaseReduction,
        unRolledLen,
      } = this.formData;
      this.formData.originLength = originLength || planLength || 0;
      this.formData.chippingLength = chippingLength || 0;
      this.formData.ellipticLength = ellipticLength || 0;
      this.formData.crystalPhaseReduction = crystalPhaseReduction || 0;
      this.formData.unRolledLen = unRolledLen || 0;
      this.formData.qualifiedLength = (
        this.formData.originLength -
        this.formData.chippingLength -
        this.formData.ellipticLength -
        this.formData.crystalPhaseReduction -
        this.formData.unRolledLen
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
    getReason() {
      const { status, inStorageReason, unqualifiedReason } = this.formData;
      this.formData.reason = status
        ? inStorageReason
        : unqualifiedReason.join(",");
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
      this.getReason();
      await Api.upldateBuffer(this.buffParams, this.formData);
      const msg = "保存成功!";
      this.back(msg);
    },
    async confirm() {
      this.calcAngle();
      this.getReason();
      const valid = await this.$refs.formRef.validate();
      if (!valid) return;

      let wipSwitch = this.wipSwitches.find(
        (item) => item.name === "validateLengthSwitchWarehouse"
      );
      if (wipSwitch && wipSwitch.value === "打开") {
        let { qualifiedLength } = this.formData;
        let value = wipSwitch.extendValue;
        if (Number(qualifiedLength) <= Number(value))
          return this.$message.warning(`合格长度必须大于${value}mm`);
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
    handleWhouseSelect({ id, name }) {
      this.formData.lineWarehouseLocation = name;
    },
    handleLengthChange() {
      let {
        originLength,
        chippingLength,
        ellipticLength,
        crystalPhaseReduction,
        unRolledLen,
      } = this.formData;
      this.formData.qualifiedLength = (
        (originLength || 0) -
        (chippingLength || 0) -
        (ellipticLength || 0) -
        (crystalPhaseReduction || 0) -
        (unRolledLen || 0)
      ).toFixed(2);
    },
    handleNext(val) {
      if ((val + "").length >= 2) this.$getDirection().next();
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
      let fromData = res.data[0].fromData;
      fromData.resHead = undefined;
      fromData.resTail = undefined;
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
  gap: 8px;
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
      padding: 0 5px;
    }
  }
}

.refresh {
  color: #409eff;
  cursor: pointer;
}
</style>
