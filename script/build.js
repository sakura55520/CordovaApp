const shell = require('shelljs');
const moment = require("moment");

const build = async () => {
    const nowTime = moment().format('YYYY-MM-DD HH:mm:ss')
    const envMode = 'company_production_test'

    console.log(
        `******* 当前时间：${nowTime},您要打包的是四期改造-圆棒PAD的【公司测试环境】包, 模式是【${envMode}】*******`
    )


    // 打印开始打包+热更新的名称
    console.log(
       `当前执行的命令语句：node build/build.js --mode=${envMode}`
    )


    // 开始执行编译代码，exec括号内不能换行，不然环境变量会读取不到
    await shell.exec(
        `node build/build.js --mode=${envMode}`
    );

    // 打印打包完成
    console.log(`打包完成！最终打包文件目录：根目录下的www下`);
}

build()
