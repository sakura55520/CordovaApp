<template>
  <div class="scroller-flex-wrap">
    <div class="outStationExecution-container">
      <div class="info-container">
        <div class="info">
          <div class="info-label">批次号</div>
          <div class="info-value">{{ formData.processOrderCode }}</div>
        </div>
        <div class="info">
          <div class="info-label">长晶炉</div>
          <div class="info-value">{{ $route.query.deviceCode }}</div>
        </div>
        <div class="info">
          <div class="info-label">炉次号</div>
          <div class="info-value">{{ furnaceNumber }}</div>
        </div>
        <div class="info">
          <div class="info-label">产品料号</div>
          <div class="info-value">{{ dataOrderCode }}</div>
        </div>
        <div class="info">
          <div class="info-label">产品名称</div>
          <div class="info-value">{{ productName }}</div>
        </div>
        <div class="info">
          <div class="info-label">配方</div>
          <div class="info-value">{{ recipe }}</div>
        </div>
        <div class="info">
          <div class="info-label">工艺路径</div>
          <div class="info-value">{{ processPath }}</div>
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
                    <el-button
                      type="text"
                      @click="handleCodeClick(scope.row, scope.$index)"
                      >获取晶锭编号</el-button
                    >
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="下发工单" min-width="150" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.orderCode"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="流程编号" min-width="100" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.processCode"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="流程说明" min-width="100" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.processName"></el-input>
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
              </el-table-column>
              <el-table-column
                label="计划重量"
                min-width="100"
                align="center"
                prop="planWeight"
              >
              </el-table-column>
              <el-table-column
                label="段位"
                min-width="100"
                align="center"
                prop="segmentNum"
              ></el-table-column>
              <el-table-column
                label="头部电阻率"
                min-width="120"
                align="center"
                prop="headResistance"
              ></el-table-column>
              <el-table-column
                label="尾部电阻率"
                min-width="120"
                align="center"
                prop="tailResistance"
              ></el-table-column>
              <el-table-column
                label="头部电阻率实测"
                min-width="150"
                align="center"
                prop="headResistanceActual"
              ></el-table-column>
              <el-table-column
                label="尾部电阻率实测"
                min-width="150"
                align="center"
                prop="tailResistanceActual"
              ></el-table-column>
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
              ></el-table-column>
              <el-table-column
                label="79oi尾"
                min-width="100"
                align="center"
                prop="tail79oi"
              ></el-table-column>
              <el-table-column
                label="83oi头"
                min-width="100"
                align="center"
                prop="head83oi"
              ></el-table-column>
              <el-table-column
                label="83oi尾"
                min-width="100"
                align="center"
                prop="tail83oi"
              ></el-table-column>
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
                min-width="120"
                align="center"
                prop="reason"
              >
                <template slot-scope="scope">
                  <el-input v-model="scope.row.reason"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                label="入库原因"
                min-width="100"
                align="center"
                prop="reasonIn"
              >
                <template slot-scope="scope">
                  <el-input v-model="scope.row.reasonIn"></el-input>
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
                v-for="(item, index) in formData.segmentedInstructionDetailVos"
                :key="index"
                :style="{
                  width: `${
                    ((item.tailPosition - item.headPosition) * 100) /
                    totalLength
                  }%`,
                }"
              >
                <div class="number">
                  <div v-if="index === 0" class="headPosition">
                    {{ item.headPosition }}
                  </div>
                  <div class="tailPosition">{{ item.tailPosition }}</div>
                </div>
                <div class="line"></div>
                <el-tooltip placement="bottom" effect="light">
                  <template #content>
                    <div>直径：{{ item.diameter }}</div>
                    <div>段位：{{ item.segmentNum }}</div>
                    <div>晶锭长度：{{ item.length }}</div>
                    <div>计划重量：{{ item.planWeight }}</div>
                    <div>头部电阻率：{{ item.headResistance }}</div>
                    <div>尾部电阻率：{{ item.tailResistance }}</div>
                    <div>头部电阻率实测：{{ item.headResistanceActual }}</div>
                    <div>尾部电阻率实测：{{ item.tailResistanceActual }}</div>
                    <div>79oi头：{{ item.head79oi }}</div>
                    <div>79oi尾：{{ item.tail79oi }}</div>
                    <div>
                      合格状态：{{ item.qualified ? "合格" : "不合格" }}
                    </div>
                    <div>合格长度：{{ item.qualifiedLength }}</div>
                    <div>合格重量：{{ item.qualifiedWeight }}</div>
                  </template>
                  <div
                    :class="selectedIndex === index ? 'bar-selected' : 'bar'"
                    @click="handleSegmentedBarClick(index)"
                  >
                    <div class="center">
                      {{ item.segmentNo }}
                    </div>
                  </div>
                </el-tooltip>
              </div>
            </div>
          </div>
        </el-form>
      </div>
    </div>
    <div class="btn">
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
      },
      selectedIndex: null,
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
      return list[list.length - 1].tailPosition - list[0].headPosition;
    },
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
      fromData = {
        userCreate: "NC系统",
        gmtCreate: "2024-03-28 08:55:53",
        userUpdate: "NC系统",
        gmtUpdate: "2024-03-28 09:10:40",
        wipStorageId: null,
        processId: 206,
        processCode: "FDZL",
        processName: "分段指令",
        processUuid: "z20tnran49",
        processOrderCode: "E3714P0001A",
        materialCode: "IGMCXN16P",
        materialName: "IGMCXN16P",
        materialVersion: "1.0",
        length: 700,
        number: 20,
        diameter: 4,
        reCutNum: 0,
        segmentNum: null,
        sampleNum: null,
        recycleNum: null,
        segmentedInstructionDetailVos: [
          {
            diameter: 4,
            head79oi: 0,
            head83oi: 0,
            headPosition: 0,
            headResistance: 0,
            headResistanceActual: 0,
            length: 10,
            orderCode: "",
            planWeight: 0,
            processCode: "",
            processName: "",
            qualifiedLength: 0,
            qualifiedWeight: 0,
            reason: "",
            reasonIn: "",
            remarks: "",
            segmentNo: "",
            segmentNum: 0,
            status: 0,
            tail79oi: 0,
            tail83oi: 0,
            tailPosition: 700,
            tailResistance: 0,
            tailResistanceActual: 0,
            transMap: {},
            type: 0,
            userCreate: "",
            userUpdate: "",
          },
          {
            diameter: 4,
            head79oi: 0,
            head83oi: 0,
            headPosition: 700,
            headResistance: 0,
            headResistanceActual: 0,
            length: 10,
            orderCode: "",
            planWeight: 0,
            processCode: "",
            processName: "",
            qualifiedLength: 0,
            qualifiedWeight: 0,
            reason: "",
            reasonIn: "",
            remarks: "",
            segmentNo: "",
            segmentNum: 0,
            status: 0,
            tail79oi: 0,
            tail83oi: 0,
            tailPosition: 1500,
            tailResistance: 0,
            tailResistanceActual: 0,
            transMap: {},
            type: 0,
            userCreate: "",
            userUpdate: "",
          },
          {
            diameter: 4,
            head79oi: 0,
            head83oi: 0,
            headPosition: 1500,
            headResistance: 0,
            headResistanceActual: 0,
            length: 10,
            orderCode: "",
            planWeight: 0,
            processCode: "",
            processName: "",
            qualifiedLength: 0,
            qualifiedWeight: 0,
            reason: "",
            reasonIn: "",
            remarks: "",
            segmentNo: "",
            segmentNum: 0,
            status: 0,
            tail79oi: 0,
            tail83oi: 0,
            tailPosition: 1950,
            tailResistance: 0,
            tailResistanceActual: 0,
            transMap: {},
            type: 0,
            userCreate: "",
            userUpdate: "",
          },
        ],
        transMap: {},
      };
      this.formData = { ...this.formData, ...fromData };
    },
    async handleCodeClick(row, index) {
      let res = await Api.segmentedInstructionGenerateNo(this.formData);
      res.segmentedInstructionDetailVos.forEach((item, index) => {
        this.formData.segmentedInstructionDetailVos[index].segmentNo =
          item.segmentNo;
      });
    },
    addSegmentedInfo() {
      let list = this.formData.segmentedInstructionDetailVos;
      let headPosition;
      if (list.length === 0) headPosition = 0;
      else headPosition = list[list.length - 1].tailPosition;
      let item = {
        headPosition,
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
        this.formData.segmentedInstructionDetailVos[index - 1].tailPosition =
          value;
      }
      for (const item of this.formData.segmentedInstructionDetailVos) {
        item.segmentNo = null;
      }
    },
    handleTailChange(value, index) {
      if (index !== this.formData.segmentedInstructionDetailVos.length - 1) {
        this.formData.segmentedInstructionDetailVos[index + 1].headPosition =
          value;
      }
      for (const item of this.formData.segmentedInstructionDetailVos) {
        item.segmentNo = null;
      }
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
  .chart {
    display: flex;
    gap: 30px;
    width: 100%;
    .number {
      height: 20px;
      .headPosition {
        float: left;
      }
      .tailPosition {
        float: right;
      }
    }
    .line {
      width: 100%;
      height: 10px;
      border: 1px solid #000;
      border-top: none;
    }
    .bar {
      margin-top: 10px;
      width: 100%;
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
      margin-top: 10px;
      width: 100%;
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
    .tooltip {
      max-width: 200px;
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