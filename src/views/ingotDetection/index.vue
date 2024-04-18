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
          :disabled="$route.query.view"
        >
          <div class="form">
            <div class="form-title">单晶信息</div>
            <el-form-item label="进站数量" prop="goodQty" class="item">
              <div class="input">
                <el-input class="value" v-model="formData.goodQty">
                  <template slot="append">kg</template>
                </el-input>
              </div>
            </el-form-item>
            <el-form-item label="合格数量" prop="goodQty" class="item">
              <div class="input">
                <el-input class="value" v-model="formData.goodQty">
                  <template slot="append">kg</template>
                </el-input>
              </div>
            </el-form-item>
            <el-form-item label="接收长度" prop="currentLengthQty" class="item">
              <el-input v-model="formData.currentLengthQty">
                <template slot="append">mm</template>
              </el-input>
            </el-form-item>
            <el-form-item label="型号" prop="model" class="item">
              <el-input v-model="formData.model"></el-input>
            </el-form-item>
            <el-form-item label="尺寸" prop="size" class="item">
              <el-input
                v-model="formData.size"
                @input="handleBaseFormChange"
              ></el-input>
            </el-form-item>
            <el-form-item label="晶向" prop="orientation" class="item">
              <el-input
                v-model="formData.orientation"
                @input="handleBaseFormChange"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="目标电阻率"
              prop="targetResistivity"
              class="item"
            >
              <el-input v-model="formData.targetResistivity"></el-input>
            </el-form-item>
          </div>
          <div class="form">
            <div class="form-title">样片信息</div>
            <el-button
              size="small"
              type="primary"
              class="add-btn"
              @click="addDetails"
              >+ 新增</el-button
            >
            <el-table
              :data="formData.details"
              class="table"
              :header-cell-style="{
                background: 'rgba(242, 242, 242)',
                color: '#606266',
              }"
              :row-class-name="tableRowClassName"
            >
              <el-table-column
                label="样片编号"
                min-width="180"
                align="center"
                prop="sampleNumber"
              >
              </el-table-column>
              <el-table-column
                label="样片类型"
                min-width="150"
                align="center"
                prop="sampleType"
              >
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.sampleType"
                    placeholder=""
                    @change="(val) => handleSampleTypeChange(val, scope.$index)"
                  >
                    <el-option
                      :label="item.label"
                      :value="item.value"
                      v-for="item in sampleTypeList"
                      :key="item.value"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                label="样片标识"
                min-width="100"
                align="center"
                prop="sampleIdentification"
              >
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.sampleIdentification"
                    placeholder=""
                    @change="fetchSampleCode"
                  >
                    <el-option
                      :label="item.label"
                      :value="item.value"
                      v-for="item in sampleIdentificationList"
                      :key="item.value"
                      :disabled="
                        (scope.row.sampleType === 'YP' && item.value === 'M') ||
                        (scope.row.sampleType === 'CC' &&
                          (item.value === 'H' || item.value === 'T'))
                      "
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                label="样片位置"
                min-width="120"
                align="center"
                prop="samplePosition"
              >
                <template slot="header">
                  <div class="form-table-header">样片位置</div>
                </template>
                <template slot-scope="scope">
                  <el-form-item
                    label=""
                    label-width="0px"
                    :prop="'details.' + scope.$index + '.samplePosition'"
                    :rules="formRules.samplePosition"
                    class="form-input"
                  >
                    <el-input
                      v-model="scope.row.samplePosition"
                      v-direction="{ x: 0, y: scope.$index }"
                    ></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                label="类别"
                min-width="100"
                align="center"
                prop="category"
              >
              </el-table-column>
              <el-table-column
                label="晶向"
                min-width="100"
                align="center"
                prop="orientation"
              >
              </el-table-column>
              <el-table-column
                label="尺寸"
                min-width="100"
                align="center"
                prop="size"
              >
              </el-table-column>
              <el-table-column
                label="结晶比重"
                min-width="180"
                align="center"
                prop="crystalDensity"
                ><template slot="header">
                  <div class="form-table-header">结晶比重</div>
                </template>
                <template slot-scope="scope">
                  <el-form-item
                    label=""
                    label-width="0px"
                    :prop="'details.' + scope.$index + '.crystalDensity'"
                    :rules="formRules.crystalDensity"
                    class="form-input"
                  >
                    <el-input
                      v-model="scope.row.crystalDensity"
                      v-direction="{ x: 1, y: scope.$index }"
                    >
                      <template slot="append">%</template>
                    </el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="RES" min-width="120" align="center">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.res"
                    v-direction="{ x: 2, y: scope.$index }"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column label="RES_C" min-width="120" align="center">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.resC"
                    v-direction="{ x: 3, y: scope.$index }"
                    @input="
                      () => {
                        calcHalfRrg();
                        calcRrg();
                      }
                    "
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column label="RES_E" min-width="120" align="center">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.resE"
                    v-direction="{ x: 4, y: scope.$index }"
                    @input="calcRrg"
                  ></el-input> </template
              ></el-table-column>
              <el-table-column label="1/2RES" min-width="120" align="center">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.halfRes"
                    v-direction="{ x: 5, y: scope.$index }"
                    @input="calcHalfRrg"
                  ></el-input> </template
              ></el-table-column>
              <el-table-column label="1/2 RRG" min-width="120" align="center">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.halfRrg"
                    v-direction="{ x: 6, y: scope.$index }"
                  ></el-input> </template
              ></el-table-column>
              <el-table-column label="RRG" min-width="120" align="center">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.rrg"
                    v-direction="{ x: 7, y: scope.$index }"
                  ></el-input> </template
              ></el-table-column>
              <el-table-column label="OI_C" min-width="100" align="center">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.oiC"
                    v-direction="{ x: 8, y: scope.$index }"
                    @input="calcOrg"
                  ></el-input> </template
              ></el-table-column>
              <el-table-column label="CS" min-width="100" align="center">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.cs"
                    v-direction="{ x: 9, y: scope.$index }"
                  ></el-input> </template
              ></el-table-column>
              <el-table-column label="OI_E" min-width="100" align="center">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.oiE"
                    v-direction="{ x: 10, y: scope.$index }"
                    @input="calcOrg"
                  ></el-input> </template
              ></el-table-column>
              <el-table-column label="ORG" min-width="100" align="center">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.org"
                    v-direction="{ x: 11, y: scope.$index }"
                  ></el-input> </template
              ></el-table-column>
              <el-table-column label="少子寿命" min-width="100" align="center">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.minorityCarrierLifetime"
                    v-direction="{ x: 12, y: scope.$index }"
                  ></el-input> </template
              ></el-table-column>
              <el-table-column label="测试日期" min-width="250" align="center">
                <template slot-scope="scope">
                  <el-date-picker
                    v-model="scope.row.checkDate"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                  /> </template
              ></el-table-column>
              <el-table-column label="常规缺陷" min-width="100" align="center">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.flaw" placeholder="">
                    <el-option
                      :label="item.label"
                      :value="item.value"
                      v-for="item in conventionalDefectList"
                      :key="item.value"
                    ></el-option>
                  </el-select> </template
              ></el-table-column>
              <el-table-column label="OSF密度" min-width="100" align="center">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.osf" placeholder="">
                    <el-option
                      :label="item.label"
                      :value="item.value"
                      v-for="item in osfDensityList"
                      :key="item.value"
                    ></el-option>
                  </el-select> </template
              ></el-table-column>
              <el-table-column label="基磷" min-width="100" align="center">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.phosphorus"
                    v-direction="{ x: 13, y: scope.$index }"
                  ></el-input> </template
              ></el-table-column>
              <el-table-column label="基硼" min-width="100" align="center">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.boron"
                    v-direction="{ x: 14, y: scope.$index }"
                  ></el-input> </template
              ></el-table-column>
              <el-table-column label="检测人员" min-width="150" align="center">
                <template slot-scope="scope">
                  <SelectUserinfo v-model="scope.row.inspector" /> </template
              ></el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    style="color: red"
                    class="el-icon-delete"
                    @click="deleteDetails(scope.$index)"
                  />
                </template>
              </el-table-column>
            </el-table>
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
import SelectUserinfo from "@/components/select_userinfo";
import overStation from "@/mixins/overStation";
import { getSeleteData } from "@/utils/select";
import { mapState } from "vuex";
import { cloneDeep } from "lodash-es";
import PhotoNew from "@/views/components/photoNew";

export default {
  mixins: [overStation],
  components: { SelectUserinfo, PhotoNew },
  data() {
    return {
      batchNumber: "Z0116504581",
      grownCrystalFurnace: "A21",
      furnaceNumber: "A2010504581",
      recipe: "Reczl20240310v1",
      processPath: "X0010101",
      dataOrderCode: "",
      productName: "",
      formData: {
        inspector: null,
        tester: null,
        confirmer: null,
        goodQty: null,
        abnormalQty: null,
        currentLengthQty: null,
        model: null,
        size: null,
        orientation: null,
        targetResistivity: null,
        weight: null,
        headWeight: null,
        tailWeight: null,
        lengthQty: null,
        currentLengthQty: null,
        details: [],
        _files: [],
      },
      formRules: {
        inspector: [
          { required: true, message: "检测人员不能为空", trigger: "change" },
        ],
        tester: [
          { required: true, message: "测试人员不能为空", trigger: "change" },
        ],
        confirmer: [
          { required: true, message: "确认人员不能为空", trigger: "change" },
        ],
        goodQty: [
          { required: true, message: "合格数量不能为空", trigger: "change" },
        ],
        abnormalQty: [
          { required: true, message: "异常数量不能为空", trigger: "change" },
        ],
        currentLengthQty: [
          { required: true, message: "当前长度不能为空", trigger: "change" },
        ],
        weight: [
          { required: true, message: "晶体重量不能为空", trigger: "change" },
        ],
        model: [{ required: true, message: "型号不能为空", trigger: "change" }],
        size: [{ required: true, message: "尺寸不能为空", trigger: "change" }],
        orientation: [
          { required: true, message: "晶向不能为空", trigger: "change" },
        ],
        targetResistivity: [
          { required: true, message: "目标电阻率不能为空", trigger: "change" },
        ],
        samplePosition: [
          { required: true, message: "样片位置不能为空", trigger: "change" },
        ],
        crystalDensity: [
          { required: true, message: "结晶比重不能为空", trigger: "change" },
        ],
      },
      sampleTypeList: [],
      conventionalDefectList: [],
      osfDensityList: [],
      sampleIdentificationList: [],
    };
  },
  computed: {
    buffParams() {
      const { processUuid, processingOrderCode } = this.$route.query;
      return { processUuid, processingOrderCode };
    },
    newDetails() {
      return JSON.parse(JSON.stringify(this.formData.details));
    },
    ...mapState({
      realName: (state) => state.user.realName,
    }),
  },
  created() {
    this.initKeyup();
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
      console.log(JSON.parse(JSON.stringify(this.formData)));
      this.formData.details.forEach((item) => {
        item.checkDate = new Date();
      });
      await getSeleteData("sampleType", this.sampleTypeList);
      await getSeleteData("conventionalDefect", this.conventionalDefectList);
      await getSeleteData("osfDensity", this.osfDensityList);
      await getSeleteData(
        "sampleIdentification",
        this.sampleIdentificationList
      );

      this.formData._files = (this.formData.files || []).map((fileItem) => ({
        ...fileItem,
        big_url: fileItem.fileUrl,
        thumb_url: fileItem.fileUrl,
      }));
    },
    initKeyup() {
      let direction = this.$getDirection();
      direction.on("keyup", function (e, val) {
        if (e.keyCode === 39) {
          direction.next();
        }
        if (e.keyCode === 37) {
          direction.previous();
        }
        if (e.keyCode === 38) {
          direction.previousLine();
        }
        if (e.keyCode === 40) {
          direction.nextLine();
        }
      });
    },
    addDetails() {
      if (!this.formData.details) this.formData.details = [];
      this.formData.details.push({
        sampleNumber:
          "CC-" + (this.formData.details.length + 1 + "").padStart(7, "0"),
        sampleType: "CC",
        sampleIdentification: "M",
        samplePosition: 0,
        category: "0",
        size: this.formData.size,
        orientation: this.formData.orientation,
        res: 0,
        resC: 0,
        resE: 0,
        halfRes: 0,
        halfRrg: 0,
        rrg: 0,
        tailResistivity: 0,
        headTailResistivityRatio: 0,
        oiC: 0,
        cs: 0,
        oiE: 0,
        org: 0,
        minorityCarrierLifetime: 0,
        valid: true,
        checkDate: new Date(),
        inspector: this.realName,
      });
      this.handleSampleIdentificationChange();
    },
    deleteDetails(index) {
      let list = [...this.formData.details];
      list.splice(index, 1);
      this.formData.details = list;
      this.handleSampleIdentificationChange();
    },
    async save() {
      await Api.upldateBuffer(this.buffParams, this.formData);
      const msg = "保存成功!";
      this.$message.success(msg);
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
      this.$message.success(msg);
      Api.deleteBuffer(this.buffParams);
      this.back(msg);
    },
    handleSamplePositionChange(val, index) {
      let crystalDensity;
      let value = Number(val);
      if (!value || value === "NaN" || !info.weight || !info.lengthQty)
        crystalDensity = "";
      else
        crystalDensity = (
          ((((info.goodWeight || 0) -
            (info.tailWeight || 0) -
            (info.headWeight || 0)) *
            info.lengthQty) /
            value /
            info.weight) *
          100
        ).toFixed(2);
      this.formData.details[index].crystalDensity = crystalDensity;
    },
    handleSampleIdentificationChange() {
      let list = this.formData.details.map((item, itemIndex) => ({
        ...item,
        valid: !this.formData.details.some(
          (ele, eleIndex) =>
            item.sampleIdentification === ele.sampleIdentification &&
            itemIndex < eleIndex
        ),
      }));
      this.formData.details = [...list];
    },
    handleBaseFormChange() {
      let list = this.formData.details.map((item) => ({
        ...item,
        size: this.formData.size,
        orientation: this.formData.orientation,
      }));
      this.formData.details = [...list];
    },
    tableRowClassName({ row }) {
      if (!row.valid) {
        return "invalid_tr";
      }
    },
    fetchSampleCode() {
      let list = cloneDeep(this.formData.details);
      let headIndex = 0;
      let tailIndex = 0;
      let centerIndex = 0;
      list.forEach((item) => {
        if (!item.sampleType) return;
        let currentIndex;
        if (item.sampleType === "YP") {
          if (!item.sampleIdentification) return;
          if (item.sampleIdentification === "H") {
            headIndex++;
            currentIndex = headIndex;
          }
          if (item.sampleIdentification === "T") {
            tailIndex++;
            currentIndex = tailIndex;
          }
        } else {
          centerIndex++;
          currentIndex = centerIndex;
        }

        Api.getSampleCode({
          sampleType: item.sampleType,
          crystalNo: this.formData.processOrderCode,
          sampleIdentification: item.sampleIdentification,
          index: currentIndex,
        }).then((res) => {
          item.sampleNumber = res.data;
        });
      });
      this.$set(this.formData, "details", list);
    },
    handleSampleTypeChange(val, index) {
      if (val === "CC")
        this.$set(this.formData.details[index], "sampleIdentification", "M");
      if (val === "YP")
        this.$set(this.formData.details[index], "sampleIdentification", "H");
      this.handleSampleIdentificationChange();
      this.fetchSampleCode();
    },
    calcHalfRrg(index) {
      let item = this.formData.details[index];
      data = (item.halfRes - item.resC) / item.resC;
      this.$set(this.formData.details[index], "halfRrg", data);
    },
    calcRrg(index) {
      let item = this.formData.details[index];
      data = (item.resE - item.resC) / item.resC;
      this.$set(this.formData.details[index], "rrg", data);
    },
    calcOrg(index) {
      let item = this.formData.details[index];
      data = Math.abs(item.oiC - item.oiE);
      this.$set(this.formData.details[index], "org", data);
    },
    handleFileChange() {
      const files = (this.formData._files || []).map(
        ({ big_url, thumb_url, ...item }) => ({
          ...item,
          fileUrl: big_url,
        })
      );
      this.formData.files = files;
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
.form-input {
  padding-top: 16px;
}
.form-table-header:before {
  content: "* ";
  color: red;
}
</style>
