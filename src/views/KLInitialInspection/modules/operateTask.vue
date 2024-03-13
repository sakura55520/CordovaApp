<!--开炉初检(操作任务)-->
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
      </div>
    </div>

    <component
      ref="formRef"
      :is="currentComponent"
      :fromData="detailForm"
    />

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
      @handleData="back"
    />
  </div>
</template>

<script>
import * as Api from '@/api/KLInitialInspection'
import * as inStation from '@/api/inStation'
import MenuTab from '@/views/components/menuTab';
import MaterialProcessing from './materialProcessing';
import PrintDialog from "@/views/components/printDialog.vue";
import MaterialPre from "./materialPre.vue";

const deflutFrom = {}
export default {
  name: 'OperateTask',
  components: {
    PrintDialog,
    MenuTab
  },
  data() {
    return {
      overStation: {}, // 过站信息
      detailForm: {},//保存信息
      printVisible: false,
      printData: [
        {
          data: '', // 打印基础信息
          documentMould: '开炉初检-辅料条码打印', // 	打印模版名称
          printNum: 1,
          type: 1 // 执行类型：0：不填充数据，1：填充数据
        },
        {
          data: '', // 打印基础信息
          documentMould: '开炉初检-晶体生长单打印', // 	打印模版名称
          printNum: 1,
          type: 1 // 执行类型：0：不填充数据，1：填充数据
        },
      ],
      printList: [],
    }
  },
  computed: {
    currentComponent() {
      return this.detailForm.orderType === 2 ? MaterialPre : MaterialProcessing
    }
  },
  created() {
    //接收路由传参数据
    this.overStation = this.$route.query || {}
  },
  mounted() {
    this.getDetail()
  },
  methods: {
    //数据处理
    async getDetail() {
      if (!this.overStation.processingOrderCode) return this.$message.error('过站信息有误,请验证后重新操作')
      const data = sessionStorage.getItem('klcj_out_' + this.overStation.processingOrderCode)
      if (data) {
        //有上次保存数据进行数据还原
        this.detailForm = JSON.parse(data)
      } else {
        //站点跳转后获取基本数据
        await Api.listByPage({
          search_EQ_processName: '开埚初检',
          search_EQ_code: this.overStation.processingOrderCode,
          page: 1,
          rows: 10
        }).then(res => {
          if (res.data && res.data.rows.length > 0) {
            this.detailForm = Object.assign({}, deflutFrom, JSON.parse(JSON.stringify(res.data.rows[0])))
          }
        })
      }
      this.$nextTick(() => {
        // 判断是否是长晶
        this.detailForm.processingOrderCode = this.overStation.processingOrderCode

        // 查询
        this.$refs.formRef.getDetail()
      })
    },
    //保存数据 保存到前端,提交到后端
    async saveDetail(type) {
      const form = await this.$refs.formRef.getRules()
      const bol = form.viod
      const saveData = {
        ...this.detailForm,
        ...form.fromData,
        submitType: 1,
        lotNo: this.overStation.processingOrderCode
      }

      if (!type) {
        // 保存
        sessionStorage.setItem('klcj_out_' + this.overStation.processingOrderCode, JSON.stringify(saveData))
        this.$message.success(`保存成功`)
        this.$router.push({path: '/KLInitialInspection'})

      } else {
        // 提交
        if (!form.viod) {
          return this.$message.warning('请完善数据!')
        }
        this.generate(bol, saveData)
      }
    },
    //完成装料数据填写
    generate(bol, data) {
      if (bol) {
        const saveData = {
          processingOrderCode: this.overStation.processingOrderCode,
          param: {
            FormData: JSON.stringify(data),
          },
          flowLineLable: '',
          processUuid: this.overStation.processUuid
        }
        inStation.outStation(saveData).then(res => {
          this.$message.success('提交成功')
          sessionStorage.removeItem('klcj_out_' + this.overStation.processingOrderCode)

          if (res.data) {
            // 打印
            this.printList = res.data
            this.printVisible = true
            this.printData.forEach(item => {
              item.data = this.detailForm.lotNo
            })
          } else {
            this.back()
          }
        })
      }
    },
    back() {
      this.$router.push({path: '/KLInitialInspection'})
    },
  }
}
</script>

<style lang="scss" scoped>

.table-title {
  color: #409eff;
  height: 40px;
  line-height: 40px;
  font-size: 20px;
  margin: 5px 0;
  text-indent: 10px;
  background-color: #f5f5f5;
}

.crucibleCode-info {
  height: 30px;
  line-height: 30px;
  text-indent: 10px;
  margin: 2px 0;
  background-color: #b3d8ff96;
}

.topInfoCard {
  width: 100%;
  background-color: #FFF;
  margin: 10px 0px;
  padding: 0px 10px 5px 10px;

  .headLine {
    height: 40px;
    line-height: 40px;
    font-size: 18px;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgba(192, 192, 192, 0.3);

    .headLine-name {
      color: rgba(0, 0, 0, 0.7);
    }

    .headLine-value {
      color: black;
      font-weight: bold;
    }

    .headLine-tag {
      line-height: 3px;
      padding: 10px 15px;
    }
  }

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

  .menu {
    width: 100%;
    margin-bottom: 10px;
  }
}

.fromCard {
  display: flex;
  flex-direction: column;
  padding: 0px 5px 5px 5px;
  background-color: #FFF;

  .headLine {
    height: 25px;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    padding-bottom: 5px;

    .headLine-title {
      height: 20px;
      line-height: 25px;
      padding-left: 10px;
      border-left: 5px solid #409eff;
    }

    .headLine-tip {
      color: rgb(255, 185, 35);
    }
  }
}

.pageHandleBox {
  background-color: #FFF;
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
  padding: 10px;
  align-items: center;
  justify-content: space-between;

  .save {
    padding: 10px 20%;
    margin: 0px;
  }

  .submit {
    margin: 0px 10px;
    padding: 10px 20%;
  }
}

</style>
