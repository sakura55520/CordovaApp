<!--补信号-->
<template>
  <div class="signal-container">
    <el-form
      ref="supplementSignalForm"
      :model="supplementSignalFormData"
      label-position="left"
      label-width="140px"
      :rules="supplementSignalFormRules"
    >
      <el-form-item label="设备编号" prop="deviceCode">
        <el-input
          style="width: 100%"
          v-model="supplementSignalFormData.deviceCode"
          placeholder="请输入"
        ></el-input>
      </el-form-item>
      <el-form-item label="批号/晶编" prop="processOrderCode">
        <el-input
          v-model="supplementSignalFormData.processOrderCode"
          placeholder="请输入"
        ></el-input>
      </el-form-item>
      <el-form-item label="工步" prop="step">
        <el-select
          v-model="supplementSignalFormData.step"
          clearable
          placeholder="请选择"
        >
          <el-option
            v-for="(item, index) in stepList"
            :key="index"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="信号时间" prop="time">
        <el-date-picker
          v-model="supplementSignalFormData.time"
          type="datetime"
          placeholder="选择日期时间"
          value-format="yyyy-MM-dd HH:mm:ss"
        >
        </el-date-picker>
      </el-form-item>
      <div class="btn">
        <el-button type="primary" @click="handleSupplementSignal">
          补信号
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import * as Api from "@/api/EAPSensorManagement.js";
import { getSeleteData } from "@/utils/select";

export default {
  name: "EAPSensorSupplementSignal",
  data() {
    return {
      supplementSignalFormData: {
        deviceCode: undefined,
        processOrderCode: undefined,
        step: undefined,
        time: undefined,
      },
      supplementSignalFormRules: {
        deviceCode: [
          { required: true, message: "设备编号不能为空", trigger: "change" },
        ],
        processOrderCode: [
          { required: true, message: "批号/晶编不能为空", trigger: "change" },
        ],
        step: [{ required: true, message: "工步不能为空", trigger: "change" }],
        time: [
          { required: true, message: "信号时间不能为空", trigger: "change" },
        ],
      },
      stepList: [],
    };
  },
  async created() {
    getSeleteData("add_step_dict", this.stepList);
  },
  methods: {
    handleSupplementSignal() {
      this.$refs["supplementSignalForm"].validate((valid) => {
        if (valid) {
          const formData = new FormData();
          Object.keys(this.supplementSignalFormData).forEach((key) => {
            formData.append(key, this.supplementSignalFormData[key]);
          });
          Api.addMockStep(formData).then(() => {
            this.$message.success("补信号成功");
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.signal-container {
  margin: 30px 16px 100px 16px;
}
.btn {
  width: 100%;
  text-align: right;
}
</style>
