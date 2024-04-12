<template>
  <el-form
    :model="formData"
    label-position="left"
    label-width="100px"
    :rules="formRules"
  >
    <div class="form">
      <div class="form-title">单晶信息</div>
      <el-form-item label="检测人员" prop="inspector" class="item">
        <el-input v-model="formData.inspector" disabled></el-input>
      </el-form-item>
      <el-form-item label="合格数量" prop="qualifiedQuantity" class="item">
        <el-input v-model="formData.qualifiedQuantity" disabled></el-input>
      </el-form-item>
      <el-form-item label="异常数量" prop="abnormalQuantity" class="item">
        <el-input v-model="formData.abnormalQuantity"></el-input>
      </el-form-item>
      <el-form-item label="型号" prop="model" class="item">
        <el-input v-model="formData.model"></el-input>
      </el-form-item>
      <el-form-item label="尺寸" prop="size" class="item">
        <el-input v-model="formData.size"></el-input>
      </el-form-item>
      <el-form-item label="晶向" prop="crystalOrientation" class="item">
        <el-input v-model="formData.crystalOrientation"></el-input>
      </el-form-item>
      <el-form-item label="目标电阻率" prop="targetResistivity" class="item">
        <el-input v-model="formData.targetResistivity"></el-input>
      </el-form-item>
    </div>
    <div class="form">
      <div class="form-title">样片信息</div>
      <el-button
        size="small"
        type="primary"
        class="add-btn"
        @click="addSampleInfo"
        >+ 新增</el-button>
      <el-table
        :data="formData.sampleInfo"
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
            <el-input v-model="scope.row.crystalSpecificGravity"></el-input>
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
              @click="deleteSampleInfo(scope.$index)"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-form>
</template>

<script>
export default {
  name: "IngotDetection",
  data() {
    return {
      formData: {
        inspector: null,
        qualifiedQuantity: null,
        abnormalQuantity: null,
        model: null,
        size: null,
        crystalOrientation: null,
        targetResistivity: null,
        sampleInfo: [],
      },
      formRules: {
        inspector: [
          { required: true, message: "检测人员不能为空", trigger: "blur" },
        ],
        qualifiedQuantity: [
          { required: true, message: "合格数量不能为空", trigger: "blur" },
        ],
        abnormalQuantity: [
          { required: true, message: "异常数量不能为空", trigger: "blur" },
        ],
        scrapQuantity: [
          { required: true, message: "报废数量不能为空", trigger: "blur" },
        ],
        headWeight: [
          { required: true, message: "头部重量不能为空", trigger: "blur" },
        ],
        tailWeight: [
          { required: true, message: "尾部重量不能为空", trigger: "blur" },
        ],
        currentLength: [
          { required: true, message: "当前长度不能为空", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    addSampleInfo() {
      this.formData.sampleInfo.push({ sampleNumber: null });
    },
    deleteSampleInfo(index) {
      let list = [...this.formData.sampleInfo];
      list.splice(index, 1);
      this.formData.sampleInfo = list;
    },
  },
};
</script>

<style lang="scss" scoped>
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
