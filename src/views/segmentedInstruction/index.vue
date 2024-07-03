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
      <h3>出站数据录入</h3>
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
                  label="样片类型"
                  min-width="120"
                  align="center"
                  prop="type"
                />
                <el-table-column
                  label="样片编号"
                  min-width="200"
                  align="center"
                  prop="sampleNumber"
                />
                <el-table-column
                  label="样片标识"
                  min-width="100"
                  align="center"
                  prop="sampleIdentification"
                />
                <el-table-column
                  label="样片位置"
                  min-width="100"
                  align="center"
                  prop="samplePosition"
                />
                <el-table-column
                  label="产品类型"
                  min-width="100"
                  align="center"
                  prop="productCategory"
                />
                <el-table-column
                  label="晶向"
                  min-width="100"
                  align="center"
                  prop="orientation"
                />
                <el-table-column
                  label="尺寸"
                  min-width="100"
                  align="center"
                  prop="size"
                />
                <el-table-column
                  label="结晶比重"
                  min-width="180"
                  align="center"
                  prop="crystalDensity"
                >
                  <template slot-scope="scope">
                    <div v-if="scope.row.crystalDensity">
                      {{ scope.row.crystalDensity }}%
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  label="RES"
                  min-width="80"
                  align="center"
                  prop="res"
                />
                <el-table-column
                  label="RES_C"
                  min-width="80"
                  align="center"
                  prop="resC"
                />
                <el-table-column
                  label="RES_E"
                  min-width="80"
                  align="center"
                  prop="resE"
                />
                <el-table-column
                  label="1/2RES"
                  min-width="100"
                  align="center"
                  prop="halfRes"
                />
                <el-table-column
                  label="目标偏差"
                  min-width="100"
                  align="center"
                  prop="targetDeviation"
                />
                <el-table-column
                  label="RRG"
                  min-width="80"
                  align="center"
                  prop="rrg"
                >
                  <template slot-scope="scope">
                    <div v-if="scope.row.rrg">{{ scope.row.rrg }}%</div>
                  </template>
                </el-table-column>
                <el-table-column
                  label="1/2 RRG"
                  min-width="100"
                  align="center"
                  prop="halfRrg"
                >
                  <template slot-scope="scope">
                    <div v-if="scope.row.halfRrg">{{ scope.row.halfRrg }}%</div>
                  </template>
                </el-table-column>
                <el-table-column
                  label="头尾电阻比"
                  min-width="100"
                  align="center"
                  prop="headTailResistivityRatio"
                />
                <el-table-column
                  label="OI_C"
                  min-width="80"
                  align="center"
                  prop="oiC"
                />
                <el-table-column
                  label="OI_E"
                  min-width="80"
                  align="center"
                  prop="oiE"
                />
                <el-table-column
                  label="CS"
                  min-width="80"
                  align="center"
                  prop="cs"
                />
                <el-table-column
                  label="ORG"
                  min-width="80"
                  align="center"
                  prop="org"
                >
                  <template slot-scope="scope">
                    <div v-if="scope.row.org">{{ scope.row.org }}%</div>
                  </template>
                </el-table-column>
                <el-table-column
                  label="少子寿命"
                  min-width="100"
                  align="center"
                  prop="minorityCarrierLifetime"
                />
                <el-table-column
                  label="常规缺陷"
                  min-width="120"
                  align="center"
                  prop="flaw"
                />
                <el-table-column
                  label="OSF密度"
                  min-width="120"
                  align="center"
                  prop="osf"
                />
                <el-table-column
                  label="基磷"
                  min-width="120"
                  align="center"
                  prop="phosphorus"
                />
                <el-table-column
                  label="基硼"
                  min-width="120"
                  align="center"
                  prop="boron"
                />
                <el-table-column
                  label="基砷"
                  min-width="120"
                  align="center"
                  prop="arsenic"
                />
                <el-table-column
                  label="基锑"
                  min-width="120"
                  align="center"
                  prop="antimony"
                />
                <el-table-column
                  label="检测人员"
                  min-width="120"
                  align="center"
                  prop="inspector"
                />
                <el-table-column
                  label="检测日期"
                  min-width="200"
                  align="center"
                  prop="checkDate"
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
                label="晶锭编号/回收料编号"
                min-width="240"
                align="center"
              >
                <template slot="header">
                  <el-button
                    type="text"
                    icon="el-icon-plus"
                    circle
                    size="small"
                    @click="addSegmentedInfo"
                  ></el-button>
                  <span>晶锭编号/回收料编号</span>
                </template>
                <template slot-scope="scope">
                  <div class="segment-table">
                    <div v-if="scope.row.segmentNo">
                      {{ scope.row.segmentNo }}
                    </div>
                    <div v-else>
                      <el-button type="text" @click="handleCodeClick"
                        >获取晶锭/回收料编号</el-button
                      >
                    </div>
                    <el-button
                      class="segment-add-btn"
                      v-if="scope.$index !== 0"
                      type="primary"
                      icon="el-icon-plus"
                      circle
                      size="small"
                      @click="addSegmentedInfoByIndex(scope.$index)"
                    ></el-button>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                label="类型"
                min-width="150"
                align="center"
                prop="type"
                :formatter="formatSegmentType"
              />
              <el-table-column label="下发工单" min-width="300" align="center">
                <template slot-scope="scope">
                  <el-input
                    v-if="scope.row.type !== 2"
                    v-model="scope.row.orderCode"
                    @focus="handleWorkOrderFocus(scope.$index)"
                    clearable
                    readonly
                  />
                </template>
              </el-table-column>
              <el-table-column label="流程编号" min-width="300" align="center">
                <template slot-scope="scope">
                  <el-select
                    v-if="scope.row.type !== 2"
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
                min-width="150"
                align="center"
                prop="diameter"
              >
                <template slot-scope="scope">
                  {{ scope.row.diameter }}寸
                </template>
              </el-table-column>
              <el-table-column
                label="直径"
                min-width="160"
                align="center"
                prop="diametermm"
              >
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.diametermm"
                    v-direction="{ x: 1, y: scope.$index }"
                    :disabled="scope.row.type === 2"
                  >
                    <template slot="append">mm</template>
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column
                label="晶锭段位"
                min-width="120"
                align="center"
                prop="segmentNum"
              >
                <template slot-scope="scope">
                  <div v-if="scope.row.type !== 2">
                    {{ scope.row.segmentNum }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="头部位置" min-width="150" align="center">
                <template slot-scope="scope">
                  <el-input
                    :disabled="scope.row.type === 2"
                    v-model="scope.row.headPosition"
                    @change="(value) => handleHeadChange(value, scope.$index)"
                    v-direction="{ x: 2, y: scope.$index }"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column label="尾部位置" min-width="150" align="center">
                <template slot-scope="scope">
                  <el-input
                    :disabled="scope.row.type === 2"
                    v-model="scope.row.tailPosition"
                    @change="(value) => handleTailChange(value, scope.$index)"
                    v-direction="{ x: 3, y: scope.$index }"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column
                label="晶锭长度"
                min-width="150"
                align="center"
                prop="length"
              />
              <el-table-column
                label="计划重量"
                min-width="200"
                align="center"
                prop="planWeight"
              />
              <!-- <el-table-column
                label="晶段类型"
                min-width="100"
                align="center"
                prop="type"
              >
                <template slot-scope="scope">
                  <el-input v-model="scope.row.type"></el-input>
                </template>
              </el-table-column> -->
              <el-table-column
                label="计算位置"
                min-width="150"
                align="center"
                prop="calculatedPosition"
              >
                <template slot-scope="scope">
                  <el-input
                    v-if="scope.row.type !== 2"
                    v-model="scope.row.calculatedPosition"
                    @change="(value) => calcResistivity(value, scope.$index)"
                    v-direction="{ x: 4, y: scope.$index }"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column
                label="计算电阻率"
                min-width="150"
                align="center"
                prop="calculatedResistivity"
              >
                <template slot-scope="scope">
                  <el-input
                    v-if="scope.row.type !== 2"
                    v-model="scope.row.calculatedResistivity"
                    @change="(value) => calcPosition(value, scope.$index)"
                    v-direction="{ x: 5, y: scope.$index }"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column
                label="头部电阻率"
                min-width="120"
                align="center"
                prop="headResistance"
              >
                <template slot-scope="scope">
                  <el-input
                    v-if="scope.row.type !== 2"
                    v-model="scope.row.headResistance"
                    v-direction="{ x: 6, y: scope.$index }"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column
                label="尾部电阻率"
                min-width="120"
                align="center"
                prop="tailResistance"
              >
                <template slot-scope="scope">
                  <el-input
                    v-if="scope.row.type !== 2"
                    v-model="scope.row.tailResistance"
                    v-direction="{ x: 7, y: scope.$index }"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column
                label="头部电阻率实测"
                min-width="150"
                align="center"
                prop="headResistanceActual"
              />
              <el-table-column
                label="尾部电阻率实测"
                min-width="150"
                align="center"
                prop="tailResistanceActual"
              />
              <!-- <el-table-column
                label="头尾电阻比"
                min-width="120"
                align="center"
              ></el-table-column> -->
              <el-table-column
                label="79oi头"
                min-width="100"
                align="center"
                prop="head79oi"
              >
                <template slot-scope="scope">
                  <div v-if="scope.row.type !== 2">
                    {{ scope.row.head79oi }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                label="79oi尾"
                min-width="100"
                align="center"
                prop="tail79oi"
              >
                <template slot-scope="scope">
                  <div v-if="scope.row.type !== 2">
                    {{ scope.row.tail79oi }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                label="83oi头"
                min-width="100"
                align="center"
                prop="head83oi"
              >
                <template slot-scope="scope">
                  <div v-if="scope.row.type !== 2">
                    {{ scope.row.head83oi }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                label="83oi尾"
                min-width="100"
                align="center"
                prop="tail83oi"
              >
                <template slot-scope="scope">
                  <div v-if="scope.row.type !== 2">
                    {{ scope.row.tail83oi }}
                  </div>
                </template>
              </el-table-column>
              <!-- <el-table-column
                label="滚圆"
                min-width="80"
                align="center"
              ></el-table-column>
              <el-table-column
                label="参考面"
                min-width="100"
                align="center"
              ></el-table-column> -->
              <el-table-column
                label="说明"
                min-width="250"
                align="center"
                prop="remarks"
              >
                <template slot-scope="scope">
                  <el-input
                    v-if="scope.row.type !== 2"
                    v-model="scope.row.remarks"
                    v-direction="{ x: 8, y: scope.$index }"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column label="合格状态" min-width="120" align="center">
                <template slot="header">
                  <div class="form-table-header">合格状态</div>
                </template>
                <template slot-scope="scope">
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
                        required: scope.row.type !== 2,
                        message: '合格状态不能为空',
                        trigger: 'change',
                      },
                    ]"
                    class="form-input"
                  >
                    <el-select
                      v-if="scope.row.type !== 2"
                      v-model="scope.row.status"
                      @change="(val) => handleStatusChange(val, scope.$index)"
                    >
                      <el-option label="合格" :value="1"></el-option>
                      <el-option label="不合格" :value="0"></el-option>
                    </el-select>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                label="合格长度"
                min-width="150"
                align="center"
                prop="qualifiedLength"
              />
              <el-table-column
                label="合格重量"
                min-width="150"
                align="center"
                prop="qualifiedWeight"
              />
              <el-table-column
                label="不合格原因"
                min-width="150"
                align="center"
                prop="reason"
              >
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.reason"
                    clearable
                    v-if="scope.row.type !== 2"
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
                    v-if="scope.row.type !== 2"
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
                    class="el-icon-delete"
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
                <div class="item" v-if="item.type === 2">
                  <div class="label">回收料编号：</div>
                  <div class="value">{{ item.segmentNo }}</div>
                </div>
                <div class="item" v-if="item.type === 0">
                  <div class="label">晶锭编号：</div>
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
                <div class="item" v-if="item.type !== 2">
                  <div class="label">计算位置：</div>
                  <div class="value">{{ item.calculatedPosition }}</div>
                </div>
                <div class="item" v-if="item.type !== 2">
                  <div class="label">计算电阻率：</div>
                  <div class="value">{{ item.calculatedResistivity }}</div>
                </div>
                <div class="item" v-if="item.type !== 2">
                  <div class="label">头部电阻率：</div>
                  <div class="value">{{ item.headResistance }}</div>
                </div>
                <div class="item" v-if="item.type !== 2">
                  <div class="label">尾部电阻率：</div>
                  <div class="value">{{ item.tailResistance }}</div>
                </div>
                <div class="item" v-if="item.type !== 2">
                  <div class="label">头部电阻率实测：</div>
                  <div class="value">{{ item.headResistanceActual }}</div>
                </div>
                <div class="item" v-if="item.type !== 2">
                  <div class="label">尾部电阻率实测：</div>
                  <div class="value">{{ item.tailResistanceActual }}</div>
                </div>
                <div class="item" v-if="item.type !== 2">
                  <div class="label">79oi头：</div>
                  <div class="value">{{ item.head79oi }}</div>
                </div>
                <div class="item" v-if="item.type !== 2">
                  <div class="label">79oi尾：</div>
                  <div class="value">{{ item.tail79oi }}</div>
                </div>
                <div class="item" v-if="item.type !== 2">
                  <div class="label">83oi头：</div>
                  <div class="value">{{ item.head83oi }}</div>
                </div>
                <div class="item" v-if="item.type !== 2">
                  <div class="label">83oi尾：</div>
                  <div class="value">{{ item.tail83oi }}</div>
                </div>
                <div class="item" v-if="item.type !== 2">
                  <div class="label">合格状态：</div>
                  <div class="value">
                    {{ item.status === 1 ? "合格" : "不合格" }}
                  </div>
                </div>
                <div class="item" v-if="item.type !== 2">
                  <div class="label">合格长度：</div>
                  <div class="value">{{ item.qualifiedLength }}</div>
                </div>
                <div class="item" v-if="item.type !== 2">
                  <div class="label">合格重量：</div>
                  <div class="value">{{ item.qualifiedWeight }}</div>
                </div>
              </div>
            </div>
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
          key="offlineQty"
          prop="offlineQty"
          label="已下线数量"
          width="110"
        />
        <el-table-column
          key="onlineQty"
          prop="onlineQty"
          label="在线数量"
          width="90"
        />
        <el-table-column
          key="qualifiedQty"
          prop="qualifiedQty"
          label="合格数量"
          width="90"
        />
        <el-table-column
          key="matchingQty"
          prop="matchingQty"
          label="标准匹配合格数量"
          width="160"
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
  </div>
</template>

<script>
import * as Api from "@/api/inStation";
import { cloneDeep, isEmpty } from "lodash-es";
import { getSeleteData } from "@/utils/select";
import overStation from "@/mixins/overStation";
import PhotoNew from "@/views/components/photoNew";
import LeaderLine from "@/plugins/leader-line.min.js";

export default {
  mixins: [overStation],
  components: {
    PhotoNew,
  },
  data() {
    return {
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
    handleConfirm() {
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
      if (res.data) {
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

      let cloneSegmentedInstructionDetailVos;
      if (isEmpty(this.formData.segmentedInstructionDetailVos)) {
        let oi = this.calcOi();
        cloneSegmentedInstructionDetailVos = (
          this.formData.wipCrystalCheckSampleRangeDtos || []
        ).map((item) => {
          let length = item.tail - item.head;
          return {
            segmentNo: item.sampleNumber,
            type: item.type,
            headPosition: item.head,
            tailPosition: item.tail,
            length,
            headResistance: 0,
            tailResistance: 0,
            diameter: this.formData.diameter,
            diametermm: this.formData.diametermm,
            planWeight: this.calcPlanWeight(length),
            head79oi: oi[0],
            head83oi: oi[1],
            tail79oi: oi[2],
            tail83oi: oi[3],
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
            let length = item.tailPosition - item.headPosition;
            return {
              ...item,
              planWeight: this.calcPlanWeight(length),
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

      this.formData._files = JSON.parse(this.formData.photo || "[]").map(
        (fileItem) => ({
          ...fileItem,
          big_url: fileItem.fileUrl,
          thumb_url: fileItem.fileUrl,
        })
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
      let res = await Api.segmentedInstructionGenerateNo(this.formData);
      let list = cloneDeep(this.formData.segmentedInstructionDetailVos);
      res.segmentedInstructionDetailVos.forEach((item, index) => {
        list[index].segmentNo = item.segmentNo;
        list[index].segmentNum = item.segmentNum;
      });
      this.formData.segmentedInstructionDetailVos = list;
    },
    addSegmentedInfo() {
      let list = this.formData.segmentedInstructionDetailVos;
      let headPosition;
      if (list.length === 0) headPosition = 0;
      else headPosition = list[list.length - 1].tailPosition;
      let oi = this.calcOi();
      let item = {
        headPosition,
        type: 0,
        headResistance: 0,
        tailResistance: 0,
        diameter: this.formData.diameter,
        diametermm: this.formData.diametermm,
        planWeight: 0,
        head79oi: oi[0],
        head83oi: oi[1],
        tail79oi: oi[2],
        tail83oi: oi[3],
      };
      this.formData.segmentedInstructionDetailVos.push(item);
    },
    addSegmentedInfoByIndex(index) {
      let list = this.formData.segmentedInstructionDetailVos;
      let headPosition = list[index - 1].tailPosition || 0;
      let tailPosition = list[index].headPosition || 0;
      let length = tailPosition - headPosition;
      let oi = this.calcOi();
      let item = {
        headPosition,
        tailPosition,
        length,
        planWeight: this.calcPlanWeight(length),
        type: 0,
        headResistance: 0,
        tailResistance: 0,
        diameter: this.formData.diameter,
        diametermm: this.formData.diametermm,
        head79oi: oi[0],
        head83oi: oi[1],
        tail79oi: oi[2],
        tail83oi: oi[3],
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
      if (index !== 0) list[index - 1].tailPosition = value;

      for (const item of list) {
        if (item.type !== 2) item.segmentNo = null;
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
      if (index !== this.formData.segmentedInstructionDetailVos.length - 1)
        list[index + 1].headPosition = value;

      for (const item of list) {
        if (item.type !== 2) item.segmentNo = null;
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
      let density = this.diameterList.find(
        (item) => item.value == this.formData.diameter
      ).extendValue;
      return ((length * density) / 1000).toFixed(3);
    },
    calcOi() {
      let reverseDetails = (cloneDeep(this.checkInfo) || []).reverse();
      let reverseHeadIndex = reverseDetails.findIndex(
        (item) => item.type === "头尾样片" && item.sampleIdentification === "H"
      );
      let reverseTailIndex = reverseDetails.findIndex(
        (item) => item.type === "头尾样片" && item.sampleIdentification === "T"
      );
      let headIndex = reverseDetails.length - reverseHeadIndex - 1;
      let tailIndex = reverseDetails.length - reverseTailIndex - 1;

      if (reverseHeadIndex === -1 || reverseTailIndex === -1) return [];

      let head79oi = (this.checkInfo[headIndex] || {}).oiC;
      let head83oi = (head79oi * 0.509).toFixed(3);
      let tail79oi = (this.checkInfo[tailIndex] || {}).oiC;
      let tail83oi = (tail79oi * 0.509).toFixed(3);
      return [head79oi, head83oi, tail79oi, tail83oi];
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
        return this.$message.warning("分段的合格状态未填写完整");
      }
      if (!valid) return;
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
  padding: 20px 20px 20px;
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
      .segment-add-btn {
        position: absolute;
        z-index: 999;
        top: -52px;
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
.form-input {
  padding-top: 16px;
  height: 58px;
}
</style>
