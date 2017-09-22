import Dropzone from './src/Dropzone.vue';

export default {
    install: function (Vue) {
        Vue.component('vue-dropzone', Dropzone);
    },
}
