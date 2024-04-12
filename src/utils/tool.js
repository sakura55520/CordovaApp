
// 只允许输入正数
export function regPositiveNumber(obj,objName) {
  const reg = /^[0-9]+(\.[0-9]{0,2})?$/;
  const value =  obj[objName]
  if (!reg.test(value)) {
    obj[objName] = value.replace(/[^\d.]/g, '');
  }
}
// 计算某时间点距离现在的时间，时分秒
export function getTimeInterval(nowDate, oldDate) {
  let nowTime = nowDate ?  new Date(nowDate) : new Date(); // 第一个时间点
  let oldTime = new Date(oldDate); // 第二个时间点
  // 计算时间差（单位：毫秒）
  const diff = Math.abs(nowTime - oldTime);
  // 计算相隔的小时、分钟和秒数
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  // 返回结果
  return `${hours}小时${minutes}分钟${seconds}秒`;
}
// 计算某个时刻前n分钟后的时间点
export function getAfterTimeByMinute(time,minuteVal = 0) {
  if(!time) return ''
  let date = new Date(time);
  // 获取当前时间的时间戳
  let timestamp = date.getTime();
  // 计算60分钟前的时间戳
  let newTimestamp = timestamp + Number(minuteVal) * 60 * 1000;
  // 将新时间戳转换为时间格式
  let newDate = new Date(newTimestamp);
  // 输出新时间的年月日时分秒
  let year = newDate.getFullYear();
  let month = newDate.getMonth() + 1;
  let day = newDate.getDate();
  let hour = newDate.getHours();
  let minute = newDate.getMinutes();
  let second = newDate.getSeconds();
  return `${year}-${month}-${day} ${hour < 10 ? '0'+hour : hour}:${minute < 10 ? '0'+minute : minute}:${second < 10 ? '0'+second : second}`
}
// 计算某个时刻前n分钟前的时间点
export function getBeforTimeByMinute(time,minuteVal = 0) {
  let date = new Date(time);
  // 获取当前时间的时间戳
  let timestamp = date.getTime();
  // 计算60分钟前的时间戳
  let newTimestamp = timestamp - Number(minuteVal) * 60 * 1000;
  // 将新时间戳转换为时间格式
  let newDate = new Date(newTimestamp);
  // 输出新时间的年月日时分秒
  let year = newDate.getFullYear();
  let month = newDate.getMonth() + 1;
  let day = newDate.getDate();
  let hour = newDate.getHours();
  let minute = newDate.getMinutes();
  let second = newDate.getSeconds();
  return `${year}-${month}-${day} ${hour < 10 ? '0'+hour : hour}:${minute < 10 ? '0'+minute : minute}:${second < 10 ? '0'+second : second}`
}
// 计算某个时间点距离现在多少小时
export function hoursFromNow(dateString, future) {
  if (!dateString) return ''

  const date = new Date(dateString);
  let diffMs = Date.now() - date.getTime()
  if (future) diffMs = -diffMs

  const hours = (diffMs / (1000 * 60 * 60)).toFixed(1);
  return dateString ? hours  + ' h' : '';
}
