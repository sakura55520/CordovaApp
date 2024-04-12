<!--过站操作-->
<template>
  <div v-show="visible" class="detailBox">
    <div v-show="!routerReplace" class="topInfoCard">
      <div class="topBox">
        <div class="topBox-label">编号</div>
        <CodeScanner
          ref="CodeScanner"
          v-model="processingOrderCode"
          :placeholder="'请扫描或输入'"
          @has-done="codeScannerCallBack"
          @clear="onCodeScannerClear"
          style="flex: 1;"
        />
      </div>
    </div>

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

export default {
  components: {
    CodeScanner
  },
  data() {
    return {
      visible: false,
      processingOrderCode: undefined,//工单号
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
        this.processingOrderCode = this.$route.query.processingOrderCode
        this.codeScannerCallBack()
      }
    },
    handleInOrOutStation() {
      handleInOrOutStation(this.storage, this.processingOrderCode)
    },
    // 当选中工序时
    handleClickSite(row, index) {
      this.storage = {
        ...row,
        index
      }
    },
    // 扫码回调
    codeScannerCallBack() {
      Api.getCurrentWipStorageData(this.processingOrderCode).then(res => {
        this.stationList = res.data
        if (this.routerReplace && res.data.length === 1) {
          this.storage = res.data[0]
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
      this.processingOrderCode = null
      this.wipStorageName = null
      this.storage = null
      this.stationList = []
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
