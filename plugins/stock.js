/**
 * stocks: 我的自选股, ctrl + Enter 移除选中的自选
 * code: 查询股票代码, Enter 添加自选
 */

module.exports = function (steward) {
    const version = 5;
    const author = 'solobat';
    const name = 'Stocks';
    const type = 'keyword';
    const icon = 'https://i.imgur.com/Qc7XZqB.png';
    const title = '股票行情';
    const commands = [{
        key: 'stocks',
        type,
        title: '股票行情',
        subtitle: '数据来自新浪财经',
        icon
    }, {
        key: 'code',
        type,
        title: '股票代码查询',
        subtitle: '数据来自雪球',
        icon
    }];
    const icons = {
        stockRed: 'https://i.imgur.com/oXSZKcG.png',
        stockGreen: 'https://i.imgur.com/bdF3bGs.png'
    };

    let codeList;
    const STORAKE_KEY = 'stocks_codelist';
    const browser = steward.browser;

    function restoreCodeList() {
        return browser.storage.sync.get(STORAKE_KEY).then(resp => {
            codeList = resp[STORAKE_KEY] || [
                'sh601238',
                'sh600816',
                'sh600332',
                'sh600703',
                'sh600487',
                'sh600887',
                'sz000895',
                'sh601668',
                'sh600999',
                'sh601006',
                'sz000651',
                'sz002142',
                'sz000963'
            ];

            return codeList;
        });
    }

    function getCodeList() {
        if (codeList) {
            return Promise.resolve(codeList.map(item => item.toLowerCase()));
        } else {
            return restoreCodeList().then(() => {
                return Promise.resolve(codeList.map(item => item.toLowerCase()));
            });
        }
    }

    function saveCodeList() {
        return browser.storage.sync.set({
            [STORAKE_KEY]: codeList
        });
    }

    function updateCodeList(code, action = 'add') {
        const fixedCode = code.toLowerCase();
        const index = codeList.indexOf(fixedCode);

        if (index === -1) {
            if (action === 'add') {
                codeList.push(fixedCode);

                return saveCodeList();
            } else {
                return Promise.reject('无效的操作');
            }
        } else {
            if (action === 'remove') {
                codeList.splice(index, 1);

                return saveCodeList();
            } else {
                return Promise.reject('股票代码已经存在');
            }
        }
    }
    
    const baseStockUrl = 'https://xueqiu.com/S';
    const api = {
        list: 'https://hq.sinajs.cn/list='
    }

    function dataFormat(list) {
        return list.map(item => {
            return {
                key: 'url',
                code: item.code,
                icon: item.isUp ? icons.stockRed : icons.stockGreen,
                title: `${item.name}[${item.code}]`,
                desc: `涨幅: ${item.isUp ? '+' : ''}${item.percent} -- 当前价格: ${item.price} -- 昨日收盘价${item.predayPrice}`,
                url: `${baseStockUrl}/${item.code}`
            };
        });
    }

    function respHandle(resp) {
        try {
            return resp.replace(/var\s/g, '').split(';')
                .filter(str => str.indexOf('=') !== -1)
                .map(str => {
                    const arr = str.split('=');
                    const data = arr[1].split(',');
                    const code = arr[0].split('_').pop().toUpperCase();
                    const percent = ((data[3] / data[2] - 1)* 100).toFixed(2);
                    const isUp = percent >= 0;

                    return {
                        code,
                        name: data[0].substr(1),
                        predayPrice: data[2],
                        price: data[3],
                        percent: `${((data[3] / data[2] - 1)* 100).toFixed(2)}%`,
                        isUp
                    };
                })
                .sort((a, b) => parseFloat(a.percent, 10) > parseFloat(b.percent, 10) ? -1 : 1);
        } catch (error) {
            return Promise.reject(null); 
        }
    }

    function fetchStocksData() {
        return getCodeList().then(list => {
            const codes = list.join(',');

            return steward.axios.request({
                method: 'GET',
                url: `${api.list}${codes}`,
                responseType: 'text'
            }).then(({ data }) => {
                return respHandle(data);
            });
        });
    }

    function handleStocksInput(command) {
        return fetchStocksData()
            .then(list => {
                if (list && list.length) {
                    return dataFormat(list);
                } else {
                    return steward.util.getEmptyResult(command);
                }
            })
            .catch(() => {
                return steward.util.getEmptyResult(command);
            });
    }

    function queryCode(query) {
        return steward.axios.get('https://xueqiu.com/stock/search.json', {
            params: {
                code: query,
                size: 50
            }
        }).then(({ data }) => {
            return data.stocks;
        });
    }

    function handleCodeInput(query, command) {
        if (query) {
            return queryCode(query).then(stocks => {
                return stocks.map(item => {
                    return {
                        icon,
                        title: `${item.name}: ${item.code}`,
                        desc: `${item.ind_name}`,
                        code: `${item.code}`
                    }
                });
            });
        } else {
            return steward.util.getDefaultResult(command);
        }
    }

    function onInput(query, command) {
        if (command.key === 'stocks') {
            return handleStocksInput(command);
        } else if (command.key === 'code') {
            return handleCodeInput(query, command);
        }
    }

    function handleStocksEnter(item, keyStatus) {
        if (keyStatus.shiftKey) {
            // 打开主要财务指标页面，方便查看 ROA/ROE/PE
            chrome.tabs.create({ url: item.url + '/detail#/ZYCWZB' });
        } else if (keyStatus.ctrlKey) {
            updateCodeList(item.code, 'remove').then(() => {
                steward.util.toast.success('删除自选成功');
                window.stewardApp.applyCommand('stocks ');
            });
        } else {
            chrome.tabs.create({ url: item.url });
        }
    }

    function handleCodeEnter(item) {
        return updateCodeList(item.code).then(() => {
            steward.util.toast.success('添加自选成功');
            window.stewardApp.applyCommand('code ');
        }).catch(msg => {
            steward.util.toast.warning(msg);
        });
    }

    function onEnter(item, command, query, keyStatus, list) {
        if (command.key === 'stocks') {
            handleStocksEnter(item, keyStatus);
        } else if (command.key === 'code') {
            handleCodeEnter(item);
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
