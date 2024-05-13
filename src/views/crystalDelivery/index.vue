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
            <span class="grid-item-name">生产设备：</span>
            <span class="grid-item-value">{{
              formData.deviceCode || $route.query.deviceCode
            }}</span>
          </div>
        </div>
      </div>
      <el-divider class="divider" />
      <h3>
        出站数据录入 <i class="el-icon-refresh" @click="fetchSwitchDict" />
      </h3>
      <div class="outStation-form">
        <el-form
          ref="formRef"
          :model="formData"
          label-position="left"
          label-width="150px"
          :rules="formRules"
          :disabled="$route.query.view"
        >
          <div class="base-form">
            <div class="row">
              <el-form-item
                label="操作者"
                prop="userCreate"
                class="item"
                label-width="90px"
              >
                <el-input
                  v-model="formData.userCreate"
                  :disabled="!enableMap.userCreate"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="反馈重量"
                prop="feedbackQty"
                class="item"
                label-width="90px"
              >
                <el-input v-model="formData.feedbackQty" disabled>
                  <template slot="append">kg</template>
                </el-input>
              </el-form-item>
              <el-form-item
                label="收尾情况"
                prop="endSitutation"
                class="item"
                label-width="90px"
              >
                <el-input
                  v-model="formData.endSitutation"
                  :disabled="!enableMap.endSitutation"
                ></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="form">
            <div class="form-title">设备/工艺参数确认</div>
            <div class="row">
              <el-form-item
                label="单晶编号一致性"
                prop="numberConsistence"
                class="item"
                label-width="140px"
              >
                <el-select
                  v-model="formData.numberConsistence"
                  placeholder=""
                  :style="{ width: '100%' }"
                >
                  <el-option label="是" :value="true"></el-option>
                  <el-option label="否" :value="false"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="位错反延线标识"
                prop="dislocationIdentification"
                class="item"
                label-width="140px"
              >
                <el-select
                  v-model="formData.dislocationIdentification"
                  placeholder=""
                  :style="{ width: '100%' }"
                >
                  <el-option label="是" :value="true"></el-option>
                  <el-option label="否" :value="false"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="位错反延线长度"
                prop="dislocationIdentificationLength"
                class="item"
                label-width="130px"
              >
                <div class="input">
                  <el-input
                    class="value"
                    v-model="formData.dislocationIdentificationLength"
                  >
                    <template slot="append">mm</template>
                  </el-input>
                </div>
              </el-form-item>
              <el-form-item
                label="脱开直径"
                prop="disengageDiameter"
                class="item"
                label-width="90px"
              >
                <div class="input">
                  <el-input class="value" v-model="formData.disengageDiameter">
                    <template slot="append">mm</template>
                  </el-input>
                </div>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item
                label="拉晶实测直径(头)"
                prop="measuredDiameterHead"
                class="item"
              >
                <el-input class="value" v-model="formData.measuredDiameterHead">
                  <template slot="append">mm</template>
                </el-input>
              </el-form-item>
              <el-form-item
                label="拉晶实测直径(中)"
                prop="measuredDiameterMiddle"
                class="item"
              >
                <el-input
                  class="value"
                  v-model="formData.measuredDiameterMiddle"
                >
                  <template slot="append">mm</template>
                </el-input>
              </el-form-item>
              <el-form-item
                label="拉晶实测直径(尾)"
                prop="measuredDiameterTail"
                class="item"
              >
                <el-input class="value" v-model="formData.measuredDiameterTail">
                  <template slot="append">mm</template>
                </el-input>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="晶锭称重" prop="ingotWeight" class="item">
                <div class="input">
                  <el-input
                    class="value"
                    v-model="formData.ingotWeight"
                    @change="handleIngotWeightChange"
                  >
                    <template slot="append">kg</template>
                  </el-input>
                </div>
              </el-form-item>
              <el-form-item
                label="埚底料毛重"
                prop="bottomMaterialGrossWeight"
                class="item"
                :rules="[
                  {
                    required: true,
                    message: '埚底料毛重不能为空',
                    trigger: 'change',
                  },
                ]"
              >
                <div class="input">
                  <el-input
                    class="value"
                    disabled
                    v-model="formData.bottomMaterialGrossWeight"
                  >
                    <template slot="append">kg</template>
                  </el-input>
                </div>
              </el-form-item>
              <el-form-item
                label="埚底料净重"
                prop="bottomMaterialNetWeight"
                class="item"
                :rules="[
                  {
                    required: true,
                    message: '埚底料净重不能为空',
                    trigger: 'change',
                  },
                ]"
              >
                <div class="input">
                  <el-input
                    class="value"
                    v-model="formData.bottomMaterialNetWeight"
                    placeholder="埚底料称量重量"
                  >
                    <template slot="append">kg</template>
                  </el-input>
                </div>
              </el-form-item>
            </div>
          </div>

          <div class="form">
            <div class="form-title">参数说明</div>
            <div class="row">埚底料毛重计算公式：<br /></div>
            <div
              class="row"
              v-if="!formData.ingotWeight && formData.ingotWeight !== 0"
            >
              <b>晶锭称量没有值</b>：埚底料毛重 （{{
                (formData.polysiliconWeight || 0) -
                (formData.feedbackQty || 0) -
                (formData.shoulderWeight || 0)
              }}
              kg） = 总投料多晶硅重量（{{
                formData.polysiliconWeight
              }}
              kg） - 反馈重量（{{ formData.feedbackQty }} kg） -
              吊肩记录重量总和（{{ formData.shoulderWeight }} kg）<br />
            </div>
            <div class="row" v-else>
              <b>晶锭称量有值</b>：埚底料毛重（{{
                (formData.polysiliconWeight || 0) -
                (formData.ingotWeight || 0) -
                (formData.shoulderWeight || 0)
              }}
              kg） = 总投料多晶硅重量（{{
                formData.polysiliconWeight
              }}
              kg） - 晶锭称量的值（{{ formData.ingotWeight }} kg） -
              吊肩记录重量总和（{{ formData.shoulderWeight }} kg）<br />
            </div>
            <div class="row">
              反馈重量（{{
                formData.feedbackQty
              }}
              kg）：来源于长晶过站中，最后一条晶体重量的值<br />
            </div>
          </div>
        </el-form>
      </div>
    </div>
    <div class="page-handle-box" v-if="!$route.query.view">
      <el-button plain class="cancel" @click="back(null, 'confirm')"
        >取消
      </el-button>
      <el-button type="primary" plain class="save" @click="save"
        >保存
      </el-button>
      <el-button type="primary" class="submit" @click="handleCheck"
        >出站确认
      </el-button>
    </div>
    <el-dialog
      width="80vw"
      :visible.sync="dialogCheckVisible"
      title="报工数据核对"
    >
      <el-table :data="checkList">
        <el-table-column
          label="批次号"
          min-width="150"
          prop="batch"
        ></el-table-column>
        <el-table-column
          label="轮次号"
          min-width="100"
          prop="wheel"
        ></el-table-column>
        <el-table-column
          label="良品数"
          min-width="150"
          prop="goodQty"
        ></el-table-column>
        <el-table-column label="埚底料" min-width="120" prop="bottomQty">
          <template slot-scope="scope">
            <div :class="scope.row.check ? '' : 'error'">
              {{ scope.row.bottomQty }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="多晶硅投料"
          min-width="150"
          prop="polysiliconQty"
        ></el-table-column>
        <el-table-column
          label="多晶硅扣料"
          min-width="150"
          prop="polysiliconDeductionQty"
        ></el-table-column>
<!--        <el-table-column-->
<!--          label="多晶硅扣料计算"-->
<!--          min-width="250"-->
<!--          prop="polysiliconDeductionCalc"-->
<!--        ></el-table-column>-->
        <el-table-column
          label="石英坩埚投料"
          min-width="150"
          prop="quartzCrucibleQty"
        ></el-table-column>
        <el-table-column
          label="石英坩埚扣料"
          min-width="150"
          prop="quartzCrucibleDeductionQty"
        ></el-table-column>
        <el-table-column
          label="掺杂剂用量投料"
          min-width="150"
          prop="dopantQty"
        ></el-table-column>
        <el-table-column
          label="掺杂剂扣料"
          min-width="150"
          prop="dopantDeductionQty"
        ></el-table-column>
<!--        <el-table-column-->
<!--          label="掺杂剂扣料计算"-->
<!--          min-width="250"-->
<!--          prop="dopantDeductionCalc"-->
<!--        ></el-table-column>-->
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogCheckVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as Api from "@/api/inStation";
import overStation from "@/mixins/overStation";
import { mapState } from "vuex";
import { getSeleteData } from "@/utils/select";

export default {
  mixins: [overStation],
  data() {
    return {
      formData: {
        userCreate: null,
        feedbackQty: null,
        defectQty: null,
        scrapQty: null,
        numberConsistence: null,
        endSitutation: null,
        dislocationIdentification: null,
        dislocationIdentificationLength: null,
        measuredDiameterHead: null,
        measuredDiameterMiddle: null,
        measuredDiameterTail: null,
        disengageDiameter: null,
        bottomMaterialGrossWeight: null,
        bottomMaterialNetWeight: null,
        ingotWeight: null,
      },
      formRules: {
        userCreate: [
          { required: true, message: "操作者不能为空", trigger: "change" },
        ],
        feedbackQty: [
          { required: true, message: "反馈数量不能为空", trigger: "change" },
        ],
        scrapQty: [
          { required: true, message: "报废数量不能为空", trigger: "change" },
        ],
        numberConsistence: [
          {
            required: true,
            message: "单晶编号一致性不能为空",
            trigger: "change",
          },
        ],
        dislocationIdentification: [
          {
            required: true,
            message: "位错反延线标识不能为空",
            trigger: "change",
          },
        ],
        disengageDiameter: [
          {
            required: true,
            message: "脱开直径不能为空",
            trigger: "change",
          },
        ],
        measuredDiameterHead: [
          {
            required: true,
            message: "拉晶实测直径(头)不能为空",
            trigger: "change",
          },
        ],
        measuredDiameterMiddle: [
          {
            required: true,
            message: "拉晶实测直径(中)不能为空",
            trigger: "change",
          },
        ],
        measuredDiameterTail: [
          {
            required: true,
            message: "拉晶实测直径(尾)不能为空",
            trigger: "change",
          },
        ],
      },
      checkList: [],
      dialogCheckVisible: false,
      check: null,
      bottomMaterialDifference: null,
    };
  },
  computed: {
    buffParams() {
      const { processUuid, processingOrderCode } = this.$route.query;
      return { processUuid, processingOrderCode };
    },
    ...mapState({
      realName: (state) => state.user.realName,
    }),
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
      this.formData = {
        ...this.formData,
        ...fromData,
        userCreate: fromData.userCreate || this.realName,
      };

      let bottomMaterialDifferences = [];
      await getSeleteData(
        "bottomMaterialDifference",
        bottomMaterialDifferences
      );
      this.bottomMaterialDifference = bottomMaterialDifferences.find(
        (item) => item.name === "default"
      ).value;

      this.handleIngotWeightChange();
      this.fetchSwitchDict();
    },
    async handleCheck() {
      const valid = await this.$refs.formRef.validate();
      if (!valid) return;
      let { bottomMaterialGrossWeight, bottomMaterialNetWeight } =
        this.formData;
      if (
        Math.abs(bottomMaterialGrossWeight - bottomMaterialNetWeight) >
        this.bottomMaterialDifference
      ) {
        this.$message.warning(
          `埚底料毛重和净重的差值不能超过：${this.bottomMaterialDifference}kg`
        );
        return;
      }
      await this.$confirm("确认提交当前操作数据?", "提示", {
        type: "warning",
      });

      if (this.formData.end) {
        this.dialogCheckVisible = true;
        let res = await Api.check(this.formData);
        this.check = res.data.check;
        if (!res.data.check)
          this.$message.warning("数据核对异常，请重新输入数据");
        this.checkList = res.data.materials;
      } else {
        this.confirm();
      }
    },
    async save() {
      await Api.upldateBuffer(this.buffParams, this.formData);
      const msg = "保存成功!";
      this.$message.success(msg);
      this.back(msg);
    },
    async confirm() {
      if (this.formData.end && !this.check) {
        this.$message.warning("数据核对异常，请重新输入数据");
        return;
      }
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
      this.dialogCheckVisible = false;
      const msg = "出站成功";
      this.$message.success(msg);
      Api.deleteBuffer(this.buffParams);
      this.back(msg);
    },
    handleIngotWeightChange() {
      const {
        polysiliconWeight,
        feedbackQty,
        ingotWeight,
        shoulderWeight,
      } = this.formData;
      if (!ingotWeight && ingotWeight !== 0) {
        this.formData.bottomMaterialGrossWeight = (
          (polysiliconWeight || 0) -
          (feedbackQty || 0) -
          (shoulderWeight || 0)
        ).toFixed(3);
      } else
        this.formData.bottomMaterialGrossWeight = (
          (polysiliconWeight || 0) -
          (ingotWeight || 0) -
          (shoulderWeight || 0)
        ).toFixed(3);
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

.dialog-footer {
  display: flex;
  justify-content: end;
}

.error {
  color: red;
}

.required:before {
  content: "* ";
  color: red;
}

.row {
  display: flex;
  gap: 10px;
  width: 100%;

  .item {
    flex: 1;
  }
}
</style>
