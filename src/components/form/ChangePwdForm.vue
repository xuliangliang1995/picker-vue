<template>
    <a-form
            :form="form"
            @submit="handleSubmit"
            class="change-pwd-form"
    >
        <a-form-item>
            <a-input
                    class="input-change-pwd"
                    v-decorator="[
                      'password',
                      { rules: [
                        { required: true, message: '密码不能为空' },
                        { pattern: '^[a-zA-Z0-9]{8,20}$', message: '密码由 8 - 20 位字母或数字组成，区分大小写。'}
                      ] }
                    ]"
                    type="password"
                    placeholder="请输入密码"
            >
                <a-icon
                        slot="prefix"
                        type="lock"
                        style="color: rgba(0,0,0,.25)"
                />
            </a-input>
        </a-form-item>
        <a-form-item>
            <a-input
                    class="input-change-pwd"
                    v-decorator="[
                      'rePassword',
                      { rules: [
                        { required: true, message: '密码不能为空' },
                        { validator: compareToFirstPassword}
                      ] }
                    ]"
                    type="password"
                    placeholder="请再次输入密码"
            >
                <a-icon
                        slot="prefix"
                        type="lock"
                        style="color: rgba(0,0,0,.25)"
                />
            </a-input>
        </a-form-item>

        <a-form-item>
            <a-button
                    type="primary"
                    html-type="submit"
                    class="change-pwd-form-button"
            >
                修改
            </a-button>
        </a-form-item>
    </a-form>
</template>

<script>
    import { USER_PASSWORD_PATCH } from "@/components/constant/url_path";

    export default {
        data () {
            return {
                formLayout: 'horizontal',
                form: this.$form.createForm(this),
            };
        },
        methods: {
            compareToFirstPassword(rule, value, callback) {
                const form = this.form;
                if (value && value !== form.getFieldValue('password')) {
                    callback('两次密码输入不一致！');
                } else {
                    callback();
                }
            },
            handleSubmit(e) {
                e.preventDefault();
                let _this = this;
                _this.form.validateFields((err, values) => {
                    if (!err) {
                        _this.$axios.patch([USER_PASSWORD_PATCH], values)
                            .then(function (response) {
                                let code = response.data.code;
                                let message = response.data.message;
                                if (code == 200) {
                                    // success
                                    _this.$message.success(message);
                                } else {
                                    // fail
                                    _this.$message.info(message);
                                }
                            })
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .change-pwd-form {
        max-width: 420px;
        text-align: center;
    }
    .ant-input,.ant-select-auto-complete.ant-select .ant-input {
        height: 40px;
    }
    .change-pwd-form-button {
        width: 100%;
        height: 40px;
    }
</style>