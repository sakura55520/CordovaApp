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
        出站数据录入
        <i class="el-icon-refresh" @click="fetchSwitchDict" />
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
                label="检测实测长度"
                prop="actualLength"
                class="item"
                label-width="120px"
              >
                <div class="input">
                  <el-input
                    class="value"
                    v-model="formData.actualLength"
                    :disabled="!enableMap.actualLength"
                    v-direction="{ x: 2, y: 1 }"
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
                    :disabled="!enableMap.chippingLength"
                    @input="handleLengthChange"
                    v-direction="{ x: 3, y: 1 }"
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
                    v-direction="{ x: 4, y: 1 }"
                  >
                    <template slot="append">mm</template>
                  </el-input>
                </div>
              </el-form-item>
              <el-form-item
                label="出站长度"
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
                label="长度MIN"
                prop="minLength"
                class="item"
                label-width="90px"
              >
                <div class="input">
                  <el-input
                    class="value"
                    v-model="formData.minLength"
                    :disabled="!enableMap.minLength"
                    @input="handleLengthChange"
                    v-direction="{ x: 1, y: 2 }"
                  >
                    <template slot="append">mm</template>
                  </el-input>
                </div>
              </el-form-item>
              <el-form-item
                label="长度MAX"
                prop="maxLength"
                class="item"
                label-width="90px"
              >
                <div class="input">
                  <el-input
                    class="value"
                    v-model="formData.maxLength"
                    :disabled="!enableMap.maxLength"
                    v-direction="{ x: 2, y: 2 }"
                  >
                    <template slot="append">mm</template>
                  </el-input>
                </div>
              </el-form-item>
              <el-form-item
                label="直径MIN"
                prop="minDiameter"
                class="item"
                label-width="90px"
              >
                <div class="input">
                  <el-input
                    class="value"
                    v-model="formData.minDiameter"
                    :disabled="!enableMap.minDiameter"
                    v-direction="{ x: 3, y: 2 }"
                  >
                    <template slot="append">mm</template>
                  </el-input>
                </div>
              </el-form-item>
              <el-form-item
                label="直径MAX"
                prop="maxDiameter"
                class="item"
                label-width="90px"
              >
                <div class="input">
                  <el-input
                    class="value"
                    v-model="formData.maxDiameter"
                    :disabled="!enableMap.maxDiameter"
                    v-direction="{ x: 4, y: 2 }"
                  >
                    <template slot="append">mm</template>
                  </el-input>
                </div>
              </el-form-item>
              <div class="item"></div>
            </div>
            <div class="row">
              <el-form-item
                label="理论重量"
                prop="theoryQty"
                class="item"
                label-width="90px"
              >
                <el-input
                  class="value"
                  v-model="formData.theoryQty"
                  :disabled="!enableMap.theoryQty"
                  v-direction="{ x: 1, y: 3 }"
                >
                  <template slot="append">kg</template>
                </el-input>
              </el-form-item>
              <el-form-item
                label="实际称重"
                prop="weighingQty"
                class="item"
                label-width="90px"
              >
                <el-input
                  class="value"
                  v-model="formData.weighingQty"
                  :disabled="!enableMap.weighingQty"
                  v-direction="{ x: 2, y: 3 }"
                >
                  <template slot="append">kg</template>
                </el-input>
              </el-form-item>
              <el-form-item
                label="RES_C"
                prop="resC"
                class="item"
                label-width="90px"
              >
                <el-input
                  class="value"
                  v-model="formData.resC"
                  :disabled="!enableMap.resC"
                  v-direction="{ x: 3, y: 3 }"
                >
                </el-input>
              </el-form-item>
              <el-form-item
                label="RES_E"
                prop="resE"
                class="item"
                label-width="90px"
              >
                <el-input
                  class="value"
                  v-model="formData.resE"
                  :disabled="!enableMap.resE"
                  v-direction="{ x: 4, y: 3 }"
                >
                </el-input>
              </el-form-item>
              <el-form-item
                label="RRG"
                prop="rrg"
                class="item"
                label-width="90px"
              >
                <el-input
                  class="value"
                  v-model="formData.rrg"
                  :disabled="!enableMap.rrg"
                  v-direction="{ x: 5, y: 3 }"
                >
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item
                label="少子寿命"
                prop="minorityCarrierLifetime"
                class="item"
                label-width="90px"
              >
                <el-input
                  class="value"
                  v-model="formData.minorityCarrierLifetime"
                  :disabled="!enableMap.minorityCarrierLifetime"
                  v-direction="{ x: 1, y: 4 }"
                >
                </el-input>
              </el-form-item>
              <el-form-item
                label="缺陷"
                prop="flaw"
                class="item"
                label-width="90px"
              >
                <el-select
                  style="width: 100%"
                  v-model="formData.flaw"
                  :disabled="!enableMap.flaw"
                >
                  <el-option
                    :label="item.label"
                    :value="item.value"
                    v-for="item in conventionalDefectList"
                    :key="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="位错"
                prop="offset"
                class="item"
                label-width="90px"
              >
                <el-select
                  style="width: 100%"
                  v-model="formData.offset"
                  :disabled="!enableMap.offset"
                >
                  <el-option
                    :label="item.label"
                    :value="item.value"
                    v-for="item in offsetList"
                    :key="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="OSF"
                prop="osf"
                class="item"
                label-width="90px"
              >
                <el-select
                  style="width: 100%"
                  v-model="formData.osf"
                  :disabled="!enableMap.osf"
                >
                  <el-option
                    :label="item.label"
                    :value="item.value"
                    v-for="item in osfDensityList"
                    :key="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <div class="item"></div>
            </div>
            <div class="row">
              <el-form-item
                label="CS"
                prop="cs"
                class="item"
                label-width="90px"
              >
                <el-input
                  class="value"
                  v-model="formData.cs"
                  :disabled="!enableMap.cs"
                  v-direction="{ x: 1, y: 5 }"
                >
                </el-input>
              </el-form-item>
              <el-form-item
                label="OI_C"
                prop="oiC"
                class="item"
                label-width="90px"
              >
                <el-input
                  class="value"
                  v-model="formData.oiC"
                  :disabled="!enableMap.oiC"
                  v-direction="{ x: 2, y: 5 }"
                >
                </el-input>
              </el-form-item>
              <el-form-item
                label="1/2 OI"
                prop="halfOi"
                class="item"
                label-width="90px"
              >
                <el-input
                  class="value"
                  v-model="formData.halfOi"
                  :disabled="!enableMap.halfOi"
                  v-direction="{ x: 3, y: 5 }"
                >
                </el-input>
              </el-form-item>
              <el-form-item
                label="OI_E"
                prop="oiE"
                class="item"
                label-width="90px"
              >
                <el-input
                  class="value"
                  v-model="formData.oiE"
                  :disabled="!enableMap.oiE"
                  v-direction="{ x: 4, y: 5 }"
                >
                </el-input>
              </el-form-item>
              <el-form-item
                label="ORG"
                prop="org"
                class="item"
                label-width="90px"
              >
                <el-input
                  class="value"
                  v-model="formData.org"
                  :disabled="!enableMap.org"
                  v-direction="{ x: 5, y: 5 }"
                >
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item
                label="基磷"
                prop="phosphorus"
                class="item"
                label-width="90px"
              >
                <el-input
                  class="value"
                  v-model="formData.phosphorus"
                  :disabled="!enableMap.phosphorus"
                  v-direction="{ x: 1, y: 6 }"
                >
                </el-input>
              </el-form-item>
              <el-form-item
                label="基硼"
                prop="boron"
                class="item"
                label-width="90px"
              >
                <el-input
                  class="value"
                  v-model="formData.boron"
                  :disabled="!enableMap.boron"
                  v-direction="{ x: 2, y: 6 }"
                >
                </el-input>
              </el-form-item>
              <el-form-item
                label="基砷"
                prop="arsenic"
                class="item"
                label-width="90px"
              >
                <el-input
                  class="value"
                  v-model="formData.arsenic"
                  :disabled="!enableMap.arsenic"
                  v-direction="{ x: 3, y: 6 }"
                >
                </el-input>
              </el-form-item>
              <el-form-item
                label="基锑"
                prop="antimony"
                class="item"
                label-width="90px"
              >
                <el-input
                  class="value"
                  v-model="formData.antimony"
                  :disabled="!enableMap.antimony"
                  v-direction="{ x: 4, y: 6 }"
                >
                </el-input>
              </el-form-item>
              <el-form-item
                label="金属"
                prop="metal"
                class="item"
                label-width="90px"
              >
                <el-select
                  style="width: 100%"
                  v-model="formData.metal"
                  :disabled="!enableMap.metal"
                >
                  <el-option
                    :label="item.label"
                    :value="item.value"
                    v-for="item in metalList"
                    :key="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item
                label="备注"
                prop="remarks"
                class="item"
                label-width="90px"
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
            <div class="form-title">
              样片信息(当前晶段头样片:{{
                formData.headSampleNo || "无"
              }},当前晶段尾样片:{{ formData.tailSampleNo || "无" }})
            </div>
            <el-table
              :data="formData.wipCrystalCheckSampleDatas"
              :header-cell-style="{
                background: 'rgba(242, 242, 242)',
                color: '#606266',
              }"
              :row-class-name="tableRowClassName"
            >
              <el-table-column
                label="样片编号"
                width="175"
                align="center"
                prop="sampleNumber"
                fixed="left"
                show-overflow-tooltip
                sortable
              >
              </el-table-column>
              <el-table-column
                label="样片标识"
                width="110"
                align="center"
                prop="sampleIdentification"
                fixed="left"
                sortable
              />
              <el-table-column
                label="样片位置"
                width="110"
                align="center"
                prop="samplePosition"
                fixed="left"
                sortable
              />
              <el-table-column
                label="样片重量(kg)"
                width="120"
                align="center"
                prop="sampleWeight"
              />
              <el-table-column
                label="样片类型"
                width="85"
                align="center"
                prop="type"
              />
              <el-table-column
                label="产品类型"
                width="85"
                align="center"
                prop="productCategory"
              >
              </el-table-column>
              <el-table-column
                label="晶向"
                width="55"
                align="center"
                prop="orientation"
              >
              </el-table-column>
              <el-table-column
                label="尺寸"
                width="55"
                align="center"
                prop="size"
              >
              </el-table-column>
              <el-table-column
                label="结晶比重"
                width="110"
                align="center"
                prop="crystalDensity"
                ><template slot="header">
                  <div class="form-table-header">结晶比重</div>
                </template>
                <template slot-scope="scope">
                  <div class="form-custom-verify">
                    <el-form-item
                      label=""
                      label-width="0px"
                      :prop="
                        'wipCrystalCheckSampleDatas.' +
                        scope.$index +
                        '.crystalDensity'
                      "
                      :rules="[
                        {
                          required: scope.row.valid || !scope.row.id,
                          message: ' ',
                          trigger: 'change',
                        },
                      ]"
                      class="form-input"
                    >
                      <el-input
                        :class="{
                          disabled: checkDisabled(scope.row),
                        }"
                        :disabled="checkDisabled(scope.row)"
                        :id="'input-1-' + scope.$index"
                        @keyup.native="(e) => handleKeyup(e, 1, scope.$index)"
                        v-model="scope.row.crystalDensity"
                      >
                        <template slot="append">%</template>
                      </el-input>
                    </el-form-item>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                label="RES"
                width="90"
                align="center"
                prop="res"
                show-overflow-tooltip
              />
              <el-table-column label="RES_C" min-width="100" align="center">
                <template slot="header">
                  <div class="form-table-header">RES_C</div>
                </template>
                <template slot-scope="scope">
                  <el-form-item
                    label=""
                    label-width="0px"
                    :prop="
                      'wipCrystalCheckSampleDatas.' + scope.$index + '.resC'
                    "
                    :rules="[
                      {
                        required:
                          (scope.row.valid || !scope.row.id) &&
                          scope.row.type === '头尾样片',
                        message: ' ',
                        trigger: 'change',
                      },
                    ]"
                    class="form-input"
                  >
                    <el-input
                      :class="{
                        disabled: checkDisabled(scope.row),
                      }"
                      :disabled="checkDisabled(scope.row)"
                      :id="'input-2-' + scope.$index"
                      @keyup.native="(e) => handleKeyup(e, 2, scope.$index)"
                      v-model="scope.row.resC"
                      @input="
                        () => {
                          calcHalfRrg(scope.$index);
                          calcRrg(scope.$index);
                          calcTargetDeviation(scope.$index);
                          calcHeadTailResistivityRatio(scope.row, scope.$index);
                          updateData();
                        }
                      "
                    ></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="RES_E" min-width="100" align="center">
                <template slot="header">
                  <div class="form-table-header">RES_E</div>
                </template>
                <template slot-scope="scope">
                  <el-form-item
                    label=""
                    label-width="0px"
                    :prop="
                      'wipCrystalCheckSampleDatas.' + scope.$index + '.resE'
                    "
                    :rules="[
                      {
                        required:
                          (scope.row.valid || !scope.row.id) &&
                          scope.row.type === '头尾样片',
                        message: ' ',
                        trigger: 'change',
                      },
                    ]"
                    class="form-input"
                  >
                    <el-input
                      :class="{
                        disabled: checkDisabled(scope.row),
                      }"
                      :disabled="checkDisabled(scope.row)"
                      :id="'input-3-' + scope.$index"
                      @keyup.native="(e) => handleKeyup(e, 3, scope.$index)"
                      v-model="scope.row.resE"
                      @input="
                        () => {
                          calcRrg(scope.$index);
                          updateData();
                        }
                      "
                    ></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="1/2RES" min-width="100" align="center">
                <template slot-scope="scope">
                  <el-input
                    :class="{
                      disabled: checkDisabled(scope.row),
                    }"
                    :disabled="checkDisabled(scope.row)"
                    :id="'input-4-' + scope.$index"
                    @keyup.native="(e) => handleKeyup(e, 4, scope.$index)"
                    v-model="scope.row.halfRes"
                    @input="calcHalfRrg(scope.$index)"
                  ></el-input> </template
              ></el-table-column>
              <el-table-column
                label="目标偏差"
                min-width="90"
                align="center"
                prop="targetDeviation"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <div
                    v-if="
                      scope.row.targetDeviation ||
                      scope.row.targetDeviation == 0
                    "
                    :style="{
                      color: getFontColorByBackgroundColor(
                        getControlColor('目标偏差', scope.row.targetDeviation)
                      ),
                      background: getControlColor(
                        '目标偏差',
                        scope.row.targetDeviation
                      ),
                    }"
                  >
                    {{ scope.row.targetDeviation }}%
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                label="RRG"
                min-width="90"
                align="center"
                prop="rrg"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <div
                    v-if="scope.row.rrg || scope.row.rrg == 0"
                    :style="{
                      color: getFontColorByBackgroundColor(
                        getControlColor('RRG', scope.row.rrg)
                      ),
                      background: getControlColor('RRG', scope.row.rrg),
                    }"
                  >
                    {{ scope.row.rrg }}%
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                label="1/2 RRG"
                min-width="90"
                align="center"
                prop="halfRrg"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <div v-if="scope.row.halfRrg || scope.row.halfRrg == 0">
                    {{ scope.row.halfRrg }}%
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                label="头尾电阻比"
                min-width="100"
                align="center"
                prop="headTailResistivityRatio"
                show-overflow-tooltip
              />
              <el-table-column label="OI_C" min-width="80" align="center">
                <template slot-scope="scope">
                  <el-input
                    :class="{
                      disabled: checkDisabled(scope.row),
                    }"
                    :disabled="checkDisabled(scope.row)"
                    :style="{
                      '--controlColor': getControlColor('OI_C', scope.row.oiC),
                      '--textColor': getFontColorByBackgroundColor(
                        getControlColor('OI_C', scope.row.oiC)
                      ),
                    }"
                    :id="'input-5-' + scope.$index"
                    @keyup.native="(e) => handleKeyup(e, 5, scope.$index)"
                    v-model="scope.row.oiC"
                    @input="
                      () => {
                        calcOrg(scope.$index);
                        updateData();
                      }
                    "
                  ></el-input> </template
              ></el-table-column>
              <el-table-column label="OI_E" min-width="80" align="center">
                <template slot-scope="scope">
                  <el-input
                    :class="{
                      disabled: checkDisabled(scope.row),
                    }"
                    :disabled="checkDisabled(scope.row)"
                    :style="{
                      '--controlColor': getControlColor('OI_E', scope.row.oiE),
                      '--textColor': getFontColorByBackgroundColor(
                        getControlColor('OI_E', scope.row.oiE)
                      ),
                    }"
                    :id="'input-6-' + scope.$index"
                    @keyup.native="(e) => handleKeyup(e, 6, scope.$index)"
                    v-model="scope.row.oiE"
                    @input="
                      () => {
                        calcOrg(scope.$index);
                        updateData();
                      }
                    "
                  ></el-input> </template
              ></el-table-column>
              <el-table-column label="CS" min-width="80" align="center">
                <template slot-scope="scope">
                  <el-input
                    :class="{
                      disabled: checkDisabled(scope.row),
                    }"
                    :disabled="checkDisabled(scope.row)"
                    :style="{
                      '--controlColor': getControlColor('CS', scope.row.cs),
                      '--textColor': getFontColorByBackgroundColor(
                        getControlColor('CS', scope.row.cs)
                      ),
                    }"
                    :id="'input-7-' + scope.$index"
                    @keyup.native="(e) => handleKeyup(e, 7, scope.$index)"
                    v-model="scope.row.cs"
                    @change="updateData"
                  ></el-input> </template
              ></el-table-column>
              <el-table-column
                label="ORG"
                min-width="80"
                align="center"
                prop="org"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <div v-if="scope.row.org || scope.row.org == 0">
                    {{ scope.row.org }}%
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="少子寿命" min-width="100" align="center">
                <template slot-scope="scope">
                  <el-input
                    :class="{
                      disabled: checkDisabled(scope.row),
                    }"
                    :disabled="checkDisabled(scope.row)"
                    :style="{
                      '--controlColor': getControlColor(
                        '少子寿命',
                        scope.row.minorityCarrierLifetime
                      ),
                      '--textColor': getFontColorByBackgroundColor(
                        getControlColor(
                          '少子寿命',
                          scope.row.minorityCarrierLifetime
                        )
                      ),
                    }"
                    :id="'input-8-' + scope.$index"
                    @keyup.native="(e) => handleKeyup(e, 8, scope.$index)"
                    v-model="scope.row.minorityCarrierLifetime"
                    @change="updateData"
                  ></el-input> </template
              ></el-table-column>
              <el-table-column label="常规缺陷" min-width="140" align="center">
                <template slot-scope="scope">
                  <el-select
                    :class="{
                      disabled: checkDisabled(scope.row),
                    }"
                    :disabled="checkDisabled(scope.row)"
                    v-model="scope.row.flaw"
                    placeholder=""
                    @change="updateData"
                  >
                    <el-option
                      :label="item.label"
                      :value="item.value"
                      v-for="item in conventionalDefectList"
                      :key="item.value"
                    ></el-option>
                  </el-select> </template
              ></el-table-column>
              <el-table-column label="OSF密度" min-width="120" align="center">
                <template slot-scope="scope">
                  <el-select
                    :class="{
                      disabled: checkDisabled(scope.row),
                    }"
                    :disabled="checkDisabled(scope.row)"
                    v-model="scope.row.osf"
                    placeholder=""
                    @change="updateData"
                  >
                    <el-option
                      :label="item.label"
                      :value="item.value"
                      v-for="item in osfDensityList"
                      :key="item.value"
                    ></el-option>
                  </el-select> </template
              ></el-table-column>
              <el-table-column label="基磷" min-width="80" align="center">
                <template slot-scope="scope">
                  <el-input
                    :class="{
                      disabled: checkDisabled(scope.row),
                    }"
                    :disabled="checkDisabled(scope.row)"
                    :id="'input-9-' + scope.$index"
                    @keyup.native="(e) => handleKeyup(e, 9, scope.$index)"
                    v-model="scope.row.phosphorus"
                    @change="
                      (val) => {
                        handleToFixed(val, scope.$index, 'phosphorus');
                        updateData();
                      }
                    "
                  ></el-input> </template
              ></el-table-column>
              <el-table-column label="基硼" min-width="80" align="center">
                <template slot-scope="scope">
                  <el-input
                    :class="{
                      disabled: checkDisabled(scope.row),
                    }"
                    :disabled="checkDisabled(scope.row)"
                    :id="'input-10-' + scope.$index"
                    @keyup.native="(e) => handleKeyup(e, 10, scope.$index)"
                    v-model="scope.row.boron"
                    @change="
                      (val) => {
                        handleToFixed(val, scope.$index, 'boron');
                        updateData();
                      }
                    "
                  ></el-input> </template
              ></el-table-column>
              <el-table-column label="基砷" min-width="80" align="center">
                <template slot-scope="scope">
                  <el-input
                    :class="{
                      disabled: checkDisabled(scope.row),
                    }"
                    :disabled="checkDisabled(scope.row)"
                    :id="'input-11-' + scope.$index"
                    @keyup.native="(e) => handleKeyup(e, 11, scope.$index)"
                    v-model="scope.row.arsenic"
                    @change="
                      (val) => {
                        handleToFixed(val, scope.$index, 'arsenic');
                        updateData();
                      }
                    "
                  ></el-input> </template
              ></el-table-column>
              <el-table-column label="基锑" min-width="80" align="center">
                <template slot-scope="scope">
                  <el-input
                    :class="{
                      disabled: checkDisabled(scope.row),
                    }"
                    :disabled="checkDisabled(scope.row)"
                    :id="'input-12-' + scope.$index"
                    @keyup.native="(e) => handleKeyup(e, 12, scope.$index)"
                    v-model="scope.row.antimony"
                    @change="
                      (val) => {
                        handleToFixed(val, scope.$index, 'antimony');
                        updateData();
                      }
                    "
                  ></el-input> </template
              ></el-table-column>
              <el-table-column label="检测人员" min-width="120" align="center">
                <template slot-scope="scope">
                  <SelectUserinfo
                    :class="{
                      disabled: checkDisabled(scope.row),
                    }"
                    :disabled="checkDisabled(scope.row)"
                    v-model="scope.row.inspector"
                    @handleSelect="
                      (val) => handleInspectorSelect(val, scope.$index)
                    "
                  /> </template
              ></el-table-column>
              <el-table-column label="检测日期" min-width="250" align="center">
                <template slot-scope="scope">
                  <el-date-picker
                    :class="{
                      disabled: checkDisabled(scope.row),
                    }"
                    :disabled="checkDisabled(scope.row)"
                    class="time"
                    v-model="scope.row.checkDate"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                  /> </template
              ></el-table-column>
            </el-table>
          </div>
          <div class="form">
            <div class="form-title">留档文档记录</div>
            <div class="growth-section">
              <PhotoNew
                v-model="formData._files"
                :componentDisabled="false"
                :name="'CHECK_DEVICE'"
                @input="handleFileChange"
              />
            </div>
          </div>
          <div class="form">
            <div class="form-title">参数说明</div>
            <div class="row">出站长度计算公式：<br /></div>
            <div class="row">
              出站长度（{{ formData.qualifiedLength }} mm） = 长度MIN（{{
                formData.minLength
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
import SelectUserinfo from "@/components/select_userinfo";
import overStation from "@/mixins/overStation";
import { getSeleteData } from "@/utils/select";
import PhotoNew from "@/views/components/photoNew";
import { getMateralModelExtras } from "@/api/factory/materialModel";
import { getFontColorByBackgroundColor } from "@/utils/color";
import { cloneDeep, isEmpty, get } from "lodash-es";

export default {
  mixins: [overStation],
  components: {
    SelectUserinfo,
    PhotoNew,
  },
  data() {
    return {
      getFontColorByBackgroundColor,
      formData: {
        userCreate: null,
        planLength: null,
        actualLength: null,
        minLength: null,
        maxLength: null,
        chippingLength: null,
        ellipticLength: null,
        qualifiedLength: null,
        minDiameter: null,
        maxDiameter: null,
        weighingQty: null,
        theoryQty: null,
        resC: null,
        resE: null,
        rrg: null,
        minorityCarrierLifetime: null,
        flaw: null,
        offset: null,
        osf: null,
        cs: null,
        oiC: null,
        halfOi: null,
        oiE: null,
        org: null,
        phosphorus: null,
        boron: null,
        arsenic: null,
        antimony: null,
        metal: null,
        remarks: null,
        _files: [],
        wipCrystalCheckSampleDatas: [],
      },
      formRules: {
        userCreate: [
          { required: true, message: "操作者不能为空", trigger: "change" },
        ],
        planLength: [
          { required: true, message: "计划长度不能为空", trigger: "change" },
        ],
        actualLength: [
          {
            required: true,
            message: "实测长度不能为空",
            trigger: "change",
          },
        ],
        minLength: [
          {
            required: true,
            message: "长度min不能为空",
            trigger: "change",
          },
        ],
        maxLength: [
          {
            required: true,
            message: "长度max不能为空",
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
          { required: true, message: "出站长度不能为空", trigger: "change" },
        ],
        minDiameter: [
          { required: true, message: "最小直径不能为空", trigger: "change" },
        ],
        maxDiameter: [
          { required: true, message: "最大直径不能为空", trigger: "change" },
        ],
        theoryQty: [
          { required: true, message: "理论重量不能为空", trigger: "change" },
        ],
        weighingQty: [
          { required: true, message: "实际称重不能为空", trigger: "change" },
        ],
        resC: [{ required: true, message: "RES_C不能为空", trigger: "blur" }],
        resE: [{ required: true, message: "RES_E不能为空", trigger: "blur" }],
        rrg: [{ required: true, message: "RRG不能为空", trigger: "blur" }],
        minorityCarrierLifetime: [
          { required: true, message: "少子寿命不能为空", trigger: "blur" },
        ],
        flaw: [{ required: true, message: "缺陷不能为空", trigger: "blur" }],
        offset: [{ required: true, message: "位错不能为空", trigger: "blur" }],
        osf: [{ required: true, message: "OSF不能为空", trigger: "blur" }],
        cs: [{ required: true, message: "CS不能为空", trigger: "blur" }],
        oiC: [{ required: true, message: "OI_C不能为空", trigger: "blur" }],
        halfOi: [
          { required: true, message: "1/2 OI不能为空", trigger: "blur" },
        ],
        oiE: [{ required: true, message: "OI_E不能为空", trigger: "blur" }],
        org: [{ required: true, message: "ORG不能为空", trigger: "blur" }],
        phosphorus: [
          { required: true, message: "基磷不能为空", trigger: "blur" },
        ],
        boron: [{ required: true, message: "基硼不能为空", trigger: "blur" }],
        arsenic: [{ required: true, message: "基砷不能为空", trigger: "blur" }],
        antimony: [
          { required: true, message: "基锑不能为空", trigger: "blur" },
        ],
        metal: [{ required: true, message: "金属不能为空", trigger: "blur" }],
        remarks: [{ required: true, message: "备注不能为空", trigger: "blur" }],
      },
      conventionalDefectList: [],
      offsetList: [],
      osfDensityList: [],
      metalList: [],
      controlList: [
        {
          key: "targetDeviation",
          name: "目标偏差",
          from: "formData.wipCrystalCheckSampleDatas",
        },
        {
          key: "rrg",
          name: "RRG",
          from: "formData.wipCrystalCheckSampleDatas",
        },
        { key: "cs", name: "CS", from: "formData.wipCrystalCheckSampleDatas" },
        {
          key: "minorityCarrierLifetime",
          name: "少子寿命",
          from: "formData.wipCrystalCheckSampleDatas",
        },
        {
          key: "oiC",
          name: "OI_C",
          from: "formData.wipCrystalCheckSampleDatas",
        },
        {
          key: "oiE",
          name: "OI_E",
          from: "formData.wipCrystalCheckSampleDatas",
        },
      ],
      controlMap: {},
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

      this.formData._files = JSON.parse(this.formData.photo || "[]").map(
        (fileItem) => ({
          ...fileItem,
          big_url: fileItem.fileUrl,
          thumb_url: fileItem.fileUrl,
        })
      );

      this.initLength();
      this.fetchSwitchDict();
      getSeleteData("conventionalDefect", this.conventionalDefectList);
      getSeleteData("offset", this.offsetList);
      getSeleteData("osfDensity", this.osfDensityList);
      getSeleteData("metal", this.metalList);

      if (!this.$route.query.view) this.updateData();

      await this.getMateralModelExtras();
      this.$set(
        this.formData,
        "wipCrystalCheckSampleDatas",
        cloneDeep(this.formData.wipCrystalCheckSampleDatas)
      );
    },
    updateData() {
      if (isEmpty(this.formData.wipCrystalCheckSampleDatas)) return;
      const { wipCrystalCheckSampleDatas, headSampleNo, tailSampleNo } =
        this.formData;
      let headSample = wipCrystalCheckSampleDatas.find(
        (item) => item.sampleNumber === headSampleNo
      );
      let tailSample = wipCrystalCheckSampleDatas.find(
        (item) => item.sampleNumber === tailSampleNo
      );

      if (headSample) {
        const { resC, resE, rrg, flaw, osf, cs, oiC, oiE, halfOi, org } =
          headSample;

        let data = {
          ...this.formData,
          resC,
          resE,
          rrg,
          flaw,
          osf,
          cs,
          oiC,
          oiE,
          halfOi,
          org,
        };
        this.$set(this, "formData", data);
      }

      if (tailSample) {
        const {
          minorityCarrierLifetime,
          offset,
          phosphorus,
          boron,
          arsenic,
          antimony,
        } = tailSample;

        let data = {
          ...this.formData,
          minorityCarrierLifetime,
          offset,
          phosphorus,
          boron,
          arsenic,
          antimony,
        };
        this.$set(this, "formData", data);
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
      const { minLength, planLength, chippingLength, ellipticLength } =
        this.formData;
      this.formData.minLength = minLength || planLength || 0;
      this.formData.chippingLength = chippingLength || 0;
      this.formData.ellipticLength = ellipticLength || 0;
      this.formData.qualifiedLength = (
        this.formData.minLength -
        this.formData.chippingLength -
        this.formData.ellipticLength
      ).toFixed(2);
      this.calcPlanWeight();
    },
    async save() {
      await Api.upldateBuffer(this.buffParams, this.formData);
      const msg = "保存成功!";
      this.back(msg);
    },
    async confirm() {
      const valid = await this.$refs.formRef.validate();
      if (!valid) return;

      let outControlList = [];
      this.controlList.forEach((control) => {
        let list = get(this, control.from, []);
        if (
          list.some(
            (item) => !this.checkControl(control.name, item[control.key])
          )
        )
          outControlList.push(control.name);
      });

      let message = "确认提交当前操作数据?";
      if (!isEmpty(outControlList))
        message =
          "<div>以下数据超限：</div>" +
          outControlList.join("、") +
          "<div>请确认是否继续提交当前操作数据?</div>";

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
    handleLengthChange() {
      let { minLength, chippingLength, ellipticLength } = this.formData;
      this.formData.qualifiedLength = (
        (minLength || 0) -
        (chippingLength || 0) -
        (ellipticLength || 0)
      ).toFixed(2);
      this.calcPlanWeight();
    },
    calcPlanWeight() {
      const { qualifiedLength, theoryQtyCoefficient } = this.formData;
      this.formData.theoryQty = (
        ((qualifiedLength || 0) * (theoryQtyCoefficient || 0)) /
        1000
      ).toFixed(3);
    },
    handleFileChange() {
      const photo = (this.formData._files || []).map(
        ({ big_url, thumb_url, ...item }) => ({
          ...item,
          fileUrl: big_url,
        })
      );
      this.formData.photo = photo;
    },
    tableRowClassName({ row }) {
      if (!row.valid && row.id) {
        return "invalid_tr";
      }
    },
    calcHalfRrg(index) {
      let item = this.formData.wipCrystalCheckSampleDatas[index];
      let data;
      if (item.resC)
        data = (((item.halfRes - item.resC) / item.resC) * 100).toFixed(3);
      this.$set(
        this.formData.wipCrystalCheckSampleDatas[index],
        "halfRrg",
        data
      );
    },
    calcRrg(index) {
      let item = this.formData.wipCrystalCheckSampleDatas[index];
      let data;
      if (item.resC)
        data = (((item.resE - item.resC) / item.resC) * 100).toFixed(3);
      this.$set(this.formData.wipCrystalCheckSampleDatas[index], "rrg", data);
    },
    calcTargetDeviation(index) {
      let item = this.formData.wipCrystalCheckSampleDatas[index];
      let data;
      if (item.res)
        data = (((item.resC - item.res) / item.res) * 100).toFixed(3);
      this.$set(
        this.formData.wipCrystalCheckSampleDatas[index],
        "targetDeviation",
        data
      );
    },
    calcOrg(index) {
      let item = this.formData.wipCrystalCheckSampleDatas[index];
      let data;
      if (item.oiC)
        data = ((Math.abs(item.oiC - item.oiE) / item.oiC) * 100).toFixed(3);
      this.$set(this.formData.wipCrystalCheckSampleDatas[index], "org", data);
    },
    calcHeadTailResistivityRatio(row, index) {
      let headTailResistivityRatio = null;
      const { headSampleNo, tailSampleNo } = this.formData;
      let headIndex = this.formData.wipCrystalCheckSampleDatas.findIndex(
        (item) => item.sampleNumber === headSampleNo
      );
      let tailIndex = this.formData.wipCrystalCheckSampleDatas.findIndex(
        (item) => item.sampleNumber === tailSampleNo
      );

      if (headIndex === -1 || tailIndex === -1) return;

      let headResC = this.formData.wipCrystalCheckSampleDatas[headIndex].resC;
      let tailResC = this.formData.wipCrystalCheckSampleDatas[tailIndex].resC;

      if ((headResC || headResC === 0) && tailResC)
        headTailResistivityRatio = (headResC / tailResC).toFixed(3);

      this.$set(
        this.formData.wipCrystalCheckSampleDatas[headIndex],
        "headTailResistivityRatio",
        headTailResistivityRatio
      );
      this.$set(
        this.formData.wipCrystalCheckSampleDatas[tailIndex],
        "headTailResistivityRatio",
        headTailResistivityRatio
      );
    },
    handleInspectorSelect(val, index) {
      this.$set(
        this.formData.wipCrystalCheckSampleDatas[index],
        "checkDate",
        new Date()
      );
    },
    getControlColor(key, val) {
      let item = this.controlMap[key] || {};
      let maxItem = item["上限"] || {};
      let minItem = item["下限"] || {};

      if ((maxItem.control || minItem.control) && !(val || String(val) === "0"))
        return maxItem.controlColor || minItem.controlColor;

      if (
        maxItem.control &&
        (maxItem.value || String(maxItem.value) === "0") &&
        Number(val) > Number(maxItem.value)
      )
        return maxItem.controlColor;
      if (
        minItem.control &&
        (minItem.value || String(minItem.value) === "0") &&
        Number(val) < Number(minItem.value)
      )
        return minItem.controlColor;

      return null;
    },
    checkControl(key, val) {
      let item = this.controlMap[key] || {};
      let maxItem = item["上限"] || {};
      let minItem = item["下限"] || {};

      if ((maxItem.control || minItem.control) && !(val || String(val) === "0"))
        return false;

      if (
        maxItem.control &&
        (maxItem.value || String(maxItem.value) === "0") &&
        Number(val) > Number(maxItem.value)
      )
        return false;
      if (
        minItem.control &&
        (minItem.value || String(minItem.value) === "0") &&
        Number(val) < Number(minItem.value)
      )
        return false;

      return true;
    },
    handleKeyup(e, x, y) {
      if (e.keyCode === 39) {
        let dom = document.getElementById(`input-${x + 1}-${y}`);
        dom && dom.focus();
      }
      if (e.keyCode === 37) {
        let dom = document.getElementById(`input-${x - 1}-${y}`);
        dom && dom.focus();
      }
      if (e.keyCode === 38) {
        let dom = document.getElementById(`input-${x}-${y - 1}`);
        dom && dom.focus();
      }
      if (e.keyCode === 40) {
        let dom = document.getElementById(`input-${x}-${y + 1}`);
        dom && dom.focus();
      }
    },
    async getMateralModelExtras() {
      let list = await getMateralModelExtras({
        processOrderCode: this.formData.processOrderCode,
      });

      this.controlList.forEach((control) => {
        let name = control.name;
        let maxName = name + "上限";
        let minName = name + "下限";
        let maxItem = list.find((ele) => ele.displayName == maxName) || {};
        let minItem = list.find((ele) => ele.displayName == minName) || {};

        this.controlMap[name] = {
          上限: {
            control: maxItem.control,
            controlColor: maxItem.controlColor,
            value: maxItem.value,
          },
          下限: {
            control: minItem.control,
            controlColor: minItem.controlColor,
            value: minItem.value,
          },
        };
      });
    },
    checkDisabled(row) {
      return false;
      // const { headSampleNo, tailSampleNo } = this.formData;
      // return (
      //   row.sampleNumber !== headSampleNo && row.sampleNumber !== tailSampleNo
      // );
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

.form-input {
  margin-bottom: 0px;
}

.form-table-header:before {
  content: "* ";
  color: red;
}

.el-table {
  /deep/ .el-table__cell {
    padding: 0px;
  }

  /deep/ .el-input-group__append {
    padding: 0 5px;
  }

  /deep/ .el-input__inner {
    padding: 0px 3px;
  }

  /deep/ .el-input__icon {
    line-height: 25px;
  }

  .time {
    /deep/ .el-input__inner {
      padding: 0px 30px;
    }
  }

  /deep/ .el-input__inner {
    height: 25px;
    background-color: var(--controlColor) !important;
    color: var(--textColor);
  }

  /deep/ .el-form-item__content {
    line-height: 25px;
  }

  /deep/ .el-form-item__label {
    line-height: 25px;
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

.disabled {
  background-color: #f5f7fa !important;
  color: #c0c4cc !important;
}
</style>
