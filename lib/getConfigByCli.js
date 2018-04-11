'use strict';
const inquirer = require('inquirer');
const chalk = require('chalk');
const emoji = require('node-emoji');

/**
 * 不允许为空.
 * @param {String} input 用于校验的文本.
 * @param {String} tips  提示文案.
 */
function notNull(input, tips) {
  const done = this.async();

  if (!input) {
    return done(tips);
  }

  return done(null, true);
}

// 一些将会用到的emoji.
const emojis = {
  alert: emoji.get(':exclamation:'), // 警告
  user: emoji.get(':bust_in_silhouette:'), // 用户名
  pass: emoji.get(':key:'), // 密码
  host: emoji.get(':house:'), // 主机
  localpath: emoji.get(':file_folder:'), // 上传路径
  serverpath: emoji.get(':earth_asia:') // 目标路径
};

// 一些将会用到的颜色.
const colors = {
  warning: chalk.red.bold, // 提示文本颜色
  text: chalk.hex('#deaded').bold // 属性值的颜色
};

// 收集上传信息.
const deployInfoQuestions = [
  {
    type: 'input',
    name: 'host',
    message: '请输入你的主机ip地址',
    validate(input) {
      const ipReg = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)($|(?!\.$)\.)){4}$/;
      const done = this.async();

      if (!ipReg.test(input)) {
        return done('请输入正确的ip地址');
      }

      return done(null, true);
    }
  },
  {
    type: 'input',
    name: 'username',
    message: '请输入用户名',
    validate(input) {
      return notNull.call(this, input, '用户名不允许为空.');
    }
  },
  {
    type: 'password',
    name: 'password',
    message: '请输入密码',
    validate(input) {
      return notNull.call(this, input, '密码不允许为空.');
    }
  },
  {
    type: 'input',
    name: 'localpath',
    message: '请输入你需要上传路径',
    validate(input) {
      return notNull.call(this, input, '上传路径不允许为空.');
    }
  },
  {
    type: 'input',
    name: 'serverpath',
    message: '请输入你主机的目标路径',
    validate(input) {
      return notNull.call(this, input, '目标路径不允许为空.');
    }
  }
];

/**
 * 收集上传信息.
 */
async function getInfomation() {

  const answers = await inquirer.prompt(deployInfoQuestions);
  // 用于存放上传信息.
  let infomations = {};
  // 存放确认信息.
  const confirmText = `
${emojis.alert} ${colors.warning('请确定你的上传信息:')}
    ${emojis.user}  用户名    :   ${colors.text(answers.username)},
    ${emojis.pass}  密码    :   ${colors.text(answers.password)},
    ${emojis.host}  主机    :   ${colors.text(answers.host)},
    ${emojis.localpath}  上传路径 :   ${colors.text(answers.localpath)},
    ${emojis.serverpath}  目标路径 :   ${colors.text(answers.serverpath)}
`;

  // 是否确定输入信息.
  const status = await inquirer.prompt([{
    type: 'confirm',
    name: 'confirmInfoStatus',
    message: confirmText,
    default: false
  }]);

  // 若不确定则重新收集信息.
  if (!status.confirmInfoStatus) {
    await getInfomation();
  }
  else {
    // 确认后存入
    infomations = answers;
  }

  return infomations;
}

module.exports = getInfomation;
