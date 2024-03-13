<!--工序1-1详情-->
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
          <span class="grid-item-name">进站时间：</span>
          <span class="grid-item-value">{{ detailInfo.inTime }}</span>
        </div>
        <div class="grid-item">
          <span class="grid-item-name">停留时间：</span>
          <span class="grid-item-value">{{ detailInfo._residenceTime }}</span>
        </div>
      </div>
    </div>

    <!-- 其他表单卡片 -->
    <div class="fromCard">
      <div class="headLine">
        <div class="headLine-title">录入工序数据</div>
      </div>
      <el-form ref="detailForm" :model="detailForm" class="main-wrap" label-width="160px" :rules="rules">
        <el-row>
          <el-col :span="12">
            <el-form-item label="涂蜡工艺" prop="glueTec">
              <el-select v-model="detailForm.glueTec" style="width: 100%;">
                <el-option v-for="(item, index) in glueTecList" :key="index" :value="item.value" :label="item.label"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="涂蜡设备号" prop="glueDevice">
              <el-select v-model="detailForm.glueDevice" filterable style="width: 100%;" @change="handleGlueDeviceChange">
                <el-option v-for="(item, index) in glueDeviceList" :key="index" :value="item.code"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="加热平台编号" prop="platform">
              <el-select v-model="detailForm.platform" style="width: 100%;" @change="handlePlatformChange">
                <el-option v-for="(item, index) in platformList" :key="index" :value="item.code"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="胶水批次号" prop="glueBatch">
              <el-input v-trim v-model="detailForm.glueBatch" placeholder="请填写胶水批次号"/>
            </el-form-item>
          </el-col>
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
            <el-form-item label="不合格项及处理措施" prop="solution">
              <el-input
                v-model="detailForm.solution"
                type="textarea"
                placeholder="降级/退料时，需填写"
              />
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

    <!-- 页面操作 -->
    <div class="pageHandleBox">
      <el-button class="save" @click="handle('保存')">保存</el-button>
      <el-button class="submit" type="primary" @click="handle('提交')">提交</el-button>
    </div>
  </div>
</template>

<script>
import PhotoNew from "@/views/components/photoNew.vue";
import * as Api from '@/api/process1-1'
import { getSeleteData } from '@/utils/select'
import {outStation} from '@/api/trendsform/trendsform';
import {hoursFromNow} from '@/utils/tool'
import {equipmentListByPage} from "@/api/eqp";

const defaultForm = {
  glueTec: null, // 涂蜡工艺
  glueDevice: null, // 涂蜡设备号
  glueDeviceId: null,
  platform: null, // 加热平台编号
  platformId: null,
  glueBatch: null, // 胶水批次号
  result: null, // 检验结果
  checkLevel: null, // 检验等级
  intact: null, // 报废片是否完整
  solution: null, // 不合格项及处理措施
  remark: null, // 备注
  attachment: null // 附件
}
export default {
  name: 'process1-1Detail',
  components: {
    PhotoNew
  },
  data() {
    return {
      detailForm: Object.assign({}, defaultForm),
      rules: {
        glueTec: [{ required: true, message: '必选项', trigger: 'change' }],
        glueDevice: [{ required: true, message: '必选项', trigger: 'change' }],
        platform: [{ required: true, message: '必选项', trigger: 'change' }],
        glueBatch: [{ required: true, message: '必填项', trigger: 'blur' }],
        result: [{ required: true, message: '必选项', trigger: 'change' }],
        checkLevel: [{ required: false, message: '必选项', trigger: 'change' }],
        intact: [{ required: true, message: '必选项', trigger: 'change' }],
        solution: [{ required: false, message: '必选项', trigger: 'blur' }],
      },
      detailInfo: {}, // 基础信息
      disabled: true,
      imageList: [],
      glueTecList: [],
      glueDeviceList: [],
      platformList: [],
      resultList: [
        { value: '合格', label: '合格' },
        { value: '降级', label: '降级' },
        { value: '退料', label: '退料' },
        { value: '报废', label: '报废' },
      ],
      checkLevelList: []
    }
  },
  watch: {
    'detailForm.result': function(result) {
      this.rules.checkLevel[0].required = result === '降级'
      this.rules.solution[0].required = result === '降级' || result === '退料'
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
      let storageData = sessionStorage.getItem(`工序1-1详情数据${this.$route.query.processingOrderCode}`)
      if (storageData) {
        const { attachment, ...detailForm } = JSON.parse(storageData)
        this.detailForm = Object.assign({}, defaultForm, detailForm)
        try {
          this.imageList = JSON.parse(attachment)
        } catch (e) {}
      } else {
        this.detailForm = Object.assign({}, defaultForm)
      }

      this.fetchInfo() // 获取基础信息
      getSeleteData('process1-1glueTec', this.glueTecList) // 工艺list
      getSeleteData('seedCrystalLevel', this.checkLevelList) // 籽晶等级list
      this.fetchGlueDeviceList() // 获取涂蜡设备
      this.fetchPlatformList() // 获取加热平台
    },
    // 操作
    handle(typeName = '') {
      const FormData = JSON.stringify({
        ...this.detailInfo,
        ...this.detailForm,
        attachment: JSON.stringify(this.imageList)
      })
      if (typeName === '保存') {
        sessionStorage.setItem(`工序1-1详情数据${this.$route.query.processingOrderCode}`, FormData)
        this.$message.success('保存成功')
        this.$router.push('/process1-1')
      } else if (typeName === '提交') {
        this.$refs.detailForm.validate((valid) => {
          if (valid) {
            // if(this.imageList.length  === 0) return this.$message.warning('请选择图片')

            this.$confirm('确认提交当前操作数据?', '提示', {
              type: 'warning'
            }).then(() => {
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
                sessionStorage.removeItem(`工序1-1详情数据${this.detailInfo.id}`)
                this.$router.push('/process1-1')
              })
            })

          }
        })
      }
    },
    fetchInfo() {
      Api.getByScan({
        processingCode: this.$route.query.processingOrderCode,
        wipStorageStatus: 1, // 在制品状态，1：已进站，0：待进站
      }).then(res => {
        this.detailInfo = res.data || {}
        this.detailInfo._residenceTime = hoursFromNow(this.detailInfo.inTime)
        this.detailForm.checkLevel = this.detailInfo.materialLevel
      })
    },
    // 获取涂蜡设备
    fetchGlueDeviceList() {
      equipmentListByPage({
        search_EQ_enableState: 1, // 启用状态
        search_EQ_deviceTypeName: '涂蜡机',
        rows: 1000,
        page: 1
      }).then(res => {
        this.glueDeviceList = res.rows || []
      })
    },
    handleGlueDeviceChange(code) {
      let matched
      if (code) {
        matched = this.glueDeviceList.find(item => item.code === code)
      }
      this.detailForm.glueDeviceId = matched ? matched.id : null
    },
    // 获取加热平台
    fetchPlatformList() {
      equipmentListByPage({
        search_EQ_enableState: 1, // 启用状态
        search_EQ_deviceTypeName: '加热平台',
        rows: 1000,
        page: 1
      }).then(res => {
        this.platformList = res.rows || []
      })
    },
    handlePlatformChange(code) {
      let matched
      if (code) {
        matched = this.platformList.find(item => item.code === code)
      }
      this.detailForm.platformId = matched ? matched.id : null
    },
    handleResultChange(result) {
      if (result !== '报废') {
        this.detailForm.intact = null
      }
    }
  }
}
</script>
