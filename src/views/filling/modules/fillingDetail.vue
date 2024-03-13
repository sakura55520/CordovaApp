<!--装埚-->
<!--
  生产配料
    物料扫码之后， 判断逻辑：
      批次号 && 库位 都相同， 则不加入
      扫码结果批次号 === 原料混合 批次号 || 扫码结果料号 === 产品BOM 料号， 则加入
-->
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
        <!-- <img src="@/assets/imgs/frame.png" alt="" /> -->
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
          <span class="grid-item-name">产品配方&nbsp;&nbsp;</span>
          <span class="grid-item-value">{{
            detailInfo.dataObj.productBomName
          }}</span>
        </div>
        <div class="grid-item">
          <span class="grid-item-name">叫料时间&nbsp;&nbsp;</span>
          <span class="grid-item-value">{{ detailInfo.inTime }}</span>
        </div>
        <div class="grid-item">
          <span class="grid-item-name">预计投料时间&nbsp;&nbsp;</span>
          <span class="grid-item-value">{{
            detailInfo.expectedFeedingTime
          }}</span>
        </div>
      </div>
    </div>
    <!-- 其他表单卡片 -->
    <!-- card1 -->
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

    <div class="fromCard">
      <div class="headLine">
        <div class="headLine-title">录入工序数据</div>
        <div class="headLine-tip"></div>
      </div>
      <el-form
        ref="detailForm"
        :model="detailForm"
        :rules="rules"
        class="form"
        label-position="right"
        label-width="110px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="坩埚编号" prop="crucibleCode" style="flex: 1;">
              <CodeScanner
                ref="CodeScanner"
                v-model="detailForm.crucibleCode"
                :placeholder="'请扫描或输入'"
                @has-done="scan(detailForm, 'crucibleCode')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="坩埚段编号" prop="crucibleSectionCode" style="flex: 1;">
              <CodeScanner
                ref="CodeScanner"
                v-model="detailForm.crucibleSectionCode"
                :placeholder="'请扫描或输入'"
                @has-done="scan(detailForm, 'crucibleSectionCode')"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="石墨件9" prop="graphitePiece9" style="flex: 1;">
              <CodeScanner
                ref="CodeScanner"
                v-model="detailForm.graphitePiece9"
                :placeholder="'请扫描或输入'"
                @has-done="scan(detailForm, 'graphitePiece9')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="坩埚盖" prop="crucibleCover" style="flex: 1;">
              <CodeScanner
                ref="CodeScanner"
                v-model="detailForm.crucibleCover"
                :placeholder="'请扫描或输入'"
                @has-done="scan(detailForm, 'crucibleCover')"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="坩埚重量" prop="crucibleWeight" style="flex: 1;">
              <GetValByInput :refModel="detailForm" paramName="crucibleWeight" placeholder="请输入" @input="regPositiveNumber(detailForm,'crucibleWeight')"/>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="坩埚段重量" prop="crucibleSectionWeight" style="flex: 1;">
              <GetValByInput :refModel="detailForm" paramName="crucibleSectionWeight" placeholder="请输入" @input="regPositiveNumber(detailForm,'crucibleSectionWeight')"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="投料重量" prop="feedingWeight" style="flex: 1;">
              <el-input
                v-model="detailForm.feedingWeight"
                placeholder="请输入"
                @input="regPositiveNumber(detailForm, 'feedingWeight')"
              />
            </el-form-item>
          </el-col>

          <!--返工时 隐藏-->
          <el-col v-if="detailInfo.processType !== 1" :span="12">
            <el-form-item label="退料重量" prop="materialReturnWeight" style="flex: 1;">
              <el-input
                v-model="detailForm.materialReturnWeight"
                placeholder="请输入"
                @input="regPositiveNumber(detailForm, 'materialReturnWeight')"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
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
import * as Api from "@/api/filling/filling.js";
import { inStation, outStation } from "@/api/overStation/overStation.js";

import CodeScanner from "@/components/CodeScanner";
import PhotoNew from "@/views/components/photoNew.vue";
import { getSeleteData } from "@/utils/select";
import GetValByInput from '@/views/components/getValByInput'
import { regPositiveNumber,getAfterTimeByMinute } from "@/utils/tool.js";

const defaultForm = {
  crucibleCode: null, // 坩埚编号
  crucibleSectionCode: null, // 坩埚段编号
  graphitePiece9: null, // 石墨件9
  crucibleCover: null, // 坩埚盖
  crucibleWeight: null, // 坩埚重量
  crucibleSectionWeight: null, // 坩埚段重量
  feedingWeight: null, // 投料重量
  materialReturnWeight: null, // 退料重量
}

export default {
  name: "FillingDetail",
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
      scanCode: "",
      isShowMoreInfo: false,
      detailForm: Object.assign({}, defaultForm), // 页面表单
      detailInfo: {}, // 表单列表
      rules: {
        crucibleCode: [{ required: true, message: '请输入坩埚编号', trigger: 'change' }],
        crucibleSectionCode: [{ required: true, message: '请输入坩埚段编号', trigger: 'change' }],
        crucibleCover: [{ required: true, message: '请输入坩埚盖', trigger: 'change' }],
        feedingWeight: [{ required: true, message: '请输入投料重量', trigger: 'blur' }],
      },
      processlist: [], // 配方列表

      bomFirstTotalWeight: undefined, //记录第一次BOM的总重量，避免重新更新BOM数据时总重量被覆盖
      routeItem: undefined, //路线绑定项
      currentRoute: {}, //当前选中路线
      routeList: [], //路线列表
      routeDialog: false,
    };
  },
  created() {},
  mounted() {
    this.init();
  },
  methods: {
    // 页面初始化
    async init() {
      let storageData = sessionStorage.getItem(
        `${this.$route.query.processingOrderCode + "ZG"}`
      );
      await this.fetchBaseData(this.$route.query.processingOrderCode);
      this.fetchProcesslistAll(
        (this.detailInfo.dataObj || {}).productCode
      );
      this.setExpectedFeedingTime();
      if (storageData) {
        let { detailForm } = JSON.parse(storageData);
        this.detailForm = Object.assign({}, defaultForm, detailForm);
      }
      this.detailForm.photo = this.detailForm.photo ? JSON.parse(this.detailForm.photo) : this.detailForm.photo
    },
    closeRouteDialog() {
      this.routeDialog = false;
    },
    // 设置预计投料时间
    setExpectedFeedingTime() {
      let expectedFeedingTime = [];
      getSeleteData("expectedFeedingTime", expectedFeedingTime).then(() => {
        expectedFeedingTime.forEach((item, index) => {
          if (item.name === "配料装埚") {
            this.$set(
              this.detailInfo,
              "expectedFeedingTime",
              getAfterTimeByMinute(this.detailInfo.inTime, item.value)
            );
          }
        });
      });
    },
    // 改变显示更多盒子状态
    changeMoreInfoBox() {
      this.isShowMoreInfo = !this.isShowMoreInfo;
    },
    // 加载原始数据
    async fetchBaseData(code) {
      return Api.listByPage({
        processCode: this.$route.query.wipStorageCode,
        code: code,
        page: this.page,
        rows: this.rows,
      }).then((res) => {
        this.detailInfo = res.data.rows[0] || [];
        console.log(this.$route.query, "this.$route.query");
        return;
      });
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
          `${this.$route.query.processingOrderCode + "ZG"}`,
          JSON.stringify(saveData)
        );
        this.$message.success("保存成功");
        this.$router.push("/filling");
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
                `${this.$route.query.processingOrderCode + "ZG"}`
              );
              this.$router.push("/filling");
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
                `${this.$route.query.processingOrderCode + "ZG"}`
              );
              this.$router.push("/filling");
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
/deep/ .el-form-item__content{
  width: calc(100% - 120px);
}
.isShowMoreInfo {
  padding: 10px;
  text-align: center;
  background-color: #40a0ff36;
  border-radius: 5px;
  margin-bottom: 15px;
  color: #409eff;
}
</style>
