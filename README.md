# Settings Sync To Gitee

做一个简单同步vscode 配置的插件，因为github gist不知原因的
不可访问，所以国内会同步到码云，稍后会放出教程。

## Features

用于同步vscode设置到码云(gitee)
1. 设置gist地址
2. 设置access_token用于获取代码片段权限

### 创建gists

https://gitee.com/gists > 我的代码 > +代码片段 > 填写相应内容

然后会在 ![图片](https://raw.githubusercontent.com/MakeWorkSimple/sync_gitee/master/images/gists.png) 这里看到 gist id

注意: 
> gitee问题不能创建空gist，所以一定要创建一个文件

> 新创建的gists会有创建不成功现象，过几分钟再试就可以了。

### 生成access_token

设置 > 私人令牌 > +生成新令牌

默认会有全部权限，这里只勾选gists 即可，user_info 权限是必选。

### 使用方法

#### 上传配置

 命令行中 ![upload](https://raw.githubusercontent.com/MakeWorkSimple/sync_gitee/master/images/upload.png) 
 
> 命令为 `upload setting`

即可看到上传信息 
 ![msg](https://raw.githubusercontent.com/MakeWorkSimple/sync_gitee/master/images/msg.png) 

#### 下载配置

 ![upload](https://raw.githubusercontent.com/MakeWorkSimple/sync_gitee/master/images/download.png) 
 
 下载配置
 > 命令为 `download setting`

## Extension Settings

* `gitee.gist`: 设置 gist id
* `gitee.access_token`: 设置有gists权限的私人令牌

## Known Issues

未做特别分页处理，如果设置的代码没有在前20条则会获取失败，但是不会影响上传。
本次上传会连gitee配置同时上传，用于个人同步代码，如果需要不同人共用配置，则会加到下个版本
## Release Notes

联系地址（*bufubaoni@163.com*）
由于新建用户代码、片段会有部分延时，所以刚做完设置，有可能上传失败，所以可以延时几分钟设置


也感谢所有提出意见的人

### 0.1.0

1. 上传用户设置
2. 上传用户扩展设置
3. 上传用户的代码片段
4. 上传用户的快捷键设置

### 0.1.3
1. 修复了新安装插件不能上传的问题
### 0.1.5
1. 添加简易教程
### 0.1.6
1. 修复插件同步安装错误问题
### 0.1.8
1. 修复了本地已经安装插件后，安装远程插件无响应的问题
### 0.1.10
1. 优化搜索关键词
### 0.1.13
1. 上传后添加sync.lock文件记录当前上传时间
### 0.1.15
1. 修复1.47.0版本后插件加载问题
### 0.1.16
1. 上传`extension.json`, `syncGitee.json`文件时不再生成临时文件
### 0.1.17
1. 监听修改文件配置文件，会从新加载相关配置
### 0.1.18
1. 只有触发上传或者下载配置时候才会初始化输出
-----------------------------------------------------------------------------------------------------------

## 


**Enjoy!**
