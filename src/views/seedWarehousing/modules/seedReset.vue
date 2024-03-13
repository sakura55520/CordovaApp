<!--籽晶粘贴/成品入库/重新判定-->
<template>
  <div class="detailBox">

    <!-- 顶部信息卡片 -->
    <div class="topInfoCard">
      <div class="scan-wrap">
        <CodeScanner v-model="scanCode" placeholder="请扫描籽晶编号" @has-done="fetchInfo"/>
        <el-button type="primary" plain @click="openSelectOrder">选择籽晶</el-button>
      </div>
      <div v-if="detailInfo.uniqueCode" :class="'grid-container'">
        <div class="grid-item">
          <span class="grid-item-name">籽晶编号：</span>
          <span class="grid-item-value">{{ detailInfo.uniqueCode }}</span>
        </div>
        <div class="grid-item">
          <span class="grid-item-name">等级：</span>
          <span class="grid-item-value">{{ detailInfo.materialLevel }}</span>
        </div>
        <div class="grid-item">
          <span class="grid-item-name">物料编码(料号)：</span>
          <span class="grid-item-value">{{ detailInfo.materialCode }}</span>
        </div>
        <div class="grid-item">
          <span class="grid-item-name">产品名称：</span>
          <span class="grid-item-value">{{ detailInfo.materialName }}</span>
        </div>
        <div class="grid-item">
          <span class="grid-item-name">规格：</span>
          <span class="grid-item-value">{{ detailInfo.specification }}</span>
        </div>
        <div class="grid-item">
          <span class="grid-item-name">类型：</span>
          <span class="grid-item-value">{{ detailInfo.materialType }}</span>
        </div>
      </div>
    </div>

    <div class="fromCard">
      <div class="headLine">
        <div class="headLine-title">籽晶组件判定</div>
      </div>
      <el-form ref="detailForm" :model="detailForm" label-width="140px" :rules="rules" style="padding: 0 16px;">
        <el-row>
          <el-col :span="12">
            <el-form-item label="判定类型" prop="result">
              <el-select v-model="detailForm.result" style="width: 100%;" @change="updateLevel">
                <el-option v-for="(item, index) in resultList" :key="index" :value="item.value" :label="item.label"></el-option>
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

          <el-col v-if="scrap" :span="24">
            <el-form-item label="报废片是否完整" prop="intact">
              <el-radio-group v-model="detailForm.intact">
                <el-radio label="完整报废片"/>
                <el-radio label="非完整报废片"/>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <template v-else>
            <el-col :span="12">
              <el-form-item label="籽晶组件等级" prop="componentLevel">
                <el-select :disabled="returned" v-model="detailForm.componentLevel" style="width: 100%;">
                  <el-option v-for="(item, index) in componentLevelList" :key="index" :value="item.value" :label="item.label"/>
                </el-select>
              </el-form-item>
            </el-col>

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

            <el-col :span="12">
              <el-form-item label="类型">
                <el-input v-model="materialInfo.materialCategoryName" disabled/>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="备注" prop="determineRemark">
                <el-input
                  v-model="detailForm.determineRemark"
                  type="textarea"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="添加附件" prop="determineAttachment">
                <!-- 图片 -->
                <PhotoNew
                  v-model="imageList"
                  :componentDisabled="disabled"
                  :photoNum="6"
                  :name="'CHECK_DEVICE'"
                ></PhotoNew>
              </el-form-item>
            </el-col>
          </template>

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
import * as Api from '@/api/seedWarehousing'
import CodeScanner from "@/components/CodeScanner.vue";
import SelectOrderDialog from "./SelectOrderDialog.vue";
import {getSeleteData} from "@/utils/select";
import SelectUserinfo from "@/components/select_userinfo.vue";

const defaultForm = {
  result: null, // 判定类型
  updateUserName: null, // 判定人
  updateUserId: null,
  intact: null, // 报废片是否完整
  componentLevel: null, // 籽晶组件等级
  determineRemark: null, // 备注
  determineAttachment: null // 附件
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
        result: [{ required: true, message: '必选项', trigger: 'change' }],
        updateUserName: [{ required: true, message: '必选项', trigger: 'change' }],
        intact: [{ required: true, message: '必选项', trigger: 'change' }],
        componentLevel: [{ required: true, message: '必选项', trigger: 'change' }],
      },
      resultList: [], // 判定类型list
      componentLevelList: [],
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
    scrap() {
      return this.detailForm.result === '报废'
    },
    returned() {
      return this.detailForm.result === '退料'
    },
    fetchMaterialParams() {
      return {
        componentLevel: this.detailForm.componentLevel,
        result: this.detailForm.result,
        uniqueCode: this.detailInfo.uniqueCode,
      }
    },
  },
  watch: {
    fetchMaterialParams(params) {
      // 查询物料信息
      // 参数不能为空
      this.materialInfo = {}
      if (this.detailForm.result !== '合格') return
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


      getSeleteData('seedResetResult', this.resultList) // 判定类型list
      getSeleteData('seedCrystalLevel', this.componentLevelList) // 籽晶等级list
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
      if (!this.detailInfo.uniqueCode) return this.$message.error('籽晶编号为空, 请扫描籽晶编号!')
      this.$refs.detailForm.validate(async (valid) => {
        if (valid) {
          const form = {
            ...this.detailForm,
            uniqueCode: this.detailInfo.uniqueCode
          }
          if (this.scrap) {
            delete form.componentLevel
            delete form.determineRemark
          } else {
            delete form.intact
            form.determineAttachment = JSON.stringify(this.imageList)
          }
          Api.updateFinishedProductInfo(form).then(res => {
            this.$message.success('提交成功!')
            this.reset()
          })
        }
      })
    },
    fetchInfo() {
      const uniqueCode = this.scanCode
      if (!uniqueCode) return

      // 根据籽晶编号查询详情
      this.scanCode = ''
      Api.listByPage({
        search_EQ_uniqueCode: uniqueCode,
        search_EQ_status: '待入库',
      }).then(res => {
        const { rows } = res.data
        if (!rows || !rows.length) return this.$message.info(`${uniqueCode} 未查到籽晶信息!`)
        this.detailInfo = rows[0]
        this.updateLevel()
      })
    },
    openSelectOrder() {
      this.dialogVisible = true
    },
    handleSelectOrder(row) {
      this.detailInfo = row
      this.updateLevel()
    },
    updateLevel() {
      const { materialLevel } = this.detailInfo
      if (this.returned && materialLevel) {
        this.detailForm.componentLevel = materialLevel
      }
    }
  }
}
</script>
