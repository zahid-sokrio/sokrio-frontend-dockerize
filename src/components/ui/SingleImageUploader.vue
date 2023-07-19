<template>
    <div id="single-image-uploader" :class="{'has-error' : error}">
        <el-upload
                class="avatar-uploader"
                action="#"
                :show-file-list="false"
                :before-upload="beforeAvatarUpload"
                :on-change="uploadHandle"
                :auto-upload="false"
                :disabled="!!img"
        >
            <div v-if="imageUrl" class="position-relative product-image">
                <img :src="imageUrl" class="avatar" :style="`max-height: ${imageMaxHeight}`" alt=""/>
            </div>
            <div v-else class="avatar-uploader-text-area">
                <i v-if="!small" class="el-icon-plus mb-2"/>
                <div
                        class="px-1 upload-text"
                        :style="{fontSize: small ? '.65rem' : '.9rem'}"
                >{{ uploadText }}
                </div>
                <div
                        v-if="error && showErrorMessage"
                        class="px-1 mt-2 text-orange"
                        :style="{fontSize: '.65rem'}"
                >{{ error }}
                </div>
            </div>
        </el-upload>
        <div v-if="imageUrl && showImageRemover" class="clear-image" @click="clearImage">
            <i class="fa fa-trash"/>
        </div>
    </div>
</template>
<script>
    import {Upload} from 'element-ui';
    export default {
        name: "SingleImageUploader",
        components: {
            ElUpload: Upload
        },
        props: {
            img: {type: [String, File, Object], default: ''},
            imageMaxHeight: {type: String, default: ''},
            uploadText: {type: String, default: 'Upload Image'},
            imgGetUrl: {type: String, default: ''},
            error: {type: String, default: ''},
            small: {type: Boolean, default: false},
            showImageRemover: {type: Boolean, default: true},
            showErrorMessage: {type: Boolean, default: true}
        },
        data() {
            return {
                imageUrl: '',
            };
        },
        methods: {
            uploadHandle(file) {
                this.imageUrl = URL.createObjectURL(file.raw);
                this.$emit('update:img', file.raw);
                this.$emit('update:error', '');
            },
            beforeAvatarUpload(file) {
                // const isJPG = true;
                // const isLt2M = file.size / 1024 / 1024 < 2;
                //
                // if (!isJPG) {
                //     console.log('type error');
                //     this.$message.error('Avatar picture must be JPG format!');
                // }
                // if (!isLt2M) {
                //     console.log('mb error');
                //     this.$message.error('Avatar picture size can not exceed 2MB!');
                // }
                // return isJPG && isLt2M;
                return true;
            },
            clearImage() {
                this.imageUrl = ''; // remove img url must
                this.$emit('update:img', ''); // send for update
            }
        },
        watch: {
            img: {
                handler() {
                    if (this.img && !(this.img instanceof File) && this.imgGetUrl) {
                        this.$blob2Url(this.imgGetUrl)
                            .then(blob => {
                                this.imageUrl = blob;
                            });
                    } else if (!this.img) {
                        this.clearImage();
                    }
                },
                immediate: true,
                deep: true
            }
        }
    };
</script>
<style lang="scss">
    /* use transition in all non hover el (if a el inside hover use transition there also) otherwise ease in out wont work */
    #single-image-uploader {
        position: relative;
        height: 70%;
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        transition: all .4s ease-in-out;
        &:hover {
            border: 1px dashed #5e72e4;
            border-radius: 6px;;
            box-shadow: 0 3px 9px rgba(50, 50, 9, 0), 3px 4px 8px rgba(94, 114, 228, 0.1);
            color: #5e72e4 !important;
            cursor: pointer;
            &.has-error {
                border: 1px dashed #5e72e4;
                border-radius: 6px;
                transition: all .4s ease-in-out;
                .upload-text {
                    color: #5e72e4;
                    transition: all .4s ease-in-out;
                }
            }
            .clear-image {
                display: flex;
                position: absolute;
                top: 0;
                height: 100%;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                border-radius: 6px;
                width: 100%;
                color: white;
                background-color: rgba(0, 0, 0, .6);
                opacity: 0;
                transition: all .4s ease-in-out;
                &:hover {
                    opacity: .75;
                }
            }
        }
        &.has-error {
            border: 1px dashed #fb6340;
            border-radius: 6px;
            transition: all .4s ease-in-out;
            .upload-text {
                color: #fb6340;
                transition: all .4s ease-in-out;
            }
        }
        .clear-image {
            display: none;
        }
        .avatar-uploader {
            cursor: pointer;
            position: relative;
            overflow: hidden;
            display: inline-flex;
            flex-direction: column;
            justify-content: center;
            width: 100%;
            height: 100%;
            font-weight: bold;
            font-size: 1rem;
            i {
                font-weight: bold;
            }
            .el-upload--text {
                display: flex;
                flex-direction: column;
                justify-content: center;
                height: 100%;
                .avatar-uploader-text-area {
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }
                .product-image {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    img {
                        height: 100%;
                        width: auto;
                    }
                }
            }
        }
    }
</style>
