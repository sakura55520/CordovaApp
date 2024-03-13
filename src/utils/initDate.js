export function initDate(subDay) {
  var time = []
  var date = new Date()
  date.setTime(date.getTime() + 24 * 60 * 60 * 1000)
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  var hsm = ' 09:00:00'
  month = month < 10 ? '0' + month : month
  day = day < 10 ? '0' + day : day

  var time1 = year + '-' + month + '-' + day + hsm
  time[1] = time1
  date = new Date(date.getTime() - 24 * 60 * 60 * 1000 * subDay)

  var lYear = date.getFullYear()
  var lMonth = date.getMonth() + 1
  var lDay = date.getDate()
  lMonth = lMonth < 10 ? '0' + lMonth : lMonth
  lDay = lDay < 10 ? '0' + lDay : lDay
  var time2 = lYear + '-' + lMonth + '-' + lDay + hsm
  time[0] = time2

  return time
}

export function checkDate(startTime, endTime, days = 1) {
  if (!startTime || !endTime) return
  if (new Date(endTime).getTime() - new Date(startTime).getTime() > 60 * 60 * 24 * 1000 * days) {
    return true
  } else return false
}
