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
          label-width="120px"
          :rules="formRules"
        >
          <div class="base-form">
            <el-form-item label="操作者" prop="userCreate" class="item">
              <el-input v-model="formData.userCreate" disabled></el-input>
            </el-form-item>
            <el-form-item label="合格数量" prop="goodQty" class="item">
              <el-input v-model="formData.goodQty"></el-input>
            </el-form-item>
            <el-form-item label="缺陷数量" prop="defectQty" class="item">
              <el-input v-model="formData.defectQty"></el-input>
            </el-form-item>
            <el-form-item label="报废数量" prop="scrapQty" class="item">
              <el-input v-model="formData.scrapQty"></el-input>
            </el-form-item>
          </div>
          <div class="form">
            <div class="form-title">设备/工艺参数确认</div>
            <el-form-item label="头部重量" prop="headWeight" class="item">
              <div class="input">
                <el-input class="value" v-model="formData.headWeight">
                  <template slot="append">kg</template>
                </el-input>
              </div>
            </el-form-item>
            <el-form-item label="尾部重量" prop="tailWeight" class="item">
              <div class="input">
                <el-input class="value" v-model="formData.tailWeight">
                  <template slot="append">kg</template>
                </el-input>
              </div>
            </el-form-item>
            <el-form-item label="当前长度" prop="lengthQty" class="item">
              <div class="input">
                <el-input class="value" v-model="formData.lengthQty">
                  <template slot="append">cm</template>
                </el-input>
              </div>
            </el-form-item>
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
      furnaceNumber: "A2010504581",
      recipe: "Reczl20240310v1",
      processPath: "X0010101",
      dataOrderCode: "",
      productName: "",
      formData: {
        userCreate: null,
        goodQty: null,
        defectQty: null,
        scrapQty: null,
      },
      formRules: {
        userCreate: [
          { required: true, message: "操作者不能为空", trigger: "blur" },
        ],
        goodQty: [
          { required: true, message: "合格数量不能为空", trigger: "blur" },
        ],
        defectQty: [
          { required: true, message: "缺陷数量不能为空", trigger: "blur" },
        ],
        scrapQty: [
          { required: true, message: "报废数量不能为空", trigger: "blur" },
        ],
        headWeight: [
          { required: true, message: "头部重量不能为空", trigger: "blur" },
        ],
        tailWeight: [
          { required: true, message: "尾部重量不能为空", trigger: "blur" },
        ],
        lengthQty: [
          { required: true, message: "当前长度不能为空", trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    buffParams() {
      const { processUuid, processingOrderCode } = this.$route.query;
      return { processUuid, processingOrderCode };
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
    back() {
      this.$router.push("/overStationExecution?station=QTWQY");
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
}
.unit {
  width: 60px;
}
</style>