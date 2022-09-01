const Translator = require("./Translator");
const SpineSetEntry = require("./SpineSetEntry");

cc.Class({
    extends: cc.Component,

    properties: {
        defaultAnimation: "",
        playOnStart: true,
        spineSets: {
            default: [],
            type: [SpineSetEntry]
        }
    },

    onLoad() {
        this.spine = this.getComponent(sp.Skeleton);
        this._initialized = true;

        if(!Translator.isInitialized()) {
            Translator.init();
        }
        
        this.updateSpine();
        
        if(this.playOnStart) {
            this.spine.setAnimation(0, this.defaultAnimation, this.spine.loop);
        }
    },

    getSkinByLanguage(language) {
        for(let i = 0; i < this.spineSets.length; ++i) {
            if(this.spineSets[i].language === language) {
                return this.spineSets[i].skin;
            }
        }

        return null;
    },

    updateSpine() {
        if(!this._initialized) {
            //this.spine = this.getComponent(sp.Skeleton);
            //this._initialized = true;
            return;
        }
        
        const currentLanguage = Translator.getCurrentLanguage();

        let skinName = this.getSkinByLanguage(currentLanguage);
        if(!skinName) {
            console.error(`'${this.node.name}' doesn't have skin for language '${currentLanguage}'`);
            return;
        }

        this.spine.setSkin(skinName);
    },

    editor: {
        menu: "ml-plugin/SpineLocalized",
        executeInEditMode: true,
        requireComponent: sp.Skeleton,
        disallowMultiple: true
    }
});