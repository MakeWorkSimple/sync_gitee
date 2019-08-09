import { URL, URLSearchParams } from "url";
import { Server } from "http";
import { createReadStream, readFile, writeFile } from 'fs';
import fetch from "node-fetch";
import * as express from "express";
import { resolve } from "dns";
import * as vscode from 'vscode';

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

    public postGist(source_path: string, source_name: string, callback: (msg: string) => any) {
        const url = `https://gitee.com/api/v5/gists/${this.gist}`
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

        readfile(source_path).then(
            (params: any) => {
                var _this = this;
                var data = {
                    access_token: _this.access_token,
                    files: {
                        [`${source_name}`]: {
                            content: params.toString()
                        }
                    },
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

    public fetchGist(source_path: string, source_name: string, callback: (msg: string) => any) {
        var url = `https://gitee.com/api/v5/gists?access_token=${this.access_token}&page=1&per_page=20`

        fetch(url,
            {
                method: 'get'
            }
        ).then(
            res => res.json()
        ).then(
            (result) => {
                let my_discribtion: any;
                result.forEach((item: any) => {
                    if (item.id === this.gist) {
                        my_discribtion = item
                    }
                })
                return my_discribtion.files;
            }
        ).then((files) => {
            console.log(files);
            let content = files[source_name].content;
            writeFile(source_path, content, (err) => {
                console.log(err)
            });
            return content
        }
        ).then(callback)
    }
}