<template>
  <div id="heads">
    <div>
      <div class="divReturn" v-show="IsRouter">
        <router-link :to="router">
          <a>
            <li style="color: #FFF;" class="el-icon-arrow-left"></li>
          </a>
        </router-link>
      </div>

      <div class="divhead">
        {{$route.meta.text}}
        <!-- <i @click="reload()" class="el-icon-refresh el-icon-refreshs"></i> -->
      </div>

      <div
        v-show="IsUser"
        class="divuser"
      >
        <a @click="logout">
          <span class="user-name">{{ realName }}</span>
          <i class="el-icon-switch-button"/>
        </a>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  name: "heads",
  props: ["IsRouter", "router", "IsUser"],
  data() {
    return {

    }
  },
  computed: {
    ...mapState({
      realName: state => state.user.realName
    })
  },
  methods: {
    logout() {
      this.$confirm("确定要退出吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$store.dispatch("LogOut").then(() => {
          location.reload(); // 为了重新实例化vue-router对象 避免bug
        });
      });
    },
    reload() {
      this.$emit("reload");
    },
  }
};
</script>
<style>
#heads {
  height: 50px;
  position: sticky;
  left: 0;
  right: 0;
  top: 0;
  z-index: 100;
  font-size: 22px;
  color: #fff;
}
.divhead {
  text-align: center;
  line-height: 50px;
  color: #ffffff;
}
.divuser {
  height: 50px;
  position: absolute;
  top: 0;
  right: 8px;
  line-height: 50px;
}
.divuser a {
  cursor: pointer;
  padding-left: 10px;
}

.divuser img {
  vertical-align: middle;
  margin-right: 6px;
}
.divColse {
  height: 50px;
  position: absolute;
  padding-right: 3px;
  top: 0;
  right: 0;
  line-height: 50px;
}
.divColse a {
  cursor: pointer;
  padding-left: 10px;
}

.divColse img {
  vertical-align: middle;
  margin-right: 6px;
}

.divReturn {
  height: 50px;
  position: absolute;
  top: 0;
  left: 8px;
  line-height: 50px;
}
.divReturn a {
  cursor: pointer;
}
#heads .el-icon-refreshs {
  padding: 2px;
  cursor: pointer;
}
#heads .menu {
  margin: 0;
  padding: 0;
}
#heads {
  background: linear-gradient(270deg, #1283F9 0.5%, #0BA4FA 99.38%);
  border: 1px solid rgb(18, 150, 219);
  color: #fff;
}
.user-name {
  display: inline-block;
  margin-right: 10px;
  font-size: 20px;
  vertical-align: 1px;
}
</style>

