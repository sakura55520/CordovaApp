<!--选择晶体 弹窗-->
<template>
  <el-dialog
    :visible.sync="dialogFormVisible"
    custom-class="dialog"
    title="选择晶体"
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
          :class="[no2selected[item.crystalNo] || selectedNo === item.crystalNo ? 'selected' : '']"
          @click="handleItemClick(item)"
        >
          <!-- head -->
          <div class="headLine">
            <div>
              <span class="headLine-name">晶体编号 &nbsp;&nbsp; </span>
              <span class="headLine-value">{{ item.crystalNo }}</span>
            </div>
            <div>
              <span class="headLine-name">批次号 &nbsp;&nbsp; </span>
              <span class="headLine-value">{{ item.lotNo }}</span>
            </div>
            <div>
              <el-tag>待入库</el-tag>
              <template v-if="isSingle">
                <el-radio v-model="selectedNo" class="select" :label="item.crystalNo">&nbsp;</el-radio>
              </template>
              <template v-else>
                <el-radio v-model="no2selected[item.crystalNo]" class="select" :label="true">&nbsp;</el-radio>
              </template>
            </div>
          </div>
          <!-- body -->
          <div :class="'grid-container'">
            <div class="grid-item">
              <span class="grid-item-name">料号：</span>
              <span class="grid-item-value">{{ item.productCode }}</span>
            </div>
            <div class="grid-item">
              <span class="grid-item-name">数量：</span>
              <span class="grid-item-value">{{ item.num }}{{ item.unit }}</span>
            </div>
            <div class="grid-item">
              <span class="grid-item-name">产品信息：</span>
              <span class="grid-item-value">{{ item.productName }}</span>
            </div>
            <div class="grid-item">
              <span class="grid-item-name">规格：</span>
              <span class="grid-item-value">{{ item.spec }}</span>
            </div>
            <div class="grid-item">
              <span class="grid-item-name">晶体等级：</span>
              <span class="grid-item-value">{{ item.crystalGrade }}</span>
            </div>
            <div class="grid-item">
              <span class="grid-item-name">晶体去向：</span>
              <span class="grid-item-value">{{ item.destination }}</span>
            </div>
            <div class="grid-item">
              <span class="grid-item-name">进站时间：</span>
              <span class="grid-item-value">{{ item.createTime }}</span>
            </div>
            <div class="grid-item">
              <span class="grid-item-name">停留时间：</span>
              <span class="grid-item-value residence-time">{{ $hoursFromNow(item.createTime) }}</span>
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
import {hoursFromNow} from '@/utils/tool'
import {listByPage} from "@/api/CPWarehousing";

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
      selectedNo: '',
      selectedRow: {},
      no2selected: {},
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
      if (this.isSingle && this.selectedNo) return 1
      if (!this.isSingle && this.list.length) {
        let count = 0
        for (const crystalNo in this.no2selected) {
          if (this.no2selected[crystalNo]) count++
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
      this.selectedNo = ''
      this.no2selected = {}
    },
    handleSingleConfirm() {
      if (!this.selectedNo) return this.$message.error('请选择一个晶体!')
      this.$emit('has-confirm', { ...this.selectedRow })
      this.dialogFormVisible = false
    },
    handleMultipleConfirm() {
      if (!this.selectedCount) return this.$message.error('请至少选择一个晶体!')
      const selectedList = this.list.filter(({ crystalNo }) => this.no2selected[crystalNo])
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
      listByPage({
        processName:'成品入库',
        page: this.page,
        rows: this.rows,
      }).then(res => {
        this.list = res.data.rows || []
        this.list.forEach(row => {
          row.num = 1 // 应收主数量
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
      let { crystalNo } = item
      if (this.isSingle) {
        this.selectedNo = crystalNo
        this.selectedRow = item
      } else {
        this.$set(this.no2selected, crystalNo, !this.no2selected[crystalNo])
      }
    }
  }
}
</script>
