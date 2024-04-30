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
          <span class="grid-item-name">生产设备：</span>
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

          </div>

          <div class="headLine">
            <div class="headLine-title">设备/工艺参数确认</div>
          </div>

        </el-form>
      </div>
    </div>

    <!-- 页面操作 -->
    <div class="page-handle-box">
      <el-button class="cancel" @click="back(null, 'confirm')">取消</el-button>
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
import overStation from "@/mixins/overStation";

const defaultForm = {
  goodQty: null, // 合格数量
  scrapQty: null, // 报废数量

}

export default {
  name: 'ChargeOperate',
  mixins: [overStation],
  components: {
    CodeScanner,
    SelectUserinfo
  },
  data() {
    return {
      detailForm: Object.assign({}, defaultForm), // 表单列表
      rules: {
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
    // 操作
    handle(typeName) {
      const { ...form } = this.detailForm
      const FormData = JSON.stringify({
        ...form,
      })
      if (typeName === '保存') {
        Api.upldateBuffer(this.buffParams, this.detailForm).then(res => {
          const msg = '保存成功!'
          this.$message.success(msg)
          this.back(msg)
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
                const msg = `【${this.storageLabel}】操作成功`
                this.$message.success(msg)
                Api.deleteBuffer(this.buffParams)
                this.back(msg)
              })
            })

          }
        })
      }
    },
  }
}
</script>

