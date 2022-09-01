const Translator = require("./Translator");
const SpriteFrameEntry = require("./SpriteFrameEntry");

cc.Class({
    extends: cc.Component,

    properties: {
        spriteFrameSet: {
            default: [],
            type: [SpriteFrameEntry]
        }
    },

    onLoad() {
        this._initialized = false;

        if(!Translator.isInitialized()) {
            Translator.init();
        }
        
        this.updateSprite();
    },

    getSpriteFrameByLanguage(language) {
        for(let i = 0; i < this.spriteFrameSet.length; ++i) {
            if(this.spriteFrameSet[i].language === language) {
                return this.spriteFrameSet[i].spriteFrame;
            }
        }

        return null;
    },

    updateSprite() {
        if(!this._initialized) {
            this.sprite = this.getComponent(cc.Sprite);
            this._initialized = true;
        }
        
        const currentLanguage = Translator.getCurrentLanguage();

        let spriteFrame = this.getSpriteFrameByLanguage(currentLanguage);
        if(!spriteFrame) {
            console.error(`'${this.node.name}' doesn't have sprite for language '${currentLanguage}'`);
            return;
        }

        this.sprite.spriteFrame = spriteFrame;
    },

    editor: {
        menu: "ml-plugin/SpriteLocalized",
        executeInEditMode: true,
        requireComponent: cc.Sprite,
        disallowMultiple: true,

        inspector: "packages://ml-plugin/inspector/sprite-localized.js"
    }
});