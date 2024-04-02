<!--装料-->
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
        <el-form ref="detailForm" :model="detailForm" label-width="120px" :rules="rules" inline>
          <div>
            <el-form-item label="操作者">
              <el-input v-model="detailForm.userCreate" disabled/>
            </el-form-item>
            <el-form-item label="确认者" prop="userConfirm">
              <SelectUserinfo v-model="detailForm.userConfirm"/>
            </el-form-item>
            <el-form-item label="合格数量" prop="goodQty">
              <el-input v-model="detailForm.goodQty" disabled/>
            </el-form-item>
            <el-form-item label="报废数量" prop="scrapQty">
              <el-input v-model="detailForm.scrapQty" type="number" @change="handleScrapQtyChange"/>
            </el-form-item>
            <el-form-item label="工艺编号" prop="technologyNumber">
              <el-input v-model="detailForm.technologyNumber"/>
            </el-form-item>
          </div>

          <div class="headLine">
            <div class="headLine-title">设备/工艺参数确认</div>
          </div>

          <div>
            <el-form-item label="籽晶编号" prop="seedCrystalNumber">
              <CodeScanner v-model="detailForm.seedCrystalNumber"/>
            </el-form-item>
            <el-form-item label="籽晶寿命" prop="seedCrystalLife">
              <el-input v-model="detailForm.seedCrystalLife"/>
            </el-form-item>
            <el-form-item label="石英坩埚编号" prop="quartzCrucibleSerial">
              <CodeScanner v-model="detailForm.quartzCrucibleSerial"/>
            </el-form-item>
            <el-form-item label="多晶硅编号" prop="polysiliconSerial">
              <CodeScanner v-model="detailForm.polysiliconSerial"/>
            </el-form-item>
            <el-form-item label="掺杂剂用量" prop="dopantDosage">
              <el-input v-model="detailForm.dopantDosage">
                <template slot="append">kg</template>
              </el-input>
            </el-form-item>
            <el-form-item label="加料管类型" prop="chargePipeType">
              <el-input v-model="detailForm.chargePipeType"/>
            </el-form-item>
            <el-form-item label="加料管型号" prop="chargePipeModel">
              <el-input v-model="detailForm.chargePipeModel"/>
            </el-form-item>
            <el-form-item label="加料管编号" prop="chargePipeSerial">
              <el-input v-model="detailForm.chargePipeSerial"/>
            </el-form-item>
            <el-form-item label="装料时间" prop="feedingTime">
              <el-date-picker
                v-model="detailForm.feedingTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                @change="handleFeedingTimeChange"
              />
            </el-form-item>
            <el-form-item label="装料时长" prop="feedingDuration">
              <el-input v-model="detailForm.feedingDuration" disabled>
                <template slot="append">min</template>
              </el-input>
            </el-form-item>
          </div>
          <div>
            <el-form-item class="block-form-item" label="加料量" prop="_arrFeedingAmount">
              <el-input
                v-for="(item, index) in detailForm._arrFeedingAmount"
                v-model="detailForm._arrFeedingAmount[index]"
                :key="index"
                class="number-item"
                type="number"
                @blur="refreshFeeding"
              />
            </el-form-item>
            <br>
            <el-form-item label=" ">
              <el-progress :percentage="feedPercent"/>
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
import { cloneDeep, floor, last } from 'lodash-es'
import moment from 'moment'

const defaultForm = {
  userConfirm: null, // 确认者
  goodQty: null, // 合格数量
  scrapQty: null, // 报废数量
  technologyNumber: null, // 工艺编号
  seedCrystalNumber: null, // 籽晶编号
  seedCrystalLife: null, // 籽晶寿命
  quartzCrucibleSerial: null, // 石英坩埚编号
  polysiliconSerial: null, // 多晶硅编号
  dopantDosage: null, // 掺杂剂用量
  chargePipeType: null, // 加料管类型
  chargePipeModel: null, // 加料管型号
  chargePipeSerial: null, // 加料管编号
  feedingTime: null, // 装料时间
  crystalPullingError: null, // 拉晶异常
  feedingDuration: null, // 装料时长(min)
  feedingAmount: null, // 加料量
  _arrFeedingAmount: ['']
}

export default {
  name: 'ChargeOperate',
  components: {
    CodeScanner,
    SelectUserinfo
  },
  data() {
    return {
      detailInfo: {}, // 描述信息
      detailForm: Object.assign({}, cloneDeep(defaultForm)), // 表单列表
      rules: {
        userConfirm: [{ required: true, message: '请输入确认者', trigger: 'change' }],
        scrapQty: [{ required: true, message: '请输入报废数量', trigger: 'change' }],
        technologyNumber: [{ required: true, message: '请输入工艺编号', trigger: 'blur' }],
        seedCrystalNumber: [{ required: true, message: '请输入籽晶编号', trigger: 'change' }],
        polysiliconSerial: [{ required: true, message: '请输入多晶硅编号', trigger: 'change' }],
        dopantDosage: [{ required: true, message: '请输入掺杂剂用量', trigger: 'change' }],
        chargePipeType: [{ required: true, message: '请选择加料管类型', trigger: 'change' }],
        chargePipeModel: [{ required: true, message: '请选择加料管型号', trigger: 'change' }],
        chargePipeSerial: [{ required: true, message: '请选择加料管编号', trigger: 'change' }],
        feedingTime: [{ required: true, message: '请选择装料时间', trigger: 'change' }],
        _arrFeedingAmount: [{ type: 'array', required: true, message: '请输入加料量', trigger: 'change' }],
      }
    }
  },
  computed: {
    storageLabel() {
      return this.$route.query.wipStorageStatus === '1' ? '出站' : '进站'
    },
    feedPercent() {
      const { _arrFeedingAmount, goodQty } = this.detailForm
      const amount = (_arrFeedingAmount || []).reduce((acc, cur) => acc + (Number(cur) || 0), 0)
      return floor(amount / goodQty * 100) || 0
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

      this.detailForm = Object.assign({}, cloneDeep(defaultForm), fromData)

      // 加料量
      this.$set(this.detailForm, '_arrFeedingAmount', (this.detailForm.feedingAmount || '').split(','))
    },
    back() {
      this.$router.push('/overStationExecution?station=ZL')
    },
    // 操作
    handle(typeName) {
      const { _arrFeedingAmount, ...form } = this.detailForm
      let feedingAmount = (_arrFeedingAmount || []).filter(x => x).join(',')
      const FormData = JSON.stringify({
        ...form,
        feedingAmount
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
    handleScrapQtyChange() {
      const { feedingTotal, scrapQty } = this.detailForm
      this.detailForm.goodQty = feedingTotal - scrapQty
    },
    handleFeedingTimeChange(time) {
      this.detailForm.feedingDuration = moment(this.$store.getters.NowServerDate).diff(time, 'minutes')
    },
    refreshFeeding() {
      if (this.feedPercent < 100 && last(this.detailForm._arrFeedingAmount)) this.detailForm._arrFeedingAmount.push('')
    }
  }
}
</script>

<style scoped>
.number-item {
  width: 150px !important;
  margin: 0 10px 10px 0;
}
</style>
