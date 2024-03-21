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
      totalCount: 0,
      timer: null,
      groupedList: [
        {
          group: "过站执行",
          children: [
            {
              name: "切头尾取样",
              href: "/overStationExecution?station=headAndTailSampling",
              icon: "guozhan",
            },
            {
              name: "晶锭检测",
              href: "/overStationExecution?station=ingotDetection",
              icon: "guozhan",
            },
            {
              name: "分段指令",
              href: "/overStationExecution?station=segmentedInstruction",
              icon: "guozhan",
            },
            {
              name: "切割",
              href: "/overStationExecution?station=cutting",
              icon: "guozhan",
            },
          ],
        },
      ],
    };
  },
  computed: {
    ...mapState({
      arrMenu: (state) => state.permission.arrMenu,
    }),
    groupedList_pre() {
      const groupedList = [
        {
          group: "",
          children: [
            {
              name: "过站操作",
              href: "/overStation",
              key: null,
              icon: "guozhan",
            },
            {
              name: "来料检验",
              href: "/incomingInspection",
              key: "pda_incomingInspection_menu",
              icon: "jianyan",
            },
          ],
        },
        {
          group: "生产管理",
          children: [
            {
              name: "装炉",
              href: "/feed",
              key: "pda_feed_menu",
              icon: "toulu",
            },
            {
              name: "热场更换",
              href: "/accessory",
              key: "pda_accessory_menu",
              icon: "accessory",
            },
          ],
        },
        {
          group: "原料合成",
          children: [
            {
              name: "返工发料",
              href: "/producIssueStuff",
              key: "pda_producIssueStuff_menu",
              icon: "faliao",
            },
            {
              name: "装埚",
              href: "/filling",
              key: "pda_filling_menu",
              icon: "zhuangguo",
            },
            {
              name: "开埚",
              href: "/boil",
              key: "pda_boil_menu",
              icon: "kaiguo",
            },
            {
              name: "氧化",
              href: "/oxidize",
              key: "pda_oxidize_menu",
              icon: "yanghua",
            },
            {
              name: "破碎",
              href: "/crush",
              key: "pda_crush_menu",
              icon: "posui",
            },
            {
              name: "筛分",
              href: "/screen",
              key: "pda_screen_menu",
              icon: "shaifen",
            },
            {
              name: "终检包装",
              href: "/finalInspectionPackage",
              key: "pda_finalInspectionPackage_menu",
              icon: "zhongjian",
            },
            {
              name: "成品入库",
              href: "/Warehousing",
              key: "pda_Warehousing_menu",
              icon: "ruku",
            },
          ],
        },
        {
          group: "籽晶粘贴",
          children: [
            {
              name: "生产发料",
              href: "/pasteProducIssueStuff",
              key: "pda_pasteProducIssueStuff_menu",
              icon: "faliao",
            },
            {
              name: "工序1-1",
              href: "/process1-1",
              key: "pda_process1-1_menu",
              icon: "gongxu11",
            },
            {
              name: "工序1-2",
              href: "/process1-2",
              key: "pda_process1-2_menu",
              icon: "gongxu12",
            },
            {
              name: "工序2-1",
              href: "/process2-1",
              key: "pda_process2-1_menu",
              icon: "gongxu21",
            },
            {
              name: "工序2-2",
              href: "/process2-2",
              key: "pda_process2-2_menu",
              icon: "gongxu22",
            },
            {
              name: "工序3-1",
              href: "/process3-1",
              key: "pda_process3-1_menu",
              icon: "gongxu31",
            },
            {
              name: "工序3-2",
              href: "/process3-2",
              key: "pda_process3-2_menu",
              icon: "gongxu32",
            },
            {
              name: "终检包装",
              href: "/seedFinalInspection",
              key: "pda_seedFinalInspection_menu",
              icon: "zhongjian",
            },
            {
              name: "成品入库",
              href: "/seedWarehousing",
              key: "pda_seedWarehousing_menu",
              icon: "ruku",
            },
          ],
        },
        {
          group: "装炉长晶",
          children: [
            {
              name: "清洗",
              href: "/cleanDry",
              key: "pda_cleanDry_menu",
              icon: "qingxi",
            },
            {
              name: "烘干",
              href: "/dry",
              key: "pda_dry_menu",
              icon: "honggan",
            },
            {
              name: "装料",
              href: "/charge",
              key: "pda_charge_menu",
              icon: "zhuangliao",
            },
            {
              name: "坩埚组装",
              href: "/crucibleAssembly",
              key: "pda_seedcrucibleAssembly_menu",
              icon: "ganguo",
            },
            {
              name: "籽晶安装",
              href: "/seedCrystal",
              key: "pda_seedCrystal_menu",
              icon: "zijing",
            },
            {
              name: "开炉初检",
              href: "/KLInitialInspection",
              key: "pda_KLInitialInspection_menu",
              icon: "kailu",
            },
            {
              name: "终检包装",
              href: "/finalInspectionPack",
              key: "pda_finalInspectionPack_menu",
              icon: "zhongjian",
            },
            {
              name: "成品入库",
              href: "/CPWarehousing",
              key: "pda_CPWarehousing_menu",
              icon: "ruku",
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
              (item) => !item.key || this.arrMenu.includes(item.key)
            ),
          };
        })
        .filter((groupItem) => groupItem.children.length);
      return filteredList;
    },
  },
  methods: {
    handleMenu(type) {
      if (type === "过站操作") {
        this.$router.push("/overStation");
        return;
      }
      if (type === "扫码入口") {
        this.$router.push({ path: "/overStation", query: { isScanner: true } });
        return;
      }
    },
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
