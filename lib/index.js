const program = require('commander');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const emoji = require('node-emoji');

const archiverZip = require('./archiverZip');
const getConfigByCli = require('./getConfigByCli');
const getConfigByFile = require('./getConfigByFile');
const upload = require('./upload');
// program
//   .version('1.0.0')
//   .parse(process.argv);

// 默认从项目根目录中读取./deploy.config.json文件中的test信息.
async function main() {
  // let config = await getConfigByCli();

  let config = await getConfigByFile();
  // 生成本地目录的绝对路径.
  let realLocalpath = path.join(process.cwd() , config.localpath );
  // 判断本地目录是否存在.
  let localExists = await fs.existsSync(realLocalpath);
  // 生成的zip文件名.
  let filename = '';
  // 真正上传的zip包路径.
  let realUploadPath = '';

  if(!localExists){
    console.log(`${emoji.get(':exclamation:')}${emoji.get(':exclamation:')} ${chalk.hex('#deaded').bold("错误: 没有找到'"+ chalk.red.bold(realLocalpath) +"'此路径。")}`);
  } else {
    // 开始执行压缩
    filename = await archiverZip(config.localpath);
    // 获取真实上传的zip路径.
    realUploadPath = path.join(process.cwd(), 'deployed', filename);
    // 开始执行上传动作.
    return await upload(config.host, config.port, config.username, config.password, realUploadPath, config.serverpath);

  }
}

(async function() {
  let uploadStatus = await main();
  if(uploadStatus){
    console.log('上传成功.');
    process.exit();
  }
})();
