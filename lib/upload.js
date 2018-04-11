'use strict';
const Client = require('scp2').Client;

module.exports = async function(host, port, user, pass, localpath, serverpath) {
  // 新建一个回话,
  const client = new Client({
    host,
    port,
    username: user,
    password: pass,
  });

  const upload = () => new Promise((resolve, reject) => {
    client.upload(localpath, serverpath, err => {
      if (err) {
        reject(err);
      }
      else {
        client.close();
        resolve(true);
      }
    });
  });

  try {
    return await upload();
  }
  catch (err) {
    console.log('上传失败.', err);
  }
};
