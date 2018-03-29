const program = require('commander');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const emoji = require('node-emoji');


const archiverZip = require('./archiverZip');
const getConfigByCli = require('./getConfigByCli');
const getConfigByFile = require('./getConfigByFile');
const upload = require('./upload');


program
  .version('1.0.0')
  .parse(process.argv);

// 默认从项目根目录中读取./deploy.config.json文件中的test信息.
async function main() {
  // let config = await getConfigByCli();

  let config = await getConfigByFile();
  // 生成本地目录的绝对路径.
  let realLocalpath = path.join(process.cwd() , config.localpath );
  // 判断本地目录是否存在.
  let localExists = await fs.existsSync(realLocalpath);

  if(!localExists){
    console.log(`${emoji.get(':exclamation:')}${emoji.get(':exclamation:')} ${chalk.hex('#deaded').bold("错误: 没有找到'"+ chalk.red.bold(realLocalpath) +"'此路径。")}`);
  } else {
    await archiverZip(config.localpath);
    //await upload(config.host, config.port, config.user, config.pass, config.localpath, config.serverpath);
  }
}

main();
