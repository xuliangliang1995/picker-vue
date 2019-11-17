<template>
    <div>
        <!-- 一个什么也没有的组件。用来执行初始化操作 -->
    </div>
</template>

<script>
    import { mapMutations, mapActions } from 'vuex';
    import { UPDATE_AVATAR, UPDATE_SMS_CAPTCHA_ABLE, UPDATE_MARKDOWN_THEME, UPDATE_SAFETY_CHECK_MODE, UPDATE_BIND_WECHAT } from "@/components/constant/mutation_types";
    import {USER_INFO_GET, USER_SETTING_GET} from "@/components/constant/url_path";
    import { INIT_PRIVILEGE} from "@/components/constant/action_types";

    export default {
        name: "Init",
        created() {
            let _this = this;
            // 【1】初始化权限
            _this.initPrivilege();
            // 【2】更新用户信息
            _this.$axios.get(USER_INFO_GET)
                .then(function (response) {
                    let code = response.data.code;
                    if (code == 200) {
                        _this.updateAvatar(response.data.result.avatar);
                        _this.updateSmsCaptchaAble(response.data.result.phone && response.data.result.phone.length > 0);
                        _this.updateBindWechat(response.data.result.bindWechat);
                    }
                })
            // 【3】更新用户配置
            _this.$axios.get(USER_SETTING_GET)
                .then(function (response) {
                    let code = response.data.code;
                    if (code == 200) {
                        _this.updateMarkdownTheme(response.data.result.markdownTheme);
                        _this.updateSafetyCheckMode(response.data.result.safetyCheckMode);
                    }
                })
        },
        methods: {
            ...mapMutations({
                'updateAvatar': UPDATE_AVATAR,
                'updateSmsCaptchaAble': UPDATE_SMS_CAPTCHA_ABLE,
                'updateMarkdownTheme': UPDATE_MARKDOWN_THEME,
                'updateSafetyCheckMode': UPDATE_SAFETY_CHECK_MODE,
                'updateBindWechat': UPDATE_BIND_WECHAT
            }),
            ...mapActions({
                'initPrivilege': INIT_PRIVILEGE
            })
        }
    }
</script>

<style scoped>

</style>