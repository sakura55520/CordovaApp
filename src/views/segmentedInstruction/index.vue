<template>
  <div class="scroller-flex-wrap">
    <div class="outStationExecution-container">
      <div class="info-container">
        <div class="info">
          <div class="info-label">批次号</div>
          <div class="info-value">{{ batchNumber }}</div>
        </div>
        <div class="info">
          <div class="info-label">长晶炉</div>
          <div class="info-value">{{ grownCrystalFurnace }}</div>
        </div>
        <div class="info">
          <div class="info-label">炉次号</div>
          <div class="info-value">{{ furnaceNumber }}</div>
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
            <el-form-item label="操作者" prop="operator" class="item">
              <el-input v-model="formData.operator" disabled></el-input>
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
              <el-table-column label="样片编号">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.sampleNumber"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="样片标识">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.sampleId"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="样片位置">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.samplePosition"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="类别">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.category"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="晶向">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.crystalOrientation"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="尺寸">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.size"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="结晶比重">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.crystalSpecificGravity"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column label="RES">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.res"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="RES_C">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.res_c"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="RES_E"></el-table-column>
              <el-table-column label="1/2RES"></el-table-column>
              <el-table-column label="1/2 RRG"></el-table-column>
              <el-table-column label="RRG"></el-table-column>
              <el-table-column label="尾部电阻率"></el-table-column>
              <el-table-column label="头尾电阻比"></el-table-column>
              <el-table-column label="OI_C"></el-table-column>
              <el-table-column label="CS"></el-table-column>
              <el-table-column label="OI_E"></el-table-column>
              <el-table-column label="ORG"></el-table-column>
              <el-table-column label="少子寿命"></el-table-column>
              <el-table-column label="测试人员"></el-table-column>
              <el-table-column label="确认人员"></el-table-column>
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
                <el-tooltip placement="bottom">
                  <template #content>
                    <div class="tooltip">
                      直径：8 段位：1 晶锭长度：430 计划重量：40.99
                      头部电阻率：21.4 尾部电阻率：19 头部电阻率实测：21.4
                      尾部电阻率实测：19 79oi头：34.0000 79oi尾：30.0280
                      79oi头：17.3060 79oi尾：15.2840 合格状态：合格品
                      合格长度：430 合格重量：40.99
                    </div>
                  </template>
                  <div
                    :class="selectedIndex === index ? 'bar-selected' : 'bar'"
                    @click="handleSegmentedBarClick(index)"
                  >
                    {{ item.code }}
                  </div>
                </el-tooltip>
              </div>
            </div>
          </div>
        </el-form>
      </div>
    </div>
    <div class="btn">
      <el-button plain class="cancel-btn">取消</el-button>
      <el-button type="primary" plain class="save-btn">保存</el-button>
      <el-button type="primary" class="confirm-btn">出站确认</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      batchNumber: "Z0116504581",
      grownCrystalFurnace: "A21",
      furnaceNumber: "A2010504581",
      recipe: "Reczl20240310v1",
      processPath: "X0010101",
      formData: {
        operator: null,
        segmentedInfo: [
          {
            code: "S0708B019710AI",
            head: 0,
            tail: 430,
          },
          { code: "S0708B019710IQ", head: 430, tail: 838 },
          { code: "S0708B019710QF", head: 838, tail: 1268 },
        ],
      },
      formRules: {
        operator: [
          { required: true, message: "操作者不能为空", trigger: "blur" },
        ],
      },
      selectedIndex: null,
    };
  },
  methods: {
    addSegmentedInfo() {
      this.formData.segmentedInfo.push({ sampleNumber: null });
    },
    deleteSegmentedInfo(index) {
      let list = [...this.formData.segmentedInfo];
      list.splice(index, 1);
      this.formData.segmentedInfo = list;
    },
    handleSegmentedBarClick(index) {
      if (this.selectedIndex === index) this.selectedIndex = null;
      else this.selectedIndex = index;
    },
  },
  computed: {
    totalLength() {
      let list = this.formData.segmentedInfo;
      if (list.length === 0) return 0;
      return list[list.length - 1].tail - list[0].head;
    },
  },
};
</script>

<style lang="scss" scoped>
.outStationExecution-container {
  padding: 12px;
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
  position: absolute;
  bottom: 20px;
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
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      z-index: 2;
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
    }
    .bar-selected {
      margin-top: 10px;
      width: 100%;
      height: 60px;
      border: 1px solid #000;
      background-color: rgb(233, 243, 253);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      z-index: 2;
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