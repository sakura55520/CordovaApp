<template>
  <treeselect
    v-model="id"
    :options="tree"
    :normalizer="normalizer"
    :default-expand-level="3"
    :limit="0"
    :limit-text="limitText"
    :max-height="400"
    :alwaysOpen="alwaysOpen"
    disable-branch-nodes
    placeholder="请选择库位"
    no-results-text="暂无数据"
    no-options-text="暂无数据"
    @input="handleInput"
    @select="handleSelect"
  />
</template>

<script>
import { getPermissionWarehouseTree } from '@/api/warehouseStructure'

export default {
  name: 'SelectLinesideTree',
  props: ['value', 'alwaysOpen'],
  data() {
    return {
      id: null,
      tree: [],
    }
  },
  created() {
    this.fetchData()
    this.id = this.value
  },
  methods: {
    fetchData() {
      getPermissionWarehouseTree().then(res => {
        this.tree = res.data
      })
    },
    normalizer(node){
      // 去掉children=[]的children属性
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children
      }
    },
    limitText() {
      return ``
    },
    handleInput(value) {
      if (!value) this.$emit('node-click', null, null)
    },
    handleSelect(raw) {
      this.$emit('select', raw)
    },
  }
}
</script>
