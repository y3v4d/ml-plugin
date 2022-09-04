'use strict';

const fs = require("fs");
const Language = Editor.require("packages://ml-plugin/utils/language");

// panel/index.js, this filename needs to match the one registered in package.json
Editor.Panel.extend({
    // css style for panel
    style: fs.readFileSync(Editor.url('packages://ml-plugin/panel/index.css')),
    template: fs.readFileSync(Editor.url('packages://ml-plugin/panel/index.html')),

    // element and variable binding
    $: {
        curr_lng_sel: '#curr-lng-sel',
        add_lng_inp: '#add-lng-inp',
        add_lng_btn: '#add-lng-btn',
        rm_lng_btn: '#rm-lng-btn'
    },

    profile: null,

    ready () {
        // setup profile and language select
        this.profile = Editor.Profile.load(`profile://project/ml-plugin.json`);
        
        for(let l of this.profile.data.languages) {
            this.addSelectOption(l);
        }

        let current = this.profile.data['current_language'];
        if(this.profile.data.languages.length != 0 && this.profile.data.languages.indexOf(current) === -1) {
            this.changeDefaultLanguage(this.profile.data.languages[0]);
        }

        this.$curr_lng_sel.value = this.profile.data['current_language'];

        // add event listeners to elements
        this.$add_lng_btn.addEventListener('confirm', this.onAddLanguageButtonClicked.bind(this));
        this.$rm_lng_btn.addEventListener('confirm', this.onRemoveLanguageButtonClicked.bind(this));
        this.$curr_lng_sel.addEventListener('confirm', this.onLanguageSelectValueChanged.bind(this));
    },

    // util functions
    addSelectOption(name) {
        let option = document.createElement("option");
        option.value = name;
        option.innerHTML = name;

        this.$curr_lng_sel.appendChild(option);
    },

    changeDefaultLanguage(name) {
        this.profile.data['current_language'] = name;
        this.profile.save();

        Editor.log(`[ml-plugin] Changed current language to ${(name === '' ? "undefined" : name)}`);

        // refresh the scene after language change
        Editor.Scene.callSceneScript('ml-plugin', 'update-scene-renderers', name, function(err, msg) {
            if(err) {
                Editor.error(`[ml-plugin changeDefaultLanguage] ${err}`);
                return;
            }

            Editor.log("[ml-plugin] Updated scene");
        });
    },

    onAddLanguageButtonClicked() {
        const value = this.$add_lng_inp.value;
        if(value.length == 0) {
            Editor.error(`[ml-plugin onAddLanguageButtonClicked] Language name field cannot be empty`);
            return;
        }

        Language.createLanguage(value).then(() => {
            this.addSelectOption(value);
            this.$add_lng_inp.value = "";

            const languages = this.profile.data.languages;
            languages.push(value);
            this.profile.data.languages = languages;
            this.profile.save();

            Editor.log(`[ml-plugin] Successfully added ${value} language`);

            if(this.profile.data.languages.indexOf(this.profile.data.currentLanguage) == -1) {
                this.changeDefaultLanguage(this.profile.data.languages[0]);
                this.$curr_lng_sel.value = this.profile.data.languages[0];
            }
        }).catch(err => Editor.error(`[ml-plugin onAddLanguageButtonClicked] ${err}`));
    },

    onRemoveLanguageButtonClicked() {
        const current = this.profile.data['current_language'];
        if(!current || current.length == 0) {
            Editor.error(`[ml-plugin onRemoveLanguageButtonClicked] No current language to remove`);
            return;
        }
            
        Language.removeLanguage(current).then(() => {
            const languages = this.profile.data.languages;
            languages.splice(languages.findIndex(o => o === current), 1);
            this.profile.data.languages = languages;

            this.$curr_lng_sel.removeChild(this.$curr_lng_sel.querySelector(`option[value="${current}"]`));
            this.$curr_lng_sel.value = this.profile.data.languages[0];

            Editor.log(`[ml-plugin] Successfully removed ${current} language`)

            this.changeDefaultLanguage(this.profile.data.languages[0] || '');
        }).catch(err => Editor.error(`[ml-plugin onRemoveLanguageButtonClicked] ${err}`));
    },

    onLanguageSelectValueChanged() {
        const value = this.$curr_lng_sel.value;
        this.changeDefaultLanguage(value);
    }
});