<template>
    <a-row type="flex" justify="start">
        <a-col class="gutter-row" :span="20">
            <a-spin :spinning="spinning" >
                <mavon-editor
                        v-model="value"
                        :scrollStyle="true"
                        :toolbarsFlag="false"
                        :ishljs = "true"
                        :subfield = "false"
                        :boxShadow = "false"
                        previewBackground="unset"
                        defaultOpen = "preview"
                        :style="{'minHeight': contentHeight, 'font-size': '18px'}"
                        :codeStyle="codeStyle"
                        ref="md"
                />
            </a-spin>
        </a-col>
    </a-row>
</template>

<script>
    import {BLOG_MARKDOWN_GET} from "@/components/constant/url_path";

    export default {
        props: ['blogId'],
        data() {
            return {
                spinning: true,
                codeStyle:'github',
                value: '',
                url: '',
                contentHeight: (window.screen.height * 95 / 100) + "px"
            }
        },
        created: function () {
            let _this = this;
            _this.url = BLOG_MARKDOWN_GET.replace("{blogId}", _this.blogId);
            _this.$axios.get(_this.url)
                .then(function (response) {
                    let code = response.data.code;
                    if (code == 200) {
                        _this.value = response.data.result.markdown;
                        _this.spinning = false;
                    }
                })
        }
    }
</script>

<style>
    .v-note-wrapper {
        z-index: 0;
    }
</style>