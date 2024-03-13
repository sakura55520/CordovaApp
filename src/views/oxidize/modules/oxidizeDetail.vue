<!--氧化-->
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
        <el-tag v-if="detailInfo.processType" type="danger">返工</el-tag>
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
        <!-- <div class="grid-item">
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
        </div> -->
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
        class="main-wrap"
        label-width="120px"
      >

        <!--    遍历石英舟列表    -->
        <el-row v-for="(item,index) in detailForm.oxidationDetailDtos" :key="index" class="barrelList">
          <div class="barrelListHeadLine">
            <div class="barrelListHeadLine-title"><el-tag >{{ index+1 }}</el-tag></div>
            <div class="barrelListHeadLine-tip">
              <el-button type="danger" size="mini" @click="detailForm.oxidationDetailDtos.splice(index,1),setQuartzBoatCodeStatus()">删除</el-button>
            </div>
          </div>

          <div>
            <!-- 进站表单项 -->
            <el-col :span="24" style="display:flex">
              <el-form-item
                :prop="`oxidationDetailDtos.${index}.quartzBoatCode`"
                :rules="{ required: true, message: '请选择石英舟编号', trigger: 'change' }"
                label="石英舟编号"
                style="width:50%"
              >
                <el-select :disabled="$route.query.wipStorageStatus == 1" v-model="item.quartzBoatCode" clearable style="width:100%" @change="setQuartzBoatCodeStatus">
                  <el-option v-for="(item2,index2) in quartzBoatCodeMap" :key="index2" :label="item2.name" :value="item2.name" :disabled="item2.disabled"/>
                </el-select>
              </el-form-item>

              <el-form-item
                :prop="`oxidationDetailDtos.${index}.quartzBoatWeight`"
                label="石英舟重量"
                style="width:50%"
              >
                <GetValByInput :disabled="$route.query.wipStorageStatus == 1" :refModel="item" paramName="quartzBoatWeight" @input="regPositiveNumber(item,'quartzBoatWeight')"/>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item
                :prop="`oxidationDetailDtos.${index}.ofmixtureWeight`"
                :rules="{ required: true, message: '请输入混合料重量', trigger: 'change' }"
                label="混合料重量"
                style="width:50%"
              >
                <GetValByInput :disabled="$route.query.wipStorageStatus == 1" :refModel="item" paramName="ofmixtureWeight" @input="regPositiveNumber(item,'ofmixtureWeight')"/>
              </el-form-item>
            </el-col>

            <el-col :span="24" style="display:flex">
              <el-form-item
                :prop="`oxidationDetailDtos.${index}.equipmentCode`"
                :rules="{ required: true, message: '请输入氧化设备号', trigger: 'change' }"
                label="氧化设备号"
                style="width:50%"
              >
                <CodeScanner  :disabled="$route.query.wipStorageStatus == 1" ref="CodeScanner" v-model="item.equipmentCode" :placeholder="'请扫描或输入'" @has-done="scanBack(item.equipmentCode,index)"/>
              </el-form-item>

              <el-form-item
                :prop="`oxidationDetailDtos.${index}.putInPosition`"
                :rules="{ required: true, message: '请选择放入位置', trigger: 'change' }"
                label="放入位置"
                style="width:50%"
              >
                <el-radio-group v-model="item.putInPosition" :disabled="$route.query.wipStorageStatus == 1" size="mini" class="putInPositionGrid" style="width:100%;" @change="scanBack(item.equipmentCode,index)">
                  <div v-for="(item2,index2) in putInPositionMap" :key="index2" style="">
                    <el-radio :disabled="item2.disabled"  :label="item2.name" border>{{ item2.name }}</el-radio>
                  </div>
                </el-radio-group>
              </el-form-item>
            </el-col>

            <!-- 出站表单项 -->
            <template v-if="$route.query.wipStorageStatus == 1 ">
              <el-col :span="24" style="display:flex">
                <el-form-item
                  :prop="`oxidationDetailDtos.${index}.oxidizedWeight`"
                  :rules="{ required: true, message: '请输入氧化后料重量', trigger: 'change' }"
                  label="氧化后料重量"
                  style="width:50%"
                >
                  <GetValByInput :disabled="$route.query.wipStorageStatus == 0" :refModel="item" paramName="oxidizedWeight" @input="regPositiveNumber(item,'oxidizedWeight')"/>
                </el-form-item>

                <el-form-item
                  :prop="`oxidationDetailDtos.${index}.oxidizedQuartzBoatWeight`"
                  label="氧化后舟重量"
                  style="width:50%"
                >
                  <GetValByInput :disabled="$route.query.wipStorageStatus == 0" :refModel="item" paramName="oxidizedQuartzBoatWeight" @input="regPositiveNumber(item,'oxidizedQuartzBoatWeight')"/>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item
                  :prop="`oxidationDetailDtos.${index}.oxidationCompletion`"
                  :rules="{ required: true, message: '请选择氧化完成度', trigger: 'change' }"
                  label="氧化完成度"
                >
                  <el-select :disabled="$route.query.wipStorageStatus == 0" v-model="item.oxidationCompletion" clearable style="width:100%">
                    <el-option v-for="(item,index) in oxidationCompletionMap" :key="index" :label="item.name" :value="item.name"/>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col v-if="item.oxidationCompletion==='黑'" :span="12">
                <el-form-item
                  :prop="`oxidationDetailDtos.${index}.reworkWeight`"
                  :rules="{ required: true, message: '请输入返工重量', trigger: 'blur' }"
                  label="返工重量"
                >
                  <el-input-number v-model="item.reworkWeight" :min="0" @focus="$event.target.select()" :controls="false"/>
                </el-form-item>
              </el-col>

            </template>
          </div>
        </el-row>

        <el-button v-if="$route.query.wipStorageStatus == 0"  class="block-btn" type="primary" plain @click="detailForm.oxidationDetailDtos.push({})"><i class="el-icon-plus"/>新增石英舟</el-button>
        <br>
      </el-form>
    </div>

    <!-- 其他备注、照片部分 -->
    <div class="fromCard">
      <div class="headLine">
        <div class="headLine-title">其他</div>
        <div class="headLine-tip"></div>
      </div>
      <el-form
        :inline="false"
        class="main-wrap"
        label-width="90px"
      >
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
import * as Api from '@/api/oxidize/oxidize.js'
import { inStation, outStation } from "@/api/overStation/overStation.js";
import CodeScanner from "@/components/CodeScanner";
import PhotoNew from "@/views/components/photoNew.vue";
import { getSeleteData } from "@/utils/select";
import { regPositiveNumber,getTimeInterval } from "@/utils/tool.js";
import GetValByInput from '@/views/components/getValByInput'

export default {
  name: 'OxidizeDetail',
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
      quartzBoatCodeMap:[],//石英舟编号下拉框数据
      oxidationCompletionMap:[],//氧化完成度下拉框数据
      putInPositionMap:[
        {name:'1'},{name:'2'},{name:'3'},{name:'4'},{name:'5'},{name:'6'},
      ],//放入位置集合

      detailForm: {
        oxidationDetailDtos:[{}],
        remarks:'',//备注
        photo:'',//照片
      }, // 页面表单
      detailInfo: {}, // 表单列表
      routeItem: undefined, //路线绑定项
      currentRoute: {}, //当前选中路线
      routeList: [], //路线列表
      routeDialog: false,
    };
  },
  created() {
    getSeleteData('oxidationCompletion',this.oxidationCompletionMap)
    getSeleteData('quartzBoatCode',this.quartzBoatCodeMap)
  },
  mounted() {
    this.init();
  },
  methods: {
    // 页面初始化
    async init() {
      let storageData = sessionStorage.getItem(
        `${this.$route.query.processingOrderCode + "YH"}`
      );
      await this.fetchBaseData(this.$route.query.processingOrderCode);
      this.setExpectedFeedingTime();
      this.fetchProcesslistAll((this.detailInfo.dataObj || {}).productCode )
      this.detailForm = this.$route.query.fromData || {
        oxidationDetailDtos:[{}],
        remarks:'',//备注
        photo:'',//照片
      }
      if (storageData) {
        let { detailForm } = JSON.parse(storageData);
        this.detailForm = detailForm;
      }
      this.detailForm.photo = this.detailForm.photo ? JSON.parse(this.detailForm.photo) : this.detailForm.photo

      this.$nextTick(() => {
        this.$refs['detailForm'].clearValidate()
      })
    },
    // 石英舟编号不能重复
    setQuartzBoatCodeStatus(){
      let hasQuartzBoatCodeItem = this.detailForm.oxidationDetailDtos.filter(item=>item.quartzBoatCode).map(item=>item.quartzBoatCode)
      console.log(hasQuartzBoatCodeItem,'hasQuartzBoatCodeItem');
      this.quartzBoatCodeMap.forEach(item=>{
        if(hasQuartzBoatCodeItem.find(val=>val===item.name)){
          item.disabled = true
        }else{
          item.disabled = false
        }
      })
    },
    // 放入位置不能重复
    // setPutInPositionStatus(){
    //   let hasPutInPositionItem = this.detailForm.oxidationDetailDtos.filter(item=>item.putInPosition).map(item=>item.putInPosition)
    //   console.log(hasPutInPositionItem,'hasPutInPositionItem');
    //   this.putInPositionMap.forEach((item,index)=>{
    //     if(hasPutInPositionItem.find(val=>val===item.name)){
    //       this.$set(this.putInPositionMap[index],'disabled',true)
    //     }else{
    //       this.$set(this.putInPositionMap[index],'disabled',false)
    //     }
    //   })
    // },
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
    // 设置预计投料时间
    setExpectedFeedingTime() {
      this.$set(this.detailInfo,'expectedFeedingTime',getTimeInterval(null,this.detailInfo.inTime))
    },
    // 加载原始数据
    async fetchBaseData(code) {
      return Api.listByPage({
        processCode: "YH",
        code: code,
        page: this.page,
        rows: this.rows,
      }).then((res) => {
        this.detailInfo = res.data.rows[0] || [];
        console.log(this.$route, "this.$route");
        return;
      });
    },
    // 扫码加载氧化设备号信息回调
    scanBack(val,index) {
      this.detailForm.oxidationDetailDtos.forEach((item,itemIndex)=>{
        // 不是同一项、当前项设备号不为空、当前项目位置不为空、当前项与比较项设备号相同、当前项与比较项放入位置相同
        if(itemIndex !== index && val && this.detailForm.oxidationDetailDtos[index].putInPosition && item.equipmentCode === val && this.detailForm.oxidationDetailDtos[index].putInPosition === this.detailForm.oxidationDetailDtos[itemIndex].putInPosition){
          this.detailForm.oxidationDetailDtos[index].putInPosition = undefined
          this.$message.warning('同一个氧化设备，放入的位置不能重复')
        }
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
          `${this.$route.query.processingOrderCode + "YH"}`,
          JSON.stringify(saveData)
        );
        this.$message.success("保存成功");
        this.$router.push("/oxidize");
      }

      if (typeName === "提交") {
        // 校验
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
                `${this.$route.query.processingOrderCode + "YH"}`
              );
              this.$router.push("/oxidize");
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
                `${this.$route.query.processingOrderCode + "YH"}`
              );
              this.$router.push("/oxidize");
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
.putInPositionGrid{
  display: grid;
  grid-template-columns: repeat(3, minmax(40px, 1fr));
  grid-gap: 10px;
  padding: 5px;
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

.el-input-number {
  width: 100%;
}
</style>
