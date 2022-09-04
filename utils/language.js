'use strict';

const fs = require("fs");
const path = require("path");

module.exports = {
    createLanguage(name) {
        const TEMPLATE = fs.readFileSync(path.join(__dirname, './template.txt'), 'utf-8');
        const PATH = `db://assets/resources/ml-plugin/${name}.js`;

        return new Promise((resolve, reject) => {
            if(fs.existsSync(Editor.url(PATH))) {
                reject(`${name} language already exists`);
                return;
            }

            const data = TEMPLATE.replace("{{name}}", name);
            Editor.Ipc.sendToMain('ml-plugin:import-asset', PATH, data, function(err) {
                if(err) {
                    reject(err);
                    return;
                }

                resolve();
            });
        });
    },

    removeLanguage(name) {
        const PATH = "db://assets/resources/ml-plugin";

        return new Promise((resolve, reject) => {
            if(!fs.existsSync(Editor.url(`${PATH}/${name}.js`))) {
                Editor.log(`[ml-plugin] ${name}.js language file doesn't exist`)
                resolve();

                return;
            }

            Editor.assetdb.delete(`${PATH}/${name}.js`, function(err) {
                if(err) {
                    reject(err);
                    return;
                }

                resolve();
            });
        });
    }
};