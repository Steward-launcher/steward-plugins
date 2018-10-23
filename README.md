[中文](./doc/README_CN.md)

Plugins are a core feature of Steward, and plugins make it quick and easy to do most of your daily browser operations.

Steward comes with a series of plugins, and also provides the plugin api, you can complete the development of the plugin you want with just a few lines of code.

## Plugins in Steward
Steward comes with plugins that can be divided into the following 4 categories.

- Browser plugin -- Convenience and enhancements to browser features such as bookmarks, history, etc.
- Extension's plugins -- Control other browser plugins via Steward, such as word cards
- Steward plugin -- Manage the features of Steward itself through plugins, such as NewTab, Wallpaper, etc.
- Other plugins -- Browser-independent plugins such as URL Block, Pocket Query, TODOList, etc.

## Plugin development
Since V3.5.1, Steward has opened the api and provided the plugin editor.

[Steward Plugins Repo](https://github.com/Steward-launcher/steward-plugins)

### Data structure
- `steward` Object

Plugin code is wrappered with `module.exports = function(steward) {}`，`steward` is the `api`

```javascript
{
    mode, // steward application mode: 'newTab' | 'popup' | 'content'
    config, // user config
    data, // steward data: { page: Object }
    chrome, // chrome api
    util, //
    dayjs, // date library
    $, // jquery
    axios, // http library
    constant //
}
```

- `plugin`

```javascript
{
    author, // id of author，such as your email or github account
    version, // version
    name, // plugin name，componse the uniqe id with `author`
    category: 'other', // category of plugin，just use `other`
    icon, // plugin icon
    title, // plugin title
    commands, // commaneds of plugin, required
    onInput, // core api, triggered when user enters
    onEnter // core api，triggered when user clicks one item or press enter / return
}

```

- `command` data structure

```javascript
{
    // command
    key, // { String } trigger of command
    type, // { String } type of command, enums，includes ['always', 'regexp', 'keyword', 'other', 'search']
        // For different query types and stages, usually fill in `keyword`
    title, // { String } title of command
    subtitle, // { String } subtitle or description of command
    icon // { String } icon of command
}
```

- Query result `item` data structure

```javascript
{
    // item
    key, // { String} item type: `CONSTANT.BASE.ITEM_TYPE`，enums, includes ['plugins', 'url', 'copy', 'action', 'app']
        // When the value is `plugins`, apply `item.id` as the new command
        // When the value is `url`，open `item.url` in a new tab
        // When the value is `copy`, copy `item.title` to the clipboard
        // When the value is `action`，emit 'action' event，usually processed by the page mode, todo
        // When the value is `app`，emit ''app:handle' event，such as 'Backup'
    universal, // { Boolean } Whether or not be universal item，when `true`，Steward will handle the item clicked by user
    icon, // { String } item icon url，usually the same as the plugin / commands icon
    title, // { String }
    desc // { String } 
}

```

### functions

#### plugin
- `onInput`

> core api，triggered by user input trigger + space

```javascript
  /**
  * @param { String } query User-entered string
  * @param { Object } command The command currently triggered by the user
  * @return { Promise[Array] | Array } Query results, support Promise and normal Array array
  */
  function onInput(query, command) {
      return Promise.resolve([Array[Item]]);
  }
```

- `onEnter`

> core api，Called when the user presses Enter/Return or clicks on a query result

```javascript
  /**
  * @param { Object } item Selected query result entry
  * @param { Object } command Currently triggered command
  * @param { String } query Current query string
  * @param { Boolean } shiftKey Whether of not the user presses the shift key at the same time
  * @param { Array } list All query results
  * @return { Promise[String | Boolean]}
  *           Promise[String] Applied as a new command to the input box
  *           Promise[Boolean] Only valid for page mode, Steward frame will be delayed when Boolean is false or Number value
  */
  function onEnter(item, command, query, shiftKey, list) {
      return Promise.resolve([String | Boolean | Number]);
  }
```

#### steward.util
- `getDefaultResult`

```javascript
/**
* Generate default query results based on command
* @param { Object } command Command defined in plugin
* @return { Array[Item] } Contains a default query result that is transparent to onEnter
*/
function getDefaultResult(command) {
}
```

- `getEmptyResult`
```javascript
/**
* Generate default empty query results based on command
* @param { Object } command Command defined in plugin
* @param { String | Optional } msg Empty query tip
* @return { Array[Item] } Contains a default empty query result that is transparent to onEnter
*/
function getEmptyResult(command, msg) {
}
```

- `copyToClipboard`

```javascript
/**
* Copy text to the clipboard
* @param { String } text The text to be copied
* @param { Boolean } showMsg Whether to pop up a prompt
* @return
*/
function copyToClipboard(text, showMsg) {
}
```

- `getParameterByName`

```javascript
/**
* @param { String } name param name
* @param { String } search default value: `window.location.search`
* @return { String } 
*/
function getParameterByName(name, search = window.location.search) {
}
```

- `toast` -- https://github.com/CodeSeven/toastr