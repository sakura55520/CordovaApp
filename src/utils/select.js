import { getDictionaryItem } from '@/api/dictionary.js'
import { getUserInfoByUserRole } from '@/api/tool.js'
// import * as apiBase from '@/api/global/apiBase.js'
import * as select from '@/api/select'


// 获取数据字典配置
// 返回Promise对象
export function getSeleteData(optionsName, options) {
  return getDictionaryItem({
    "themeValue": optionsName,
    search_EQ_enable: true
  }).then(data => {
    options.length = 0;
    for (var i = 0; i < data.data.length; i++) {
      const o = data.data[i]
      if (o.enable) {
        options.push({
          ...o,
          label: o.name
        })
      }
    }
    options.sort((a, b) => a.priority - b.priority)
  })
}

export function getConfirmingPersonSelete(options){
    var obj = Object();
    obj.Role= apiBase.ConfirmingPersonUserType
    getUserInfoByUserRole(obj).then(data => {
      console.log(data)
      for(var i = 0; i< data.msg.length; i++){
          var obj = new Object();
          obj.value = data.msg[i].userId
          obj.label = data.msg[i].name
          console.log(obj)
          options.push(obj);
      }
    })
}
//更具工号，获取用户列表
export function getUserInfoList(options,params, cb){
  options.length = 0;
  select.getUserInfoList(params).then(data=>{
    for(var i = 0; i< data.data.length; i++){
      var obj = new Object();
      obj.value = data.data[i].realName
      obj.id = data.data[i].id

      options.push(obj);
    }
    cb && cb(options)
  })
}
