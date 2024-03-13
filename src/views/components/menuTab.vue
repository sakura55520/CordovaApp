<!--
 组件名: 获取数据输入框
-->
<template>
  <div class="menu_tab">
    <el-menu :default-active="(menuList[0] || {}).val" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item :index="item.val" v-for="item in menuList" :key="item.val">{{ item.name }}</el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'MenuTab',
  props: {
    menuList:{
      required: true,
      type:Array
    }
  },
  methods: {
    //菜单选择
    handleSelect(key, keyPath){
      this.$emit('select',key, keyPath)
    }
  }
}
</script>
<style lang="scss">
.menu_tab{
  .el-menu-demo{
    display: flex;
    li{
      width: 100%;
      text-align: center;
    }
  }
}
</style>
