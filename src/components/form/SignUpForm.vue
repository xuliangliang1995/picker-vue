<template>
    <a-form
            :form="form"
            @submit="handleSubmit"
            class="sign-up-form"
    >
        <a-form-item>
            <a-input
                    class="input-sign-up"
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
            <a-input
                    class="input-sign-up"
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
            <a-auto-complete
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
                        placeholder="邮箱（必填。激活账号，修改密码等敏感操作需要。）"
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
            },
            handleChange(value) {
                this.dataSource = !value || value.indexOf('@') >= 0 ? [] : [
                    `${value}@qq.com`,
                    `${value}@163.com`,
                    `${value}@gmail.com`,
                ];
            }
        },
    };
</script>
<style>
    .sign-up-form {
        max-width: 420px;
        text-align: center;
    }
    .ant-input,.ant-select-auto-complete.ant-select .ant-input {
        height: 40px;
    }
    .sign-up-form-button {
        width: 100%;
        height: 40px;
    }
</style>