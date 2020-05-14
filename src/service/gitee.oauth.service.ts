import { readFile, writeFile, writeFileSync } from 'fs';
import fetch from "node-fetch";
import * as express from "express";


export class GiteeOAuthService {

    constructor(public access_token: any, public gist: any) {
        this.access_token = access_token;
        this.gist = gist;
    }

    public getGist(access_token: string, host: (json: string) => any) {
        const source_url = `https://gitee.com/api/v5/gists?access_token=${this.access_token}`;
        fetch(source_url,
            {
                method: 'get',
            }).then(
                res => res.text()
            ).then(host);
    }

    public postGist(source_path: string, source_name: string, isBase64: boolean, callback: (msg: string) => any) {
        const url = `https://gitee.com/api/v5/gists/${this.gist}`;
        function readfile(path: string) {
            return new Promise((resolve, reject) => {
                var code = 'utf8';
                if (isBase64) {
                    code = 'base64';
                } else {
                    code = 'utf8';
                }
                readFile(path, code, (err, data) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    }
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
                            content: params
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
                        res => {
                            return source_name;
                        }
                    ).then(callback).catch(err => {
                        callback('ERROR: ' + err);
                    });
            }
        );

    }

    public async fetchGist(source_path: string, source_name: string, isBase64: boolean, callback: (msg: string) => any) {
        var url = `https://gitee.com/api/v5/gists?access_token=${this.access_token}&page=1&per_page=20`;

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
                        my_discribtion = item;
                    }
                });
                return my_discribtion.files;
            }
        ).then((files) => {
            let content = files[source_name].content;

            if (isBase64) {
                content = new Buffer(content, 'base64');

            } else {
                content = content;
            }

            writeFile(source_path, content, (err) => {
                console.log(err);
            });


            return source_name;
        }
        ).then(callback);
    }
}