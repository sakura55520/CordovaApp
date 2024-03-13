<!--工序2-2详情-->
<template>
  <div class="detailBox">

    <!-- 顶部信息卡片 -->
    <div class="topInfoCard">
      <div class="scan-wrap">
        <CodeScanner v-model="scanCode" placeholder="请扫描籽晶编号" @has-done="fetchInfo"/>
<!--        <el-button type="primary" plain @click="openSelectOrder">选择工单</el-button>-->
      </div>
      <div :class="'grid-container'">
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
        <el-form ref="detailForm" :model="detailForm" label-width="150px" :rules="rules" style="padding: 0 16px;">
          <el-row>
            <el-col :span="12">
              <el-form-item label="清理操作人" prop="operatorName">
                <SelectUserinfo
                  v-model="detailForm.operatorName"
                  :userId.sync="detailForm.operatorId"
                  style="width: 100%;"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="检验结果" prop="result">
                <el-select v-model="detailForm.result" style="width: 100%;" @change="handleResultChange">
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
            <el-col v-if="detailForm.result === '报废'" :span="24">
              <el-form-item label="报废片是否完整" prop="intact">
                <el-radio-group v-model="detailForm.intact">
                  <el-radio label="完整报废片"/>
                  <el-radio label="非完整报废片"/>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="异常原因" prop="exception">
                <el-input
                  v-model="detailForm.exception"
                  type="textarea"
                  placeholder="返工/降级时，需填写"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注">
                <el-input
                  v-model="detailForm.remark"
                  type="textarea"
                  placeholder=""
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
import * as Api from '@/api/process2-2'
import CodeScanner from "@/components/CodeScanner.vue";
import SelectOrderDialog from "@/views/process2-2/modules/SelectOrderDialog.vue";
import {getSeleteData} from "@/utils/select";
import {outStation} from "@/api/trendsform/trendsform";
import {getCurrentWipStorageData} from "@/api/overStation/overStation";
import SelectUserinfo from "@/components/select_userinfo.vue";

const defaultForm = {
  operatorName: null, // 清理操作人
  operatorId: null,
  result: null, // 检验结果
  checkLevel: null, // 检验等级
  intact: null, // 报废片是否完整
  exception: null, // 异常原因
  remark: null, // 备注
  attachment: null // 附件
}
export default {
  name: 'process2-2Detail',
  components: {
    SelectUserinfo,
    SelectOrderDialog,
    CodeScanner,
    PhotoNew
  },
  data() {
    return {
      detailForm: Object.assign({}, defaultForm),
      rules: {
        operatorName: [{ required: true, message: '必选项', trigger: 'change' }],
        result: [{ required: true, message: '必选项', trigger: 'change' }],
        checkLevel: [{ required: false, message: '必选项', trigger: 'change' }],
        intact: [{ required: true, message: '必选项', trigger: 'change' }],
        exception: [{ required: false, message: '必选项', trigger: 'blur' }],
      },
      resultList: [
        { value: '合格', label: '合格' },
        { value: '降级', label: '降级' },
        { value: '退料', label: '退料' },
        { value: '报废', label: '报废' },
        { value: '返工', label: '返工' },
      ],
      disabled: false,
      checkLevelList: [],
      detailInfo: {}, // 描述信息
      scanCode: '',
      dialogVisible: false,
      processUuid: '',
      imageList: [],
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
              this.$router.push('/process2-2')
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
      if (!res.data) return this.$message.info(`${processingCode} 不是工序2-2已进站状态!`)

      this.detailInfo = res.data
      this.detailForm.checkLevel = this.detailInfo.materialLevel
    },
    openSelectOrder() {
      this.dialogVisible = true
    },
    handleSelectOrder(row) {
      this.detailInfo = row
    },
    handleResultChange(result) {
      if (result !== '报废') {
        this.detailForm.intact = null
      }
    }
  }
}
</script>
