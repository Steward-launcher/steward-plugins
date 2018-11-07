
module.exports = function (steward) {
    const version = 1;
    const author = 'solobat';
    const name = 'Stocks';
    const key = 'stocks';
    const type = 'keyword';
    const icon = 'https://i.imgur.com/Qc7XZqB.png';
    const title = '股票行情';
    const subtitle = '数据来自新浪财经';
    const commands = [{
        key,
        type,
        title,
        subtitle,
        icon
    }];
    const icons = {
        stockRed: 'https://i.imgur.com/oXSZKcG.png',
        stockGreen: 'https://i.imgur.com/bdF3bGs.png'
    };

    // NOTE: 在这里写上你的股票代码
    const codeList = [
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

    function getCodeList() {
        return codeList.map(item => item.toLowerCase());
    }
    
    const baseStockUrl = 'https://xueqiu.com/S';
    const api = {
        list: 'https://hq.sinajs.cn/list='
    }

    function dataFormat(list) {
        return list.map(item => {
            return {
                key: 'url',
                universal: true,
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
                });
        } catch (error) {
            return Promise.reject(null); 
        }
    }

    function fetchStocksData() {
        const codes = getCodeList().join(',');

        return steward.axios.request({
            method: 'GET',
            url: `${api.list}${codes}`,
            responseType: 'text'
        }).then(({ data }) => {
            return respHandle(data);
        });
    }

    function onInput(query, command) {
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

    function onEnter(item, command, query, shiftKey, list) {

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
