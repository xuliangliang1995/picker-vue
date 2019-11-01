<template>
    <div>
        <mavon-editor
                :ishljs = "true"
                v-model="markdown.value"
                :style="{'minHeight': contentHeight}"
                :codeStyle="markdown.codeStyle"
                @change="changeMd"
                @save="save"
                @imgAdd="imgAdd"
                ref="md"
        />
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

                <a-form-item label="封面配图">
                    <div class="dropbox">
                        <a-upload-dragger
                                name="file"
                                :showUploadList="false"
                                :action="drawer.uploadOssUrl"
                                @change="uploadChange"
                        >
                            <img v-if="blog.coverImg" :src="blog.coverImg" alt="avatar" :style="{'height':'180px', 'width':'90%'}"/>
                            <div v-else>
                                <p class="ant-upload-drag-icon">
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
                            placeholder="要是能够对文章一些简单的描述，那就再好不过啦 ~"
                    >
                    </a-textarea>
                </a-form-item>

                <a-form-item label="博客分类" required>
                    <a-select
                            style="width: 120px"
                            v-model="blog.categoryId"
                    >
                        <a-select-option value="0">默认</a-select-option>
                    </a-select>
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
                <a-button @click="handleSubmit" type="primary">提交</a-button>
            </div>
        </a-drawer>
    </div>
</template>

<script>
    import { OSS_UPLOAD, BLOG_CREATE_POST } from "@/components/constant/url_path";
    export default {
        data() {
            return {
                markdown: {
                    codeStyle: 'github',
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
                    forceValidate: false
                },
                blog: {
                    blogId: 0,
                    title: '',
                    summary: '',
                    categoryId: "0",
                    coverImg: '',
                    tags:[],
                    tagColors:['red', 'orange', 'green', 'purple', 'blue', 'cyan', 'pink']
                },
                localItem: '',
                contentHeight: (window.screen.height * 95 / 100) + "px",
                formLayout: 'horizontal',
            }
        },
        created: function () {
            this.localItem = 'local:blog:' + this.blog.blogId;
            this.markdown.value = localStorage.getItem(this.localItem) == undefined ? '': localStorage.getItem(this.localItem);
        },
        computed: {
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
            changeMd(value) {
                // 将文档存储在本地防止丢失
                localStorage.setItem(this.localItem, value);
            },
            showInput() {
                this.drawer.inputVisible = true;
            },
            tagChange() {
                let tag = this.drawer.tagInputValue;
                if (tag.length > 10) {
                    this.drawer.tagInputValue = tag.substring(0, 10);
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
                let _this = this;
                _this.drawer.forceValidate = true;
                if (_this.titleValidateStatus != 'success' || _this.summaryValidateStatus != 'success') {
                    return;
                }
                _this.$axios({
                    url: [BLOG_CREATE_POST],
                    method: 'post',
                    data: {
                        'title': _this.blog.title,
                        'markdown': _this.markdown.value,
                        'html': _this.markdown.render,
                        'categoryId': _this.blog.categoryId,
                        'coverImg': _this.blog.coverImg,
                        'summary': _this.blog.summary,
                        'labels': _this.blog.tags
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
            }
        }
    }
</script>

<style>
    .v-note-wrapper {
        z-index: 0;
    }
    .ant-input-group-addon {
        background-color: azure;
    }
    .v-note-wrapper.shadow {
        z-index: 1;
    }
</style>