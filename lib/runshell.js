'use strict';
const Client = require('ssh2').Client;

/**
 * 执行shell脚本
 *
 * @param {String} host 主机ip
 * @param {String} port 端口
 * @param {String} username 用户名
 * @param {String} password 密码
 * @param {String} shell shell脚本.
 */
module.exports = async function(host, port, username, password, shell) {

  return new Promise((resolve, reject) => {
    const conn = new Client();
    conn.on('ready', () => {
      conn.shell((err, stream) => {
        if (err) console.log(err);
        stream.on('close', () => {
          conn.end();
          resolve();
        }).on('data', data => {
          // 执行命令时执行..

        }).on('error', err => {
          console.log('error', err);
          reject();
        }).stderr.on('data', data => {
          console.log('STDERR:' + data);
        });
        stream.end(shell);
      });
    }).connect({
      host,
      port,
      username,
      password,
    });
  });
};
