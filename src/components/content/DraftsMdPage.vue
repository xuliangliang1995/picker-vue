<template>
    <Main2 id="main">
        <MenuLeft slot="sider"/>
        <div slot="content">
            <a-input
                    v-model="title"
                    @change="changeTitle"
                    addonBefore="文章标题" addonAfter="0/50"
                    placeholder="请输入文章标题"
                    allowClear
                    :style="{'margin':'0px', 'boxSizing':'content-box', 'box-shadow': 'rgba(0, 0, 0, 0.1) 0px 2px 12px 0px'}"
            />
            <mavon-editor
                    :ishljs = "true"
                    v-model="value"
                    :style="{'minHeight': contentHeight}"
                    @change="changeMd"
                    @save="save"
                    @imgAdd="imgAdd"
                    ref="md"
            />
        </div>
    </Main2>
</template>

<script>
    import { OSS_UPLOAD, BLOG_CREATE_POST } from "@/components/constant/url_path";
    import Main2 from "@/components/layout/Main2";
    import MenuLeft from "@/components/menu/MenuLeft";
    export default {
        data() {
            return {
                blogId: 0,
                localItem: '',
                title: '',
                value: '',
                contentHeight: (window.screen.height * 95 / 100) + "px"
            }
        },
        created: function () {
            this.localItem = 'local:blog:' + this.blogId;
            this.value = localStorage.getItem(this.localItem) == undefined ? '': localStorage.getItem(this.localItem);
            this.title = localStorage.getItem(this.localItem.concat(":title")) == undefined ? '': localStorage.getItem(this.localItem.concat(":title"));
        },
        components: {
            Main2,
            MenuLeft
        },
        methods: {
            changeTitle() {
                localStorage.setItem(this.localItem.concat(":title"), this.title);
            },
            changeMd(value) {
                // 将文档存储在本地防止丢失
                localStorage.setItem(this.localItem, value);
            },
            save(value, render) {
                let _this = this;
                if (value.length == 0) {
                    _this.$message.info("文章内容不能为空");
                    return;
                }
                let title = _this.title;
                if (title.length == 0) {
                    _this.$message.info("文章标题不能为空");
                    return;
                }
                this.$axios({
                    url: BLOG_CREATE_POST,
                    method: 'post',
                    data: {
                        'title': title,
                        'markdown': value,
                        'html': render,
                        'categoryId': 0
                    }
                })
                .then(function (response) {
                    let code = response.data.code;
                    if (code == 200) {
                        _this.$message.success(response.data.message);
                        localStorage.removeItem(_this.localItem);
                        localStorage.removeItem(_this.localItem.concat(":title"));
                    } else {
                        _this.$message.info(response.data.message);
                    }
                }).catch(function () {
                    _this.$message.warn("当然网络不稳定，请重试。");
                })
            },
            imgAdd(pos, $file){
                let _this = this;
                // step 1. upload image to server.
                let formdata = new FormData();
                formdata.append('file', $file);
                _this.$axios({
                    url: OSS_UPLOAD,
                    method: 'post',
                    data: formdata,
                    headers: { 'Content-Type': 'multipart/form-data' },
                }).then((response) => {
                   let code = response.data.code;
                   if (code == 200) {
                       _this.$refs.md.$img2Url(pos, response.data.result);
                   } else {
                       _this.$message.info(response.data.message);
                   }
                })
            }
        }
    }
</script>

<style>
    .v-note-wrapper {
        z-index: 0;
    }
    .ant-input-group-addon {
        background-color: #d8e6df;
    }
</style>