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
        <el-collapse v-model="activeName" class="collapse">
          <el-collapse-item title="样片检验数据" name="checkInfo">
            <div class="base-form">
              <el-table
                :data="checkInfo"
                class="table"
                :header-cell-style="{
                  background: 'rgba(242, 242, 242)',
                  color: '#606266',
                }"
                :row-class-name="tableRowClassName"
              >
                <el-table-column
                  label="样片编号"
                  width="180"
                  align="center"
                  prop="sampleNumber"
                  fixed="left"
                  show-overflow-tooltip
                  sortable
                />
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
                  show-overflow-tooltip
                  sortable
                />
                <el-table-column
                  label="样片重量(kg)"
                  width="120"
                  align="center"
                  prop="sampleWeight"
                  show-overflow-tooltip
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
                />
                <el-table-column
                  label="晶向"
                  width="60"
                  align="center"
                  prop="orientation"
                />
                <el-table-column
                  label="尺寸"
                  width="60"
                  align="center"
                  prop="size"
                />
                <el-table-column
                  label="结晶比重"
                  width="90"
                  align="center"
                  prop="crystalDensity"
                  show-overflow-tooltip
                >
                  <template slot-scope="scope">
                    <div
                      v-if="
                        scope.row.crystalDensity ||
                        scope.row.crystalDensity == 0
                      "
                    >
                      {{ scope.row.crystalDensity }}%
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  label="RES"
                  min-width="80"
                  align="center"
                  prop="res"
                  show-overflow-tooltip
                />
                <el-table-column
                  label="RES_C"
                  min-width="90"
                  align="center"
                  prop="resC"
                  show-overflow-tooltip
                />
                <el-table-column
                  label="RES_E"
                  min-width="90"
                  align="center"
                  prop="resE"
                  show-overflow-tooltip
                />
                <el-table-column
                  label="1/2RES"
                  min-width="90"
                  align="center"
                  prop="halfRes"
                  show-overflow-tooltip
                />
                <el-table-column
                  label="目标偏差"
                  min-width="90"
                  align="center"
                  prop="targetDeviation"
                  show-overflow-tooltip
                />
                <el-table-column
                  label="RRG"
                  min-width="90"
                  align="center"
                  prop="rrg"
                  show-overflow-tooltip
                >
                  <template slot-scope="scope">
                    <div v-if="scope.row.rrg || scope.row.rrg == 0">
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
                <el-table-column
                  label="OI_C"
                  min-width="60"
                  align="center"
                  prop="oiC"
                  show-overflow-tooltip
                />
                <el-table-column
                  label="OI_E"
                  min-width="60"
                  align="center"
                  prop="oiE"
                  show-overflow-tooltip
                />
                <el-table-column
                  label="CS"
                  min-width="60"
                  align="center"
                  prop="cs"
                  show-overflow-tooltip
                />
                <el-table-column
                  label="ORG"
                  min-width="60"
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
                <el-table-column
                  label="少子寿命"
                  min-width="90"
                  align="center"
                  prop="minorityCarrierLifetime"
                  show-overflow-tooltip
                >
                  <template slot-scope="scope">
                    <div
                      :style="{
                        color: getFontColorByBackgroundColor(
                          getControlColor(
                            '少子寿命',
                            scope.row.minorityCarrierLifetime,
                            'default'
                          )
                        ),
                        background: getControlColor(
                          '少子寿命',
                          scope.row.minorityCarrierLifetime,
                          'default'
                        ),
                      }"
                    >
                      {{ scope.row.minorityCarrierLifetime }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  label="常规缺陷"
                  min-width="100"
                  align="center"
                  prop="flaw"
                  show-overflow-tooltip
                />
                <el-table-column
                  label="OSF密度"
                  min-width="90"
                  align="center"
                  prop="osf"
                  show-overflow-tooltip
                />
                <el-table-column
                  label="基磷"
                  min-width="70"
                  align="center"
                  prop="phosphorus"
                  show-overflow-tooltip
                />
                <el-table-column
                  label="基硼"
                  min-width="70"
                  align="center"
                  prop="boron"
                  show-overflow-tooltip
                />
                <el-table-column
                  label="基砷"
                  min-width="70"
                  align="center"
                  prop="arsenic"
                  show-overflow-tooltip
                />
                <el-table-column
                  label="基锑"
                  min-width="70"
                  align="center"
                  prop="antimony"
                  show-overflow-tooltip
                />
                <el-table-column
                  label="检测人员"
                  min-width="90"
                  align="center"
                  prop="inspector"
                  show-overflow-tooltip
                />
                <el-table-column
                  label="检测日期"
                  min-width="150"
                  align="center"
                  prop="checkDate"
                  show-overflow-tooltip
                />
              </el-table>
            </div>
          </el-collapse-item>
        </el-collapse>
        <el-form
          ref="formRef"
          :model="formData"
          label-position="left"
          label-width="100px"
          :rules="formRules"
          :disabled="$route.query.view"
        >
          <div class="form">
            <div class="form-title">分段信息</div>
            <el-table
              :data="formData.segmentedInstructionDetailVos"
              class="table"
              :header-cell-style="{
                background: 'rgba(242, 242, 242)',
                color: '#606266',
              }"
              max-height="350px"
            >
              <el-table-column
                label="晶锭/回收料/样片编号"
                min-width="220"
                align="center"
                show-overflow-tooltip
              >
                <template slot="header">
                  <el-button
                    type="text"
                    icon="el-icon-plus"
                    circle
                    size="small"
                    @click="handleAddDialogShow(null)"
                  ></el-button>
                  <span>晶锭/回收料/样片编号</span>
                </template>
                <template slot-scope="scope">
                  <div class="segment-table">
                    <div v-if="scope.row.segmentNo">
                      {{ scope.row.segmentNo }}
                    </div>
                    <div v-else>
                      <div class="get-btn" @click="handleCodeClick">
                        获取晶锭/回收料/样片编号
                      </div>
                    </div>
                    <div
                      class="segment-add-btn"
                      v-if="scope.$index !== 0"
                      @click="handleAddDialogShow(scope.$index)"
                    >
                      +
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                label="类型"
                min-width="65"
                align="center"
                prop="type"
                :formatter="formatSegmentType"
                show-overflow-tooltip
              />
              <el-table-column
                label="下发工单"
                min-width="120"
                align="center"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <el-input
                    v-if="scope.row.type === 0"
                    v-model="scope.row.orderCode"
                    @focus="handleWorkOrderFocus(scope.$index)"
                    clearable
                    readonly
                  />
                </template>
              </el-table-column>
              <el-table-column
                label="流程编号"
                min-width="120"
                align="center"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <el-select
                    v-if="scope.row.type === 0"
                    v-model="scope.row.processCode"
                    @visible-change="
                      (val) => handleProcessCodeVisibleChange(val, scope.$index)
                    "
                    @change="
                      (val) => handleProcessCodeChange(val, scope.$index)
                    "
                    clearable
                  >
                    <el-option
                      :label="item.processCode"
                      :value="item.processCode"
                      :key="item.processCode"
                      v-for="item in scope.row.processList"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                label="尺寸"
                min-width="60"
                align="center"
                prop="diameter"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  {{ scope.row.diameter }}寸
                </template>
              </el-table-column>
              <el-table-column
                label="直径"
                min-width="100"
                align="center"
                prop="diametermm"
              >
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.diametermm"
                    v-direction="{ x: 1, y: scope.$index }"
                    :disabled="scope.row.type !== 0"
                    v-trim
                  >
                    <template slot="append">mm</template>
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column
                label="晶锭段位"
                min-width="90"
                align="center"
                prop="segmentNum"
              >
                <template slot-scope="scope">
                  <div v-if="scope.row.type === 0">
                    {{ scope.row.segmentNum }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="头部位置" min-width="100" align="center">
                <template slot-scope="scope">
                  <el-input
                    :disabled="scope.row.type !== 0 && !scope.row.new"
                    v-model="scope.row.headPosition"
                    @change="(value) => handleHeadChange(value, scope.$index)"
                    v-direction="{ x: 2, y: scope.$index }"
                    v-trim
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column label="尾部位置" min-width="100" align="center">
                <template slot-scope="scope">
                  <el-input
                    :disabled="scope.row.type !== 0 && !scope.row.new"
                    v-model="scope.row.tailPosition"
                    @change="(value) => handleTailChange(value, scope.$index)"
                    v-direction="{ x: 3, y: scope.$index }"
                    v-trim
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column
                label="晶锭长度"
                min-width="100"
                align="center"
                prop="length"
                show-overflow-tooltip
              />
              <el-table-column
                label="计划重量"
                min-width="100"
                align="center"
                prop="planWeight"
                show-overflow-tooltip
              />
              <el-table-column
                label="计算位置"
                min-width="100"
                align="center"
                prop="calculatedPosition"
              >
                <template slot-scope="scope">
                  <el-input
                    v-if="scope.row.type === 0"
                    v-model="scope.row.calculatedPosition"
                    @change="(value) => calcResistivity(value, scope.$index)"
                    v-direction="{ x: 4, y: scope.$index }"
                    v-trim
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column
                label="计算电阻率"
                min-width="100"
                align="center"
                prop="calculatedResistivity"
              >
                <template slot-scope="scope">
                  <el-input
                    v-if="scope.row.type === 0"
                    v-model="scope.row.calculatedResistivity"
                    @change="(value) => calcPosition(value, scope.$index)"
                    v-direction="{ x: 5, y: scope.$index }"
                    v-trim
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column
                label="头部电阻率"
                min-width="100"
                align="center"
                prop="headResistance"
              >
                <template slot-scope="scope">
                  <el-input
                    :style="{
                      '--controlColor': getControlColor(
                        '头部电阻率',
                        scope.row.headResistance,
                        scope.row.orderCode
                      ),
                      '--textColor': getFontColorByBackgroundColor(
                        getControlColor(
                          '头部电阻率',
                          scope.row.headResistance,
                          scope.row.orderCode
                        )
                      ),
                    }"
                    v-if="scope.row.type === 0"
                    v-model="scope.row.headResistance"
                    v-direction="{ x: 8, y: scope.$index }"
                    v-trim
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column
                label="尾部电阻率"
                min-width="100"
                align="center"
                prop="tailResistance"
              >
                <template slot-scope="scope">
                  <el-input
                    :style="{
                      '--controlColor': getControlColor(
                        '尾部电阻率',
                        scope.row.tailResistance,
                        scope.row.orderCode
                      ),
                      '--textColor': getFontColorByBackgroundColor(
                        getControlColor(
                          '尾部电阻率',
                          scope.row.tailResistance,
                          scope.row.orderCode
                        )
                      ),
                    }"
                    v-if="scope.row.type === 0"
                    v-model="scope.row.tailResistance"
                    v-direction="{ x: 9, y: scope.$index }"
                    v-trim
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column
                label="头部电阻率实测"
                min-width="140"
                align="center"
                prop="headResistanceActual"
              />
              <el-table-column
                label="尾部电阻率实测"
                min-width="140"
                align="center"
                prop="tailResistanceActual"
              />
              <el-table-column
                label="头边缘电阻率"
                min-width="120"
                align="center"
                prop="headResistanceEdge"
              >
                <template slot-scope="scope">
                  <el-input
                    :style="{
                      '--controlColor': getControlColor(
                        '头边缘电阻率',
                        scope.row.headResistanceEdge,
                        scope.row.orderCode
                      ),
                      '--textColor': getFontColorByBackgroundColor(
                        getControlColor(
                          '头边缘电阻率',
                          scope.row.headResistanceEdge,
                          scope.row.orderCode
                        )
                      ),
                    }"
                    v-if="scope.row.type === 0"
                    v-model="scope.row.headResistanceEdge"
                    v-direction="{ x: 10, y: scope.$index }"
                    v-trim
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column
                label="尾边缘电阻率"
                min-width="120"
                align="center"
                prop="tailResistanceEdge"
              >
                <template slot-scope="scope">
                  <el-input
                    :style="{
                      '--controlColor': getControlColor(
                        '尾边缘电阻率',
                        scope.row.tailResistanceEdge,
                        scope.row.orderCode
                      ),
                      '--textColor': getFontColorByBackgroundColor(
                        getControlColor(
                          '尾边缘电阻率',
                          scope.row.tailResistanceEdge,
                          scope.row.orderCode
                        )
                      ),
                    }"
                    v-if="scope.row.type === 0"
                    v-model="scope.row.tailResistanceEdge"
                    v-direction="{ x: 11, y: scope.$index }"
                    v-trim
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column
                label="79oi头"
                min-width="100"
                align="center"
                prop="head79oi"
              >
                <template slot="header">
                  <div class="form-table-header">79oi头</div>
                </template>
                <template slot-scope="scope">
                  <div class="form-custom-verify">
                    <el-form-item
                      label=""
                      label-width="0px"
                      :prop="
                        'segmentedInstructionDetailVos.' +
                        scope.$index +
                        '.head79oi'
                      "
                      :rules="[
                        {
                          required: true,
                          message: ' ',
                          trigger: 'change',
                        },
                      ]"
                      class="form-input"
                    >
                      <el-input
                        :style="{
                          '--controlColor': getControlColor(
                            '79oi头',
                            scope.row.head79oi,
                            scope.row.orderCode
                          ),
                          '--textColor': getFontColorByBackgroundColor(
                            getControlColor(
                              '79oi头',
                              scope.row.head79oi,
                              scope.row.orderCode
                            )
                          ),
                        }"
                        v-model="scope.row.head79oi"
                        @change="
                          (val) => handleOiChange('head', scope.$index, val)
                        "
                        v-direction="{ x: 12, y: scope.$index }"
                        v-trim
                      ></el-input>
                    </el-form-item>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                label="79oi尾"
                min-width="100"
                align="center"
                prop="tail79oi"
              >
                <template slot="header">
                  <div class="form-table-header">79oi尾</div>
                </template>
                <template slot-scope="scope">
                  <div class="form-custom-verify">
                    <el-form-item
                      label=""
                      label-width="0px"
                      :prop="
                        'segmentedInstructionDetailVos.' +
                        scope.$index +
                        '.tail79oi'
                      "
                      :rules="[
                        {
                          required: true,
                          message: ' ',
                          trigger: 'change',
                        },
                      ]"
                      class="form-input"
                    >
                      <el-input
                        :style="{
                          '--controlColor': getControlColor(
                            '79oi尾',
                            scope.row.tail79oi,
                            scope.row.orderCode
                          ),
                          '--textColor': getFontColorByBackgroundColor(
                            getControlColor(
                              '79oi尾',
                              scope.row.tail79oi,
                              scope.row.orderCode
                            )
                          ),
                        }"
                        v-model="scope.row.tail79oi"
                        @change="
                          (val) => handleOiChange('tail', scope.$index, val)
                        "
                        v-direction="{ x: 13, y: scope.$index }"
                        v-trim
                      ></el-input>
                    </el-form-item>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                label="83oi头"
                min-width="90"
                align="center"
                prop="head83oi"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <div>
                    {{ scope.row.head83oi }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                label="83oi尾"
                min-width="90"
                align="center"
                prop="tail83oi"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <div>
                    {{ scope.row.tail83oi }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                label="头碳含量"
                min-width="90"
                align="center"
                prop="headCarbonRate"
              >
                <template slot-scope="scope">
                  <el-input
                    :style="{
                      '--controlColor': getControlColor(
                        '头碳含量',
                        scope.row.headCarbonRate,
                        scope.row.orderCode
                      ),
                      '--textColor': getFontColorByBackgroundColor(
                        getControlColor(
                          '头碳含量',
                          scope.row.headCarbonRate,
                          scope.row.orderCode
                        )
                      ),
                    }"
                    v-if="scope.row.type === 0"
                    v-model="scope.row.headCarbonRate"
                    v-direction="{ x: 14, y: scope.$index }"
                    v-trim
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column
                label="尾碳含量"
                min-width="100"
                align="center"
                prop="tailCarbonRate"
              >
                <template slot-scope="scope">
                  <div class="form-custom-verify">
                    <el-form-item
                      label=""
                      label-width="0px"
                      :prop="
                        'segmentedInstructionDetailVos.' +
                        scope.$index +
                        '.tailCarbonRate'
                      "
                      :rules="[
                        {
                          required:
                            scope.row.type === 0 &&
                            scope.$index === lastSegmentIndex,
                          message: ' ',
                          trigger: 'change',
                        },
                      ]"
                      class="form-input"
                    >
                      <el-input
                        :style="{
                          '--controlColor': getControlColor(
                            '尾碳含量',
                            scope.row.tailCarbonRate,
                            scope.row.orderCode
                          ),
                          '--textColor': getFontColorByBackgroundColor(
                            getControlColor(
                              '尾碳含量',
                              scope.row.tailCarbonRate,
                              scope.row.orderCode
                            )
                          ),
                        }"
                        v-if="scope.row.type === 0"
                        v-model="scope.row.tailCarbonRate"
                        v-direction="{ x: 15, y: scope.$index }"
                        v-trim
                      ></el-input>
                    </el-form-item>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                label="RRV头"
                min-width="100"
                align="center"
                prop="headRrv"
              >
                <template slot-scope="scope">
                  <el-input
                    :style="{
                      '--controlColor': getControlColor(
                        'RRV头',
                        Math.abs(scope.row.headRrv || 0),
                        scope.row.orderCode
                      ),
                      '--textColor': getFontColorByBackgroundColor(
                        getControlColor(
                          'RRV头',
                          Math.abs(scope.row.headRrv || 0),
                          scope.row.orderCode
                        )
                      ),
                    }"
                    v-if="scope.row.type === 0"
                    v-model="scope.row.headRrv"
                    v-direction="{ x: 16, y: scope.$index }"
                    v-trim
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column
                label="RRV尾"
                min-width="100"
                align="center"
                prop="tailRrv"
              >
                <template slot-scope="scope">
                  <el-input
                    :style="{
                      '--controlColor': getControlColor(
                        'RRV尾',
                        Math.abs(scope.row.tailRrv || 0),
                        scope.row.orderCode
                      ),
                      '--textColor': getFontColorByBackgroundColor(
                        getControlColor(
                          'RRV尾',
                          Math.abs(scope.row.tailRrv || 0),
                          scope.row.orderCode
                        )
                      ),
                    }"
                    v-if="scope.row.type === 0"
                    v-model="scope.row.tailRrv"
                    v-direction="{ x: 17, y: scope.$index }"
                    v-trim
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column
                label="说明"
                min-width="180"
                align="center"
                prop="remarks"
              >
                <template slot-scope="scope">
                  <el-input
                    v-if="scope.row.type === 0"
                    v-model="scope.row.remarks"
                    v-direction="{ x: 18, y: scope.$index }"
                    v-trim
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column label="合格状态" min-width="100" align="center">
                <template slot="header">
                  <div class="form-table-header">合格状态</div>
                </template>
                <template slot-scope="scope">
                  <div class="form-custom-verify">
                    <el-form-item
                      label=""
                      label-width="0px"
                      :prop="
                        'segmentedInstructionDetailVos.' +
                        scope.$index +
                        '.status'
                      "
                      :rules="[
                        {
                          required: scope.row.type === 0,
                          message: ' ',
                          trigger: 'change',
                        },
                      ]"
                      class="form-input"
                    >
                      <el-select
                        v-if="scope.row.type === 0"
                        v-model="scope.row.status"
                        @change="(val) => handleStatusChange(val, scope.$index)"
                      >
                        <el-option label="合格" :value="1"></el-option>
                        <el-option label="不合格" :value="0"></el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                label="合格长度"
                min-width="90"
                align="center"
                prop="qualifiedLength"
                show-overflow-tooltip
              />
              <el-table-column
                label="合格重量"
                min-width="90"
                align="center"
                prop="qualifiedWeight"
                show-overflow-tooltip
              />
              <el-table-column
                label="不合格原因"
                min-width="200"
                align="center"
                prop="_reason"
              >
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row._reason"
                    clearable
                    v-if="scope.row.type === 0"
                    multiple
                    collapse-tags
                    @change="(val) => handleReasonChange(val, scope.$index)"
                  >
                    <el-option
                      :label="item.label"
                      :value="item.value"
                      v-for="item in wipStorageDisqualificationReasonList"
                      :key="item.value"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                label="入库原因"
                min-width="150"
                align="center"
                prop="reasonIn"
              >
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.reasonIn"
                    clearable
                    v-if="scope.row.type === 0"
                  >
                    <el-option
                      :label="item.label"
                      :value="item.value"
                      v-for="item in wipStorageInStorageReasonList"
                      :key="item.value"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    style="color: red"
                    class="el-icon-delete table-btn"
                    @click="deleteSegmentedInfo(scope.$index)"
                  />
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="form">
            <div class="form-title">分段示意图</div>
            <div class="chart">
              <div
                class="chart-item"
                v-for="(item, index) in formData.segmentedInstructionDetailVos"
                :key="index"
                :style="{
                  width: getChartWidth(item.headPosition, item.tailPosition),
                  left: getChartLeft(item.headPosition),
                }"
              >
                <div
                  class="chart-box"
                  v-if="!segmentError(item.headPosition, item.tailPosition)"
                >
                  <div
                    v-if="
                      (item.headPosition || item.headPosition === 0) &&
                      (item.tailPosition || item.tailPosition === 0)
                    "
                  >
                    <div class="number">
                      <div v-if="index === 0" class="headPosition">
                        <div>{{ item.headPosition }}</div>
                        <div><i class="el-icon-caret-bottom"></i></div>
                      </div>
                      <div class="tailPosition">
                        <div>{{ item.tailPosition }}</div>
                        <div><i class="el-icon-caret-bottom"></i></div>
                      </div>
                    </div>
                    <div
                      :class="{
                        bar: true,
                        'bar-selected': selectedIndex === index,
                      }"
                      @click="handleSegmentedBarClick(index)"
                      :id="`bar_${index}`"
                    >
                      <div class="center">
                        <span class="text">
                          {{ item.segmentNo }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="measurement">
              <div
                class="ceil"
                :key="item"
                v-for="(item, index) in measurements"
                :style="{ borderLeft: index === 0 ? '1px solid' : 'none' }"
              >
                <div>{{ item }}</div>
                <div class="left-number" v-if="index === 0">
                  {{ measurementHeadIndex * 50 }}
                </div>
                <div class="right-number" v-if="index % 2 == 1">
                  {{ (measurementHeadIndex + index + 1) * 50 }}
                </div>
              </div>
            </div>
            <div class="detail-container" id="detail-container">
              <div
                :class="{
                  detail: true,
                  'detail-selected': selectedIndex === index,
                }"
                :style="{
                  marginLeft: index === 0 ? '0px' : detailMarginOffset + 'px',
                  zIndex: selectedIndex === index ? 999 : index,
                }"
                v-for="(item, index) in formData.segmentedInstructionDetailVos"
                :key="index"
                :id="`detail_${index}`"
                @click="handleSegmentedBarClick(index)"
              >
                <div class="item" v-if="item.type === 0">
                  <div class="label">晶锭编号：</div>
                  <div class="value">{{ item.segmentNo }}</div>
                </div>
                <div class="item" v-if="item.type === 1">
                  <div class="label">样片编号：</div>
                  <div class="value">{{ item.segmentNo }}</div>
                </div>
                <div class="item" v-if="item.type === 2">
                  <div class="label">回收料编号：</div>
                  <div class="value">{{ item.segmentNo }}</div>
                </div>
                <div class="item">
                  <div class="label">尺寸：</div>
                  <div class="value">{{ item.diameter }}</div>
                </div>
                <div class="item">
                  <div class="label">直径：</div>
                  <div class="value">{{ item.diametermm }}</div>
                </div>
                <div class="item">
                  <div class="label">晶锭长度：</div>
                  <div class="value">{{ item.length }}</div>
                </div>
                <div class="item">
                  <div class="label">计划重量：</div>
                  <div class="value">{{ item.planWeight }}</div>
                </div>
                <div class="item" v-if="item.type === 0">
                  <div class="label">计算位置：</div>
                  <div class="value">{{ item.calculatedPosition }}</div>
                </div>
                <div class="item" v-if="item.type === 0">
                  <div class="label">计算电阻率：</div>
                  <div class="value">{{ item.calculatedResistivity }}</div>
                </div>
                <div class="item" v-if="item.type === 0">
                  <div class="label">头部电阻率：</div>
                  <div class="value">{{ item.headResistance }}</div>
                </div>
                <div class="item" v-if="item.type === 0">
                  <div class="label">尾部电阻率：</div>
                  <div class="value">{{ item.tailResistance }}</div>
                </div>
                <div class="item" v-if="item.type === 0">
                  <div class="label">头部电阻率实测：</div>
                  <div class="value">{{ item.headResistanceActual }}</div>
                </div>
                <div class="item" v-if="item.type === 0">
                  <div class="label">尾部电阻率实测：</div>
                  <div class="value">{{ item.tailResistanceActual }}</div>
                </div>
                <div class="item" v-if="item.type === 0">
                  <div class="label">79oi头：</div>
                  <div class="value">{{ item.head79oi }}</div>
                </div>
                <div class="item" v-if="item.type === 0">
                  <div class="label">79oi尾：</div>
                  <div class="value">{{ item.tail79oi }}</div>
                </div>
                <div class="item" v-if="item.type === 0">
                  <div class="label">83oi头：</div>
                  <div class="value">{{ item.head83oi }}</div>
                </div>
                <div class="item" v-if="item.type === 0">
                  <div class="label">83oi尾：</div>
                  <div class="value">{{ item.tail83oi }}</div>
                </div>
                <div class="item" v-if="item.type === 0">
                  <div class="label">合格状态：</div>
                  <div class="value">
                    {{ item.status === 1 ? "合格" : "不合格" }}
                  </div>
                </div>
                <div class="item" v-if="item.type === 0">
                  <div class="label">合格长度：</div>
                  <div class="value">{{ item.qualifiedLength }}</div>
                </div>
                <div class="item" v-if="item.type === 0">
                  <div class="label">合格重量：</div>
                  <div class="value">{{ item.qualifiedWeight }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="form">
            <div class="form-title">留档文档记录</div>
            <div class="growth-section">
              <el-form-item label-width="0px" prop="_files">
                <PhotoNew
                  v-model="formData._files"
                  :componentDisabled="false"
                  :name="'CHECK_DEVICE'"
                  default-direction="vertical"
                  @input="handleFileChange"
                />
              </el-form-item>
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
    <el-dialog :visible.sync="workOrderDialog" title="工单列表" width="80%">
      <el-table
        :data="workOrderList"
        :header-cell-style="{
          background: 'rgba(242, 242, 242)',
          color: '#606266',
        }"
        @row-click="rowClick"
      >
        <el-table-column label="选择" width="80" fixed>
          <template slot-scope="scope">
            <el-radio v-model="selectedWorkOrder" :label="scope.row.workOrderNo"
              ><i />
            </el-radio>
          </template>
        </el-table-column>
        <el-table-column
          label="工单编号"
          min-width="120"
          align="center"
          prop="workOrderNo"
        />
        <el-table-column
          key="factoryNo"
          prop="factoryNo"
          label="工厂编号"
          width="140"
        />
        <el-table-column
          :formatter="formatErpType"
          key="erpWorkOrderType"
          prop="erpWorkOrderType"
          label="工单类型"
          width="120"
        />
        <el-table-column
          key="workOrderTypeName"
          prop="transMap.workOrderTypeName"
          label="工单生产类型"
          width="120"
        />
        <el-table-column
          key="customerOrderNo"
          prop="customerOrderNo"
          label="订单编号"
          width="120"
        />
        <el-table-column
          key="customerNo"
          prop="customerNo"
          label="客户编号"
          width="120"
        />
        <el-table-column
          key="productName"
          prop="productName"
          label="产品名称"
          width="200"
        />
        <el-table-column
          key="productNo"
          prop="productNo"
          label="产品编号"
          width="120"
        />
        <el-table-column
          key="productVersion"
          prop="productVersion"
          label="产品版本"
          width="90"
        />
        <el-table-column key="qty" prop="qty" label="工单数量" width="90" />
        <el-table-column
          key="qualifiedWeight"
          prop="qualifiedWeight"
          label="分段合格数量"
          width="120"
        />
        <el-table-column key="unit" prop="unit" label="工单单位" width="90" />
        <el-table-column
          key="planFinishDate"
          prop="planFinishDate"
          label="预计完工时间"
          width="180"
        />
        <el-table-column
          key="description"
          prop="description"
          label="工单说明"
          min-width="200"
        />
        <el-table-column
          key="gmtCreate"
          prop="gmtCreate"
          label="创建时间"
          width="180"
        />
        <el-table-column
          key="userCreate"
          prop="userCreate"
          label="创建人"
          width="140"
          show-overflow-tooltip
        />
        <el-table-column
          key="gmtUpdate"
          prop="gmtUpdate"
          label="修改时间"
          width="180"
        />
        <el-table-column
          key="userUpdate"
          prop="userUpdate"
          label="修改人"
          width="140"
        />
        <el-table-column
          key="status"
          prop="status"
          label="工单状态"
          width="90"
          fixed="right"
        >
          <template slot-scope="{ row }">
            <span v-if="row.status"
              ><i class="icon-dot" style="background-color: #67c23a"></i
              >开启</span
            >
            <span v-else
              ><i class="icon-dot" style="background-color: #909399"></i
              >关闭</span
            >
          </template>
        </el-table-column>
        <el-table-column
          key="scheduleStatus"
          prop="scheduleStatus"
          label="排产状态"
          width="90"
          fixed="right"
        >
          <template slot-scope="{ row }">
            <template v-if="!row.status">
              <span v-if="row.scheduleStatus"
                ><i class="icon-dot" style="background-color: #67c23a"></i
                >可排产</span
              >
              <span v-else
                ><i class="icon-dot" style="background-color: #909399"></i
                >不可排产</span
              >
            </template>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="addDialog" title="新增" width="400px">
      <el-form :model="temp">
        <el-form-item label="类型" label-width="80px">
          <el-select v-model="temp.type" style="width: 100%">
            <el-option label="晶段" :value="0" />
            <el-option label="样片" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="addIndex === null"
          label="新增位置"
          label-width="80px"
        >
          <el-select v-model="temp.position" style="width: 100%">
            <el-option label="最前" value="最前" />
            <el-option label="最后" value="最后" />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleAdd">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as Api from "@/api/inStation";
import { cloneDeep, isEmpty, get } from "lodash-es";
import { getSeleteData } from "@/utils/select";
import overStation from "@/mixins/overStation";
import PhotoNew from "@/views/components/photoNew";
import LeaderLine from "@/plugins/leader-line.min.js";
import { getMateralModelExtras } from "@/api/factory/materialModel";
import { getFontColorByBackgroundColor } from "@/utils/color";
import { getCurrentWipStorageClearData } from "@/api/overStation/overStation.js";

const defaultTemp = {
  type: 0,
  position: "最后",
};

export default {
  mixins: [overStation],
  components: {
    PhotoNew,
  },
  data() {
    return {
      getFontColorByBackgroundColor,
      formData: {
        userCreate: null,
        length: null,
        number: null,
        segmentedInstructionDetailVos: [],
        _files: [],
      },
      formRules: {
        userCreate: [
          { required: true, message: "操作者不能为空", trigger: "change" },
        ],
        length: [
          { required: true, message: "长度不能为空", trigger: "change" },
        ],
        number: [
          { required: true, message: "数量不能为空", trigger: "change" },
        ],
        _files: [
          {
            required: true,
            message: "留档文档记录不能为空",
            trigger: "change",
          },
        ],
      },
      selectedIndex: null,
      wipStorageDisqualificationReasonList: [],
      wipStorageInStorageReasonList: [],
      processMap: {},
      checkInfo: [],
      workOrderList: [],
      selectedSegmentWorkOrderIndex: null,
      workOrderDialog: false,
      selectedWorkOrder: null,
      erpWorkOrderTypeList: [], // ERP工单类型 list
      activeName: "checkInfo",
      segmentTypeList: [],
      selectRollingDiameter: null,
      diameterList: [],
      kValueList: [],
      lineList: [],
      detailMarginOffset: 0,
      headAndTailOi: {
        head79oi: null,
        head83oi: null,
        tail79oi: null,
        tail83oi: null,
      },
      headAndTailRrv: {
        headRrv: null,
        tailRrv: null,
      },
      controlList: [
        {
          key: "headResistance",
          name: "头部电阻率",
          from: "formData.segmentedInstructionDetailVos",
        },
        {
          key: "tailResistance",
          name: "尾部电阻率",
          from: "formData.segmentedInstructionDetailVos",
        },
        {
          key: "head79oi",
          name: "79oi头",
          from: "formData.segmentedInstructionDetailVos",
        },
        {
          key: "tail79oi",
          name: "79oi尾",
          from: "formData.segmentedInstructionDetailVos",
        },
        {
          key: "headCarbonRate",
          name: "头碳含量",
          from: "formData.segmentedInstructionDetailVos",
        },
        {
          key: "tailCarbonRate",
          name: "尾碳含量",
          from: "formData.segmentedInstructionDetailVos",
        },
        {
          key: "minorityCarrierLifetime",
          name: "少子寿命",
          from: "checkInfo",
        },
        {
          key: "headRrv",
          name: "RRV头",
          from: "formData.segmentedInstructionDetailVos",
        },
        {
          key: "tailRrv",
          name: "RRV尾",
          from: "formData.segmentedInstructionDetailVos",
        },
      ],
      controlMap: {
        default: {},
      },
      addDialog: false,
      addIndex: null,
      temp: Object.assign({}, defaultTemp),
    };
  },
  computed: {
    buffParams() {
      const { processUuid, processingOrderCode } = this.$route.query;
      return { processUuid, processingOrderCode };
    },
    totalLength() {
      return (this.measurementTailIndex - this.measurementHeadIndex) * 50;
    },
    measurementHeadIndex() {
      let list = this.formData.segmentedInstructionDetailVos;
      if (list.length === 0) return 0;
      let headPosition = list[0].headPosition || 0;
      return Math.floor(headPosition / 50);
    },
    measurementTailIndex() {
      let list = this.formData.segmentedInstructionDetailVos;
      if (list.length === 0) return 0;
      let headPosition = Number(list[list.length - 1].headPosition || 0);
      let tailPosition = Number(list[list.length - 1].tailPosition || 0);
      let currentPosition =
        tailPosition > headPosition ? tailPosition : headPosition;
      return Math.ceil(currentPosition / 50);
    },
    measurements() {
      let list = [];
      for (
        let index = this.measurementHeadIndex;
        index < this.measurementTailIndex;
        index++
      ) {
        let charIndex = index % 20;
        list.push(String.fromCharCode(65 + charIndex));
      }
      return list;
    },
    headResistance() {
      let reverseDetails = (cloneDeep(this.checkInfo) || []).reverse();
      return reverseDetails.find(
        (item) => item.type === "头尾样片" && item.sampleIdentification === "H"
      ).resC;
    },
    tailResistance() {
      let reverseDetails = (cloneDeep(this.checkInfo) || []).reverse();
      return reverseDetails.find(
        (item) => item.type === "头尾样片" && item.sampleIdentification === "T"
      ).resC;
    },
    headCS() {
      let reverseDetails = (cloneDeep(this.checkInfo) || []).reverse();
      return (
        reverseDetails.find(
          (item) =>
            item.type === "头尾样片" && item.sampleIdentification === "H"
        ) || {}
      ).cs;
    },
    lastSegmentIndex() {
      let reverseDetails = (
        cloneDeep(this.formData.segmentedInstructionDetailVos) || []
      ).reverse();
      return (
        reverseDetails.length -
        reverseDetails.findIndex((item) => item.type === 0) -
        1
      );
    },
  },
  created() {
    this.initKeyup();
  },
  mounted() {
    this.init();
    getSeleteData("erpWorkOrderType", this.erpWorkOrderTypeList); // ERP工单类型 list
    getSeleteData("kValue", this.kValueList);
    window.addEventListener("resize", this.handleResize);
  },
  destroyed() {
    for (const line of this.lineList) {
      line.remove();
    }
    window.removeEventListener("resize", this.handleResize);
  },
  watch: {
    "formData.segmentedInstructionDetailVos": {
      immediate: true,
      deep: true,
      handler(val) {
        this.$nextTick(() => {
          this.calcDetailMarginOffset();

          for (const line of this.lineList) {
            line.remove();
          }
          this.lineList = [];

          this.$nextTick(() => {
            val.forEach((item, index) => {
              if (!item.segmentNo) return;

              let line = new LeaderLine(
                document.getElementById(`bar_${index}`),
                document.getElementById(`detail_${index}`),
                {
                  startSocket: "bottom",
                  endSocket: "top",
                  color: "#B0B0B0",
                  size: 1.5,
                  positionByWindowResize: false,
                  path: "straight",
                }
              );
              this.lineList.push(line);
            });
          });
        });
      },
    },
  },
  methods: {
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
    handleResize() {
      this.calcDetailMarginOffset();
      for (const line of this.lineList) {
        line.position();
      }
    },
    calcDetailMarginOffset() {
      let length = this.formData.segmentedInstructionDetailVos.length;
      let minWidth = length * 240 + (length - 1) * 10;
      let currentWidth =
        document.getElementById("detail-container").offsetWidth;

      if (currentWidth >= minWidth) this.detailMarginOffset = 0;
      else this.detailMarginOffset = -(minWidth - currentWidth) / (length - 1);
    },
    rowClick(row) {
      this.selectedWorkOrder = row.workOrderNo;
      this.selectRollingDiameter = row.rollingDiameter || row.growthDiameter;
    },
    async handleWorkOrderFocus(index) {
      if (this.workOrderDialog) return;
      this.selectedSegmentWorkOrderIndex = index;
      this.workOrderDialog = true;
      this.selectedWorkOrder = null;
      this.selectRollingDiameter = null;

      let item = this.formData.segmentedInstructionDetailVos[index];
      let { dopAnt, pnType, processOrderCode } = this.formData;
      let res = await Api.getIssueWorkOrder({
        dopAnt,
        pnType,
        processingOrderCode: processOrderCode,
        resistanceHead: item.headResistance,
        resistanceTail: item.tailResistance,
        waferSize: item.diameter,
      });
      this.workOrderList = res.data;
    },
    handleCancel() {
      this.workOrderDialog = false;
    },
    async handleConfirm() {
      if (this.selectRollingDiameter)
        this.$set(
          this.formData.segmentedInstructionDetailVos[
            this.selectedSegmentWorkOrderIndex
          ],
          "diametermm",
          this.selectRollingDiameter
        );
      this.$set(
        this.formData.segmentedInstructionDetailVos[
          this.selectedSegmentWorkOrderIndex
        ],
        "orderCode",
        this.selectedWorkOrder
      );
      this.workOrderDialog = false;

      if (!this.selectedWorkOrder) return;

      let list = await getMateralModelExtras({
        workOrderNo: this.selectedWorkOrder,
      });

      this.updateControlMap(list, this.selectedWorkOrder);
    },
    updateControlMap(list, type) {
      this.controlList.forEach((control) => {
        let name = control.name;

        let minItem = {};
        let maxItem = {};

        if (name === "头部电阻率") {
          minItem = list.find((ele) => ele.keyVal === "C010") || {};
          maxItem = list.find((ele) => ele.keyVal === "C020") || {};
        }
        if (name === "尾部电阻率") {
          minItem = list.find((ele) => ele.keyVal === "C010") || {};
          maxItem = list.find((ele) => ele.keyVal === "C020") || {};
        }
        if (name === "RRV头") {
          let item = list.find((ele) => ele.keyVal === "C030") || {};
          if (item.value) {
            let symbol = item.value[0];
            let value = item.value.substring(1);
            if (symbol == "<" || symbol == "≤") maxItem = { ...item, value };
            if (symbol == ">" || symbol == "≥") minItem = { ...item, value };
          }
        }
        if (name === "RRV尾") {
          let item = list.find((ele) => ele.keyVal === "C030") || {};
          if (item.value) {
            let symbol = item.value[0];
            let value = item.value.substring(1);
            if (symbol == "<" || symbol == "≤") maxItem = { ...item, value };
            if (symbol == ">" || symbol == "≥") minItem = { ...item, value };
          }
        }
        if (name === "79oi头") {
          minItem = list.find((ele) => ele.keyVal === "C050") || {};
          maxItem = list.find((ele) => ele.keyVal === "C060") || {};
        }
        if (name === "79oi尾") {
          minItem = list.find((ele) => ele.keyVal === "C050") || {};
          maxItem = list.find((ele) => ele.keyVal === "C060") || {};
        }
        if (name === "头碳含量") {
          let item = list.find((ele) => ele.keyVal === "C070") || {};
          if (item.value) {
            let symbol = item.value[0];
            let value = item.value.substring(1);
            if (symbol == "<" || symbol == "≤") maxItem = { ...item, value };
            if (symbol == ">" || symbol == "≥") minItem = { ...item, value };
          }
        }
        if (name === "尾碳含量") {
          let item = list.find((ele) => ele.keyVal === "C070") || {};
          if (item.value) {
            let symbol = item.value[0];
            let value = item.value.substring(1);
            if (symbol == "<" || symbol == "≤") maxItem = { ...item, value };
            if (symbol == ">" || symbol == "≥") minItem = { ...item, value };
          }
        }
        if (name === "少子寿命") {
          let item = list.find((ele) => ele.keyVal === "C080") || {};
          if (item.value) {
            let symbol = item.value[0];
            let value = item.value.substring(1);
            if (symbol == "<" || symbol == "≤") maxItem = { ...item, value };
            if (symbol == ">" || symbol == "≥") minItem = { ...item, value };
          }
        }

        this.controlMap[type][name] = {
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
    async handleProcessCodeVisibleChange(visible, index) {
      if (!visible) return;
      let { processOrderCode } = this.formData;
      let res = await Api.getBranchRoutes({
        processingOrderCode: processOrderCode,
      });
      let list = cloneDeep(this.formData.segmentedInstructionDetailVos);
      list[index].processList = res.data;
      this.formData.segmentedInstructionDetailVos = list;
      let processMap = {};
      for (const item of res.data) {
        processMap[item.processCode] = item.processName;
      }
      this.processMap = processMap;
    },
    handleProcessCodeChange(val, index) {
      this.formData.segmentedInstructionDetailVos[index].processName =
        this.processMap[val];
    },
    async init() {
      this.fetchSwitchDict();
      getSeleteData(
        "wipStorageDisqualificationReason",
        this.wipStorageDisqualificationReasonList
      );
      getSeleteData(
        "wipStorageInStorageReason",
        this.wipStorageInStorageReasonList
      );
      getSeleteData("segmentType", this.segmentTypeList);
      await getSeleteData("diameter", this.diameterList);
      let fromData = {};
      // 查询保存的数据
      const res = await Api.fetchBuffer(this.buffParams);
      if (!this.$route.query.view && res.data) {
        fromData = res.data;
      } else {
        try {
          fromData = JSON.parse(this.$route.query.fromData);
        } catch (e) {
          console.log(e);
        }
      }
      this.formData = {
        ...this.formData,
        ...fromData,
      };

      this.handleInitData();
    },
    async handleInitData() {
      let ingotDetectionRes = await Api.fetchDetail({
        url: "/wipcrystalcheck",
        page: 1,
        rows: 10,
        search_EQ_processOrderCode:
          this.formData.crystalNo || this.formData.processOrderCode,
      });
      let list = ingotDetectionRes.data.rows;
      if (!isEmpty(list)) {
        this.checkInfo = list[0].details;
      }

      this.initOiAndRrv();

      let cloneSegmentedInstructionDetailVos;
      if (isEmpty(this.formData.segmentedInstructionDetailVos)) {
        cloneSegmentedInstructionDetailVos = (
          this.formData.wipCrystalCheckSampleRangeDtos || []
        ).map((item, index) => {
          let length = item.tail - item.head;

          let headOi = this.calcOi(item.head);
          let tailOi = this.calcOi(item.tail);

          let head79oi = headOi[0];
          let head83oi = headOi[1];
          let tail79oi = tailOi[0];
          let tail83oi = tailOi[1];

          if (index === 0) {
            head79oi = this.headAndTailOi.head79oi;
            head83oi = this.headAndTailOi.head83oi;
          }
          if (
            index ===
            this.formData.wipCrystalCheckSampleRangeDtos.length - 1
          ) {
            tail79oi = this.headAndTailOi.tail79oi;
            tail83oi = this.headAndTailOi.tail83oi;
          }

          const resistanceEdgeAndRrv = this.getResistanceEdgeAndRrv(
            item.head,
            item.tail
          );

          return {
            segmentNo: item.sampleNumber,
            type: item.type,
            headPosition: item.head,
            tailPosition: item.tail,
            length,
            headResistance: resistanceEdgeAndRrv.headResistance,
            tailResistance: resistanceEdgeAndRrv.tailResistance,
            diameter: this.formData.diameter,
            diametermm: this.formData.diametermm,
            planWeight: this.calcPlanWeight(length),
            head79oi,
            head83oi,
            tail79oi,
            tail83oi,
            headRrv: resistanceEdgeAndRrv.headRrv,
            tailRrv: resistanceEdgeAndRrv.tailRrv,
            headResistanceEdge: resistanceEdgeAndRrv.headResistanceEdge,
            tailResistanceEdge: resistanceEdgeAndRrv.tailResistanceEdge,
            _reason: [],
            reason: "",
            headCarbonRate: this.headCS,
          };
        });

        this.$set(
          this.formData,
          "segmentedInstructionDetailVos",
          cloneSegmentedInstructionDetailVos
        );
      } else {
        cloneSegmentedInstructionDetailVos =
          this.formData.segmentedInstructionDetailVos.map((item) => {
            const { reason, tailPosition, headPosition } = item;
            let length = tailPosition - headPosition;
            return {
              ...item,
              planWeight: this.$route.query.view
                ? item.planWeight
                : this.calcPlanWeight(length),
              _reason: reason ? reason.split(",") : [],
            };
          });
        this.$set(
          this.formData,
          "segmentedInstructionDetailVos",
          cloneSegmentedInstructionDetailVos
        );
      }

      if (cloneSegmentedInstructionDetailVos.some((item) => !item.segmentNo))
        this.handleCodeClick();

      const { photo } = this.formData;
      let photos = Array.isArray(photo) ? photo : JSON.parse(photo || "[]");
      this.formData._files = photos.map((fileItem) => ({
        ...fileItem,
        big_url: fileItem.fileUrl,
        thumb_url: fileItem.fileUrl,
      }));

      await this.getMateralModelExtras();
      this.$set(
        this.formData,
        "segmentedInstructionDetailVos",
        cloneDeep(this.formData.segmentedInstructionDetailVos)
      );
    },
    async handleCodeClick() {
      let { length } = this.formData;
      if (length === undefined || length === null) {
        this.$message.warning("长度为空");
        return;
      }

      let totalLength = (
        this.formData.segmentedInstructionDetailVos || []
      ).reduce((acc, cur) => acc + cur.length, 0);
      if (totalLength + "" == "NaN") {
        this.$message.warning("头部位置和尾部位置请填写完整");
        return;
      }
      // if (totalLength !== length) {
      //   this.$message.warning(
      //     `晶锭总长度需要和单晶长度一致,晶锭总长度:${totalLength}mm,单晶长度:${length}mm`
      //   );
      //   return;
      // }
      const { photo, ...rest } = this.formData;
      let res = await Api.segmentedInstructionGenerateNo(rest);
      let list = cloneDeep(this.formData.segmentedInstructionDetailVos);
      res.segmentedInstructionDetailVos.forEach((item, index) => {
        list[index].segmentNo = item.segmentNo;
        list[index].segmentNum = item.segmentNum;
        list[index].sampleIdentification = item.sampleIdentification;
        list[index].sampleNew = item.sampleNew;
        list[index].sampleType = item.sampleType;
      });
      this.formData.segmentedInstructionDetailVos = list;
    },
    handleAddDialogShow(index) {
      this.addIndex = index;
      this.temp = Object.assign({}, defaultTemp);
      this.addDialog = true;
    },
    handleAdd() {
      if (this.addIndex === null) this.addSegmentedInfo();
      else this.addSegmentedInfoByIndex(this.addIndex);
      this.addDialog = false;
    },
    addSegmentedInfo() {
      if (this.temp.position === "最前") {
        let headPosition = 0;
        let tailPosition = 0;
        let length = 0;
        let headOi = this.calcOi(headPosition);
        let tailOi = this.calcOi(tailPosition);

        const resistanceEdgeAndRrv = this.getResistanceEdgeAndRrv(
          headPosition,
          tailPosition
        );

        let item = {
          headPosition,
          tailPosition,
          length,
          type: this.temp.type,
          headResistance: resistanceEdgeAndRrv.headResistance,
          tailResistance: resistanceEdgeAndRrv.tailResistance,
          diameter: this.formData.diameter,
          diametermm: this.formData.diametermm,
          planWeight: this.calcPlanWeight(length),
          head79oi: headOi[0],
          head83oi: headOi[1],
          tail79oi: tailOi[0],
          tail83oi: tailOi[1],
          headRrv: resistanceEdgeAndRrv.headRrv,
          tailRrv: resistanceEdgeAndRrv.tailRrv,
          headResistanceEdge: resistanceEdgeAndRrv.headResistanceEdge,
          tailResistanceEdge: resistanceEdgeAndRrv.tailResistanceEdge,
          headCarbonRate: this.headCS,
          new: this.temp.type,
        };
        this.formData.segmentedInstructionDetailVos.unshift(item);
      } else {
        let list = this.formData.segmentedInstructionDetailVos;
        let headPosition;
        if (list.length === 0) headPosition = 0;
        else headPosition = list[list.length - 1].tailPosition;
        let headOi = this.calcOi(headPosition);

        const resistanceEdgeAndRrv = this.getResistanceEdgeAndRrv(
          headPosition,
          null
        );

        let item = {
          headPosition,
          type: this.temp.type,
          headResistance: resistanceEdgeAndRrv.headResistance,
          tailResistance: resistanceEdgeAndRrv.tailResistance,
          diameter: this.formData.diameter,
          diametermm: this.formData.diametermm,
          planWeight: 0,
          head79oi: headOi[0],
          head83oi: headOi[1],
          tail79oi: null,
          tail83oi: null,
          headRrv: resistanceEdgeAndRrv.headRrv,
          tailRrv: resistanceEdgeAndRrv.tailRrv,
          headResistanceEdge: resistanceEdgeAndRrv.headResistanceEdge,
          tailResistanceEdge: resistanceEdgeAndRrv.tailResistanceEdge,
          headCarbonRate: this.headCS,
          new: this.temp.type,
        };
        this.formData.segmentedInstructionDetailVos.push(item);
      }
    },
    addSegmentedInfoByIndex(index) {
      let list = this.formData.segmentedInstructionDetailVos;
      let headPosition = list[index - 1].tailPosition || 0;
      let tailPosition = list[index].headPosition || 0;
      let length = tailPosition - headPosition;
      let headOi = this.calcOi(headPosition);
      let tailOi = this.calcOi(tailPosition);

      const resistanceEdgeAndRrv = this.getResistanceEdgeAndRrv(
        headPosition,
        tailPosition
      );

      let item = {
        headPosition,
        tailPosition,
        length,
        planWeight: this.calcPlanWeight(length),
        type: this.temp.type,
        headResistance: resistanceEdgeAndRrv.headResistance,
        tailResistance: resistanceEdgeAndRrv.tailResistance,
        diameter: this.formData.diameter,
        diametermm: this.formData.diametermm,
        head79oi: headOi[0],
        head83oi: headOi[1],
        tail79oi: tailOi[0],
        tail83oi: tailOi[1],
        headRrv: resistanceEdgeAndRrv.headRrv,
        tailRrv: resistanceEdgeAndRrv.tailRrv,
        headResistanceEdge: resistanceEdgeAndRrv.headResistanceEdge,
        tailResistanceEdge: resistanceEdgeAndRrv.tailResistanceEdge,
        headCarbonRate: this.headCS,
        new: this.temp.type,
      };
      this.formData.segmentedInstructionDetailVos.splice(index, 0, item);
    },
    deleteSegmentedInfo(index) {
      let list = [...this.formData.segmentedInstructionDetailVos];
      list.splice(index, 1);
      this.formData.segmentedInstructionDetailVos = list;
    },
    handleSegmentedBarClick(index) {
      this.selectedIndex = index;
    },
    handleHeadChange(value, index) {
      let list = cloneDeep(this.formData.segmentedInstructionDetailVos);
      if (index !== 0) {
        list[index - 1].tailPosition = value;

        let headOi = this.calcOi(value);
        list[index].head79oi = headOi[0];
        list[index].head83oi = headOi[1];

        list[index - 1].tail79oi = headOi[0];
        list[index - 1].tail83oi = headOi[1];
      }

      for (const item of list) {
        if (item.type === 0) {
          item.segmentNo = null;

          const resistanceEdgeAndRrv = this.getResistanceEdgeAndRrv(
            item.headPosition,
            item.tailPosition
          );
          item.headResistance = resistanceEdgeAndRrv.headResistance;
          item.tailResistance = resistanceEdgeAndRrv.tailResistance;
          item.headRrv = resistanceEdgeAndRrv.headRrv;
          item.tailRrv = resistanceEdgeAndRrv.tailRrv;
          item.headResistanceEdge = resistanceEdgeAndRrv.headResistanceEdge;
          item.tailResistanceEdge = resistanceEdgeAndRrv.tailResistanceEdge;
        }
        if (
          (item.tailPosition || item.tailPosition === 0) &&
          (item.headPosition || item.headPosition === 0)
        ) {
          item.length = item.tailPosition - item.headPosition;
        } else item.length = 0;
        item.planWeight = this.calcPlanWeight(item.length);
        if (item.status == 1) {
          item.qualifiedLength = item.length;
          item.qualifiedWeight = item.planWeight;
        }
      }
      this.formData.segmentedInstructionDetailVos = list;
      this.handleCodeClick();
    },
    handleTailChange(value, index) {
      let list = cloneDeep(this.formData.segmentedInstructionDetailVos);
      if (index !== this.formData.segmentedInstructionDetailVos.length - 1) {
        list[index + 1].headPosition = value;

        let tailOi = this.calcOi(value);
        list[index].tail79oi = tailOi[0];
        list[index].tail83oi = tailOi[1];

        list[index + 1].head79oi = tailOi[0];
        list[index + 1].head83oi = tailOi[1];
      }

      for (const item of list) {
        if (item.type === 0) {
          item.segmentNo = null;

          const resistanceEdgeAndRrv = this.getResistanceEdgeAndRrv(
            item.headPosition,
            item.tailPosition
          );
          item.headResistance = resistanceEdgeAndRrv.headResistance;
          item.tailResistance = resistanceEdgeAndRrv.tailResistance;
          item.headRrv = resistanceEdgeAndRrv.headRrv;
          item.tailRrv = resistanceEdgeAndRrv.tailRrv;
          item.headResistanceEdge = resistanceEdgeAndRrv.headResistanceEdge;
          item.tailResistanceEdge = resistanceEdgeAndRrv.tailResistanceEdge;
        }
        if (
          (item.tailPosition || item.tailPosition === 0) &&
          (item.headPosition || item.headPosition === 0)
        )
          item.length = item.tailPosition - item.headPosition;
        else item.length = 0;
        item.planWeight = this.calcPlanWeight(item.length);
        if (item.status == 1) {
          item.qualifiedLength = item.length;
          item.qualifiedWeight = item.planWeight;
        }
      }
      this.formData.segmentedInstructionDetailVos = list;
      this.handleCodeClick();
    },
    calcPlanWeight(length) {
      // let density = this.diameterList.find(
      //   (item) => item.value == this.formData.diameter
      // ).extendValue;
      // return ((length * density) / 1000).toFixed(3);
      return (
        ((length || 0) * (this.formData.theoryQtyCoefficient || 0)) /
        1000
      ).toFixed(3);
    },
    async save() {
      await Api.upldateBuffer(this.buffParams, this.formData);
      const msg = "保存成功!";
      this.back(msg);
    },
    async confirm() {
      let valid;
      try {
        valid = await this.$refs.formRef.validate();
      } catch (err) {
        return this.$message.warning("分段信息或留档文档记录未填写完整");
      }
      if (!valid) return;

      if (
        this.formData.segmentedInstructionDetailVos.some(
          (item) => !item.segmentNo
        )
      )
        return this.$message.warning("分段编号不能为空");

      if (
        this.formData.segmentedInstructionDetailVos.every(
          (item) => item.type !== 0
        )
      )
        return this.$message.warning("分段信息必须有晶段");

      let minRes = Number((Number(this.tailResistance || 0) / 2).toFixed(3));
      let maxRes = Number((Number(this.headResistance || 0) * 2).toFixed(3));
      if (
        this.formData.segmentedInstructionDetailVos.some((item) => {
          if (item.type !== 0) return false;

          const { headResistance, tailResistance } = item;
          if (
            (headResistance || String(headResistance) === "0") &&
            (Number(headResistance) > maxRes || Number(headResistance) < minRes)
          )
            return true;
          if (
            (tailResistance || String(tailResistance) === "0") &&
            (Number(tailResistance) > maxRes || Number(tailResistance) < minRes)
          )
            return true;

          return false;
        })
      )
        return this.$message.warning(
          `电阻率范围：${minRes}(0.5倍尾部电阻率)~${maxRes}(2倍头部电阻率)`
        );

      let outControlList = [];
      this.controlList.forEach((control) => {
        let list = get(this, control.from, []);
        if (
          list.some(
            (item) =>
              !this.checkControl(
                control.name,
                item[control.key],
                item.orderCode
              )
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
    tableRowClassName({ row }) {
      if (!row.valid) {
        return "invalid_tr";
      }
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
    formatErpType(row, column, cellValue) {
      const matched = this.erpWorkOrderTypeList.find(
        (item) => item.value === cellValue
      );
      return matched ? matched.name : "";
    },
    handleStatusChange(val, index) {
      this.$set(
        this.formData.segmentedInstructionDetailVos[index],
        "qualifiedLength",
        val == 1
          ? this.formData.segmentedInstructionDetailVos[index].length
          : null
      );
      this.$set(
        this.formData.segmentedInstructionDetailVos[index],
        "qualifiedWeight",
        val == 1
          ? this.formData.segmentedInstructionDetailVos[index].planWeight
          : null
      );
    },
    calcResistivity(y, index) {
      let { number, length, headWeight, tailWeight, inventoryRating } =
        this.formData;
      let g = number; //单晶重量
      let s = length;
      let h = headWeight; //头料重量
      let i = tailWeight; //尾料重量
      let j = inventoryRating; //投料量
      let a = this.headResistance;
      let b = this.tailResistance;

      let K = this.kValueList.find((item) => item.name === "default").value;

      let p1 =
        Math.pow(
          1 - ((g / s) * (s - y)) / (j - (g - i - (g / s) * (s - y))),
          K - 1
        ) * b;

      let x1 =
        (a *
          Math.pow(
            1 - h / j,
            Math.log(b / a) / Math.log((1 - h / j) / (1 - (g - i) / j))
          )) /
        Math.pow(
          1 -
            (Math.PI / 4) *
              ((Math.pow(
                Math.pow(((g - h - i) / 2.33) * Math.PI * s, 0.5) * 2,
                2
              ) *
                y *
                2.33) /
                (j * 1000000)),
          Math.log(b / a) / Math.log((1 - h / j) / (1 - (g - i) / j))
        );

      let calculatedResistivity = ((p1 + x1) / 2).toFixed(5);

      this.$set(
        this.formData.segmentedInstructionDetailVos[index],
        "calculatedResistivity",
        isNaN(calculatedResistivity) ||
          calculatedResistivity + "" === "Infinity" ||
          calculatedResistivity + "" === "-Infinity"
          ? null
          : calculatedResistivity
      );
    },
    calcPosition(x, index) {
      let a = this.headResistance;
      let b = this.tailResistance;
      let s = this.formData.length;

      let calculatedPosition = (((a - x) * s) / (a - b)).toFixed(3);

      this.$set(
        this.formData.segmentedInstructionDetailVos[index],
        "calculatedPosition",
        isNaN(calculatedPosition) ||
          calculatedPosition + "" === "Infinity" ||
          calculatedPosition + "" === "-Infinity"
          ? null
          : calculatedPosition
      );
    },
    formatSegmentType(row, column, type) {
      const matched = this.segmentTypeList.find((item) => item.value == type);
      return matched ? matched.name : "";
    },
    getChartWidth(headPosition, tailPosition) {
      let width = 0;
      if (this.totalLength > 0)
        width = ((tailPosition - headPosition) * 100) / this.totalLength;
      return width + "%";
    },
    getChartLeft(headPosition) {
      let left = 0;
      if (this.totalLength > 0)
        left =
          ((headPosition - this.measurementHeadIndex * 50) * 100) /
          this.totalLength;
      return left + "%";
    },
    segmentError(headPosition, tailPosition) {
      return (
        ["", undefined, null].includes(headPosition) ||
        ["", undefined, null].includes(tailPosition) ||
        Number(headPosition) > Number(tailPosition)
      );
    },
    calcOi(position) {
      const { head79oi, tail79oi } = this.headAndTailOi;
      const { length } = this.formData;
      if (
        (!head79oi && head79oi !== 0) ||
        (!tail79oi && tail79oi !== 0) ||
        (!position && position !== 0)
      )
        return [null, null];

      let oi_79 = Number(
        head79oi - ((head79oi - tail79oi) * position) / length
      ).toFixed(3);
      let oi_83 = (oi_79 * 0.509).toFixed(3);
      return [oi_79, oi_83];
    },
    handleOiChange(type, index, val) {
      if (type === "head") {
        let oi_83 = (val * 0.509).toFixed(3);
        if (index == 0) {
          this.headAndTailOi.head79oi = val;
          this.headAndTailOi.head83oi = oi_83;
          this.refreshSegmentsOi();
        } else {
          this.$set(
            this.formData.segmentedInstructionDetailVos[index],
            "head83oi",
            oi_83
          );
        }
      }
      if (type === "tail") {
        let oi_83 = (val * 0.509).toFixed(3);
        if (index === this.formData.segmentedInstructionDetailVos.length - 1) {
          this.headAndTailOi.tail79oi = val;
          this.headAndTailOi.tail83oi = oi_83;
          this.refreshSegmentsOi();
        } else {
          this.$set(
            this.formData.segmentedInstructionDetailVos[index],
            "tail83oi",
            oi_83
          );
        }
      }
    },
    refreshSegmentsOi() {
      let cloneSegmentedInstructionDetailVos =
        this.formData.segmentedInstructionDetailVos.map((item, index) => {
          let headOi = this.calcOi(item.headPosition);
          let tailOi = this.calcOi(item.tailPosition);

          let head79oi = headOi[0];
          let head83oi = headOi[1];
          let tail79oi = tailOi[0];
          let tail83oi = tailOi[1];

          if (index == 0) {
            head79oi = this.headAndTailOi.head79oi;
            head83oi = this.headAndTailOi.head83oi;
          }
          if (index == this.formData.segmentedInstructionDetailVos.length - 1) {
            tail79oi = this.headAndTailOi.tail79oi;
            tail83oi = this.headAndTailOi.tail83oi;
          }

          return {
            ...item,
            head79oi,
            head83oi,
            tail79oi,
            tail83oi,
          };
        });

      this.$set(
        this.formData,
        "segmentedInstructionDetailVos",
        cloneSegmentedInstructionDetailVos
      );
    },
    initOiAndRrv() {
      let reverseDetails = (cloneDeep(this.checkInfo) || []).reverse();
      let reverseHeadIndex = reverseDetails.findIndex(
        (item) => item.type === "头尾样片" && item.sampleIdentification === "H"
      );
      let reverseTailIndex = reverseDetails.findIndex(
        (item) => item.type === "头尾样片" && item.sampleIdentification === "T"
      );
      let headIndex = reverseDetails.length - reverseHeadIndex - 1;
      let tailIndex = reverseDetails.length - reverseTailIndex - 1;

      if (reverseHeadIndex === -1 || reverseTailIndex === -1) return;

      let head79oi = this.checkInfo[headIndex].oiC;
      let head83oi = (head79oi * 0.509).toFixed(3);
      let tail79oi = this.checkInfo[tailIndex].oiC;
      let tail83oi = (tail79oi * 0.509).toFixed(3);
      this.headAndTailOi = { head79oi, head83oi, tail79oi, tail83oi };

      let headRrv = Math.abs(this.checkInfo[headIndex].rrg || 0).toFixed(2);
      let tailRrv = Math.abs(this.checkInfo[tailIndex].rrg || 0).toFixed(2);
      this.headAndTailRrv = { headRrv, tailRrv };
    },
    getResistanceEdgeAndRrv(headPosition, tailPosition) {
      let headResistance = null;
      let tailResistance = null;
      let headResistanceEdge = null;
      let tailResistanceEdge = null;
      let headRrv = null;
      let tailRrv = null;
      if (
        (headPosition || headPosition == 0) &&
        (tailPosition || tailPosition == 0) &&
        !isEmpty(this.checkInfo)
      ) {
        const headCheckInfoList = this.checkInfo.filter(
          (item) => Number(item.samplePosition) <= Number(headPosition)
        );

        if (!isEmpty(headCheckInfoList)) {
          headResistance = headCheckInfoList[headCheckInfoList.length - 1].resC;
          headResistanceEdge =
            headCheckInfoList[headCheckInfoList.length - 1].resE;
          headRrv = headCheckInfoList[headCheckInfoList.length - 1].rrg;
        }

        const tailCheckInfoList = this.checkInfo.filter(
          (item) => Number(item.samplePosition) >= Number(tailPosition)
        );

        if (!isEmpty(tailCheckInfoList)) {
          tailResistance = tailCheckInfoList[0].resC;
          tailResistanceEdge = tailCheckInfoList[0].resE;
          tailRrv = tailCheckInfoList[0].rrg;
        }
      }
      return {
        headResistance,
        tailResistance,
        headResistanceEdge,
        tailResistanceEdge,
        headRrv,
        tailRrv,
      };
    },
    handleReasonChange(val, index) {
      this.$set(
        this.formData.segmentedInstructionDetailVos[index],
        "reason",
        val.join(",")
      );
    },
    getControlColor(key, val, type) {
      let map = this.controlMap[type || "default"] || {};
      let item = map[key] || {};
      let maxItem = item["上限"] || {};
      let minItem = item["下限"] || {};

      if (!(val || String(val) === "0")) return null;

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
    checkControl(key, val, type) {
      let map = this.controlMap[type || "default"] || {};
      let item = map[key] || {};
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
    async getMateralModelExtras() {
      let list = await getMateralModelExtras({
        processOrderCode: this.formData.processOrderCode,
      });
      this.updateControlMap(list, "default");
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
  margin-top: 10px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  min-height: 100px;
  padding: 10px 15px 10px;
  position: relative;
  display: flex;
  flex-wrap: wrap;
  gap: 2%;
  .measurement {
    position: absolute;
    top: 80px;
    width: calc(100% - 40px);
    display: flex;
    .ceil {
      flex: 1;
      height: 20px;
      border-right: 1px solid;
      border-bottom: 1px solid;
      text-align: center;
      position: relative;
      .left-number {
        position: absolute;
        left: 0;
        top: -20px;
        transform: translateX(-50%);
      }
      .right-number {
        position: absolute;
        right: 0;
        top: -20px;
        transform: translateX(50%);
      }
    }
  }
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
  .form-checkInfo {
    position: absolute;
    top: -12px;
    right: 20px;
    background: white;
    padding: 0px 6px;
  }
  .chart {
    width: 100%;
    position: relative;
    .chart-item {
      position: absolute;
      .chart-box {
        position: relative;
        .number {
          height: 100px;
          .headPosition {
            text-align: center;
            position: absolute;
            left: 0;
            transform: translateX(-50%);
          }
          .tailPosition {
            text-align: center;
            position: absolute;
            right: 0;
            transform: translateX(50%);
          }
        }
      }
    }
    .line {
      width: 100%;
      height: 10px;
      border: 1px solid #000;
      border-top: none;
    }
    .bar {
      margin: 0 auto;
      width: calc(100% - 25px);
      height: 60px;
      border: 1px solid #000;
      cursor: pointer;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      &::before,
      &::after {
        content: "";
        position: absolute;
        width: 20px;
        height: 60px;
        border: 1px solid #000;
        background-color: white;
        border-radius: 50%;
      }
      &::before {
        z-index: 1;
        left: -10px;
      }
      &::after {
        z-index: 3;
        right: -10px;
      }
      .center {
        padding: 1px 0px;
        background-color: #fff;
        z-index: 2;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        .text {
          font-size: 12px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          margin: 0px 10px;
        }
      }
    }
    .bar-selected {
      border: 1px solid rgb(2, 104, 197);
      background-color: rgb(233, 243, 253);
      &::before,
      &::after {
        border: 1px solid rgb(2, 104, 197);
        background-color: rgb(233, 243, 253);
      }
      .center {
        background-color: rgb(233, 243, 253);
      }
    }
  }
  .table /deep/ {
    .segment-table {
      position: relative;
      overflow: visible;
      display: flex;
      align-items: center;
      justify-content: center;
      .segment-add-btn {
        border-radius: 9px;
        width: 18px;
        height: 18px;
        background: rgb(41, 152, 255);
        color: white;
        position: absolute;
        z-index: 999;
        top: -15px;
        cursor: pointer;
        line-height: 18px;
      }
      .el-button {
        font-size: 12px;
      }
    }
    .el-table__cell {
      div {
        overflow: visible;
      }
    }
  }
  .add-btn {
    position: absolute;
    left: 20px;
  }
  .detail-container {
    display: flex;
    margin-top: 200px;
    width: 100%;
    gap: 10px;
    .detail {
      cursor: pointer;
      flex: 1;
      font-size: 12px;
      margin: 0 auto;
      border: 1px solid rgba(0, 0, 0, 0.3);
      background: white;
      margin-top: 10px;
      text-align: center;
      padding: 10px;
      border-radius: 10px;
      min-width: 240px;
      .item {
        display: flex;
        justify-content: center;
        gap: 5px;
        width: 100%;
        .label {
          flex: 1;
          text-align: right;
          min-width: 110px;
        }
        .value {
          flex: 1;
          text-align: left;
          min-width: 70px;
        }
      }
    }
    .detail-selected {
      border: 1px solid rgb(2, 104, 197);
      background-color: rgb(233, 243, 253);
    }
  }
}
.unit {
  width: 60px;
}
.dialog-footer {
  display: flex;
  justify-content: end;
}
.icon-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-right: 8px;
}
.collapse {
  border-left: 1px solid rgba(0, 0, 0, 0.1);
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  padding: 0 10px;
  border-radius: 5px;
}
.form-table-header:before {
  content: "* ";
  color: red;
}
.form-custom-verify {
  .form-input {
    margin-bottom: 0px;
  }
  /deep/ .el-form-item .el-form-item__content .el-form-item__error {
    top: 25%;
    left: 20px;
  }
}

/deep/ .el-table__cell {
  padding: 0px;
}

/deep/ .el-input-group__append {
  padding: 0 5px;
}

/deep/ .el-input__inner {
  padding: 0px 3px;
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

/deep/ .el-input__icon {
  line-height: 25px;
}

/deep/ .el-select .el-tag {
  margin: 0px 0px 0px 6px;
}

.table-btn {
  font-size: 14px;
  padding: 8px;
}

.get-btn {
  cursor: pointer;
  color: rgb(41, 152, 255);
}

.refresh {
  color: #409eff;
  cursor: pointer;
}
</style>
