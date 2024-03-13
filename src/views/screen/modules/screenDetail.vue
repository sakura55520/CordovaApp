<!--筛分-->
<template>
  <div class="detailBox">

    <!-- 顶部信息卡片1 -->
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
        <div class="grid-item">
          <span class="grid-item-name">进站时间&nbsp;&nbsp;</span>
          <span class="grid-item-value">{{ detailInfo.inTime }}</span>
        </div>
        <div class="grid-item">
          <span class="grid-item-name">停留时间&nbsp;&nbsp;</span>
          <span class="grid-item-value">{{
              detailInfo.expectedFeedingTime
            }}</span>
        </div>
      </div>
    </div>
    <div class="fromCard">
      <div class="headLine">
        <div class="headLine-title">录入工序数据</div>
        <div :class="{ 'error-tip': totalNumber >= 10 }">总重量: {{ totalNumber }}</div>
      </div>
      <el-row class="main-wrap">
        <el-form
          ref="detailForm"
          :model="detailForm"
          :rules="rules"
          label-width="110px"
        >
          <el-col :span="24">
            <el-form-item label="设备类型" prop="furnaceType">
              <el-radio-group v-model="detailForm.furnaceType" @change="renderSieving">
                <el-radio :label="0">合成炉</el-radio>
                <el-radio :label="1">大合成炉</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="筛分机编号" prop="equipmentCode" style="width:50%">
              <el-select v-model="detailForm.equipmentCode" placeholder="请选择">
                <el-option v-for="(item,index) in equipmentCodeMap" :key="index" :label="item.name" :value="item.name"/>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-table :data="detailForm.sievingDetailDtos">
              <el-table-column label="料号" prop="materialCode" width="150"/>
              <el-table-column label="目标" prop="meshNumber" width="150"/>
              <el-table-column label="是否入库" prop="wipStorageStatus" width="150"/>
              <el-table-column label="重量g" prop="number">
                <template slot-scope="scope">
                  <GetValByInput
                    :refModel="scope.row"
                    paramName="_number_g"
                    placeholder="请输入"
                    @input="regPositiveNumber(scope.row,'_number_g')"
                    @change="setNumber(scope.row)"
                  />
                  <i>{{ scope.row.number }} kg</i>
                </template>
              </el-table-column>
            </el-table>
            <br>
          </el-col>

          <el-col :span="24">
            <el-form-item label="备注" prop="remarks">
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
        }}
      </el-button>
    </div>
    <!-- 路线选择弹窗 -->
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
        >{{ item.label }}
        </el-radio
        >
      </el-radio-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeRouteDialog">取 消</el-button>
        <el-button type="primary" @click="handle('提交', currentRoute.label)"
        >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 打印预览 -->
    <PreviewDialog ref="PreviewDialog" v-if="previewDialogVisible" :dialogVisible="previewDialogVisible"
                   :changeParentData="changeParentData" :dialogForm="previewDialogForm" @submit="onPrint"
                   @close="clearDetailForm"/>
  </div>
</template>

<script>
import * as Api from "@/api/screen/screen.js";
import PreviewDialog from './previewDialog.vue'
import {inStation, outStation} from "@/api/overStation/overStation.js";

import CodeScanner from "@/components/CodeScanner";
import PhotoNew from "@/views/components/photoNew.vue";
import {getSeleteData} from "@/utils/select";
import GetValByInput from '@/views/components/getValByInput'
import {regPositiveNumber, getTimeInterval} from "@/utils/tool.js";

const defaultForm = {
  furnaceType: 0, // 设备类型
  equipmentCode: null, // 筛分机编号
  sievingDetailDtos: []
}

export default {
  name: "DirList",
  components: {
    CodeScanner,
    PhotoNew,
    PreviewDialog,
    GetValByInput
  },
  data() {
    return {
      regPositiveNumber,
      page: 1,
      rows: 10,
      equipmentCodeMap: [],//筛分编号下拉框

      detailForm: Object.assign({}, JSON.parse(JSON.stringify(defaultForm))), // 页面表单
      rules: {
        furnaceType: [{ required: true, message: '请选择设备类型', trigger: 'change' }],
      },
      sievingDetailDtos: [],
      detailInfo: {}, // 表单列表

      routeItem: undefined, //路线绑定项
      currentRoute: {}, //当前选中路线
      routeList: [], //路线列表
      routeDialog: false,

      previewDialogVisible: false,
      previewDialogForm: {
        tplSrc: []
      },
    };
  },
  computed: {
    totalNumber() {
      const num = (this.detailForm.sievingDetailDtos || []).reduce((prev, current) => prev + Number(current.number || 0), 0)
      return Number(num.toFixed(4))
    }
  },
  created() {
    getSeleteData('screenCode', this.equipmentCodeMap)
  },
  mounted() {
    this.init();
  },
  methods: {
    // 页面初始化
    async init() {
      let storageData = sessionStorage.getItem(
        `${this.$route.query.processingOrderCode + "SF"}`
      );
      await this.fetchBaseData(this.$route.query.processingOrderCode);
      this.setExpectedFeedingTime();
      if (storageData) {
        let {detailForm} = JSON.parse(storageData);
        this.detailForm = Object.assign({}, JSON.parse(JSON.stringify(defaultForm)), detailForm);
      } else {

        // 设备类型
        const { fromData } = this.$route.query
        if (fromData) {
          this.detailForm.furnaceType = Number(fromData.furnaceType)
        }

        await getSeleteData('SICpowder', this.sievingDetailDtos)
        this.renderSieving()
      }

      this.detailForm.photo = this.detailForm.photo ? JSON.parse(this.detailForm.photo) : this.detailForm.photo

      this.$nextTick(() => {
        this.$refs['detailForm'].clearValidate()
      })
    },
    renderSieving() {
      this.detailForm.sievingDetailDtos.length = 0
      this.sievingDetailDtos.forEach(item => {
        if (Number(item.extendValue2) !== this.detailForm.furnaceType) return
        this.detailForm.sievingDetailDtos.push({
          materialCode: item.extendValue,//料号
          wipStorageStatus: Number(item.extendValue1) ? '入库' : '不入库',//是否入库状态
          meshNumber: item.name,//目数
          number: undefined,//数量
        })
      })
    },
    getNowTime() {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const day = now.getDate();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      return `${year}-${month < 10 ? ('0' + month) : month}-${day < 10 ? ('0' + day) : day} ${hours < 10 ? ('0' + hours) : hours}:${minutes < 10 ? ('0' + minutes) : minutes}:${seconds < 10 ? ('0' + seconds) : seconds}`
    },
    closeRouteDialog() {
      this.routeDialog = false;
    },
    // 设置预计投料时间
    setExpectedFeedingTime() {
      this.$set(this.detailInfo, 'expectedFeedingTime', getTimeInterval(null, this.detailInfo.inTime))
    },
    // 加载原始数据
    async fetchBaseData(code) {
      return Api.listByPage({
        processCode: "SF",
        code: code,
        page: this.page,
        rows: this.rows,
      }).then((res) => {
        this.detailInfo = res.data.rows[0] || [];
        console.log(this.$route.query, "this.$route.query");
        return;
      });
    },
    // 打印预览取消时清空表单数据
    clearDetailForm() {
      this.detailForm = Object.assign({}, JSON.parse(JSON.stringify(defaultForm)))
      this.sievingDetailDtos.forEach(item => {
        this.detailForm.sievingDetailDtos.push({
          materialCode: item.extendValue,//料号
          wipStorageStatus: Number(item.extendValue1) ? '入库' : '不入库',//是否入库状态
          meshNumber: item.name,//目数
          number: undefined,//数量
        })
      })
      this.$message.success(`${this.$route.query.wipStorageStatus == 0 ? "进站成功" : "出站成功"}`)
      this.$router.push("/screen");
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
    setNumber(row) {
      // g 转换为 kg
      let kg = row._number_g / 1000
      kg = Number((kg).toFixed(4))
      this.$set(row, 'number', kg)
    },
    // 操作
    async handle(typeName = "", flowLineLable) {
      if (typeName === "保存") {
        let {detailForm} = this;
        let saveData = {
          detailForm,
        };
        sessionStorage.setItem(
          `${this.$route.query.processingOrderCode + "SF"}`,
          JSON.stringify(saveData)
        );
        this.$message.success("保存成功");
        this.$router.push("/screen");
      }
      if (typeName === "提交") {
        const valid = await this.$refs['detailForm'].validate()
        if (!valid) return
        if (!flowLineLable && this.totalNumber > 10) {
          await this.$confirm(`总重量为${this.totalNumber}kg, 是否继续提交?`, '请确认', {
            confirmButtonText: '提交',
            cancelButtonText: '取消',
            type: 'warning'
          })
        }

        this.detailForm.sievingDetailDtos = this.detailForm.sievingDetailDtos.map(item => {
          return {
            ...item,
            number: item.number || 0
          }
        })
        let params = this.detailForm;
        console.log(params, "params");
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
                `${this.$route.query.processingOrderCode + "SF"}`
              );
              this.$router.push("/screen");
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
              if (res.data !== null && res.data.length > 0) {
                this.previewDialogVisible = true
                this.previewDialogForm.tplSrc = res.data
              } else {
                this.$message.success("出站成功");
                sessionStorage.removeItem(
                  `${this.$route.query.processingOrderCode + "SF"}`
                );
                this.$router.push("/screen");
              }
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
    // 打印回调
    onPrint() {
      Api.print({
        "data": this.$route.query.processingOrderCode + "_sys",
        "documentMould": "合成-筛分打码",
        "printNum": 1,
        "type": 1
      }).then(() => {
        this.$message.success("出站成功");
        sessionStorage.removeItem(
          `${this.$route.query.processingOrderCode + "SF"}`
        );
        this.$router.push("/screen");
      })
    },
    // 当选中路线时
    handleCloseRoute(row, index) {
      this.currentRoute = {
        ...row,
        index,
      };
    },
    // 改变当前页面数据，供子组件调用
    changeParentData(key, value) {
      this[key] = JSON.parse(JSON.stringify(value))
    },
  },
};
</script>

