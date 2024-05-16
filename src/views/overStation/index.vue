<!--过站操作-->
<template>
  <div v-show="visible" class="detailBox">
    <el-form ref="dataForm" :model="temp" :rules="rules" class="topInfoCard">
      <el-form-item label="编号" prop="processingOrderCode">
        <CodeScanner
          ref="CodeScanner"
          v-model="temp.processingOrderCode"
          placeholder="请扫描或输入编号"
          @has-done="codeScannerCallBack"
          @clear="onCodeScannerClear"
        />
      </el-form-item>
      <el-form-item v-if="storage && storage.isNeedsDevice" label="设备" prop="deviceCode">
        <DeviceCodeScanner
          ref="CodeScanner"
          v-model="temp.deviceCode"
          placeholder="请扫描或输入设备"
        />
      </el-form-item>
    </el-form>

    <div v-show="stationList && stationList.length" class="fromCard">
      <div class="headLine">
        <div class="headLine-title">选择站点</div>
      </div>
      <el-radio-group v-model="wipStorageName" class="over-station-list">
        <el-radio
          v-for="(item,index) in stationList"
          :key="index"
          :label="item.wipStorageName"
          class="list-radio"
          border
          @click.native="handleClickSite(item,index)"
        >
          {{ item.wipStorageName }}
        </el-radio>
      </el-radio-group>
    </div>

    <div class="page-handle-box">
      <el-button
        v-if="storage"
        :type="calcIsSkip ? 'warning' : 'primary'"
        class="submit"
        @click="handleInOrOutStation"
      >
        {{ calcStationOperator }}
      </el-button>
    </div>
  </div>
</template>

<script>
import * as Api from '@/api/overStation/overStation.js'
import CodeScanner from '@/components/CodeScanner';
import {calcIsSkip, calcStationOperator, handleInOrOutStation} from '@/utils/overStation'

const defaultForm = {
  processingOrderCode: null,
  deviceCode: null,
}

export default {
  components: {
    CodeScanner
  },
  data() {
    return {
      temp: Object.assign({}, defaultForm),
      visible: false,
      wipStorageName: null,//工序绑定项
      storage: null,//当前选中工序数据
      stationList: [],//工序列表
    }
  },
  computed: {
    calcStationOperator() {
      const {skipStatus, wipStorageStatus} = this.storage
      return calcStationOperator(skipStatus, wipStorageStatus)
    },
    calcIsSkip() {
      return calcIsSkip(this.storage.skipStatus)
    },
    // 尝试立即跳转到表单页
    routerReplace() {
      return this.$route.query.routerReplace
    },
    rules() {
      return {
        processingOrderCode: [{ required: true, message: '请输入编号', trigger: 'change' }],
        deviceCode: [{ required: this.storage && this.storage.isNeedsDevice, message: '请输入设备', trigger: 'change' }]
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    // 初始化逻辑
    init() {
      this.visible = !this.routerReplace

      // 判断是否直接扫码
      if (this.$route.query.isScanner) {
        this.$refs.CodeScanner.sweepCode()
      }

      if (this.$route.query.processingOrderCode) {
        this.temp.processingOrderCode = this.$route.query.processingOrderCode
        this.codeScannerCallBack()
      }
    },
    handleInOrOutStation() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          const {deviceCode} = this.temp
          handleInOrOutStation({
            ...this.storage,
            equipmentCode: deviceCode,
            deviceCode,
          }, this.temp.processingOrderCode)
        }
      })
    },
    // 当选中工序时
    handleClickSite(row, index) {
      this.storage = {
        ...row,
        index
      }
      if (row.deviceCode) this.temp.deviceCode = row.deviceCode
    },
    // 扫码回调
    codeScannerCallBack() {
      Api.getCurrentWipStorageData(this.temp.processingOrderCode).then(res => {
        if (!res.data || !res.data.length) return Message.warning('未查询到过站信息!')
        const list = res.data
        this.stationList = list
        if (this.routerReplace && list.length === 1 && !list[0].isNeedsDevice) {
          this.storage = list[0]
          this.handleInOrOutStation()
        } else {
          this.visible = true
        }
      }).catch(err => {
        this.resetData()
      })
    },
    // 当扫码框清空时
    onCodeScannerClear() {
      this.resetData()
    },
    // 重置页面数据
    resetData() {
      this.temp = Object.assign({}, defaultForm)
      this.wipStorageName = null
      this.storage = null
      this.stationList = []
      this.$nextTick(() => {
        this.$refs.dataForm.clearValidate()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.headLine {
  border-bottom: none;
}

.topBox {
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;

  .topBox-label {
    font-weight: 600;
  }
}

.over-station-list {
  width: 100%;
  padding: 0 16px;
}
</style>
