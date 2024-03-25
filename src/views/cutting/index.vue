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
            <el-form-item
              label="合格数量"
              prop="qualifiedQuantity"
              class="item"
            >
              <div class="input">
                <el-input
                  class="value"
                  v-model="formData.qualifiedQuantity"
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
            </el-table>
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
  .add-btn {
    position: absolute;
    right: 10px;
  }
}
.unit {
  width: 60px;
}
</style>