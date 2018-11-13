
module.exports = function (steward) {
    const version = 3;
    const author = 'solobat';
    const name = 'Tabs in window';
    const type = 'keyword';
    const icon = 'https://i.imgur.com/QcoukjA.png';
    const title = 'Manage tabs in the window';
    const subtitle = 'Detach a tab and also to attach all tabs from a window.';
    const commands = [{
        key: 'det',
        type,
        title,
        subtitle,
        icon
    }, {
        key: 'att',
        type,
        title,
        subtitle,
        icon
    }];

    function detachSelectedTab(item) {
        chrome.tabs.getSelected(null, t => {
            if (t.id >= 0) {
                if (!item.id) {
                    chrome.windows.create({ tabId: t.id, focused: true })
                } else {
                    chrome.tabs.move(t.id, {
                        windowId: item.id,
                        index: item.tabIndex + 1
                    }, console.log)
                }
            }
        })
    }

    function getOtherWindows() {
        return new Promise(resolve => {
            chrome.windows.getAll({ populate: true }, wins => {
                if (wins.length) {
                    let curWin;
    
                    curWin = wins.find(win => win.focused);

                    function getOthers() {
                        const otherWins = wins.filter(win => win.id !== curWin.id);

                        resolve(otherWins);
                    }
    
                    if (!curWin) {
                        // popup mode
                        chrome.windows.getLastFocused({ populate: true }, result => {
                            curWin = result;

                            getOthers();
                        }) 
                    } else {
                        getOthers();
                    }
                } else {
                    resolve([]);
                }
            });
        });
    }

    function attachTabs() {
        chrome.windows.getAll({ populate: true }, wins => {
            if (wins.length) {
                let curTabs = [];
                let curWin;
                let otherTabs = [];

                wins.forEach(win => {
                    if (win.focused) {
                        curTabs = win.tabs;
                        curWin = win;
                    } else {
                        otherTabs = otherTabs.concat(win.tabs);
                    }
                });

                function moveTabs() {
                    let i = curTabs.length;

                    otherTabs.forEach(({ id: tabId }) => {
                        chrome.tabs.move(tabId, { windowId: curWin.id, index: i++ }, console.log)
                    })
                }

                if (curWin) {
                    moveTabs();
                } else {
                    // popup mode
                    chrome.windows.getLastFocused({ populate: true }, result => {
                        curWin = result;
                        curTabs = result.tabs;
                        moveTabs();
                    })
                }
            } else {
                steward.util.toast('Only one window');
            }
        });
    }

    function getOtherWindowsResult() {
        return getOtherWindows().then(wins => {
            return wins.map(win => {
                const tab = win.tabs.pop();

                tab.index = win.tabs.length;

                return {
                    id: win.id,
                    icon: tab.favIconUrl || icon,
                    title: tab.title,
                    desc: 'detach to this window',
                    tabId: tab.id,
                    tabIndex: tab.index
                }
            });
        });
    }

    const defaultDetachResult = [
        {
            icon,
            title: 'Detach in a new window'
        }
    ];

    function onInput(query, command) {
        if (command.key === 'det') {
            return getOtherWindowsResult().then(items => {
                return defaultDetachResult.concat(items);
            });
        } else {
            const result = steward.util.getDefaultResult(command);

            result[0].isDefault = false;

            return Promise.resolve(result);
        }
    }

    function onEnter(item, command, query, shiftKey, list) {
        if (command.key === 'det') {
            detachSelectedTab(item);
        } else if (command.key === 'att') {
            attachTabs();
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
