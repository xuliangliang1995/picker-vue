<template>
    <div>
        <a-row type="flex" justify="space-around">
            <a-col :span="6">
                <a-radio-group v-model="value">
                    <a-radio-button value="0"><a-icon type="mail" /> 邮箱</a-radio-button>
                    <a-radio-button value="1" :disabled="! sms_captcha_able"><a-icon type="message"/> 短信</a-radio-button>
                    <a-radio-button value="2"><a-icon type="wechat"/> 微信</a-radio-button>
                </a-radio-group>
                <a-input
                        v-model="captcha"
                        class="input-captcha"
                        size="large"
                        @change="captchaChange"
                        placeholder="验证码"
                >
                    <a-icon
                            slot="prefix"
                            type="safety"
                            style="color: rgba(0,0,0,.25)"
                    />
                    <a-button v-if="loading" slot="suffix" type="primary" loading>
                        校验中
                    </a-button>
                    <a-button v-if="! loading" slot="suffix" type="primary" :disabled="disabled"   @click="getCaptcha">
                        {{btnContent}}
                    </a-button>
                </a-input>
            </a-col>
        </a-row>
    </div>
</template>

<script>
    import { USER_EMAIL_CAPTCHA_GET, USER_SMS_CAPTCHA_GET, USER_PRIVILEGE_POST, USER_WECHAT_CAPTCHA_GET } from "@/components/constant/url_path";
    import { mapState, mapMutations, mapGetters } from 'vuex';
    import { UPGRADE_PRIVILEGE } from "@/components/constant/mutation_types";
    import { DEFAULT_SAFETY_CHECK_MODE } from "@/components/constant/getter_types";

    export default {
        data () {
            return {
                captcha:'',
                disabled: false,
                loading: false,
                value: undefined,
                formLayout: 'horizontal',
                form: this.$form.createForm(this),
                totalSeconds: 0,
                btnContent: '获取验证码'
            };
        },
        created() {
           this.value = this.safetyCheckMode.toString();
        },
        computed: {
            ...mapState([
                'sms_captcha_able', 'upgrade_privilege_target_url'
            ]),
            ...mapGetters({
                'safetyCheckMode': DEFAULT_SAFETY_CHECK_MODE
            })
        },
        methods: {
            captchaChange () {
                let _this = this;
                let _captcha = this.captcha;
                let pattern = /^\d{6}$/;
                if (pattern.test(_captcha)) {
                    _this.loading = true;
                    _this.$axios.post(USER_PRIVILEGE_POST, {
                        'captcha': _captcha
                    }).then(function (response) {
                        let code = response.data.code;
                        if (code == 200) {
                            _this.$notification['success']({
                                message: '校验成功',
                                description:
                                    '校验成功。默认校验方式为邮箱。填写手机号码后，会激活短信校验，并且可以在账户设置里选择首选校验方式。',
                            });
                            _this.captcha = '';
                            if (_this.upgrade_privilege_target_url != undefined) {
                                _this.$router.push(_this.upgrade_privilege_target_url);
                            }
                            _this.upgradePrivilege({
                                privilege: false,
                                url: undefined
                            });
                        } else {
                            let message = response.data.message;
                            _this.$notification['warning']({
                                message: '校验失败',
                                description: message
                            });
                        }
                    }).catch(function () {
                        _this.disabled = false;
                        _this.$notification['error']({
                            message: '系统错误',
                            description:
                                '校验过程出错，请稍后重试。'
                        });
                    })
                } else {
                    _this.loading = false;
                }
            },
            getCaptcha() {
                let _this = this;
                _this.disabled = true;
                let _url = undefined;
                let _target = undefined;
                switch (_this.value) {
                    case '0':
                        _url = USER_EMAIL_CAPTCHA_GET;
                        _target = "邮箱";
                        break;
                    case '1':
                        _url = USER_SMS_CAPTCHA_GET;
                        _target = "手机";
                        break;
                    case '2':
                        _url = USER_WECHAT_CAPTCHA_GET;
                        _target = "微信";
                }
                _this.$axios.get(_url)
                    .then(function (response) {
                        // 倒计时
                        _this.totalSeconds = 60;
                        _this.cloak = setInterval(function () {
                            if (_this.totalSeconds > 0) {
                                _this.disabled = true;
                                _this.btnContent = _this.totalSeconds + '秒后重新发送';
                                _this.totalSeconds --;
                            } else {
                                window.clearInterval(_this.cloak);
                                _this.totalSeconds = 0;
                                _this.btnContent = '获取验证码';
                                _this.disabled = false;
                            }
                        }, 1000);
                        // 提示
                        let code = response.data.code;
                        if (code == 200) {
                            let target = response.data.result;
                            _this.$notification['success']({
                                message: '发送成功',
                                description:
                                    '验证码已发送至您的' + _target + ' ' + target + ' ，如果没有收到，请稍后重试。',
                            });
                        } else {
                            let message = response.data.message;
                            _this.$notification['warning']({
                                message: '发送失败',
                                description:
                                    '验证码发送失败。' + message,
                            });
                        }
                    }).catch(function () {
                        _this.disabled = false;
                        _this.$notification['error']({
                            message: '系统错误',
                            description:
                                '验证码发送异常'
                        });
                    });
            },
            ...mapMutations({
                'upgradePrivilege':UPGRADE_PRIVILEGE
            })
        }
    };
</script>

<style>
    .privilege-form-button {
        width: 100%;
        height: 40px;
    }
    .ant-input-affix-wrapper .ant-input-suffix {
        right: 5px;
    }
</style>