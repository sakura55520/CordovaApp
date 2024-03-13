<!--工序3-2详情-->
<template>
  <div class="detailBox">

    <!-- 顶部信息卡片 -->
    <div class="topInfoCard">
      <!-- body -->
      <div :class="'grid-container'">
        <div class="grid-item">
          <span class="grid-item-name">籽晶编号：</span>
          <span class="grid-item-value">
            <span>{{ detailForm.uniqueCode }}</span>
          </span>
        </div>
        <div class="grid-item">
          <span class="grid-item-name">订单号：</span>
          <span class="grid-item-value">{{ detailForm.planOrderNo }}</span>
        </div>
        <div class="grid-item">
          <span class="grid-item-name">产品名称：</span>
          <span class="grid-item-value">{{ detailForm.materialName }}</span>
        </div>
        <div class="grid-item">
          <span class="grid-item-name">类型：</span>
          <span class="grid-item-value">{{ detailForm.materialType }}</span>
        </div>
      </div>
    </div>

    <!-- 其他表单卡片 -->
    <div class="fromCard">
      <div class="fromCard">
        <div class="headLine">
          <div class="headLine-title">录入工序数据</div>
        </div>
        <el-form ref="detailForm" :model="detailForm" label-width="150px" :rules="rules" style="padding: 0 10px 0 0;">
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
            <el-col :span="24">
              <el-form-item label="表面状态描述" prop="description">
                <el-input
                  v-model="detailForm.description"
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
      <el-button class="submit" type="primary" @click="handle('提交')">提交</el-button>
    </div>
  </div>
</template>

<script>
import * as Api from '@/api/process3-2'
import {outStation} from "@/api/trendsform/trendsform";
import {getCurrentWipStorageData} from "@/api/overStation/overStation";
import CodeScanner from "@/components/CodeScanner.vue";
import PhotoNew from "@/views/components/photoNew.vue";
import SelectUserinfo from "@/components/select_userinfo.vue";

const defaultForm = {
  operatorName: null, // 清理操作人
  operatorId: null,
  description: null, // 备注
  attachment: null // 附件
}

export default {
  name: 'process3-2Detail',
  components: {SelectUserinfo, PhotoNew, CodeScanner},
  data() {
    return {
      detailForm: Object.assign({}, defaultForm),
      rules: {
        operatorName: [{ required: true, message: '必选项', trigger: 'change' }],
      },
      disabled: true,
      imageList: [],
      detailInfo: {},
    }
  },
  created() {
    this.init()
  },
  methods: {
    // 页面初始化
    init() {
      this.reset()
      const { processingOrderCode } = this.$route.query
      if (processingOrderCode) {
        this.fetchInfo()
      }
    },
    reset() {
      this.detailInfo = {}
    },
    // 操作
    async handle(typeName) {
      this.$refs.detailForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交当前操作数据?', '提示', {
            type: 'warning'
          }).then(res => {
            const FormData = JSON.stringify({
              ...this.detailForm,
              attachment: JSON.stringify(this.imageList)
            })
            const { processUuid, processingOrderCode } = this.$route.query
            outStation({
              flowLineLable: '', // 出站路线 为空
              param: {
                FormData
              },
              processUuid, // 当前工序唯一标识
              processingOrderCode // 工单号
            }).then(res => {
              this.$message.success('提交成功')
              this.$router.push('/process3-2')
            })
          })
        }
      })
    },
    outStation(data) {
      return outStation({
        equipmentCode: data.equipmentCode, // 设备号
        param: {
          FormData: JSON.stringify(data)
        },
        processUuid: this.processUuid, // 当前工序唯一标识
        processingOrderCode: data.processOrderCode // 工单号
      })
    },
    fetchInfo() {
      const { processingOrderCode } = this.$route.query
      Api.getByScan({
        processingCode: processingOrderCode,
        wipStorageStatus: 1, // 在制品状态，1：已进站，0：待进站
      }).then(res => {
        this.detailForm = Object.assign({}, defaultForm, res.data)
      })
    }
  }
}
</script>
