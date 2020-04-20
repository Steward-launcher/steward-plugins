
module.exports = function (steward) {
  const version = 1;
  const author = 'solobat';
  const name = 'Wiki';
  const key = 'wk';
  const type = 'keyword';
  // TODO
  const icon = '';
  const title = 'wiki';
  const subtitle = 'Confluence Wiki';
  const commands = [{
      key,
      type,
      title,
      subtitle,
      icon
  }];

  // TODO
  const HOST = ''
  const SERVER_URL = `${HOST}/rest/quicknav/1/search`

  function dataFormat(list) {
    return list.reduce((memo, sublist) => {
      const arr = sublist.map(item => {
        return {
          key: 'url',
          id: item.id,
          icon: `${HOST}/images/icons/profilepics/default.png`,
          universal: true,
          title: item.name,
          desc: item.href,
          url: `${HOST}${item.href}`
        }
      })
      return memo.concat(arr)
    }, [])
  }

   function getQuery(query) {
      return new Promise((resolve, reject) => {
          fetch(`${SERVER_URL}?query=${query}&_=${Number(new Date)}`)
              .then(resp => resp.json())
              .then(results => {
                  resolve(dataFormat(results.contentNameMatches))
              })
              .catch(() => {
                  reject()
              })
      })
  }

  function onInput(query, command) {
      // return a promise 
      return getQuery(query).then(results => {
        if (results && results.length) {
          return results;
        } else {
          return steward.util.getDefaultResult(command);
        }
      });
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
