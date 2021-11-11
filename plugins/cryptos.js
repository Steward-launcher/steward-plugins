module.exports = function (steward) {
  const version = 2;
  const author = "solobat";
  const name = "Crypto Prices";
  const key = "cc";
  const type = "keyword";
  const icon = "https://assets.coingecko.com/coins/images/1/small/bitcoin.png";
  const title = "Cryptocurrency prices";
  const subtitle = "List Cryptocurrency Prices";
  const commands = [
    {
      key,
      type,
      title,
      subtitle,
      icon,
      shiftKey: true,
    },
  ];

  // coingecko coin ids
  const idNameMap = {
      "immutable-x": "IMX",
      "ethereum-name-service": "ENS",
      "bitcoin": "BTC",
      "ethereum": "ETH",
      "filecoin": "FIL",
      "solana": "SOL",
      "fantom": "FTM",
      "uniswap": "UNI"
  }

  const tokens = [
    "bitcoin",
    "ethereum",
    "immutable-x",
    "ethereum-name-service",
    "filecoin",
    "solana",
    "fantom",
    "uniswap",
  ];
  
  const icons = {
    bitcoin: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
    binancecoin: 'https://assets.coingecko.com/coins/images/825/small/binance-coin-logo.png',
    ethereum: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
    uniswap: 'https://assets.coingecko.com/coins/images/12504/small/uniswap-uni.png',
    solana: 'https://assets.coingecko.com/coins/images/4128/small/coinmarketcap-solana-200.png',
    "immutable-x": 'https://assets.coingecko.com/coins/images/17233/small/immutable-x.jpeg',
    "ethereum-name-service": "https://assets.coingecko.com/coins/images/19785/small/acatxTm8_400x400.jpg",
    filecoin: 'https://assets.coingecko.com/coins/images/12817/small/filecoin.png',
    aave: 'https://assets.coingecko.com/coins/images/12645/small/AAVE.png',
    dydx: 'https://assets.coingecko.com/coins/images/17500/small/hjnIm9bV.jpg?1628009360',
    fantom: 'https://assets.coingecko.com/coins/images/4001/small/Fantom.png?1558015016',
  }

  function formatName(name) {
    return idNameMap[name];
  }

  function fetchList() {
    return steward.axios.get("https://api.coingecko.com/api/v3/simple/price", {
      params: {
        ids: tokens.join(","),
        vs_currencies: "usd",
      },
    });
  }

  function dataFormat(list) {
    return list.map((item) => {
      return {
        key: "coins",
        universal: true,
        icon: icons[item[0]] || icon,
        title: formatName(item[0]),
        desc: `Price: ${item[1].usd}`,
      };
    });
  }

  function onInput(query, command) {
    return fetchList()
      .then((results) => {
        const resp = results.data;

        if (resp) {
          return dataFormat(Object.entries(resp));
        } else {
          return steward.util.getDefaultResult(command);
        }
      })
      .catch(() => {
        return steward.util.getDefaultResult(command);
      });
  }

  function onEnter(item, command, query, shiftKey, list) {}

  return {
    author,
    version,
    name,
    category: "other",
    icon,
    title,
    commands,
    onInput,
    onEnter,
  };
};
