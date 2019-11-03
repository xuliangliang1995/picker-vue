<template>
    <strong>
        <a-row class="info_row" type="flex" justify="start" align="middle">
            <a-col class="gutter-row" :span="3" :offset="5">
                <span class="info_label">编辑器主题：</span>
            </a-col>
            <a-col class="gutter-row" :span="6" :offset="2">
                <a-radio-group :options="themes" v-model="theme" />
            </a-col>
        </a-row>
        <a-row>
            <!-- 分割线 -->
            <a-col class="gutter-row" :span="13" :offset="5">
                <a-divider/>
            </a-col>
        </a-row>
        <a-row class="info_row" type="flex" justify="start" align="middle">
            <a-col class="gutter-row" :span="3" :offset="5">
                <span class="info_label">安全校验：</span>
            </a-col>
            <a-col class="gutter-row" :span="6" :offset="2">
                <a-radio-group :options="verifyMethods" v-model="verifyMethod" />
            </a-col>
        </a-row>
    </strong>
</template>

<script>
    export default {
        data() {
            return {
                themes: [
                    { label: 'github', value: 'github' },
                    { label: 'dark', value: 'dark' }
                ],
                theme: 'github',
                verifyMethods: [
                    { label: '邮箱', value: 0 },
                    { label: '手机', value: 1 }
                ],
                verifyMethod: 0
            }
        }
    }
</script>

<style scoped>
    .info_label {
        font-size: 17px;
        color: #969696;
    }
    .info_row {
        margin-top: 20px;
    }
</style>