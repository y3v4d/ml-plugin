const Translator = require("./Translator");

cc.Class({
    extends: cc.Component,

    properties: {
        label_id: {
            get: function() {
                return this._label_id;
            },
            set: function(value) {
                this._label_id = value;

                this.updateLabel();
            }
        },
        _label_id: ""
    },

    onLoad() {
        this.label = this.getComponent(cc.Label);

        if(!Translator.isInitialized()) {
            Translator.init();
        }

        this.updateLabel();
    },

    updateLabel() {
        this.label.string = Translator.translate(this._label_id);
    },

    editor: {
        menu: "ml-plugin/LabelLocalized",
        executeInEditMode: true,
        requireComponent: cc.Label,
        disallowMultiple: true
    }
});
