module.exports = {
    'update-scene-renderers': function(event, language) {
        const Translator = cc.require('Translator');

        Translator.init(language);
        Translator.updateSceneRenderers();

        if(event.reply) event.reply(null);
    }
}