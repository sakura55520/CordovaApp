<!--工序1-2详情-->
<template>
  <div class="detailBox">

    <!-- 顶部信息卡片 -->
    <div class="topInfoCard">
      <div class="scan-wrap">
        <CodeScanner v-model="scanCode" placeholder="请扫描籽晶编号" @has-done="fetchInfo"/>
        <el-button type="primary" plain @click="openSelectOrder">选择工单</el-button>
      </div>
      <div v-if="detailInfo.uniqueCode" :class="'grid-container'">
        <div class="grid-item">
          <span class="grid-item-name">籽晶编号：</span>
          <span class="grid-item-value">
            <span>{{ detailInfo.uniqueCode }}</span>
          </span>
        </div>
        <div class="grid-item">
          <span class="grid-item-name">类型：</span>
          <span class="grid-item-value">{{ detailInfo.materialType }}</span>
        </div>
        <div class="grid-item">
          <span class="grid-item-name">规格：</span>
          <span class="grid-item-value">{{ detailInfo.specification }}</span>
        </div>
        <div class="grid-item">
          <span class="grid-item-name">等级：</span>
          <span class="grid-item-value">{{ detailInfo.materialLevel }}</span>
        </div>
      </div>
    </div>

    <!-- 其他表单卡片 -->
    <div class="fromCard">
      <div class="fromCard">
        <div class="headLine">
          <div class="headLine-title">录入工序数据</div>
        </div>
        <el-form ref="detailForm" :model="detailForm" label-width="90px" :rules="rules" style="padding: 0 16px;">
          <el-row>
            <el-col :span="12">
              <el-form-item label="检验结果" prop="result">
                <el-select v-model="detailForm.result" style="width: 100%;">
                  <el-option v-for="(item, index) in resultList" :key="index" :value="item.value" :label="item.label"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="等级" prop="checkLevel">
                <el-select v-model="detailForm.checkLevel" placeholder="降级时需要选择" style="width: 100%;">
                  <el-option v-for="(item, index) in checkLevelList" :key="index" :value="item.value" :label="item.label"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="异常说明" prop="exception">
                <el-input
                  v-model="detailForm.exception"
                  type="textarea"
                  placeholder="返工/降级时，需填写"
                />
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
      <el-button class="submit" type="primary" @click="handle('提交')">提交</el-button>
    </div>

    <!--选择工单 弹窗-->
    <SelectOrderDialog
      :visible.sync="dialogVisible"
      wip-storage-status="1"
      select-type="single"
      @has-confirm="handleSelectOrder"
    />
  </div>
</template>

<script>
import PhotoNew from "@/views/components/photoNew.vue";
import * as Api from '@/api/process1-2'
import CodeScanner from "@/components/CodeScanner.vue";
import SelectOrderDialog from "@/views/process1-2/modules/SelectOrderDialog.vue";
import {getSeleteData} from "@/utils/select";
import {outStation} from "@/api/trendsform/trendsform";
import {getCurrentWipStorageData} from "@/api/overStation/overStation";

const defaultForm = {
  result: null, // 检验结果
  checkLevel: null, // 检验等级
  exception: null, // 不合格项及处理措施
  attachment: null // 附件
}
export default {
  name: 'process1-2Detail',
  components: {
    SelectOrderDialog,
    CodeScanner,
    PhotoNew
  },
  data() {
    return {
      detailForm: Object.assign({}, defaultForm),
      rules: {
        result: [{ required: true, message: '必选项', trigger: 'change' }],
        checkLevel: [{ required: false, message: '必选项', trigger: 'change' }],
        exception: [{ required: false, message: '必选项', trigger: 'blur' }],
      },
      resultList: [
        { value: '合格', label: '合格' },
        { value: '返工', label: '返工' },
        { value: '降级', label: '降级' },
      ],
      checkLevelList: [],
      detailInfo: {}, // 描述信息
      scanCode: '',
      dialogVisible: false,
      processUuid: '',
      imageList: [],
      disabled:false,
    }
  },
  watch: {
    'detailForm.result': function(result) {
      this.rules.checkLevel[0].required = result === '降级'
      this.rules.exception[0].required = result === '降级' || result === '返工'
      this.$nextTick(() => {
        this.$refs.detailForm.validate()
      })
    }
  },
  created() {
    this.init()
  },
  methods: {
    // 页面初始化
    init() {
      this.reset()
      const { processUuid, processingOrderCode } = this.$route.query
      if (processingOrderCode) {
        this.processUuid = processUuid
        this.scanCode = processingOrderCode
        this.fetchInfo()
      }


      getSeleteData('seedCrystalLevel', this.checkLevelList) // 籽晶等级list
    },
    reset() {
      this.detailInfo = {}
      this.detailForm = Object.assign({}, defaultForm)
      this.imageList = []
      this.$nextTick(() => {
        this.$refs.detailForm.clearValidate()
      })
    },
    // 操作
    handle(typeName) {
      if (typeName === '提交') {
        if (!this.detailInfo.uniqueCode) return this.$message.error('籽晶编号为空, 请扫描籽晶编号!')
        this.$refs.detailForm.validate(async (valid) => {
          if (valid) {
            // if(this.imageList.length  === 0) return this.$message.warning('请选择图片')

            // 1.根据籽晶编号查询当前在制品信息, 获取processUuid
            if (!this.processUuid) {
              const uniqueCode = this.detailInfo.uniqueCode // 籽晶编号
              const resWip = await getCurrentWipStorageData(uniqueCode)
              if (resWip.data && resWip.data[0]) {
                if (resWip.data[0].operationData !== this.$route.path) {
                  return this.$message.warning(`【${uniqueCode}】已经不再当前站点, 请刷新列表后重新操作!`)
                }
                this.processUuid = resWip.data[0].processUuid
              }
            }

            // 2.出站
            const FormData = JSON.stringify({
              ...this.detailInfo,
              ...this.detailForm,
              attachment: JSON.stringify(this.imageList)
            })
            const info = JSON.stringify(this.detailInfo)
            const { processUuid } = this.$route.query
            outStation({
              flowLineLable: '', // 出站路线 为空
              param: {
                FormData
              },
              processUuid: this.processUuid, // 当前工序唯一标识
              processingOrderCode: this.detailInfo.uniqueCode // 工单号
            }).then(res => {
              this.$message.success('提交成功')
              this.reset()
              // this.$router.push('/process1-2')
            })
          }
        })
      }
    },
    async fetchInfo() {
      const processingCode = this.scanCode
      if (!processingCode) return

      // 根据籽晶编号查询详情
      this.scanCode = ''
      const res = await Api.getByScan({
        processingCode,
        wipStorageStatus: 1, // 在制品状态，1：已进站，0：待进站
      })
      if (!res.data) return this.$message.info(`${processingCode} 不是工序1-2已进站状态!`)

      this.detailInfo = res.data
      this.detailForm.checkLevel = this.detailInfo.materialLevel
    },
    openSelectOrder() {
      this.dialogVisible = true
    },
    handleSelectOrder(row) {
      this.detailInfo = row
      this.detailForm.checkLevel = this.detailInfo.materialLevel
    }
  }
}
</script>
