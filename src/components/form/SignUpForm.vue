<template>
    <a-form
            :form="form"
            @submit="handleSubmit"
            class="sign-up-form"
    >
        <a-form-item>
            <a-input
                    class="input-sign-up"
                    size="large"
                    v-decorator="[
                      'username',
                      {rules: [
                          { required: true, message: '请输入用户名！' },
                          { pattern: '^[a-zA-Z0-9]{8,20}$', message: '用户名由 8 - 20 位字母或数字组成，区分大小写。'}
                      ]}
                    ]"
                    placeholder="用户名（必填）"
            >
                <a-icon
                        slot="prefix"
                        type="user"
                        style="color:rgba(0,0,0,.25)"
                />
            </a-input>
        </a-form-item>

        <a-form-item>
            <a-auto-complete
                    size="large"
                    :dataSource="dataSource"
                    @change="handleChange"
                    v-decorator="[
                          'email',
                          { rules: [
                            { required: true, message: '请输入邮箱！' },
                            { pattern: '^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\\.[a-zA-Z0-9_-]+)+$', message: '邮箱格式有误！'}
                            ] }
                        ]"
            >
                <a-input
                        class="input-sign-up"
                        size="large"
                        placeholder="邮箱（必填。激活账号等敏感操作需要。）"
                >
                    <a-icon
                            slot="prefix"
                            type="mail"
                            style="color: rgba(0,0,0,.25)"
                    />
                </a-input>
            </a-auto-complete>
        </a-form-item>

        <a-form-item>
            <a-input
                    class="input-sign-up"
                    size="large"
                    v-decorator="[
                      'password',
                      { rules: [
                        { required: true, message: '请输入密码！' },
                        { pattern: '^[a-zA-Z0-9]{8,20}$', message: '密码由 8 - 20 位字母或数字组成，区分大小写。'}
                      ] }
                    ]"
                    type="password"
                    placeholder="密码（必填）"
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
                    class="input-sign-up"
                    size="large"
                    v-decorator="[
                      'rePassword',
                      { rules: [
                        { required: true, message: '请输入密码！' },
                        { validator: compareToFirstPassword}
                      ] }
                    ]"
                    type="password"
                    placeholder="密码二次确认"
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
                    class="sign-up-form-button"
            >
                注册
            </a-button>
        </a-form-item>
    </a-form>
</template>

<script>
    import {SIGN_UP_POST} from "@/components/constant/url_path";

    export default {
        data () {
            return {
                dataSource:[],
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
            handleSubmit (e) {
                e.preventDefault();
                let _this = this;
                _this.form.validateFields((err, values) => {
                    if (!err) {
                        _this.$axios.post([SIGN_UP_POST], values)
                            .then(function (response) {
                                let code = response.data.code;
                                let message = response.data.message;
                                if (code == 200) {
                                    // success
                                    _this.$message.success(message);
                                    _this.$emit("success", values.username, values.email);
                                } else {
                                    // fail
                                    _this.$message.info(message);
                                }
                            })
                    }

                });
            },
            handleChange(value) {
                this.dataSource = !value || value.indexOf('@') >= 0 ? [] : [
                    `${value}@qq.com`,
                    `${value}@163.com`,
                    `${value}@gmail.com`,
                ];
            }
        }
    };
</script>
<style scoped>
    .sign-up-form {
        max-width: 420px;
        text-align: center;
    }
    .sign-up-form-button {
        width: 100%;
        height: 40px;
    }
</style>