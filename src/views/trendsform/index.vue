<template>
  <div class="FormBox">
    <div class="code">工单号：{{ params.processingOrderCode }}</div>
    <el-form
      ref="dataForm"
      :model="temp"
      :rules="rules"
      class="form"
      :size="formConf.size"
      :disabled="formConf.disabled"
      :label-position="formConf.labelPosition"
    >
      <el-form-item v-if="isNeedsDevice" label="设备号" label-width="100px">
        <CodeScanner  v-bind="codeScannerConfig" v-model="params.equipmentCode"/>
      </el-form-item>
      <template v-if="Boolean(modelForm.length)">
        <RenderForm
          v-for="(element, index) in modelForm"
          :key="element.renderKey"
          :drawing-list="modelForm"
          :element="element"
          :form-conf="formConf"
          :index="index"
          :formObj="temp"
          :params="params"
        />
      </template>
      <el-alert v-else title="没有表单数据" type="warning" />
    </el-form>
    <div class="handleBox">
      <el-button type="primary" @click="handleSubmit">确认提交</el-button>
      <el-button type="danger" @click="closePage">取消</el-button>
    </div>
    <el-dialog
      title="路线选择"
      :visible.sync="routeDialogVisible"
      width="80%"
      :before-close="closeRouteDialog"
    >
      <el-select v-model="flowLineLable" placeholder="请选择路线">
        <el-option
          v-for="(item, index) in flowLineMap"
          :key="index"
          :label="item.label"
          :value="item.label"
        />
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeRouteDialog">取 消</el-button>
        <el-button type="primary" @click="handleSubmit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import CodeScanner from './modules/CodeScanner.vue';
import RenderForm from "./modules/renderForm.vue";
import * as Api from "@/api/trendsform/trendsform.js";
import { getToken } from '@/utils/auth'


export default {
  components: {
    RenderForm,
    CodeScanner
  },
  data() {
    return {
      codeScannerConfig:{
        "border": true,
        "colon": true,
        "column": 2,
        "urlParams": [
            {}
        ],
        "childrenConfig": [
            {
                "label": "用户名",
                "span": 2,
                "vModel": "fild1"
            }
        ],
        "title": "标题文本，显示在左上方",
        "direction": "horizontal"
      },
      testData: undefined,
      isNeedsDevice:false,
      params: {},
      formConf: {
        formRef: "elForm",
        formModel: "formData",
        size: "medium",
        labelPosition: "right",
        labelWidth: 100,
        formRules: "rules",
        gutter: 15,
        disabled: false,
        span: 24,
        formBtns: true,
      },
      modelMap: [],
      modelFormMap: [],
      list: [],
      listLoading: true,
      rules: {},
      temp: {},
      modelForm: [],
      dialogFormVisible: false,
      routeDialogVisible: false,
      flowLineLable: undefined,
      flowLineMap: [],
      token:'token123'
    };
  },
  mounted() {
    this.fetchData();
    this.token = getToken()
  },
  methods: {
    fetchData() {
      // this.params = { "equipmentCode": "", "index": 0, "processingOrderCode": "CJGC2952303K5801X31Y01", "operationType": 0, "processUuid": "abmbvs720a", "modelFormId": 43 }
      this.params = this.$route.meta.params
      console.log(this.params,'this.params');
      Api.getFormData({
        processingOrderCode: this.params.processingOrderCode,
      }).then((res) => {
        this.isNeedsDevice = res.data[this.params.index].isNeedsDevice
        this.params.operationType = res.data[this.params.index].wipStorageStatus;
        this.params.processUuid = res.data[this.params.index].processUuid;
        this.params.modelFormId = res.data[this.params.index].operationData.id;

        this.modelForm = res.data[this.params.index].operationData.content || [];
        this.modelForm.forEach((item) => {
          this.rules[item.vModel] = [
            { required: item.required, message: " ", trigger: "change" },
          ];
        });
        this.$forceUpdate();
      });
    },
    handleSubmit() {
      this.$refs["dataForm"].validate((val) => {
        if (val) {
          if(this.isNeedsDevice && !this.params.equipmentCode){
            this.$message.error('请填写设备号')
            return
          }
          let data;
          if (this.params.operationType === 0) {
            //进站
            data = {
              equipmentCode: this.params.equipmentCode, //设备号
              param: {
                ModelFormData: JSON.stringify(this.setParam(this.temp)),
              },
              processUuid: this.params.processUuid, //当前工序唯一标识
              processingOrderCode: this.params.processingOrderCode, //工单号
            };
            this.testData = JSON.stringify(data);
            Api.inStation(data).then((res) => {
              this.$message.success("进站成功");
              this.closePage();
            });
          } else if (this.params.operationType === 1) {
            //出站
            data = {
              equipmentCode: this.params.equipmentCode, //设备号
              flowLineLable: this.flowLineLable,
              param: {
                ModelFormData: JSON.stringify(this.setParam(this.temp)),
              },
              processUuid: this.params.processUuid, //当前工序唯一标识
              processingOrderCode: this.params.processingOrderCode, //工单号
            };
            this.testData = JSON.stringify(data);
            Api.outStation(data).then((res) => {
              this.closeRouteDialog();
              this.$message.success("出站成功");
              this.closePage();
            }).catch(res=>{
              if (res.code == "201") {
                this.routeDialogVisible = true;
                this.flowLineMap = res.data;
              }
            })
          } else {
            // 无匹配状态
            this.$message.error("未获取匹配的出进站状态，请检查重试");
            return;
          }
        } else {
          this.$message.error("请将表单必选填写完整");
        }
      });
    },
    //将表单数组类型数据转换成字符串
    setParam(data = {}) {
      let formData = JSON.parse(JSON.stringify(data));
      let keys = Object.keys(formData);
      keys.forEach((item, index) => {
        if (Array.isArray(formData[item])) {
          formData[item] = (formData[item] || []).join(",");
        }
      });
      formData.modelFormId = this.params.modelFormId;
      formData.processingOrderCode = this.params.processingOrderCode;
      console.log(formData, "formData");
      return formData;
    },
    closeRouteDialog() {
      this.routeDialogVisible = false;
      this.flowLineLable = undefined;
    },
    closePage() {
      this.$router.push('/')
    },
  },
};
</script>
<style lang="scss" scoped>
.code {
  background-color: #fdf6ec;
  color: #e6a23c;
  font-size: 18px;
  font-weight: 400;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  border-radius: 5px;
  padding: 3px 5px;
  position: relative;
  top: -10px;
}
.FormBox {
  height: calc(100vh - 50px);
  overflow-y: scroll;
  max-width: 100vw;
  padding: 10px 0px 60px 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #FFF;
  .form {
    width: calc(100vw - 20px);
    max-width: 100vw;
    padding-right: 5px;
    padding-top: 5px;
    //position: fixed;
  }
}

.handleBox {
  position: fixed;
  z-index: 2;
  bottom: 0;
  width: 100vw;
  max-width: 100vw;
  height: 60px;
  background-color: #fff;
  border-top: 1px solid rgba(192, 192, 192, 0.418);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>