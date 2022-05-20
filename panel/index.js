'use strict';

const Language = Editor.require("packages://ml-plugin/utils/language");

// panel/index.js, this filename needs to match the one registered in package.json
Editor.Panel.extend({
    // css style for panel
    style: `
        :host {
            display: flex;
            flex-flow: column;
            
            margin: 5px;
        }

        .middle {
            flex: 1 1 auto;

            display: flex;
            flex-flow: column;
        }

        .footer {
            flex: 0 1 30px;

            display: flex;

            align-items: center;
            justify-content: flex-end;
        }

        .prop {
            display: flex;

            justify-content: space-between;
            align-items: center;

            width: 100%;
        }

        .prop-name {
            width: 40%;
        }

        .prop-field {
            width: 60%;

            display: flex;
            align-items: center;
        }

        #add-lng-ipt {
            width: 100%;
        }
    `,

    // html template for panel
    template: `
        <h1>Configuration</h1>

        <div class="middle">
            <div class="prop">
                <p class="prop-name">Add language</p>
                
                <div class="prop-field">
                    <ui-input id="add-lng-ipt" placeholder="Type a name..."></ui-input>
                    <ui-button id="add-lng-btn">Add</ui-button>
                </div>
            </div>
            <div class="prop">
                <p class="prop-name">Choose current language</p>

                <ui-select id="curr-select" class="prop-field"></ui-select>
            </div>
        </div>
        
        <div class="footer">
            <ui-button id="rm-btn" class="red">Remove current language</ui-button>
        </div>
    `,

    // element and variable binding
    $: {
        current_select: '#curr-select',
        input: '#add-lng-ipt',
        btn: '#add-lng-btn',
        rm_btn: '#rm-btn'
    },

    profile: null,

    ready () {
        // setup profile and language select
        this.profile = this.profiles.project;
        for(let l of this.profile.data.languages) {
            this.addSelectOption(l);
        }

        let current = this.profile.data['current_language'];
        if(this.profile.data.languages.length != 0 && this.profile.data.languages.indexOf(current) === -1) {
            this.changeDefaultLanguage(this.profile.data.languages[0]);
        }

        this.$current_select.value = this.profile.data['current_language'];

        // add event listeners to elements
        this.$btn.addEventListener('confirm', this.onAddLanguageButtonClicked.bind(this));
        this.$rm_btn.addEventListener('confirm', this.onRemoveLanguageButtonClicked.bind(this));
        this.$current_select.addEventListener('confirm', this.onLanguageSelectValueChanged.bind(this));
    },

    // util functions
    addSelectOption(name) {
        let option = document.createElement("option");
        option.value = name;
        option.innerHTML = name;

        this.$current_select.appendChild(option);
    },

    changeDefaultLanguage(name) {
        this.profile.data['current_language'] = name;
        this.profile.save();

        Editor.success(`[ml-plugin changeDefaultLanguage] Changed current language to ${(name === '' ? "undefined" : name)}!`);

        // refresh the scene after language change
        Editor.Scene.callSceneScript('ml-plugin', 'update-scene-renderers', name, function(err, msg) {
            if(err) {
                Editor.error(`[ml-plugin changeDefaultLanguage] ${err}`);
                return;
            }

            Editor.success(`[ml-plugin changeDefaultLanguage] ${msg}`);
        });
    },

    // element callbacks
    onAddLanguageButtonClicked() {
        const value = this.$input.value;
        if(value.length == 0) {
            Editor.error(`[ml-plugin onAddLanguageButtonClicked] Language name field cannot be empty!`);
            return;
        }

        Language.createLanguage(value).then(() => {
            this.addSelectOption(value);
            this.$input.value = "";

            this.profile.data.languages.push(value);
            this.profile.save();

            Editor.success(`[ml-plugin onAddLanguageButtonClicked] Successfully added ${value} language!`);

            if(this.profile.data.languages.indexOf(this.profile.data.currentLanguage) == -1) {
                this.changeDefaultLanguage(this.profile.data.languages[0]);
                this.$current_select.value = this.profile.data.languages[0];
            }
        }).catch(err => Editor.error(`[ml-plugin onAddLanguageButtonClicked] ${err}`));
    },

    onRemoveLanguageButtonClicked() {
        const current = this.profile.data['current_language'];
        if(!current || current.length == 0) {
            Editor.error(`[ml-plugin onRemoveLanguageButtonClicked] No current language to remove!`);
            return;
        }
            
        Language.removeLanguage(current).then(() => {
            this.profile.data.languages.splice(this.profile.data.languages.findIndex(o => o === current), 1);

            this.$current_select.removeChild(this.$current_select.querySelector(`option[value="${current}"]`));
            this.$current_select.value = this.profile.data.languages[0];

            Editor.success(`[ml-plugin onRemoveLanguageButtonClicked] Successfully removed ${current} language!`)

            this.changeDefaultLanguage(this.profile.data.languages[0] || '');
        }).catch(err => Editor.error(`[ml-plugin onRemoveLanguageButtonClicked] ${err}`));
    },

    onLanguageSelectValueChanged() {
        const value = this.$current_select.value;
        this.changeDefaultLanguage(value);
    }
});