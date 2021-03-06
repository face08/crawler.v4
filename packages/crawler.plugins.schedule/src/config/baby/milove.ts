let queueConfig = {
    "ignoreWWWDomain": true,
    "stripWWWDomain": false,
    "scanSubdomains": false,
    "host": "mamilove.com.tw",
    "initialProtocol": "https",
    "initialPort": 80,
    "stripQuerystring": false,
    "allowQueryParams": ["page"],
    "fetchConditions": [],
    "domainWhiteList": ["*mamilove.com.tw"],
    "filterByDomain": true
};

export default {
    "key": "mamilove",
    "prefech": 20,
    "initFlow": [{
        "key": "queue",
        "partten": "role:crawler.plugin.queue,cmd:queue",
        "title": "把地址queue化",
        "data": {
            "queueConfig": queueConfig,
            "urls": ["https://mamilove.com.tw/qa"]
        },
        "result": "${'queues':[$]}"
    }, {
        "key": "urls",
        "partten": "role:crawler.plugin.store.es,cmd:saveUrls",
        "title": "存储爬取到的urls",
        "jsonata": ["$.queues{'urls':[$]}"],
        "data": {
            "esIndex": "mamilove",
            "esType": "url"
        },
        "result": "${'saveUrls':$}"
    }, {
        "partten": `role:crawler.plugin.task,cmd:addItemToQueue`,
        "title": "把存储的url放入queue",
        "jsonata": ["$.saveUrls{'items':[$]}"],
        "data": {
            "key": "mamilove",
        }
    }],
    pages: [{
        "path": "/qa/:id",
        "title": "妈咪love详情页",
        "msgFlow": [{
            "partten": "role:crawler.plugin.downloader,cmd:html",
            "title": "下载页面",
            "jsonata": ["$.queueItem.{'queueItem':$}"],
            "data": {
                "save": false
            },
            "result": "${'queueItem':$}"
        }, {
            "partten": "role:crawler.plugin.html,cmd:html",
            "title": "解析页面",
            "jsonata": ["$.queueItem.{'queueItem':$}"],
            "result": "${'results':$}",
            "data": {
                "timeout$": 10000,
                "pages": [{
                    "key": "qa-detail",
                    "path": "/qa/:id",
                    "areas": [{
                        "key": "main",
                        "selector": [".qa-item-list"]
                    }],
                    "fieldKey": "",
                    "fields": {
                        "main": {
                            "data": [{
                                "key": "title",
                                "selector": [".qa-item-subject-link:eq(0)"],
                                "removeSelector": [],
                                "methodInfo": { "text": [] },
                                "htmlStrategy": "jsdom",
                                "dealStrategy": "normal"
                            }, {
                                "key": "createAt",
                                "selector": [".qa-item-info:eq(0)"],
                                "removeSelector": [".qa-item-author"],
                                "methodInfo": { "text": [] },
                                "htmlStrategy": "jsdom",
                                "dealStrategy": "normal",
                                "formats": [{
                                    "key": "regexp",
                                    "settings": { "regexp": "/\\d+/", "scope": "i", "index": 0 }
                                }, {
                                    "key": "num"
                                }]
                            }, {
                                "key": "content",
                                "selector": [".qa-item-content:eq(0)"],
                                "removeSelector": [],
                                "methodInfo": { "html": [] },
                                "dealStrategy": "normal"
                            }, {
                                "key": "age",
                                "selector": [".qa-item-right-status:eq(0) span:eq(-2) a"],
                                "removeSelector": [],
                                "methodInfo": { "html": [] },
                                "dealStrategy": "normal"
                            }, {
                                "key": "category",
                                "selector": [".qa-item-right-status:eq(0) span:eq(-1) a"],
                                "dealStrategy": "normal",
                                "methodInfo": { "text": [] }
                            }, {
                                "key": "comments",
                                "selector": [".qa-answer-list:eq(0) > .qa-answer-item"],
                                "htmlStrategy": "jsdom",
                                "dealStrategy": "array",
                                "data": [{
                                    "key": "content",
                                    "selector": [".qa-answer-item-content .qa-answer-content"],
                                    "methodInfo": { "text": [] },
                                    "formats": [{ "key": "trim", "settings": { "start": true, "end": true } }]
                                }, {
                                    "key": "like",
                                    "selector": [".qa-answer-like-num"],
                                    "methodInfo": { "attr": ["data-count"] },
                                    "formats": [{ "key": "num" }]
                                }]
                            }]
                        }
                    },
                    "enabled": true
                }]
            }
        }, {
            "partten": "role:crawler.plugin.store.es,cmd:saveResult",
            "title": "存储分析的数据",
            "jsonata": ["$combine($.results.result[]){'result':$}", "$.queueItem._id.{'id':$}"],
            "data": {
                "esIndex": "qa",
                "esType": "mamilove"
            }
        }, {
            "partten": `role:crawler.plugin.task,cmd:addItemToQueue`,
            "title": "把当前的queueItem放入数据处理queue，后面由导入到wordpress",
            "jsonata": ["$.queueItem{'items':[{'id':$._id,'url':$.url,'esIndex':'qa','esType':'mamilove'}]}"],
            "data": {
                "key": "mamilove",
                "routingKey": "qa.item"
            }
        }]
    }, {
        "path": "/qa",
        "title": "妈咪love列表页",
        "msgFlow": [{
            "partten": "role:crawler.plugin.downloader,cmd:html",
            "title": "下载页面",
            "jsonata": ["$.queueItem.{'queueItem':$}"],
            "data": {
                "save": false
            },
            "result": "${'queueItem':$}"
        }, {
            "partten": "role:crawler.plugin.queue,cmd:analyze",
            "title": "分析页面中的urls",
            "jsonata": ["$.queueItem.{'queueItem':$}"],
            "data": {
                "queueConfig": queueConfig,
                "discoverConfig": {
                    "whitePathList": [{ "path": "/qa", "enable": 1 }, { "path": "/qa/(\\d+)", "enable": 1 }]
                }
            },
            "result": "${'queues':$}"
        }, {
            "partten": `role:crawler.plugin.task,cmd:addItemToQueue`,
            "title": "把存储的url放入queue",
            "jsonata": ["$.saveUrls{'items':[$]}"],
            "data": {
                "key": "mamilove",
            }
        }, {
            "partten": "role:crawler.plugin.store.es,cmd:saveUrls",
            "title": "存储爬取到的urls",
            "jsonata": ["$.queues{'urls':[$]}"],
            "data": {
                "esIndex": "mamilove",
                "esType": "url"
            },
            "result": "${'saveUrls':$}"
        }, {
            "partten": "role:crawler.plugin.store.es,cmd:saveQueueItem",
            "title": "存储爬取到的urls",
            "jsonata": ["$.queueItem{'queueItem':$}"],
            "data": {
                "esIndex": "mamilove",
                "esType": "queueItem"
            }
        }]
    }]
};
