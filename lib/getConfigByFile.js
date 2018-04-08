const path = require('path');
const fs = require('fs');

/**
 * 从配置文件中获取配置信息
 * @param {String} configPath 配置文件默认路径为项目根目录下的'deploy.config.json', 也可指定文件路径.
 * @param {String} category   支持多环境发布, 默认为测试环境'test'.
 */
module.exports = async function(configPath = path.join(process.cwd(), './deploy.config.json'), category = 'test') {
  let fileConfig = await fs.readFileSync(configPath);
  
  return JSON.parse(fileConfig.toString())[category];
};