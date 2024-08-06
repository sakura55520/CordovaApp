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
          <div class="form">
            <div class="form-title">单晶信息</div>
            <el-form-item label="进站数量" prop="pullQty" class="item">
              <div class="input">
                <el-input class="value" v-model="formData.pullQty" disabled>
                  <template slot="append">kg</template>
                </el-input>
              </div>
            </el-form-item>
            <el-form-item label="接收长度" prop="lengthQty" class="item">
              <el-input v-model="formData.lengthQty" disabled>
                <template slot="append">mm</template>
              </el-input>
            </el-form-item>
            <el-form-item label="型号" prop="model" class="item">
              <el-input v-model="formData.model" disabled></el-input>
            </el-form-item>
            <el-form-item label="尺寸" prop="size" class="item">
              <el-input v-model="formData.size" disabled></el-input>
            </el-form-item>
            <el-form-item label="晶向" prop="orientation" class="item">
              <el-input v-model="formData.orientation" disabled></el-input>
            </el-form-item>
            <el-form-item
              label="目标电阻率"
              prop="targetResistivity"
              class="item"
            >
              <el-input
                v-model="formData.targetResistivity"
                disabled
              ></el-input>
            </el-form-item>

            <el-form-item label="生产备注" class="form-item-cover">
              <el-input
                class="value"
                v-model="formData.productionRemark"
                disabled
              />
            </el-form-item>
            <el-form-item
              label="单晶异常"
              class="form-item-cover"
              v-for="(item, index) in formData.wipCrystalGrowthOutErrors"
              :key="index"
            >
              <div class="input">
                <el-input class="value" v-model="item.taskStep" disabled />
                <el-input class="value" v-model="item.errorMessage" disabled />
              </div>
            </el-form-item>
          </div>
          <div class="form">
            <div class="form-title">样片信息</div>
            <el-table
              :data="formData.details"
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
                fixed="left"
              >
              </el-table-column>
              <el-table-column
                label="样片标识"
                min-width="100"
                align="center"
                prop="sampleIdentification"
                fixed="left"
              />
              <el-table-column
                label="样片位置"
                min-width="120"
                align="center"
                prop="samplePosition"
                fixed="left"
              />
              <el-table-column
                label="样片类型"
                min-width="150"
                align="center"
                prop="type"
              />
              <el-table-column
                label="产品类型"
                min-width="100"
                align="center"
                prop="productCategory"
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
                    :rules="[
                      {
                        required: scope.row.valid,
                        message: '结晶比重不能为空',
                        trigger: 'change',
                      },
                    ]"
                    class="form-input"
                  >
                    <el-input
                      :id="'input-1-' + scope.$index"
                      @keyup.native="(e) => handleKeyup(e, 1, scope.$index)"
                      v-model="scope.row.crystalDensity"
                    >
                      <template slot="append">%</template>
                    </el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                label="RES"
                min-width="120"
                align="center"
                prop="res"
              />
              <el-table-column label="RES_C" min-width="120" align="center">
                <template slot-scope="scope">
                  <el-input
                    :id="'input-2-' + scope.$index"
                    @keyup.native="(e) => handleKeyup(e, 2, scope.$index)"
                    v-model="scope.row.resC"
                    @input="
                      () => {
                        calcHalfRrg(scope.$index);
                        calcRrg(scope.$index);
                        calcTargetDeviation(scope.$index);
                        calcHeadTailResistivityRatio(scope.row, scope.$index);
                      }
                    "
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column label="RES_E" min-width="120" align="center">
                <template slot-scope="scope">
                  <el-input
                    :id="'input-3-' + scope.$index"
                    @keyup.native="(e) => handleKeyup(e, 3, scope.$index)"
                    v-model="scope.row.resE"
                    @input="calcRrg(scope.$index)"
                  ></el-input> </template
              ></el-table-column>
              <el-table-column label="1/2RES" min-width="120" align="center">
                <template slot-scope="scope">
                  <el-input
                    :id="'input-4-' + scope.$index"
                    @keyup.native="(e) => handleKeyup(e, 4, scope.$index)"
                    v-model="scope.row.halfRes"
                    @input="calcHalfRrg(scope.$index)"
                  ></el-input> </template
              ></el-table-column>
              <el-table-column
                label="目标偏差"
                min-width="140"
                align="center"
                prop="targetDeviation"
              />
              <el-table-column
                label="RRG"
                min-width="140"
                align="center"
                prop="rrg"
              >
                <template slot-scope="scope">
                  <div v-if="scope.row.rrg">{{ scope.row.rrg }}%</div>
                </template>
              </el-table-column>
              <el-table-column
                label="1/2 RRG"
                min-width="140"
                align="center"
                prop="halfRrg"
              >
                <template slot-scope="scope">
                  <div v-if="scope.row.halfRrg">{{ scope.row.halfRrg }}%</div>
                </template>
              </el-table-column>
              <el-table-column
                label="头尾电阻比"
                min-width="140"
                align="center"
                prop="headTailResistivityRatio"
              />
              <el-table-column label="OI_C" min-width="140" align="center">
                <template slot-scope="scope">
                  <el-input
                    :id="'input-5-' + scope.$index"
                    @keyup.native="(e) => handleKeyup(e, 5, scope.$index)"
                    v-model="scope.row.oiC"
                    @input="calcOrg(scope.$index)"
                  ></el-input> </template
              ></el-table-column>
              <el-table-column label="OI_E" min-width="140" align="center">
                <template slot-scope="scope">
                  <el-input
                    :id="'input-6-' + scope.$index"
                    @keyup.native="(e) => handleKeyup(e, 6, scope.$index)"
                    v-model="scope.row.oiE"
                    @input="calcOrg(scope.$index)"
                  ></el-input> </template
              ></el-table-column>
              <el-table-column label="CS" min-width="140" align="center">
                <template slot-scope="scope">
                  <div :class="getInternalControlColor('cs', scope.row.cs)">
                    <el-input
                      :id="'input-7-' + scope.$index"
                      @keyup.native="(e) => handleKeyup(e, 7, scope.$index)"
                      v-model="scope.row.cs"
                    ></el-input>
                  </div> </template
              ></el-table-column>
              <el-table-column
                label="ORG"
                min-width="140"
                align="center"
                prop="org"
              >
                <template slot-scope="scope">
                  <div v-if="scope.row.org">{{ scope.row.org }}%</div>
                </template>
              </el-table-column>
              <el-table-column label="少子寿命" min-width="140" align="center">
                <template slot-scope="scope">
                  <el-input
                    :id="'input-8-' + scope.$index"
                    @keyup.native="(e) => handleKeyup(e, 8, scope.$index)"
                    v-model="scope.row.minorityCarrierLifetime"
                  ></el-input> </template
              ></el-table-column>
              <el-table-column label="常规缺陷" min-width="140" align="center">
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
              <el-table-column label="OSF密度" min-width="140" align="center">
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
              <el-table-column label="基磷" min-width="140" align="center">
                <template slot-scope="scope">
                  <el-input
                    :id="'input-9-' + scope.$index"
                    @keyup.native="(e) => handleKeyup(e, 9, scope.$index)"
                    v-model="scope.row.phosphorus"
                    @change="
                      (val) => handleToFixed(val, scope.$index, 'phosphorus')
                    "
                  ></el-input> </template
              ></el-table-column>
              <el-table-column label="基硼" min-width="140" align="center">
                <template slot-scope="scope">
                  <el-input
                    :id="'input-10-' + scope.$index"
                    @keyup.native="(e) => handleKeyup(e, 10, scope.$index)"
                    v-model="scope.row.boron"
                    @change="(val) => handleToFixed(val, scope.$index, 'boron')"
                  ></el-input> </template
              ></el-table-column>
              <el-table-column label="基砷" min-width="140" align="center">
                <template slot-scope="scope">
                  <el-input
                    :id="'input-11-' + scope.$index"
                    @keyup.native="(e) => handleKeyup(e, 11, scope.$index)"
                    v-model="scope.row.arsenic"
                    @change="
                      (val) => handleToFixed(val, scope.$index, 'arsenic')
                    "
                  ></el-input> </template
              ></el-table-column>
              <el-table-column label="基锑" min-width="140" align="center">
                <template slot-scope="scope">
                  <el-input
                    :id="'input-12-' + scope.$index"
                    @keyup.native="(e) => handleKeyup(e, 12, scope.$index)"
                    v-model="scope.row.antimony"
                    @change="
                      (val) => handleToFixed(val, scope.$index, 'antimony')
                    "
                  ></el-input> </template
              ></el-table-column>
              <el-table-column label="检测人员" min-width="150" align="center">
                <template slot-scope="scope">
                  <SelectUserinfo
                    v-model="scope.row.inspector"
                    @handleSelect="
                      (val) => handleInspectorSelect(val, scope.$index)
                    "
                  /> </template
              ></el-table-column>
              <el-table-column label="检测日期" min-width="250" align="center">
                <template slot-scope="scope">
                  <el-date-picker
                    v-model="scope.row.checkDate"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                  /> </template
              ></el-table-column>
            </el-table>
          </div>
          <div class="form">
            <div class="form-title">返切指令</div>
            <el-button
              size="small"
              type="primary"
              class="add-btn"
              @click="handleAddBackCuttings"
              >+ 新增返切指令</el-button
            >
            <el-table
              :data="formData.backCuttings"
              class="table"
              :header-cell-style="{
                background: 'rgba(242, 242, 242)',
                color: '#606266',
              }"
            >
              <el-table-column
                label="返切类型"
                min-width="150"
                align="center"
                prop="type"
              />
              <el-table-column
                label="返切标识"
                min-width="100"
                align="center"
                prop="sampleIdentification"
              />
              <el-table-column
                label="返切样片厚度"
                min-width="120"
                align="center"
                prop="tall"
              />
              <el-table-column
                label="返切位置"
                min-width="120"
                align="center"
                prop="samplePosition"
              />
              <el-table-column
                label="返切距头位置"
                min-width="120"
                align="center"
                prop="cutDistanceStart"
              />
              <el-table-column
                label="返切距尾位置"
                min-width="120"
                align="center"
                prop="cutDistanceEnd"
              />
              <el-table-column
                label="是否返切再利用"
                min-width="150"
                align="center"
                prop="recycle"
                :formatter="formRecycle"
              />
              <el-table-column
                label="返切条码"
                min-width="240"
                align="center"
                prop="backCutNumber"
              />
              <el-table-column
                label="样片编码"
                min-width="200"
                align="center"
                prop="sampleNumber"
              />
              <el-table-column
                label="状态"
                min-width="100"
                align="center"
                prop="status"
              >
                <template slot-scope="scope">
                  {{ scope.row.status == 1 ? "待切" : "已切" }}
                </template>
              </el-table-column>
              <el-table-column
                label="创建人"
                min-width="100"
                align="center"
                prop="userCreate"
              />
              <el-table-column
                label="创建时间"
                min-width="300"
                align="center"
                prop="gmtCreate"
              />
              <el-table-column label="操作" align="center" min-width="250">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    @click="handleUpdateBackCuttings(scope.row, scope.$index)"
                  >
                    编辑
                  </el-button>
                  <el-button
                    type="text"
                    style="color: red"
                    @click="handleDeleteBackCuttings(scope.row)"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-form>
      </div>
    </div>
    <el-dialog
      :title="`${backCuttingFormType}返切样片`"
      :visible.sync="backCuttingDialogVisible"
    >
      <el-form
        :model="backCuttingFormData"
        label-position="left"
        label-width="150px"
        :rules="backCuttingFormRules"
        ref="backCuttingFormRef"
      >
        <el-form-item label="返切类型" prop="type">
          <el-select
            v-model="backCuttingFormData.type"
            placeholder=""
            class="form-item-cover"
            :disabled="backCuttingFormType === '编辑'"
            @change="handleBackCutTypeChange"
          >
            <el-option
              v-for="item in backCutTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="返切标识" prop="sampleIdentification">
          <el-select
            v-model="backCuttingFormData.sampleIdentification"
            placeholder=""
            class="form-item-cover"
            :disabled="backCuttingFormType === '编辑'"
          >
            <div v-for="item in sampleIdentificationList" :key="item.value">
              <el-option
                :label="item.label"
                :value="item.value"
                :disabled="
                  (backCuttingFormData.type === '中间片' &&
                    item.value !== 'M') ||
                  (backCuttingFormData.type !== '中间片' && item.value === 'M')
                "
              ></el-option>
            </div>
          </el-select>
        </el-form-item>
        <el-form-item label="返切样片厚度" prop="tall">
          <el-input
            v-model="backCuttingFormData.tall"
            :disabled="backCuttingFormType === '编辑' && originalTall === 0"
          ></el-input>
        </el-form-item>
        <el-form-item label="返切位置" prop="samplePosition">
          <el-input
            v-model="backCuttingFormData.samplePosition"
            @input="handleBackCutPositionChange"
          ></el-input>
        </el-form-item>
        <el-form-item label="返切距头位置" prop="cutDistanceStart">
          <el-input
            v-model="backCuttingFormData.cutDistanceStart"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="返切距尾位置" prop="cutDistanceEnd">
          <el-input
            v-model="backCuttingFormData.cutDistanceEnd"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="是否返切再利用" prop="recycle">
          <el-select
            v-model="backCuttingFormData.recycle"
            placeholder=""
            class="form-item-cover"
          >
            <el-option
              :label="item.label"
              :value="Number(item.value)"
              v-for="item in backCuttingAndReuseList"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="submit" @click="backCuttingDialogVisible = false"
          >取 消</el-button
        >
        <el-button
          class="submit"
          type="primary"
          @click="handleBackCuttingFormConfirm"
          >确 定</el-button
        >
      </span>
    </el-dialog>
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
import { cloneDeep, isEmpty } from "lodash-es";
import PhotoNew from "@/views/components/photoNew";
import moment from "moment";
import { getCurrentWipStorageData } from "@/api/overStation/overStation";

export default {
  mixins: [overStation],
  components: { SelectUserinfo, PhotoNew },
  data() {
    return {
      formData: {
        productionRemark: null,
        inspector: null,
        tester: null,
        confirmer: null,
        pullQty: null,
        goodQty: null,
        abnormalQty: null,
        model: null,
        size: null,
        orientation: null,
        targetResistivity: null,
        weight: null,
        headWeight: null,
        tailWeight: null,
        lengthQty: null,
        wipCrystalGrowthOutErrors: [],
        details: [],
        backCuttings: [],
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
        pullQty: [
          { required: true, message: "进站数量不能为空", trigger: "change" },
        ],
        goodQty: [
          { required: true, message: "合格数量不能为空", trigger: "change" },
        ],
        abnormalQty: [
          { required: true, message: "异常数量不能为空", trigger: "change" },
        ],
        lengthQty: [
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
      backCutTypeList: [],
      conventionalDefectList: [],
      osfDensityList: [],
      sampleIdentificationList: [],
      backCuttingAndReuseList: [],
      internalControlRules: {
        cs: 0.4,
      },
      backCuttingFormData: {
        type: undefined,
        sampleIdentification: undefined,
        samplePosition: undefined,
        cutDistanceStart: undefined,
        cutDistanceEnd: undefined,
        tall: undefined,
        recycle: undefined,
        userCreate: undefined,
        gmtCreate: undefined,
        processId: undefined,
      },
      backCuttingFormRules: {
        type: [
          { required: true, message: "返切类型不能为空", trigger: "change" },
        ],
        sampleIdentification: [
          { required: true, message: "返切标识不能为空", trigger: "change" },
        ],
        samplePosition: [
          { required: true, message: "返切位置不能为空", trigger: "change" },
        ],
        cutDistanceStart: [
          {
            required: true,
            message: "返切距头位置不能为空",
            trigger: "change",
          },
        ],
        cutDistanceEnd: [
          {
            required: true,
            message: "返切距尾位置不能为空",
            trigger: "change",
          },
        ],
        tall: [
          {
            required: true,
            message: "返切样片厚度不能为空",
            trigger: "change",
          },
        ],
        recycle: [
          {
            required: true,
            message: "是否返切再利用不能为空",
            trigger: "change",
          },
        ],
      },
      backCuttingDialogVisible: false,
      backCuttingFormType: undefined,
      selectIndex: undefined,
      originalTall: undefined,
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

      this.formData = { ...this.formData, ...fromData };
      getSeleteData("sampleType", this.sampleTypeList);
      getSeleteData("backCutType", this.backCutTypeList);

      getSeleteData("conventionalDefect", this.conventionalDefectList);
      getSeleteData("osfDensity", this.osfDensityList);
      getSeleteData("sampleIdentification", this.sampleIdentificationList);
      getSeleteData("backCuttingAndReuse", this.backCuttingAndReuseList);

      this.formData.details = (this.formData.details || []).map((item) => ({
        ...item,
        productCategory: this.formData.productCategory,
        orientation: this.formData.orientation,
        size: this.formData.size,
        res: this.formData.targetResistivity,
        crystalDensity:
          item.crystalDensity || this.getCrystalDensity(item.samplePosition),
      }));

      this.fetchBackCuttingSampleRecord();
    },
    async updateDetails() {
      const { processingOrderCode } = this.$route.query;
      getCurrentWipStorageData(processingOrderCode).then((res) => {
        if (!res.data || !res.data.length) return;
        let newDetails = res.data[0].fromData.details || [];
        let oldDetails = this.formData.details || [];
        newDetails.forEach((item) => {
          let index = oldDetails.findIndex(
            (ele) => item.sampleNumber === ele.sampleNumber
          );
          if (index > -1) {
            this.$set(
              this.formData.details[index],
              "samplePosition",
              item.samplePosition
            );
            this.$set(
              this.formData.details[index],
              "crystalDensity",
              this.formData.details[index].crystalDensity ||
                this.getCrystalDensity(item.samplePosition)
            );
          } else {
            item.productCategory = this.formData.productCategory;
            item.orientation = this.formData.orientation;
            item.size = this.formData.size;
            item.res = this.formData.targetResistivity;
            item.crystalDensity = this.getCrystalDensity(item.samplePosition);
            this.formData.details.push(item);
          }
        });

        oldDetails.forEach((item, index) => {
          if (
            !newDetails.some((ele) => item.sampleNumber === ele.sampleNumber)
          ) {
            this.formData.details.splice(index, 1);
          }
        });
      });
    },
    async handleAddBackCuttings() {
      setTimeout(() => {
        this.$refs.backCuttingFormRef.clearValidate();
      });
      this.backCuttingFormData = {
        type: "",
        sampleIdentification: "",
        samplePosition: 0,
        cutDistanceStart: 0,
        cutDistanceEnd: this.formData.lengthQty || 0,
        tall: 4,
        recycle: 1,
        userCreate: this.realName,
        gmtCreate: moment().format("YYYY-MM-DD HH:mm:ss"),
        processId: this.formData.processId,
      };
      this.backCuttingFormType = "新增";
      this.backCuttingDialogVisible = true;
    },
    async addBackCuttings() {
      const valid = await this.$refs.backCuttingFormRef.validate();
      if (!valid) return;

      if (
        this.formData.backCuttings.some(
          (item) =>
            item.samplePosition == this.backCuttingFormData.samplePosition &&
            item.sampleNumber !== this.backCuttingFormData.sampleNumber
        )
      ) {
        this.$message.warning("返切位置不能重复");
        return;
      }

      this.backCuttingFormData.processOrderCode =
        this.formData.processOrderCode;

      let list = this.formData.backCuttings
        .filter(
          (item) =>
            item.type === this.backCuttingFormData.type &&
            item.sampleIdentification ===
              this.backCuttingFormData.sampleIdentification &&
            item.sampleNumber
        )
        .map((item) => Number(item.sampleNumber.split("-")[3]));

      let max = isEmpty(list) ? 0 : Math.max(...list);

      let sampleType = this.backCutTypeList.find(
        (ele) => ele.value == this.backCuttingFormData.type
      ).extendValue;

      let index = max + 1;
      let res = await Api.getSampleCode({
        sampleType,
        crystalNo: this.formData.processOrderCode,
        sampleIdentification: this.backCuttingFormData.sampleIdentification,
        index,
      });

      this.backCuttingFormData.sampleNumber = res.data;
      await Api.createBackCuttingSampleRecord(this.backCuttingFormData);
      this.$message.success("返切指令创建成功");
      this.fetchBackCuttingSampleRecord();
      this.updateDetails();
      this.backCuttingDialogVisible = false;
    },
    async handleUpdateStatus(row) {
      Api.updateIngotDetectionStatus(row).then(() => {
        this.$message.success("更新状态成功");
        this.fetchBackCuttingSampleRecord();
        this.updateDetails();
      });
    },
    async handleUpdateBackCuttings(row, index) {
      this.backCuttingFormData = cloneDeep(row);
      this.originalTall = row.tall;
      this.backCuttingFormType = "编辑";
      this.backCuttingDialogVisible = true;
      this.selectIndex = index;
    },
    async updateBackCuttings() {
      if (
        this.formData.backCuttings.some(
          (item) =>
            item.samplePosition == this.backCuttingFormData.samplePosition &&
            item.sampleNumber !== this.backCuttingFormData.sampleNumber
        )
      ) {
        this.$message.warning("返切位置不能重复");
        return;
      }

      this.backCuttingFormData.processOrderCode =
        this.formData.processOrderCode;

      await Api.updateBackCuttingSampleRecord(this.backCuttingFormData);
      this.$message.success("返切指令更新成功");
      this.fetchBackCuttingSampleRecord();
      this.updateDetails();
      this.backCuttingDialogVisible = false;
    },
    async handleDeleteBackCuttings(row) {
      await this.$confirm(`请确认是否删除`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      });
      await Api.deleteBackCuttingSampleRecord({ id: row.id });
      this.$message.success("返切指令删除成功");
      this.fetchBackCuttingSampleRecord();
      this.updateDetails();
    },
    handleBackCuttingFormConfirm() {
      if (this.backCuttingFormType === "新增") this.addBackCuttings();
      else this.updateBackCuttings();
    },
    async fetchBackCuttingSampleRecord() {
      let res = await Api.getBackCuttingSampleRecord({
        search_EQ_processOrderCode: this.formData.processOrderCode,
      });
      this.$set(this.formData, "backCuttings", res.data.rows);
    },
    async save() {
      await Api.upldateBuffer(this.buffParams, this.formData);
      const msg = "保存成功!";
      this.back(msg);
    },
    async confirm() {
      const valid = await this.$refs.formRef.validate();
      if (!valid) return;

      let backCuttings = this.formData.backCuttings;
      if (backCuttings.some((item) => item.status == 1)) {
        this.$message.warning("存在返切指令状态为待切，请先执行返切操作");
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
      if (isEmpty(this.formData.wipCrystalGrowthOutErrors)) {
        delete this.formData.wipCrystalGrowthOutErrors;
      }
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
    getCrystalDensity(val) {
      let crystalDensity;
      let value = Number(val);
      let info = this.formData;
      if (!value || value === "NaN" || !info.weight || !info.lengthQty)
        crystalDensity = "0";
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
      return crystalDensity;
    },
    tableRowClassName({ row }) {
      if (!row.valid) {
        return "invalid_tr";
      }
    },
    calcHalfRrg(index) {
      let item = this.formData.details[index];
      let data;
      if (item.resC)
        data = (((item.halfRes - item.resC) / item.resC) * 100).toFixed(3);
      this.$set(this.formData.details[index], "halfRrg", data);
    },
    calcRrg(index) {
      let item = this.formData.details[index];
      let data;
      if (item.resC)
        data = (((item.resE - item.resC) / item.resC) * 100).toFixed(3);
      this.$set(this.formData.details[index], "rrg", data);
    },
    calcTargetDeviation(index) {
      let item = this.formData.details[index];
      let data;
      if (item.res) data = ((item.resC - item.res) / item.res).toFixed(3);
      this.$set(this.formData.details[index], "targetDeviation", data);
    },
    calcOrg(index) {
      let item = this.formData.details[index];
      let data;
      if (item.oiC)
        data = ((Math.abs(item.oiC - item.oiE) / item.oiC) * 100).toFixed(3);
      this.$set(this.formData.details[index], "org", data);
    },
    calcHeadTailResistivityRatio(row, index) {
      let headTailResistivityRatio = null;
      let reverseDetails = (cloneDeep(this.formData.details) || []).reverse();
      let headIndex =
        reverseDetails.length -
        reverseDetails.findIndex(
          (item) =>
            item.type === "头尾样片" && item.sampleIdentification === "H"
        ) -
        1;
      let tailIndex =
        reverseDetails.length -
        reverseDetails.findIndex(
          (item) =>
            item.type === "头尾样片" && item.sampleIdentification === "T"
        ) -
        1;
      let headResC = this.formData.details[headIndex].resC;
      let tailResC = this.formData.details[tailIndex].resC;

      if ((headResC || headResC === 0) && tailResC)
        headTailResistivityRatio = (headResC / tailResC).toFixed(3);

      this.$set(
        this.formData.details[headIndex],
        "headTailResistivityRatio",
        headTailResistivityRatio
      );
      this.$set(
        this.formData.details[tailIndex],
        "headTailResistivityRatio",
        headTailResistivityRatio
      );
    },
    handleInspectorSelect(val, index) {
      this.$set(this.formData.details[index], "checkDate", new Date());
    },
    getInternalControlColor(key, val) {
      let target = this.internalControlRules[key];
      return "";
    },
    formRecycle(row, column, recycle) {
      const matched = this.backCuttingAndReuseList.find(
        (item) => item.value == recycle
      );
      return matched ? matched.label : "";
    },
    handleToFixed(val, index, key) {
      let value = Number(val).toFixed(5);
      this.$set(this.formData.details[index], key, value);
    },
    handleBackCutTypeChange(val) {
      if (val === "中间片") this.backCuttingFormData.sampleIdentification = "M";
      else if (this.backCuttingFormData.sampleIdentification === "M")
        this.backCuttingFormData.sampleIdentification = "H";
    },
    handleBackCutPositionChange(val) {
      this.backCuttingFormData.cutDistanceStart = val;
      this.backCuttingFormData.cutDistanceEnd =
        (this.formData.lengthQty || 0) - val;
    },
    handleKeyup(e, x, y) {
      if (e.keyCode === 39) {
        let dom = document.getElementById(`input-${x + 1}-${y}`);
        dom && dom.focus();
      }
      if (e.keyCode === 37) {
        let dom = document.getElementById(`input-${x - 1}-${y}`);
        dom && dom.focus();
      }
      if (e.keyCode === 38) {
        let dom = document.getElementById(`input-${x}-${y - 1}`);
        dom && dom.focus();
      }
      if (e.keyCode === 40) {
        let dom = document.getElementById(`input-${x}-${y + 1}`);
        dom && dom.focus();
      }
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
    left: 12px;
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
.table {
  margin-top: 50px;
}
</style>
