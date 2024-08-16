<template>
  <div class="scroller-flex-wrap">
    <div class="outStationExecution-container">
      <!-- 顶部信息卡片 -->
      <div class="topInfoCard">
        <div class="grid-container">
          <div class="grid-item">
            <span class="grid-item-name">批次号：</span>
            <span class="grid-item-value">{{ formData.processOrderCode }}</span>
            <span class="end" v-if="isEnd">END</span>
          </div>
          <div class="grid-item" v-if="productionEquipment">
            <span class="grid-item-name">生产设备：</span>
            <span class="grid-item-value">{{ productionEquipment }}</span>
          </div>
          <div class="grid-item" v-if="executionEquipment">
            <span class="grid-item-name">执行设备：</span>
            <span class="grid-item-value">{{ executionEquipment }}</span>
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
          :disabled="$route.query.view"
        >
          <div class="base-form">
            <el-form-item label="操作者" prop="userCreate" class="item">
              <el-input v-model="formData.userCreate" disabled></el-input>
            </el-form-item>
            <el-form-item label="" class="item">
              <el-button
                type="primary"
                size="small"
                class="print-btn"
                @click="handlePrint(formData.processOrderCode)"
                >小标签打印</el-button
              >
            </el-form-item>
          </div>
          <div class="form">
            <div class="form-title">分段信息</div>
            <div class="row">
              <el-form-item label="计划长度" prop="planLength" class="item">
                <el-input v-model="formData.planLength" disabled>
                  <template slot="append">mm</template>
                </el-input>
              </el-form-item>
              <el-form-item
                label="检测实测长度"
                prop="originLength"
                class="item"
              >
                <el-input
                  v-model="formData.originLength"
                  @input="handleLengthChange"
                >
                  <template slot="append">mm</template>
                </el-input>
              </el-form-item>
              <el-form-item
                label="合格长度"
                prop="qualifiedLength"
                class="item"
              >
                <el-input v-model="formData.qualifiedLength" disabled>
                  <template slot="append">mm</template>
                </el-input>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="崩边长度" prop="chippingLength" class="item">
                <el-input
                  v-model="formData.chippingLength"
                  @input="handleLengthChange"
                >
                  <template slot="append">mm</template>
                </el-input>
              </el-form-item>
              <el-form-item label="椭圆长度" prop="ellipticLength" class="item">
                <el-input
                  v-model="formData.ellipticLength"
                  @input="handleLengthChange"
                >
                  <template slot="append">mm</template>
                </el-input>
              </el-form-item>
              <el-form-item label="切割次数" prop="sliceCount" class="item">
                <el-input v-model="formData.sliceCount"> </el-input>
              </el-form-item>
            </div>
          </div>
          <div class="form">
            <div class="form-title">参数说明</div>
            <div class="row">合格长度计算公式：<br /></div>
            <div class="row">
              合格长度（{{ formData.qualifiedLength }} mm） = 检测实测长度（{{
                formData.originLength
              }}
              mm） - 崩边长度（{{ formData.chippingLength }} mm） - 椭圆长度（{{
                formData.ellipticLength
              }}
              mm）<br />
            </div>
          </div>
        </el-form>
      </div>
    </div>
    <div class="page-handle-box" v-if="!$route.query.view">
      <el-button plain class="cancel" @click="back(null, 'confirm')"
        >取消</el-button
      >
      <el-button type="primary" plain class="save" @click="save"
        >保存</el-button
      >
      <el-button type="primary" class="submit" @click="confirm"
        >出站确认</el-button
      >
    </div>
    <!--弹窗: 打印组件-->
    <PrintDialog
      :visible.sync="printVisible"
      :print-data="printData"
      print-type="小标签"
    />
  </div>
</template>

<script>
import * as Api from "@/api/inStation";
import { isEmpty } from "lodash-es";
import overStation from "@/mixins/overStation";
import PrintDialog from "@/components/PrintDialog/index.vue";

export default {
  mixins: [overStation],
  components: {
    PrintDialog,
  },
  data() {
    return {
      formData: {
        userCreate: null,
        planLength: null,
        originLength: null,
        chippingLength: null,
        ellipticLength: null,
        qualifiedLength: null,
      },
      formRules: {
        userCreate: [
          { required: true, message: "操作者不能为空", trigger: "change" },
        ],
        planLength: [
          { required: true, message: "计划长度不能为空", trigger: "change" },
        ],
        originLength: [
          {
            required: true,
            message: "检测实测长度不能为空",
            trigger: "change",
          },
        ],
        chippingLength: [
          { required: true, message: "崩边长度不能为空", trigger: "change" },
        ],
        ellipticLength: [
          { required: true, message: "椭圆长度不能为空", trigger: "change" },
        ],
        qualifiedLength: [
          { required: true, message: "合格长度不能为空", trigger: "change" },
        ],
        sliceCount: [
          { required: true, message: "切割次数不能为空", trigger: "change" },
        ],
      },
      printVisible: false,
      printData: {},
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
      this.initLength();
    },
    initLength() {
      const { originLength, planLength, chippingLength, ellipticLength } =
        this.formData;
      this.formData.originLength = originLength || planLength || 0;
      this.formData.chippingLength = chippingLength || 0;
      this.formData.ellipticLength = ellipticLength || 0;
      this.formData.qualifiedLength = (
        this.formData.originLength -
        this.formData.chippingLength -
        this.formData.ellipticLength
      ).toFixed(2);
    },
    async save() {
      await Api.upldateBuffer(this.buffParams, this.formData);
      const msg = "保存成功!";
      this.back(msg);
    },
    async confirm() {
      const valid = await this.$refs.formRef.validate();
      if (!valid) return;
      let { originLength, planLength } = this.formData;
      if (Math.abs(originLength - planLength) > 10) {
        this.$message.warning("检测实测长度与计划长度的差值不能超过10mm");
        return;
      }
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
      const msg = "出站成功";
      Api.deleteBuffer(this.buffParams);
      this.back(msg);
    },
    handleLengthChange() {
      let { originLength, chippingLength, ellipticLength } = this.formData;
      this.$set(
        this.formData,
        "qualifiedLength",
        (
          (originLength || 0) -
          (chippingLength || 0) -
          (ellipticLength || 0)
        ).toFixed(2)
      );
    },
    handlePrint(code) {
      this.printData.data = code;
      this.printVisible = true;
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
  .add-btn {
    position: absolute;
    right: 10px;
  }
}
.unit {
  width: 60px;
}
.row {
  display: flex;
  gap: 10px;
  width: 100%;
  .item /deep/ {
    flex: 1;
    .el-input-group__append {
      padding: 0 5px;
    }
  }
}
.print-btn {
  float: right;
}
</style>
