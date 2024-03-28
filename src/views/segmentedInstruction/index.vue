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
              :data="formData.segmentedInfo"
              class="table"
              :header-cell-style="{
                background: 'rgba(242, 242, 242)',
                color: '#606266',
              }"
            >
              <el-table-column label="晶锭编号" min-width="150" align="center">
                <template slot-scope="scope">
                  <div v-if="scope.row.code">{{ scope.row.code }}</div>
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
                  <el-input v-model="scope.row.order"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="流程编号" min-width="100" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.processCode"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="流程说明" min-width="100" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.category"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="直径" min-width="100" align="center">
              </el-table-column>
              <el-table-column label="头部位置" min-width="100" align="center">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.head"
                    @input="(value) => handleHeadChange(value, scope.$index)"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column label="尾部位置" min-width="100" align="center">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.tail"
                    @input="(value) => handleTailChange(value, scope.$index)"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column label="晶锭长度" min-width="100" align="center">
              </el-table-column>
              <el-table-column label="计划重量" min-width="100" align="center">
              </el-table-column>
              <el-table-column
                label="段位"
                min-width="100"
                align="center"
              ></el-table-column>
              <el-table-column
                label="头部电阻率"
                min-width="120"
                align="center"
              ></el-table-column>
              <el-table-column
                label="尾部电阻率"
                min-width="120"
                align="center"
              ></el-table-column>
              <el-table-column
                label="头部电阻率实测"
                min-width="150"
                align="center"
              ></el-table-column>
              <el-table-column
                label="尾部电阻率实测"
                min-width="150"
                align="center"
              ></el-table-column>
              <el-table-column
                label="头尾电阻比"
                min-width="120"
                align="center"
              ></el-table-column>
              <el-table-column
                label="79oi头"
                min-width="100"
                align="center"
              ></el-table-column>
              <el-table-column
                label="79oi尾"
                min-width="100"
                align="center"
              ></el-table-column>
              <el-table-column
                label="83oi头"
                min-width="100"
                align="center"
              ></el-table-column>
              <el-table-column
                label="83oi尾"
                min-width="100"
                align="center"
              ></el-table-column>
              <el-table-column
                label="滚圆"
                min-width="80"
                align="center"
              ></el-table-column>
              <el-table-column
                label="参考面"
                min-width="100"
                align="center"
              ></el-table-column>
              <el-table-column
                label="说明"
                min-width="80"
                align="center"
              ></el-table-column>
              <el-table-column label="合格状态" min-width="100" align="center">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.qualified">
                    <el-option label="合格" :value="true"></el-option>
                    <el-option label="不合格" :value="false"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                label="合格长度"
                min-width="100"
                align="center"
              ></el-table-column>
              <el-table-column
                label="合格重量"
                min-width="100"
                align="center"
              ></el-table-column>
              <el-table-column
                label="不合格原因"
                min-width="120"
                align="center"
              >
                <template slot-scope="scope">
                  <el-select v-model="scope.row.qualified"></el-select>
                </template>
              </el-table-column>
              <el-table-column label="入库原因" min-width="100" align="center">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.qualified"></el-select>
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
                v-for="(item, index) in formData.segmentedInfo"
                :key="item.code"
                :style="{
                  width: `${((item.tail - item.head) * 100) / totalLength}%`,
                }"
              >
                <div class="number">
                  <div v-if="index === 0" class="head">{{ item.head }}</div>
                  <div class="tail">{{ item.tail }}</div>
                </div>
                <div class="line"></div>
                <el-tooltip placement="bottom" effect="light">
                  <template #content>
                    <div>直径：8</div>
                    <div>段位：1</div>
                    <div>晶锭长度：430</div>
                    <div>计划重量：40.99</div>
                    <div>头部电阻率：21.4</div>
                    <div>尾部电阻率：19</div>
                    <div>头部电阻率实测：21.4</div>
                    <div>尾部电阻率实测：19</div>
                    <div>79oi头：17.3060</div>
                    <div>79oi尾：15.2840</div>
                    <div>合格状态：合格品</div>
                    <div>合格长度：430</div>
                    <div>合格重量：40.99</div>
                  </template>
                  <div
                    :class="selectedIndex === index ? 'bar-selected' : 'bar'"
                    @click="handleSegmentedBarClick(index)"
                  >
                    <div class="center">
                      {{ item.code }}
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
        segmentedInfo: [
          {
            code: "S0708B019710AI",
            order: "W2305153",
            processCode: "IG03",
            diameter: 10,
            head: 0,
            tail: 430,
          },
          {
            code: "S0708B019710IQ",
            order: "W2305154",
            processCode: "IG03",
            diameter: 10,
            head: 430,
            tail: 838,
          },
          {
            code: "S0708B019710QF",
            order: "W2305155",
            processCode: "IG03",
            diameter: 10,
            head: 838,
            tail: 1268,
          },
        ],
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
      let list = this.formData.segmentedInfo;
      if (list.length === 0) return 0;
      return list[list.length - 1].tail - list[0].head;
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

      this.formData = { ...this.formData, ...fromData };
    },
    handleCodeClick(row, index) {
      this.formData.segmentedInfo[index].code = "123";
    },
    addSegmentedInfo() {
      let list = this.formData.segmentedInfo;
      let head;
      if (list.length === 0) head = 0;
      else head = list[list.length - 1].tail;
      let item = {
        head,
      };
      this.formData.segmentedInfo.push(item);
    },
    deleteSegmentedInfo(index) {
      let list = [...this.formData.segmentedInfo];
      list.splice(index, 1);
      this.formData.segmentedInfo = list;
    },
    handleSegmentedBarClick(index) {
      this.selectedIndex = index;
    },
    handleHeadChange(value, index) {
      if (index !== 0) {
        this.formData.segmentedInfo[index - 1].tail = value;
        //更新晶锭编码
      }
    },
    handleTailChange(value, index) {
      if (index !== this.formData.segmentedInfo.length - 1) {
        this.formData.segmentedInfo[index + 1].head = value;
        //更新晶锭编码
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
      .head {
        float: left;
      }
      .tail {
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