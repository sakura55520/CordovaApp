<!--装料-->
<template>
  <div class="detailBox">
    <!-- 顶部信息卡片 -->
    <div class="topInfoCard">
      <div class="grid-container">
        <div class="grid-item">
          <span class="grid-item-name">批次号：</span>
          <span class="grid-item-value">{{ detailForm.processOrderCode }}</span>
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
          ref="detailForm"
          :model="detailForm"
          label-width="150px"
          :rules="formRules"
          inline
          :disabled="$route.query.view"
        >
          <div>
            <el-form-item label="操作者">
              <el-input v-model="detailForm.userCreate" disabled />
            </el-form-item>
            <el-form-item label="掺杂剂确认者" prop="userConfirm">
              <SelectUserinfo v-model="detailForm.userConfirm" />
            </el-form-item>
            <el-form-item label="连尾重量" prop="goodQty">
              <el-input v-model="detailForm.goodQty" disabled>
                <template slot="append">kg</template>
              </el-input>
            </el-form-item>
            <el-form-item label="工艺编号" prop="technologyNumber">
              <el-select v-model="detailForm.technologyNumber" filterable>
                <el-option
                  v-for="(item, index) in technologyList"
                  :key="index"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </div>

          <div class="headLine">
            <div class="headLine-title">设备/工艺参数确认</div>
          </div>

          <div>
            <el-form-item label="籽晶编号" prop="seedCrystalNumber">
              <CodeScanner
                v-model="detailForm.seedCrystalNumber"
                @has-done="handleSeedCrystalNumberCodeScan"
                @clear="handleSeedCrystalNumberClear"
              />
            </el-form-item>
            <el-form-item label="已用寿命/额定寿命" prop="seedCrystalLife">
              <el-input v-model="seedCrystalLifeAndTotalLife" disabled />
            </el-form-item>
            <el-form-item
              label="加料管编号"
              prop="chargePipeSerial"
              :rules="[
                {
                  required: detailForm.crystalOrder == 1,
                  message: '请输入加料管编号',
                  trigger: 'change',
                },
              ]"
            >
              <CodeScanner
                v-model="detailForm.chargePipeSerial"
                @has-done="handleChargePipeSerialCodeScan"
                @clear="handleChargePipeSerialClear"
              />
            </el-form-item>
            <el-form-item
              label="加料管类型"
              prop="chargePipeType"
              :rules="[
                {
                  required: detailForm.crystalOrder == 1,
                  message: '请输入加料管类型',
                  trigger: 'change',
                },
              ]"
            >
              <el-input v-model="detailForm.chargePipeType" />
            </el-form-item>
            <el-form-item
              label="加料管型号"
              prop="chargePipeModel"
              :rules="[
                {
                  required: detailForm.crystalOrder == 1,
                  message: '请输入加料管型号',
                  trigger: 'change',
                },
              ]"
            >
              <el-input v-model="detailForm.chargePipeModel" />
            </el-form-item>
            <el-form-item
              label="装料开始时间"
              prop="feedingTime"
              :rules="[
                {
                  required: detailForm.crystalOrder == 1,
                  message: '请输入装料开始时间',
                  trigger: 'change',
                },
              ]"
            >
              <el-date-picker
                v-model="detailForm.feedingTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                @change="handleFeedingTimeChange"
                :picker-options="pickerOptions"
              />
            </el-form-item>
            <el-form-item label="装料时长" prop="feedingDuration">
              <el-input v-model="detailForm.feedingDuration" disabled>
                <template slot="append">min</template>
              </el-input>
            </el-form-item>
          </div>
          <div>
            <div class="progress">
              石英坩埚用量:{{ detailForm.quartzCrucibleQty || 0 }}只
              <el-progress :percentage="quartzCruciblePercent" />
            </div>
            <el-form-item
              label="石英坩埚编号"
              prop="quartzCrucibleSerial"
              class="codeScan-form-item"
              :rules="[
                {
                  required: detailForm.crystalOrder == 1,
                  message: '请输入石英坩埚编号',
                  trigger: 'change',
                },
              ]"
            >
              <CodeScanner
                class="codeScan-input"
                v-model="detailForm.quartzCrucibleSerial"
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
                  required: detailForm.crystalOrder == 1,
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
                  v-for="(item, index) in detailForm._polysilicons"
                  :key="index"
                >
                  <MultipleCodeScanner
                    value-key="id"
                    v-model="detailForm._polysilicons[index]"
                    type="多晶硅"
                    unit="kg"
                    :materialCodes="detailForm.polysiliconMaterialCodes"
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
                {
                  required: detailForm.crystalOrder == 1,
                  message: '请输入掺杂剂用量',
                  trigger: 'change',
                },
                { validator: this.validTotalDopantAmount, trigger: 'change' },
              ]"
            >
              <div class="multipleCodeScan-container">
                <div
                  class="multipleCodeScan-item"
                  v-for="(item, index) in detailForm._dopants"
                  :key="index"
                >
                  <MultipleCodeScanner
                    value-key="id"
                    v-model="detailForm._dopants[index]"
                    type="掺杂剂"
                    unit="g"
                    :materialCodes="detailForm.dopantMaterialCodes"
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
import { cloneDeep, floor, last, isEmpty } from "lodash-es";
import moment from "moment";
import { getProcessNo } from "@/api/tool";
import overStation from "@/mixins/overStation";
import { getSeleteData } from "@/utils/select";

const defaultForm = {
  userConfirm: null, // 掺杂剂确认者
  goodQty: null, // 合格数量
  scrapQty: null, // 报废数量
  technologyNumber: null, // 工艺编号
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
  crystalPullingError: null, // 拉晶异常
  feedingDuration: null, // 装料时长(min)
  quartzCrucible: null,
  quartzCrucibleQty: null,
  polysiliconMaterialCodes: [],
  dopantMaterialCodes: [],
  quartzCrucibleMaterialCodes: [],
};
export default {
  name: "ChargeOperate",
  mixins: [overStation],
  components: {
    CodeScanner,
    SelectUserinfo,
    MultipleCodeScanner,
  },
  data() {
    return {
      detailInfo: {}, // 描述信息
      detailForm: Object.assign({}, cloneDeep(defaultForm)), // 表单列表
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
        chargePipeType: [
          { required: true, message: "请选择加料管类型", trigger: "change" },
        ],
        chargePipeModel: [
          { required: true, message: "请选择加料管型号", trigger: "change" },
        ],
        chargePipeSerial: [
          { required: true, message: "请选择加料管编号", trigger: "change" },
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
    };
  },
  computed: {
    storageLabel() {
      return this.$route.query.wipStorageStatus === "1" ? "出站" : "进站";
    },
    feedPercent() {
      return (
        floor((this.totalFeedingAmount / this.detailForm.feedingTotal) * 100) ||
        0
      );
    },
    buffParams() {
      const { processUuid, processingOrderCode } = this.$route.query;
      return { processUuid, processingOrderCode };
    },
    productionEquipment() {
      return JSON.parse(this.$route.query.orderInfo || "{}")
        .productionEquipmentCode;
    },
    executionEquipment() {
      return this.$route.query.deviceCode;
    },
    totalFeedingAmount() {
      let total = 0;
      if (isEmpty(this.detailForm._polysilicons)) return 0;
      this.detailForm._polysilicons.forEach((item) => {
        if (!isEmpty(item)) {
          item.forEach((ele) => {
            total += ele.qty;
          });
        }
      });
      return total;
    },
    dopantPercent() {
      if (!this.totalDopantAmount || !this.detailForm.feedingDopantTotal)
        return 0;
      return floor(
        (this.totalDopantAmount / this.detailForm.feedingDopantTotal) * 100
      );
    },
    totalDopantAmount() {
      let total = 0;
      if (isEmpty(this.detailForm._dopants)) return 0;
      this.detailForm._dopants.forEach((item) => {
        if (!isEmpty(item)) {
          item.forEach((ele) => {
            total += ele.qty;
          });
        }
      });
      return total;
    },
    quartzCruciblePercent() {
      return this.detailForm.quartzCrucibleQty ? 100 : 0;
    },
    seedCrystalLifeAndTotalLife() {
      return (
        (this.detailForm.seedCrystalLife || 0) +
        "/" +
        (this.detailForm.seedCrystalTotalLife || 0)
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
        } catch (e) {
          console.log(e);
        }
      }

      this.detailForm = Object.assign({}, cloneDeep(defaultForm), fromData);
      let _polysilicons = Object.values(this.detailForm.polysilicons);
      let _dopants = Object.values(this.detailForm.dopants);
      this.$set(this.detailForm, "_polysilicons", _polysilicons);
      this.$set(this.detailForm, "_dopants", _dopants);

      this.getProcessNo();

      console.log(JSON.parse(JSON.stringify(this.detailForm)));
    },
    // 操作
    handle(typeName) {
      const { _polysilicons, _dopants, ...form } = this.detailForm;

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
        this.$refs.detailForm.validate((valid) => {
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
    handleFeedingTimeChange(time) {
      this.detailForm.feedingDuration = moment(
        this.$store.getters.NowServerDate
      ).diff(time, "minutes");
    },
    validPolysiliconsAmount(rule, value, callback) {
      if (this.totalFeedingAmount !== this.detailForm.feedingTotal)
        return callback(
          new Error(
            `加料量[${this.totalFeedingAmount}]必须等于总量[${this.detailForm.feedingTotal}]`
          )
        );
      callback();
    },
    validTotalDopantAmount(rule, value, callback) {
      let feedingDopantTotal = this.detailForm.feedingDopantTotal || 0;
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
          this.detailForm.deviceCode || this.$route.query.deviceCode,
        page: 1,
        rows: 1000,
      }).then((res) => {
        this.technologyList = res.data.rows.map(({ processNo }) => processNo);
      });
    },
    async handleSeedCrystalNumberCodeScan(val) {
      let res = await Api.getSeed({ uniqueCode: val });
      this.detailForm.seedCrystalLife = res.data.usefulLife;
      this.detailForm.seedCrystalTotalLife = res.data.ratedLife;
    },
    handleSeedCrystalNumberClear() {
      this.detailForm.seedCrystalLife = null;
      this.detailForm.seedCrystalTotalLife = null;
    },
    clearQuartzCrucibleSerial() {
      this.detailForm.quartzCrucible = null;
      this.detailForm.quartzCrucibleQty = null;
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
          this.detailForm.quartzCrucibleMaterialCodes.every(
            (item) => item !== res.data.materialCode
          )
        ) {
          this.$message.warning(
            `该物料不是当前批次所需的物料，该料号：${
              res.data.materialCode
            }，所需料号：${this.detailForm.quartzCrucibleMaterialCodes.join(
              "、"
            )}`
          );
          this.clearQuartzCrucibleSerial();
          return;
        }
        this.detailForm.quartzCrucible = res.data;
        this.detailForm.quartzCrucibleQty = res.data.qty;
      });
    },
    handleQuartzCrucibleSerialClear() {
      this.detailForm.quartzCrucible = null;
      this.detailForm.quartzCrucibleQty = null;
    },
    async handleChargePipeSerialCodeScan(val) {
      let feedContainer = [];
      await getSeleteData("feedContainer", feedContainer);
      let feed = feedContainer.find((item) => item.name === val);
      this.detailForm.chargePipeType = feed.value;
      this.detailForm.chargePipeModel = feed.extendValue;
    },
    handleChargePipeSerialClear() {
      this.detailForm.chargePipeType = null;
      this.detailForm.chargePipeModel = null;
    },
    addPolysilicon() {
      this.detailForm._polysilicons.push([]);
    },
    deletePolysilicon(index) {
      this.detailForm._polysilicons.splice(index, 1);
    },
    addDopant() {
      this.detailForm._dopants.push([]);
    },
    deleteDopant(index) {
      this.detailForm._dopants.splice(index, 1);
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
</style>
