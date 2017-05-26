var Dropzone = require('./src/Dropzone.vue');

module.exports = {
    install: function (Vue) {
        Vue.component('vue-dropzone', Dropzone);
    },
}
