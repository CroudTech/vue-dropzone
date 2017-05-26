
<template>
    <div>
      <div ref="dropzone">
          <slot name="dropzone-container">
              <slot name="dropzone-message">Drop files here to upload</slot>
          </slot>
      </div>
    </div>
</template>

<script>

import Dropzone from 'dropzone';
export default {

        data() {
            return {
                isLoading: this.uploading,
            }
        },

    props : {
        start: null,
        autostart: {
            default: true
        },
        multiple : {
            default : false
        },
        path : {
            default : '/document/upload-unlinked/'
        },
        file : {
            default : 'user_file'
        },
        files : {
            type: Array,
            default : () => []
        },
        target : {
            default : 'dropzone'
        },
        clickable : {
            default : false
        },
        previewTemplate : {
            default : '<div style="display:none"></div>'
        },
        createImageThumbnails : {
            default : false
        },
        uploading: false,
        headers: {},
    },
    data() {
        return {
            initialised: false
        }
    },
    computed: {
        multipleUploads() {
            return this.multiple ? true : false;
        }
    },
    watch: {
        start() {
            if (this.autostart || this.initialised) return
            this.build()
        }
    },
    methods: {
        build() {
            function setupDragon(uploader) {
                /* A little closure for handling proper
                   drag and drop hover behavior */
                var dragon = (function (elm) {
                  var dragCounter = 0;

                  return {
                    enter: function (event) {
                      event.preventDefault();
                      dragCounter++;
                      elm.classList.add('dz-drag-hover')
                    },
                    leave: function (event) {
                      dragCounter--;
                      if (dragCounter === 0) {
                        elm.classList.remove('dz-drag-hover')
                      }
                    }
                  }
                })(uploader.element);

                uploader.on('dragenter', dragon.enter);
                uploader.on('dragleave', dragon.leave);
            }

            if (this.initialised) return

            this.initialised = true

            Dropzone.autoDiscover = false;

            const params = {
                url: this.path,
                multiple: this.multiple,
                paramName: this.file,
                createImageThumbnails: this.createImageThumbnails,
                clickable: this.clickable,
                previewTemplate: this.previewTemplate,
                headers: this.headers,
                dragenter: function () {},
                dragleave: function () {},
                init: function() {
                    setupDragon(this)
                }
            };

            const dz = new Dropzone(this.$refs.dropzone, params);

            dz.on("processing", function() {
                if (params.setUrl) {
                  dz.options.url = params.setUrl()
                }
            });

            dz.on("sending", (file) => {
                this.$emit('file-sending', file);
                this.$emit('uploading', true);
                this.isLoading = true
            });

            dz.on("addedfile", (file) => {
                this.$emit('file-added', file);
                console.log('file added')
            });

            dz.on("success", (file, response) => {
                if (response.data)
                    response = response.data

                this.$emit('file-upload-success', response);
                this.isLoading = false
                if (!this.files) this.files = [];

                if (typeof response === 'string') {
                    response = JSON.parse(response);
                }

                this.files.push(response);
            });

            dz.on("error", (file, errorMessage, xhr) => {
                this.isLoading = false
                this.$emit('uploading', false);
                this.$emit('file-upload-error', {
                    file: file,
                    response: response,
                    xhr: xhr
                });
            });

            dz.on("queuecomplete", (file) => {
              this.$emit('uploading', false);
              this.$emit('file-upload-queue-completed', file);
            });
        }
    },

    mounted() {
        if (this.autostart)
            this.build()
    },

    watch: {
            isLoading() {
                this.$emit('set-loading', this.isLoading)
            },

            uploading() {
                this.isLoading = this.uploading
            },
        },
}

</script>
