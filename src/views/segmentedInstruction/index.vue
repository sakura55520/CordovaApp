<template>
  <div class="scroller-flex-wrap">
    <div class="outStationExecution-container">
      <!-- 顶部信息卡片 -->
      <div class="topInfoCard">
        <div class="grid-container">
          <div class="grid-item">
            <span class="grid-item-name">批次号：</span>
            <span class="grid-item-value">{{ formData.processOrderCode }}</span>
          </div>
          <div class="grid-item">
            <span class="grid-item-name">长晶炉：</span>
            <span class="grid-item-value">{{ $route.query.deviceCode }}</span>
          </div>
        </div>
      </div>
      <el-divider class="divider" />
      <h3>出站数据录入</h3>
      <div class="outStation-form">
        <el-form
          ref="formRef"
          :model="formData"
          label-position="left"
          label-width="100px"
          :rules="formRules"
        >
          <div class="base-form">
            <el-form-item label="操作者" prop="userCreate" class="item">
              <el-input v-model="formData.userCreate" disabled></el-input>
            </el-form-item>
            <el-form-item label="长度" prop="length" class="item">
              <el-input v-model="formData.length">
                <template slot="append">cm</template>
              </el-input>
            </el-form-item>
            <el-form-item label="数量" prop="number" class="item">
              <el-input v-model="formData.number"></el-input>
            </el-form-item>
          </div>
          <div class="form">
            <div class="form-title">分段信息</div>
            <el-button
              size="small"
              type="primary"
              class="add-btn"
              @click="addSegmentedInfo"
              >新增</el-button
            >
            <el-table
              :data="formData.segmentedInstructionDetailVos"
              class="table"
              :header-cell-style="{
                background: 'rgba(242, 242, 242)',
                color: '#606266',
              }"
            >
              <el-table-column label="晶锭编号" min-width="150" align="center">
                <template slot-scope="scope">
                  <div v-if="scope.row.segmentNo">
                    {{ scope.row.segmentNo }}
                  </div>
                  <div v-else>
                    <el-button type="text" @click="handleCodeClick"
                      >获取晶锭编号</el-button
                    >
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="下发工单" min-width="300" align="center">
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.orderCode"
                    @visible-change="
                      (val) => handleWorkOrderVisibleChange(val, scope.$index)
                    "
                  >
                    <el-option
                      :label="item.workOrderNo"
                      :value="item.workOrderNo"
                      :key="item.workOrderNo"
                      v-for="item in scope.row.workOrderList"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="流程编号" min-width="300" align="center">
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.processCode"
                    @visible-change="
                      (val) => handleProcessCodeVisibleChange(val, scope.$index)
                    "
                    @change="
                      (val) => handleProcessCodeChange(val, scope.$index)
                    "
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
              <el-table-column label="流程说明" min-width="300" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.processName" disabled></el-input>
                </template>
              </el-table-column>
              <el-table-column
                label="直径"
                min-width="100"
                align="center"
                prop="diameter"
              >
                <template slot-scope="scope">
                  <el-input v-model="scope.row.diameter"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="头部位置" min-width="100" align="center">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.headPosition"
                    @input="(value) => handleHeadChange(value, scope.$index)"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column label="尾部位置" min-width="100" align="center">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.tailPosition"
                    @input="(value) => handleTailChange(value, scope.$index)"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column
                label="晶锭长度"
                min-width="100"
                align="center"
                prop="length"
              >
                <template slot-scope="scope">
                  <el-input v-model="scope.row.length"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                label="计划重量"
                min-width="100"
                align="center"
                prop="planWeight"
              >
                <template slot-scope="scope">
                  <el-input v-model="scope.row.planWeight"></el-input>
                </template>
              </el-table-column>
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
                label="段位"
                min-width="100"
                align="center"
                prop="segmentNum"
              >
                <template slot-scope="scope">
                  <el-input v-model="scope.row.segmentNum"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                label="头部电阻率"
                min-width="120"
                align="center"
                prop="headResistance"
              >
                <template slot-scope="scope">
                  <el-input v-model="scope.row.headResistance"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                label="尾部电阻率"
                min-width="120"
                align="center"
                prop="tailResistance"
              >
                <template slot-scope="scope">
                  <el-input v-model="scope.row.tailResistance"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                label="头部电阻率实测"
                min-width="150"
                align="center"
                prop="headResistanceActual"
              >
                <template slot-scope="scope">
                  <el-input v-model="scope.row.headResistanceActual"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                label="尾部电阻率实测"
                min-width="150"
                align="center"
                prop="tailResistanceActual"
              >
                <template slot-scope="scope">
                  <el-input v-model="scope.row.tailResistanceActual"></el-input>
                </template>
              </el-table-column>
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
                  <el-input-number
                    :style="{ width: '80px' }"
                    :controls="false"
                    v-model="scope.row.head79oi"
                    @change="
                      (value) => handleHead79oiChange(value, scope.$index)
                    "
                  ></el-input-number>
                </template>
              </el-table-column>
              <el-table-column
                label="79oi尾"
                min-width="100"
                align="center"
                prop="tail79oi"
              >
                <template slot-scope="scope">
                  <el-input-number
                    :style="{ width: '80px' }"
                    :controls="false"
                    v-model="scope.row.tail79oi"
                    @change="
                      (value) => handleTail79oiChange(value, scope.$index)
                    "
                  ></el-input-number>
                </template>
              </el-table-column>
              <el-table-column
                label="83oi头"
                min-width="100"
                align="center"
                prop="head83oi"
              >
                <template slot-scope="scope">
                  <el-input-number
                    :style="{ width: '80px' }"
                    :controls="false"
                    v-model="scope.row.head83oi"
                    @change="
                      (value) => handleHead83oiChange(value, scope.$index)
                    "
                  ></el-input-number>
                </template>
              </el-table-column>
              <el-table-column
                label="83oi尾"
                min-width="100"
                align="center"
                prop="tail83oi"
              >
                <template slot-scope="scope">
                  <el-input-number
                    :style="{ width: '80px' }"
                    :controls="false"
                    v-model="scope.row.tail83oi"
                    @change="
                      (value) => handleTail83oiChange(value, scope.$index)
                    "
                  ></el-input-number>
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
                min-width="80"
                align="center"
                prop="remarks"
              >
                <template slot-scope="scope">
                  <el-input v-model="scope.row.remarks"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="合格状态" min-width="120" align="center">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.qualified">
                    <el-option label="合格" :value="0"></el-option>
                    <el-option label="不合格" :value="1"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                label="合格长度"
                min-width="100"
                align="center"
                prop="qualifiedLength"
              >
                <template slot-scope="scope">
                  <el-input v-model="scope.row.qualifiedLength"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                label="合格重量"
                min-width="100"
                align="center"
                prop="qualifiedWeight"
              >
                <template slot-scope="scope">
                  <el-input v-model="scope.row.qualifiedWeight"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                label="不合格原因"
                min-width="150"
                align="center"
                prop="reason"
              >
                <template slot-scope="scope">
                  <el-select v-model="scope.row.reason">
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
                  <el-select v-model="scope.row.reasonIn">
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
            <div
              class="chart"
              :style="{
                width: `${
                  (totalLength / (Math.ceil(totalLength / 50) * 50)) * 100
                }%`,
              }"
            >
              <div
                class="chart-box"
                v-for="(item, index) in formData.segmentedInstructionDetailVos"
                :key="index"
                :style="{
                  width: `${
                    ((item.tailPosition - item.headPosition) * 100) /
                    totalLength
                  }%`,
                }"
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
                    :class="selectedIndex === index ? 'bar-selected' : 'bar'"
                    @click="handleSegmentedBarClick(index)"
                  >
                    <div class="center">
                      {{ item.segmentNo }}
                    </div>
                  </div>
                  <div class="detail">
                    <div class="item">
                      <div class="label">直径：</div>
                      <div class="value">{{ item.diameter }}</div>
                    </div>
                    <div class="item">
                      <div class="label">段位：</div>
                      <div class="value">{{ item.segmentNum }}</div>
                    </div>
                    <div class="item">
                      <div class="label">晶锭长度：</div>
                      <div class="value">{{ item.length }}</div>
                    </div>
                    <div class="item">
                      <div class="label">计划重量：</div>
                      <div class="value">{{ item.planWeight }}</div>
                    </div>
                    <div class="item">
                      <div class="label">头部电阻率：</div>
                      <div class="value">{{ item.headResistance }}</div>
                    </div>
                    <div class="item">
                      <div class="label">尾部电阻率：</div>
                      <div class="value">{{ item.tailResistance }}</div>
                    </div>
                    <div class="item">
                      <div class="label">头部电阻率实测：</div>
                      <div class="value">{{ item.headResistanceActual }}</div>
                    </div>
                    <div class="item">
                      <div class="label">尾部电阻率实测：</div>
                      <div class="value">{{ item.tailResistanceActual }}</div>
                    </div>
                    <div class="item">
                      <div class="label">79oi头：</div>
                      <div class="value">{{ item.head79oi }}</div>
                    </div>
                    <div class="item">
                      <div class="label">79oi尾：</div>
                      <div class="value">{{ item.tail79oi }}</div>
                    </div>
                    <div class="item">
                      <div class="label">合格状态：</div>
                      <div class="value">
                        {{ item.qualified ? "合格" : "不合格" }}
                      </div>
                    </div>
                    <div class="item">
                      <div class="label">合格长度：</div>
                      <div class="value">{{ item.qualifiedLength }}</div>
                    </div>
                    <div class="item">
                      <div class="label">合格重量：</div>
                      <div class="value">{{ item.qualifiedWeight }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="measurement">
              <div
                class="ceil"
                :key="item"
                v-for="(item, index) in this.measurements"
                :style="{ borderLeft: index === 0 ? '1px solid' : 'none' }"
              >
                <div>{{ item }}</div>
                <div class="left-number" v-if="index === 0">0</div>
                <div class="right-number">{{ (index + 1) * 50 }}</div>
              </div>
            </div>
          </div>
        </el-form>
      </div>
    </div>
    <div class="btn" v-if="!$route.query.view">
      <el-button plain class="cancel-btn" @click="back">取消</el-button>
      <el-button type="primary" plain class="save-btn" @click="save"
        >保存</el-button
      >
      <el-button type="primary" class="confirm-btn" @click="confirm"
        >出站确认</el-button
      >
    </div>
  </div>
</template>

<script>
import * as Api from "@/api/inStation";
import { cloneDeep } from "lodash-es";
import { getSeleteData } from "@/utils/select";

export default {
  data() {
    return {
      batchNumber: "Z0116504581",
      grownCrystalFurnace: "A21",
      furnaceNumber: "A2010504581",
      recipe: "Reczl20240310v1",
      processPath: "X0010101",
      dataOrderCode: "",
      productName: "",
      formData: {
        userCreate: null,
        segmentedInstructionDetailVos: [],
      },
      formRules: {
        userCreate: [
          { required: true, message: "操作者不能为空", trigger: "blur" },
        ],
        length: [{ required: true, message: "长度不能为空", trigger: "blur" }],
        number: [{ required: true, message: "数量不能为空", trigger: "blur" }],
      },
      selectedIndex: null,
      wipStorageDisqualificationReasonList: [],
      wipStorageInStorageReasonList: [],
      processMap: {},
    };
  },
  computed: {
    buffParams() {
      const { processUuid, processingOrderCode } = this.$route.query;
      return { processUuid, processingOrderCode };
    },
    totalLength() {
      let list = this.formData.segmentedInstructionDetailVos;
      if (list.length === 0) return 0;
      return (
        (list[list.length - 1].tailPosition ||
          list[list.length - 1].headPosition) - list[0].headPosition
      );
    },
    measurements() {
      let number = Math.ceil(this.totalLength / 50);
      let list = [];
      for (let index = 0; index < number; index++) {
        let charIndex = index % 20;
        list.push(String.fromCharCode(65 + charIndex));
      }
      return list;
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    async handleWorkOrderVisibleChange(visible, index) {
      if (!visible) return;
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
      let list = cloneDeep(this.formData.segmentedInstructionDetailVos);
      list[index].workOrderList = res.data;
      this.formData.segmentedInstructionDetailVos = list;
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
      await getSeleteData(
        "wipStorageDisqualificationReason",
        this.wipStorageDisqualificationReasonList
      );
      await getSeleteData(
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
        } catch (e) {
          console.log(e);
        }
      }
      this.formData = {
        ...this.formData,
        ...fromData,
      };
    },
    async handleCodeClick() {
      let res = await Api.segmentedInstructionGenerateNo(this.formData);
      let list = cloneDeep(this.formData.segmentedInstructionDetailVos);
      res.segmentedInstructionDetailVos.forEach((item, index) => {
        list[index].segmentNo = item.segmentNo;
      });
      this.formData.segmentedInstructionDetailVos = list;
    },
    addSegmentedInfo() {
      let list = this.formData.segmentedInstructionDetailVos;
      let headPosition;
      if (list.length === 0) headPosition = 0;
      else headPosition = list[list.length - 1].tailPosition;
      let item = {
        headPosition,
        type: 0,
        segmentNum: 0,
        headResistance: 0,
        tailResistance: 0,
        diameter: this.formData.diameter,
        planWeight: 0,
      };
      this.formData.segmentedInstructionDetailVos.push(item);
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
      if (index !== 0) {
        let list = cloneDeep(this.formData.segmentedInstructionDetailVos);
        list[index - 1].tailPosition = value;
        this.formData.segmentedInstructionDetailVos = list;
      }
      for (const item of this.formData.segmentedInstructionDetailVos) {
        item.segmentNo = null;
        if (
          (item.tailPosition || item.tailPosition === 0) &&
          (item.headPosition || item.headPosition === 0)
        )
          item.length = item.tailPosition - item.headPosition;
        else item.length = 0;
      }
    },
    handleTailChange(value, index) {
      if (index !== this.formData.segmentedInstructionDetailVos.length - 1) {
        let list = cloneDeep(this.formData.segmentedInstructionDetailVos);
        list[index + 1].headPosition = value;
        this.formData.segmentedInstructionDetailVos = list;
      }
      for (const item of this.formData.segmentedInstructionDetailVos) {
        item.segmentNo = null;
        if (
          (item.tailPosition || item.tailPosition === 0) &&
          (item.headPosition || item.headPosition === 0)
        )
          item.length = item.tailPosition - item.headPosition;
        else item.length = 0;
      }
    },
    handleHead79oiChange(value, index) {
      if (value || value === 0)
        this.formData.segmentedInstructionDetailVos[index].head83oi = (
          value * 0.509
        ).toFixed(3);
    },
    handleTail79oiChange(value, index) {
      if (value || value === 0)
        this.formData.segmentedInstructionDetailVos[index].tail83oi = (
          value * 0.509
        ).toFixed(3);
    },
    handleHead83oiChange(value, index) {
      if (value || value === 0)
        this.formData.segmentedInstructionDetailVos[index].head79oi = (
          value / 0.509
        ).toFixed(3);
    },
    handleTail83oiChange(value, index) {
      if (value || value === 0)
        this.formData.segmentedInstructionDetailVos[index].tail79oi = (
          value / 0.509
        ).toFixed(3);
    },
    back() {
      this.$router.push("/overStationExecution?station=FDZL");
    },
    async save() {
      await Api.upldateBuffer(this.buffParams, this.formData);
      this.$message.success("保存成功!");
      this.back();
    },
    async confirm() {
      const valid = await this.$refs.formRef.validate();
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
      this.$message.success("出站成功");
      Api.deleteBuffer(this.buffParams);
      this.back();
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
  .chart {
    display: flex;
    .chart-box {
      position: relative;
    }
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
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #fff;
        z-index: 2;
        width: 100%;
        height: 100%;
      }
    }
    .bar-selected {
      margin: 0 auto;
      width: calc(100% - 25px);
      height: 60px;
      border: 1px solid rgb(2, 104, 197);
      background-color: rgb(233, 243, 253);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      &::before,
      &::after {
        content: "";
        position: absolute;
        width: 20px;
        height: 60px;
        border: 1px solid rgb(2, 104, 197);
        background-color: rgb(233, 243, 253);
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
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgb(233, 243, 253);
        z-index: 2;
        width: 100%;
        height: 100%;
      }
    }
    .detail {
      margin: 0 auto;
      width: calc(100% - 30px);
      border: 1px solid rgba(0, 0, 0, 0.3);
      margin-top: 10px;
      text-align: center;
      padding: 20px;
      border-radius: 10px;
      .item {
        display: flex;
        justify-content: center;
        gap: 5px;
        width: 100%;
        .label {
          flex: 1;
          text-align: right;
        }
        .value {
          flex: 1;
          text-align: left;
        }
      }
    }
  }
  .table {
    margin-top: 40px;
  }
  .add-btn {
    position: absolute;
    right: 10px;
  }
}
.unit {
  width: 60px;
}
</style>