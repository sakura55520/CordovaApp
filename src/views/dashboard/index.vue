<!--pad主页面-->
<template>
  <div class="dashboard">
    <div class="das-container">
      <!-- 模块 -->
      <div
        v-for="(groupItem, index) in groupedList"
        :key="index"
        class="das-list"
      >
        <!-- 模块名称 -->
        <h3 v-if="groupItem.group">{{ groupItem.group }}</h3>
        <ul class="das-ul">
          <!-- 单个导航 -->
          <li
            v-for="(item, index) in groupItem.children"
            :key="index"
            class="das-link"
          >
            <router-link :to="item.href">
              <figure>
                <svg-icon :icon-class="item.icon" class-name="das-icon" />
                <figcaption>{{ item.name }}</figcaption>
              </figure>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Dashboard",
  data() {
    return {

    };
  },
  computed: {
    ...mapState({
      arrMenu: (state) => state.permission.arrMenu,
    }),
    groupedList() {
      const groupedList = [
        {
          group: '',
          children: [
            { name: '过站操作', href: '/overStation', key: null, icon: 'guozhan' }
          ]
        },
        {
          group: "单晶车间",
          children: [
            {
              name: "辅材更换",
              href: "/accessory",
              icon: "accessory",
              permission: "pda_accessory_menu"
            },
            {
              name: "装料",
              href: "/overStationExecution?station=ZL",
              icon: "charge",
              permission: "pda_charge_menu"
            },
            {
              name: "长晶",
              href: "/overStationExecution?station=ZJ",
              icon: "growth",
              permission: "pda_growth_menu"
            },
            {
              name: "单晶送付",
              href: "/overStationExecution?station=DJSF",
              icon: "send",
              permission: "pda_sendInspect_menu"
            },
          ],

        },
        {
          group: "割断滚圆车间",
          children: [
            {
              name: "切头尾取样",
              href: "/overStationExecution?station=QTWQY",
              icon: "head",
              permission: "pda_headAndTailSampling_menu"
            },
            {
              name: "晶锭检验",
              href: "/overStationExecution?station=JDJY",
              icon: "detection",
              permission: "pda_ingotDetection_menu"
            },
            {
              name: "分段指令",
              href: "/overStationExecution?station=FDZL",
              icon: "segmented",
              permission: "pda_segmentedInstruction_menu"
            },
            {
              name: "割断",
              href: "/overStationExecution?station=GD",
              icon: "cutting",
              permission: "pda_cutting_menu"
            },
            {
              name: "滚圆中转",
              href: "/overStationExecution?station=GYZZ",
              icon: "transfer",
              permission: "pda_roundTransfer_menu"
            },
            {
              name: "滚圆",
              href: "/overStationExecution?station=GY",
              icon: "round",
              permission: "pda_round_menu"
            },
            {
              name: "加参",
              href: "/overStationExecution?station=JC",
              icon: "add_parameter",
              permission: "pda_addParameter_menu"
            },
            {
              name: "入库检测",
              href: "/overStationExecution?station=RKJC",
              icon: "warehouse",
              permission: "pda_warehouseDetection_menu"
            },
          ],
        },
        {
          group: "交接班管理",
          children: [
            {
              name: "交接班管理",
              href: "/shiftChange",
              icon: "shift",
            },
          ],
        },
      ];
      // 通过key筛选权限
      const filteredList = groupedList
        .map((groupItem) => {
          return {
            ...groupItem,
            children: groupItem.children.filter(
              (item) => !item.permission || this.arrMenu.includes(item.permission)
            ),
          };
        })
        .filter((groupItem) => groupItem.children.length);
      return filteredList;
    },
  },
  methods: {

  },
};
</script>

<style lang="scss" scoped>
.menu {
  display: flex;
  width: 100%;
  position: fixed;
  justify-content: space-evenly;
  bottom: 0px;
  height: 50px;
  background-color: #ffffff;
  .menu-item {
    height: 50px;
    width: 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 8px;
  }
}

ul,
figure,
figcaption {
  margin: 0;
  padding: 0;
}
.das-ul {
  display: grid;
  grid-template-columns: repeat(auto-fill, 96px);
  justify-content: space-between;
  column-gap: 40px;
  row-gap: 30px;
}
img {
  vertical-align: top;
}
figure > img {
  margin-bottom: 8px;
}
figcaption {
  font-size: 18px;
  line-height: 26px;
  text-align: center;
  white-space: nowrap;
}

.dashboard {
  min-height: 100vh;
  margin: auto;
  background: #eff1f3;
  color: #303133;
}
.das-banner {
  min-height: 167px;
}
.das-list {
  margin: 16px 0;
  padding: 16px 24px;
  background: #ffffff;
  h3 {
    margin: 0 0 16px 0;
    padding: 0;
    font-weight: normal;
    font-size: 22px;
    line-height: 30px;
  }
}
.das-link {
  /*text-align: center;*/
}

.main-tittle {
  display: flex;
  flex-direction: row;
  margin-left: 4%;
  font-weight: 600;
}
.tittl1 {
  margin-top: 60px;
}
.main-tittle .border {
  border-top: 1px dashed #ccc;
  margin-top: 8px;
  width: calc(90% - 100px);
  margin-left: 17px;
}

/* 标题样式 */
.title {
  margin-bottom: 10px;
  height: 64px;
}

.goBack i {
  display: inline-block;
  width: 40px;
  height: 40px;
  color: white;
}

.main-content {
  /* margin-top:50px; */
  width: 96%;
  flex: 1;
  /* margin-left: 2%; */
  margin-right: 4%;
}

.main-content div {
  width: 47%;
  float: left;
  line-height: 60px;
  background: linear-gradient(to left, #2aa8fb, #3860f3);
  box-shadow: 0px 3px 8px 0px rgba(47, 143, 248, 0.5);
  border-radius: 8px;
  margin-top: 12px;
  font-size: 16px;
  color: white;
  text-align: center;
}

.div-right {
  margin-left: 3%;
}

a {
  display: block;
}
.das-icon {
  margin-bottom: 8px;
  font-size: 96px;
}
</style>
