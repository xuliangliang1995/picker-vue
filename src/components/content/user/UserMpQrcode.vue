<template>
    <a-row class="info_row" type="flex" justify="start" align="middle">
        <a-col class="gutter-row" :span="16" :offset="5">
            <a-upload
                    name="file"
                    listType="picture-card"
                    class="avatar-uploader"
                    :showUploadList="false"
                    :action="uploadOssUrl"
                    :accept="accept"
                    @change="handleChange"
            >
                <img v-if="qrcode" :src="qrcode" :width="250" :height="250" alt="avatar" />
                <div v-else :style="{'height':'250px', 'width':'250px'}">
                    <a-icon :style="{paddingTop:'120px'}" :type="uploading ? 'loading' : 'plus'" />
                </div>
            </a-upload>
            <a-alert message="上传后将展示在个人信息里" type="info" closable/>
        </a-col>
    </a-row>
</template>
<script>
    import { OSS_UPLOAD, MP_QRCODE_GET, MP_QRCODE_POST } from "@/components/constant/url_path";
    import {IMG_ACCEPT} from "@/components/constant/img_accept";

    export default {
        data() {
            return {
                uploadOssUrl:OSS_UPLOAD,
                qrcode: undefined,
                uploading: false,
                accept: IMG_ACCEPT
            }
        },
        created() {
            this.refresh();
        },
        methods: {
            refresh() {
                let _this = this;
                _this.$axios.get(MP_QRCODE_GET)
                    .then(function (response) {
                        if (response.data.code == 200) {
                            _this.qrcode = response.data.result;
                        } else {
                            _this.$message.info(response.data.message);
                        }
                    })
                    .catch(function () {
                        _this.$message.warn("获取个人公众号信息失败");
                    })
            },
            handleChange(info) {
                let _this = this;
                const status = info.file.status;
                if (status == 'uploading') {
                    _this.uploading = true;
                }
                if (status === 'done') {
                    let code = info.file.response.code;
                    if (code == 200) {
                        const qrcode_img = info.file.response.result;
                        _this.$axios.post(MP_QRCODE_POST, {
                            qrcode: qrcode_img
                        }).then(function (response) {
                            _this.uploading = false;
                            if (response.data.code == 200) {
                                _this.qrcode = qrcode_img;
                            } else {
                                _this.$message.info(response.data.message);
                            }
                        }).catch(function () {
                            _this.uploading = false;
                            _this.$message.warn("当前网络不稳定，请稍后重试。");
                        })
                    } else {
                        _this.uploading = false;
                        _this.$message.info(info.file.response.message);
                    }
                } else if (status === 'error') {
                    _this.uploading = false;
                    this.$message.error("图片上传失败");
                }
            }
        }
    }
</script>
<style>

</style>