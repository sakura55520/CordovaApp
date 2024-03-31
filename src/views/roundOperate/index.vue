<!--滚圆-->
<template>
  <div class="detailBox">
    <!-- 顶部信息卡片 -->
    <div class="topInfoCard">
      <div class="grid-container">
        <div class="grid-item">
          <span class="grid-item-name">批次号：</span>
          <span class="grid-item-value">{{ detailForm.processOrderCode }}</span>
        </div>
        <div class="grid-item">
          <span class="grid-item-name">长晶炉：</span>
          <span class="grid-item-value">{{ $route.query.deviceCode }}</span>
        </div>
      </div>
    </div>

    <div class="fromCard">
      <div class="fromCard">
        <div class="headLine">
          <div class="headLine-title">{{ storageLabel }}数据录入</div>
        </div>
        <el-form ref="detailForm" :model="detailForm" label-width="136px" :rules="rules" inline>
          <div>
            <el-form-item label="操作者">
              <el-input v-model="detailForm.userCreate" disabled/>
            </el-form-item>
            <el-form-item label="合格数量" prop="goodQty">
              <el-input v-model="detailForm.goodQty" disabled>
                <template slot="append">kg</template>
              </el-input>
            </el-form-item>
            <el-form-item label="报废数量" prop="scrapQty">
              <el-input v-model="detailForm.scrapQty" type="number">
                <template slot="append">kg</template>
              </el-input>
            </el-form-item>

          </div>

          <div class="headLine">
            <div class="headLine-title">设备/工艺参数确认</div>
          </div>

          <div>
            <el-form-item label="计划长度" prop="planLength">
              <el-input v-model="detailForm.planLength" type="number">
                <template slot="append">cm</template>
              </el-input>
            </el-form-item>
            <el-form-item label="原始长度" prop="originLength">
              <el-input v-model="detailForm.originLength" type="number" @change="calcQualifLength">
                <template slot="append">cm</template>
              </el-input>
            </el-form-item>
            <el-form-item label="崩边长度" prop="chippingLength">
              <el-input v-model="detailForm.chippingLength" type="number" @change="calcQualifLength">
                <template slot="append">cm</template>
              </el-input>
            </el-form-item>
            <el-form-item label="椭圆长度" prop="ellipticLength">
              <el-input v-model="detailForm.ellipticLength" type="number" @change="calcQualifLength">
                <template slot="append">cm</template>
              </el-input>
            </el-form-item>
            <el-form-item label="合格长度" prop="qualifiedLength">
              <el-input v-model="detailForm.qualifiedLength" type="number">
                <template slot="append">cm</template>
              </el-input>
            </el-form-item>
            <el-form-item label="滚圆实测直径头" prop="circleDiameterHead">
              <el-input v-model="detailForm.circleDiameterHead" type="number">
                <template slot="append">cm</template>
              </el-input>
            </el-form-item>
            <el-form-item label="滚圆实测直径尾" prop="circleDiameterTail">
              <el-input v-model="detailForm.circleDiameterTail" type="number">
                <template slot="append">cm</template>
              </el-input>
            </el-form-item>
            <el-form-item label="A点晶向" prop="crystallinePhaseA">
              <el-input v-model="detailForm.crystallinePhaseA"/>
            </el-form-item>
            <el-form-item label="B点晶向" prop="crystallinePhaseB">
              <el-input v-model="detailForm.crystallinePhaseB"/>
            </el-form-item>
            <el-form-item label="C点晶向" prop="crystallinePhaseC">
              <el-input v-model="detailForm.crystallinePhaseC"/>
            </el-form-item>
            <el-form-item label="D点晶向" prop="crystallinePhaseD">
              <el-input v-model="detailForm.crystallinePhaseD"/>
            </el-form-item>
          </div>

        </el-form>
      </div>
    </div>

    <!-- 页面操作 -->
    <div class="pageHandleBox">
      <el-button class="save" @click="handle('保存')">保存</el-button>
      <el-button class="submit" type="primary" @click="handle('提交')">{{ storageLabel }}确认</el-button>
    </div>
  </div>
</template>

<script>
import CodeScanner from '@/components/CodeScanner'
import SelectUserinfo from '@/components/select_userinfo'
import * as Api from '@/api/inStation'
import { cloneDeep, round } from 'lodash-es'
import moment from 'moment'

const defaultForm = {
  goodQty: null, // 合格数量
  scrapQty: null, // 报废数量
  planLength: null, // 计划长度
  originLength: null, // 原始长度
  chippingLength: null, // 崩边长度
  ellipticLength: null, // 椭圆长度
  qualifiedLength: null, // 合格长度
  circleDiameterHead: null, // 滚圆实测直径头
  circleDiameterTail: null, // 滚圆实测直径尾
  crystallinePhaseA: null, // A点晶向
  crystallinePhaseB: null, // B点晶向
  crystallinePhaseC: null, // C点晶向
  crystallinePhaseD: null // D点晶向
}

export default {
  name: 'ChargeOperate',
  components: {
    CodeScanner,
    SelectUserinfo
  },
  data() {
    return {
      detailForm: Object.assign({}, defaultForm), // 表单列表
      rules: {
        scrapQty: [{ required: true, message: '请输入报废数量', trigger: 'change' }],
        planLength: [{ required: true, message: '请输入计划长度', trigger: 'change' }],
        originLength: [{ required: true, message: '请输入原始长度', trigger: 'change' }],
        chippingLength: [{ required: true, message: '请输入崩边长度', trigger: 'change' }],
        ellipticLength: [{ required: true, message: '请输入椭圆长度', trigger: 'change' }],
        qualifiedLength: [{ required: true, message: '请输入合格长度', trigger: 'change' }],
        circleDiameterHead: [{ required: true, message: '请输入滚圆实测直径头', trigger: 'change' }],
        circleDiameterTail: [{ required: true, message: '请输入滚圆实测直径尾', trigger: 'change' }],
        crystallinePhaseA: [{ required: true, message: '请输入A点晶向', trigger: 'change' }],
        crystallinePhaseB: [{ required: true, message: '请输入B点晶向', trigger: 'change' }],
        crystallinePhaseC: [{ required: true, message: '请输入C点晶向', trigger: 'change' }],
        crystallinePhaseD: [{ required: true, message: '请输入D点晶向', trigger: 'change' }],
      }
    }
  },
  computed: {
    storageLabel() {
      return this.$route.query.wipStorageStatus === '1' ? '出站' : '进站'
    },
    buffParams() {
      const { processUuid, processingOrderCode } = this.$route.query
      return { processUuid, processingOrderCode }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      let fromData = {}
      // 查询保存的数据
      const res = await Api.fetchBuffer(this.buffParams)
      if (res.data) {
        fromData = res.data
      } else {
        try {
          fromData = JSON.parse(this.$route.query.fromData)
        } catch (e) {
          console.log(e)
        }
      }

      this.detailForm = Object.assign({}, defaultForm, fromData)
    },
    back() {
      this.$router.push('/overStationExecution?station=GY')
    },
    // 操作
    handle(typeName) {
      const { ...form } = this.detailForm
      const FormData = JSON.stringify({
        ...form,
      })
      if (typeName === '保存') {
        Api.upldateBuffer(this.buffParams, this.detailForm).then(res => {
          this.$message.success('保存成功!')
          this.back()
        })
      } else if (typeName === '提交') {
        this.$refs.detailForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交当前操作数据?', '提示', {
              type: 'warning'
            }).then(() => {
              const { equipmentCode, processUuid, processingOrderCode, wipStorageStatus } = this.$route.query
              Api.inOrOutStation({
                param: {
                  FormData
                },
                equipmentCode, // 设备
                processUuid, // 当前工序唯一标识
                processingOrderCode, // 工单号
                wipStorageStatus, // 进出站状态
              }).then(() => {
                this.$message.success(`【${this.storageLabel}】操作成功`)
                Api.deleteBuffer(this.buffParams)
                this.back()
              })
            })

          }
        })
      }
    },
    calcQualifLength() {
      let qualifiedLength = this.detailForm.originLength // 原始长度
      qualifiedLength -= this.detailForm.chippingLength || 0 // 崩边长度
      qualifiedLength -= this.detailForm.ellipticLength || 0 // 椭圆长度
      this.detailForm.qualifiedLength = round(qualifiedLength, 2)
    }
  }
}
</script>

