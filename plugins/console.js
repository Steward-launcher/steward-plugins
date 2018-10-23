
module.exports = function (steward) {
    const version = 1;
    const author = 'solobat';
    const name = 'console';
    const key = '>';
    const type = 'keyword';
    const icon = 'http://static.oksteward.com/icon128.png';
    const title = 'console';
    const subtitle = 'execute code';
    const commands = [{
        key,
        type,
        title,
        subtitle,
        icon
    }];

    function dataFormat(result) {
        if (typeof result !== 'object') {
            return [
                {
                    key: 'copy',
                    univarsal: true,
                    icon,
                    title: result
                }
            ];
        } else {
            const arr = Array.from(result);

            if (arr.length) {

            } else {
                return [{
                    key: 'copy',
                    univarsal: true,
                    icon,
                    title: result.toString()
                }]
            }
        }
    }

    function onInput(query, command) {
        try {
            const result = eval(query);
            console.log(result);

            return Promise.resolve(dataFormat(result));
        } catch (error) {
            
        }
    }

    function onEnter(item, command, query, shiftKey, list) {
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
