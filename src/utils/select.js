import { getDictionaryItem } from '@/api/dictionary.js'
import * as select from '@/api/select'
import { getEnumDict } from '@/api/basic/dictionary'


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

// 获取枚举值
// 返回Promise对象
export function getEnumDatas(enumName, options) {
  return getEnumDict(enumName).then(data => {
    options.length = 0;
    for (var i = 0; i < data.data.length; i++) {
      const o = data.data[i]
      options.push(o)
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
