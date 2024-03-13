<!--选择位置 弹窗-->
<template>
  <el-dialog
    :visible.sync="dialogFormVisible"
    title="选择位置"
    top="5vh"
    width="95%"
    append-to-body
    destroy-on-close
  >
    <ul class="pos-status">
      <li v-for="(item, index) in statusList" :key="index">
        <i :class="item.class"></i>
        <span>{{ item.label }}</span>
      </li>
    </ul>

    <ul>
      <li
        v-for="(row, rowIdx) in list"
        :key="rowIdx"
        class="pos-row"
      >
        <ul>
          <li class="pos-idx">{{ row.label }}</li>
          <li
            v-for="(item, itemIdx) in row.children"
            :key="itemIdx"
            :class="{
              'position-used': usedPosition[item.value],
              'position-selected': selectedPosition === item.value
            }"
            class="pos-item"
            @click="handleItemClick(item)"
          >
            {{ item.label }}
          </li>
        </ul>
      </li>
    </ul>

    <div slot="footer" class="dialog-footer">
      <el-button
        :disabled="!selectedPosition"
        class="block-btn"
        type="primary"
        @click="handleConfirm()"
      >
        <template v-if="selectedPosition">确认选择</template>
        <template v-else>请选择</template>
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'SelectPositionDialog',
  props: {
    visible: {
      required: true,
      type: Boolean
    },
    position: {
      required: true,
      type: String
    },
    // 列表数据
    list: {
      required: true,
      type: Array
    },
    // 已占用的位置 obj
    usedPosition: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      statusList: [
        { label: '位置已占用', class: 'position-used' },
        { label: '当前选中', class: 'position-selected' },
        { label: '可选', class: '' },
      ],
      selectedPosition: '',
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
  },
  watch: {
    visible: {
      immediate: true,
      handler(visible) {
        if (visible) this.init()
      }
    }
  },
  methods: {
    init() {
      this.selectedPosition = this.position
    },
    handleConfirm() {
      this.$emit('has-confirm', this.selectedPosition)
      this.dialogFormVisible = false
    },
    handleItemClick({ value }) {
      if (this.usedPosition[value]) return
      this.selectedPosition = value
    }
  }
}
</script>

<style lang="scss" scoped>
.pos-status {
  display: flex;
  gap: 40px;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  > li {
    display: flex;
    align-items: center;
    gap: 8px;
    > i {
      display: inline-block;
      box-sizing: border-box;
      width: 40px;
      height: 40px;
      border-radius: 6px;
      border: 1px solid #DCDFE6;
    }
  }
}
.position-used {
  border-color: #E6E8EB !important;
  background: #F0F2F5;
  color: #C0C4CC;
}
.position-selected {
  border-color: #1283F9 !important;
  background: #1283F9;
  color: #fff;
}
.pos-row {
  > ul {
    margin: 16px 0;
    display: flex;
    gap: 8px;
    justify-content: center;
    font-size: 18px;
    line-height: 80px;
    text-align: center;
  }
}
.pos-idx {
  width: 82px;
  height: 82px;
  border-radius: 40px 6px 6px 40px;
  border: 1px solid #B1B3B8;
  color: #fff;
  background: #C7C9CC;
  font-weight: bold;
}
.pos-item {
  width: 82px;
  height: 82px;
  border-radius: 6px;
  border: 1px solid #E6E8EB;
  cursor: pointer;
}
</style>
