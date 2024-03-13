<!--选择批次 弹窗-->
<template>
  <el-dialog
    :visible.sync="dialogFormVisible"
    custom-class="dialog"
    title="选择批次"
    top="5vh"
    width="95%"
    append-to-body
    destroy-on-close
  >
    <div class="dialog-scroller-wrap">
      <scroller ref="scroller" noDataText="已显示全部数据" class="directional">
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
              <span class="headLine-name">批次号 &nbsp;&nbsp; </span>
              <span class="headLine-value">{{ item.batchNo }}</span>
            </div>
            <div>
              <span class="headLine-name">出库单 &nbsp;&nbsp; </span>
              <span class="headLine-value">{{ item.outputBillNo }}</span>
            </div>
            <div>
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
              <span class="grid-item-name">物料料号：</span>
              <span class="grid-item-value">
                <span>{{ item.materialModelCode }}</span>
              </span>
            </div>
            <div class="grid-item">
              <span class="grid-item-name">物料名称：</span>
              <span class="grid-item-value">{{ item.materialModelName }}</span>
            </div>
            <div class="grid-item">
              <span class="grid-item-name">规格：</span>
              <span class="grid-item-value">{{ item.specification }}</span>
            </div>
            <div class="grid-item">
              <span class="grid-item-name">重量kg：</span>
              <span class="grid-item-value">{{ item.outputCount }}</span>
            </div>
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
import * as Api from '@/api/process3-1'
import {hoursFromNow} from '@/utils/tool'

export default {
  name: 'SelectBatchDialog',
  props: {
    visible: {
      required: true,
      type: Boolean
    },
    list: {
      required: true,
      type: Array
    },
    // 多选 multiple, 单选 single
    selectType: {
      type: String,
      default: 'multiple'
    },
  },
  data() {
    return {
      page: 1,
      rows: 10,
      selectedId: '',
      selectedRow: {},
      id2selected: {},
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
        if (visible) {

        }
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
    handleItemClick(item) {
      let { id } = item
      if (this.isSingle) {
        this.selectedId = id
        this.selectedRow = item
      } else {
        this.$set(this.id2selected, id, !this.id2selected[id])
      }
    }
  }
}
</script>
