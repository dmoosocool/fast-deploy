const archiver = require('archiver');
const fs = require('fs');
const path = require('path');
const moment = require('moment');

module.exports = async function(localpath, outpath, category) {
  let archiverZip = () => {
    return new Promise(function(resolve, reject){
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
        console.log('archiver has been finalized and the output file descriptor has closed.');
      });

      output.on('end', () => {
        console.log('Data has been drained');
        resolve();
      });

      archive.on('error', function(err) {
        reject(err);
      });

      // 将数据回档到文件.
      archive.pipe(output);
      archive.directory(path.join(process.cwd(), localpath), false, { date: new Date() });
      archive.finalize();

      console.log(path.join(process.cwd(), localpath));
    });
  };

  try{
    await archiverZip();
    console.log('压缩成功.');
  }catch(err){
    console.log(err);
  }
};