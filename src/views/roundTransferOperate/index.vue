<!--滚圆中转-->
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
          label-width="120px"
          :rules="formRules"
          inline
          :disabled="$route.query.view"
          style="padding-bottom: 500px"
        >
          <div>
            <el-form-item label="操作者">
              <el-input v-model="detailForm.userCreate" disabled />
            </el-form-item>
            <el-form-item label="计划长度" prop="planLength">
              <el-input v-model="detailForm.planLength" disabled>
                <template slot="append">mm</template>
              </el-input>
            </el-form-item>
          </div>
          <div>
            <el-form-item
              ref="lineWarehouse"
              label="线边仓库位"
              prop="lineWarehouseId"
            >
              <SelectLinesideTree
                v-model="detailForm.lineWarehouseId"
                @select="handleWhouseSelect"
              />
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>

    <!-- 页面操作 -->
    <div class="page-handle-box" v-if="!$route.query.view">
      <el-button class="cancel" @click="back(null, 'confirm')">取消</el-button>
      <el-button class="save" @click="handle('保存')">保存</el-button>
      <el-button class="submit" type="primary" @click="handle('提交')"
        >{{ storageLabel }}确认</el-button
      >
    </div>
  </div>
</template>

<script>
import SelectLinesideTree from "@/components/SelectLinesideTree";
import * as Api from "@/api/inStation";
import { cloneDeep, floor, last } from "lodash-es";
import moment from "moment";
import overStation from "@/mixins/overStation";
import { mapState } from "vuex";

const defaultForm = {
  lineWarehouse: null, // 线边仓
  lineWarehouseId: null, // 线边仓
  lineWarehouseLocation: null, // 线边仓库位
};

export default {
  name: "RoundTransferOperate",
  mixins: [overStation],
  components: {
    SelectLinesideTree,
  },
  data() {
    return {
      detailForm: Object.assign({}, defaultForm), // 表单列表
      formRules: {
        lineWarehouseId: [
          { required: true, message: "请选择线边仓库位", trigger: "change" },
        ],
      },
    };
  },
  computed: {
    storageLabel() {
      return this.$route.query.wipStorageStatus === "1" ? "出站" : "进站";
    },
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

      this.detailForm = Object.assign({}, defaultForm, fromData);
      if (!this.detailForm.userCreate)
        this.$set(this.detailForm, "userCreate", this.realName);
    },
    // 操作
    handle(typeName) {
      const FormData = JSON.stringify(this.detailForm);
      if (typeName === "保存") {
        Api.upldateBuffer(this.buffParams, this.detailForm).then((res) => {
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
    handleWhouseSelect({ id, name }) {
      this.detailForm.lineWarehouseLocation = name;
      this.detailForm.lineWarehouseId = id;
      if (id) this.$refs.lineWarehouse.clearValidate();
    },
  },
};
</script>

