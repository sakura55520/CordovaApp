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
          label-width="140px"
          :rules="formRules"
          :disabled="$route.query.view"
        >
          <div class="base-form">
            <el-form-item label="操作者" prop="userCreate" class="item">
              <el-input v-model="formData.userCreate" disabled></el-input>
            </el-form-item>
            <el-form-item label="进站数量" prop="totalQty" class="item">
              <el-input v-model="formData.totalQty" disabled>
                <template slot="append">kg</template>
              </el-input>
            </el-form-item>
            <el-form-item
              label="位错反延线长度"
              prop="dislocationIdentificationLength"
              class="item"
            >
              <el-input
                v-model="formData.dislocationIdentificationLength"
                :style="{ width: '100%' }"
                disabled
              >
                <template slot="append">mm</template>
              </el-input>
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
            <el-form-item label="晶体实测长度" prop="lengthQty" class="item">
              <div class="input">
                <el-input
                  class="value"
                  v-model="formData.lengthQty"
                  @change="handleLengthChange"
                >
                  <template slot="append">mm</template>
                </el-input>
              </div>
            </el-form-item>
            <el-form-item
              label="头部回收料编码"
              prop="headReclaimedMaterialsCode"
              class="item"
            >
              <div class="input">
                <el-input
                  class="value"
                  v-model="formData.headReclaimedMaterialsCode"
                  disabled
                />
                <el-button
                  type="primary"
                  class="print-btn"
                  @click="handlePrint(formData.tailReclaimedMaterialsCode)"
                  >打印回收料条码</el-button
                >
              </div>
            </el-form-item>
            <el-form-item
              label="尾部回收料编码"
              prop="tailReclaimedMaterialsCode"
              class="item"
            >
              <div class="input">
                <el-input
                  class="value"
                  v-model="formData.tailReclaimedMaterialsCode"
                  disabled
                />
                <el-button
                  type="primary"
                  class="print-btn"
                  @click="handlePrint(formData.tailReclaimedMaterialsCode)"
                  >打印回收料条码</el-button
                >
              </div>
            </el-form-item>
          </div>
          <div class="form">
            <div class="form-title">样片信息</div>
            <el-button
              size="small"
              type="primary"
              class="add-btn"
              @click="addSamples"
              >+ 新增样片</el-button
            >
            <el-table
              :data="formData.wipCuttingSampleInfos"
              class="table"
              :header-cell-style="{
                background: 'rgba(242, 242, 242)',
                color: '#606266',
              }"
              :row-class-name="tableRowClassName"
            >
              <el-table-column
                label="样片类型"
                min-width="150"
                align="center"
                prop="type"
              >
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.type"
                    placeholder=""
                    @change="(val) => handleSampleTypeChange(val, scope.$index)"
                  >
                    <div v-for="item in sampleTypeList" :key="item.value">
                      <el-option
                        v-if="
                          item.value === '头尾样片' ||
                          item.value === '中间样片' ||
                          (item.value === '氧化样片' && needYH)
                        "
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </div>
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
                    @change="
                      (val) => {
                        handleUpdateSamplePosition(val, scope.$index);
                        handleSampleIdentificationChange();
                      }
                    "
                  >
                    <el-option
                      :label="item.label"
                      :value="item.value"
                      v-for="item in sampleIdentificationList"
                      :key="item.value"
                      :disabled="
                        (scope.row.type === '头尾样片' && item.value === 'M') ||
                        (scope.row.type === '氧化样片' && item.value === 'M') ||
                        (scope.row.type === '中间样片' &&
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
                    :prop="
                      'wipCuttingSampleInfos.' +
                      scope.$index +
                      '.samplePosition'
                    "
                    :rules="formRules.samplePosition"
                    class="form-input"
                  >
                    <el-input
                      v-model="scope.row.samplePosition"
                      @change="handleSamplePositionChange"
                    ></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                label="样片编号"
                min-width="180"
                align="center"
                prop="sampleNumber"
              >
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    style="color: red"
                    class="el-icon-delete"
                    @click="deleteSamples(scope.$index)"
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
    <!--弹窗: 打印组件-->
    <PrintDialog
      :visible.sync="printVisible"
      :print-data="printData"
      document-mould="回收料条码打印"
    />
  </div>
</template>

<script>
import * as Api from "@/api/inStation";
import overStation from "@/mixins/overStation";
import PhotoNew from "@/views/components/photoNew";
import { getSeleteData } from "@/utils/select";
import { isEmpty, cloneDeep } from "lodash-es";
import PrintDialog from "@/components/PrintDialog/index.vue";

export default {
  mixins: [overStation],
  components: {
    PhotoNew,
    PrintDialog,
  },
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
        totalQty: null,
        defectQty: null,
        dislocationIdentificationLength: null,
        headWeight: null,
        tailWeight: null,
        lengthQty: null,
        _files: [],
        wipCuttingSampleInfos: [],
      },
      formRules: {
        userCreate: [
          { required: true, message: "操作者不能为空", trigger: "change" },
        ],
        totalQty: [
          { required: true, message: "进站数量不能为空", trigger: "change" },
        ],
        defectQty: [
          { required: true, message: "缺陷数量不能为空", trigger: "change" },
        ],
        dislocationIdentificationLength: [
          {
            required: true,
            message: "位错反延线长度不能为空",
            trigger: "change",
          },
        ],
        headWeight: [
          { required: true, message: "头部重量不能为空", trigger: "change" },
        ],
        tailWeight: [
          { required: true, message: "尾部重量不能为空", trigger: "change" },
        ],
        lengthQty: [
          { required: true, message: "当前长度不能为空", trigger: "change" },
        ],
        samplePosition: [
          { required: true, message: "样片位置不能为空", trigger: "change" },
        ],
      },
      sampleTypeList: [],
      sampleIdentificationList: [],
      printVisible: false,
      printData: {},
    };
  },
  computed: {
    buffParams() {
      const { processUuid, processingOrderCode } = this.$route.query;
      return { processUuid, processingOrderCode };
    },
    needYH() {
      return (
        this.formData.osf === "≤10" ||
        this.formData.osf === "≤100" ||
        this.formData.osf === "无"
      );
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
          if (isEmpty(fromData.wipCuttingSampleInfos)) {
            fromData.wipCuttingSampleInfos = [
              {
                type: "头尾样片",
                sampleIdentification: "H",
                samplePosition: 0,
                valid: true,
                sampleNumber: undefined,
              },
              {
                type: "头尾样片",
                sampleIdentification: "T",
                samplePosition: fromData.lengthQty,
                valid: true,
                sampleNumber: undefined,
              },
            ];
            if (fromData.lengthQty >= 700) {
              fromData.wipCuttingSampleInfos.push({
                type: "中间样片",
                sampleIdentification: "M",
                samplePosition: fromData.lengthQty - 300,
                valid: true,
                sampleNumber: undefined,
              });
            }
          }
        } catch (e) {
          console.log(e);
        }
      }

      this.formData = { ...this.formData, ...fromData };

      this.formData._files = (this.formData.photo || []).map((fileItem) => ({
        ...fileItem,
        big_url: fileItem.fileUrl,
        thumb_url: fileItem.fileUrl,
      }));
      await getSeleteData("sampleType", this.sampleTypeList);
      getSeleteData("sampleIdentification", this.sampleIdentificationList);

      this.fetchSampleCode();
      this.handleLengthChange();
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
    handleFileChange() {
      const photo = (this.formData._files || []).map(
        ({ big_url, thumb_url, ...item }) => ({
          ...item,
          fileUrl: big_url,
        })
      );
      this.formData.photo = photo;
    },
    addSamples() {
      if (!this.formData.wipCuttingSampleInfos)
        this.formData.wipCuttingSampleInfos = [];
      this.formData.wipCuttingSampleInfos.push({
        type: this.needYH ? "氧化样片" : "头尾样片",
        sampleIdentification: "H",
        samplePosition: 0,
        valid: true,
        sampleNumber: undefined,
      });
      this.handleSampleIdentificationChange();
    },
    deleteSamples(index) {
      let list = [...this.formData.wipCuttingSampleInfos];
      list.splice(index, 1);
      this.formData.wipCuttingSampleInfos = list;
      this.handleSampleIdentificationChange();
    },
    fetchSampleCode() {
      let list = cloneDeep(this.formData.wipCuttingSampleInfos);
      let ypHIndex = 0;
      let ypTIndex = 0;
      let ypMIndex = 0;
      let yhHIndex = 0;
      let yhTIndex = 0;
      list.forEach((item) => {
        if (!item.type) return;
        let currentIndex;
        if (item.type === "头尾样片" && item.sampleIdentification === "H") {
          ypHIndex++;
          currentIndex = ypHIndex;
        }
        if (item.type === "头尾样片" && item.sampleIdentification === "T") {
          ypTIndex++;
          currentIndex = ypTIndex;
        }
        if (item.type === "中间样片" && item.sampleIdentification === "M") {
          ypMIndex++;
          currentIndex = ypMIndex;
        }
        if (item.type === "氧化样片" && item.sampleIdentification === "H") {
          yhHIndex++;
          currentIndex = yhHIndex;
        }
        if (item.type === "氧化样片" && item.sampleIdentification === "T") {
          yhTIndex++;
          currentIndex = yhTIndex;
        }
        Api.getSampleCode({
          sampleType: item.type,
          crystalNo: this.formData.processOrderCode,
          sampleIdentification: item.sampleIdentification,
          index: currentIndex,
        }).then((res) => {
          item.sampleNumber = res.data;
        });
      });
      this.$set(this.formData, "wipCuttingSampleInfos", list);
    },
    handleSampleTypeChange(val, index) {
      if (val === "氧化样片") {
        this.$set(
          this.formData.wipCuttingSampleInfos[index],
          "sampleIdentification",
          "H"
        );
        this.$set(
          this.formData.wipCuttingSampleInfos[index],
          "samplePosition",
          0
        );
      }
      if (val === "头尾样片") {
        this.$set(
          this.formData.wipCuttingSampleInfos[index],
          "sampleIdentification",
          "H"
        );
        this.$set(
          this.formData.wipCuttingSampleInfos[index],
          "samplePosition",
          0
        );
      }
      if (val === "中间样片") {
        this.$set(
          this.formData.wipCuttingSampleInfos[index],
          "sampleIdentification",
          "M"
        );
        this.$set(
          this.formData.wipCuttingSampleInfos[index],
          "samplePosition",
          this.formData.lengthQty - 300
        );
      }
      this.handleSampleIdentificationChange();
    },
    handleUpdateSamplePosition(val, index) {
      if (val === "H") {
        this.$set(
          this.formData.wipCuttingSampleInfos[index],
          "samplePosition",
          0
        );
      }
      if (val === "T") {
        this.$set(
          this.formData.wipCuttingSampleInfos[index],
          "samplePosition",
          this.formData.lengthQty
        );
      }
      if (val === "M") {
        this.$set(
          this.formData.wipCuttingSampleInfos[index],
          "samplePosition",
          this.formData.lengthQty - 300
        );
      }
    },
    handleSampleIdentificationChange() {
      this.handleSamplePositionChange();
      this.fetchSampleCode();
    },
    handleSamplePositionChange() {
      let list = this.formData.wipCuttingSampleInfos.map((item, itemIndex) => ({
        ...item,
        valid: !this.formData.wipCuttingSampleInfos.some(
          (ele, eleIndex) =>
            item.type === ele.type &&
            item.sampleIdentification === ele.sampleIdentification &&
            item.samplePosition == ele.samplePosition &&
            itemIndex < eleIndex
        ),
      }));
      this.$set(this.formData, "wipCuttingSampleInfos", list);
    },
    tableRowClassName({ row }) {
      if (!row.valid) {
        return "invalid_tr";
      }
    },
    handlePrint(code) {
      this.printData = {
        code,
      };
      this.printVisible = true;
    },
    handleLengthChange(val) {
      let mIndex = this.formData.wipCuttingSampleInfos.findIndex(
        (item) => item.type === "中间样片"
      );
      if (mIndex === -1 && this.formData.lengthQty >= 700) {
        this.formData.wipCuttingSampleInfos.push({
          type: "中间样片",
          sampleIdentification: "M",
          samplePosition: this.formData.lengthQty - 300,
          valid: true,
          sampleNumber: undefined,
        });
      }
      if (mIndex > -1 && this.formData.lengthQty < 700) {
        this.formData.wipCuttingSampleInfos.splice(mIndex, 1);
      }
      this.formData.wipCuttingSampleInfos.forEach((item, index) => {
        if (item.sampleIdentification === "T") {
          this.$set(
            this.formData.wipCuttingSampleInfos[index],
            "samplePosition",
            this.formData.lengthQty
          );
        }
        if (item.sampleIdentification === "M") {
          this.$set(
            this.formData.wipCuttingSampleInfos[index],
            "samplePosition",
            this.formData.lengthQty - 300
          );
        }
      });
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
.form-input {
  padding-top: 16px;
}
.form-table-header:before {
  content: "* ";
  color: red;
}
</style>
