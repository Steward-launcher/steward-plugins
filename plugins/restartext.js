module.exports = function (steward) {
    const util = steward.util;
    const version = 1;
    const name = 'restartext';
    const type = 'keyword';
    const icon = steward.chrome.extension.getURL('iconfont/chrome.svg');
    const title = chrome.i18n.getMessage('restartext_title');
    const commands = [{
        key: 're',
        type: 'keyword',
        title: '重启扩展',
        subtitle: '重启指定的 Chrome 扩展',
        icon
    }];

    function onInput(query) {
        return new Promise((resolve, reject) => {
            try {
                steward.chrome.management.getAll(extensions => {
                    if (steward.chrome.runtime.lastError) {
                        util.toast.error('获取扩展列表失败');
                        resolve([]);
                        return;
                    }

                    const items = extensions
                        .filter(ext => ext.type === 'extension' && ext.enabled)
                        .map(ext => ({
                            icon: ext.icons && ext.icons[0] ? ext.icons[0].url : icon,
                            key: 'action',
                            title: ext.name,
                            desc: ext.description || ext.id,
                            id: ext.id
                        }));
                    
                    if (!query) {
                        resolve(items);
                        return;
                    }

                    const filtered = items.filter(item => {
                        return item.title.toLowerCase().includes(query.toLowerCase()) ||
                               item.desc.toLowerCase().includes(query.toLowerCase());
                    });
                    
                    resolve(filtered);
                });
            } catch (error) {
                util.toast.error('插件执行出错');
                resolve([]);
            }
        });
    }

    function onEnter(item, command, query, keyStatus) {
        return new Promise((resolve, reject) => {
            try {
                steward.chrome.management.setEnabled(item.id, false, () => {
                    if (steward.chrome.runtime.lastError) {
                        util.toast.error('禁用扩展失败');
                        resolve(false);
                        return;
                    }

                    setTimeout(() => {
                        steward.chrome.management.setEnabled(item.id, true, () => {
                            if (steward.chrome.runtime.lastError) {
                                util.toast.error('启用扩展失败');
                                resolve(false);
                                return;
                            }
                            util.toast.success('扩展已重启');
                            resolve(true);
                        });
                    }, 500);
                });
            } catch (error) {
                util.toast.error('插件执行出错');
                resolve(false);
            }
        });
    }

    return {
        author: 'solobat',
        version,
        name,
        category: 'browser',
        type,
        icon,
        title,
        commands,
        onInput,
        onEnter,
        canDisabled: true
    };
}; 