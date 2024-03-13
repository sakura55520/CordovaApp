<!--返工发料-->
<template>
  <div class="detailBox">
    <!-- 顶部信息卡片 -->
    <div class="topInfoCard">
      <!-- head -->
      <div class="headLine">
        <div>
          <span class="headLine-name">工单批次号 &nbsp;&nbsp; </span>
          <span class="headLine-value">{{ detailInfo.orderNo }}</span>
        </div>
        <el-tag :type="reworkMap[detailInfo.reworkProcess] || ''">{{detailInfo.reworkProcess}}返工</el-tag>
      </div>
      <!-- body -->
      <div :class="'grid-container'">
        <div class="grid-item">
          <span class="grid-item-name">产品名称：</span>
          <span class="grid-item-value">{{ detailInfo.productName }}</span>
        </div>
        <div class="grid-item">
          <span class="grid-item-name">产品配方：</span>
          <span class="grid-item-value">{{ detailInfo.productBom }}</span>
        </div>
        <div class="grid-item">
          <span class="grid-item-name">计划开始时间&nbsp;&nbsp;</span>
          <span class="grid-item-value">{{ detailInfo.planTime }}</span>
        </div>
        <div class="grid-item">
          <span class="grid-item-name">预计投料时间&nbsp;&nbsp;</span>
          <span class="grid-item-value">{{ detailInfo.expectedFeedingTime }}</span>
        </div>
      </div>
    </div>
    <!-- 其他表单卡片 -->
    <!-- card1 -->
    <div class="fromCard">
      <div class="fromCard">
        <div class="headLine">
          <div class="headLine-title">库存</div>
          <div class="headLine-tip">存在以下库存，请选择是否投入使用</div>
        </div>
        <div class="from">
          <el-table :data="inventoryList" max-height="500">
            <el-table-column label="物料批次号" prop="batchNo"/>
            <el-table-column label="物料料号" prop="materialModelCode"/>
            <el-table-column label="物料名称" prop="materialModelName"/>
            <el-table-column label="存放货位" prop="warehouseName"/>
            <el-table-column label="可用库存kg" prop="quantity"/>
            <el-table-column fixed="right" label="操作"  width="100">
              <template slot-scope="scope">
                <el-button :disabled="scope.row.disable" type="primary" size="mini" @click="onCheckinventoryItem(scope.row)">添加</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <!-- card2 -->
    <div class="fromCard">
      <div class="fromCard">
        <div class="headLine">
          <div class="headLine-title">生产发料</div>
          <div class="headLine-tip"></div>
        </div>
        <div class="from">
          <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <template v-if="detailInfo.reworkProcess === '装埚'">
              <el-form-item label="机台号" prop="equipmentCode">
                <CodeScanner v-model="form.equipmentCode" placeholder="请扫描或输入机台号" @has-done="handleEqpChange"/>
              </el-form-item>
              <el-form-item label="炉次号">
                <el-input v-trim v-model="lotNo" disabled/>
              </el-form-item>
            </template>
          </el-form>

          <CodeScanner v-model="CodeOrderNo" :placeholder="'请扫描或输入物料批次号'" @has-done="addIssuanceItem"/>
          <el-table :data="issuanceList">
            <el-table-column label="物料批次号" prop="batchNo" min-width="200"/>
            <el-table-column label="物料名称" prop="materialModelName"/>
            <el-table-column label="可用库存kg" prop="quantity"/>
            <el-table-column label="发货重量kg" min-width="200">
              <template slot-scope="scope">
                <el-input-number v-model="detailForm[scope.$index].quantity" :min="0" :max="scope.row.quantity" :precision="2" :step="0.01" style="width: 100%;"  @change="checkQuantity(scope.$index,scope.row.quantity)"/>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作"  width="100">
              <template slot-scope="scope">
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="handle('删除',scope.row,scope.$index)"/>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <!-- {{detailForm}} -->

    <!-- 页面操作 -->
    <div class="pageHandleBox">
      <el-button class="save" @click="handle('保存')">保存</el-button>
      <el-button class="submit" type="primary" @click="handle('提交')">提交</el-button>
    </div>

    <!-- 打印弹窗组件 -->
    <print-dialog
      :print-list="printList"
      :visible.sync="printVisible"
      :print-data="printData"
      num-visible
      @handleData="back"
    />
  </div>
</template>

<script>
import CodeScanner from '@/components/CodeScanner';
import * as Api from '@/api/producIssueStuff/producIssueStuff.js'
import { getSeleteData } from "@/utils/select";
import { getAfterTimeByMinute } from "@/utils/tool.js";
import { reworkMap } from '@/constants'

const defaultForm = {
  equipmentCode: null, // 机台号
}

export default {
  name: 'DirList',
  components:{
    CodeScanner,
  },
  data() {
    return {
      page:1,
      rows:0,
      detailInfo:{}, // 描述信息
      detailForm:[], // 表单列表
      form: Object.assign({}, defaultForm),
      lotNo: '',
      rules: {
        equipmentCode: [{ required: true, message: '必填项', trigger: 'change' }]
      },
      CodeOrderNo:'',
      inventoryList:[], // 库存列表
      issuanceList:[], // 发料列表
      reworkMap,
      printVisible: false,
      printData: {
        data: '', // 打印基础信息
        documentMould: '合成返工-生产发料批次号打印', // 	打印模版名称
        printNum: 1,
        type: 1 // 执行类型：0：不填充数据，1：填充数据
      },
      printList: [],
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    // 页面初始化
    init(){
      this.detailInfo = this.$route.query || {}
      let storageData = sessionStorage.getItem(`${this.detailInfo.orderNo}SCFL`)

      if(storageData){
        let { form,lotNo,detailForm,issuanceList } = JSON.parse(storageData)
        this.form = Object.assign({}, detailForm, form)
        this.lotNo = lotNo
        this.detailForm = detailForm
        this.issuanceList = issuanceList
      }
      // 请求库存
      this.getlist()

      this.setExpectedFeedingTime()
    },
    // 设置预计投料时间
    setExpectedFeedingTime(){
      let expectedFeedingTime = []
      getSeleteData('expectedFeedingTime',expectedFeedingTime).then(()=>{
        expectedFeedingTime.forEach((item,index)=>{
          if(item.name === '生产发料'){
            this.$set(this.detailInfo,'expectedFeedingTime',getAfterTimeByMinute(this.detailInfo.planTime,item.value))
          }
        })
      })
    },
    // 扫码或者输入后
    addIssuanceItem(){
      // 扫码获取的所有数据
      let scanDataList = this.inventoryList.filter(item=>item.batchNo === this.CodeOrderNo)
      // 扫码获取的有效项
      let newItemList = scanDataList.filter(item1 => {
        return !this.issuanceList.find(item2 => item2.id === item1.id);
      });
      newItemList.forEach(item=>{
        this.inventoryList.forEach(item2=>{
          if(item.id === item2.id){
            item2.disable = true
          }
        })
        this.issuanceList.push(item)
        this.detailForm.push({
          id:item.id,
          quantity:0
        })
      })
    },
    // 库存选中时
    onCheckinventoryItem(val){
      this.issuanceList.push(val)
      this.detailForm.push({
        id:val.id,
        quantity:0
      })
      val.disable = true
    },
    // 校验库存
    checkQuantity(index,quantity){
      if(this.detailForm[index].quantity > quantity){
        this.detailForm[index].quantity = 0
        this.$message.error('发货数量不能大于可以库存数量')
        return
      }
    },
    // 操作
    handle(typeName='',row,index){
      if(typeName === '删除'){
        this.inventoryList.forEach(item=>{
          row.id === item.id ? item.disable = false : ''
        })
        this.detailForm.splice(index,1)
        this.issuanceList.splice(index,1)
      }
      if(typeName === '保存'){
        let saveData = {
          form:this.form,
          lotNo:this.lotNo,
          detailForm:this.detailForm,
          issuanceList:this.issuanceList
        }
        sessionStorage.setItem(`${this.detailInfo.orderNo}SCFL`,JSON.stringify(saveData))
        this.$message.success('保存成功')
        this.$router.push('/producIssueStuff')
      }
      if(typeName === '提交'){
        // if(this.detailForm.length<1){
        //   this.$message.error('请至少选择一条数据进行发料')
        //   return
        // }
        this.$refs.form.validate(valid => {
          if (!valid) return
          Api.submit({
            ...this.form,
            orderNo:this.detailInfo.orderNo,
            storeIssues:this.detailForm,
          }).then(res=>{
            this.$message.success('提交成功')
            sessionStorage.removeItem(`${this.detailInfo.orderNo}SCFL`)

            if (res.data) {
              // 打印
              this.printList = res.data.printImage || []
              this.printVisible = true
              this.printData.data = res.data.batchNo
            } else {
              this.back()
            }
          })
        })
      }
    },
    back() {
      this.$router.push('/producIssueStuff')
    },
    // 查询原料合成返工-原料库存
    async getlist(orderNo){
      return Api.getlist({
        orderNo:orderNo || undefined,
        productBomId: this.detailInfo.productBomId,
        reworkProcess: this.detailInfo.reworkProcess
      }).then(res=>{
        this.inventoryList = res.data.map(item=>{
          return {
            ...item,
            disable:false
          }
        })
        return res.data || []
      })
    },
    handleEqpChange() {
      const { equipmentCode } = this.form
      if (!equipmentCode) return
      Api.getLotNo({
        equipmentCode
      }).then(res => {
        this.lotNo = res.data
      })
    }
  }
}
</script>


