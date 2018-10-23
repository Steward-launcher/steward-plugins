
module.exports = function (steward) {
    const version = 2;
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

    function detachSelectedTab() {
        chrome.tabs.getSelected(null, t => {
            if (t.id >= 0) {
                chrome.windows.create({ tabId: t.id, focused: true })
            }
        })
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

    function onInput(query, command) {
        const result = steward.util.getDefaultResult(command);

        result[0].isDefault = false;

        return Promise.resolve(result);
    }

    function onEnter(item, command, query, shiftKey, list) {
        if (command.key === 'det') {
            detachSelectedTab();
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
