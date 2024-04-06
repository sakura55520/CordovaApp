<template>
  <div
    id="app"
    :class="[$store.getters.fromPC ? 'pc-form' : 'pad-form']"
  >
    <Heads
      v-if="!$route.meta.HeadsHide && !$store.getters.fromPC"
      :is-router="!$route.meta.btnReturnHide"
      :IsUser="!$route.meta.UserHide"
      z-index="99999"
      NowServerDate
      @reload="reload()"
    ></Heads>
    <router-view v-if="isRouterAlive"/>
  </div>
</template>

<script>
import Heads from "@/views/heads/index";
import querystring from 'querystring'

export default {
  name: "App",
  components: {
    Heads
  },
  data() {
    return {
      isRouterAlive: true,
    };
  },
  created() {
    //设置获取当前时间
    this.$store.dispatch('NowServerDate')
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
