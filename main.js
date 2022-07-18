'use strict';

const fs = require("fire-fs");
const path = require("path");

function makeResourceFolder(callback) {
    try {
        fs.ensureDirSync(path.join(Editor.Project.path, "./assets/resources/ml-plugin"));

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
        /*try {
            Editor.assetdb.isMount("db://ml-plugin-shared-resource");

            Editor.error(`[ml-plugin load] Shared resource already mounted!`);
        } catch(err) {
            Editor.assetdb.mount(
                Editor.url("packages://ml-plugin/components"), 
                "ml-plugin-shared-resource",
                { icon: "icon-lock" },
                function(err) {
                    if(err) Editor.error(`[ml-plugin load] ${err}`);
                    else {
                        Editor.success("[ml-plugin load] Mounted shared resources");

                        makeResourceFolder(function(err, results) {
                            if(err) Editor.error(`[ml-plugin load] ${err}`);
                            else Editor.success(`[ml-plugin load] Refreshed resources!`);
                        });
                    }
            });
        }*/

        makeResourceFolder(function(err, results) {
            if(err) Editor.error(`[ml-plugin load] ${err}`);
            else Editor.success(`[ml-plugin load] Refreshed resources!`);
        });
    },

    unload () {
        /*try {
            Editor.assetdb.isMount("db://ml-plugin-shared-resource");
            Editor.assetdb.unmount(
                "ml-plugin-shared-resource",
                function(err) {
                    if(err) Editor.error(`[ml-plugin unload] ${err}`);
                    else Editor.success("[ml-plugin unload] Unmounted shared resources");
            });
        } catch(err) {
            Editor.log(`[ml-plugin unload] ${err}`)
        }*/
    },

    // register your ipc messages here
    messages: {
        'open' () {
            Editor.Panel.open('ml-plugin');
        },
        'refresh-resource' () {
            makeResourceFolder(function(err, results) {
                if(err) Editor.error(`[ml-plugin refresh-resource] ${err}`);
                else Editor.success(`[ml-plugin refresh-resource] Refreshed!`);
            });
        },
        'test-init' () {
            Editor.assetdb.init(function (err, results) {
                if(err) Editor.error(`[ml-plugin test-init] ${err}`);
                else Editor.success(`[ml-plugin test-init] Initialized successfully`);
            });
        },
        'mount' () {
            Editor.assetdb.mount(
                Editor.url("packages://ml-plugin/components"), 
                "ml-plugin-shared-resource",
                function(err) {
                    if(err) Editor.error(`[ml-plugin mount] ${err}`);
                    else {
                        Editor.success("[ml-plugin mount] Mounted shared resources");
                    }
            });
        },
        'unmount' () {
            Editor.assetdb.unmount(
                "ml-plugin-shared-resource",
                function(err) {
                    if(err) Editor.error(`[ml-plugin unmount] ${err}`);
                    else {
                        Editor.success("[ml-plugin unmount] Unmounted shared resources");
                    }
            });
        },
        'attach' () {
            Editor.assetdb.attachMountPath('ml-plugin-shared-resource', function (err, results) {
                if(err) Editor.error(`[ml-plugin attach] ${err}`);
                else Editor.success(`[ml-plugin attach] Attached shared resources.`)
              });
        },
        'unattach' () {
            Editor.assetdb.unattachMountPath('ml-plugin-shared-resource', function (err, results) {
                if(err) Editor.error(`[ml-plugin unattach] ${err}`);
                else Editor.success(`[ml-plugin unattach] Unattached shared resources.`)
            });
        },
        'is_mounted' () {
            try {
                Editor.assetdb.isMountByPath(Editor.url("db://ml-plugin-shared-resource"));

                Editor.success("[ml-plugin debug] Shared resource mounted!");
            } catch(err) {
                Editor.success("[ml-plugin debug] Shared resource not mounted!");
            }
        },
        'import-asset' (event, path) {
            Editor.assetdb.refresh(path, function(err, results) {
                if(err) {
                    Editor.error(err);
                    return;
                }
                
                const metaPath = path + ".meta";
                const meta = JSON.parse(fs.readFileSync(Editor.url(metaPath), 'utf-8'));

                meta.isPlugin = true;
                meta.loadPluginInEditor = true;

                Editor.assetdb.saveMeta(meta.uuid, JSON.stringify(meta), err => {
                    if(err) {
                        Editor.error(err);
                        return;
                    }
                });
            });
        }
    }
};