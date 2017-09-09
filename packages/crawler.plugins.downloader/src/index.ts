import "reflect-metadata";
import { injectable, inject } from "inversify";
import { Seneca } from "crawler.plugins.common";

import { container } from "./container";

let seneca = new Seneca(container, {
    tag: "crawler.plugin.downloader"
});

seneca.seneca
    .ready(async () => {
        console.log("crawler.plugins.downloader plugin ready!");
    });

