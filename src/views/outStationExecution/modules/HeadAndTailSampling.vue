<template>
  <el-form :model="formData" label-position="left" label-width="100px">
    <div class="first-form">
      <el-form-item label="操作者" prop="operator" class="item">
        <el-input v-model="formData.operator"></el-input>
      </el-form-item>
      <el-form-item label="合格数量" prop="qualifiedQuantity" class="item">
        <el-input v-model="formData.qualifiedQuantity"></el-input>
      </el-form-item>
      <el-form-item label="缺陷数量" prop="defectQuantity" class="item">
        <el-input v-model="formData.defectQuantity"></el-input>
      </el-form-item>
      <el-form-item label="报废数量" prop="scrapQuantity" class="item">
        <el-input v-model="formData.scrapQuantity"></el-input>
      </el-form-item>
    </div>
    <div class="secord-form">
      <el-form-item label="头部重量" prop="headWeight" class="item">
        <el-input v-model="formData.headWeight"></el-input>
      </el-form-item>
      <el-form-item label="尾部重量" prop="tailWeight" class="item">
        <el-input v-model="formData.tailWeight"></el-input>
      </el-form-item>
      <el-form-item label="当前长度" prop="currentLength" class="item">
        <el-input v-model="formData.defectQuantity"></el-input>
      </el-form-item>
      <div class="secord-form-title">设备/工艺参数确认</div>
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
  }
  .secord-form-title {
    position: absolute;
    top: -10px;
    left: 20px;
    background: white;
  }
}
</style>