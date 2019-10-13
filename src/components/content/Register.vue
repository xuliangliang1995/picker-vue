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
                        <a-button>发送激活邮件</a-button><br/>
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
    import SignUpForm from "@/components/form/SignUpForm";
    export default {
        data() {
            return {
                currentStep: 0,
                email: ''
            }
        },
        components: {
            SignUpForm
        },
        methods: {
            registerSuccess(email) {
                this.currentStep = 1;
                this.email = email;
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