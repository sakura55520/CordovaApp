<!--终检包装(操作任务)-->
<template>
  <div class="detailBox">
    <!-- 顶部信息卡片 -->
    <div class="topInfoCard">
      <!-- head -->
      <div class="headLine">
        <div>
          <span class="headLine-name">炉次号 &nbsp;&nbsp; </span>
          <span class="headLine-value">{{ detailForm.lotNo }}</span>
        </div>
      </div>
      <!-- body -->
      <div :class="'grid-container'">
        <div class="grid-item">
          <span class="grid-item-name">晶体编号：</span>
          <span class="grid-item-value">{{ detailForm.lotNo }}</span>
        </div>
        <div class="grid-item">
          <span class="grid-item-name">订单号：</span>
          <span class="grid-item-value">{{ detailForm.planOrderNo }}</span>
        </div>
        <div class="grid-item">
          <span class="grid-item-name">产品名称：</span>
          <span class="grid-item-value">{{ detailForm.productName }}</span>
        </div>
        <div class="grid-item">
          <span class="grid-item-name">产品配方：</span>
          <span class="grid-item-value">{{ detailForm.productFormula }}</span>
        </div>
        <div class="grid-item">
          <span class="grid-item-name">长晶工艺：</span>
          <span class="grid-item-value">{{ detailForm.growthCrystalProcess }}</span>
        </div>
        <div class="grid-item">
          <span class="grid-item-name">出炉时间：</span>
          <span class="grid-item-value">{{ detailForm.dischargingTime}}</span>
        </div>
      </div>
    </div>
    <From :fromData="detailForm" ref="operateFrom"></From>
    <!-- 页面操作 -->
    <div class="pageHandleBox">
      <el-button class="save" @click="saveDetail(0)">保存</el-button>
      <el-button class="submit" type="primary" @click="saveDetail(1)">提交数据</el-button>
    </div>

    <!-- 打印弹窗组件 -->
    <print-dialog
      :print-list="printList"
      :visible.sync="printVisible"
      :print-data="printData"
      @handleData="handleData"
    />
  </div>
</template>

<script>
import * as Api from '@/api/KLInitialInspection'
import * as inStation from '@/api/inStation'
import From from './from';
import PrintDialog from "@/views/components/printDialog.vue";
import {getSeleteData} from "@/utils/select";
const deflutFrom = {

}
export default {
  name: 'finalInspectionPackTash',
  components:{
    PrintDialog,
    From
  },
  data() {
    return {
      overStation:{}, // 过站信息
      activeIndex:'1',
      detailForm:{}, //保存信息
      printVisible: false,
      printList: [],
      packDestination: [],
      destination: ''
    }
  },
  computed: {
    printData() {
      const data = this.detailForm ? this.detailForm.lotNo : ''
      const list = [{
        data, // 打印基础信息
        documentMould: '坩埚拆装-终检包装-晶体品质单', // 	打印模版名称
        printNum: 1,
        type: 1 // 执行类型：0：不填充数据，1：填充数据
      }]

      const matched = this.packDestination.find(item => item.name === this.destination)
      if (matched && matched.extendValue2) {
        // 随工单
        list.push({
          data, // 打印基础信息
          documentMould: matched.extendValue2, // 	打印模版名称
          printNum: 1,
          type: 1 // 执行类型：0：不填充数据，1：填充数据
        })
      }
      return list
    }
  },
  async created(){
    //接收路由传参数据
    this.overStation = this.$route.query || {}

    getSeleteData('packDestination', this.packDestination)
  },
  mounted() {
    this.getDetail()
  },
  methods: {
    //数据处理
    async getDetail() {
      const data = sessionStorage.getItem('zlfinal' + this.overStation.processingOrderCode)
      if (data) {
        //有上次保存数据进行数据还原
        this.detailForm = JSON.parse(data)

      } else {
        //站点跳转后获取基本数据
        await Api.listByPage({search_EQ_processName:'终检包装',search_EQ_code:this.overStation.processingOrderCode,page:1,rows:10}).then(res => {
          if(res.data && res.data.rows.length > 0){
            this.detailForm = Object.assign({},deflutFrom,JSON.parse(JSON.stringify(res.data.rows[0])))
          }
        })

        const { fromData } = this.overStation
        if (fromData && typeof fromData === 'object') {
          const { centerThickness, edgeThickness } = fromData
          // 中心厚度: 取开炉初检中实测0度厚度
          this.detailForm.centerThickness = centerThickness
          // 边缘厚度: 取开炉初检中实测75度厚度
          this.detailForm.edgeThickness = edgeThickness
        }
      }

      this.$nextTick(() => {
        this.$refs.operateFrom.getDetail()
      })
    },
    //保存数据 保存到前端,提交到后端
    async saveDetail(type){
      const form = await this.$refs.operateFrom.getRules()
      const saveData = {
        ...this.detailForm,
        ...form.fromData,
        submitType: 1,
        lotNo: this.overStation.processingOrderCode
      }
      this.destination = form.fromData.destination

      if (!type) {
        // 保存
        sessionStorage.setItem('zlfinal' + this.overStation.processingOrderCode, JSON.stringify(saveData))
        this.$message.success(`保存成功`)
        this.$router.push({path: '/finalInspectionPack'})

      } else {
        // 提交
        if (!form.viod) {
          return this.$message.warning('请完善数据!')
        }
        this.generate(form.viod, saveData)
      }
    },
    //完成装料数据填写
    generate(viod,data){
      const saveData = {
        processingOrderCode:this.overStation.processingOrderCode,
        param:{'坩埚拆装_终检包装_出站':JSON.stringify(data)},
        flowLineLable:'',
        processUuid:this.overStation.processUuid
      }
      inStation.outStation(saveData).then(res => {
        this.$message.success('提交成功')
        sessionStorage.removeItem('zlfinal' + this.overStation.processingOrderCode)
        // this.$router.push({ path: '/finalInspectionPack'})

        // 打印
        this.printList = res.data
        this.printVisible = true
      })
    },
    handleData() {
      this.$router.push({ path: '/finalInspectionPack'})
    },
  }
}
</script>
