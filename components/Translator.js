let instance = null;

if(!window.ml_plugin) {
    window.ml_plugin = {
        languages: [],
        currentLanguage: ''
    }
}

if(CC_EDITOR) {
    Editor.Profile.load("profile://project/ml-plugin.json", (err, profile) => {
        if(err) {
            cc.error(err);
            return;
        }

        const current = profile.data.current_language || undefined;
        if(current !== undefined) {
            window.ml_plugin.currentLanguage = current;

            instance = i18n.create({
                values: window.ml_plugin.languages[current] || {}
            });
        }
    });
}

module.exports = {
    init(lang_id) {
        if(!CC_EDITOR) {
            if(!window.ml_plugin.languages[lang_id]) {
                throw new Error(`Can't find ${lang_id} language!`);
            }
        }

        if(lang_id === this.getCurrentLanguage()) return;

        let data = window.ml_plugin.languages[lang_id] || {};
        window.ml_plugin.currentLanguage = lang_id;
        instance = i18n.create({
            values: data
        });
    },

    isInitialized() {
        return instance !== null;
    },

    translate(id) {
        if(!instance) return id;

        return instance(id);
    },

    getCurrentLanguage() {
        return window.ml_plugin.currentLanguage;
    },

    updateSceneRenderers() {
        const rootNodes = cc.director.getScene().children;

        // update localized labels
        for(const root of rootNodes) {
            const labels = root.getComponentsInChildren("LabelLocalized");

            labels.forEach(l => {
                if(!l.node.active) return;

                l.updateLabel();
            });
        }

        // update localized sprites
        for(const root of rootNodes) {
            const sprites = root.getComponentsInChildren("SpriteLocalized");

            sprites.forEach(s => {
                if(!s.node.active) return;

                s.updateSprite();
            });
        }
    }
};