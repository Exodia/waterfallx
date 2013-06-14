﻿//本地调试配置
if (KISSY.Config.debug) {
    KISSY.config({
        packages: [
            {
                name: "gallery",
                tag: "20111220",
                path: "../../../",  // 开发时目录, 发布到cdn上需要适当修改
                ignorePackageNameInUri: true,
                charset: "utf-8"
            }
        ]
    })
}

KISSY.use("gallery/waterfallx/1.0/index, ajax, node, button", function(S, Waterfall, io,  Node, Button) {
    var $ = Node.all;

    var tpl = $('#tpl').html(),
        nextpage = 1,
        waterfall = new Waterfall.Loader({
        container:"#ColumnContainer",
        load:function(success, end) {
            $('#loadingPins').show();
            S.IO({
                data:{
                    'method': 'flickr.photos.search',
                    'api_key': '5d93c2e473e39e9307e86d4a01381266',
                    'tags': 'rose',
                    'page': nextpage,
                    'per_page': 20,
                    'format': 'json'
                },
                url: 'http://api.flickr.com/services/rest/',
                dataType: "jsonp",
                jsonp: "jsoncallback",
                success: function(d) {
                    // 如果数据错误, 则立即结束
                    if (d.stat !== 'ok') {
                        alert('load data error!');
                        end();
                        return;
                    }
                    // 拼装每页数据
                    var items = [];
                    S.each(d.photos.photo, function(item) {
//                        item.height = Math.round(Math.random()*(300 - 180) + 180); // fake height
                        items.push(new S.Node(S.substitute(tpl,item)));
                    });
                    success(items);
                    // 如果到最后一页了, 也结束加载
                    nextpage = d.photos.page + 1;
                    if (nextpage > d.photos.pages) {
                        end();
                    }
                },
                complete: function() {
                    $('#loadingPins').hide();
                }
            });
        },
        minColCount:2,
        colWidth:228
    });

    // scrollTo
    $('#BackToTop').on('click', function(e) {
        e.halt();
        e.preventDefault();
        $(window).stop();
        $(window).animate({
            scrollTop:0
        },1,"easeOut");
    });

    var b1 = new Button({
        content: "停止加载",
        render: "#button_container"
    });

    // 点击按钮后, 停止瀑布图效果
    b1.render();
    b1.on("click", function() {
        waterfall.destroy();
    });
});
