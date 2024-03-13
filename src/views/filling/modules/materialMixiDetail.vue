<!--配料装埚-->
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
          <!-- <img src="@/assets/imgs/frame.png" alt=""> -->
        </div>
        <!-- body -->
        <div :class="'grid-container'" v-if="detailInfo.dataObj">
          <div class="grid-item">
            <span class="grid-item-name">生产批号&nbsp;&nbsp;</span>
            <span class="grid-item-value">{{ detailInfo.dataObj.productionBatchNo }}</span>
          </div>
          <div class="grid-item">
            <span class="grid-item-name">产品名称&nbsp;&nbsp;</span>
            <span class="grid-item-value">{{ detailInfo.dataObj.productName }}</span>
          </div>
          <div class="grid-item">
            <span class="grid-item-name">产品配方&nbsp;&nbsp;</span>
            <span class="grid-item-value">{{ detailInfo.dataObj.productBomName }}</span>
          </div>
          <div class="grid-item">
            <span class="grid-item-name">创建时间&nbsp;&nbsp;</span>
            <span class="grid-item-value">{{ detailInfo.processGmtCreate }}</span>
          </div>
          <div class="grid-item">
            <span class="grid-item-name">预计投料时间&nbsp;&nbsp;</span>
            <span class="grid-item-value">{{ detailInfo.expectedFeedingTime }}</span>
          </div>
          <div class="grid-item">
            <span class="grid-item-name">创建人：</span>
            <span class="grid-item-value">{{ detailInfo.processUserCreate }}</span>
          </div>
        </div>
    </div>
    <!-- 其他表单卡片 -->
    <!-- card1 -->
    <template v-if="isShowMoreInfo">
      <div class="fromCard">
        <div class="headLine">
          <div class="headLine-title" style="color: #409eff;">产品BOM</div>
          <div class="headLine-tip">总数量：{{ bomList.productBomTypeDtos[0].number }}（{{bomList.productBomTypeDtos[0].productBomDetailDtos[0] ? bomList.productBomTypeDtos[0].productBomDetailDtos[0].unit : ''}}）</div>
        </div>
        <div class="main-wrap">
          <el-table :data="bomList.productBomTypeDtos[0].productBomDetailDtos">
            <el-table-column prop="materialCode" label="物料料号"/>
            <el-table-column prop="materialName" label="物料名称"/>
            <el-table-column prop="unit" label="单位"/>
            <el-table-column prop="numberBounds" label="标准范围"/>
            <el-table-column prop="number" label="投料数量"/>
          </el-table>
        </div>
        <br>
      </div>

      <div class="fromCard">
        <div class="headLine">
          <div class="headLine-title">工艺配方</div>
          <div class="headLine-tip"></div>
        </div>
        <div class="main-wrap">
          <el-table :data="processlist">
            <el-table-column prop="param" label="工艺参数"/>
            <el-table-column prop="value" label="工艺值"/>
          </el-table>
        </div>
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
        <div class="headLine-title" style="color: #E6A23C;">已锁定混合料库存，请确认是否投入使用</div>
        <!-- <div class="headLine-tip"> <el-button size="mini" style="background-color: #E6A23C;color: #FFF;">取消锁定</el-button> </div> -->
      </div>
      <div class="main-wrap">
        <el-table :data="materiaReturnlist">
          <el-table-column prop="code" label="批次号"/>
          <el-table-column prop="position" label="存放货位"/>
          <el-table-column prop="number" label="可用库存"/>
          <el-table-column prop="lockNumber" label="锁定库存">
            <template slot-scope="scope">
              {{ scope.row.lockNumber }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <div class="fromCard" :style="this.bomList.productBomTypeDtos[0].productBomDetailDtos.length < 1 ? 'pointer-events: none;':''">
      <div class="headLine">
        <div class="headLine-title">生产配料</div>
        <div class="headLine-tip"></div>
      </div>
      <el-form ref="detailForm" :model="detailForm" class="main-wrap" label-width="110px">

        <!--    遍历桶列表    -->
        <div v-for="(item,index) in detailForm.barrelList" :key="index" class="barrelList">
          <div class="barrelListHeadLine">
            <div class="barrelListHeadLine-title"> <el-tag size="mini">{{ index+1 }}</el-tag> </div>
            <div class="barrelListHeadLine-tip">
              <el-button type="danger" size="mini" @click="detailForm.barrelList.splice(index,1)">删除</el-button>
            </div>
          </div>
          <div>
            <el-row :gutter="16">
              <el-col :span="12">
                <el-form-item
                  label="料桶编号"
                  :prop="`barrelList.${index}.bucketNo`"
                  :rules="{ required: true, message: '请选择料桶编号', trigger: 'change' }"
                >
                  <el-select v-model="item.bucketNo" placeholder="请选择" style="width: 100%;" clearable>
                    <el-option v-for="(item,index) in bucketNoMap" :key="index" :label="item.name" :value="item.value"/>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="滚磨机编号"
                  :prop="`barrelList.${index}.equipmentCode`"
                  :rules="{ required: true, message: '请选择滚磨机编号', trigger: 'change' }"
                >
                  <el-select v-model="item.equipmentCode" placeholder="请选择" style="width: 100%;" clearable>
                    <el-option v-for="(item,index) in potMillMap" :key="index" :label="item.name" :value="item.code"/>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="物料信息" style="width: 100%">
              <CodeScanner ref="CodeScanner" v-model="item.scanCode" :placeholder="'请扫描或输入物料批次号'" @has-done="scan(index,item)"/>
            </el-form-item>
            <el-table :data="item.bomList">
              <el-table-column prop="batchNo" label="物料批次号"/>
              <el-table-column prop="materialModelName" label="物料名称"/>
              <el-table-column prop="materialModelCode" label="物料料号"/>
              <el-table-column prop="number" label="重量g">
                <template slot-scope="scope">
                  <GetValByInput
                    :refModel="scope.row"
                    paramName="_number_g"
                    placeholder="请输入"
                    @input="regPositiveNumber(scope.row,'_number_g')"
                    @change="setMateriaReturnListNumber(scope.row)"
                  />
                  <i>{{ scope.row.number }} kg</i>
                </template>
              </el-table-column>
              <el-table-column fixed="right" label="操作" width="90">
                <template slot-scope="scope">
                  <el-button type="danger" size="mini" @click="deleteMateriaBomListItem(index,scope.$index,scope.row)">
                    <i class="el-icon-delete"></i>
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <el-button class="block-btn" type="primary" plain @click="detailForm.barrelList.push({scanCode:'',bomList:[]})"><i class="el-icon-plus"/>添加桶</el-button>
        <br>
      </el-form>
    </div><br/>

    <el-form :model="detailForm" label-width="100px"  :style="this.bomList.productBomTypeDtos[0].productBomDetailDtos.length < 1 ? 'pointer-events: none;':''">
      <div class="fromCard">
        <div class="headLine">
          <div class="headLine-title">其他</div>
          <div class="headLine-tip"></div>
        </div>
        <el-row style="margin-top: 10px;">
          <el-col :span="24">
            <el-form-item label="备注" prop="remarks">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入内容"
                v-model="detailForm.remarks">
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
      </div>
    </el-form>

    <!-- 页面操作 -->
    <div class="pageHandleBox">
      <el-button class="save" @click="handle('保存')">保存</el-button>
      <el-button class="submit" type="primary" @click="handle('提交')">{{ this.$route.query.wipStorageStatus == 0 ? '进站': '出站'}}</el-button>
    </div>

    <el-dialog title="物料选择" v-if="materialDialogVisible" :visible.sync="materialDialogVisible" width="90%" :before-close="handleMaterialDialogClose">
      <el-table
        ref="multipleTable"
        :data="materialDialogList"
        tooltip-effect="dark"
        style="width: 100%"
        row-key="id"
        @selection-change="handleMaterialListSelectionChange">
        <el-table-column type="selection" reserve-selection width="60" fixed/>
        <el-table-column prop="batchNo" label="批次号" width="140" fixed/>
        <el-table-column prop="materialModelCode" label="物料料号" width="140"/>
        <el-table-column prop="materialModelName" label="物料名称" width="160"/>
        <el-table-column prop="materialCategoryName" label="物料类别" width="160"/>
        <el-table-column prop="materialTypeName" label="物料类型" width="160"/>
        <el-table-column prop="uniqueCode" label="物料条码(唯一码)" width="160"/>
        <el-table-column prop="batchNo" label="批次号" width="160"/>
        <el-table-column prop="supplier" label="供应商" width="140"/>
        <el-table-column prop="specification" label="规格" width="140"/>
        <el-table-column prop="materialTh" label="图号" width="140"/>
        <el-table-column prop="materialXh" label="型号" min-width="140"/>
        <el-table-column prop="warehouseName" label="库位" width="140"/>
        <el-table-column prop="quantity" label="库存" width="80" fixed="right"/>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button class="cancle" @click="handleMaterialDialogClose">取 消</el-button>
        <el-button class="submit" type="primary" @click="handleConfirmMaterial">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="请选择路线" :visible.sync="routeDialog" width="50%" :before-close="closeRouteDialog">
      <el-radio-group v-model="routeItem" style="width: 100%;">
        <el-radio v-for="(item,index) in routeList" :key="index" class="bodyBox-list-radio" :label="item.label" border @click.native="handleCloseRoute(item,index)">{{item.label}}</el-radio>
      </el-radio-group>
      <span slot="footer" class="dialog-footer">
        <el-button class="cancle" @click="closeRouteDialog">取 消</el-button>
        <el-button class="submit" type="primary" @click="handle('提交',currentRoute.label)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as Api from '@/api/filling/filling.js'
import {inStation,outStation} from '@/api/overStation/overStation.js'

import CodeScanner from '@/components/CodeScanner';
import GetValByInput from '@/views/components/getValByInput'
import PhotoNew from "@/views/components/photoNew.vue";
import { getSeleteData } from "@/utils/select";
import { regPositiveNumber, getAfterTimeByMinute } from "@/utils/tool.js";
import {equipmentListByPage} from "@/api/eqp";

export default {
  name: 'MaterialMixiDetail',
  components:{
    CodeScanner,
    PhotoNew,
    GetValByInput
  },
  data() {
    return {
      regPositiveNumber,
      page:1,
      rows:10,
      scanCode:'',
      isShowMoreInfo:true,
      detailForm:{
        barrelList:[{scanCode:'',bomList:[]}]
      }, // 描述信息
      detailInfo:{}, // 表单列表
      bomList:{productBomTypeDtos:[{productBomDetailDtos:[]}]}, // BOM列表
      processlist:[], // 配方列表
      materiaReturnlist:[],//退料列表
      imageList:[], // 图片列表
      bucketNoMap:[], // 料桶编号下拉框数据源
      potMillMap:[], //滚磨机列表下拉框数据源
      barreIndex:undefined,//当前操作的桶索引
      materialDialogVisible:false,//选择物料弹窗
      materialDialogList:[], //选择物料弹窗列表
      materialDialogSelectItems:[],//物料弹窗列表当前选中项
      bomFirstTotalWeight:undefined, //记录第一次BOM的总重量，避免重新更新BOM数据时总重量被覆盖

      routeItem:undefined,//路线绑定项
      currentRoute:{},//当前选中路线
      routeList:[],//路线列表
      routeDialog:false

    }
  },
  created(){
    getSeleteData('bucketNo',this.bucketNoMap)
    this.getEquipmentList()
  },
  mounted() {
    this.init()
  },
  methods: {
    // 页面初始化
    async init(){
      let storageData = sessionStorage.getItem(`${this.$route.query.processingOrderCode+'PLZG'}`)
      if(storageData){
        let {
          detailInfo,
          bomList,
          processlist,
          materiaReturnlist,
          bomFirstTotalWeight,
          detailForm
        } = JSON.parse(storageData)
        this.detailInfo = detailInfo
        this.bomList = bomList
        this.processlist = processlist
        this.materiaReturnlist = materiaReturnlist
        this.detailForm = detailForm
        this.bomFirstTotalWeight = bomFirstTotalWeight
      }else{
        await this.fetchBaseData(this.$route.query.processingOrderCode)
        this.setExpectedFeedingTime()
        await this.getBomInfoByMaterialCode((this.detailInfo.dataObj || {}).productCode)
        if(this.bomList.productBomTypeDtos[0].productBomDetailDtos.length<1) return
        this.fetchProcesslistAll((this.detailInfo.dataObj || {}).productCode )
        this.fetchMateriaReturnlistAll((this.detailInfo.dataObj || {}).productBomId)
      }
      this.detailForm.photo = this.detailForm.photo ? JSON.parse(this.detailForm.photo) : this.detailForm.photo
    },
    closeRouteDialog(){
      this.routeDialog = false
    },
    // 设置预计投料时间
    setExpectedFeedingTime(){
      let expectedFeedingTime = []
      getSeleteData('expectedFeedingTime',expectedFeedingTime).then(()=>{
        expectedFeedingTime.forEach((item,index)=>{
          if(item.name === '配料装埚'){
              this.$set(this.detailInfo,'expectedFeedingTime',getAfterTimeByMinute(this.detailInfo.processGmtCreate,item.value))
          }
        })
      })
    },
    // 改变显示更多盒子状态
    changeMoreInfoBox(){
      this.isShowMoreInfo = !this.isShowMoreInfo
    },
    // 加载原始数据
    async fetchBaseData(code){
      return Api.listByPage({
        processCode:this.$route.query.wipStorageCode,
        code:code,
        page:this.page,
        rows:this.rows
      }).then(res=>{
        this.detailInfo = res.data.rows[0] || []
        console.log(this.$route.query,'this.$route.query');
        return
      })
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
    // 加载退料列表
    async fetchMateriaReturnlistAll(bomId){
      return Api.materiaReturnlistAll({
        search_EQ_bomId:bomId,
        search_EQ_status:2,
        search_GT_number:0,
      }).then(res=>{
        return this.materiaReturnlist = res.data || []
      })
    },
    // 加载BOM信息列表
    async getBomInfoByMaterialCode(materialCode,number){
      return Api.getBomInfoByMaterialCode({
        productBomType:'百分比',
        number:number,
        materialCode:materialCode,
        processCode:this.$route.query.wipStorageCode
      }).then(res=>{
        this.bomList = res.data || {productBomTypeDtos:[{productBomDetailDtos:[]}]}
        console.log(this.bomList,'this.bomList');
        this.setBomListNumber()

        if(!this.bomFirstTotalWeight){
          this.bomFirstTotalWeight = this.bomList.productBomTypeDtos[0].number
        }
        return
      }).catch(err=>{
        if(this.bomList.productBomTypeDtos[0].productBomDetailDtos.length<1){
          this.$message.warning('无产品BOM,该页面将不允许操作和提交')
        }
      })
    },
    // 扫码加载物料信息
    scan(barreIndex,row){
      Api.scan({
        scanCode:row.scanCode
      }).then(res=>{
        row.scanCode = undefined
        this.barreIndex = barreIndex
        this.materialDialogList = res.data || []
        this.materialDialogVisible = true
      }).catch(err=>{
        row.scanCode = undefined
      })
    },
    // 查询滚磨机设备列表
    getEquipmentList(){
      equipmentListByPage({
        page: 1,
        rows: 10000,
        search_EQ_deviceTypeName: '滚磨机',
        search_EQ_enableState: 1, // 启用状态
      }).then(res => {
        this.potMillMap = res.rows || []
      });
    },
    // 删除物料列表项
    deleteMateriaBomListItem(index,itemIndex,row){
      // 删除时判断是否是跟退料匹配的项，若是则将对应退料项锁定库存加上减去的数量，BOM列表总重量加上减去的数量；
      if(row.maxNumber){
        this.materiaReturnlist.forEach(item=>{
          if(item.code === row.batchNo){
            item.lockNumber = item.lockNumber - row.number
            let bomTotalWeight = this.bomList.productBomTypeDtos[0].number + Number(row.number)
            this.getBomInfoByMaterialCode((this.detailInfo.dataObj || {}).productCode,bomTotalWeight)
          }
        })
      }
      this.detailForm.barrelList[index].bomList.splice(itemIndex,1)
      this.setBomListNumber()
    },
    // 关闭选择物料弹窗
    handleMaterialDialogClose(){
      this.materialDialogVisible = false
      this.materialDialogList = []
      this.materialDialogSelectItems = []
    },
    // 当选择物料列表项时
    handleMaterialListSelectionChange(val){
      this.materialDialogSelectItems = val
    },
    // 当提交选中的物料列表项时
    handleConfirmMaterial(){
      //扫码获取的所有项
      let scanDataList =this.materialDialogSelectItems.map(item=>{
        return {
          ...item,
          code:item.batchNo,
          position:item.warehouseName,
          isOld:false
        }
      })
      console.log(scanDataList,'scanDataList');
      console.log(this.detailForm.barrelList[this.barreIndex].bomList,'bomList');

      // 扫码获取的有效项-批次号 && 库位 都相同，则不加入
      // let newItemList = scanDataList.filter(item1 => {
      //   return !this.detailForm.barrelList[this.barreIndex].bomList.find(item2 => item2.code === item1.code && item2.position === item1.position);
      // });
      // console.log(newItemList,'newItemList');

      // 扫码结果批次号 === 原料混合 批次号 || 扫码结果料号 === 产品BOM 料号， 则加入
      let pkmateriaReturn = scanDataList.filter(aItem => {
        return this.materiaReturnlist.some(bItem =>{
          if(bItem.code === aItem.code){
            aItem.maxNumber = bItem.number //设置最大数量阈值
          }
          if(bItem.code === aItem.code){
            aItem.isOld = true
          }
          return  bItem.code === aItem.code
        }) || this.bomList.productBomTypeDtos[0].productBomDetailDtos.some(cItem => {
          if(cItem.materialCode === aItem.materialModelCode){
            aItem.numberBounds = cItem.numberBounds
          }
          return cItem.materialCode === aItem.materialModelCode
        });
      });
      console.log(pkmateriaReturn,'pkmateriaReturn');
      // 赋值给最终的表单bom列表
      pkmateriaReturn.forEach(item=>{
        this.detailForm.barrelList[this.barreIndex].bomList.push(item)
      })
      this.handleMaterialDialogClose()
    },
    // 填写桶对应物料数量时，同步对应批次号的退料物料锁定库存,若超过对应可用库存标红
    setMateriaReturnListNumber(row){
      // g 转换为 kg
      let kg = row._number_g / 1000
      kg = Number((kg).toFixed(4))
      this.$set(row, 'number', kg)

      if(row.number <= 0) return this.$message.error('输入数量不能小于0')

      let materiaTotalNumber = 0
      let bomNumber = 0
      this.detailForm.barrelList.forEach((item=>{
        item.bomList.forEach(item2=>{
          if(item2.batchNo === row.batchNo){
            materiaTotalNumber =Number((materiaTotalNumber || 0)+Number((item2.number || 0)))
            bomNumber =Number((bomNumber || 0)+Number((item2.number || 0)))
          }
        })
      }))
      // 如果输入的数量大于退库的锁定库存数量，则提示信息且清空输入数量重新计算
      if(row.maxNumber !== undefined  && materiaTotalNumber > row.maxNumber){
        row.number = undefined
        this.$message.error('该物料超过当前可以库存：'+row.maxNumber)
        this.setMateriaReturnListNumber(row)
        return
      }

      // 否则，同步设置退库锁定库存数量和产品BOM总重量
      this.materiaReturnlist.forEach((item,index)=>{
        if(item.code === row.batchNo){
          if((item.lockNumber || 0) < materiaTotalNumber){
            this.$set(this.materiaReturnlist[index],'isBeyond',true)
          }
          this.$set(this.materiaReturnlist[index],'lockNumber',materiaTotalNumber)
          let bomTotalWeight = Number(this.bomFirstTotalWeight || 0)  - Number(this.materiaReturnlist[index].lockNumber)
          this.getBomInfoByMaterialCode((this.detailInfo.dataObj || {}).productCode,bomTotalWeight).then(()=>{
            this.setBomListNumber()
          })
        }
      })
      this.setBomListNumber()
    },
    setBomListNumber(){
      // 设置Bom列表的数量
      this.bomList.productBomTypeDtos[0].productBomDetailDtos.forEach(item=>{
        item.number = 0
      })
      let A = this.bomList.productBomTypeDtos[0].productBomDetailDtos
      let B = []
      this.detailForm.barrelList.forEach((item)=>{
        item.bomList.forEach((item2)=>{
          if(item2.maxNumber === undefined){
            B.push(item2)
          }
        })
      })
      for (let i = 0; i < A.length; i++) {
        let sum = 0;
        for (let j = 0; j < B.length; j++) {
          console.log(B[j].materialModelCode , A[i].materialCode,'B,A');

          if (B[j].materialModelCode === A[i].materialCode) {
            sum += Number(B[j].number || 0)
          }
        }
        // this.$set(A[i],'number')
        A[i].number = Number(A[i].number || 0) +  Number(sum)
      }
    },
    // 操作
    async handle(typeName='',flowLineLable){
      if(this.bomList.productBomTypeDtos[0].productBomDetailDtos.length<1) return this.$message.warning('无产品BOM,该页面将不允许操作和提交')
      if(typeName === '保存'){
        let {
          detailInfo,
          bomList,
          processlist,
          materiaReturnlist,
          bomFirstTotalWeight,
          detailForm
        } = this
        let saveData = {
          detailInfo,
          bomList,
          processlist,
          materiaReturnlist,
          bomFirstTotalWeight,
          detailForm
        }
        sessionStorage.setItem(`${this.$route.query.processingOrderCode+'PLZG'}`,JSON.stringify(saveData))
        this.$message.success('保存成功')
        this.$router.push('/filling')
      }
      if(typeName === '提交'){
        // 校验
        const valid = await this.$refs['detailForm'].validate()
        if (!valid) return

        // 记录超标项
        let beyondItem = []
        let materiaBomItems = []
        this.detailForm.barrelList.forEach(item1=>{
          item1.bomList.forEach(item2=>{
            materiaBomItems.push(item2)
          })
        })
        this.bomList.productBomTypeDtos[0].productBomDetailDtos.forEach(item=>{
          materiaBomItems.forEach(item2=>{
            if(item.materialCode === item2.materialModelCode){
              const minNumber = Number(item.numberBounds.split('~')[0])
              const maxNumber = Number(item.numberBounds.split('~')[1])
              if(Number(item.number) > maxNumber || Number(item.number) < minNumber){
                beyondItem.push({...item})
              }
            }
          })
        })
        beyondItem = Array.from(new Set(beyondItem.map(item => item.id))).map(id => beyondItem.find(item => item.id === id));


        // 配置提交数据
        let barrelListAll = []
        this.detailForm.barrelList.forEach(item1=>{
          item1.bomList.forEach(item2=>{
            barrelListAll.push({
              newMaterial:true,// 是否为新料
              batchCode:item2.batchNo,//批次号
              bounds:item2.numberBounds, //标准范围
              bucketNo:item1.bucketNo,// 料桶编号
              equipmentCode:item1.equipmentCode, // 设备编号
              materialCode:item2.materialModelCode, // 物料料号
              materialId:item2.id, //物料id
              materialName:item2.materialModelName, //物料名称
              number:item2.number, // 数量
              unit:item2.unitName, //单位
              isOld:item2.isOld, //是否为旧料
              warehouseId:item2.warehouseId,//库位id
            })
          })
        })
        let params = {
          batchCode:this.detailInfo.code,
          bomCode:this.bomList.bomCode,
          bomId:this.bomList.id,
          bomName:this.bomList.bomName,
          callTime:this.detailInfo.processGmtCreate,
          expectedFeedingTime:this.detailInfo.expectedFeedingTime,
          remarks:this.detailForm.remarks,
          photo:this.detailForm.photo,
          zgRawMaterialsMixDetailDtos:barrelListAll
        }
        // 根据是否超标提示提交
        if(beyondItem.length>0){
          let text = ``
          beyondItem.forEach((item,index)=>{
            text = text+`${beyondItem[index].materialName} ：${beyondItem[0].materialCode}总重量  ：${beyondItem[index].number}${beyondItem[index].unit}，不在标准范围:${beyondItem[index].numberBounds}${beyondItem[index].unit}内；`
          })
          this.$confirm(text+'是否确认提交？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            // 进站
            if(this.$route.query.wipStorageStatus == 0 ){
              inStation({
                "equipmentCode": this.$route.query.deviceCode,
                "param":{
                  FormData:JSON.stringify(params)
                },
                "processUuid": this.$route.query.processUuid,
                "processingOrderCode": this.$route.query.processingOrderCode
              }).then(res=>{
                this.$message.success('进站成功')
                sessionStorage.removeItem(`${this.$route.query.processingOrderCode+'PLZG'}`)
                this.$router.push('/filling')
              }).catch((err) => {
                if(err && err.code === 201){
                  this.routeDialog = true
                  this.routeList = err.data
                }
              })
            }
            // 出站
            if(this.$route.query.wipStorageStatus == 1 ){
              outStation({
                "flowLineLable": this.$route.query.flowLineLable || flowLineLable,
                "param": {
                  FormData:JSON.stringify(params)
                },
                "processUuid": this.$route.query.processUuid,
                "processingOrderCode": this.$route.query.processingOrderCode
              }).then(res=>{
                this.$message.success('出站成功')
                sessionStorage.removeItem(`${this.$route.query.processingOrderCode+'PLZG'}`)
                this.$router.push('/filling')
              }).catch((err) => {
                if(err && err.code === 201){
                  this.routeDialog = true
                  this.routeList = err.data
                }
              })
            }
          }).catch(() => {

          })
        }else{
          // 进站
          if(this.$route.query.wipStorageStatus == 0 ){
            inStation({
              "equipmentCode": this.$route.query.deviceCode,
              "param":{
                FormData:JSON.stringify(params)
              },
              "processUuid": this.$route.query.processUuid,
              "processingOrderCode": this.$route.query.processingOrderCode
            }).then(res=>{
              this.$message.success('进站成功')
              sessionStorage.removeItem(`${this.$route.query.processingOrderCode+'PLZG'}`)
              this.$router.push('/filling')
            }).catch((err) => {
              if(err && err.code === 201){
                this.routeDialog = true
                this.routeList = err.data
              }
            })
          }
          // 出站
          if(this.$route.query.wipStorageStatus == 1 ){
            outStation({
              "flowLineLable": this.$route.query.flowLineLable || flowLineLable,
              "param": {
                FormData:JSON.stringify(params)
              },
              "processUuid": this.$route.query.processUuid,
              "processingOrderCode": this.$route.query.processingOrderCode
            }).then(res=>{
              this.$message.success('出站成功')
              sessionStorage.removeItem(`${this.$route.query.processingOrderCode+'PLZG'}`)
              this.$router.push('/filling')
            }).catch((err) => {
              if(err && err.code === 201){
                this.routeDialog = true
                this.routeList = err.data
              }
            })
          }
        }
      }
    },
    // 当选中路线时
    handleCloseRoute(row,index){
      this.currentRoute = {
        ...row,
        index
      }
    },
    // 查询列表数据
    getList(){
      let params = {

      }
      Api.getList(params).then(res=>{
        this.bomList = res.data || []
      })
    },
    // 下拉刷新
    refreshDirList(done){
      this.page = 1
      this.rows = this.page * 20
      this.fetchDirByPage(done)
    },
    // 滚动加载
    infinite(done){
      this.rows += this.page * 10
      this.fetchDirByPage(done)
    },

    // 加载数据
    async fetchDirByPage(done){
      Api._listByPage({
        page:this.page,
        rows:this.rows
      }).then(res=>{
        this.bomList = res.data.rows || []
        if (res.data && res.data.total <= this.rows) {
          return done && done(true)
        }
        done && done()
      }).catch(err=>{
        done && done(true)
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.isShowMoreInfo{
  padding: 10px;
  text-align: center;
  background-color: #40a0ff36;
  border-radius: 5px;
  margin-bottom: 15px;
  color: #409eff;
}

</style>
