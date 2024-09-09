<!--
选择设备弹窗:
  1.根据设备类别查询
  2.支持单选和多选
-->
<template>
  <el-dialog :visible.sync="dialogFormVisible" title="选择设备" width="80%" append-to-body>

    <el-form>
      <div style="margin-bottom:15px">
        <el-radio-group v-model="series">
          <el-radio-button v-for="(s, index) in seriesMap" :label="s" :key="index"/>
        </el-radio-group>
      </div>

      <!--当前系列下的所有设备-->
      <div v-if="isBatch">
        <!--多选时-->
        <div>
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange($event, series)" style="margin-bottom:15px">全选</el-checkbox>
        </div>
        <div ref="select-area-box" class="select-area-box" @mousedown="handleMouseDown">
          <div v-show="is_show_mask" :style="calc_style" class="select-area-mask"></div>
          <el-checkbox-group v-model="arrCheckedDeviceIds">
            <el-checkbox v-for="(deviceItem, index) in calcAllDevicesOfCurrentSeries" :key="index" :label="deviceItem.id" :data-id="deviceItem.id" :class="[deviceItem.enableState ? '' : 'disabled-eqp']" :title="deviceItem.enableState ? '' : '已停用'" class="device-radio" border>{{ deviceItem.code }}</el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="d-count-bar">已选择 <span style="color: #F56C6C">{{ arrCheckedDeviceCodes.length }}</span> 台设备</div>
        <div>
          <el-tag v-for="(device, index) in arrCheckedDeviceCodes.slice(0, 11)" :key="index" class="d-item-tag" closable :disable-transitions="false" @close="handleDelItem(index)">{{ device }}</el-tag>
          <el-tag v-show="arrCheckedDeviceCodes.length > 11" class="d-item-tag d-ellipsis">...</el-tag>
        </div>
      </div>
      <div v-else>
        <!--单选时-->
        <el-radio-group v-model="checkedDeviceId" @change="handleDeviceChange">
          <el-radio v-for="(deviceItem, index) in calcAllDevicesOfCurrentSeries" :key="index" :label="deviceItem.id" :class="[deviceItem.enableState ? '' : 'disabled-eqp']" :title="deviceItem.enableState ? '' : '已停用'" class="device-radio" border>{{ deviceItem.code }}</el-radio>
        </el-radio-group>
      </div>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible=false">取 消</el-button>
      <el-button type="primary" @click="isBatch?batchConfirm():deviceConfirm()">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import * as Api from '@/api/deviceCapacity'
import selectDeviceArea from '@/mixins/selectDeviceArea'

export default {
  name: 'SelectDeviceList',
  mixins: [selectDeviceArea],
  props: {
    // 是批量操作
    isBatch: {
      type: Boolean,
      default: false
    },
    // 设备类别id
    deviceTypeId: {
      type: Number | null,
      default: null
    },
    // 设备id集合, 是逗号分割的字符串
    deviceId: {
      type: String | null,
      default: ''
    },
    visible: {
      required: true,
      type: Boolean
    }
  },
  data() {
    return {
      series: undefined,
      seriesMap: [],
      checkedDeviceId: undefined,
      checkedDeviceCode: undefined,
      arrCheckedDeviceIds: [],
      allDevices: [],
      checkAll: false
    }
  },
  computed: {
    dialogFormVisible: {
      get() {
        return this.visible
      },
      set(visible) {
        this.$emit('update:visible', visible)
      }
    },
    calcAllDevicesOfCurrentSeries() {
      let arr = []
      if (this.series) {
        const matched = this.allDevices.find(item => item.series === this.series)
        if (matched) {
          arr = matched.equipmentDtos || []
        }
      }
      return arr
    },
    arrCheckedDeviceCodes() {
      const deviceCodes = []
      for (let i = 0; i < this.allDevices.length; i++) {
        const deviceList = this.allDevices[i].equipmentDtos
        for (let j = 0; j < deviceList.length; j++) {
          if (this.arrCheckedDeviceIds.includes(deviceList[j].id)) {
            deviceCodes.push(deviceList[j].code)
          }
        }
      }
      return deviceCodes
    },
    isIndeterminate() {
      const length = this.calcCheckedDevicesOfCurrentSeries.length
      return length > 0 && length < this.calcAllDevicesOfCurrentSeries.length
    },
    calcCheckedDevicesOfCurrentSeries() {
      const deviceIds = this.calcAllDevicesOfCurrentSeries.map(deviceItem => deviceItem.id)
      return this.arrCheckedDeviceIds.filter(deviceId => deviceIds.includes(deviceId))
    },
  },
  watch: {
    visible: {
      immediate: true,
      handler(visible) {
        if (visible) this.init()
      }
    },
    series: 'chengeCheckAll',
    arrCheckedDeviceIds: {
      immediate: true,
      handler: 'chengeCheckAll'
    }
  },
  methods: {
    init() {
      if (this.isBatch) {
        this.arrCheckedDeviceIds = (this.deviceId ? this.deviceId.split(',') : []).filter(x => x).map(id => Number(id))
      } else {
        this.checkedDeviceId = this.deviceId || ''
      }
      this.getSeriesDevices() // 获取设备数据
    },
    // 获取设备数据
    getSeriesDevices() {
      Api.getSeriesDevices({ 'search_EQ_deviceTypeId': this.deviceTypeId }).then(res => {
        const newDeviceIds = []
        if (res.data.length) {
          this.allDevices = res.data
          this.seriesMap = res.data.map(item => item.series)
          if (!this.series || !this.seriesMap.includes(this.series)) {
            this.series = this.seriesMap[0]
          }
          // 设备列表更新后
          // 将已选择的设备中, 不存在的剔除
          for (let i = 0; i < this.allDevices.length; i++) {
            const deviceList = this.allDevices[i].equipmentDtos
            for (let j = 0; j < deviceList.length; j++) {
              const id = deviceList[j].id
              if (this.arrCheckedDeviceIds.includes(id)) {
                newDeviceIds.push(id)
              }
            }
          }
        }
        this.arrCheckedDeviceIds = newDeviceIds
      })
    },
    batchConfirm() {
      if (!this.arrCheckedDeviceIds.length) {
        return this.$message({ type: 'error', message: '请选择' })
      }
      this.$emit('has-confirm', this.arrCheckedDeviceIds.join(','), this.arrCheckedDeviceCodes.join(','))
      this.dialogFormVisible = false
    },
    deviceConfirm() {
      if (!this.checkedDeviceId) {
        return this.$message({ type: 'error', message: '请选择' })
      }
      this.$emit('has-confirm', this.checkedDeviceId, this.checkedDeviceCode)
      this.dialogFormVisible = false
    },
    chengeCheckAll() {
      this.checkAll = this.calcCheckedDevicesOfCurrentSeries.length === this.calcAllDevicesOfCurrentSeries.length
    },
    handleCheckAllChange(val, series) {
      const deviceIds = this.calcAllDevicesOfCurrentSeries.map(deviceItem => deviceItem.id)
      if (val) {
        this.arrCheckedDeviceIds.push(...deviceIds)
        this.arrCheckedDeviceIds = [...new Set(this.arrCheckedDeviceIds)] // 去重
      } else {
        this.arrCheckedDeviceIds = this.arrCheckedDeviceIds.filter(device => !deviceIds.includes(device))
      }
    },
    handleDeviceChange(id) {
      const matched = this.calcAllDevicesOfCurrentSeries.find(item => item.id === id)
      this.checkedDeviceCode = matched ? matched.code : ''
    },
    handleDelItem(i) {
      this.arrCheckedDeviceIds.splice(i, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
  .device-radio {
    min-width: 72px;
    white-space: nowrap;
    margin: 0 15px 18px 0 !important;
  }
  .el-radio-button {
    margin-bottom: 5px;
  }
  .disabled-eqp {
    border-color: #F56C6C;
  }
</style>
