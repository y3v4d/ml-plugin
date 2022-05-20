const Translator = require("./Translator");
const SpriteFrameEntry = require("./SpriteFrameEntry");

cc.Class({
    extends: cc.Component,

    properties: {
        spriteFrameSet: {
            default: [],
            type: [SpriteFrameEntry]
        },
        test: {
            default: 0
        }
    },

    onLoad() {
        this.sprite = this.getComponent(cc.Sprite);

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