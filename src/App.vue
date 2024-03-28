<template>
  <div id="app">
    <Heads
      v-if="!$route.meta.HeadsHide"
      :is-router="!$route.meta.btnReturnHide"
      :router="$route.meta.returnPath || '/dashboard'"
      :IsUser="!$route.meta.UserHide"
      z-index="99999"
      NowServerDate
      @reload="reload()"
    ></Heads>
    <router-view class="pad-form" v-if="isRouterAlive"/>
  </div>
</template>

<script>
import Heads from "@/views/heads/index";
export default {
  name: "App",
  components: {
    Heads
  },
  data() {
    return {
      isRouterAlive: true
    };
  },
  created(){
    //设置获取当前时间
    this.$store.dispatch('NowServerDate')
  },
  mounted() {

  },
  methods: {
    reload() {
      this.$router.go(0);
      // this.isRouterAlive = false;
      // this.$nextTick(function() {
      //   this.isRouterAlive = true;
      //   this.$message({ type: "success", message: "刷新成功" });
      // });
    },
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.el-button--primary {
  /* background-color: #988fd8;
   border-color: #988fd8; */
  /* box-shadow: 0px 5px 20px 0 #45c8dc; */
}
.clear {
  clear: both;
  width: 0px;
  margin: 0;
  padding: 0;
}
a {
  text-decoration: none;
}
/* 去除谷歌浏览器默认样式 */
input:focus {
  outline: none;
}

.el-date-picker.has-time .el-picker-panel__body-wrapper {
    position: relative;
    height: 380px;
}

.invalid_tr {
  opacity: 0.3;
}
</style>
