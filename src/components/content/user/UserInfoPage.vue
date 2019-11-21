<template>
    <strong>
        <a-row class="info_row" type="flex" justify="start" align="middle">
            <a-col class="gutter-row" :span="3" :offset="5">
                <span class="info_label">头像：</span>
            </a-col>
            <a-col class="gutter-row" :span="6" :offset="4">
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
            <a-col class="gutter-row" :span="18" :offset="5">
                <a-divider/>
            </a-col>
        </a-row>
        <a-row class="info_row" type="flex" justify="start" align="middle">
            <a-col class="gutter-row" :span="3" :offset="5">
                <span class="info_label">昵称：</span>
            </a-col>
            <a-col class="gutter-row" :span="6" :offset="4">
                <a-input size="large" v-model="info.name" @blur="saveInfo"/>
            </a-col>
        </a-row>
        <a-row>
            <!-- 分割线 -->
            <a-col class="gutter-row" :span="18" :offset="5">
                <a-divider/>
            </a-col>
        </a-row>
        <a-row class="info_row" type="flex" justify="start" align="middle">
            <a-col class="gutter-row" :span="3" :offset="5">
                <span class="info_label">性别：</span>
            </a-col>
            <a-col class="gutter-row" :span="6" :offset="4">
                <a-radio-group :options="genders" v-model="info.gender" @change="saveInfo"/>
            </a-col>
        </a-row>
        <a-row>
            <!-- 分割线 -->
            <a-col class="gutter-row" :span="18" :offset="5">
                <a-divider/>
            </a-col>
        </a-row>
        <a-row class="info_row" type="flex" justify="start" align="middle">
            <a-col class="gutter-row" :span="3" :offset="5">
                <span class="info_label">电子邮箱：</span>
            </a-col>
            <a-col class="gutter-row" :span="6" :offset="4">
                {{info.email}}
            </a-col>
        </a-row>
        <a-row>
            <!-- 分割线 -->
            <a-col class="gutter-row" :span="18" :offset="5">
                <a-divider/>
            </a-col>
        </a-row>
        <a-row class="info_row" type="flex" justify="start" align="middle">
            <a-col class="gutter-row" :span="3" :offset="5">
                <span class="info_label">手机号码：</span>
            </a-col>
            <a-col class="gutter-row" :span="6" :offset="4">
                <span v-if="info.phone.length > 0">{{info.phone}}<a-button :style="{marginLeft:'5px'}" size="small" @click="showModal('更换手机号')">更换</a-button></span>
                <a-button v-else size="small" @click="showModal('绑定手机号')">绑定手机号</a-button>
            </a-col>
        </a-row>
        <a-row>
            <!-- 分割线 -->
            <a-col class="gutter-row" :span="18" :offset="5">
                <a-divider/>
            </a-col>
        </a-row>
        <a-row class="info_row" type="flex" justify="start" align="middle">
            <a-col class="gutter-row" :span="3" :offset="5">
                <span class="info_label">微信：</span>
            </a-col>
            <a-col class="gutter-row" :span="6" :offset="4">
                <span v-if="bind_wechat">
                    <img  :src="info.mpHeadImgUrl" :width="50" :height="50" alt="avatar" />
                    <!--{{info.mpNickName}}-->
                    <a-button :style="{marginLeft:'5px'}" size="small" @click="bindWechat">更换</a-button>
                </span>
                <a-button v-else size="small" @click="bindWechat">绑定微信</a-button>
            </a-col>
        </a-row>

        <a-modal
                :title="modal.title"
                :visible="modal.visible"
                @ok="handleOk"
                :confirmLoading="modal.confirmLoading"
                @cancel="handleCancel"
        >
            <a-form>
                <a-form-item :validate-status="phoneValidateStatus">
                    <a-input size="large" placeholder="请输入手机号" v-model="modal.phone" @change="phoneChange">
                        <a-icon slot="prefix" type="mobile" />
                    </a-input>
                </a-form-item>
                <a-form-item :validate-status="captchaValidateStatus">
                    <a-input size="large" placeholder="验证码" v-model="modal.captcha" @change="captchaChange">
                        <a-icon slot="prefix" type="safety" />
                        <a-button slot="suffix" type="primary" @click="sendCaptcha" :disabled="! modal.canSendCaptcha">{{modal.btnContent}}</a-button>
                    </a-input>
                </a-form-item>
            </a-form>
        </a-modal>
    </strong>
</template>

<script>
    import { USER_INFO_GET, USER_INFO_PUT, OSS_UPLOAD, USER_PHONE_PATCH, USER_PHONE_CAPTCHA_POST } from "@/components/constant/url_path";
    import { mapState, mapMutations } from 'vuex';
    import { UPGRADE_PRIVILEGE, UPDATE_SMS_CAPTCHA_ABLE, UPDATE_AVATAR } from "@/components/constant/mutation_types";

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
                    phone: '',
                    mpHeadImgUrl: undefined,
                    mpNickName: undefined
                },
                modal: {
                    phone: '',
                    captcha: '',
                    title: '',
                    visible: false,
                    confirmLoading: false,
                    checkPhone: false,
                    checkCaptcha: false,
                    canSendCaptcha: true,
                    totalSeconds: 0,
                    cloak: null,
                    btnContent: '获取验证码'
                },
                uploading: false,
                uploadOssUrl: OSS_UPLOAD,
                loading: false
            }
        },
        computed: {
            phoneValidateStatus() {
                let reg=/^[0-9]{11}$/;
                return (! this.modal.checkPhone) || reg.test(this.modal.phone) ? "success" : "warning";
            },
            captchaValidateStatus() {
                let reg=/^[0-9]{6}$/;
                return (! this.modal.checkCaptcha) || reg.test(this.modal.captcha) ? "success" : "warning";
            },
            ...mapState([
                    'privilege', 'bind_wechat'
            ])
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
                        _this.info.mpHeadImgUrl = response.data.result.mpHeadImgUrl;
                        _this.info.mpNickName = response.data.result.mpNickName;
                    } else {
                        _this.$message.info(response.data.message);
                    }
                })
                .catch(function () {
                    _this.$message.warn("获取用户信息失败");
                })
        },
        methods: {
            phoneChange() {
                this.modal.checkPhone = true;
                if (this.modal.phone.length > 11) {
                    this.modal.phone = this.modal.phone.substring(0, 11);
                }
            },
            captchaChange() {
                this.modal.checkCaptcha = true;
                if (this.modal.captcha.length > 6) {
                    this.modal.captcha = this.modal.captcha.substring(0, 6);
                }
            },
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
                        _this.saveInfo();
                    } else {
                        _this.$message.info(info.file.response.message);
                    }
                } else if (status === 'error') {
                    _this.uploading = false;
                    this.$message.error("图片上传失败");
                }
            },
            showModal(title) {
                this.modal.title = title;
                this.modal.visible = true;
            },
            sendCaptcha() {
                let _this = this;
                _this.modal.canSendCaptcha = false;
                _this.modal.checkPhone = true;
                _this.modal.checkCaptcha = false;
                if ("success" == this.phoneValidateStatus) {
                    if (_this.privilege) {
                        _this.$axios.post(USER_PHONE_CAPTCHA_POST, {
                            'phone': _this.modal.phone
                        }).then(function (response) {
                            let code = response.data.code;
                            if (code == 200) {
                                // 倒计时
                                _this.modal.totalSeconds = 60;
                                _this.modal.cloak = setInterval(function () {
                                    if (_this.modal.totalSeconds > 0) {
                                        _this.modal.canSendCaptcha = false;
                                        _this.modal.btnContent = _this.modal.totalSeconds + '秒后重新发送';
                                        _this.modal.totalSeconds --;
                                    } else {
                                        window.clearInterval(_this.modal.cloak);
                                        _this.modal.totalSeconds = 0;
                                        _this.modal.btnContent = '获取验证码';
                                        _this.modal.canSendCaptcha = true;
                                    }
                                }, 1000);

                                _this.$notification['success']({
                                    message: '发送成功',
                                    description:
                                        '验证码已通过短信发送至 ' + _this.modal.phone + ' ，如果没有收到，请稍后重试。',
                                });
                            } else {
                                _this.modal.canSendCaptcha = true;
                                _this.$message.warn(response.data.message);
                            }
                        }).catch(function () {
                            _this.modal.canSendCaptcha = true;
                            _this.$message.warn("验证码发送失败，请稍后重试。");
                        })
                    } else {
                        _this.upgradePrivilege({
                            privilege: true,
                            url: undefined
                        });
                        _this.modal.canSendCaptcha = true;
                    }
                }
            },
            handleOk() {
                let _this = this;
                _this.modal.checkPhone = true;
                _this.modal.checkCaptcha = true;
                _this.modal.confirmLoading = true;
                const phone = _this.modal.phone;
                if ("success" == this.phoneValidateStatus && "success" == this.captchaValidateStatus) {
                    _this.$axios.patch(USER_PHONE_PATCH, {
                        'phone': phone,
                        'captcha': _this.modal.captcha
                    }).then(function (response) {
                        _this.modal.confirmLoading = false;
                        let code = response.data.code;
                        if (code == 200) {
                            _this.$message.info("修改成功");
                            _this.updateSmsCaptchaAble(true);
                            _this.info.phone = phone;
                            _this.modal.visible = false;
                        } else {
                            _this.$message.warn(response.data.message);
                        }
                    }).catch(function () {
                        _this.modal.confirmLoading = false;
                        _this.$message.warn("系统异常，请稍后重试");
                    })
                }
            },
            handleCancel() {
                this.modal.visible = false;
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
                        _this.updateAvatar(_this.info.avatar);
                    } else {
                        _this.$message.info(response.data.message);
                    }
                }).catch(function () {
                    _this.loading = false;
                    _this.$message.info("系统异常，保存失败")
                })
            },
            ...mapMutations({
                'upgradePrivilege':UPGRADE_PRIVILEGE,
                'updateSmsCaptchaAble': UPDATE_SMS_CAPTCHA_ABLE,
                'updateAvatar': UPDATE_AVATAR
            }),
            bindWechat() {
                if (this.privilege) {
                    this.$router.push('/user/wechat');
                } else {
                    this.upgradePrivilege({
                        privilege: true,
                        url: '/user/wechat'
                    });
                }
            }
        }
    }
</script>

<style scoped>
    .info_label {
        font-size: 20px;
        color: #969696;
    }
    .info_row {
        margin-top: 20px;
    }
</style>