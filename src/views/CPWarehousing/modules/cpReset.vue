<!--装炉长晶/成品入库/重新判定-->
<template>
  <div class="detailBox">

    <!-- 顶部信息卡片 -->
    <div class="topInfoCard">
      <div class="scan-wrap">
        <CodeScanner v-model="scanCode" placeholder="请扫描晶体编号" @has-done="fetchInfo"/>
        <el-button type="primary" plain @click="openSelectOrder">选择晶体</el-button>
      </div>
      <div v-if="detailInfo.crystalNo" :class="'grid-container'">
        <div class="grid-item">
          <span class="grid-item-name">晶体编号：</span>
          <span class="grid-item-value">{{ detailInfo.crystalNo }}</span>
        </div>
        <div class="grid-item">
          <span class="grid-item-name">批次号：</span>
          <span class="grid-item-value">{{ detailInfo.lotNo }}</span>
        </div>
        <div class="grid-item">
          <span class="grid-item-name">产品信息：</span>
          <span class="grid-item-value">{{ detailInfo.productName }}</span>
        </div>
        <div class="grid-item">
          <span class="grid-item-name">规格：</span>
          <span class="grid-item-value">{{ detailInfo.spec }}</span>
        </div>
        <div class="grid-item">
          <span class="grid-item-name">晶体等级：</span>
          <span class="grid-item-value">{{ detailInfo.crystalGrade }}</span>
        </div>
        <div class="grid-item">
          <span class="grid-item-name">晶体去向：</span>
          <span class="grid-item-value">{{ detailInfo.destination }}</span>
        </div>
      </div>
    </div>

    <div class="fromCard">
      <div class="headLine">
        <div class="headLine-title">晶体判定</div>
      </div>
      <el-form ref="detailForm" :model="detailForm" label-width="140px" :rules="rules" style="padding: 0 16px;">
        <el-row>
          <el-col :span="12">
            <el-form-item label="晶体等级" prop="crystalGrade">
              <el-select v-model="detailForm.crystalGrade" style="width: 100%;">
                <el-option v-for="(item, index) in crystalGradeList" :key="index" :value="item.value" :label="item.label"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="晶体去向" prop="destination">
              <el-select v-model="detailForm.destination" style="width: 100%;">
                <el-option v-for="(item, index) in destinationList" :key="index" :value="item.value" :label="item.label"/>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="判定人" prop="updateUserName">
              <SelectUserinfo
                v-model="detailForm.updateUserName"
                :user-id.sync="detailForm.updateUserId"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="物料料号">
              <el-input v-model="materialInfo.code" disabled/>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="物料名称">
              <el-input v-model="materialInfo.name" disabled/>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input
                v-model="detailForm.remark"
                type="textarea"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="添加附件" prop="photo">
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

    <!-- 页面操作 -->
    <div class="pageHandleBox">
      <el-button class="submit" type="primary" @click="handleSubmit">提交数据</el-button>
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
import * as Api from '@/api/CPWarehousing'
import CodeScanner from "@/components/CodeScanner.vue";
import SelectOrderDialog from "./SelectOrderDialog.vue";
import {getSeleteData} from "@/utils/select";
import SelectUserinfo from "@/components/select_userinfo.vue";

const defaultForm = {
  crystalGrade: null, // 晶体等级
  updateUserName: null, // 判定人
  updateUserId: null,
  destination: null, // 晶体去向
  remark: null, // 备注
  photo: null // 附件
}
export default {
  name: 'SeedReset',
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
        crystalGrade: [{ required: true, message: '必选项', trigger: 'change' }],
        updateUserName: [{ required: true, message: '必选项', trigger: 'change' }],
        destination: [{ required: true, message: '必选项', trigger: 'change' }],
      },
      crystalGradeList: [], // 晶体等级list
      destinationList: [],
      detailInfo: {}, // 描述信息
      materialInfo: {}, // 物料信息
      scanCode: '',
      dialogVisible: false,
      processUuid: '',
      imageList: [],
      disabled:false,
    }
  },
  computed: {
    fetchMaterialParams() {
      return {
        crystalGrade: this.detailForm.crystalGrade,
        destination: this.detailForm.destination,
        lotNo: this.detailInfo.lotNo,
      }
    },
  },
  watch: {
    fetchMaterialParams(params) {
      // 查询物料信息
      // 参数不能为空
      this.materialInfo = {}
      for (const field in params) {
        if (!params[field]) return
      }
      Api.getMaterialModel(params).then(res => {
        this.materialInfo = res.data || {}
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


      getSeleteData('crystalGrade', this.crystalGradeList) // 晶体等级list
      getSeleteData('packDestination', this.destinationList) // 晶体去向list
    },
    reset() {
      this.detailInfo = {}
      this.materialInfo = {}
      this.detailForm = Object.assign({}, defaultForm)
      this.imageList = []
      this.$nextTick(() => {
        this.$refs.detailForm.clearValidate()
      })
    },
    // 操作
    handleSubmit() {
      if (!this.detailInfo.crystalNo) return this.$message.error('晶体编号为空, 请扫描晶体编号!')
      this.$refs.detailForm.validate(async (valid) => {
        if (valid) {
          const form = {
            ...this.detailForm,
            lotNo: this.detailInfo.lotNo
          }
          form.photo = JSON.stringify(this.imageList)
          Api.updateFinishedProductInfo(form).then(res => {
            this.$message.success('提交成功!')
            this.reset()
          })
        }
      })
    },
    fetchInfo() {
      const crystalNo = this.scanCode
      if (!crystalNo) return

      // 根据晶体编号查询详情
      this.scanCode = ''
      Api.listByPage({
        search_EQ_crystalNo: crystalNo,
        search_EQ_status: '待入库',
      }).then(res => {
        const { rows } = res.data
        if (!rows || !rows.length) return this.$message.info(`${crystalNo} 未查到晶体信息!`)
        this.detailInfo = rows[0]
      })
    },
    openSelectOrder() {
      this.dialogVisible = true
    },
    handleSelectOrder(row) {
      this.detailInfo = row
    }
  }
}
</script>
