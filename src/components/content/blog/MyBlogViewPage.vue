<template>
    <a-row type="flex" justify="start">
        <a-col class="gutter-row" :span="span">
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
                        :style="{minHeight: contentHeight, 'font-size':'15px', lineHeight: 2}"
                        :codeStyle="markdown_theme"
                        @change="changeMd"
                        ref="md"
                />
                <BlogComment v-if="! excludeComments" :blog-id="blogId"/>
            </a-spin>
        </a-col>
        <a-col v-if="! excludeToc" class="gutter-row" :span="3" :offset="1">
            <BlogAnchor v-if="render"  :render="render"/>
        </a-col>
    </a-row>
</template>

<script>
    import { BLOG_MARKDOWN_GET } from "@/components/constant/url_path";
    import { mapState } from 'vuex';
    import BlogComment from "@/components/content/blog/BlogComment";
    import BlogAnchor from "@/components/content/blog/BlogAnchor";

    export default {
        props: ['blogId', 'filled', 'excludeComments', 'excludeToc'],
        data() {
            return {
                span: 20,
                spinning: true,
                value: '',
                url: '',
                contentHeight: (window.screen.height * 95 / 100) + "px",
                render: undefined
            }
        },
        components: {
            BlogComment,
            BlogAnchor
        },
        created: function () {
            let _this = this;
            if (_this.filled) {
                _this.span = 24;
            }
            _this.url = BLOG_MARKDOWN_GET.replace("{blogId}", _this.blogId);
            _this.$axios.get(_this.url)
                .then(function (response) {
                    let code = response.data.code;
                    if (code == 200) {
                        _this.value = response.data.result.markdown;
                        _this.spinning = false;
                        _this.$emit('author', response.data.result.pickerId);
                    }
                })
        },
        computed: {
            ...mapState(['markdown_theme'])
        },
        methods: {
            changeMd(value, render) {
                this.render = render;
                this.$emit('render', render);
            },
        }
    }
</script>

<style scoped>
    .v-note-wrapper {
        z-index: 0;
    }
</style>