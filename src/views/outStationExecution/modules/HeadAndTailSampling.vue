<template>
  <el-form
    :model="formData"
    label-position="left"
    label-width="100px"
    :rules="formRules"
  >
    <div class="first-form">
      <el-form-item label="操作者" prop="operator" class="item">
        <el-input v-model="formData.operator" disabled></el-input>
      </el-form-item>
      <el-form-item label="合格数量" prop="qualifiedQuantity" class="item">
        <el-input v-model="formData.qualifiedQuantity" disabled></el-input>
      </el-form-item>
      <el-form-item label="缺陷数量" prop="defectQuantity" class="item">
        <el-input v-model="formData.defectQuantity"></el-input>
      </el-form-item>
      <el-form-item label="报废数量" prop="scrapQuantity" class="item">
        <el-input v-model="formData.scrapQuantity"></el-input>
      </el-form-item>
    </div>
    <div class="secord-form">
      <div class="secord-form-title">设备/工艺参数确认</div>
      <el-form-item label="头部重量" prop="headWeight" class="item">
        <div class="input">
          <el-input class="value" v-model="formData.headWeight"></el-input>
          <div class="unit">kg</div>
        </div>
      </el-form-item>
      <el-form-item label="尾部重量" prop="tailWeight" class="item">
        <div class="input">
          <el-input class="value" v-model="formData.tailWeight"></el-input>
          <div class="unit">kg</div>
        </div>
      </el-form-item>
      <el-form-item label="当前长度" prop="currentLength" class="item">
        <div class="input">
          <el-input class="value" v-model="formData.currentLength"></el-input>
          <div class="unit">cm</div>
        </div>
      </el-form-item>
    </div>
  </el-form>
</template>

<script>
export default {
  name: "HeadAndTailSampling",
  data() {
    return {
      formData: {
        operator: null,
        qualifiedQuantity: null,
        defectQuantity: null,
        scrapQuantity: null,
      },
      formRules: {
        operator: [
          { required: true, message: "操作者不能为空", trigger: "blur" },
        ],
        qualifiedQuantity: [
          { required: true, message: "合格数量不能为空", trigger: "blur" },
        ],
        defectQuantity: [
          { required: true, message: "缺陷数量不能为空", trigger: "blur" },
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
};
</script>

<style lang="scss" scoped>
.first-form {
  display: flex;
  flex-wrap: wrap;
  gap: 2%;
  .item {
    width: 49%;
  }
}
.secord-form {
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
  .secord-form-title {
    position: absolute;
    top: -10px;
    left: 20px;
    background: white;
  }
}
.unit {
  width: 60px;
}
</style>