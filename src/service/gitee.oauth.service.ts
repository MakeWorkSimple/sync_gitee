import { URL, URLSearchParams } from "url";
import { Server } from "http";
import { createReadStream, readFile } from 'fs';
import fetch from "node-fetch";
import * as express from "express";
import { resolve } from "dns";

export class GiteeOAuthService {
    public app: express.Express;
    // public access_token: string;
    // public server: Server;
    constructor(public access_token: any, public gist: any) {
        this.app = express();
        this.app.use(express.json(), express.urlencoded({ extended: false }));
        this.access_token = access_token;
        this.gist = gist;
    }

    public getGist(access_token: string, host: (json: string) => any) {
        const source_url = `https://gitee.com/api/v5/gists?access_token=${this.access_token}`;
        // const params = new URLSearchParams();

        // var params = { access_token: 'fff01e01ca9b35c31a8d9a7428aea009' };
        // var url = new URL(source_url);
        // Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
        fetch(source_url,
            {
                method: 'get',
                // body: params
            }).then(
                res => res.text()
            ).then(host)
    };

    public postGist(source_file: string, callback: (msg: string) => any) {
        var FormData = require('form-data')
        const url = `https://gitee.com/api/v5/gists/${this.gist}`
        var source_string = ""
        function readfile(path: string) {
            return new Promise((resolve, reject) => {
                readFile(path, 'utf8', (err, data) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    };
                    resolve(data);
                });
            });
        }


        // function post(params: any) {
        //     var _this = this;
        //     var data = {
        //         access_token: _this.access_token,
        //         files: {
        //             "setting.json": { content: params.toString() }
        //         },
        //         // "description": "description",
        //         // "id": "nprahk93x7fceds415uql98"

        //     };
        //     fetch(url,
        //         {
        //             method: 'PATCH',
        //             // body: params
        //             body: JSON.stringify(data),
        //             headers: { 'Content-Type': 'application/json' },
        //         }).then(
        //             res => res.text()
        //         ).then(callback)
        // }

        readfile(source_file).then(
            (params: any) => {
                var _this = this;
                var data = {
                    access_token: _this.access_token,
                    files: {
                        "setting.json": { content: params.toString() }
                    },
                    // "description": "description",
                    // "id": "nprahk93x7fceds415uql98"

                };
                fetch(url,
                    {
                        method: 'PATCH',
                        // body: params
                        body: JSON.stringify(data),
                        headers: { 'Content-Type': 'application/json' },
                    }).then(
                        res => res.text()
                    ).then(callback)
            }
        )

    }

}