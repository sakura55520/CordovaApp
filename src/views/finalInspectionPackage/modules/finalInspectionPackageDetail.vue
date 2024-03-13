<!--原料合成/终检包装-->
<template>
  <div class="detailBox">
    <el-form
      ref="detailForm"
      :model="detailForm"
      :inline="false"
      :rules="rules"
      class="demo-form-inline"
      label-width="120px"
    >
      <div class="fromCard">
        <div class="headLine">
          <div class="headLine-title">添1加批次号/选择规则</div>
          <div class="headLine-tip"></div>
        </div>
        <div class="main-wrap">
          <el-form-item label="去向" prop="destination">
            <el-radio-group v-model="detailForm.destination">
              <el-radio :label="0">NC</el-radio>
              <el-radio :label="1">线边仓</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="扫码添加批次">
            <div class="scan-wrap">
              <CodeScanner v-model="detailForm.scanCode" :placeholder="'请扫描或输入物料批次号'" @has-done="fetchListData(detailForm.scanCode)"/>
              <el-button type="primary" @click="toSelectItemDialog">选择</el-button>
            </div>
          </el-form-item>

          <template v-if="!this.isLineSide">
            <el-form-item label="包装规则" prop="rule">
              <el-select v-model="detailForm.rule" placeholder="请选择" clearable style="width:100%" @change="setRuleInfo">
                <el-option v-for="(item,index) in ruleMap" :key="index" :label="item.name" :value="item.name"/>
              </el-select>
            </el-form-item>
            <div :class="'grid-container'">
              <div class="grid-item">
                <span class="grid-item-name">目数&nbsp;&nbsp;</span>
                <span class="grid-item-value">{{ ruleInfo.meshNumber }}</span>
              </div>
              <div class="grid-item">
                <span class="grid-item-name">包装重量kg&nbsp;&nbsp;</span>
                <span class="grid-item-value">{{ ruleInfo.min }}~{{ ruleInfo.max }}</span>
              </div>
            </div>
          </template>
        </div>
        <br>
      </div>

      <div class="fromCard">
        <div class="headLine">
          <div class="headLine-title">重量合计</div>
          <div class="final-tips">
            <div :style="{ color: getWeightColor }">
              实际包装重量:
              <strong>{{ totalWeight }}</strong>
            </div>
            <div v-show="shortWeight > 0" class="final-short">
              待包装重量:
              <strong>{{ shortWeight }}</strong>
            </div>
          </div>

        </div>

        <div class="main-wrap" v-for="(item,index) in detailForm.packageDeatils" :key="index">
          <!-- head -->
          <div class="headLine" style="padding: 0px;">
            <div>
              <span class="headLine-name">炉次号&nbsp;&nbsp; </span>
              <span class="headLine-value">{{ item.code }}</span>
            </div>
            <div>
              <el-tag v-if="item.processType === 0" type="success">正常</el-tag>
              <el-tag v-if="item.processType === 1" type="danger">返工</el-tag>
              <el-button type="danger" size="mini" style="margin-left: 5px;" @click="detailForm.packageDeatils.length > 1 ? detailForm.packageDeatils.splice(index,1) : $message.error('须至少保留一条')">删除</el-button>
            </div>
          </div>
          <!-- body -->
          <div :class="'grid-container'" v-if="item.dataObj">
            <div class="grid-item">
              <span class="grid-item-name">生产批次号&nbsp;&nbsp;</span>
              <span class="grid-item-value">{{
                item.dataObj.productionBatchNo
              }}</span>
            </div>
            <div class="grid-item">
              <span class="grid-item-name">目数&nbsp;&nbsp;</span>
              <span class="grid-item-value">{{
                item.dataObj.meshNumber
              }}</span>
            </div>
            <div class="grid-item">
              <span class="grid-item-name">分选重量&nbsp;&nbsp;</span>
              <span class="grid-item-value">{{
                item.number
              }}</span>
            </div>
            <div class="grid-item">
              <el-form-item
                :prop="`packageDeatils.${index}.number`"
                :rules="{ required: true, message: '请输入包装重量', trigger: 'change' }"
                label="包装重量"
                label-width="90px"
              >
                <GetValByInput :refModel="item" paramName="number" placeholder="请输入" @input="regPositiveNumber(item,'number')" @change="checkPackageWeight($event,item)"/>
              </el-form-item>
            </div>
          </div>
        </div>
      </div>

      <!-- 其他备注、照片部分 -->
      <div class="fromCard">
        <div class="headLine">
          <div class="headLine-title">其他</div>
          <div class="headLine-tip"></div>
        </div>
        <el-row class="main-wrap">
          <el-col :span="24">
            <el-form-item label="备注" label-width="90px" prop="mark">
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
            <el-form-item label="添加附件" label-width="90px">
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
      </div>
    </el-form>

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

    <SelectItemDialog ref="Dialog" v-if="selectItemDialogVisible" :dialogVisible="selectItemDialogVisible" :meshNumber="this.detailForm.packageDeatils[0].dataObj.meshNumber" :changeParentData="changeParentData" :selectedList="detailForm.packageDeatils" @submit="setDetailInfo"/>

    <!-- 打印弹窗组件 -->
    <print-dialog
      :print-list="printList"
      :visible.sync="printVisible"
      :print-data="printData"
      @handleData="back"
    />
  </div>
</template>

<script>
import * as Api from "@/api/finalInspectionPackage/finalInspectionPackage.js";
import { inStation, outStation } from "@/api/overStation/overStation.js";
import CodeScanner from "@/components/CodeScanner";
import SelectItemDialog from './selectItemDialog';
import GetValByInput from '@/views/components/getValByInput';
import PhotoNew from "@/views/components/photoNew.vue";
import { getSeleteData } from "@/utils/select";
import { regPositiveNumber,getTimeInterval } from "@/utils/tool.js";
import { round } from 'lodash-es'

const defaultForm = {
  destination: null, // 去向（0：NC，1：线边仓）
  rule: null, // 包装规则
  packageDeatils: []
}

export default {
  name: 'FinalInspectionPackageDetail',
  components: {
    CodeScanner,
    PhotoNew,
    SelectItemDialog,
    GetValByInput
  },
  data() {
    return {
      regPositiveNumber,
      page: 1,
      rows: 10,
      ruleInfo:{},//规则展示数据
      ruleMap:[],//包装规则下拉框
      powderAppearanceMap:[],//料粉外观下拉框

      detailForm: Object.assign({}, JSON.parse(JSON.stringify(defaultForm))), // 页面表单
      rules: {
        destination: [{ required: true, message: '请选择去向', trigger: 'change' }],
        rule: [{ required: true, message: '请选择包装规则', trigger: 'change' }],
      },

      routeItem: undefined, //路线绑定项
      currentRoute: {}, //当前选中路线
      routeList: [], //路线列表
      routeDialog: false,

      selectItemDialogVisible:false,//选择批次弹窗显隐控制

      printVisible:false,
      printData: {
        data: '', // 打印基础信息
        documentMould: '合成-包装打码', // 	打印模版名称
        printNum: 1,
        type: 1 // 执行类型：0：不填充数据，1：填充数据
      },
      printList:[],
    };
  },
  computed: {
    totalWeight() {
      let total = (this.detailForm.packageDeatils || []).reduce((prev, current) => prev + Number(current.number || 0), 0)
      return round(total, 3)
    },
    shortWeight() {
      const short = this.ruleInfo.min - this.totalWeight
      if (short < 0) return 0
      return round(short, 3)
    },
    getWeightColor() {
      const { min, max } = this.ruleInfo
      if (this.totalWeight < min) return '#A8ABB2'
      if (this.totalWeight > max) return '#F53D3D'
      return '#67c23a'
    },
    // 是否去线边仓
    isLineSide() {
      return this.detailForm.destination === 1
    }
  },
  created() {
    getSeleteData('powderAppearance',this.powderAppearanceMap)
  },
  mounted() {
    this.init();
  },
  methods: {
    // 页面初始化
    async init() {
      let storageData = sessionStorage.getItem(
        `${this.$route.query.processingOrderCode + "ZJBZ-Y"}`
      );
      await this.fetchListData(this.$route.query.processingOrderCode);
      if (storageData) {
        let { detailForm } = JSON.parse(storageData);
        this.detailForm = Object.assign({}, JSON.parse(JSON.stringify(defaultForm)), detailForm);
      }
      this.detailForm.photo = this.detailForm.photo ? JSON.parse(this.detailForm.photo) : this.detailForm.photo
      this.getRuleMap()

      this.$nextTick(() => {
        this.$refs['detailForm'].clearValidate()
      })
    },
    getRuleMap(){
      Api.getRuleList({search_EQ_materialCode:this.detailForm.packageDeatils[0].dataObj.productCode || '',page: 1, rows: 10000}).then(res=>{
        this.ruleMap = res.data.rows || []
        if (!this.detailForm.rule && this.ruleMap.length) {
          this.detailForm.rule = this.ruleMap[0].name
          this.setRuleInfo()
        }
        this.$nextTick(() => {
          this.$refs['detailForm'].clearValidate()
        })
      })
    },
    // 校验包装重量的输入不能大于分选重量
    checkPackageWeight(val,item){
      if(val){
        if(val > item.number){
          item.number = undefined
          this.$message.error('包装重量不能大于分选重量')
        }
      }
    },
    // 设置展示规则信息
    setRuleInfo(){
      const { rule } = this.detailForm
      if(rule){
        // 计算浮动范围
        const matchedRule = this.ruleMap.find(item => item.name === rule)
        if (matchedRule) {
          const { floating, number } = matchedRule
          this.ruleInfo = matchedRule
          let min = number
          let max = number
          if (floating) {
            const matched = floating.match(/(\D?)([\d\.]+)/)
            if (matched) {
              const prefix = matched[1]
              const _floating = Number(matched[2])
              if (!prefix || prefix === '+' || prefix === '±') {
                max += _floating
              }
              if (prefix === '-' || prefix === '±') {
                min -= _floating
              }
            }
          }
          this.ruleInfo.min = round(min, 3)
          this.ruleInfo.max = round(max, 3)
        }
        this.ruleInfo.meshNumber = this.detailForm.packageDeatils[0].dataObj.meshNumber
      }else{
        this.ruleInfo = {}
      }
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
    // 点击选择批次
    toSelectItemDialog(){
      this.selectItemDialogVisible = true
    },
    // 改变当前页面数据，供子组件调用
    changeParentData(key,value) {
      this[key] = JSON.parse(JSON.stringify(value))
    },
    // 设置detailInfo重量合计列表
    setDetailInfo(rows){
      rows.forEach(item=>{
        this.detailForm.packageDeatils.push(item)
      })
    },
    closeRouteDialog() {
      this.routeDialog = false;
    },
    // 设置预计投料时间
    setExpectedFeedingTime(inTime) {
      if(!inTime)return
      return getTimeInterval(null,inTime)
    },
    // 加载原始数据
    async fetchListData(code) {
      return Api.listByPage({
        processCode: "ZJBZ-Y",
        code,
        page: this.page,
        rows: this.rows,
      }).then((res) => {
        if((res.data.rows || []).length>0){
          if(this.detailForm.packageDeatils.length > 0){
            if(this.detailForm.packageDeatils.filter(item=>item.processingOrderCode === res.data.rows[0].code).length === 0){
              this.$message.success('添加成功')
              this.detailForm.packageDeatils.push(res.data.rows[0])
            }else{
              this.detailForm.scanCode = undefined
              this.$message.error('该批次号已存在')
            }
          }else{
            this.detailForm.packageDeatils.push(res.data.rows[0])
          }
        }else{
          this.$message.error('暂无数据')
          this.detailForm.scanCode = undefined
        }
      }).catch(()=>{
      })
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
        this.$router.push("/finalInspectionPackage");
      }

      if (typeName === "提交") {
        // 校验
        const valid = await this.$refs['detailForm'].validate()
        if (!valid) return

        // 线边仓去向, 不需要校验包装规则
        const { min, max } = this.ruleInfo
        if(!this.isLineSide && (this.totalWeight < min || this.totalWeight > max)) return this.$message.error(`实际包装重量合计【${this.totalWeight}】超出范围【${min}~${max}】!`)

        this.$refs.detailForm.validate(valid => {
          if (!valid) return
          this.$confirm(`终检包装的去向为【${this.detailForm.destination ? '线边仓' : 'NC'}】, 请确认!`, '确认信息', {
            type: 'warning'
          }).then(() => {
            this.detailForm.number = this.ruleInfo.number
            this.detailForm.packageDeatils.forEach(item => {
              item.processingOrderCode = item.code
            })

            // 进站
            if (this.$route.query.wipStorageStatus == 0) {
              inStation({
                equipmentCode: this.$route.query.deviceCode,
                param: {
                  FormData: JSON.stringify(this.detailForm),
                },
                processUuid: this.$route.query.processUuid,
                processingOrderCode: this.$route.query.processingOrderCode,
              })
                .then((res) => {
                  this.$message.success("进站成功");
                  sessionStorage.removeItem(
                    `${this.$route.query.processingOrderCode + "KG"}`
                  );
                  this.$router.push("/finalInspectionPackage");
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
                  FormData: JSON.stringify(this.detailForm),
                },
                processUuid: this.$route.query.processUuid,
                processingOrderCode: this.$route.query.processingOrderCode,
              })
                .then((res) => {
                  this.$message.success("出站成功");
                  sessionStorage.removeItem(
                    `${this.$route.query.processingOrderCode + "KG"}`
                  );
                  if (res.data) {
                    // 打印
                    this.printList = res.data.printImage || []
                    this.printVisible = true
                    this.printData.data = res.data.packageBatch
                  } else {
                    this.back()
                  }
                })
                .catch((err) => {
                  if (err && err.code === 201) {
                    this.routeDialog = true;
                    this.routeList = err.data;
                  }
                });
            }
          }).catch(() => {})
        })
      }
    },
    back(){
      this.$router.push("/finalInspectionPackage");
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
.final-tips {
  text-align: right;
}
.final-short {
  color: #F53D3D;
}
</style>
