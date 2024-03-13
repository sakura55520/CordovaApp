<!--籽晶粘贴/终检包装 详情-->
<template>
  <div class="detailBox">
    <!-- 顶部信息卡片 -->
    <div class="topInfoCard">
      <!-- body -->
      <div :class="'grid-container'">
        <div class="grid-item">
          <span class="grid-item-name">籽晶编号：</span>
          <span class="grid-item-value">
            <span>{{ detailInfo.uniqueCode }}</span>
          </span>
        </div>
        <div class="grid-item">
          <span class="grid-item-name">订单号：</span>
          <span class="grid-item-value">{{ detailInfo.planOrderNo }}</span>
        </div>
        <div class="grid-item">
          <span class="grid-item-name">产品名称：</span>
          <span class="grid-item-value">{{ detailInfo.materialName }}</span>
        </div>
        <div class="grid-item">
          <span class="grid-item-name">类型：</span>
          <span class="grid-item-value">{{ detailInfo.materialType }}</span>
        </div>
      </div>
    </div>

    <!-- 其他表单卡片 -->
    <div class="fromCard">
      <div class="fromCard">
        <div class="headLine">
          <div class="headLine-title">录入工序数据</div>
        </div>
        <el-form ref="detailForm" :model="detailForm" label-width="140px" :rules="rules" style="padding: 20px 10px 0 0;">
          <el-row>
            <el-col :span="12">
              <el-form-item label="轮廓检验" prop="contour">
                <el-input-number v-model="detailForm.contour" placeholder="请输入轮廓检验" style="width: 100%;" @change="handleContourChange"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="轮廓形状" prop="contourShape">
                <el-select v-model="detailForm.contourShape" placeholder="请选择轮廓形状" style="width: 100%;" clearable>
                  <el-option v-for="(item, index) in contourShapeList" :key="index" :value="item"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="籽晶组件等级" prop="componentLevel">
                <el-select v-model="detailForm.componentLevel" placeholder="请选择等级" style="width: 100%;">
                  <el-option v-for="(item, index) in checkLevelList" :key="index" :value="item.value" :label="item.label"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="清理确认" prop="result">
                <el-select v-model="detailForm.result" placeholder="请选择清理确认" style="width: 100%;" @change="handleResultChange">
                  <el-option v-for="(item, index) in resultList" :key="index" :value="item.value" :label="item.label"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-if="detailForm.result === '报废'" :span="24">
              <el-form-item label="报废片是否完整" prop="intact">
                <el-radio-group v-model="detailForm.intact">
                  <el-radio label="完整报废片"/>
                  <el-radio label="非完整报废片"/>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注" prop="remark">
                <el-input
                  v-model="detailForm.remark"
                  type="textarea"
                  placeholder=""
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="添加附件" prop="attachment">
                <!-- 图片 -->
                <PhotoNew
                  v-model="imageList"
                  :componentDisabled="disabled"
                  :photoNum="6"
                  :name="'CHECK_DEVICE'"
                ></PhotoNew>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>

    <!-- 页面操作 -->
    <div class="pageHandleBox">
<!--      <el-button class="save" @click="handle('保存')">保存</el-button>-->
      <el-button class="submit" type="primary" @click="handle('提交')">提交</el-button>
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
import PhotoNew from "@/views/components/photoNew.vue";
import * as Api from '@/api/seedFinalInspection'
import { getSeleteData } from '@/utils/select'
import {outStation} from '@/api/trendsform/trendsform';
import PrintDialog from "@/views/components/printDialog.vue";

const defaultForm = {
  contour: null, // 轮廓检验
  result: null, // 清理确认
  intact: null, // 报废片是否完整
  contourShape: null, // 轮廓形状
  componentLevel: null, // 籽晶组件等级
  remark: null, // 备注
  attachment: null // 附件
}
export default {
  name: 'seedFinalInspectionDetail',
  components: {
    PrintDialog,
    PhotoNew
  },
  data() {
    return {
      detailForm: Object.assign({}, defaultForm),
      rules: {
        componentLevel: [{ required: true, message: '必选项', trigger: 'change' }],
        result: [{ required: true, message: '必选项', trigger: 'change' }],
        intact: [{ required: true, message: '必选项', trigger: 'change' }],
      },
      detailInfo: {}, // 基础信息
      disabled: true,
      contourShapeList: ['凹', '凸'],
      imageList: [],
      resultList: [
        { value: '合格', label: '合格' },
        { value: '不合格', label: '不合格' },
        { value: '退料', label: '退料' },
        { value: '报废', label: '报废' },
      ],
      checkLevelList: [],
      printVisible: false,
      printList:[],
      printData: [],
    }
  },
  created() {
    this.init()
  },
  methods: {
    // 页面初始化
    init() {
      let storageData = sessionStorage.getItem(`籽晶粘贴/终检包装详情数据${this.$route.query.processingOrderCode}`)
      if (storageData) {
        let {detailForm} = JSON.parse(storageData)
        this.detailForm = Object.assign({}, defaultForm, detailForm)
      } else {
        this.detailForm = Object.assign({}, defaultForm)
      }

      this.fetchInfo() // 获取基础信息
      getSeleteData('seedCrystalLevel', this.checkLevelList) // 籽晶等级list
    },
    // 操作
    handle(typeName = '') {
      if (typeName === '保存') {
        let saveData = {
          detailForm: this.detailForm
        }
        sessionStorage.setItem(`籽晶粘贴/终检包装详情数据${this.$route.query.processingOrderCode}`, JSON.stringify(saveData))
        this.$message.success('保存成功')
        this.$router.push('/seedFinalInspection')
      } else if (typeName === '提交') {
        this.$refs.detailForm.validate(async (valid) => {
          if (!valid) return

          this.printList = []
          this.printData = []
          await this.$confirm(`请确认当前籽晶组件等级为${this.detailForm.componentLevel}级?`, '提示', {
            type: 'warning'
          })

          // 1.出站
          await this.postOut()

          // 2.打印标签
          this.printLabel()
        })
      }
    },
    postOut() {
      // 1.出站
      const FormData = JSON.stringify({
        ...this.detailInfo,
        ...this.detailForm,
        attachment: JSON.stringify(this.imageList)
      })
      const { processUuid, processingOrderCode } = this.$route.query
      return outStation({
        flowLineLable: '', // 出站路线 为空
        param: {
          FormData
        },
        processUuid, // 当前工序唯一标识
        processingOrderCode // 工单号
      }).then(res => {
        this.$message.success('提交成功')
        sessionStorage.removeItem(`籽晶粘贴/终检包装详情数据${this.detailInfo.id}`)

        // 2.打印 终检包装品质单
        this.printList = res.data
        this.printVisible = true
        this.printData.push({
          data: this.detailInfo.uniqueCode, // 打印基础信息
          documentMould: '籽晶粘贴-终检包装品质单', // 	打印模版名称
          printNum: 1,
          type: 1 // 执行类型：0：不填充数据，1：填充数据
        })
      })
    },
    printLabel() {
      Api.print({
        uniqueCodes: this.detailInfo.uniqueCode
      }).then(res => {
        // 打印
        this.printList.push(...res.data)
        this.printVisible = true
        this.printData.push({
          data: this.detailInfo.uniqueCode, // 打印基础信息
          documentMould: '籽晶粘贴-终检包装物料信息打印', // 	打印模版名称
          printNum: 1,
          type: 1 // 执行类型：0：不填充数据，1：填充数据
        })
      })
    },
    handleData() {
      this.$router.push('/seedFinalInspection')
    },
    fetchInfo() {
      Api.getByScan({
        processingCode: this.$route.query.processingOrderCode,
        wipStorageStatus: 1, // 在制品状态，1：已进站，0：待进站
      }).then(res => {
        this.detailInfo = res.data || {}
      })
    },
    // 轮廓检验在数据字典seedCrystalLevel中维护
    handleContourChange(contour) {

    },
    handleResultChange(result) {
      if (result !== '报废') {
        this.detailForm.intact = null
      }
    }
  }
}
</script>
