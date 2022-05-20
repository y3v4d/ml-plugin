Vue.component('sprite-localized', {
    template: `
        <cc-array-prop :target.sync="target.spriteFrameSet"></cc-array-prop>
        <ui-prop name="Update Scene">
            <ui-button
            class="green tiny"
            @confirm="refresh"
            >
            Refresh
            </ui-button>
        </ui-prop>
    `,

    props: {
        target: {
            twoWay: true,
            type: Object
        }
    },

    methods: {
        refresh: function() {
            let Translator = cc.require('Translator');
            Translator.updateSceneRenderers();
        }
    }
})