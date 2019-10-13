<template>
    <div>
        <a-row type="flex" justify="center" align="middle" style="margin:50px">
            <a-col :span="18">
                <a-divider style="font-size:30px">登录</a-divider>
            </a-col>
        </a-row>
        <a-row type="flex" justify="center" align="middle">
            <a-col :span="5">
                <SignInForm v-on:success="loginSuccess"/>
            </a-col>
        </a-row>
    </div>
</template>

<script>
    import SignInForm from "@/components/form/SignInForm";
    export default {
        data() {
            return {
                currentStep: 0,
                email: ''
            }
        },
        components: {
            SignInForm
        },
        methods: {
            loginSuccess() {

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