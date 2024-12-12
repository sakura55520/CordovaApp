<!--装料-->
<template>
  <div class="detailBox">
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

    <div class="fromCard">
      <div class="fromCard">
        <div class="headLine">
          <div class="headLine-title">{{ storageLabel }}数据录入</div>
        </div>
        <el-form
          ref="formData"
          :model="formData"
          label-width="150px"
          :rules="formRules"
          inline
          :disabled="$route.query.view"
        >
          <div>
            <el-form-item label="操作者">
              <el-input v-model="formData.userCreate" disabled />
            </el-form-item>
            <el-form-item label="掺杂剂确认者" prop="userConfirm">
              <SelectUserinfo v-model="formData.userConfirm" />
            </el-form-item>
            <el-form-item label="连尾重量" prop="goodQty">
              <el-input v-model="formData.goodQty" disabled>
                <template slot="append">kg</template>
              </el-input>
            </el-form-item>
            <el-form-item label="工艺编号" prop="technologyNumber">
              <el-select v-model="formData.technologyNumber" filterable>
                <el-option
                  v-for="(item, index) in technologyList"
                  :key="index"
                  :value="item"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="生产备注"
              class="form-item-cover"
              style="width: 98.5% !important"
            >
              <el-input class="value" v-model="formData.productionRemark" />
            </el-form-item>
          </div>

          <div class="headLine">
            <div class="headLine-title">设备/工艺参数确认</div>
          </div>

          <div>
            <el-form-item label="籽晶编号" prop="seedCrystalNumber">
              <CodeScanner
                v-model="formData.seedCrystalNumber"
                @has-done="handleSeedCrystalNumberCodeScan"
                @clear="handleSeedCrystalNumberClear"
              />
            </el-form-item>
            <el-form-item label="已用寿命/额定寿命" prop="seedCrystalLife">
              <el-input v-model="seedCrystalLifeAndTotalLife" disabled />
            </el-form-item>
            <el-form-item label="加料管编号" prop="chargePipeSerial">
              <CodeScanner
                v-model="formData.chargePipeSerial"
                @has-done="handleChargePipeSerialCodeScan"
                @clear="handleChargePipeSerialClear"
              />
            </el-form-item>
            <el-form-item label="加料管类型" prop="chargePipeType">
              <el-input v-model="formData.chargePipeType" />
            </el-form-item>
            <el-form-item label="加料管型号" prop="chargePipeModel">
              <el-input v-model="formData.chargePipeModel" />
            </el-form-item>
            <el-form-item
              label="装料开始时间"
              prop="feedingTime"
              :rules="[
                {
                  required: formData.wheel == 1,
                  message: '请输入装料开始时间',
                  trigger: 'change',
                },
              ]"
            >
              <el-date-picker
                v-model="formData.feedingTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                @change="refreshFeedingDuration"
                :picker-options="pickerOptions"
              />
            </el-form-item>
            <el-form-item label="装料时长" prop="feedingDuration">
              <el-input v-model="formData.feedingDuration" disabled>
                <template slot="append">min</template>
              </el-input>
            </el-form-item>
            <el-form-item label="装料结束时间" prop="feedingEndTime">
              <el-date-picker
                v-model="formData.feedingEndTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                @change="refreshFeedingDuration"
              />
            </el-form-item>
          </div>
          <div>
            <div class="progress">
              石英坩埚用量:{{ formData.quartzCrucibleQty || 0 }}只
              <el-progress :percentage="quartzCruciblePercent" />
            </div>
            <el-form-item
              label="石英坩埚编号"
              prop="quartzCrucibleSerial"
              class="codeScan-form-item"
              :rules="[
                {
                  required: formData.wheel == 1,
                  message: '请输入石英坩埚编号',
                  trigger: 'change',
                },
              ]"
            >
              <CodeScanner
                class="codeScan-input"
                v-model="formData.quartzCrucibleSerial"
                @has-done="handleQuartzCrucibleSerialCodeScan"
                @clear="handleQuartzCrucibleSerialClear"
              />
            </el-form-item>
          </div>
          <div>
            <div class="progress">
              加料量:{{ totalFeedingAmount }}kg
              <el-progress :percentage="feedPercent" />
            </div>
            <el-form-item
              label="多晶硅编号"
              prop="_polysilicons"
              class="multipleCodeScan-form-item"
              :rules="[
                {
                  required: formData.wheel == 1,
                  message: '请输入多晶硅编号',
                  trigger: 'change',
                },
                {
                  validator: this.validPolysiliconsAmount,
                  trigger: 'change',
                },
              ]"
            >
              <div class="multipleCodeScan-container">
                <div
                  class="multipleCodeScan-item"
                  v-for="(item, index) in formData._polysilicons"
                  :key="index"
                >
                  <MultipleCodeScanner
                    value-key="id"
                    v-model="formData._polysilicons[index]"
                    type="多晶硅"
                    unit="kg"
                    :materialCodes="formData.polysiliconMaterialCodes"
                    :allCodes="formData._polysilicons"
                  />
                  <el-button
                    type="text"
                    :style="{
                      color: 'red',
                      visibility: index == 0 ? 'hidden' : 'visible',
                    }"
                    class="el-icon-delete"
                    @click="deletePolysilicon(index)"
                  />
                </div>
                <el-button
                  type="primary"
                  @click="addPolysilicon"
                  class="add-btn"
                  >+ 新增</el-button
                >
              </div>
            </el-form-item>
          </div>
          <div>
            <div class="progress">
              掺杂剂用量:{{ totalDopantAmount }}g
              <el-progress :percentage="dopantPercent" />
            </div>
            <el-form-item
              label="掺杂剂编号"
              prop="_dopants"
              class="multipleCodeScan-form-item"
              :rules="[
                { validator: this.validTotalDopantAmount, trigger: 'change' },
              ]"
            >
              <div class="multipleCodeScan-container">
                <div
                  class="multipleCodeScan-item"
                  v-for="(item, index) in formData._dopants"
                  :key="index"
                >
                  <MultipleCodeScanner
                    value-key="id"
                    v-model="formData._dopants[index]"
                    type="掺杂剂"
                    unit="g"
                    :materialCodes="formData.dopantMaterialCodes"
                    :allCodes="formData._dopants"
                  />
                  <el-button
                    type="text"
                    :style="{
                      color: 'red',
                      visibility: index == 0 ? 'hidden' : 'visible',
                    }"
                    class="el-icon-delete"
                    @click="deleteDopant(index)"
                  />
                </div>
                <el-button type="primary" @click="addDopant" class="add-btn"
                  >+ 新增</el-button
                >
              </div>
            </el-form-item>
          </div>

          <div class="headLine">
            <div
              :class="{
                'headLine-title': true,
                required: formRules._beforePhoto,
              }"
            >
              拆炉前留档文件(炉盖、抽气孔)
            </div>
          </div>
          <el-form-item style="margin-left: 20px" prop="_beforePhoto">
            <PhotoRemarkNew
              v-model="formData._beforePhoto"
              @input="handleBeforePhotoChange"
            />
          </el-form-item>

          <div class="headLine">
            <div
              :class="{
                'headLine-title': true,
                required: formRules._afterPhoto,
              }"
            >
              拆炉后留档文件(炉盖、抽气孔、加热器与坩埚间距*4、加热器与保温筒间距*4)
            </div>
          </div>
          <el-form-item style="margin-left: 20px" prop="_afterPhoto">
            <PhotoRemarkNew
              v-model="formData._afterPhoto"
              @input="handleAfterPhotoChange"
            />
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 页面操作 -->
    <div class="page-handle-box" v-if="!$route.query.view">
      <el-button class="cancel" @click="back(null, 'confirm')">取消</el-button>
      <el-button class="save" type="primary" plain @click="handle('保存')"
        >保存</el-button
      >
      <el-button class="submit" type="primary" @click="handle('提交')"
        >{{ storageLabel }}确认</el-button
      >
    </div>
  </div>
</template>

<script>
import MultipleCodeScanner from "@/components/MultipleCodeScanner";
import CodeScanner from "@/components/CodeScanner";
import SelectUserinfo from "@/components/select_userinfo";
import * as Api from "@/api/inStation";
import { cloneDeep, round, isEmpty } from "lodash-es";
import moment from "moment";
import { getProcessNo } from "@/api/tool";
import overStation from "@/mixins/overStation";
import { getSeleteData } from "@/utils/select";
import PhotoRemarkNew from "@/views/components/photoRemarkNew";

const defaultForm = {
  userConfirm: null, // 掺杂剂确认者
  goodQty: null, // 合格数量
  scrapQty: null, // 报废数量
  technologyNumber: null, // 工艺编号
  productionRemark: null,
  seedCrystalNumber: null, // 籽晶编号
  seedCrystalLife: null, // 籽晶已用寿命
  seedCrystalTotalLife: null, // 籽晶总寿命
  quartzCrucibleSerial: null, // 石英坩埚编号
  polysilicons: {}, // 多晶硅编号
  dopants: {}, // 掺杂剂用量
  _polysilicons: [], // 多晶硅编号
  _dopants: [], // 掺杂剂用量
  chargePipeType: null, // 加料管类型
  chargePipeModel: null, // 加料管型号
  chargePipeSerial: null, // 加料管编号
  feedingTime: null, // 装料时间
  feedingEndTime: null, // 装料结束时间
  crystalPullingError: null, // 拉晶异常
  feedingDuration: null, // 装料时长(min)
  quartzCrucible: null,
  quartzCrucibleQty: null,
  polysiliconMaterialCodes: [],
  dopantMaterialCodes: [],
  quartzCrucibleMaterialCodes: [],
  _beforePhoto: [],
  _afterPhoto: [],
};
export default {
  name: "ChargeOperate",
  mixins: [overStation],
  components: {
    CodeScanner,
    SelectUserinfo,
    MultipleCodeScanner,
    PhotoRemarkNew,
  },
  data() {
    return {
      detailInfo: {}, // 描述信息
      formData: Object.assign({}, cloneDeep(defaultForm)), // 表单列表
      formRules: {
        userConfirm: [
          { required: true, message: "请输入掺杂剂确认者", trigger: "change" },
        ],
        scrapQty: [
          { required: true, message: "请输入报废数量", trigger: "change" },
        ],
        technologyNumber: [
          { required: true, message: "请输入工艺编号", trigger: "change" },
        ],
        seedCrystalNumber: [
          { required: true, message: "请输入籽晶编号", trigger: "change" },
        ],
        _polysilicons: [
          { required: true, message: "请输入多晶硅编号", trigger: "change" },
        ],
        _dopants: [
          { required: true, message: "请输入掺杂剂用量", trigger: "change" },
        ],
        feedingTime: [
          { required: true, message: "请选择装料时间", trigger: "change" },
        ],
        feedingDuration: [
          {
            type: "number",
            min: 0,
            required: true,
            message: "装料时长必须>0",
            trigger: "change",
          },
        ],
      },
      technologyList: [],
      pickerOptions: {
        disabledDate: (time) => {
          return time.getTime() > Date.now();
        },
      },
      timer: null,
    };
  },
  computed: {
    storageLabel() {
      return this.$route.query.wipStorageStatus === "1" ? "出站" : "进站";
    },
    feedPercent() {
      return (
        round((this.totalFeedingAmount / this.formData.feedingTotal) * 100) || 0
      );
    },
    buffParams() {
      const { processUuid, processingOrderCode } = this.$route.query;
      return { processUuid, processingOrderCode };
    },
    totalFeedingAmount() {
      let total = 0;
      if (isEmpty(this.formData._polysilicons)) return 0;
      this.formData._polysilicons.forEach((item) => {
        if (!isEmpty(item)) {
          item.forEach((ele) => {
            if (ele) total += ele.qty || 0;
          });
        }
      });
      return round(total, 5);
    },
    dopantPercent() {
      if (!this.totalDopantAmount || !this.formData.feedingDopantTotal)
        return 0;
      return round(
        (this.totalDopantAmount / this.formData.feedingDopantTotal) * 100
      );
    },
    totalDopantAmount() {
      let total = 0;
      if (isEmpty(this.formData._dopants)) return 0;
      this.formData._dopants.forEach((item) => {
        if (!isEmpty(item)) {
          item.forEach((ele) => {
            if (ele) total += ele.qty || 0;
          });
        }
      });
      return round(total, 5);
    },
    quartzCruciblePercent() {
      return this.formData.quartzCrucibleQty ? 100 : 0;
    },
    seedCrystalLifeAndTotalLife() {
      return (
        (this.formData.seedCrystalLife || 0) +
        "/" +
        (this.formData.seedCrystalTotalLife || 0)
      );
    },
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    async init() {
      await this.fetchSwitchDict();
      this.$refs.formData.clearValidate();
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

      this.formData = Object.assign({}, cloneDeep(defaultForm), fromData);
      let _polysilicons = Object.values(this.formData.polysilicons);
      let _dopants = Object.values(this.formData.dopants).map((item) => {
        return item.filter((ele) => ele);
      });
      this.$set(this.formData, "_polysilicons", _polysilicons);
      this.$set(this.formData, "_dopants", _dopants);

      this.formData._beforePhoto = (
        Array.isArray(this.formData.beforePhoto)
          ? this.formData.beforePhoto
          : JSON.parse(this.formData.beforePhoto || "[]")
      ).map((fileItem) => ({
        ...fileItem,
        big_url: fileItem.fileUrl,
        thumb_url: fileItem.fileUrl,
      }));

      this.formData._afterPhoto = (
        Array.isArray(this.formData.afterPhoto)
          ? this.formData.afterPhoto
          : JSON.parse(this.formData.afterPhoto || "[]")
      ).map((fileItem) => ({
        ...fileItem,
        big_url: fileItem.fileUrl,
        thumb_url: fileItem.fileUrl,
      }));

      this.getProcessNo();

      if (!this.$route.query.view) {
        this.refreshFeedingDuration();
        this.timer = setInterval(() => {
          this.refreshFeedingDuration();
        }, 5000);
      }
    },
    // 操作
    handle(typeName) {
      const { _polysilicons, _dopants, ...form } = this.formData;

      let polysilicons = {};
      _polysilicons.forEach((item, index) => {
        polysilicons[index + 1] = item;
      });

      let dopants = {};
      _dopants.forEach((item, index) => {
        dopants[index + 1] = item;
      });

      form.polysilicons = polysilicons;
      form.dopants = dopants;
      const FormData = JSON.stringify({
        ...form,
        polysilicons,
        dopants,
      });
      if (typeName === "保存") {
        Api.upldateBuffer(this.buffParams, form).then((res) => {
          const msg = "保存成功!";
          this.back(msg);
        });
      } else if (typeName === "提交") {
        this.$refs.formData.validate((valid) => {
          if (valid) {
            this.$confirm("确认提交当前操作数据?", "提示", {
              type: "warning",
            }).then(() => {
              const {
                equipmentCode,
                processUuid,
                processingOrderCode,
                wipStorageStatus,
              } = this.$route.query;
              Api.inOrOutStation({
                param: {
                  FormData,
                },
                equipmentCode, // 设备
                processUuid, // 当前工序唯一标识
                processingOrderCode, // 工单号
                wipStorageStatus, // 进出站状态
              }).then(() => {
                const msg = `【${this.storageLabel}】操作成功`;
                Api.deleteBuffer(this.buffParams);
                this.back(msg);
              });
            });
          }
        });
      }
    },
    refreshFeedingDuration() {
      let endTime =
        this.formData.feedingEndTime || this.$store.getters.NowServerDate;
      let feedingTime = this.formData.feedingTime;
      let feedingDuration = null;
      if (feedingTime)
        feedingDuration = moment(endTime).diff(feedingTime, "minutes");
      this.formData.feedingDuration = feedingDuration;
    },
    validPolysiliconsAmount(rule, value, callback) {
      if (this.totalFeedingAmount !== this.formData.feedingTotal)
        return callback(
          new Error(
            `加料量[${this.totalFeedingAmount}]必须等于总量[${this.formData.feedingTotal}]`
          )
        );
      callback();
    },
    validTotalDopantAmount(rule, value, callback) {
      let feedingDopantTotal = this.formData.feedingDopantTotal || 0;
      if (this.totalDopantAmount !== feedingDopantTotal)
        return callback(
          new Error(
            `掺杂剂用量[${this.totalDopantAmount}]必须等于总量[${feedingDopantTotal}]`
          )
        );
      callback();
    },
    getProcessNo() {
      getProcessNo({
        search_EQ_equipmentCode:
          this.formData.deviceCode || this.$route.query.deviceCode,
        page: 1,
        rows: 1000,
      }).then((res) => {
        this.technologyList = res.data.rows.map(({ processNo }) => processNo);
      });
    },
    async handleSeedCrystalNumberCodeScan(val) {
      let res = await Api.getSeed({ uniqueCode: val });
      this.formData.seedCrystalLife = res.data.usefulLife;
      this.formData.seedCrystalTotalLife = res.data.ratedLife;
    },
    handleSeedCrystalNumberClear() {
      this.formData.seedCrystalLife = null;
      this.formData.seedCrystalTotalLife = null;
    },
    clearQuartzCrucibleSerial() {
      this.formData.quartzCrucible = null;
      this.formData.quartzCrucibleQty = null;
    },
    async handleQuartzCrucibleSerialCodeScan(val) {
      Api.findByCode({ code: val }).then((res) => {
        if (!res.data) {
          this.$message.warning(`物料不存在`);
          this.clearQuartzCrucibleSerial();
          return;
        }
        if (res.data.status === 10) {
          this.$message.warning(`该物料已使用`);
          this.clearQuartzCrucibleSerial();
          return;
        }
        if (res.data.materialTypeName !== "石英坩埚") {
          this.$message.warning("物料类型不是石英坩埚");
          this.clearQuartzCrucibleSerial();
          return;
        }
        if (
          this.formData.quartzCrucibleMaterialCodes.every(
            (item) => item !== res.data.materialCode
          )
        ) {
          this.$message.warning(
            `该物料不是当前批次所需的物料，该料号：${
              res.data.materialCode
            }，所需料号：${this.formData.quartzCrucibleMaterialCodes.join(
              "、"
            )}`
          );
          this.clearQuartzCrucibleSerial();
          return;
        }
        this.formData.quartzCrucible = res.data;
        this.formData.quartzCrucibleQty = res.data.qty;
      });
    },
    handleQuartzCrucibleSerialClear() {
      this.formData.quartzCrucible = null;
      this.formData.quartzCrucibleQty = null;
    },
    async handleChargePipeSerialCodeScan(val) {
      Api.getWarehouseInventory({ search_EQ_uniqueCode: val }).then((res) => {
        let list = res.data.rows;
        if (isEmpty(list)) {
          this.handleChargePipeSerialClear();
          return this.$message.warning("物料不存在");
        }
        let data = list[0];
        if (data.materialTypeName !== "加料管") {
          this.handleChargePipeSerialClear();
          return this.$message.warning("物料类型不是加料管");
        }
        this.formData.chargePipeType = data.materialTypeName;
        this.formData.chargePipeModel = data.materialXh;
      });
    },
    handleChargePipeSerialClear() {
      this.formData.chargePipeSerial = null;
      this.formData.chargePipeType = null;
      this.formData.chargePipeModel = null;
    },
    addPolysilicon() {
      this.formData._polysilicons.push([]);
    },
    deletePolysilicon(index) {
      this.formData._polysilicons.splice(index, 1);
    },
    addDopant() {
      this.formData._dopants.push([]);
    },
    deleteDopant(index) {
      this.formData._dopants.splice(index, 1);
    },
    handleBeforePhotoChange() {
      this.$refs.formData.validate();
      const beforePhoto = (this.formData._beforePhoto || []).map(
        ({ big_url, thumb_url, ...item }) => ({
          ...item,
          fileUrl: big_url,
        })
      );
      this.formData.beforePhoto = beforePhoto;
    },
    handleAfterPhotoChange() {
      this.$refs.formData.validate();
      const afterPhoto = (this.formData._afterPhoto || []).map(
        ({ big_url, thumb_url, ...item }) => ({
          ...item,
          fileUrl: big_url,
        })
      );
      this.formData.afterPhoto = afterPhoto;
    },
  },
};
</script>

<style lang="scss" scoped>
.number-item {
  width: 150px !important;
  margin: 0 10px 10px 0;
}
.multipleCodeScan-container {
  display: flex;
  flex-direction: column;
  gap: 5px;
  .multipleCodeScan-item {
    display: flex;
    gap: 10px;
  }
}
.multipleCodeScan-form-item /deep/ {
  width: 100% !important;
  padding-right: 10px;
  .el-form-item__label {
    height: 40px;
  }
}
.codeScan-form-item {
  width: 100% !important;
  padding-right: 40px;
}
.add-btn {
  width: 120px;
}
.progress {
  padding: 16px;
}
.codeScan-input {
  width: 100% !important;
}
.required:before {
  content: "* ";
  color: red;
}
</style>
