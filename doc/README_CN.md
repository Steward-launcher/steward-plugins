从 V3.5.1 以后，Steward 开放了 api，并提供了 plugin 编辑器。

## 插件开发说明
你可以在[这个仓库](https://github.com/Steward-launcher/steward-documents)添加你的插件的帮助文档

### 数据结构
- `steward` 对象

代码包裹在 `module.exports = function(steward) {}` 中，`steward` 为注入的 `api`

```javascript
{
    mode, // steward application mode: 'newTab' | 'popup' | 'content'
    config, // user config
    data, // steward data: { page: Object }
    chrome, // chrome api
    util, // 工具 api
    dayjs, // 日期库
    $, // jquery
    axios, // http 库
    constant, // 常量
    storage // 支持 promise 的 chrome.storage 
    browser // https://github.com/mozilla/webextension-polyfill
}
```

- `plugin` 组成结构

```javascript
{
    author, // 开发者 id，比如邮箱或 github 账号
    version, // 版本号
    name, // 插件名，与 author 一起组成唯一识别 id(uid)
    category: 'other', // 插件类别，填 ‘other’ 就好，暂时没用
    icon, // 插件 icon
    title, // 插件标题
    commands, // 插件命令列表，不能为空
    onInit, // 插件初次使用时调用
    onInput, // 核心 api, 输入事件函数
    onEnter, // 核心 api，选中事件函数
    onLeave // 调用其它 command 时触发
}

```

- `command` 数据结构

```javascript
{
    // command
    key, // { String } command 的 trigger
    type, // { String } command 的类型，枚举值，包含['always', 'regexp', 'keyword', 'other', 'search']
        // 对应不同的查询类型及阶段，通常填 `keyword` 就好
    title, // { String } command 的标题
    subtitle, // { String } command 的副标题/描述
    icon // { String } command 的图标 url
}
```

- 查询结果 `item` 数据结构

```javascript
{
    // item
    key, // { String} 条目类型`CONSTANT.BASE.ITEM_TYPE`，枚举值有['plugins', 'url', 'copy', 'action', 'app']
        // 为 plugins 时，将 item.id 作为新的命令应用
        // 为 url 时，在新标签页打开 item.url
        // 为 copy 时，将 item.title 拷贝到剪贴板
        // 为 action 时，emit 'action' 事件，通常由页面模式的 website 接收处理，此处文档待完善
        // 为 app 时，emit ''app:handle' 事件，比如 'Backup' 备份
    universal, // { Boolean } 是否为通用条目，为 true 时，onEnter 将由 Steward 根据item.key 值处理
    icon, // { String } 条目图标 url，通常与 plugin / commands 图标相同
    title, // { String } 条目标题
    desc // { String } 条目副标题/描述
}

```

### 函数方法

#### plugin
- `onInput`

> 核心 api，用户输入 trigger + space 后触发

```javascript
  /**
  * @param { String } query 用户输入的字符串，比如输入框中为 `ip 192.168.1.1`，那么 `query` 就是 `192.168.1.1`
  * @param { Object } command 用户当前触发的命令，由于 plugin 支持多 commands，因此可用此参数来具体识别
  * @return { Promise[Array] | Array } 查询结果，支持 Promise 以及普通 Array 数组
  */
  function onInput(query, command) {
      return Promise.resolve([Array[Item]]);
  }
```

- `onEnter`

> 核心 api，用户按 Enter/Return 键或点击某条查询结果时调用

```javascript
  /**
  * @param { Object } item 选中的查询结果条目
  * @param { Object } command 当前触发的命令
  * @param { String } query 当前的查询字符串
  * @param { Object } keyStatus 用户按键状态: ctrlKey / shiftKey / metaKey / altKey
  * @param { Array } list 全部的查询结果
  * @return { Promise[String | Boolean]}
  *           Promise[String] 作为新的命令被应用到输入框中
  *           Promise[Boolean] 只对页面模式有效，在Boolean 为 false 时，Steward 弹框将延迟关闭
  */
  function onEnter(item, command, query, keyStatus, list) {
      return Promise.resolve([String | Boolean]);
  }
```

#### steward.util
- `createTab`
```javascript
/**
* 打开新标签页，根据 keyStatus.metaKey 为 true 时，在当前标签页打开
* @param { Object } item from onEnter
* @param { Object } keyStatus from onEnter
*/
function createTab(item, keyStatus) {
    // tabs.update() or tabs.create()
}
```

- `getDefaultResult`

```javascript
/**
* 根据 command 生成默认查询结果
* @param { Object } command 在 plugin 里定义的 command
* @return { Array[Item] } 包含一条对 onEnter 透明的默认查询结果
*/
function getDefaultResult(command) {
}
```

- `getEmptyResult`
```javascript
/**
* 根据 command 生成默认空查询结果
* @param { Object } command 在 plugin 里定义的 command
* @param { String | Optional } msg 空查询提示
* @return { Array[Item] } 包含一条对 onEnter 透明的默认空查询结果
*/
function getEmptyResult(command, msg) {
}
```

- `copyToClipboard`

```javascript
/**
* 将 text 拷贝到剪贴板
* @param { String } text 将要拷贝的文本
* @param { Boolean } showMsg 是否弹出提示
* @return
*/
function copyToClipboard(text, showMsg) {
}
```

- `getParameterByName`

```javascript
/**
* @param { String } name param name
* @param { String } search 默认为 window.location.search
* @return { String } 
*/
function getParameterByName(name, search = window.location.search) {
}
```

- `toast` -- https://github.com/CodeSeven/toastr

- 其它

#### steward.axios -- http库
https://github.com/axios/axios

#### steward.$ -- jquery

#### steward.dayjs -- 日期库
https://github.com/iamkun/dayjs

#### steward.constant -- steward 内置常量
具体可以自行 `console.log` 查看

### 图示
![](https://i.imgur.com/Au6AdPA.png)

## 示例
```javascript
module.exports = function(steward) {
  const version = 1;
  const author = 'solobat';
  const name = 'IP Search';
  const key = 'ip';
  const type = 'keyword';
  const icon = 'http://static.oksteward.com/ip.png';
  const title = '查询 ip';
  const subtitle = '输入 ipv4 地址，查询 ip 所在地点及运营商';

  // commands 为命令的数组，支持多个命令
  const commands = [{
	  key,
	  type,
	  title,
	  subtitle,
	  icon
  }];
  
  //============== 插件逻辑 =============//
  const APP_KEY = 'xxxxx';
  const ipRegexp = /\b((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.|$)){4}\b/;
  
  function searchIp(ip) {
	const url = `http://apis.juhe.cn/ip/ip2addr?ip=${ip}&key=${APP_KEY}`;
   
	  return steward.axios.get(url);
  }
  
  function dataFormat(data) {
	  return [
        {
            key,
            universal,
            icon,
            title: `${data.area} -- ${data.location}`,
            desc: '按 Enter 复制到剪贴板'
        }
      ];
  }

  function onInput(query, command) {
	  const str = query.trim();
	
	  if (str && ipRegexp.test(str)) {
		  return searchIp(str).then(results => {
			const resp = results.data;
			
			  if (resp.resultcode == 200) {
			  return dataFormat(resp.result); 
			} else {
			  return [];
			}
		  }).catch(results => {
			  return steward.util.getDefaultResult(command);
		  });
	  } else {
		  return steward.util.getDefaultResult(command); 
	  }
  }
  
  function onEnter(item, command, query, keyStatus, list) {
	  steward.util.copyToClipboard(item.title, true);
  }
  
  return {
	  author,
	  version,
	  name,
	  category: 'other',
	  icon,
	  title,
	  commands,
	  onInput,
	  onEnter
  };
}
```

## 更多 plugin 示例
见 `./plugins`