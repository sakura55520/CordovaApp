<!--装料-->
<template>
  <div class="detailBox">
    <!-- 顶部信息卡片 -->
    <div class="topInfoCard">
      <div class="grid-container">
        <div class="grid-item">
          <span class="grid-item-name">批次号：</span>
          <span class="grid-item-value">{{ detailForm.processOrderCode }}</span>
        </div>
        <div class="grid-item">
          <span class="grid-item-name">长晶炉：</span>
          <span class="grid-item-value">{{ $route.query.deviceCode }}</span>
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
          label-width="120px"
          :rules="rules"
          inline
          :disabled="$route.query.view"
        >
          <div>
            <el-form-item label="操作者">
              <el-input v-model="detailForm.userCreate" disabled />
            </el-form-item>
            <el-form-item label="确认者" prop="userConfirm">
              <SelectUserinfo v-model="detailForm.userConfirm" />
            </el-form-item>
            <el-form-item label="目标重量" prop="goodQty">
              <el-input v-model="detailForm.goodQty" disabled />
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
              />
            </el-form-item>
            <el-form-item label="籽晶寿命" prop="seedCrystalLife">
              <el-input v-model="detailForm.seedCrystalLife" />
            </el-form-item>
            <el-form-item
              label="石英坩埚编号"
              prop="quartzCrucibleSerial"
              :rules="[
                {
                  required: detailForm.crystalOrder == 1,
                  message: '请输入石英坩埚编号',
                  trigger: 'change',
                },
              ]"
            >
              <CodeScanner
                v-model="detailForm.quartzCrucibleSerial"
                @has-done="handleQuartzCrucibleSerialCodeScan"
              />
            </el-form-item>
            <el-form-item label="石英坩埚用量" prop="quartzCrucibleDosage">
              <el-input v-model="detailForm.quartzCrucibleQty" disabled>
                <template slot="append">g</template>
              </el-input>
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
                { validator: this.validPolysiliconsAmount, trigger: 'change' },
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
              label="掺杂剂"
              prop="_dopants"
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
  userConfirm: null, // 确认者
  goodQty: null, // 合格数量
  scrapQty: null, // 报废数量
  technologyNumber: null, // 工艺编号
  seedCrystalNumber: null, // 籽晶编号
  seedCrystalLife: null, // 籽晶寿命
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
  feedingAmount: null, // 加料量
  _arrFeedingAmount: [""],
  quartzCrucible: null,
  quartzCrucibleQty: null,
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
      rules: {
        userConfirm: [
          { required: true, message: "请输入确认者", trigger: "change" },
        ],
        scrapQty: [
          { required: true, message: "请输入报废数量", trigger: "change" },
        ],
        technologyNumber: [
          { required: true, message: "请输入工艺编号", trigger: "blur" },
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
        _arrFeedingAmount: [
          {
            type: "array",
            required: true,
            message: "请输入加料量",
            trigger: "change",
          },
          { validator: this.validAmount, trigger: "change" },
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
    totalAount() {
      return (this.detailForm._arrFeedingAmount || []).reduce(
        (acc, cur) => acc + (Number(cur) || 0),
        0
      );
    },
    feedPercent() {
      return (
        floor((this.totalFeedingAmount / this.detailForm.goodQty) * 100) || 0
      );
    },
    buffParams() {
      const { processUuid, processingOrderCode } = this.$route.query;
      return { processUuid, processingOrderCode };
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
      if (!this.totalDopantAmount || !this.detailForm.dopantDosage) return 0;
      return floor(
        (this.totalDopantAmount / this.detailForm.dopantDosage) * 100
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
      // 加料量
      this.$set(
        this.detailForm,
        "_arrFeedingAmount",
        (this.detailForm.feedingAmount || "").split(",")
      );
      let _polysilicons = Object.values(this.detailForm.polysilicons);
      let _dopants = Object.values(this.detailForm.dopants);
      this.$set(this.detailForm, "_polysilicons", _polysilicons);
      this.$set(this.detailForm, "_dopants", _dopants);

      this.getProcessNo();
    },
    // 操作
    handle(typeName) {
      const { _arrFeedingAmount, _polysilicons, _dopants, ...form } =
        this.detailForm;
      let feedingAmount = (_arrFeedingAmount || []).filter((x) => x).join(",");

      let polysilicons = {};
      _polysilicons.forEach((item, index) => {
        polysilicons[index + 1] = item;
      });

      let dopants = {};
      _dopants.forEach((item, index) => {
        dopants[index + 1] = item;
      });

      form.feedingAmount = feedingAmount;
      form.polysilicons = polysilicons;
      form.dopants = dopants;
      const FormData = JSON.stringify({
        ...form,
        feedingAmount,
        polysilicons,
        dopants,
      });
      if (typeName === "保存") {
        Api.upldateBuffer(this.buffParams, form).then((res) => {
          const msg = "保存成功!";
          this.$message.success(msg);
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
                this.$message.success(msg);
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
    validAmount(rule, value, callback) {
      if (this.totalAount > this.detailForm.goodQty)
        return callback(
          new Error(
            `加料量[${this.totalAount}]必须≤总量[${this.detailForm.goodQty}]`
          )
        );
      callback();
    },
    validPolysiliconsAmount(rule, value, callback) {
      if (this.totalFeedingAmount > this.detailForm.goodQty)
        return callback(
          new Error(
            `加料量[${this.totalFeedingAmount}]必须≤总量[${this.detailForm.goodQty}]`
          )
        );
      callback();
    },
    validTotalDopantAmount(rule, value, callback) {
      let dopantDosage = this.detailForm.dopantDosage || 0;
      if (this.totalDopantAmount > dopantDosage)
        return callback(
          new Error(
            `掺杂精用量[${this.totalDopantAmount}]必须≤总量[${dopantDosage}]`
          )
        );
      callback();
    },
    addFeeding() {
      this.detailForm._arrFeedingAmount.push("");
    },
    refreshFeeding() {
      if (this.feedPercent < 100 && last(this.detailForm._arrFeedingAmount))
        this.detailForm._arrFeedingAmount.push("");
    },
    getProcessNo() {
      getProcessNo({
        search_EQ_equipmentCode: this.$route.query.deviceCode,
        page: 1,
        rows: 1000,
      }).then((res) => {
        this.technologyList = res.data.rows.map(({ processNo }) => processNo);
      });
    },
    async handleSeedCrystalNumberCodeScan(val) {
      let res = await Api.getSeed({ uniqueCode: val });
      this.detailForm.seedCrystalLife = res.data.usefulLife;
    },
    async handleQuartzCrucibleSerialCodeScan(val) {
      Api.findByCode({ code: val }).then((res) => {
        if (res.data && res.data.materialTypeName === "石英坩埚") {
          this.detailForm.quartzCrucible = res.data;
          this.detailForm.quartzCrucibleQty = res.data.qty;
        } else {
          this.$message.warning("该物料编号的物料类型不是石英坩埚");
        }
      });
    },
    async handleChargePipeSerialCodeScan(val) {
      let feedContainer = [];
      await getSeleteData("feedContainer", feedContainer);
      let feed = feedContainer.find((item) => item.name === val);
      this.detailForm.chargePipeType = feed.value;
      this.detailForm.chargePipeModel = feed.extendValue;
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
.multipleCodeScan-form-item {
  width: 100%;
}
.add-btn {
  width: 120px;
}
.progress {
  padding: 16px;
}
</style>
