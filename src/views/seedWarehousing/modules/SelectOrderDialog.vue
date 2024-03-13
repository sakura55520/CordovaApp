<!--选择籽晶组件 弹窗-->
<template>
  <el-dialog
    :visible.sync="dialogFormVisible"
    custom-class="dialog"
    title="选择籽晶组件"
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
              <span class="headLine-name">籽晶编号</span>
              <span class="headLine-value">{{ item.uniqueCode }}</span>
            </div>
            <div>
              <span class="headLine-name">等级</span>
              <span class="headLine-value">{{ item.materialLevel }}</span>
            </div>
            <div>
              <el-tag>待入库</el-tag>
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
              <span class="grid-item-name">物料编码(料号)：</span>
              <span class="grid-item-value">{{ item.materialCode }}</span>
            </div>
            <div class="grid-item">
              <span class="grid-item-name">产品名称：</span>
              <span class="grid-item-value">{{ item.materialName }}</span>
            </div>
            <!--          <div class="grid-item">-->
            <!--            <span class="grid-item-name">直径：</span>-->
            <!--            <span class="grid-item-value">{{ item.diameter }}</span>-->
            <!--          </div>-->
            <div class="grid-item">
              <span class="grid-item-name">规格：</span>
              <span class="grid-item-value">{{ item.specification }}</span>
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
              <span class="grid-item-value residence-time">{{ $hoursFromNow(item.inTime) }}</span>
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
import {listByPage} from "@/api/seedWarehousing";

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
      if (!this.selectedId) return this.$message.error('请选择一个籽晶!')
      this.$emit('has-confirm', { ...this.selectedRow })
      this.dialogFormVisible = false
    },
    handleMultipleConfirm() {
      if (!this.selectedCount) return this.$message.error('请至少选择一个籽晶!')
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
      listByPage({
        search_EQ_status: '待入库',
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
    }
  }
}
</script>
