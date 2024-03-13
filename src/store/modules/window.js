import { getNowServicerDate } from "@/api/tool.js";
var moment = require("moment");
const window = {
  state: {
    NowServerDate: "",
  },

  mutations: {
    NOW_SERVER_DATE: (state, nowServerDate) => {
      state.NowServerDate = nowServerDate
    },
  },
  actions: {
    NowServerDate({ commit }) {
      /*
       * 获取时间并动态刷新
      */
      getNowServicerDate().then(res => {
        //只需要AJAX一次，将服务器时间获取后以毫米为单位保存到一个变量中
        var _timestamp = Date.parse(res.data);
        //设置定时器每过一秒动态刷新一次时间
        setInterval(
          function () {
            //这里可以自定义时间显示格式
            commit('NOW_SERVER_DATE', moment(new Date(_timestamp)).format('YYYY-MM-DD HH:mm:ss'))
            _timestamp += 1000;
          },
          1000
        );
      })
    }
  }
}
export default window
