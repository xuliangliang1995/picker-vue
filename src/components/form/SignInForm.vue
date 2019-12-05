<template>
    <a-form
            :form="form"
            @submit="handleSubmit"
            class="sign-in-form"
    >
        <a-form-item>
            <a-input
                    class="input-sign-in"
                    size="large"
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
                    size="large"
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
    import { SIGN_IN_POST } from "@/components/constant/url_path";
    import { CLEAR_TOKEN } from "@/components/constant/mutation_types";
    import { mapMutations } from 'vuex';

    export default {
        data () {
            return {
                dataSource:[],
                formLayout: 'horizontal',
                form: this.$form.createForm(this),
            };
        },
        methods: {
            ...mapMutations({
                'clearToken': CLEAR_TOKEN
            }),
            handleSubmit (e) {
                e.preventDefault();
                let _this = this;
                _this.clearToken();
                _this.form.validateFields((err, values) => {
                    if (!err) {
                        _this.$axios.post([SIGN_IN_POST], values)
                            .then(function (response) {
                                let code = response.data.code;
                                let message = response.data.message;
                                if (code == 200) {
                                    _this.$message.success(message);
                                    _this.$router.push('/');
                                } else {
                                    _this.$message.info(message);
                                }
                            })
                    }
                });
            }
        }
    };
</script>

<style scoped>
    .sign-in-form {
        max-width: 420px;
        text-align: center;
    }
    .sign-in-form-button {
        width: 100%;
        height: 40px;
    }
</style>