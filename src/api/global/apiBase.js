global.apiBase = {
    //辅料更换页面确认人下拉框的角色类型
    ConfirmingPersonUserType:72,
    HOST:''
}

const env = process.env.NODE_ENV
switch (env) {
  case 'development':
  case 'company_production_test': // 公司测试环境
    global.apiBase.ReportHOST = 'http://10.60.120.56:90/MES_SERVER'
    global.apiBase.HOST = 'http://10.60.120.56:90/MES_SERVER'
    break;
  case 'production_test': // 生产测试环境
    global.apiBase.ReportHOST = ''
    global.apiBase.HOST = ''
    break;
  case 'production': // 生产正式环境
    global.apiBase.ReportHOST = ''
    global.apiBase.HOST = ''
    break;

}

export default {
  apiBase
};
