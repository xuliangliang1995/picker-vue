<template>
    <strong>
        <a-row class="info_row" type="flex" justify="start" align="middle">
            <a-col class="gutter-row" :span="3" :offset="5">
                <span class="info_label">markdown：</span>
            </a-col>
            <a-col class="gutter-row" :span="6" :offset="4">
                <a-radio-group :options="themes" v-model="theme" />
            </a-col>
        </a-row>
        <a-row>
            <!-- 分割线 -->
            <a-col class="gutter-row" :span="18" :offset="5">
                <a-divider/>
            </a-col>
        </a-row>
        <a-row class="info_row" type="flex" justify="start" align="middle">
            <a-col class="gutter-row" :span="3" :offset="5">
                <span class="info_label">安全校验：</span>
            </a-col>
            <a-col class="gutter-row" :span="6" :offset="4">
                <a-radio-group :options="verifyMethods" v-model="verifyMethod" />
            </a-col>
        </a-row>
        <a-row>
            <!-- 分割线 -->
            <a-col class="gutter-row" :span="18" :offset="5">
                <a-divider/>
            </a-col>
        </a-row>
        <a-row class="info_row" type="flex" justify="start" align="middle">
            <a-col class="gutter-row" :span="3" :offset="5">
                <span class="info_label">博客推送：</span>
            </a-col>
            <a-col class="gutter-row" :span="6" :offset="4">
                <a-switch v-model="openBlogPush" />
            </a-col>
        </a-row>
        <a-row>
            <!-- 分割线 -->
            <a-col class="gutter-row" :span="18" :offset="5">
                <a-divider/>
            </a-col>
        </a-row>
        <a-row class="info_row" type="flex" justify="start" align="middle">
            <a-col class="gutter-row" :span="3" :offset="5">
                <span class="info_label">推送方式：</span>
            </a-col>
            <a-col class="gutter-row" :span="6" :offset="4">
                <a-radio-group :options="pushMethods" v-model="pushMethod" />
            </a-col>
        </a-row>
        <a-row>
            <!-- 分割线 -->
            <a-col class="gutter-row" :span="18" :offset="5">
                <a-divider/>
            </a-col>
        </a-row>
        <a-row class="info_row" type="flex" justify="start" align="middle">
            <a-col class="gutter-row" :span="3" :offset="5">
                <a-button type="primary" size="large" @click="saveSetting" :loading="loading">保存</a-button>
            </a-col>
        </a-row>
    </strong>
</template>

<script>
    import { USER_SETTING_PUT, USER_SETTING_GET } from "@/components/constant/url_path";
    import { mapState, mapMutations } from 'vuex';
    import { UPDATE_MARKDOWN_THEME, UPDATE_SAFETY_CHECK_MODE } from "@/components/constant/mutation_types";

    export default {
        data() {
            return {
                themes: [
                    { label: 'github', value: 'github' },
                    { label: 'dark', value: 'dark' }
                ],
                verifyMethods: [
                    { label: '邮件', value: 0 },
                    { label: '短信', value: 1 },
                    { label: '微信', value: 2 }
                ],
                pushMethods: [
                    { label: '邮件', value: 0 },
                    { label: '微信', value: 1 }
                ],
                theme: 'github',
                verifyMethod: 0,
                openBlogPush: false,
                pushMethod: 0,
                loading: false
            }
        },
        created() {
            let _this = this;
            _this.theme = _this.markdown_theme;
            _this.verifyMethod = _this.safety_check_mode;
            _this.$axios.get(USER_SETTING_GET)
                .then(function (response) {
                    let code = response.data.code;
                    if (code == 200) {
                        _this.theme = response.data.result.markdownTheme;
                        _this.verifyMethod = response.data.result.safetyCheckMode;
                        _this.openBlogPush = response.data.result.openBlogPush;
                        _this.pushMethod = response.data.result.blogPushMode;
                    }
                 })
        },
        computed: {
           ...mapState([
               'safety_check_mode',
               'markdown_theme'
            ])
        },
        methods: {
            ...mapMutations({
                'updateMarkdownTheme': UPDATE_MARKDOWN_THEME,
                'updateSafetyCheckMode': UPDATE_SAFETY_CHECK_MODE
            }),
            saveSetting() {
                let _this = this;
                _this.loading = true;
                _this.$axios.put(USER_SETTING_PUT, {
                    markdownTheme: _this.theme,
                    safetyCheckMode: _this.verifyMethod,
                    openBlogPush: _this.openBlogPush,
                    blogPushMode: _this.pushMethod
                }).then(function (response) {
                    let code = response.data.code;
                    if (code == 200) {
                        _this.updateMarkdownTheme(_this.theme);
                        _this.updateSafetyCheckMode(_this.verifyMethod);
                        _this.loading = false;
                        _this.$message.success("保存成功");
                    } else {
                        _this.loading = false;
                        _this.$message.info(response.data.message);
                    }
                }).catch(function () {
                    _this.loading = false;
                    _this.$message.warn("当前网络不稳定，请稍后重试");
                })
            }
        }
    }
</script>

<style scoped>
    .info_label {
        font-size: 20px;
        color: #969696;
    }
    .info_row {
        margin-top: 20px;
    }
</style>