<template>
    <div>
        <a-spin :spinning="spinning">
            <mavon-editor
                    :ishljs = "true"
                    v-model="markdown.value"
                    :style="{'minHeight': contentHeight}"
                    :codeStyle="markdown_theme"
                    @change="changeMd"
                    @save="save"
                    @imgAdd="imgAdd"
                    ref="md"
            />
        </a-spin>
        <a-drawer
                :title="drawer.title"
                :width="480"
                @close="onClose"
                :visible="drawer.visible"
                :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px'}"
        >
            <a-form>
                <a-form-item label="标题" required
                    :validate-status="titleValidateStatus"
                >
                    <a-input
                            v-model="blog.title"
                            class="input-blog-extra"
                            placeholder="标题"
                            :addonAfter="titleTip"
                    >
                    </a-input>
                </a-form-item>

                <a-form-item label="博客分类" required>
                    <a-tree-select
                            style="width: 300px"
                            :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                            :treeData="treeData"
                            placeholder="请选择分类"
                            treeDefaultExpandAll
                            showSearch
                            v-model="blog.categoryId"
                            treeNodeFilterProp="title"
                    />
                </a-form-item>

                <a-form-item label="封面配图">
                    <div class="dropbox">
                        <a-upload-dragger
                                name="file"
                                :showUploadList="false"
                                :action="drawer.uploadOssUrl"
                                @change="uploadChange"
                                :accept="accept"
                        >
                            <img v-if="blog.coverImg" :src="blog.coverImg" alt="avatar" :style="{'height':'200px', 'width':'322px'}"/>
                            <div v-else :style="{'height':'200px', 'width':'322px'}">
                                <p class="ant-upload-drag-icon" :style="{paddingTop:'50px'}">
                                    <a-icon :type="drawer.uploading ? 'loading' : 'picture'" />
                                </p>
                                <p class="ant-upload-text">
                                    点击或拖拽进行上传
                                </p>
                                <p class="ant-upload-hint">
                                    如果可以的话呢，我们希望能够有一张配图~
                                </p>
                            </div>
                        </a-upload-dragger>
                    </div>
                </a-form-item>

                <a-form-item label="内容简述（100字以内）" :validate-status="summaryValidateStatus">
                    <a-textarea
                            class="input-blog-extra"
                            size="large"
                            :rows="7"
                            v-model="blog.summary"
                            placeholder="要是能够对文章做一些简单的描述，那就再好不过啦 ~"
                    >
                    </a-textarea>
                </a-form-item>

                <a-form-item label="标签">
                    <template v-for="(tag, index) in blog.tags">
                        <a-tag
                                :key="tag"
                                :closable="true"
                                :color="blog.tagColors[index % blog.tagColors.length]"
                                :afterClose="() => handleClose(tag)"
                        >
                            {{ tag }}
                        </a-tag>
                    </template>
                    <a-input
                            v-if="drawer.inputVisible"
                            ref="input"
                            type="text"
                            size="small"
                            :style="{ width: '78px' }"
                            v-model="drawer.tagInputValue"
                            @change="tagChange"
                            @blur="handleInputConfirm"
                            @keyup.enter="handleInputConfirm"
                    />
                    <a-tag v-if="blog.tags.length < 5 && !drawer.inputVisible" @click="showInput" style="background: #fff; borderStyle: dashed;">
                        <a-icon type="plus" /> 添加标签
                    </a-tag>
                </a-form-item>

            </a-form>
            <div
                    :style="{
                      position: 'absolute',
                      left: 0,
                      bottom: 0,
                      width: '100%',
                      borderTop: '1px solid #e9e9e9',
                      padding: '10px 16px',
                      background: '#fff',
                      textAlign: 'right',
                    }"
            >
                <a-button :style="{marginRight: '8px'}" @click="onClose">
                    取消
                </a-button>
                <a-button @click="handleSubmit" :loading="drawer.submitting" type="primary">提交</a-button>
            </div>
        </a-drawer>
    </div>
</template>

<script>
    import { OSS_UPLOAD, BLOG_CREATE_POST, CATEGORY_TREE_GET, BLOG_MARKDOWN_GET, BLOG_EDIT_PUT } from "@/components/constant/url_path";
    import { mapState, mapMutations } from 'vuex';
    import { UPDATE_LOCAL_MARKDOWN, REMOVE_LOCAL_BLOG } from "@/components/constant/mutation_types";
    import { IMG_ACCEPT } from "@/components/constant/img_accept";
    import moment from "moment";
    /**
     * 类别转换
     * @param nodes
     * @returns {*}
     */
    function categoryConvertTree(nodes) {
        return nodes.map((node) => {
            if (node.children && node.children.length > 0) {
                return {
                    key: node.key.toString(),
                    value: node.key.toString(),
                    title: node.title,
                    children: categoryConvertTree(node.children)
                }
            }
            return {
                key: node.key.toString(),
                value: node.key.toString(),
                title: node.title,
                children: []
            }
        });
    }

    export default {
        props:['blogId'],
        data() {
            return {
                spinning: false,
                markdown: {
                    value: '',
                    render: '',
                },
                drawer: {
                    uploadOssUrl: OSS_UPLOAD,
                    uploading: false,
                    title: '完善博客信息',
                    visible: false,
                    inputVisible: false,
                    tagInputValue: '',
                    forceValidate: false,
                    submitting: false
                },
                treeData: [{
                    key: '0',
                    value: '0',
                    title: 'Home',
                    children:[]
                }],
                blog: {
                    title: '',
                    summary: '',
                    categoryId: '0',
                    coverImg: '',
                    tags:[],
                    tagColors:[  'red', 'purple', 'cyan', 'orange', 'blue',  'green', 'pink']
                },
                localItem: '',
                localItemTime: undefined,
                contentHeight: (window.screen.height * 95 / 100) + "px",
                formLayout: 'horizontal',
                accept: IMG_ACCEPT
            }
        },
        created: function () {
            let _this = this;
            // 获取分类
            _this.$axios.get(CATEGORY_TREE_GET)
                .then(function (response) {
                    let code = response.data.code;
                    if (code == 200) {
                        _this.treeData[0].children = categoryConvertTree(response.data.result.nodes);
                    }
                })

            _this.localItem = _this.blogId == undefined ? '0': _this.blogId.toString();
            for (let i = 0; i < _this.markdown_data.length; i++) {
                if (_this.markdown_data[i].key == _this.localItem) {
                    _this.markdown.value = _this.markdown_data[i].markdown;
                    _this.localItemTime = _this.markdown_data[i].time;
                    break;
                }
            }
            if (_this.markdown.value == undefined) {
                _this.markdown.value = '';
            }

            if (_this.blogId != undefined) {
                _this.spinning = true;
                _this.$axios.get(BLOG_MARKDOWN_GET.replace("{blogId}", _this.blogId))
                    .then(function (response) {
                        _this.spinning = false;
                        let code = response.data.code;
                        if (code == 200) {
                            _this.blog.title = response.data.result.title;
                            _this.blog.summary = response.data.result.summary;
                            _this.blog.categoryId = response.data.result.categoryId.toString();
                            _this.blog.coverImg = response.data.result.coverImg;
                            _this.blog.tags = response.data.result.labels;
                            let time = moment(response.data.result.gmtModified, "YYYY-MM-DD hh:mm").format("YYYYMMDDhhmm");
                            if (time > _this.localItemTime || _this.localItemTime == undefined) {
                                // 说明本地存储已失效
                                _this.markdown.value = response.data.result.markdown;
                                _this.removeLocalBlog(_this.localItem);
                            }
                        } else {
                            _this.$message.warn(response.data.message);
                        }
                    })
                    .catch(function () {
                        _this.spinning = false;
                        _this.$message.warn("当前网络不稳定，请稍后重试。");
                    })
            }
        },
        computed: {
            ...mapState(['markdown_theme', 'markdown_data']),
            titleValidateStatus() {
                return ((this.drawer.forceValidate && this.blog.title.length == 0) || this.blog.title.length >= 50) ? 'error' : 'success';
            },
            summaryValidateStatus() {
                return this.blog.summary.length >= 100 ? 'error' : 'success';
            },
            titleTip() {
                return 50 - this.blog.title.length + "/" + 50;
            }
        },
        methods: {
            ...mapMutations({
                'updateLocalMarkdownStorage': UPDATE_LOCAL_MARKDOWN,
                'removeLocalBlog': REMOVE_LOCAL_BLOG
            }),
            changeMd(value) {
                let _this = this;
                // 将文档存储在本地防止丢失
                this.updateLocalMarkdownStorage({
                    key: _this.localItem,
                    markdown: value
                });
            },
            showInput() {
                this.drawer.inputVisible = true;
                this.$nextTick(function() {
                    this.$refs.input.focus();
                });
            },
            tagChange() {
                let tag = this.drawer.tagInputValue;
                if (tag.length > 20) {
                    this.drawer.tagInputValue = tag.substring(0, 20);
                }
            },
            handleInputConfirm() {
                const tag = this.drawer.tagInputValue;
                this.drawer.inputVisible = false;
                if (tag != null && tag.length > 0) {
                    this.blog.tags.push(tag);
                }
                this.drawer.tagInputValue = '';
            },
            handleClose(tag) {
                for (var i = 0; i < this.blog.tags.length; i++) {
                    if (this.blog.tags[i] == tag) {
                        this.blog.tags.splice(i, 1);
                    }
                }
            },
            uploadChange(info) {
                let _this = this;
                const status = info.file.status;
                if (status == 'uploading') {
                    _this.drawer.uploading = true;
                }
                if (status === 'done') {
                    _this.drawer.uploading = false;
                    let code = info.file.response.code;
                    if (code == 200) {
                        _this.blog.coverImg = info.file.response.result;
                    } else {
                        _this.$message.info(info.file.response.message);
                    }
                } else if (status === 'error') {
                    _this.drawer.uploading = false;
                    this.$message.error("图片上传失败");
                }
            },
            onClose() {
                this.drawer.visible = false;
            },
            save(value, render) {
                let _this = this;
                _this.drawer.visible = true;
                _this.markdown.value = value;
                _this.markdown.render = render;
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
            },
            handleSubmit() {
                if (this.blogId == undefined) {
                    this.createBlog();
                } else {
                    this.editBlog();
                }
            },
            createBlog() {
                let _this = this;
                _this.drawer.forceValidate = true;
                if (_this.titleValidateStatus != 'success' || _this.summaryValidateStatus != 'success') {
                    return;
                }
                _this.drawer.submitting = true;
                _this.$axios.post(BLOG_CREATE_POST, {
                    title: _this.blog.title,
                    markdown: _this.markdown.value,
                    html: _this.markdown.render,
                    categoryId: _this.blog.categoryId,
                    coverImg: _this.blog.coverImg,
                    summary: _this.blog.summary,
                    labels: _this.blog.tags
                })
                    .then(function (response) {
                        _this.drawer.submitting = false;
                        let code = response.data.code;
                        if (code == 200) {
                            _this.removeLocalBlog(_this.localItem);
                            _this.$router.push("/blog/list");
                        } else {
                            _this.$message.info(response.data.message);
                        }
                    }).catch(function () {
                        _this.drawer.submitting = false;
                        _this.$message.warn("当然网络不稳定，请重试。");
                    })
            },
            editBlog() {
                let _this = this;
                _this.drawer.forceValidate = true;
                if (_this.titleValidateStatus != 'success' || _this.summaryValidateStatus != 'success') {
                    return;
                }
                _this.drawer.submitting = true;
                _this.$axios.put(BLOG_EDIT_PUT.replace("{blogId}", _this.blogId), {
                    title: _this.blog.title,
                    markdown: _this.markdown.value,
                    html: _this.markdown.render,
                    categoryId: _this.blog.categoryId,
                    coverImg: _this.blog.coverImg,
                    summary: _this.blog.summary,
                    labels: _this.blog.tags
                })
                    .then(function (response) {
                        _this.drawer.submitting = false;
                        let code = response.data.code;
                        if (code == 200) {
                            _this.removeLocalBlog(_this.localItem);
                            _this.$router.push("/blog/".concat(_this.blogId));
                        } else {
                            _this.$message.info(response.data.message);
                        }
                    }).catch(function () {
                        _this.drawer.submitting = false;
                        _this.$message.warn("当然网络不稳定，请重试。");
                    })
            }
        }
    }
</script>

<style scoped>
    .v-note-wrapper {
        z-index: 99;
    }
    .ant-input-group-addon {
        background-color: azure;
    }
    .v-note-wrapper.shadow {
        z-index: 1;
    }
    .dropbox {
        height: 202px;
        width: 324px;
    }
</style>