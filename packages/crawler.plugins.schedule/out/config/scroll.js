"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    "key": "scroll-qa",
    "title": "qa的配置",
    "purge": true,
    "delay": 500,
    "prefech": 3,
    "startPartten": "role:crawler.plugin.plugin,cmd:startNormalFlow",
    "initFlow": [{
            "partten": "role:crawler.plugin.store.es,cmd:scroll",
            "title": "init--开始循环遍历es",
            "data": {
                "esIndex": "qa",
                "esType": "mamilove"
            },
            "result": "${'scroll':$}"
        }, {
            "partten": "role:crawler.plugin.task,cmd:addItemToQueue",
            "title": "把存储的数据放入queue",
            "jsonata": ["$.{'items':$map($.scroll.hits.hits,function($v,$k,$i){ {'hit':$v} })}"],
            "data": {
                "key": "scroll-qa",
                "routingKey": "crawler.url.qa"
            }
        }, {
            "partten": "role:crawler.plugin.task,cmd:addItemToQueue",
            "title": "把存储的数据放入queue",
            "jsonata": ["$.{'items':[{'scrollId':$.scroll._scroll_id}]}"],
            "data": {
                "key": "scroll-qa"
            }
        }],
    "msgFlow": [{
            "partten": "role:crawler.plugin.store.es,cmd:scroll",
            "title": "开始循环遍历es",
            "jsonata": ["$.{'scrollId':$.scrollId}"],
            "data": {
                "esIndex": "qa",
                "esType": "mamilove"
            },
            "result": "${'scroll':$}"
        }, {
            "partten": "role:crawler.plugin.task,cmd:addItemToQueue",
            "title": "把存储的数据放入queue",
            "jsonata": ["$.{'items':$map($.scroll.hits.hits,function($v,$k,$i){ {'hit':$v} })}"],
            "data": {
                "key": "scroll-qa",
                "routingKey": "crawler.url.qa"
            }
        }, {
            "partten": "role:crawler.plugin.task,cmd:addItemToQueue",
            "title": "把存储的数据放入queue",
            "condition": "$not($.scroll.hits.hits)",
            "jsonata": ["$.{'items':[{'scrollId':$.scroll._scroll_id}]}"],
            "data": {
                "key": "scroll-qa"
            }
        }]
};
//# sourceMappingURL=scroll.js.map