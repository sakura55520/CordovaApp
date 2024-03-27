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
            <el-form-item label="操作者" prop="operator" class="item">
              <el-input v-model="formData.operator" disabled></el-input>
            </el-form-item>
            <el-form-item
              label="合格数量"
              prop="qualifiedQuantity"
              class="item"
            >
              <div class="input">
                <el-input
                  class="value"
                  v-model="formData.qualifiedQuantity"
                  disabled
                ></el-input>
                <div class="unit">kg</div>
              </div>
            </el-form-item>
            <el-form-item label="报废数量" prop="scrapQuantity" class="item">
              <div class="input">
                <el-input
                  class="value"
                  v-model="formData.scrapQuantity"
                ></el-input>
                <div class="unit">kg</div>
              </div>
            </el-form-item>
          </div>
          <div class="form">
            <div class="form-title">分段信息</div>
            <el-table
              :data="formData.segmentedInfo"
              class="table"
              :header-cell-style="{
                background: 'rgba(242, 242, 242)',
                color: '#606266',
              }"
            >
              <el-table-column
                label="晶锭编号"
                prop="code"
                min-width="100"
                align="center"
              >
              </el-table-column>
              <el-table-column
                label="计划长度"
                prop="planLength"
                min-width="100"
                align="center"
              >
              </el-table-column>
              <el-table-column
                label="原始长度"
                prop="originalLength"
                min-width="100"
                align="center"
              >
                <template slot-scope="scope">
                  <el-input v-model="scope.row.order"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                label="崩边长度"
                prop="flakingLength"
                min-width="100"
                align="center"
              >
                <template slot-scope="scope">
                  <el-input v-model="scope.row.order"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                label="椭圆长度"
                prop="ellipseLength"
                min-width="100"
                align="center"
              >
                <template slot-scope="scope">
                  <el-input v-model="scope.row.order"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                label="合格长度"
                prop="passLength"
                min-width="100"
                align="center"
              >
              </el-table-column>
            </el-table>
          </div>
        </el-form>
      </div>
    </div>
    <div class="btn">
      <el-button plain class="cancel-btn" @click="cancel">取消</el-button>
      <el-button type="primary" plain class="save-btn">保存</el-button>
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
      formData: {
        operator: null,
        qualifiedQuantity: null,
        scrapQuantity: null,
        segmentedInfo: [],
      },
      formRules: {
        operator: [
          { required: true, message: "操作者不能为空", trigger: "blur" },
        ],
        qualifiedQuantity: [
          { required: true, message: "合格数量不能为空", trigger: "blur" },
        ],
        scrapQuantity: [
          { required: true, message: "报废数量不能为空", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    cancel() {
      window.history.go(-1);
    },
    confirm() {
      Api.inOrOutStation().then((res) => {
        this.$message.success("出站成功");
      });
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
    right: 10px;
  }
}
.unit {
  width: 60px;
}
</style>