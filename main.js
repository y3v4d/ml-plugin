'use strict';

const fs = require("fs");
const path = require("path");

function makeResourceFolder(callback) {
    try {
        Editor.assetdb.refresh('db://assets/resources/ml-plugin', function (err, results) {
            if(err) {
                if(callback) callback(err);

                return;
            } else {
                if(callback) callback(null, results);
            }
        });
    } catch(err) {
        callback(err);
    }
}

module.exports = {
    load () {
        try {
            fs.mkdirSync(path.join(Editor.Project.path, "assets/resources/ml-plugin"), { recursive: true });
            Editor.success("[ml-plugin load] Successfully loaded ml-plugin.");
        } catch(error) {
            Editor.error(`[ml-plugin load] ${error}`);
        }
    },

    unload () {
        Editor.success("[ml-plugin] Successfully unloaded ml-plugin.");
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