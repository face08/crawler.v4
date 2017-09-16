import * as Seneca from "seneca";
import inversify, { injectable, inject } from "inversify";
import { Plugin, Add, Wrap, Init } from "crawler.plugins.common";
import * as bluebird from "bluebird";
import * as _ from "lodash";
import { Client } from "elasticsearch";

import { pluginEsName } from "../constants";

const _fields = [
    "protocol",
    "host",
    "query",
    "port",
    "path",
    "depth",
    "url",
    "crawlerCount",
    "errorCount",
    "error",
    "statusCode",
    "responseBody",
    "responseBodyText",
    "@timestamp",
    "status",
    "updatedAt"
];

@Plugin(pluginEsName)
@injectable()
export class EsStorePlugin {
    private client: Elasticsearch.Client;

    /**
     * 保存分析出来的链接地址
     * 先判断地址是不是已经在es中
     * 存在的话，则不存入queue中
     * @param urls 连接数组
     */
    @Add(`role:${pluginEsName},cmd:saveUrls`)

    private async saveUrls({ urls, esIndex, esType }: { urls: Array<any>, esIndex: string, esType: string }): Promise<Array<any>> {
        const urlsById = _.keyBy(urls, "_id");
        let docs: Array<any> = [];

        // console.log(urlsById,urls);

        _.forEach(urlsById, (url, key) => {
            docs.push({
                _index: esIndex,
                _type: esType,
                _id: key
            });
        });
        // 判断链接是否存在

        if (!docs.length) {
            return [];
        }

        let resources = await this.client.mget({
            body: {
                docs: docs
            },
            storedFields: ["statusCode"]
        });

        // 如果不存在，则新建；
        let newUrls = _.filter(resources.docs, (doc: any) => {
            if (doc.error && doc.error.type === "index_not_found_exception") {
                return true;
            }
            if (doc.found === false) {
                return true;
            }

            return false;
        });

        docs = [];
        // 保存新增的地址
        _.each(newUrls, (url) => {
            if (urlsById[url._id]) {
                docs.push({
                    create: {
                        _index: esIndex,
                        _type: esType,
                        _id: url._id
                    }
                });
                docs.push(this.pick(_.extend({ "@timestamp": Date.now(), status: "queued" }, urlsById[url._id]), _fields));
            }
        });
        if (docs.length) {
            let urlsResult = await this.client.bulk({
                body: docs
            });

            return urlsResult.items.map((url: any) => {
                if (url.create && url.create.created) {
                    return urlsById[url.create._id];
                }

                return null;
            });
        }

        return [];
    }

    /**
     * 存储当前的地址
     * @param queueItem  数据
     * @param esIndex    索引
     * @param esType     类型
     */
    @Add(`role:${pluginEsName},cmd:saveQueueItem`)

    private async saveQueueItem({ queueItem, esIndex, esType }: { queueItem: any, esIndex: string, esType: string }): Promise<any> {
        let docs: Array<any> = [];

        if (queueItem && queueItem._id) {
            docs.push({
                index: {
                    _index: esIndex,
                    _type: esType,
                    _id: queueItem._id
                }
            });
            queueItem.status = "complete";
            docs.push(this.pick(queueItem, _fields));

            if (docs.length) {
                return await this.client.bulk({
                    body: docs
                });
            }
        }

        return {};
    }

    /**
    * 存储当前的地址
    * @param result  数据
    * @param esIndex 索引
    * @param esType  类型
    */
    @Add(`role:${pluginEsName},cmd:saveResult`)
    private async saveResult({ result, id, esIndex, esType }: { id: string, result: any, esIndex: string, esType: string }): Promise<any> {
        let docs: Array<any> = [];

        if (result && id) {
            docs.push({
                index: {
                    _index: esIndex,
                    _type: esType,
                    _id: id
                }
            });

            docs.push(result);

            if (docs.length) {
                return await this.client.bulk({
                    body: docs
                });
            }
        }

        return {};
    }

    @Init()
    private async init(msg: any, options: any, globalOptions: any) {
        this.client = new Client(globalOptions);
        this.client.ping({
            requestTimeout: 1000
        }).then(() => {
            console.log("elasticsearh as well");
        }, (err: Error) => {
            console.log("elasticsearch cluster is down!");
        });

        await bluebird.delay(200);
    }

    @Add(`role:${pluginEsName},cmd:getItem`)
    private async getItem({ _id, esIndex, esType }: { _id: any; esIndex: string; esType: string }) {
        return await this.client.get({
            id: _id,
            index: esIndex,
            type: esType
        });
    }

    private pick(result: any, fields: Array<string>) {
        let res: any = {};

        _.each(fields, (field) => {
            let val: any = _.pick(result, field);

            if (val && val[field] !== undefined) {
                res[field] = val[field];
            }
        });

        return res;
    }
}
