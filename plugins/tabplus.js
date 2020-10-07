
module.exports = function (steward) {
  const version = 1;
  const author = 'solobat';
  const name = 'Tabs plus';
  const type = 'keyword';
  const icon = 'https://i.imgur.com/QcoukjA.png';
  const title = 'Manage tabs in all the window';
  const subtitle = 'Manage tabs in all the window.';
  const commands = [{
      key: 'atab',
      type,
      title,
      subtitle,
      icon
  }];

  function getAllTabs(query) {
    return new Promise((resolve) => {
      chrome.windows.getAll({ populate: true }, function (wins) {
        if (wins.length) {
          const tabs = wins.reduce((memo, win) => {
            memo.push(...win.tabs)
            return memo
          }, [])
          
          const results = tabs.filter(function (tab) {
            return steward.util.matchText(query, `${tab.title}${tab.url}`);
          });

          resolve(results)
        } else {
          resolve([]);
        }
    });
    })
  }

  function dataFormat(list, command) {
    return list.map(function (item, index) {
        let desc = command.subtitle;

        return {
            key: command.key,
            id: item.id,
            icon: item.favIconUrl || chrome.extension.getURL('img/icon.png'),
            title: `[Win: ${item.windowId}]${item.title}`,
            desc,
            isWarn: item.active,
            raw: item
        };
    });
  }

  function onInput(query, command) {
      return getAllTabs(query).then(tabs => {
        return dataFormat(tabs, command)
      })
  }

  function updateWindow(winId, updateProperties) {
    return chrome.windows.update(winId, updateProperties);
  }

  function updateTab(id, updateProperties, winId) {
    if (updateProperties.active) {
      updateWindow(winId, {
        focused: true
      })
    }
    return chrome.tabs.update(id, updateProperties);
  }

  function activeOneTab(item) {
    updateTab(item.id, {
      active: true
    }, item.raw.windowId);
  }

  function onEnter(item, command, query, shiftKey, list) {
      if (command.key === 'atab') {
        activeOneTab(item);
      }
  }

  return {
      author,
      version,
      name,
      category: 'browser',
      icon,
      title,
      commands,
      onInput,
      onEnter
  };
}
