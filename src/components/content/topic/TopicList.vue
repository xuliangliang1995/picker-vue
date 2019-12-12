<template>
    <LayCenter>
        <template slot="content">
            <a-row type="flex" justify="start">
                <a-col :span="21">
                    <TopicGridList/>
                </a-col>
                <a-col :span="3">
                    <a-row>
                        <a-icon type="bars"/>
                    </a-row>
                    <a-row>
                        <a-icon type="plus" @click="toAddTopic"/>
                    </a-row>
                </a-col>
            </a-row>
            <a-modal title="添加专题" v-model="visible" :confirmLoading="confirmLoading" @ok="createTopic" okText="确认" cancelText="取消">
                <a-row type="flex" justify="center" :style="{paddingTop: '8px'}">
                    <a-input placeholder="专题标题" v-model="topic.title" @change="titleChange"/>
                </a-row>
                <a-row type="flex" justify="center" :style="{paddingTop: '8px'}">
                    <a-textarea placeholder="专题简介" :rows="4" v-model="topic.summary" @change="summaryChange"/>
                </a-row>
                <a-row type="flex" justify="center" :style="{paddingTop: '8px'}" class="dropbox">
                    <a-col>
                        <a-upload-dragger
                                name="file"
                                :showUploadList="false"
                                :action="upload.uploadOssUrl"
                                @change="uploadChange"
                                :accept="upload.accept"
                        >
                            <img v-if="upload.coverImg" :src="upload.coverImg" alt="avatar" :style="{'height':'300px', 'width':'300px'}"/>
                            <div v-else :style="{'height':'300px', 'width':'300px'}">
                                <p class="ant-upload-drag-icon" :style="{paddingTop:'100px'}">
                                    <a-icon :type="upload.uploading ? 'loading' : 'picture'" />
                                </p>
                                <p class="ant-upload-text">
                                    点击或拖拽进行上传
                                </p>
                                <p class="ant-upload-hint">
                                    专题需要有一张配图做封面
                                </p>
                            </div>
                        </a-upload-dragger>
                    </a-col>
                </a-row>
            </a-modal>
        </template>
    </LayCenter>
</template>

<script>
    import LayCenter from "@/components/layout/LayCenter";
    import { OSS_UPLOAD, TOPIC_CREATE_POST } from "@/components/constant/url_path";
    import { IMG_ACCEPT } from "@/components/constant/img_accept";
    import TopicGridList from "@/components/content/topic/TopicGridList";

    export default {
        name: "TopicList.vue",
        components: {
            LayCenter,
            TopicGridList
        },
        data() {
            return {
                visible: false,
                confirmLoading: false,
                upload: {
                    accept: IMG_ACCEPT,
                    uploadOssUrl: OSS_UPLOAD,
                    coverImg: undefined,
                    uploading: false
                },
                topic: {
                    title: undefined,
                    summary: undefined
                }
            }
        },
        computed: {
            topicCreatable() {
                let _this = this;
                let title = _this.topic.title;
                let summary = _this.topic.summary;
                let coverImg = _this.upload.coverImg;
                return title.length > 0 && summary.length > 0 && coverImg.length > 0;
            }
        },
        methods: {
            toAddTopic() {
                this.visible = true;
            },
            createTopic() {
                let _this = this;
                let title = _this.topic.title;
                let summary = _this.topic.summary;
                let coverImg = _this.upload.coverImg;
                if (title && summary && coverImg && title.length > 0 && summary.length > 0 && coverImg.length > 0) {
                    _this.confirmLoading = true;
                    _this.$axios.post(TOPIC_CREATE_POST, {
                        title: title,
                        summary: summary,
                        coverImg: coverImg
                    }).then(function (response) {
                        let code = response.data.code;
                        if (code == 200) {
                            _this.confirmLoading = false;
                            _this.$message.success("创建成功");
                            return;
                        }
                        _this.confirmLoading = false;
                        _this.$message.info(response.data.message);
                    }).catch(function () {
                        _this.confirmLoading = false;
                        _this.$message.warn("当前网络不稳定，请稍后重试。");
                    })
                } else {
                    _this.confirmLoading = false;
                    _this.$message.info("标题，说明和封面都必须填写。")
                }
            },
            uploadChange(info) {
                let _this = this;
                const status = info.file.status;
                if (status == 'uploading') {
                    _this.upload.uploading = true;
                }
                if (status === 'done') {
                    _this.upload.uploading = false;
                    let code = info.file.response.code;
                    if (code == 200) {
                        _this.upload.coverImg = info.file.response.result;
                    } else {
                        _this.$message.info(info.file.response.message);
                    }
                } else if (status === 'error') {
                    _this.upload.uploading = false;
                    this.$message.error("图片上传失败");
                }
            },
            titleChange() {
                if (this.topic.title.length > 50) {
                    this.topic.title = this.topic.title.substring(0, 50);
                }
            },
            summaryChange() {
                if (this.topic.summary.length > 500) {
                    this.topic.summary = this.topic.summary.substring(0, 500);
                }
            }
        }
    }
</script>

<style scoped>
    .dropbox {
        height: 300px;
        width: 300px;
    }
</style>