<template>
    <div>
        <a-row type="flex" justify="center" align="middle" style="margin:50px">
            <a-col :span="18">
                <a-divider style="font-size:30px">注册</a-divider>
            </a-col>
        </a-row>
        <a-row type="flex" justify="center" align="middle">
            <a-col :span="5">
                <div class="components-input-demo-size">
                    <SignUpForm v-if="currentStep == 0"  v-on:success="registerSuccess"/>
                    <template v-if="currentStep == 1" class="activate-tip">
                        系统已经向您的邮箱（<span style="color: green">{{ email }}</span>）发送了账户激活邮件，
                        请打开您的邮箱对账号进行激活。
                        <a-button @click="sendActivateEmail">发送激活邮件</a-button><br/>
                    </template>
                    <template v-if="currentStep == 2">
                        <p>恭喜成为 Picker 用户的一员。现在，您可以去登录啦~</p>
                    </template>
                </div>
            </a-col>
        </a-row>

        <a-row type="flex" justify="center" align="middle" style="padding-top: 200px">
            <a-col :span="8">
                <template>
                    <a-steps :current="currentStep">
                        <a-step title="注册" description="请务必保证邮箱的有效性。"/>
                        <a-step title="激活" description="通过邮箱对账户进行激活。" />
                        <a-step title="成功" description="注册成功"/>
                    </a-steps>
                </template>
            </a-col>
        </a-row>
    </div>
</template>

<script>
    import { SEND_ACTIVATE_EMAIL_POST, ACCOUNT_ACTIVATE_STATUS } from "@/components/constant/url_path";
    import SignUpForm from "@/components/form/SignUpForm";
    export default {
        data() {
            return {
                currentStep: 0,
                username: '',
                email: ''
            }
        },
        components: {
            SignUpForm
        },
        methods: {
            registerSuccess(username, email) {
                let _this = this;
                _this.username = username;
                _this.email = email;
                _this.currentStep = 1;
                _this.getActivateStatus();
            },
            sendActivateEmail() {
                let _this = this;
                this.$axios.post(SEND_ACTIVATE_EMAIL_POST, {
                    'username': _this.username
                }).then(function (response) {
                    let code = response.data.code;
                    let message = response.data.message;
                    if (code == 200) {
                        _this.$message.info(message);
                    } else {
                        _this.$message.error(message);
                    }
                }).catch(function() {
                    // eslint-disable-next-line no-console
                })
            },
            getActivateStatus() {
                let _this = this;
                _this.$axios.get(ACCOUNT_ACTIVATE_STATUS.concat('?username=').concat(_this.username))
                    .then(function (response) {
                        if (response.data.code == 200) {
                            if (response.data.result.activated) {
                                _this.activate = true;
                                _this.currentStep = 2;
                            } else {
                                setTimeout(_this.getActivateStatus, 1000);
                            }
                        }
                    })
            }
        }
    }
</script>

<style scoped>
    .activate-tip {
        padding-top: 100px;
        font-size: 16px;
    }
</style>