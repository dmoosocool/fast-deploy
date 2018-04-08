# vue-deploy
将目录快速压缩, 发布到服务器上, 执行远端服务器脚本.

## Task List
- [x] 通过json文件夹读取用户配置信息
- [ ] 通过cli命令行读取用户配置信息
- [x] 通过账号密码登录远端服务器
- [ ] 通过private_key登录远端服务器
- [x] 压缩本地文件夹
- [x] 实现上传功能
- [x] 实现执行远端命令功能
- [ ] 封装成cli工具
- [ ] 文档完善
- [ ] 单元测试

## 快速开始

### 创建配置文件
在项目根目录中创建 deploy.config.json。
```javascript
{
  // 环境. 默认"test环境"
  "test": {
    // 远程服务器
    "host": "192.168.1.100",
    // 端口
    "port": "22",
    // 服务器账号
    "username": "root",
    // 服务器密码
    "password": "root",
    // 本地上传文件夹
    "localpath": "./uploads",
    // 上传到服务器的路径
    "serverpath": "/data/wwwroot/uploads",
    // 上传完执行的shell, 注意最后需要家exit\n
    "shell": "cd /data/wwwroot/maaoo.com/\nrm -rf *\nunzip /data/wwwroot/uploads/{upload_zip_name} -d ./\nnginx -s reload\nexit\n"
  },

  "prod": {
    "host": "119.28.32.43",
    "port": "22",
    "username": "root",
    "password": "root",
    "localpath": "./uploads",
    "serverpath": "/usr/local/wwwroot",
    "shell": "cd /data/wwwroot/maaoo.com/\nrm -rf *\nunzip /data/wwwroot/uploads/{upload_zip_name} -d ./\nnginx -s reload\nexit\n"
  }
}

```
### 开始上传
```nodejs
node index.js
```