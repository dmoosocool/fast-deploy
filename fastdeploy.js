#!/usr/bin/env node
const program = require('commander');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const emoji = require('node-emoji');

// 加载工具.
const archiverZip = require('./lib/archiverZip');
const getConfigByCli = require('./lib/getConfigByCli');
const getConfigByFile = require('./lib/getConfigByFile');
const upload = require('./lib/upload');
const runshell = require('./lib/runshell');

program
  .command('fastdeploy')
  
  .version('1.0.0')
  .option('-F, --file [file]', 'get config by file.')
  .option('-T, --type [type]', 'get config by file and set category type.')
  .option('-C, --cli', 'get config by cli.')
  .option('-S, --shell', 'get config by cli and set shell. {upload_zip_name} can get timestrap zip name.')
  .parse(process.argv);

/**
 * 主命令.
 * @param {Object} config 配置信息.
 */
async function main(config) {
  // 生成本地目录的绝对路径.
  let realLocalpath = config.localpath.slice(0, 1) == '/' ? config.localpath : path.join(process.cwd() , config.localpath );
  // 判断本地目录是否存在.
  let localExists = await fs.existsSync(realLocalpath);
  // 生成的zip文件名.
  let filename = '';
  // 真正上传的zip包路径.
  let realUploadPath = '';

  if(!localExists) {
    console.log(`${emoji.get(':exclamation:')}${emoji.get(':exclamation:')} ${chalk.hex('#deaded').bold("错误: 没有找到'"+ chalk.red.bold(realLocalpath) +"'此路径。")}`);
  } 
  else {
    // 开始执行压缩
    filename = await archiverZip(config.localpath);
    // 获取真实上传的zip路径.
    realUploadPath = path.join(process.cwd(), 'deployed', filename);
    // 开始执行上传动作.
    let uploadStatus = await upload(config.host, config.port, config.username, config.password, realUploadPath, config.serverpath);

    if(uploadStatus){
      console.log('上传成功.');
    }

    let shell = config.shell.replace(/{upload_zip_name}/, filename);
    // 显示shell脚本.
    console.log(shell);
    // 开始执行shell命令.
    await runshell(config.host, config.port, config.username, config.password, shell);
  }
};

(async function(){
  let config;
  // 通过配置文件获取配置.
  if(program.file){
    // 如果指定了配置文件
    if(typeof program.file == 'string' && program.file != ''){
      // 获取配置文件的真实绝对路径.
      filepath = program.file.slice(0, 1) == '/' ? program.file : path.join(process.cwd() , program.file );
      // 如果指定了配置文件并指定了部署类型.
      if(program.type && program.type != '') {
        config = await getConfigByFile(filepath, program.type);
      }else{
        config = await getConfigByFile(filepath);
      }
    }
    else{
      // 没有指定配置文件只指定了部署类型.
      if(program.type && program.type != '') {
        config = await getConfigByFile(undefined, program.type);
      }
      else{
        // 默认使用项目根目录的deploy.config.json
        config = await getConfigByFile();
      }
    }
  }
  // 通过命令行获取配置.
  else if(program.cli){
    config = await getConfigByCli();
  }
  // 默认使用命令行获取配置.
  else{
    config = await getConfigByCli();
  }

  console.log(config);
  // 执行.
  main(config);
})();
// main();
