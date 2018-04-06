const Client = require('scp2').Client;

module.exports = async function(host, port, user, pass, localpath, serverpath) {
  // 新建一个回话,
  let client = new Client({
    host: host,
    port: port,
    username: user,
    password: pass,
  });

  let err, status;

  let upload = () => {
    return new Promise(function(resolve, reject){
      client.upload( localpath, serverpath, function(err) {
        if(err){
          reject(err);
        }else{
          resolve(true);
        }
      });
    });
  }  

  try {
    return await upload();
  } catch(err) {
    console.log('上传失败.', err);
  }
};