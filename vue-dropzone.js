var Dropzone = require('./src/Dropzone.vue');

module.exports = {
    install: function (Vue, options) {
        Vue.component('vue-dropzone', Dropzone);
    },
}
	