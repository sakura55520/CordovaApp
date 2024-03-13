<!--工序2-1详情-->
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
          <span class="grid-item-name">进站时间：</span>
          <span class="grid-item-value">{{ detailForm.inTime }}</span>
        </div>
        <div class="grid-item">
          <span class="grid-item-name">停留时间：</span>
          <span class="grid-item-value">{{ detailForm._residenceTime }}</span>
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
              <el-form-item label="籽晶组件类型" prop="componentType">
                <el-select v-model="detailForm.componentType" style="width: 100%;">
                  <el-option v-for="(item, index) in componentTypeList" :key="index" :value="item.value" :label="item.label">
                    <span style="float: left">{{ item.value }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.extendValue }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
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
              <el-form-item label="石墨纸/板型号" prop="graphiteXh">
                <el-select v-model="detailForm.graphiteXh" style="width: 100%;">
                  <el-option v-for="(item, index) in graphiteXhList" :key="index" :value="item.value" :label="item.label"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="测试结构" prop="structure">
                <el-input v-trim v-model="detailForm.structure" placeholder="请填写测试结构"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="石墨板编号" prop="graphiteNo">
                <el-input v-trim v-model="detailForm.graphiteNo" placeholder="请填写石墨板编号"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="石墨纸批次" prop="graphiteBatch">
                <el-input v-trim v-model="detailForm.graphiteBatch" placeholder="请填写石墨纸批次"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="检验结果" prop="result">
                <el-select v-model="detailForm.result" style="width: 100%;" @change="handleResultChange">
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
      <el-button class="save" @click="handle('保存')">保存</el-button>
      <el-button class="submit" type="primary" @click="handle('提交')">提交</el-button>
    </div>
  </div>
</template>

<script>
import PhotoNew from "@/views/components/photoNew.vue";
import * as Api from '@/api/process2-1'
import { getSeleteData } from '@/utils/select'
import {hoursFromNow} from '@/utils/tool'
import {outStation} from '@/api/trendsform/trendsform';
import {equipmentListByPage} from "@/api/eqp";

const defaultForm = {
  componentType: null, // 组件类型
  glueTec: null, // 涂蜡工艺
  glueDevice: null, // 涂蜡设备号
  glueDeviceId: null,
  platform: null, // 加热平台编号
  platformId: null,
  glueBatch: null, // 胶水批次号
  graphiteXh: null, // 石墨纸/石墨板型号
  structure: null, // 测试结构
  graphiteNo: null, // 石墨板编号
  graphiteBatch: null, // 石墨纸批次
  result: null, // 检验结果
  intact: null, // 报废片是否完整
  remark: null, // 备注
  attachment: null // 附件
}
export default {
  name: 'process2-1Detail',
  components: {
    PhotoNew
  },
  data() {
    return {
      detailForm: Object.assign({}, defaultForm),
      rules: {
        componentType: [{ required: true, message: '必选项', trigger: 'change' }],
        glueTec: [{ required: true, message: '必选项', trigger: 'change' }],
        glueDevice: [{ required: true, message: '必选项', trigger: 'change' }],
        platform: [{ required: true, message: '必选项', trigger: 'change' }],
        glueBatch: [{ required: true, message: '必填项', trigger: 'blur' }],
        graphiteXh: [{ required: true, message: '必选项', trigger: 'change' }],
        // structure: [{ required: true, message: '必填项', trigger: 'blur' }],
        graphiteNo: [{ required: false, message: '必填项', trigger: 'blur' }],
        graphiteBatch: [{ required: false, message: '必填项', trigger: 'blur' }],
        result: [{ required: true, message: '必选项', trigger: 'change' }],
        intact: [{ required: true, message: '必选项', trigger: 'change' }],
      },
      resultList: [
        { value: '合格', label: '合格' },
        { value: '退料', label: '退料' },
        { value: '报废', label: '报废' },
      ],
      disabled: true,
      componentTypeList: [], // 组件类型list
      imageList: [],
      glueTecList: [],
      graphiteXhList: [], // 石墨纸/石墨板型号list
      glueDeviceList: [],
      platformList: [],
      checkLevelList: []
    }
  },
  watch: {
    'detailForm.graphiteXh': function(name) {
      const graphiteNoRquired = name && name.includes('板')
      const graphiteBatchRquired = name && name.includes('纸')
      this.rules.graphiteNo[0].required = graphiteNoRquired
      this.rules.graphiteBatch[0].required = graphiteBatchRquired
      this.$nextTick(() => {
        if (!graphiteNoRquired) this.$refs.detailForm.clearValidate('graphiteNo')
        if (!graphiteBatchRquired) this.$refs.detailForm.clearValidate('graphiteBatch')
      })
    }
  },
  created() {
    this.init()
  },
  methods: {
    // 页面初始化
    init() {
      let storageData = sessionStorage.getItem(`工序2-1详情数据${this.$route.query.processingOrderCode}`)
      if (storageData) {
        const { attachment, ...detailForm } = JSON.parse(storageData)
        this.detailForm = Object.assign({}, defaultForm, detailForm)
        this.detailForm._residenceTime = hoursFromNow(this.detailForm.inTime)
        try {
          this.imageList = JSON.parse(attachment)
        } catch (e) {}
      } else {
        this.detailForm = Object.assign({}, defaultForm)
        this.fetchInfo() // 获取基础信息
      }

      getSeleteData('seedCrystalCategory', this.componentTypeList) // 组件类型list
      getSeleteData('process2-1glueTec', this.glueTecList) // 涂蜡工艺list
      getSeleteData('seedCrystalGraphiteType', this.graphiteXhList) // 石墨纸/石墨板型号list
      this.fetchGlueDeviceList() // 获取涂蜡设备
      this.fetchPlatformList() // 获取加热平台
    },
    // 操作
    handle(typeName = '') {
      const FormData = JSON.stringify({
        ...this.detailForm,
        attachment: JSON.stringify(this.imageList)
      })
      if (typeName === '保存') {
        sessionStorage.setItem(`工序2-1详情数据${this.$route.query.processingOrderCode}`, FormData)
        this.$message.success('保存成功')
        this.$router.push('/process2-1')
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
                sessionStorage.removeItem(`工序2-1详情数据${this.$route.query.processingOrderCode}`)
                this.$router.push('/process2-1')
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
        this.detailForm = Object.assign({}, defaultForm, res.data)
        this.detailForm._residenceTime = hoursFromNow(this.detailForm.inTime)
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
