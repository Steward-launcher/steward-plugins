
module.exports = function (steward) {
  const version = 1;
  const author = 'solobat';
  const name = 'NewTab Src';
  const key = 'ntsrc';
  const type = 'keyword';
  const icon = 'https://wx1.sinaimg.cn/large/6836364ely1ge0j4vfvzfj203k03k3yb.jpg';
  const title = 'Customize the URL of newtab';
  const subtitle = 'Type "reset" to restore the default page';
  const commands = [{
      key,
      type,
      title,
      subtitle,
      icon
  }];

  function onInput(query, command) {
      return steward.util.getDefaultResult(command);
  }

  const STORAGE_KEY = 'newtabSrc'

  function onEnter(item, command, query, keyStatus, list) {
    if (query === 'reset') {
      steward.chrome.storage.sync.remove(STORAGE_KEY, function() {
        steward.util.toast.success('Set successfully')
      })
    } else {
      steward.chrome.storage.sync.set({
        [STORAGE_KEY]: query
      }, function() {
        steward.util.toast.success('Set successfully')
      })
    }
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
