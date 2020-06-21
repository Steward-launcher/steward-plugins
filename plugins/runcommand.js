
module.exports = function (steward) {
  const version = 2;
  const author = 'solobat';
  const name = 'Run Command';
  const key = 'start';
  const type = 'keyword';
  const icon = 'https://file-paodin.nohabitlife.com/18da50660a75a8ccfc6f/Automation.png';
  const title = 'Run Steward Helper Command';
  const subtitle = 'Please install Steward Helper first';
  const commands = [{
      key,
      type,
      title,
      subtitle,
      icon
  }];
  // args: extId
  const extId = 'hcnekoladldejmeindnhpjkfhjadcick'

  function queryByFilter(query = '') {
    const filterByName = suggestions => steward.util.getMatches(suggestions, query, 'title');
    return new Promise(resolve => {
        chrome.runtime.sendMessage(extId, {
            action: 'listActions'
        }, ({ data = [] }) => {
           resolve((query ? filterByName(data) : data).map(actionFormat));
        });
    });
  }

  function actionFormat(item) {
    return {
        key,
        id: item.name,
        icon,
        title: item.name,
        desc: item.title
    }
  }

  function notice2RunCommand(item) {
    chrome.runtime.sendMessage(extId, {
      action: 'runCommand',
      data: {
        command: item.id
      }
    }, ({ data = [] }) => {
    });
  }

  function onInput(query, command) {
    return queryByFilter(query).then(items => {
      if (items && items.length) {
        return items
      } else {
        return steward.util.getDefaultResult(command);
      }
    })
  }

  function onEnter(item, command, query, keyStatus, list) {
    notice2RunCommand(item)
  }

  return {
      mode: 'content',
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
