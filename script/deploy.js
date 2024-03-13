const shell = require('shelljs');
const inquirer = require('inquirer');
const chalk = require('chalk');
const moment = require("moment");
const fs = require('fs');

const env = {
  '公司测试环境': {envMode: 'company_production_test', cordovaUrl: '10.60.120.34:99'},
  // '现场测试环境': {envMode: 'production_test', cordovaUrl: '暂时没有现场测试环境'},
  '现场正式环境': {envMode: 'production', cordovaUrl: '10.10.16.210:81'}
}


const deploy = async () => {
  let envName = ''
  let envMode = ''
  let cordovaUrl = ''
  const mode = require('minimist')(process.argv.slice(2))['mode']
  console.log('mode:', mode)
  if (mode && mode in env) {
    ({envMode, cordovaUrl} = env[mode])
    console.log('ddd----',envMode, cordovaUrl)
  } else {
    const res = await inquirer.prompt([
      {
        type: 'list',
        name: 'env',
        message: '请选择你要部署的环境？',
        choices: Object.keys(env),
      }
    ]);

    const nowTime = moment().format('YYYY-MM-DD HH:mm:ss');
    envName = res.env;
    ({envMode, cordovaUrl} = env[res.env]); // 获取实际打包选择的模式、url

    console.log(
      chalk.green(`******* 当前时间：${nowTime},您要打包的是PAD的【${envName}】包, 模式是【${envMode}】*******`)
    )


    // 二次确认弹框
    const confirmer = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'secondCheck',
        message: '确定以上信息无误?',
        default: true
      }
    ]);

    if (!confirmer.secondCheck) {
      return;
    }
  }



  // 打印开始打包+热更新的名称
  console.log(
    chalk.blue(
      `当前执行的命令语句：node build/build.js --mode=${envMode} && cordova-hcp build`
    )
  )

  // 修改热更新文件的content_url
  modifyCordovaUrl(cordovaUrl)

  // 开始执行编译代码，exec括号内不能换行，不然环境变量会读取不到
  await shell.exec(
    `node build/build.js --mode=${envMode} && cordova-hcp build`
  );

  // 打印打包完成
  console.log(chalk.green(`【${envName}】打包完成！最终打包文件目录：根目录下的www下`));
}


// 修改cordova热更新的url
function modifyCordovaUrl(url) {
  const newJson = {
    update: "now",
    content_url: url
  }
  fs.writeFileSync('cordova-hcp.json', JSON.stringify(newJson))
  console.log(chalk.green(`修改热更新文件成功！当前热更新的地址是：${url}`));
}


deploy()
