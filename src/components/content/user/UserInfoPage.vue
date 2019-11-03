<template>
    <strong>
        <a-row class="info_row" type="flex" justify="start" align="middle">
            <a-col class="gutter-row" :span="3" :offset="5">
                <span class="info_label">头像：</span>
            </a-col>
            <a-col class="gutter-row" :span="6" :offset="2">
                <a-upload
                        name="file"
                        listType="picture-card"
                        class="avatar-uploader"
                        :showUploadList="false"
                        :action="uploadOssUrl"
                        @change="handleChange"
                >
                    <img v-if="info.avatar" :src="info.avatar" :width="102" :height="102" alt="avatar" />
                    <div v-else>
                        <a-icon :type="uploading ? 'loading' : 'plus'" />
                    </div>
                </a-upload>
            </a-col>
        </a-row>
        <a-row>
            <!-- 分割线 -->
            <a-col class="gutter-row" :span="13" :offset="5">
                <a-divider/>
            </a-col>
        </a-row>
        <a-row class="info_row" type="flex" justify="start" align="middle">
            <a-col class="gutter-row" :span="3" :offset="5">
                <span class="info_label">昵称：</span>
            </a-col>
            <a-col class="gutter-row" :span="6" :offset="2">
                <a-input size="large" v-model="info.name"/>
            </a-col>
        </a-row>
        <a-row>
            <!-- 分割线 -->
            <a-col class="gutter-row" :span="13" :offset="5">
                <a-divider/>
            </a-col>
        </a-row>
        <a-row class="info_row" type="flex" justify="start" align="middle">
            <a-col class="gutter-row" :span="3" :offset="5">
                <span class="info_label">性别：</span>
            </a-col>
            <a-col class="gutter-row" :span="6" :offset="2">
                <a-radio-group :options="genders" v-model="info.gender" />
            </a-col>
        </a-row>
        <a-row>
            <!-- 分割线 -->
            <a-col class="gutter-row" :span="13" :offset="5">
                <a-divider/>
            </a-col>
        </a-row>
        <a-row class="info_row" type="flex" justify="start" align="middle">
            <a-col class="gutter-row" :span="3" :offset="5">
                <span class="info_label">电子邮箱：</span>
            </a-col>
            <a-col class="gutter-row" :span="6" :offset="2">
                {{info.email}}
            </a-col>
        </a-row>
        <a-row>
            <!-- 分割线 -->
            <a-col class="gutter-row" :span="13" :offset="5">
                <a-divider/>
            </a-col>
        </a-row>
        <a-row class="info_row" type="flex" justify="start" align="middle">
            <a-col class="gutter-row" :span="3" :offset="5">
                <span class="info_label">手机号码：</span>
            </a-col>
            <a-col class="gutter-row" :span="6" :offset="2">
                <span v-if="info.phone.length > 0">{{info.phone}}<a-button :style="{marginLeft:'5px'}" size="small">更换</a-button></span>
                <a-button v-else>绑定手机号</a-button>
            </a-col>
        </a-row>
        <a-row>
            <!-- 分割线 -->
            <a-col class="gutter-row" :span="13" :offset="5">
                <a-divider/>
            </a-col>
        </a-row>
        <a-row class="info_row" type="flex" justify="start" align="middle">
            <a-col class="gutter-row" :span="3" :offset="5">
                <a-button type="primary" size="large" @click="saveInfo" :loading="loading">保存</a-button>
            </a-col>
        </a-row>
    </strong>
</template>

<script>
    import { USER_INFO_GET, USER_INFO_PUT, OSS_UPLOAD } from "@/components/constant/url_path";

    export default {
        name: "UserInfo",
        data() {
            return {
                genders: [
                    { label: '保密', value: 0 },
                    { label: '男', value: 1 },
                    { label: '女', value: 2 }
                ],
                info: {
                    name: '',
                    avatar: '',
                    email: '',
                    gender: 0,
                    phone: ''
                },
                uploading: false,
                uploadOssUrl: OSS_UPLOAD,
                loading: false
            }
        },
        created() {
            let _this = this;
            _this.$axios.get(USER_INFO_GET)
                .then(function (response) {
                    let code = response.data.code;
                    if (code == 200) {
                        _this.info.name = response.data.result.name;
                        _this.info.avatar = response.data.result.avatar;
                        _this.info.email = response.data.result.email;
                        _this.info.gender = response.data.result.sex;
                        _this.info.phone = response.data.result.phone;
                    } else {
                        _this.$message.info(response.data.message);
                    }
                })
                .catch(function () {
                    _this.$message.warn("获取用户信息失败");
                })
        },
        methods: {
            handleChange(info) {
                let _this = this;
                const status = info.file.status;
                if (status == 'uploading') {
                    _this.uploading = true;
                }
                if (status === 'done') {
                    _this.uploading = false;
                    let code = info.file.response.code;
                    if (code == 200) {
                        _this.info.avatar = info.file.response.result;
                    } else {
                        _this.$message.info(info.file.response.message);
                    }
                } else if (status === 'error') {
                    _this.uploading = false;
                    this.$message.error("图片上传失败");
                }
            },
            saveInfo() {
                let _this = this;
                _this.loading = true;
                _this.$axios.put([USER_INFO_PUT], {
                    name: _this.info.name,
                    sex: _this.info.gender,
                    avatar: _this.info.avatar
                }).then(function (response) {
                    let code = response.data.code;
                    _this.loading = false;
                    if (code == 200) {
                        _this.$message.success("保存成功")
                    } else {
                        _this.$message.info(response.data.message);
                    }
                }).catch(function () {
                    _this.loading = false;
                    _this.$message.info("系统异常，保存失败")
                })
            }
        }
    }
</script>

<style scoped>
    .info_label {
        font-size: 17px;
        color: #969696;
    }
    .info_row {
        margin-top: 20px;
    }
</style>