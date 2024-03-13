<!--选择工单 弹窗-->
<template>
  <el-dialog
    :visible.sync="dialogFormVisible"
    custom-class="dialog"
    :title="title"
    top="5vh"
    width="95%"
    append-to-body
    destroy-on-close
  >
    <div class="dialog-scroller-wrap">
      <scroller ref="scroller" :on-refresh="refreshList" :on-infinite="infinite" noDataText="已显示全部数据" class="directional">
        <div
          v-for="(item, index) in list"
          :key="index"
          class="card-item"
          :class="[uniqueCode2selected[item.uniqueCode] || selectedCode === item.uniqueCode ? 'selected' : '']"
          @click="handleItemClick(item)"
        >
          <!-- head -->
          <div class="headLine">
            <div>
              <span class="headLine-name">籽晶编号 &nbsp;&nbsp; </span>
              <span class="headLine-value">{{ item.uniqueCode }}</span>
            </div>
            <div>
              <span class="headLine-name">订单号 &nbsp;&nbsp; </span>
              <span class="headLine-value">{{ item.planOrderNo }}</span>
            </div>
            <div>
              <el-tag v-if="wipStorageStatus === '0'" effect="plain" type="info">待进站</el-tag>
              <el-tag v-else-if="wipStorageStatus === '1'" effect="plain">待出站</el-tag>
              <template v-if="isSingle">
                <el-radio v-model="selectedCode" class="select" :label="item.uniqueCode">&nbsp;</el-radio>
              </template>
              <template v-else>
                <el-radio v-model="uniqueCode2selected[item.uniqueCode]" class="select" :label="true">&nbsp;</el-radio>
              </template>
            </div>

          </div>
          <!-- body -->
          <div :class="'grid-container'">
            <div class="grid-item">
              <span class="grid-item-name">产品名称：</span>
              <span class="grid-item-value">
                <span>{{ item.materialName }}</span>
              </span>
            </div>
            <div class="grid-item">
              <span class="grid-item-name">类型：</span>
              <span class="grid-item-value">{{ item.materialType }}</span>
            </div>
            <div class="grid-item">
              <span class="grid-item-name">进站时间：</span>
              <span class="grid-item-value">{{ item.inTime }}</span>
            </div>
            <div class="grid-item">
              <span class="grid-item-name">停留时间：</span>
              <span class="grid-item-value">{{ item._residenceTime }}</span>
            </div>
          </div>
        </div>
      </scroller>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-checkbox v-if="!isSingle" :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
      <el-button
        :disabled="!selectedCount"
        class="block-btn"
        type="primary"
        @click="isSingle ? handleSingleConfirm() : handleMultipleConfirm()"
      >
        <template v-if="selectedCount">已选{{ selectedCount }}条, 确认选择</template>
        <template v-else>请选择</template>
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import * as Api from '@/api/process1-2'
import {hoursFromNow} from '@/utils/tool'

export default {
  name: 'SelectOrderDialog',
  props: {
    visible: {
      required: true,
      type: Boolean
    },
    // 在制品状态，1：已进站，0：待进站
    wipStorageStatus: {
      required: true,
      type: String
    },
    // 多选 multiple, 单选 single
    selectType: {
      type: String,
      default: 'single'
    },
  },
  data() {
    return {
      page: 1,
      rows: 10,
      list: [],// 列表数据
      selectedCode: '',
      selectedRow: {},
      uniqueCode2selected: {},
      isIndeterminate: false,
      checkAll: false,
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
    title() {
      let str = '选择工单'
      const { deviceCode } = this.$route.query
      if (deviceCode) str += `【${deviceCode}】`
      return str
    },
    isSingle() {
      return this.selectType === 'single'
    },
    selectedCount() {
      if (this.isSingle && this.selectedCode) return 1
      if (!this.isSingle && this.list.length) {
        let count = 0
        for (const uniqueCode in this.uniqueCode2selected) {
          if (this.uniqueCode2selected[uniqueCode]) count++
        }
        return count
      }
      return 0
    }
  },
  watch: {
    visible: {
      immediate: true,
      handler(visible) {
        if (visible) this.refreshList()
      }
    }
  },
  methods: {
    reset() {
      this.isIndeterminate = false
      this.checkAll = false
      this.selectedCode = ''
      this.uniqueCode2selected = {}
    },
    handleCheckAllChange(val) {
      this.isIndeterminate = false
      if (val) {
        this.list.forEach(({ uniqueCode }) => {
          this.$set(this.uniqueCode2selected, uniqueCode, true)
        })
      } else {
        this.uniqueCode2selected = {}
      }
    },
    handleSingleConfirm() {
      if (!this.selectedCode) return this.$message.error('请选择一条工单!')
      this.$emit('has-confirm', { ...this.selectedRow })
      this.dialogFormVisible = false
    },
    handleMultipleConfirm() {
      if (!this.selectedCount) return this.$message.error('请至少选择一条工单!')
      const selectedList = this.list.filter(({ uniqueCode }) => this.uniqueCode2selected[uniqueCode])
      this.$emit('has-confirm', selectedList)
      this.dialogFormVisible = false
    },
    // 下拉刷新
    refreshList(done) {
      this.reset()
      this.page = 1
      this.rows = this.page * 10
      this.fetchByPage(done)
    },
    // 滚动加载
    infinite(done) {
      this.rows += this.page * 10
      this.fetchByPage(done)
    },
    // 加载数据
    fetchByPage(done) {
      Api.listByPage({
        page: this.page,
        rows: this.rows,
        equipmentCode: this.$route.query.deviceCode, // 设备编号
        processName: '工序1-2',
        wipStorageStatus: this.wipStorageStatus, // 在制品状态，1：已进站，0：待进站
      }).then(res => {
        this.list = res.data.rows || []
        this.list.forEach(row => {
          row._residenceTime = hoursFromNow(row.inTime)
        })
        if (res.data && res.data.total <= this.rows) {
          return done && done(true)
        }
        done && done()
      }).catch(err => {
        done && done(true)
      })
    },
    handleItemClick(item) {
      let { uniqueCode } = item
      if (this.isSingle) {
        this.selectedCode = uniqueCode
        this.selectedRow = item
      } else {
        this.$set(this.uniqueCode2selected, uniqueCode, !this.uniqueCode2selected[uniqueCode])
        this.checkAll = this.selectedCount === this.list.length
        this.isIndeterminate = this.selectedCount > 0 && this.selectedCount < this.list.length
      }
    }
  }
}
</script>
