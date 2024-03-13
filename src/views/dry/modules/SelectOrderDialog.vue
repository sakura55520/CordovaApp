<!--选择工单 弹窗-->
<template>
  <el-dialog
    :visible.sync="dialogFormVisible"
    custom-class="dialog"
    title="选择清洗批次号"
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
          :class="[id2selected[item.id] || selectedId === item.id ? 'selected' : '']"
          @click="handleItemClick(item)"
        >
          <!-- head -->
          <div class="headLine">
            <div>
              <span class="headLine-name">清洗批次号 &nbsp;&nbsp; </span>
              <span class="headLine-value">{{ item.cleanBatchNo }}</span>
            </div>
            <div>
              <span class="headLine-name">清洗类型 &nbsp;&nbsp; </span>
              <span class="headLine-value">{{ formatOperateType(item.operateType) }}</span>
            </div>
            <div>
              <el-tag v-if="!item.submitType" effect="plain" type="info">待进站</el-tag>
              <el-tag v-else effect="plain">待出站</el-tag>
              <template v-if="isSingle">
                <el-radio v-model="selectedId" class="select" :label="item.id">&nbsp;</el-radio>
              </template>
              <template v-else>
                <el-radio v-model="id2selected[item.id]" class="select" :label="true">&nbsp;</el-radio>
              </template>
            </div>

          </div>
          <!-- body -->
          <div :class="'grid-container'">
            <div class="grid-item">
              <span class="grid-item-name">物料编码：</span>
              <span class="grid-item-value">{{ item.materialCode }}</span>
            </div>
            <div class="grid-item">
              <span class="grid-item-name">物料名称：</span>
              <span class="grid-item-value">{{ item.materialName }}</span>
            </div>

            <!-- S原料时 -->
            <div v-show="item.operateType === 0" class="grid-item">
              <span class="grid-item-name">规格：</span>
              <span class="grid-item-value">{{ item.spec }}</span>
            </div>
            <div class="grid-item">
              <span class="grid-item-name">数量：</span>
              <span class="grid-item-value">{{ item.totalWeight }}</span>
            </div>

            <!-- 待出站 时显示 -->
            <template v-if="item.submitType === 1">
              <div class="grid-item">
                <span class="grid-item-name">进站时间：</span>
                <span class="grid-item-value">{{ item.inTime }}</span>
              </div>
              <div class="grid-item">
                <span class="grid-item-name">停留时间：</span>
                <span class="grid-item-value" style="color: red;">{{ item.residenceTime }}</span>
              </div>
            </template>
          </div>
        </div>
      </scroller>
    </div>

    <div slot="footer" class="dialog-footer">
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
import * as Api from '@/api/dry'
import {hoursFromNow} from '@/utils/tool'
import {operateTypeList} from '@/constants'

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
      selectedId: '',
      selectedRow: {},
      id2selected: {},
      operateTypeList // 清洗类型list
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
    isSingle() {
      return this.selectType === 'single'
    },
    selectedCount() {
      if (this.isSingle && this.selectedId) return 1
      if (!this.isSingle && this.list.length) {
        let count = 0
        for (const id in this.id2selected) {
          if (this.id2selected[id]) count++
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
      this.selectedId = ''
      this.id2selected = {}
    },
    handleSingleConfirm() {
      if (!this.selectedId) return this.$message.error('请选择一条工单!')
      this.$emit('has-confirm', { ...this.selectedRow })
      this.dialogFormVisible = false
    },
    handleMultipleConfirm() {
      if (!this.selectedCount) return this.$message.error('请至少选择一条工单!')
      const selectedList = this.list.filter(({ id }) => this.id2selected[id])
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
        search_EQ_combinedFlag: 0, // 未合批
        search_IN_submitType: '0', // 待进站
        search_IN_operateType: '2,3', // 操作物料类型 0：S原料 1：T原料 2：石墨件（坩埚） 3：石墨件（其他）
        page: this.page,
        rows: this.rows,
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
      let { id } = item
      if (this.isSingle) {
        this.selectedId = id
        this.selectedRow = item
      } else {
        this.$set(this.id2selected, id, !this.id2selected[id])
      }
    },
    formatOperateType(type) {
      const matched = this.operateTypeList.find(item => item.value === type)
      return matched ? matched.label : type
    },
    formatWeightLabel(type) {
      let label = ''
      switch (type) {
        case 0: label = '混合料总重量'; break
        case 1: label = '重量'; break
        default: label = '数量'
      }
      return label
    },
  }
}
</script>
