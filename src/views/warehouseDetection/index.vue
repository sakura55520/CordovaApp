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
        <i v-if="!$route.query.view" class="el-icon-refresh refresh" @click="refresh" />
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
                @change="handleLengthChange"
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
                    :class="{
                      value: true,
                      'mark-red': !quantityPlanValid.valid,
                    }"
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
                    :class="{
                      value: true,
                      'mark-red': !quantityPlanValid.valid,
                    }"
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
                    :class="{
                      value: true,
                      'mark-red': !diameterValid.minValid,
                    }"
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
                    :class="{
                      value: true,
                      'mark-red': !diameterValid.maxValid,
                    }"
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
                    :class="{
                      value: true,
                      'mark-red': !crystalDeviationValid.valid,
                    }"
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
                    v-direction="{ x: 3, y: 4 }"
                  >
                    <template slot="append">mm</template>
                  </el-input>
                </div>
              </el-form-item>
              <el-form-item
                label="粗糙度"
                prop="roughness"
                class="item"
                label-width="100px"
              >
                <div class="input">
                  <el-input
                    :class="{
                      value: true,
                      'mark-red': !roughnessValid.valid,
                    }"
                    v-model="formData.roughness"
                    v-direction="{ x: 4, y: 4 }"
                  >
                    <template slot="append">μm</template>
                  </el-input>
                </div>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item
                label="V槽深度"
                prop="vslotDepth"
                class="item"
                label-width="100px"
              >
                <div class="input">
                  <el-input
                    class="value"
                    v-model="formData.vslotDepth"
                    v-direction="{ x: 1, y: 5 }"
                  >
                    <template slot="append">mm</template>
                  </el-input>
                </div>
              </el-form-item>
              <div class="item"></div>
              <div class="item"></div>
              <div class="item"></div>
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
                    v-direction="{ x: 1, y: 6 }"
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
                    v-direction="{ x: 2, y: 6 }"
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
                    v-direction="{ x: 3, y: 6 }"
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
                      v-direction="{ x: 4, y: 6 }"
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
                    v-direction="{ x: 1, y: 7 }"
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
                    v-direction="{ x: 2, y: 7 }"
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
                    v-direction="{ x: 3, y: 7 }"
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
                      v-direction="{ x: 4, y: 7 }"
                      @input="handleNext"
                    >
                      <template slot="append">°</template>
                    </el-input>
                  </el-form-item>
                  <el-form-item label="" prop="mainAuxiliaryAngleMinute">
                    <el-input
                      v-model="formData.mainAuxiliaryAngleMinute"
                      :disabled="!enableMap.mainAuxiliaryAngleMinute"
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
                    v-direction="{ x: 1, y: 8 }"
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
                    v-direction="{ x: 2, y: 8 }"
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
                    v-direction="{ x: 3, y: 8 }"
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
                      v-direction="{ x: 4, y: 8 }"
                      @input="handleNext"
                    >
                      <template slot="append">°</template>
                    </el-input>
                  </el-form-item>
                  <el-form-item label="" prop="thirdAngleMinute">
                    <el-input
                      v-model="formData.thirdAngleMinute"
                      :disabled="!enableMap.thirdAngleMinute"
                      v-direction="{ x: 5, y: 8 }"
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
                    v-direction="{ x: 1, y: 9 }"
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
                    v-direction="{ x: 2, y: 9 }"
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
                    v-direction="{ x: 3, y: 9 }"
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
                      v-direction="{ x: 4, y: 9 }"
                      @input="handleNext"
                    >
                      <template slot="append">°</template>
                    </el-input>
                  </el-form-item>
                  <el-form-item label="" prop="fourthAngleMinute">
                    <el-input
                      v-model="formData.fourthAngleMinute"
                      :disabled="!enableMap.fourthAngleMinute"
                      v-direction="{ x: 5, y: 9 }"
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
            <div class="row" v-if="formData.status == '0'">
              合格长度（{{ formData.qualifiedLength }} mm） = 长度MIN（{{
                formData.originLength
              }}
              mm） - 崩边长度（{{ formData.chippingLength }} mm） - 晶偏扣减（{{
                formData.crystalPhaseReduction
              }}
              mm）<br />
            </div>
            <div class="row" v-else>
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
          <div class="form">
            <div class="form-title">返切指令</div>
            <el-button
              size="small"
              type="primary"
              class="add-btn"
              @click="handleAddBackCuttings"
              >+ 新增返切指令</el-button
            >
            <el-table
              :data="formData.backCuttings"
              class="table"
              :header-cell-style="{
                background: 'rgba(242, 242, 242)',
                color: '#606266',
              }"
            >
              <el-table-column
                label="返切类型"
                min-width="85"
                align="center"
                prop="type"
                show-overflow-tooltip
              />
              <el-table-column
                label="返切标识"
                min-width="85"
                align="center"
                prop="sampleIdentification"
              />
              <el-table-column
                label="返切样片厚度"
                min-width="120"
                align="center"
                prop="tall"
              />
              <el-table-column
                label="返切位置"
                min-width="85"
                align="center"
                prop="samplePosition"
              />
              <el-table-column
                label="返切距头位置"
                min-width="120"
                align="center"
                prop="cutDistanceStart"
              />
              <el-table-column
                label="返切距尾位置"
                min-width="120"
                align="center"
                prop="cutDistanceEnd"
              />
              <el-table-column
                label="样片重量(kg)"
                min-width="120"
                align="center"
                prop="sampleWeight"
              />
              <el-table-column
                label="是否返切再利用"
                min-width="140"
                align="center"
                prop="recycle"
                :formatter="formRecycle"
              />
              <el-table-column
                label="切割次数"
                min-width="85"
                align="center"
                prop="sliceCount"
              />
              <el-table-column
                label="返切条码"
                min-width="230"
                align="center"
                prop="backCutNumber"
                show-overflow-tooltip
              />
              <el-table-column
                label="样片编码"
                min-width="180"
                align="center"
                prop="sampleNumber"
                show-overflow-tooltip
              />
              <el-table-column
                label="样片标识"
                min-width="230"
                align="center"
                prop="backCutFlag"
                show-overflow-tooltip
              />
              <el-table-column
                label="返切次数"
                min-width="85"
                align="center"
                prop="backCutCount"
              />
              <el-table-column
                label="状态"
                min-width="60"
                align="center"
                prop="status"
              >
                <template slot-scope="scope">
                  {{ scope.row.status == 1 ? "待切" : "已切" }}
                </template>
              </el-table-column>
              <el-table-column
                label="创建人"
                min-width="100"
                align="center"
                prop="userCreate"
                show-overflow-tooltip
              />
              <el-table-column
                label="创建时间"
                min-width="160"
                align="center"
                prop="gmtCreate"
              />
              <el-table-column label="操作" align="center" min-width="150" fixed="right">
                <template slot-scope="scope">
                  <el-button
                    class="table-btn"
                    type="text"
                    @click="handleUpdateBackCuttings(scope.row, scope.$index)"
                  >
                    编辑
                  </el-button>
                  <el-button
                    class="table-btn"
                    type="text"
                    style="color: red"
                    @click="handleDeleteBackCuttings(scope.row)"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="form">
            <div class="form-title">分段示意图</div>
            <div class="form-content" v-for="(item, i) in segmentList" :key="i">
              <div>{{ i == 0 ? "初始" : `第${i}次返切` }}</div>
              <div class="chart">
                <div
                  class="chart-item"
                  v-for="(ele, j) in item"
                  :key="j"
                  :style="{
                    width: getChartWidth(ele.startIndex, ele.endIndex),
                    left: getChartLeft(ele.startIndex),
                    background: ele.type == 2 ? '' : '#ccc',
                  }"
                >
                  <div class="bar">
                    <div class="text">
                      {{ ele.number }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-form>
      </div>
    </div>
    <el-dialog
      :title="`${backCuttingFormType}返切样片`"
      :visible.sync="backCuttingDialogVisible"
    >
      <el-form
        :model="backCuttingFormData"
        label-position="left"
        label-width="150px"
        :rules="backCuttingFormRules"
        ref="backCuttingFormRef"
      >
        <el-form-item label="返切晶段" prop="number">
          <el-select
            v-model="backCuttingFormData.number"
            placeholder=""
            class="form-item-cover"
          >
            <el-option
              :label="item.number"
              :value="item.number"
              v-for="(item, index) in backCutSegmentList"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="返切类型" prop="type">
          <el-select
            v-model="backCuttingFormData.type"
            placeholder=""
            class="form-item-cover"
            :disabled="backCuttingFormType === '编辑'"
            @change="handleBackCutTypeChange"
          >
            <el-option
              v-for="item in backCutTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="返切标识" prop="sampleIdentification">
          <el-select
            v-model="backCuttingFormData.sampleIdentification"
            placeholder=""
            class="form-item-cover"
            :disabled="backCuttingFormType === '编辑'"
          >
            <div v-for="item in sampleIdentificationList" :key="item.value">
              <el-option
                :label="item.label"
                :value="item.value"
                :disabled="
                  (backCuttingFormData.type === '中间片' &&
                    item.value !== 'M') ||
                  (backCuttingFormData.type !== '中间片' && item.value === 'M')
                "
              ></el-option>
            </div>
          </el-select>
        </el-form-item>
        <el-form-item label="返切样片厚度" prop="tall">
          <el-input
            v-model="backCuttingFormData.tall"
            :disabled="backCuttingFormType === '编辑' && originalTall === 0"
          ></el-input>
        </el-form-item>
        <el-form-item label="返切位置" prop="samplePosition">
          <el-input
            v-model="backCuttingFormData.samplePosition"
            @input="handleBackCutPositionChange"
          ></el-input>
        </el-form-item>
        <el-form-item label="返切距头位置" prop="cutDistanceStart">
          <el-input
            v-model="backCuttingFormData.cutDistanceStart"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="返切距尾位置" prop="cutDistanceEnd">
          <el-input
            v-model="backCuttingFormData.cutDistanceEnd"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="是否返切再利用" prop="recycle">
          <el-select
            v-model="backCuttingFormData.recycle"
            placeholder=""
            class="form-item-cover"
          >
            <el-option
              :label="item.label"
              :value="Number(item.value)"
              v-for="item in backCuttingAndReuseList"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="返切测试项目" prop="backCutTestItems">
          <el-select
            v-model="backCuttingFormData.backCutTestItems"
            placeholder=""
            class="form-item-cover"
            multiple
            clearable
          >
            <el-option
              :label="`${item.value}(${item.label})`"
              :value="item.value"
              v-for="item in backCutTestItemList"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="submit" @click="backCuttingDialogVisible = false"
          >取 消</el-button
        >
        <el-button
          class="submit"
          type="primary"
          @click="handleBackCuttingFormConfirm"
          >确 定</el-button
        >
      </span>
    </el-dialog>
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
import { isEmpty, cloneDeep } from "lodash-es";
import moment from "moment";
import { mapState } from "vuex";

export default {
  mixins: [overStation],
  components: {
    SelectLinesideTree,
  },
  data() {
    const validateLength = (rule, value, callback) => {
      const max = this.formData.maxLength;
      const min = this.formData.originLength;
      if ((!max && max != "0") || (!min && min != "0")) callback();
      if (Number(max) < Number(min)) {
        callback(new Error("长度MIN必须小于长度MAX"));
      } else {
        callback();
      }
    };
    const validateDiameter = (rule, value, callback) => {
      const max = this.formData.circleDiameterTail;
      const min = this.formData.circleDiameterHead;
      if ((!max && max != "0") || (!min && min != "0")) callback();
      if (Number(max) < Number(min)) {
        callback(new Error("最小直径必须小于最大直径"));
      } else {
        callback();
      }
    };
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
        vslotDepth: null,
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
        backCuttings: [],
      },
      formRules: {
        userCreate: [
          { required: true, message: "操作者不能为空", trigger: "change" },
        ],
        weighingQty: [
          { required: true, message: "实际称重不能为空", trigger: "blur" },
        ],
        planLength: [
          { required: true, message: "计划长度不能为空", trigger: "change" },
        ],
        originLength: [
          {
            required: true,
            message: "长度MIN不能为空",
            trigger: "blur",
          },
          { validator: validateLength, trigger: "blur" },
        ],
        maxLength: [
          {
            required: true,
            message: "长度MAX不能为空",
            trigger: "blur",
          },
          { validator: validateLength, trigger: "blur" },
        ],
        chippingLength: [
          { required: true, message: "崩边长度不能为空", trigger: "blur" },
        ],
        ellipticLength: [
          { required: true, message: "椭圆长度不能为空", trigger: "blur" },
        ],
        qualifiedLength: [
          { required: true, message: "合格长度不能为空", trigger: "change" },
        ],
        circleDiameterHead: [
          { required: true, message: "最小直径不能为空", trigger: "blur" },
          { validator: validateDiameter, trigger: "change" },
        ],
        circleDiameterTail: [
          { required: true, message: "最大直径不能为空", trigger: "blur" },
          { validator: validateDiameter, trigger: "change" },
        ],
        status: [{ required: true, message: "请选择", trigger: "change" }],
        inStorageReason: [
          { required: true, message: "请选择", trigger: "blur" },
        ],
        unqualifiedReason: [
          { required: true, message: "请选择", trigger: "blur" },
        ],
        roughness: [
          { required: true, message: "粗糙度不能为空", trigger: "change" },
        ],
      },
      wipSwitches: [],
      wipStorageDisqualificationReasonList: [],
      wipStorageInStorageReasonList: [],
      backCutTypeList: [],
      sampleIdentificationList: [],
      backCuttingAndReuseList: [],
      backCutTestItemList: [],
      backCuttingFormData: {
        type: undefined,
        sampleIdentification: undefined,
        samplePosition: undefined,
        cutDistanceStart: undefined,
        cutDistanceEnd: undefined,
        tall: undefined,
        recycle: undefined,
        backCutTestItems: [],
        number: undefined,
        userCreate: undefined,
        gmtCreate: undefined,
        processId: undefined,
      },
      backCuttingFormRules: {
        type: [
          { required: true, message: "返切类型不能为空", trigger: "change" },
        ],
        sampleIdentification: [
          { required: true, message: "返切标识不能为空", trigger: "change" },
        ],
        samplePosition: [
          { required: true, message: "返切位置不能为空", trigger: "change" },
        ],
        cutDistanceStart: [
          {
            required: true,
            message: "返切距头位置不能为空",
            trigger: "change",
          },
        ],
        cutDistanceEnd: [
          {
            required: true,
            message: "返切距尾位置不能为空",
            trigger: "change",
          },
        ],
        tall: [
          {
            required: true,
            message: "返切样片厚度不能为空",
            trigger: "change",
          },
        ],
        recycle: [
          {
            required: true,
            message: "是否返切再利用不能为空",
            trigger: "change",
          },
        ],
        backCutTestItems: [
          {
            required: true,
            message: "返切测试项目不能为空",
            trigger: "change",
          },
        ],
        number: [
          {
            required: true,
            message: "返切晶段不能为空",
            trigger: "change",
          },
        ],
      },
      backCuttingDialogVisible: false,
      backCuttingFormType: undefined,
      selectIndex: undefined,
      originalTall: undefined,
      segmentList: [],
      segmentTotalLength: 0,
      backCutSegmentList: [],
      startIndex: 0,
      endIndex: 0,
    };
  },
  computed: {
    buffParams() {
      const { processUuid, processingOrderCode } = this.$route.query;
      return { processUuid, processingOrderCode };
    },
    ...mapState({
      realName: (state) => state.user.realName,
    }),
    quantityPlanValid() {
      let wipSwitch = this.wipSwitches.find(
        (item) => item.name === "warehouseDetectionQuantityPlanDifference"
      );
      if (wipSwitch && wipSwitch.value === "打开") {
        let { qualifiedLength, planLength } = this.formData;
        let value = wipSwitch.extendValue;
        if (
          Math.abs(Number(qualifiedLength || 0) - Number(planLength || 0)) >
          Number(value)
        )
          return { valid: false, value };
      }
      return { valid: true };
    },
    diameterValid() {
      const {
        circleDiameterHead,
        circleDiameterTail,
        diameterLowerLimit,
        diameterUpperLimit,
      } = this.formData;
      let min = Number(circleDiameterHead || 0);
      let max = Number(circleDiameterTail || 0);
      let minValid = true;
      let maxValid = true;
      if (diameterLowerLimit || diameterLowerLimit == "0") {
        if (min < Number(diameterLowerLimit)) minValid = false;
        if (max < Number(diameterLowerLimit)) maxValid = false;
      }
      if (diameterUpperLimit || diameterUpperLimit == "0") {
        if (min > Number(diameterUpperLimit)) minValid = false;
        if (max > Number(diameterUpperLimit)) maxValid = false;
      }
      return { minValid, maxValid };
    },
    roughnessValid() {
      const {
        roughness,
        roughnessLowerLimit,
        roughnessUpperLimit,
      } = this.formData;
      let value = Number(roughness || 0);
      let valid = true;
      if (roughnessLowerLimit || roughnessLowerLimit == "0") {
        if (value < Number(roughnessLowerLimit) ) valid = false;
      }
      if (roughnessUpperLimit || roughnessUpperLimit == "0") {
        if (value > Number(roughnessUpperLimit) ) valid = false;
      }
      return { valid };
    },
    crystalDeviationValid() {
      const {
        crystalDeviation,
        crystalOrientationOffsetLowerLimit,
        crystalOrientationOffsetUpperLimit,
      } = this.formData;
      let value = Number(crystalDeviation || 0);
      let valid = true;
      if (crystalOrientationOffsetLowerLimit || crystalOrientationOffsetLowerLimit == "0") {
        if (value < Number(crystalOrientationOffsetLowerLimit) ) valid = false;
      }
      if (crystalOrientationOffsetUpperLimit || crystalOrientationOffsetUpperLimit == "0") {
        if (value > Number(crystalOrientationOffsetUpperLimit) ) valid = false;
      }
      return { valid };
    }
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
      getSeleteData("backCutType", this.backCutTypeList);
      getSeleteData("sampleIdentification", this.sampleIdentificationList);
      getSeleteData("backCuttingAndReuse", this.backCuttingAndReuseList);
      getSeleteData("backCutTestItemList", this.backCutTestItemList);
      let fromData = {};
      // 查询保存的数据
      const res = await Api.fetchBuffer(this.buffParams);
      if (res.data) {
        fromData = res.data;
      } else {
        try {
          fromData = JSON.parse(this.$route.query.fromData);
          if (this.$route.query && this.$route.query.lastWipStorageName != '外观检测' && !this.$route.query.view) {
            fromData.resHead = undefined;
            fromData.resTail = undefined;
            fromData.originLength = undefined;
            fromData.maxLength = undefined;
            fromData.circleDiameterHead = undefined;
            fromData.circleDiameterTail = undefined;
            fromData.weighingQty = undefined;
            fromData.chippingLength = 0;
            fromData.ellipticLength = 0;
            fromData.unRolledLen = undefined;
            fromData.mainReferenceSurfaceWidthHead = undefined;
            fromData.mainReferenceSurfaceWidthTail = undefined;
            fromData.mainReferenceSurfaceLength = undefined;
            fromData.auxiliaryReferenceSurfaceHead = undefined;
            fromData.auxiliaryReferenceSurfaceTail = undefined;
            fromData.auxiliaryReferenceSurfaceLength = undefined;
            fromData.thirdReferenceSurfaceWidthHead = undefined;
            fromData.thirdReferenceSurfaceWidthTail = undefined;
            fromData.thirdReferenceSurfaceLength = undefined;
            fromData.fourthReferenceSurfaceWidthHead = undefined;
            fromData.fourthReferenceSurfaceWidthTail = undefined;
            fromData.fourthReferenceSurfaceLength = undefined;
          }
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
        this.formData.unqualifiedReason = Array.isArray(reason)
          ? reason
          : JSON.parse(reason || "[]");
      }

      if (this.$route.query && this.$route.query.lastWipStorageName == '外观检测' && !this.$route.query.view) {
        this.initLength();
      }
      this.calcDegreesMinute();

      this.fetchBackCuttingSampleRecord();
      this.getSegmentationTree();
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
      if (this.formData.status == "0")
        this.formData.qualifiedLength = (
          this.formData.originLength -
          this.formData.chippingLength -
          this.formData.crystalPhaseReduction
        ).toFixed(2);
      else
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
        : JSON.stringify(unqualifiedReason || []);
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

      let backCuttings = this.formData.backCuttings;
      if (backCuttings && backCuttings.some((item) => item.status == 1)) {
        this.$message.warning("存在返切指令状态为待切，请先执行返切操作");
        return;
      }

      let wipSwitch = this.wipSwitches.find(
        (item) => item.name === "validateLengthSwitchWarehouse"
      );
      if (wipSwitch && wipSwitch.value === "打开") {
        let { qualifiedLength } = this.formData;
        let value = wipSwitch.extendValue;
        if (Number(qualifiedLength) <= Number(value))
          return this.$message.warning(`合格长度必须大于${value}mm`);
      }
      let message = "";
      if (!this.quantityPlanValid.valid)
        message += `<div>合格长度和计划长度差值大于【${this.quantityPlanValid.value}】mm</div>`;
      if (
        !this.formData.diameterLowerLimit &&
        this.formData.diameterLowerLimit !== 0
      )
        message += `<div>下发工单的直径下限未配置</div>`;
      if (
        !this.formData.diameterUpperLimit &&
        this.formData.diameterUpperLimit !== 0
      )
        message += `<div>下发工单的直径上限未配置</div>`;
      if (!this.diameterValid.minValid)
        message += `<div>最小直径不在【${
          this.formData.diameterLowerLimit || ""
        } ~ ${this.formData.diameterUpperLimit || ""}】mm范围内</div>`;
      if (!this.diameterValid.maxValid)
        message += `<div>最大直径不在【${
          this.formData.diameterLowerLimit || ""
        } ~ ${this.formData.diameterUpperLimit || ""}】mm范围内</div>`;
      if (!this.roughnessValid.valid)
        message += `<div>粗糙度不在【${
          this.formData.roughnessLowerLimit || ""
        } ~ ${this.formData.roughnessUpperLimit || ""}】μm范围内</div>`;
      if (!this.crystalDeviationValid.valid)
        message += `<div>晶向偏差不在【${
          this.formData.crystalOrientationOffsetLowerLimit || ""
        } ~ ${this.formData.crystalOrientationOffsetUpperLimit || ""}】°范围内</div>`;
      message += "确认提交当前操作数据?";
      await this.$confirm(message, "提示", {
        type: "warning",
        dangerouslyUseHTMLString: true,
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
      if (this.formData.status == '0')
        this.formData.qualifiedLength = (
          (originLength || 0) -
          (chippingLength || 0) -
          (crystalPhaseReduction || 0)
        ).toFixed(2);
      else
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
      if (this.$route.query && this.$route.query.lastWipStorageName != '外观检测' && !this.$route.query.view) {
        fromData.resHead = undefined;
        fromData.resTail = undefined;
        fromData.originLength = undefined;
        fromData.maxLength = undefined;
        fromData.circleDiameterHead = undefined;
        fromData.circleDiameterTail = undefined;
        fromData.weighingQty = undefined;
        fromData.chippingLength = 0;
        fromData.ellipticLength = 0;
        fromData.unRolledLen = undefined;
        fromData.mainReferenceSurfaceWidthHead = undefined;
        fromData.mainReferenceSurfaceWidthTail = undefined;
        fromData.mainReferenceSurfaceLength = undefined;
        fromData.auxiliaryReferenceSurfaceHead = undefined;
        fromData.auxiliaryReferenceSurfaceTail = undefined;
        fromData.auxiliaryReferenceSurfaceLength = undefined;
        fromData.thirdReferenceSurfaceWidthHead = undefined;
        fromData.thirdReferenceSurfaceWidthTail = undefined;
        fromData.thirdReferenceSurfaceLength = undefined;
        fromData.fourthReferenceSurfaceWidthHead = undefined;
        fromData.fourthReferenceSurfaceWidthTail = undefined;
        fromData.fourthReferenceSurfaceLength = undefined;
      }
      this.formData = {
        ...this.formData,
        ...fromData,
      };
      this.handleInitData();
    },
    getSegmentationTree() {
      Api.getSegmentations({
        processingOrderCode: this.formData.processOrderCode,
      }).then((res) => {
        const tree = res.data;
        this.startIndex = tree.startIndex || 0;
        this.endIndex = tree.endIndex || 0;
        this.segmentTotalLength = (tree.endIndex || 0) - (tree.startIndex || 0);
        let segmentList = [];
        let backCutSegmentList = [];
        this.handleSegmentationTree(tree, segmentList, backCutSegmentList);
        this.segmentList = segmentList;
        this.backCutSegmentList = backCutSegmentList;
      });
    },
    handleSegmentationTree(treeNode, segmentList, backCutSegmentList) {
      if (!treeNode) return;
      let { backCutCount, number, startIndex, endIndex, children, type } =
        treeNode;

      if (type == 2 && backCutCount != -1)
        backCutSegmentList.push({ number, startIndex, endIndex });

      if (!segmentList[backCutCount]) segmentList[backCutCount] = [];
      segmentList[backCutCount].push({
        number,
        startIndex,
        endIndex,
        type,
      });

      if (!isEmpty(children)) {
        children.forEach((item) => {
          this.handleSegmentationTree(item, segmentList, backCutSegmentList);
        });
      }
    },
    getChartWidth(startIndex, endIndex) {
      let width = 0;
      if (this.segmentTotalLength > 0)
        width = ((endIndex - startIndex) * 100) / this.segmentTotalLength;
      return width + "%";
    },
    getChartLeft(startIndex) {
      let left = 0;
      if (this.segmentTotalLength > 0)
        left = ((startIndex - this.startIndex) * 100) / this.segmentTotalLength;
      return left + "%";
    },
    async handleAddBackCuttings() {
      setTimeout(() => {
        this.$refs.backCuttingFormRef.clearValidate();
      });
      this.backCuttingFormData = {
        type: "",
        sampleIdentification: "",
        samplePosition: this.startIndex,
        cutDistanceStart: 0,
        cutDistanceEnd: this.segmentTotalLength,
        tall: 4,
        recycle: Number((this.backCuttingAndReuseList.find((item) => item.extendValue === "是") || {}).value || 1),
        backCutTestItems: [],
        number: null,
        userCreate: this.realName,
        gmtCreate: moment().format("YYYY-MM-DD HH:mm:ss"),
        processId: this.formData.processId,
      };
      this.backCuttingFormType = "新增";
      this.backCuttingDialogVisible = true;
    },
    async addBackCuttings() {
      const valid = await this.$refs.backCuttingFormRef.validate();
      if (!valid) return;

      const backCutSegment = this.backCutSegmentList.find(
        (item) => item.number == this.backCuttingFormData.number
      );
      if (
        this.backCuttingFormData.samplePosition < backCutSegment.startIndex ||
        this.backCuttingFormData.samplePosition > backCutSegment.endIndex
      )
        return this.$message.warning(
          `返切位置范围为:${backCutSegment.startIndex}~${backCutSegment.endIndex}`
        );

      if (
        this.formData.backCuttings.some(
          (item) =>
            item.samplePosition == this.backCuttingFormData.samplePosition &&
            item.sampleNumber !== this.backCuttingFormData.sampleNumber
        )
      ) {
        this.$message.warning("返切位置不能重复");
        return;
      }

      this.backCuttingFormData.processOrderCode =
        this.formData.processOrderCode;

      let list = this.formData.backCuttings
        .filter(
          (item) =>
            item.type === this.backCuttingFormData.type &&
            item.sampleIdentification ===
              this.backCuttingFormData.sampleIdentification &&
            item.sampleNumber
        )
        .map((item) => Number(item.sampleNumber.split("-")[3]));

      let max = isEmpty(list) ? 0 : Math.max(...list);

      let sampleType = this.backCutTypeList.find(
        (ele) => ele.value == this.backCuttingFormData.type
      ).extendValue;

      let index = max + 1;
      let res = await Api.getSampleCode({
        sampleType,
        crystalNo: this.formData.processOrderCode,
        sampleIdentification: this.backCuttingFormData.sampleIdentification,
        index,
      });

      this.backCuttingFormData.sampleNumber = res.data;
      await Api.createBackCuttingSampleRecord(this.backCuttingFormData);
      this.$message.success("返切指令创建成功");
      this.fetchBackCuttingSampleRecord();
      this.backCuttingDialogVisible = false;

      this.getSegmentationTree();
    },
    async handleUpdateBackCuttings(row, index) {
      this.backCuttingFormData = cloneDeep(row);
      this.originalTall = row.tall;
      this.backCuttingFormType = "编辑";
      this.backCuttingDialogVisible = true;
      this.selectIndex = index;
    },
    async updateBackCuttings() {
      if (
        this.formData.backCuttings.some(
          (item) =>
            item.samplePosition == this.backCuttingFormData.samplePosition &&
            item.sampleNumber !== this.backCuttingFormData.sampleNumber
        )
      ) {
        this.$message.warning("返切位置不能重复");
        return;
      }

      if (this.backCuttingFormData.tall == 0)
        this.backCuttingFormData.sampleNumber = "";

      this.backCuttingFormData.processOrderCode =
        this.formData.processOrderCode;

      await Api.updateBackCuttingSampleRecord(this.backCuttingFormData);
      this.$message.success("返切指令更新成功");
      this.fetchBackCuttingSampleRecord();
      this.getSegmentationTree();
      this.backCuttingDialogVisible = false;
    },
    async handleDeleteBackCuttings(row) {
      await this.$confirm(`请确认是否删除`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      });
      await Api.deleteBackCuttingSampleRecord({ id: row.id });
      this.$message.success("返切指令删除成功");
      this.fetchBackCuttingSampleRecord();

      this.getSegmentationTree();
    },
    handleBackCuttingFormConfirm() {
      if (this.backCuttingFormType === "新增") this.addBackCuttings();
      else this.updateBackCuttings();
    },
    async fetchBackCuttingSampleRecord() {
      let res = await Api.getBackCuttingSampleRecord({
        search_EQ_processOrderCode: this.formData.processOrderCode,
      });
      this.$set(this.formData, "backCuttings", res.data.rows);
    },
    formRecycle(row, column, recycle) {
      const matched = this.backCuttingAndReuseList.find(
        (item) => item.value == recycle
      );
      return matched ? matched.label : "";
    },
    handleBackCutTypeChange(val) {
      if (val === "中间片") this.backCuttingFormData.sampleIdentification = "M";
      else if (this.backCuttingFormData.sampleIdentification === "M")
        this.backCuttingFormData.sampleIdentification = "H";
    },
    handleBackCutPositionChange(val) {
      this.backCuttingFormData.cutDistanceStart = val - this.startIndex;
      this.backCuttingFormData.cutDistanceEnd = this.endIndex - val;
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
  .add-btn {
    position: absolute;
    left: 12px;
    font-size: 14px;
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

.mark-red {
  /deep/ .el-input__inner {
    background-color: red !important;
    color: white !important;
  }
}

.table {
  margin-top: 50px;
}

.table-btn {
  font-size: 12px;
  padding: 0px;
}

.form-content {
  width: 100%;
  padding: 0 10px;
  margin-top: 20px;
  .chart {
    display: flex;
    width: 100%;
    position: relative;
    height: 60px;
    .chart-item {
      position: absolute;
      .bar {
        margin: 0 auto;
        width: calc(100% - 10px);
        height: 60px;
        border: 1px solid #000;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        .text {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        &::before,
        &::after {
          content: "";
          position: absolute;
          width: 10px;
          height: 60px;
          border: 1px solid #000;
          background-color: white;
          border-radius: 50%;
        }
        &::before {
          z-index: 1;
          left: -5px;
        }
        &::after {
          z-index: 3;
          right: -5px;
        }
      }
    }
  }
}
</style>
