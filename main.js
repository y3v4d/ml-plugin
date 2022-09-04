'use strict';

const fs = require("fs");
const path = require("path");

module.exports = {
    load () {
        try {
            fs.mkdirSync(path.join(Editor.Project.path, "assets/resources/ml-plugin"), { recursive: true });
        } catch(error) {
            Editor.error(`[ml-plugin load] ${error}`);
        }
    },

    // register your ipc messages here
    messages: {
        'open' () {
            Editor.Panel.open('ml-plugin');
        },
        'import-asset' (event, path, data) {
            Editor.assetdb.create(path, data, function(err, results) {
                if(err) {
                    if(event.reply) event.reply(err);
                    return;
                }

                const metaPath = `${path}.meta`;
                const meta = JSON.parse(fs.readFileSync(Editor.url(metaPath), 'utf-8'));

                meta.isPlugin = true;
                meta.loadPluginInEditor = true;

                setTimeout(() => {
                    Editor.assetdb.saveMeta(meta.uuid, JSON.stringify(meta), err => {
                        if(err) {
                            if(event.reply) event.reply(err);
                            return;
                        }
    
                        if(event.reply) event.reply(null);
                    });
                }, 500);
            });
        }
    }
};