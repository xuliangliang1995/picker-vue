<template>
    <Main2 id="main">
        <MenuLeft slot="sider"/>
        <mavon-editor
                slot="content"
                :ishljs = "true"
                v-model="value"
                :style="{'minHeight': contentHeight}"
                @change="change"
                @save="save"
                @imgAdd="imgAdd"
                ref="md"
        />
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
                value: '',
                contentHeight: (window.screen.height * 95 / 100) + "px"
            }
        },
        created: function () {
            localStorage.removeItem('local:blog:undefined');
            this.localItem = 'local:blog:' + this.blogId;
            this.value = localStorage.getItem(this.localItem) == undefined ? '': localStorage.getItem(this.localItem);
        },
        components: {
            Main2,
            MenuLeft
        },
        methods: {
            change(value) {
                // 将文档存储在本地防止丢失
                localStorage.setItem(this.localItem, value);
            },
            save(value, reder) {
                let _this = this;
                _this.$axios.post(BLOG_CREATE_POST, {
                    'markdown': value,
                    'html': reder,
                    'categoryId': 0
                }).then(function (response) {
                    let code = response.data.code;
                    if (code == 200) {
                        _this.$message.success(response.data.message);
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

<style scoped>
    .v-note-wrapper {
        z-index: 0;
    }
</style>