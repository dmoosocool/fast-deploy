#!/usr/bin/env node
'use strict';
const program = require('commander');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const emoji = require('node-emoji');
const Table = require('cli-table');

// 加载工具.
const archiverZip = require('./lib/archiverZip');
const getConfigByCli = require('./lib/getConfigByCli');
const getConfigByFile = require('./lib/getConfigByFile');
const upload = require('./lib/upload');
const runshell = require('./lib/runshell');

program
  .version('1.0.0')
  .option('-F, --file [file]', 'get config by file.')
  .option('-T, --type [type]', 'get config by file and set category type.')
  .option('-C, --cli', 'get config by cli.')
  .option('-S, --shell', 'get config by cli and set shell. {upload_zip_name} can get timestrap zip name.')
  .option('-L, --list', 'get deployed list.')
  .parse(process.argv);

/**
 * 主命令.
 * @param {Object} config 配置信息.
 */
async function main(config) {
  // 生成本地目录的绝对路径.
  const realLocalpath = config.localpath.slice(0, 1) === '/' ? config.localpath : path.join(process.cwd(), config.localpath);
  // 判断本地目录是否存在.
  const localExists = await fs.existsSync(realLocalpath);
  // 生成的zip文件名.
  let filename = '';
  // 真正上传的zip包路径.
  let realUploadPath = '';

  if (!localExists) {
    console.log(`
${emoji.get(':exclamation:')}${emoji.get(':exclamation:')} 
${chalk.hex('#deaded').bold("错误: 没有找到'" + chalk.red.bold(realLocalpath) + "'此路径。")}`);
  }
  else {
    // 开始执行压缩
    filename = await archiverZip(config.localpath);
    // 获取真实上传的zip路径.
    realUploadPath = path.join(process.cwd(), 'deployed', filename);
    // 开始执行上传动作.
    const uploadStatus = await upload(config.host, config.port, config.username, config.password, realUploadPath, config.serverpath);

    if (uploadStatus) {
      console.log('上传成功.');
    }

    const shell = config.shell.replace(/{upload_zip_name}/, filename);
    // 显示shell脚本.
    console.log(shell);
    // 开始执行shell命令.
    await runshell(config.host, config.port, config.username, config.password, shell);
  }
}

// 入口函数.
(async function() {
  let config;

  // 如果是获取上传列表信息.
  if (program.list) {
    const versionInfoFile = path.join(process.cwd(), 'deployed-version-info.json');

    // 如果文件存在则读取文件中的信息.
    if (await fs.existsSync(versionInfoFile)) {
      const versionInfo = JSON.parse(await fs.readFileSync(versionInfoFile));
      if (!versionInfo.list) {
        console.log(`${emoji.get(':sob:')}  ${chalk.hex('#ff0000').bold('你还没有上传记录')}`);
      }
    }
    // 不存在, 创建文件并输出提示.
    else {
      await fs.writeFileSync(versionInfoFile, '{}', {encoding: 'utf8'});
      console.log(`${emoji.get(':sob:')}  ${chalk.hex('#ff0000').bold('你还没有上传记录')}`);
    }

    const table = new Table({
      head: ['id', 'name'],
      colWidths: [5, 20]
    });

    table.push(['1', 'hello'], ['2', 'world']);
    console.log(table.toString());
    // 终止不进行操作.
    return;
  }

  // 通过配置文件获取配置.
  if (program.file) {
    //配置文件地址 如果没有指定配置文件默认从 path.join(process.cwd(), 'deploy.config.json')中获取.
    let filepath;
    // 如果指定了配置文件
    if (typeof program.file == 'string' && program.file !== '') {
      // 获取配置文件的真实绝对路径.
      filepath = program.file.slice(0, 1) === '/' ? program.file : path.join(process.cwd(), program.file);
    }

    // 获取配置文件,
    if (program.type && program.type !== '') {
      config = await getConfigByFile(filepath, program.type);
    }
    else {
      config = await getConfigByFile(filepath);
    }
  }
  // 通过命令行获取配置.
  else if (program.cli) {
    config = await getConfigByCli();
  }
  // 默认使用命令行获取配置.
  else {
    config = await getConfigByCli();
  }
  main(config);
})();
