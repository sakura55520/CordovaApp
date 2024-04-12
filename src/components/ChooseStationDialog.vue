<!--弹窗: 过站-->
<!--在过站列表, getCurrentWipStorageData 返回多个站点时, 弹窗展示站点列表-->
<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :title="'【' + processingOrderCode + '】请选择站点'"
    width="60%"
  >
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

export default {
  name: 'ChooseStationDialog',
  data() {
    return {
      wipStorageName: null,//工序绑定项
      storage: null,//当前选中工序数据
      isAbnormal: false,//是否标记异常
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
  }
}
</script>

<style lang="scss" scoped>

</style>
