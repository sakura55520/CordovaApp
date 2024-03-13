<!--破碎-->
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
      <div class="grid-item" style="padding: 5px;">
        <span class="grid-item-name" style="flex-shrink: 0;">生产批号&nbsp;&nbsp;</span>
        <span v-if="detailInfo && detailInfo.dataObj" class="grid-item-value">{{
            detailInfo.dataObj.productionBatchNo
          }}</span>
      </div>
      <div :class="'grid-container'" v-if="detailInfo.dataObj">
        <div class="grid-item">
          <span class="grid-item-name">产品名称&nbsp;&nbsp;</span>
          <span class="grid-item-value">{{
            detailInfo.dataObj.productName
          }}</span>
        </div>
      </div>
    </div>

    <!-- 其他表单卡片 -->
    <template v-if="isShowMoreInfo">
      <div class="fromCard">
        <div class="headLine">
          <div class="headLine-title">工艺配方</div>
          <div class="headLine-tip"></div>
        </div>
        <el-table :data="processlist">
          <el-table-column prop="param" label="工艺参数"/>
          <el-table-column prop="value" label="工艺值"/>
        </el-table>
      </div>
    </template>

    <div class="isShowMoreInfo" @click="changeMoreInfoBox">
      <template v-if="isShowMoreInfo">
        <i class="el-icon-caret-top"></i>
        <span>收起工艺配方详情</span>
      </template>
      <template v-else>
        <i class="el-icon-caret-bottom"></i>
        <span>查看更多工艺配方详情</span>
      </template>
    </div>

    <!-- 表单部分 -->
    <div class="fromCard">
      <div class="headLine">
        <div class="headLine-title">录入工序数据</div>
        <div class="headLine-tip"></div>
      </div>
      <el-form
        ref="detailForm"
        :model="detailForm"
        :rules="rules"
        class="main-wrap"
        label-width="120px"
      >
        <div style="height: 40px;margin-bottom: 10px;display: flex;justify-content: space-between;padding: 0px 5px;align-items: center;justify-content: center;background-color:#40a0ff1f;color: #409eff;">
          <p>------破碎前------</p>
        </div>
        <el-row>
          <!-- 破碎前表单项 -->
          <el-col :span="24" style="display:flex">
            <el-form-item label="破碎桶编号" prop="bucketNo" style="width:100%">
              <CodeScanner  :disabled="$route.query.wipStorageStatus == 1" ref="CodeScanner" v-model="detailForm.bucketNo" :placeholder="'请扫描或输入'" @has-done="scan()"/>
            </el-form-item>
          </el-col>

          <el-col :span="24" style="display:flex">
            <el-form-item label="晶体重量" prop="weightBeforeCrushing" style="width:50%">
              <GetValByInput :disabled="$route.query.wipStorageStatus == 1" :refModel="detailForm" paramName="weightBeforeCrushing" placeholder="请输入" @input="regPositiveNumber(detailForm,'weightBeforeCrushing')"/>
            </el-form-item>
            <el-form-item label="滚磨机编号" prop="equipmentCode" style="width:50%">
              <el-select :disabled="$route.query.wipStorageStatus == 1" v-model="detailForm.equipmentCode" placeholder="请选择" clearable style="width:100%">
                <el-option v-for="(item,index) in potMillMap" :key="index" :label="item.code" :value="item.code"/>
              </el-select>
            </el-form-item>
          </el-col>

          <!-- 破碎后表单项 -->
          <template v-if="$route.query.wipStorageStatus == 1 ">
            <el-col :span="24">
              <div style="height: 40px;margin-bottom: 10px;display: flex;justify-content: space-between;padding: 0px 5px;align-items: center;justify-content: center;background-color:#40a0ff1f;color: #409eff;">
                <p>------破碎后------</p>
              </div>
            </el-col>
          </template>
          <!-- 其他部分 -->
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
        </el-row>
      </el-form>
    </div>

    <!-- 页面操作 -->
    <div class="pageHandleBox">
      <el-button class="save" @click="handle('保存')">保存</el-button>
      <el-button class="submit" type="primary" @click="handle('提交')">{{
        this.$route.query.wipStorageStatus == 0 ? "进站" : "出站"
      }}</el-button>
    </div>

    <!-- 选择路线部分 -->
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
import * as Api from '@/api/crush/crush.js'
import { inStation, outStation } from "@/api/overStation/overStation.js";
import CodeScanner from "@/components/CodeScanner";
import PhotoNew from "@/views/components/photoNew.vue";
import GetValByInput from '@/views/components/getValByInput'
import { regPositiveNumber } from "@/utils/tool.js";
import {equipmentListByPage} from "@/api/eqp";

const defaultForm = {
  bucketNo: null, // 破碎桶编号
  weightBeforeCrushing: null, // 晶体重量
  equipmentCode: null, // 滚磨机编号
}

export default {
  name: 'CrushDetail',
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
      isShowMoreInfo:false,
      processlist:[], // 配方列表
      potMillMap:[],//滚磨机下拉框数据

      detailForm: Object.assign({}, defaultForm), // 页面表单
      rules: {
        bucketNo: [{ required: true, message: '请输入破碎桶编号', trigger: 'change' }],
        weightBeforeCrushing: [{ required: true, message: '请输入晶体重量', trigger: 'change' }],
        equipmentCode: [{ required: true, message: '请选择滚磨机编号', trigger: 'change' }],
      },
      detailInfo: {}, // 表单列表
      routeItem: undefined, //路线绑定项
      currentRoute: {}, //当前选中路线
      routeList: [], //路线列表
      routeDialog: false,
    };
  },
  created() {
    this.getEquipmentList()
  },
  mounted() {
    this.init();
  },
  methods: {
    // 页面初始化
    async init() {
      let storageData = sessionStorage.getItem(
        `${this.$route.query.processingOrderCode + "PS"}`
      );
      await this.fetchBaseData(this.$route.query.processingOrderCode);
      this.fetchProcesslistAll((this.detailInfo.dataObj || {}).productCode )
      this.detailForm = Object.assign({}, defaultForm, this.$route.query.fromData)
      if (storageData) {
        let { detailForm } = JSON.parse(storageData);
        this.detailForm = Object.assign({}, defaultForm, detailForm);
      }
      this.detailForm.photo = this.detailForm.photo ? JSON.parse(this.detailForm.photo) : this.detailForm.photo

      this.$nextTick(() => {
        this.$refs['detailForm'].clearValidate()
      })
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
    // 改变显示更多盒子状态
    changeMoreInfoBox(){
      this.isShowMoreInfo = !this.isShowMoreInfo
    },
    // 加载配方详情列表
    async fetchProcesslistAll(productCode){
      return Api.processlistAll({
        materialCode:productCode,
        processCode:this.$route.query.wipStorageCode
      }).then(res=>{
        if(res.data && res.data.productSopTypeOperates && res.data.productSopTypeOperates.length>0){
          return this.processlist = res.data.productSopTypeOperates[0].productSopDetailDtos
        }else{
          return this.processlist = []
        }
      })
    },
    closeRouteDialog() {
      this.routeDialog = false;
    },
    // 加载原始数据
    async fetchBaseData(code) {
      return Api.listByPage({
        processCode: "PS",
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
    // 查询滚磨机设备列表
    getEquipmentList(){
      equipmentListByPage({
        page: 1,
        rows: 10000,
        search_EQ_deviceTypeName: '滚磨机',
        search_EQ_enableState: 1, // 启用状态
      }).then(res=>{
        this.potMillMap = res.rows || []
      })
    },
    // 操作
    async handle(typeName = "", flowLineLable) {
      if (typeName === "保存") {
        let { detailForm} = this;
        let saveData = {
          detailForm,
        };
        sessionStorage.setItem(
          `${this.$route.query.processingOrderCode + "PS"}`,
          JSON.stringify(saveData)
        );
        this.$message.success("保存成功");
        this.$router.push("/crush");
      }

      if (typeName === "提交") {
        const valid = await this.$refs['detailForm'].validate()
        if (!valid) return

        let params = this.detailForm
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
                `${this.$route.query.processingOrderCode + "PS"}`
              );
              this.$router.push("/crush");
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
                `${this.$route.query.processingOrderCode + "PS"}`
              );
              this.$router.push("/crush");
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
  },
};
</script>

<style lang="scss" scoped>
// 网格布局
.grid-container {
  display: grid;
  grid-template-columns: repeat(2, minmax(120px, 1fr));
  grid-gap: 10px;
  padding: 5px;
  .grid-item {
    display: flex;
    align-items: center;
    .grid-item-name {
      color: silver;
    }
    .grid-item-value {
      color: black;
    }
  }
}
// 页面样式
.detailBox {
  position: relative;
  background: #f5f5f5;
  height: calc(100vh - 110px);
  overflow-y: scroll;
  padding: 10px;
}
.topInfoCard {
  width: 100%;
  background-color: #fff;
  margin-bottom: 10px;
  padding: 0px 10px 5px 10px;
  .headLine {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgba(192, 192, 192, 0.3);
    .headLine-name {
      color: rgba(0, 0, 0, 0.7);
    }
    .headLine-value {
      color: black;
      font-size: 16px;
      font-weight: bold;
    }
    .headLine-tag {
      line-height: 3px;
      padding: 10px 15px;
    }
  }
  .menu {
    width: 100%;
    margin-bottom: 10px;
  }
}
.fromCard {
  display: flex;
  flex-direction: column;
  padding: 0px 5px 5px 5px;
  background-color: #fff;
  margin: 10px 0px;
  border-radius: 5px;
  .headLine {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgba(192, 192, 192, 0.3);
    .headLine-title {
      height: 20px;
      line-height: 20px;
      padding-left: 10px;
      color: #409eff;
      border-left: 5px solid #409eff;
    }
    .headLine-tip {
      color: rgb(255, 185, 35);
    }
  }
}

.pageHandleBox {
  position: fixed;
  z-index: 10;
  bottom: 0;
  width: 100%;
  display: flex;
  padding: 7px;
  align-items: center;
  justify-content: space-between;
  .save {
    padding: 15px 20%;
    margin: 0px;
  }
  .submit {
    margin: 0px 10px;
    padding: 15px 20%;
  }
}

.isShowMoreInfo {
  padding: 10px;
  text-align: center;
  background-color: #40a0ff36;
  border-radius: 5px;
  margin-bottom: 15px;
  color: #409eff;
  cursor: pointer;
}
</style>
