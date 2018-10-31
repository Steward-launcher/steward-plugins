
module.exports = function (steward) {
    const version = 1;
    const author = 'solobat';
    const name = 'Hot Rank';
    const key = 'hot';
    const type = 'keyword';
    const icon = 'https://i.imgur.com/CDBL9t5.jpg';
    const title = '果汁排行榜';
    const subtitle = '数据来自 http://guozhivip.com';
    const commands = [{
        key,
        type,
        title,
        subtitle,
        icon
    }];
    const items = [{"title":"微博热搜","url":"https://s.weibo.com/top/summary?cate=realtimehot","icon":"http://guozhivip.com/rank/images/r1.jpg"},{"title":"百度风云榜","url":"http://top.baidu.com/","icon":"http://guozhivip.com/rank/images/r2.jpg"},{"title":"搜狗热搜榜","url":"http://top.sogou.com/home.html","icon":"http://guozhivip.com/rank/images/r3.jpg"},{"title":"360实时热点","url":"https://trends.so.com/hot","icon":"http://guozhivip.com/rank/images/r4.jpg"},{"title":"头条指数","url":"https://index.toutiao.com/","icon":"http://guozhivip.com/rank/images/r5.jpg"},{"title":"知乎热榜","url":"https://www.zhihu.com/billboard","icon":"http://guozhivip.com/rank/images/r6.jpg"},{"title":"贴吧热议榜","url":"http://c.tieba.baidu.com/hottopic/browse/topicList?res_type=1","icon":"http://guozhivip.com/rank/images/r7.jpg"},{"title":"抽屉新热榜","url":"https://dig.chouti.com/all/hot/24hr/1","icon":"http://guozhivip.com/rank/images/r8.jpg"},{"title":"豆瓣讨论精选","url":"https://www.douban.com/group/explore","icon":"http://guozhivip.com/rank/images/r6.jpg"},{"title":"V2EX最热","url":"https://www.v2ex.com/?tab=hot","icon":"http://guozhivip.com/rank/images/r7.jpg"},{"title":"胡润百富榜","url":"http://www.hurun.net/CN/HuList/Index","icon":"http://guozhivip.com/rank/images/r5.jpg"},{"title":"财富榜单","url":"http://www.fortunechina.com/rankings/index.htm","icon":"http://guozhivip.com/rank/images/r4.jpg"},{"title":"福布斯榜单","url":"http://www.forbeschina.com/list/","icon":"http://guozhivip.com/rank/images/r3.jpg"},{"title":"全网影视热搜榜","url":"https://v.qq.com/x/hotlist/search/?channel=555&source=common_nav_vs","icon":"http://guozhivip.com/rank/images/r2.jpg"},{"title":"电影票房榜","url":"http://www.cbooo.cn/","icon":"http://guozhivip.com/rank/images/b12.jpg"},{"title":"豆瓣电影榜","url":"https://movie.douban.com/chart","icon":"http://guozhivip.com/rank/images/b6.jpg"},{"title":"优酷指数榜","url":"http://top.youku.com/rank/?spm=a2htp.20023922.m_232715.5~5~5~5!2~5~H2~A","icon":"http://guozhivip.com/rank/images/b4.jpg"},{"title":"爱奇艺风云榜","url":"http://top.iqiyi.com/rebobang.html","icon":"http://guozhivip.com/rank/images/b7.jpg"},{"title":"搜狐视频榜","url":"https://tv.sohu.com/hothdtv/","icon":"http://guozhivip.com/rank/images/b3.jpg"},{"title":"热门短视频","url":"https://www.vmovier.com/hot#rotate-nav","icon":"http://guozhivip.com/rank/images/b2.jpg"},{"title":"B站热门排行","url":"https://www.bilibili.com/ranking?spm_id_from=333.334.banner_link.1","icon":"http://guozhivip.com/rank/images/b8.jpg"},{"title":"QQ音乐巅峰榜","url":"https://y.qq.com/n/yqq/toplist/4.html#stat=y_new.index.toplist.detail.4","icon":"http://guozhivip.com/rank/images/b9.jpg"},{"title":"云音乐飙升榜","url":"https://music.163.com/#/discover/toplist","icon":"http://guozhivip.com/rank/images/r3.jpg"},{"title":"虾米官方榜","url":"https://www.xiami.com/chart?spm=a1z1s.6843761.1110925385.2.8vQoSa","icon":"http://guozhivip.com/rank/images/r4.jpg"},{"title":"酷狗TOP500","url":"http://www.kugou.com/yy/rank/home/1-8888.html?from=rank","icon":"http://guozhivip.com/rank/images/r5.jpg"},{"title":"千千音乐榜","url":"http://music.taihe.com/top/","icon":"http://guozhivip.com/rank/images/r6.jpg"},{"title":"POCO人气摄影","url":"http://www.poco.cn/works/works_list?classify_type=0&works_type=week","icon":"http://guozhivip.com/rank/images/r7.jpg"},{"title":"泼辣有图","url":"http://www.polayoutu.com/collections","icon":"http://guozhivip.com/rank/images/r8.jpg"},{"title":"站酷摄影榜","url":"https://www.zcool.com.cn/top/product.do?rankId=76&rankProductCategory=33","icon":"http://guozhivip.com/rank/images/b10.jpg"},{"title":"京东排行榜","url":"http://top.jd.com/","icon":"http://guozhivip.com/rank/images/r7.jpg"},{"title":"界面金榜","url":"https://www.jiemian.com/lists/171.html","icon":"http://guozhivip.com/rank/images/b11.jpg"},{"title":"公众号排名","url":"https://www.newrank.cn/public/info/list.html?period=day&type=data","icon":"http://guozhivip.com/rank/images/r4.jpg"},{"title":"网站排行榜","url":"http://top.chinaz.com/","icon":"http://guozhivip.com/rank/images/r3.jpg"},{"title":"艾媒金榜","url":"http://www.iimedia.cn/#xinsan","icon":"http://guozhivip.com/rank/images/r2.jpg"},{"title":"卡思榜单","url":"https://www.caasdata.com/index/rank/index.html","icon":"http://guozhivip.com/rank/images/r1.jpg"},{"title":"App排行榜","url":"https://www.qimai.cn/rank","icon":"http://guozhivip.com/rank/images/r8.jpg"},{"title":"小程序排行榜","url":"http://www.aldzs.com/toplist","icon":"http://guozhivip.com/rank/images/r7.jpg"},{"title":"游戏排行榜","url":"http://top.17173.com/","icon":"http://guozhivip.com/rank/images/b10.jpg"},{"title":"小游戏排行榜","url":"http://www.4399.com/flash/ph.htm","icon":"http://guozhivip.com/rank/images/r8.jpg"},{"title":"主播排行榜","url":"http://www.xiaohulu.com/anchor2/","icon":"http://guozhivip.com/rank/images/r7.jpg"}];

  	function dataFormat(items) {
     	return items.map(item => {
        return {
          key: 'url',
          universal: true,
         	title: item.title,
          icon: item.icon,
          url: item.url
        };
      }); 
    }
    function onInput(query, command) {
      	const result = dataFormat(items.filter(item => steward.util.matchText(query, item.title)));
        return Promise.resolve(result);
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
