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
          label-width="140px"
          :rules="formRules"
          :disabled="$route.query.view"
        >
          <div class="base-form">
            <el-form-item label="操作者" prop="userCreate" class="item">
              <el-input v-model="formData.userCreate" disabled></el-input>
            </el-form-item>
            <el-form-item label="进站数量" prop="weighingQty" class="item">
              <el-input v-model="formData.weighingQty" disabled>
                <template slot="append">kg</template>
              </el-input>
            </el-form-item>
            <el-form-item
              label="位错反延线长度"
              prop="offsetLength"
              class="item"
            >
              <el-input
                v-model="formData.offsetLength"
                :style="{ width: '100%' }"
                disabled
              >
                <template slot="append">mm</template>
              </el-input>
            </el-form-item>
          </div>
          <el-form-item label="生产备注" class="form-item-cover">
            <el-input
              type="textarea"
              class="value"
              v-model="formData.productionRemark"
              disabled
            />
          </el-form-item>
          <div class="form">
            <div class="form-title">设备/工艺参数确认</div>
            <el-form-item label="原始长度" prop="originLength" class="item">
              <div class="input">
                <el-input
                  class="value"
                  v-model="formData.originLength"
                  disabled
                >
                  <template slot="append">mm</template>
                </el-input>
              </div>
            </el-form-item>
            <el-form-item
              label="实测长度"
              prop="actualMeasuredLength"
              class="item"
            >
              <div class="input">
                <el-input class="value" v-model="formData.actualMeasuredLength">
                  <template slot="append">mm</template>
                </el-input>
              </div>
            </el-form-item>
            <el-form-item label="备注" class="form-item-cover">
              <el-input
                type="textarea"
                class="value"
                v-model="formData.remarks"
              />
            </el-form-item>
          </div>
          <div class="form">
            <div class="form-title">留档文档记录</div>
            <div class="growth-section">
              <PhotoNew
                v-model="formData._files"
                :componentDisabled="false"
                :name="'CHECK_DEVICE'"
                @input="handleFileChange"
              />
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
  </div>
</template>

<script>
import * as Api from "@/api/inStation";
import overStation from "@/mixins/overStation";
import PhotoNew from "@/views/components/photoNew";

export default {
  mixins: [overStation],
  components: {
    PhotoNew,
  },
  data() {
    return {
      formData: {
        userCreate: null,
        weighingQty: null,
        originLength: null,
        actualMeasuredLength: null,
        offsetLength: null,
        productionRemark: null,
        remarks: null,
        _files: [],
      },
      formRules: {
        userCreate: [
          { required: true, message: "操作者不能为空", trigger: "change" },
        ],
        weighingQty: [
          { required: true, message: "进站数量不能为空", trigger: "change" },
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

      this.formData._files = (
        Array.isArray(this.formData.photo)
          ? this.formData.photo
          : JSON.parse(this.formData.photo || "[]")
      ).map((fileItem) => ({
        ...fileItem,
        big_url: fileItem.fileUrl,
        thumb_url: fileItem.fileUrl,
      }));
    },
    async save() {
      await Api.upldateBuffer(this.buffParams, this.formData);
      const msg = "保存成功!";
      this.back(msg);
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
      const msg = "出站成功";
      Api.deleteBuffer(this.buffParams);
      this.back(msg);
    },
    handleFileChange() {
      const photo = (this.formData._files || []).map(
        ({ big_url, thumb_url, ...item }) => ({
          ...item,
          fileUrl: big_url,
        })
      );
      this.formData.photo = photo;
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
.print-btn {
  padding: 9px 20px;
}
.table {
  margin-top: 50px;
}
.add-btn {
  position: absolute;
  left: 12px;
}
.form-custom-verify {
  .form-input {
    margin-bottom: 0px;
  }
}
.form-table-header:before {
  content: "* ";
  color: red;
}
</style>
