import { readFile, writeFile, writeFileSync, unlink } from 'fs';
import fetch from "node-fetch";
import * as express from "express";
import { resolve } from 'dns';
import { rejects } from 'assert';


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

    public postGist(source_path: string, source_name: string, isBase64: boolean, isDelete: boolean, callback: (msg: string | any) => any) {
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
                console.log("gist: ", this.gist);
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
                    ).then(
                        (source_name) => {
                            if (isDelete) {
                                unlink(source_path, ((err) => {
                                    console.log(err);
                                }));

                            }
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
                content = Buffer.from(content, 'base64');

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

    /**
     * fetchGistExtensions
     */
    public fetchGistExtensions(source_name: string, ignoredExtensions: string[], installExtent: (exts: string,
        ignoredExtensions: string[], notificationCallBack: (...data: any[]) => void) => any, callback: (msg: string) => any,) {
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
            content = content;
            return content;
        }
        ).then(
            (content) => {
                installExtent(content, ignoredExtensions, callback);
                return "exts download finished";
            }

        ).then(callback);

    }


    /**
     * postGistV2
        just update or post gist  */
    public postGistV2(source: string, source_name: string, callback: (msg: string | any) => any) {
        const url = `https://gitee.com/api/v5/gists/${this.gist}`;
        var data = {
            access_token: this.access_token,
            files: {
                [`${source_name}`]: {
                    content: source
                }
            },
        };
        return new Promise((resolve, rejects) => {
            fetch(url,
                {
                    method: 'PATCH',
                    body: JSON.stringify(data),
                    headers: { 'Content-Type': 'application/json' },
                }).then(
                    res => {
                        callback(source_name);
                        resolve(res);
                    }
                ).catch(err => {
                    callback('ERROR: ' + err);
                    rejects(err);
                });
        }
        );
    }
}