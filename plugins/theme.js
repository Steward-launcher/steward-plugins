module.exports = function (steward) {
  const version = 2;
  const author = 'solobat';
  const name = 'Themes';
  const type = 'keyword';
  const icon = 'https://s1.ax1x.com/2020/06/22/NGUkWT.png';
  const title = 'Switch theme';
  const subtitle = 'Press return/enter to switch the status of the current theme';
  const commands = [{
      key: 'ts',
      type,
      title,
      subtitle,
      icon
  }];

  function setEnabled(id, enabled) {
    steward.chrome.management.setEnabled(id, enabled, function () {});
  }

  function getThemes(query, callback) {
    steward.chrome.management.getAll(function (themeList) {
        const matchThemes = themeList.filter(function (theme) {
          return theme.type === 'theme';
        });
        console.log("getThemes -> matchThemes", matchThemes)

        callback(matchThemes);
    });
  }

  function dataFormat(rawList) {
    return rawList.map(function (item) {
        const url = item.icons instanceof Array ? item.icons[item.icons.length - 1].url : '';
        const isWarn = item.enabled;

        return {
            key: 'ts',
            id: item.id,
            icon: url || icon,
            title: item.name,
            desc: item.description,
            meta: item,
            isWarn
        };
    });
  }

  function onInput(query) {
    return new Promise(resolve => {
        getThemes(query.toLowerCase(), function (matchThemes) {
            resolve(dataFormat(matchThemes));
        });
    });
  }

  function onEnter(item) {
    if (item && item.id) {
        setEnabled(item.id, !item.meta.enabled);
        window.slogs.push(`Enable: ${item.title}`);
        window.stewardApp.refresh();
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