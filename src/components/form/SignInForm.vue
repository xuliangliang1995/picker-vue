<template>
    <a-form
            :form="form"
            @submit="handleSubmit"
            class="sign-in-form"
    >
        <a-form-item>
            <a-input
                    class="input-sign-in"
                    v-decorator="[
                      'username',
                      {rules: [
                          { required: true, message: '请输入用户名！' },
                          { pattern: '^[a-zA-Z0-9]{8,20}$', message: '用户名由 8 - 20 位字母或数字组成，区分大小写。'}
                      ]}
                    ]"
                    placeholder="用户名"
            >
                <a-icon
                        slot="prefix"
                        type="user"
                        style="color:rgba(0,0,0,.25)"
                />
            </a-input>
        </a-form-item>

        <a-form-item>
            <a-input
                    class="input-sign-in"
                    v-decorator="[
                      'password',
                      { rules: [
                        { required: true, message: '请输入密码！' },
                        { pattern: '^[a-zA-Z0-9]{8,20}$', message: '密码由 8 - 20 位字母或数字组成，区分大小写。'}
                      ] }
                    ]"
                    type="password"
                    placeholder="密码"
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
                    class="sign-in-form-button"
            >
                登录
            </a-button>
        </a-form-item>
    </a-form>
</template>

<script>
    export default {
        data () {
            return {
                dataSource:[],
                formLayout: 'horizontal',
                form: this.$form.createForm(this),
            };
        },
        methods: {
            handleSubmit (e) {
                e.preventDefault();
                this.form.validateFields((err, values) => {
                    if (!err) {
                        // eslint-disable-next-line no-console
                        console.log('Received values of form: ', values);
                        this.$emit("success", "835***206@qq.com");
                    }
                });
            }
        },
    };
</script>

<style scoped>
    .sign-in-form {
        max-width: 420px;
        text-align: center;
    }
    .ant-input,.ant-select-auto-complete.ant-select .ant-input {
        height: 40px;
    }
    .sign-in-form-button {
        width: 100%;
        height: 40px;
    }
</style>