const archiver = require('archiver');
const fs = require('fs');
const path = require('path');
const moment = require('moment');

/**
 * 将文件夹打包.
 * @param {String} localpath 需要上传的本地目录.
 * @param {String} category 环境.
 */
module.exports = async function(localpath = path.join(process.cwd(), 'uploads'), category = 'test') {
  let archiverZip = () => {
    return new Promise( (resolve, reject) => {

      // 发布目录.
      let deployedDir = path.join(process.cwd(), 'deployed');
      // 判断deployed文件夹是否存在 如果不存在则创建, 
      if(!fs.existsSync(deployedDir)) {
        fs.mkdirSync(deployedDir);
      }
      // zip文件名
      let zipfilename = moment().format('YYYYMMDD_HHmmss_SSS') + '.zip';

      let output = fs.createWriteStream(path.join(deployedDir, zipfilename));
      let archive = archiver('zip', {
        zlib: { level: 9 }
      });

      output.on('close', () => {
        console.log(archive.pointer() + ' total bytes');
        resolve(zipfilename);
      });

      output.on('end', () => {
        console.log('Data has been drained');
        resolve(zipfilename);
      });

      archive.on('error', err => {
        reject(err);
      });

      // 将数据回档到文件.
      archive.pipe(output);
      archive.directory(path.join(process.cwd(), localpath), false, { date: new Date() });
      archive.finalize();

    });
  };

  try{
    return await archiverZip();
  }catch(err){
    console.log(err);
  }
};