<!--弹窗: 过站-->
<!--在过站列表, getCurrentWipStorageData 返回多个站点时, 弹窗展示站点列表-->
<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :title="'【' + processingOrderCode + '】请选择站点'"
    width="60%"
  >
    <el-form ref="dataForm" :model="temp" :rules="rules" class="cs-form">
      <el-form-item v-show="storage && storage.isNeedsDevice" label="设备" prop="deviceCode">
        <DeviceCodeScanner
          ref="CodeScanner"
          v-model="temp.deviceCode"
          placeholder="请扫描或输入设备"
        />
      </el-form-item>
    </el-form>

    <el-radio-group v-model="wipStorageName" style="width: 100%;">
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

    <div slot="footer" class="dialog-footer">
      <el-button
        v-if="storage"
        :type="calcIsSkip ? 'warning' : 'primary'"
        class="submit"
        @click="handleInOrOutStation"
      >
        {{ calcStationOperator }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import {mapState} from 'vuex'
import {calcIsSkip, calcStationOperator, handleInOrOutStation} from '@/utils/overStation'

const defaultForm = {
  deviceCode: null
}

export default {
  name: 'ChooseStationDialog',
  data() {
    return {
      wipStorageName: null,//工序绑定项
      storage: null,//当前选中工序数据
      isAbnormal: false,//是否标记异常
      temp: Object.assign({}, defaultForm)
    }
  },
  computed: {
    ...mapState({
      processingOrderCode: state => state.station.processingOrderCode,
      stationVisible: state => state.station.stationVisible,
      stationList: state => state.station.stationList,
    }),
    dialogVisible: {
      get() {
        return this.stationVisible
      },
      set(stationVisible) {
        this.$store.dispatch('SetStationVisible', stationVisible)
      }
    },
    calcStationOperator() {
      const { skipStatus, wipStorageStatus } = this.storage
      return calcStationOperator(skipStatus, wipStorageStatus)
    },
    calcIsSkip() {
      return calcIsSkip(this.storage.skipStatus)
    },
    rules() {
      return {
        deviceCode: [{ required: this.storage && this.storage.isNeedsDevice, message: '请输入设备', trigger: 'change' }]
      }
    }
  },
  watch: {
    dialogVisible: {
      immediate: true,
      handler(visible) {
        if (visible) this.init()
      }
    }
  },
  methods: {
    init() {
      this.wipStorageName = null
      this.storage = null
      this.temp = Object.assign({}, defaultForm)
      if (this.stationList.length === 1) {
        const first = this.stationList[0]
        this.wipStorageName = first.wipStorageName
        this.handleClickSite(first, 0)
      }
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleInOrOutStation() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const { deviceCode } = this.temp
          handleInOrOutStation({
            ...this.storage,
            equipmentCode: deviceCode,
            deviceCode,
          }, this.processingOrderCode)
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
  }
}
</script>

<style scoped>
.cs-form {
  margin-bottom: 26px;
}
</style>
