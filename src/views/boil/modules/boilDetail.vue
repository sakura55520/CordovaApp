<!--开埚-->
<template>
  <div class="detailBox">
    <!-- 顶部信息卡片 -->
    <div class="topInfoCard">
      <!-- head -->
      <div class="headLine">
        <div>
          <span class="headLine-name">炉次号&nbsp;&nbsp; </span>
          <span class="headLine-value">{{ detailInfo.code }}</span>
        </div>
      </div>
      <!-- body -->
      <div :class="'grid-container'" v-if="detailInfo.dataObj">
        <div class="grid-item">
          <span class="grid-item-name">生产批号&nbsp;&nbsp;</span>
          <span class="grid-item-value">{{
            detailInfo.dataObj.productionBatchNo
          }}</span>
        </div>
        <div class="grid-item">
          <span class="grid-item-name">产品名称&nbsp;&nbsp;</span>
          <span class="grid-item-value">{{
            detailInfo.dataObj.productName
          }}</span>
        </div>
      </div>
    </div>
    <div class="fromCard">
      <div class="headLine">
        <div class="headLine-title">录入工序数据</div>
        <div class="headLine-tip"></div>
      </div>
      <el-row class="main-wrap">
        <el-form
          ref="detailForm"
          :model="detailForm"
          :rules="rules"
          class="demo-form-inline"
          label-width="115px"
        >
          <el-col :span="12">
            <el-form-item label="坩埚段编号" prop="crucibleSectionCode">
              <el-input v-trim v-model="detailForm.crucibleSectionCode" disabled/>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="坩埚段重量" prop="crucibleSectionWeight">
              <GetValByInput :refModel="detailForm" paramName="crucibleSectionWeight" placeholder="请输入" @input="regPositiveNumber(detailForm,'crucibleSectionWeight')"/>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="坩埚编号" prop="crucibleCode">
              <el-input v-trim v-model="detailForm.crucibleCode" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="坩埚重量" prop="crucibleWeight">
              <GetValByInput :refModel="detailForm" paramName="crucibleWeight" placeholder="请输入" @input="regPositiveNumber(detailForm,'crucibleWeight')"/>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="坩埚判断" prop="crucibleState">
              <el-select v-model="detailForm.crucibleState" placeholder="请选择" clearable style="width:100%">
                <el-option v-for="(item,index) in crucibleStateMap" :key="index" :label="item.name" :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="坩埚段判断" prop="crucibleSectionState">
              <el-select v-model="detailForm.crucibleSectionState" placeholder="请选择" clearable style="width:100%">
                <el-option v-for="(item,index) in crucibleStateMap" :key="index" :label="item.name" :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="石墨件9编号" prop="graphitePiece9">
              <el-input v-trim v-model="detailForm.graphitePiece9" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="石墨件9判断" prop="graphitePiece9State">
              <el-select v-model="detailForm.graphitePiece9State" placeholder="请选择" clearable style="width:100%">
                <el-option v-for="(item,index) in crucibleStateMap" :key="index" :label="item.name" :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="坩埚盖编号" prop="crucibleCover">
              <el-input v-trim v-model="detailForm.crucibleCover" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="坩埚盖判断" prop="crucibleCoverState">
              <el-select v-model="detailForm.crucibleCoverState" placeholder="请选择" clearable style="width:100%">
                <el-option v-for="(item,index) in crucibleStateMap" :key="index" :label="item.name" :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="24" style="display:flex">
            <el-form-item label="原料状态" prop="powderColor" style="width:50%">
              <el-select v-model="detailForm.powderColor" placeholder="请选择" clearable style="width:100%" @change="handlePowderColorChange">
                <el-option v-for="(item,index) in powderColorMap" :key="index.name" :label="item.name" :value="item.value"/>
              </el-select>
            </el-form-item>

            <el-form-item label="原料重量" prop="feedingWeight" style="width:50%">
              <el-input v-trim v-model="detailForm.feedingWeight" disabled/>
            </el-form-item>
          </el-col>

          <el-col :span="24"  style="display:flex">
            <el-form-item label="返工类型" prop="reworkType" style="width:50%">
              <el-radio-group v-model="detailForm.reworkType" @change="handleReworkTypeChange">
                <el-radio :label="0">无</el-radio>
                <el-radio :label="1">全部返工</el-radio>
                <el-radio :label="2">部分返工</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="返工重量" prop="reworkWeight" style="width:50%">
              <el-input-number v-model="detailForm.reworkWeight" :min="0" :max="detailForm.feedingWeight" @focus="$event.target.select()" :controls="false" style="width: 100%;"/>
            </el-form-item>

          </el-col>


          <el-col :span="24">
            <el-form-item label="备注" prop="mark">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4 }"
                placeholder="请输入内容"
                v-model="detailForm.remarks"
              >
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="添加附件">
              <!-- 图片 -->
              <PhotoNew
                v-model="detailForm.photo"
                :componentDisabled="false"
                :photoNum="6"
                :name="'CHECK_DEVICE'"
              ></PhotoNew>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
    </div>

    <!-- 页面操作 -->
    <div class="pageHandleBox">
      <el-button class="save" @click="handle('保存')">保存</el-button>
      <el-button class="submit" type="primary" @click="handle('提交')">{{
        this.$route.query.wipStorageStatus == 0 ? "进站" : "出站"
      }}</el-button>
    </div>

    <el-dialog
      title="请选择路线"
      :visible.sync="routeDialog"
      width="50%"
      :before-close="closeRouteDialog"
    >
      <el-radio-group v-model="routeItem" style="width: 100%">
        <el-radio
          v-for="(item, index) in routeList"
          :key="index"
          class="bodyBox-list-radio"
          :label="item.label"
          border
          @click.native="handleCloseRoute(item, index)"
          >{{ item.label }}</el-radio
        >
      </el-radio-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeRouteDialog">取 消</el-button>
        <el-button type="primary" @click="handle('提交', currentRoute.label)"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as Api from "@/api/boil/boil.js";
import { inStation, outStation } from "@/api/overStation/overStation.js";

import CodeScanner from "@/components/CodeScanner";
import PhotoNew from "@/views/components/photoNew.vue";
import { getSeleteData } from "@/utils/select";
import GetValByInput from '@/views/components/getValByInput'
import { regPositiveNumber,hoursFromNow } from "@/utils/tool.js";

const defaultForm = {
  crucibleSectionCode: null, // 坩埚段编号
  crucibleSectionWeight: null, // 坩埚段重量
  crucibleCode: null, // 坩埚编号
  crucibleWeight: null, // 坩埚重量
  crucibleState: null, // 坩埚判断
  crucibleSectionState: null, // 坩埚段判断
  graphitePiece9: null, // 石墨件9编号
  graphitePiece9State: null, // 石墨件9判断
  crucibleCover: null, // 坩埚盖编号
  crucibleCoverState: null, // 坩埚盖判断
  powderColor: null, // 原料状态
  feedingWeight: null, // 原料重量
  reworkType: 0, // 返工类型
  reworkWeight: 0, // 返工重量
}

export default {
  name: 'BoilDetail',
  components: {
    CodeScanner,
    PhotoNew,
    GetValByInput
  },
  data() {
    return {
      regPositiveNumber,
      page: 1,
      rows: 10,
      crucibleStateMap:[],//坩埚判断下拉框
      powderColorMap:[],//料粉颜色下拉框

      detailForm: Object.assign({}, defaultForm), // 页面表单
      detailInfo: {}, // 表单列表
      rules: {
        crucibleState: [{ required: true, message: '请输入坩埚判断', trigger: 'change' }],
        crucibleSectionState: [{ required: true, message: '请输入坩埚段判断', trigger: 'change' }],
        graphitePiece9State: [{ required: true, message: '请输入石墨件9判断', trigger: 'change' }],
        crucibleCoverState: [{ required: true, message: '请输入坩埚盖判断', trigger: 'change' }],
        powderColor: [{ required: true, message: '请输入原料状态', trigger: 'change' }],
        reworkType: [{ required: true, message: '请输入返工类型', trigger: 'blur' }],
        reworkWeight: [{ required: true, message: '请输入返工重量', trigger: 'blur' }]
      },

      routeItem: undefined, //路线绑定项
      currentRoute: {}, //当前选中路线
      routeList: [], //路线列表
      routeDialog: false,
    };
  },
  created() {
    getSeleteData('accessoriesStatus',this.crucibleStateMap)
    getSeleteData('powderColor',this.powderColorMap)
  },
  mounted() {
    this.init();
  },
  methods: {
    // 页面初始化
    async init() {
      let storageData = sessionStorage.getItem(
        `${this.$route.query.processingOrderCode + "KG"}`
      );
      await this.fetchBaseData(this.$route.query.processingOrderCode);
      this.setExpectedFeedingTime();
      this.detailForm = Object.assign({}, defaultForm, this.$route.query.fromData || {})
      if (storageData) {
        let { detailForm } = JSON.parse(storageData);
        this.detailForm = Object.assign({}, defaultForm, detailForm);
      }
      this.detailForm.photo = this.detailForm.photo ? JSON.parse(this.detailForm.photo) : this.detailForm.photo
    },
    getNowTime(){
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const day = now.getDate();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      return `${year}-${month < 10 ? ('0'+month) : month}-${day < 10 ? ('0'+day) : day} ${hours < 10 ? ('0'+hours) : hours}:${minutes < 10 ? ('0'+minutes) : minutes}:${seconds < 10 ? ('0'+seconds) : seconds}`
    },
    closeRouteDialog() {
      this.routeDialog = false;
    },
    // 设置预计投料时间
    setExpectedFeedingTime() {
      this.$set(
        this.detailInfo,
        "expectedFeedingTime",
        hoursFromNow(this.detailInfo.inTime)
      );
    },
    // 加载原始数据
    async fetchBaseData(code) {
      return Api.listByPage({
        processCode: "KG",
        code: code,
        page: this.page,
        rows: this.rows,
      }).then((res) => {
        this.detailInfo = res.data.rows[0] || [];
        console.log(this.$route.query, "this.$route.query");
        return;
      });
    },
    // 扫码加载物料信息
    scan(obj, objName) {
      // Api.scan({
      //   scanCode: obj[objName],
      // })
      //   .then((res) => {
      //     obj[objName] = undefined;
      //   })
      //   .catch((err) => {
      //     obj[objName] = undefined;
      //   });
    },
    // 操作
    async handle(typeName = "", flowLineLable) {
      if (typeName === "保存") {
        let { detailForm } = this;
        let saveData = {
          detailForm,
        };
        sessionStorage.setItem(
          `${this.$route.query.processingOrderCode + "KG"}`,
          JSON.stringify(saveData)
        );
        this.$message.success("保存成功");
        this.$router.push("/boil");
      }

      if (typeName === "提交") {
        const valid = await this.$refs['detailForm'].validate()
        if (!valid) return

        let params = {
          batchCode: this.$route.query.processingOrderCode,//批次号
          ...this.detailForm
        };

        // 进站
        if (this.$route.query.wipStorageStatus == 0) {
          inStation({
            equipmentCode: this.$route.query.deviceCode,
            param: {
              FormData: JSON.stringify(params),
            },
            processUuid: this.$route.query.processUuid,
            processingOrderCode: this.$route.query.processingOrderCode,
          })
            .then((res) => {
              this.$message.success("进站成功");
              sessionStorage.removeItem(
                `${this.$route.query.processingOrderCode + "KG"}`
              );
              this.$router.push("/boil");
            })
            .catch((err) => {
              if (err && err.code === 201) {
                this.routeDialog = true;
                this.routeList = err.data;
              }
            });
        }
        // 出站
        if (this.$route.query.wipStorageStatus == 1) {
          outStation({
            flowLineLable: this.$route.query.flowLineLable || flowLineLable,
            param: {
              FormData: JSON.stringify(params),
            },
            processUuid: this.$route.query.processUuid,
            processingOrderCode: this.$route.query.processingOrderCode,
          })
            .then((res) => {
              this.$message.success("出站成功");
              sessionStorage.removeItem(
                `${this.$route.query.processingOrderCode + "KG"}`
              );
              this.$router.push("/boil");
            })
            .catch((err) => {
              if (err && err.code === 201) {
                this.routeDialog = true;
                this.routeList = err.data;
              }
            });
        }
      }
    },
    // 当选中路线时
    handleCloseRoute(row, index) {
      this.currentRoute = {
        ...row,
        index,
      };
    },
    handlePowderColorChange(powderColor) {
      const matched = this.powderColorMap.find(item => item.value === powderColor)
      if (matched && matched.extendValue) {
        this.detailForm.reworkType = Number(matched.extendValue)
      }
    },
    handleReworkTypeChange(reworkType) {
      console.log('reworkType', reworkType)
      if (reworkType === 1) {
        this.detailForm.reworkWeight = this.detailForm.feedingWeight
      }
    }
  },
};
</script>

