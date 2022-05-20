'use strict';

const fs = require("fs");
const path = require("path");

module.exports = {
    createLanguage(name) {
        const TEMPLATE = fs.readFileSync(path.join(__dirname, './template.txt'), 'utf-8');
        const PATH = "db://assets/resources/ml-plugin";

        return new Promise((resolve, reject) => {
            if(fs.existsSync(Editor.url(`${PATH}/${name}.js`))) {
                reject(`${name} language already exists!`);
                return;
            }

            const data = TEMPLATE.replace("{{name}}", name);
            Editor.assetdb.create(`${PATH}/${name}.js`, data, function(err, results) {
                if(err) {
                    reject(err);
                    return;
                }

                Editor.Ipc.sendToMain('ml-plugin:import-asset', `${PATH}/${name}.js`);
                resolve();
            });
        });
    },

    removeLanguage(name) {
        const TEMPLATE = fs.readFileSync(path.join(__dirname, './template.txt'), 'utf-8');
        const PATH = "db://assets/resources/ml-plugin";

        return new Promise((resolve, reject) => {
            if(!fs.existsSync(Editor.url(`${PATH}/${name}.js`))) {
                Editor.log(`${name}.js language file doesn't exist! Removing language.`)
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