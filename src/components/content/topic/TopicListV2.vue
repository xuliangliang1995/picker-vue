<template>
    <LayCenter>
        <div slot="content">
            <a-table
                    :columns="columns"
                    :rowKey="record => record.topicId"
                    :dataSource="data"
                    :loading="loading"
                    :pagination="false"
            >
                <span slot="customTitle">
                    <a-row type="flex" justify="start">
                        <a-col :span="23">
                            我的专题
                        </a-col>
                        <a-col :span="1">
                            <a-icon type="plus" @click="toAddTopic"/>
                        </a-col>
                    </a-row>
                </span>
                <template slot="topic" slot-scope="text, record">
                    <a-row  type="flex" justify="start">
                        <a-col :span="3">
                            <img width="127" height="168" :src="record.coverImg" @click="routeTopic(record.topicId)"/>
                        </a-col>
                        <a-col :span="21">
                            <a-row>
                                <a-col :span="10">
                                <span class="topic-title">
                                    <a type="link" @click.stop.prevent="routeTopic(record.topicId)">{{ record.title }}</a>
                                    <PrivateTag v-if='record.status == 0'/>
                                </span>
                                </a-col>
                                <a-col :span="12" class="topic-info" :style="{textAlign: 'right'}">
                                    <a-rate disabled :value="5"/>
                                </a-col>
                            </a-row>
                            <a-row>
                                <span class="topic-info">{{ record.summary }} </span>
                                <!--<span class="topic-desc" :style="{marginLeft: '10px'}">{{ item.gmtCreate }}</span>-->
                            </a-row>
                            <template v-if="record.links && record.links.length > 0">
                                <a-row :style="{marginTop: '15px'}">
                                    <a-col :span="8">
                                        <span class="topic-desc">
                                            <a href="#" @click.stop.prevent="routeBlog(record.topicId, record.links[0].blogId)">01 | {{record.links[0].title}}</a>
                                        </span>
                                    </a-col>
                                    <a-col :span="8" v-if="record.links.length > 1"><span class="topic-desc">02 | {{record.links[1].title}}</span></a-col>
                                </a-row>
                            </template>
                            <template v-else>
                                <a-row :style="{height: '15px'}"></a-row>
                            </template>
                            <template v-if="record.links && record.links.length > 2">
                                <a-row :style="{marginTop: '20px'}">
                                    <a-col :span="8"><span class="topic-desc">01 | {{record.links[2].title}}</span></a-col>
                                    <a-col :span="8" v-if="record.links.length > 3"><span class="topic-desc">02 | {{record.links[3].title}}</span></a-col>
                                </a-row>
                            </template>
                            <template v-else>
                                <a-row :style="{height: '20px'}"></a-row>
                            </template>
                            <a-row :style="{marginTop: '10px'}">
                                <a-col :span="11">
                                    <span class="topic-info">{{ record.ownerName }} </span>
                                    <span class="topic-info" :style="{marginLeft: '10px'}">{{ record.gmtCreate }}</span>
                                </a-col>
                                <a-col :span="11" class="topic-desc" :style="{textAlign: 'right'}">
                                    <a-button v-if="record.status == 0" type="link" @click.stop.prevent="changeTopicStatus(record, 1)">设为公开</a-button>
                                    <a-button v-if="record.status == 1" type="link" @click.stop.prevent="changeTopicStatus(record, 0)">设为私密</a-button>
                                    <a-button type="link" @click.stop.prevent="toEditTopic(record)">编辑</a-button>
                                    <a-button type="link" @click.stop.prevent="toDel(record)">删除</a-button>
                                </a-col>
                            </a-row>

                        </a-col>
                    </a-row>
                </template>
            </a-table>
            <a-modal title="删除确认" v-model="delModal.visible" @ok="deleteTopic">
                点击确认删除！
            </a-modal>
            <a-modal :title="topic.topicId ? '编辑专题信息' : '添加专题'" v-model="visible" :confirmLoading="confirmLoading" @ok="createOrEditTopic" okText="确认" cancelText="取消">
                <a-row type="flex" justify="start" :style="{paddingTop: '8px'}">
                    <a-input placeholder="专题标题" v-model="topic.title" @change="titleChange"/>
                </a-row>
                <a-row type="flex" justify="start" :style="{paddingTop: '8px'}">
                    <a-textarea placeholder="专题简介" :rows="4" v-model="topic.summary" @change="summaryChange"/>
                </a-row>
                <a-row type="flex" justify="start" :style="{paddingTop: '8px'}" >
                    <a-col :span="4">
                        封面<span style="color:red"> * </span>：
                    </a-col>
                    <a-col :span="20" :style="{maxWidth:'302px'}">
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
                                    <a-icon :type="upload.uploading ? 'loading' : 'picture'"/>
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
        </div>
    </LayCenter>
</template>

<script>
    import PrivateTag from "@/components/content/topic/PrivateTag";
    import LayCenter from "@/components/layout/LayCenter";
    import { TOPICS_GET, TOPIC_STATUS_PATCH,TOPIC_DELETE, OSS_UPLOAD, TOPIC_CREATE_POST, TOPIC_EDIT_PUT } from "@/components/constant/url_path";
    import { UPGRADE_PRIVILEGE } from "@/components/constant/mutation_types";
    import { IMG_ACCEPT } from "@/components/constant/img_accept";
    import { mapState, mapMutations } from 'vuex';
    import qs from 'qs';

    const columns = [
        {
            dataIndex: 'topic',
            sorter: true,
            slots: { title: 'customTitle' },
            scopedSlots: { customRender: 'topic' }
        }
    ];

    export default {
        name: "TopicListV2",
        components: {
            LayCenter,
            PrivateTag
        },
        data() {
            return {
                loading: true,
                visible: false,
                confirmLoading: false,
                data: [],
                delModal: {
                    visible: false,
                    topic: undefined
                },
                queryParams:{
                    keyword: undefined,
                    pageNo: 1,
                    pageSize: 100,
                    authorId: undefined
                },
                columns: columns,
                upload: {
                    accept: IMG_ACCEPT,
                    uploadOssUrl: OSS_UPLOAD,
                    coverImg: undefined,
                    uploading: false
                },
                topic: {
                    topicId: undefined,
                    title: undefined,
                    summary: undefined,
                    holder: undefined
                }
            }
        },
        created() {
            this.fetchData();
        },
        computed: {
            ...mapState([
                'upgrade_privilege'
            ])
        },
        methods: {
            toAddTopic() {
                this.topic.holder = undefined;
                this.topic.topicId = undefined;
                this.topic.title = undefined;
                this.topic.summary = undefined;
                this.upload.coverImg = undefined;
                this.visible = true;
            },
            toEditTopic(topic) {
                this.topic.holder = topic;
                this.topic.topicId = topic.topicId;
                this.topic.title = topic.title;
                this.topic.summary = topic.summary;
                this.upload.coverImg = topic.coverImg;
                this.visible = true;
            },
            fetchData() {
                let _this = this;
                // eslint-disable-next-line no-empty
                if (_this.queryParams.authorId) {

                } else {
                    _this.loading = true;
                    _this.$axios.get(TOPICS_GET.concat("?").concat(qs.stringify(_this.queryParams)))
                        .then(function (response) {
                            if (response.data.code == 200) {
                                let result = response.data.result;
                                _this.data = result;
                                /*for (let i = 0; i < result.length ; i++) {
                                    _this.data.push(result[i]);
                                }*/
                                _this.loading = false;
                            } else {
                                _this.$message.info(response.data.message);
                            }
                        }).catch(function () {
                            _this.$message.warn("当前网络不稳定，请稍后重试。");
                        })
                }
            },
            toDel(topic) {
                let _this = this;
                _this.delModal.visible = true;
                _this.delModal.topic = topic;
                if (! _this.upgrade_privilege) {
                    _this.upgradePrivilege({
                        privilege: true,
                        url: undefined
                    })
                }
            },
            routeTopic(topicId) {
                this.$router.push('/topic/'.concat(topicId));
            },
            routeBlog(topicId, blogId) {
                this.$router.push('/topic/'.concat(topicId).concat('/blog/'.concat(blogId)));
            },
            changeTopicStatus(topic, status) {
                let _this = this;
                _this.$axios.patch(TOPIC_STATUS_PATCH.replace("{topicId}", topic.topicId), {
                    status: status
                }).then(function (response) {
                    let code = response.data.code;
                    if (code == 200) {
                        topic.status = status;
                    } else {
                        _this.$message.info(response.data.message);
                    }
                }).catch(function () {
                    _this.$message.warn("当前网络不稳定，请稍后重试。");
                })
            },
            deleteTopic() {
                let _this = this;
                let topic = this.delModal.topic;
                _this.$axios.delete(TOPIC_DELETE.replace("{topicId}", topic.topicId))
                    .then(function (response) {
                        let code = response.data.code;
                        if (code == 200) {
                            for (let i = 0; i < _this.data.length; i++) {
                                if (_this.data[i].topicId == topic.topicId) {
                                    _this.data.splice(i, 1);
                                    break;
                                }
                            }
                            _this.delModal.visible = false;
                            _this.$message.success("删除成功");
                        } else {
                            _this.$message.info(response.data.message);
                        }
                    }).catch(function () {
                        _this.$message.warn("当前网络不稳定，请稍后重试。");
                    })
            },
            createOrEditTopic() {
                let _this = this;
                let topicId = _this.topic.topicId;
                let title = _this.topic.title;
                let summary = _this.topic.summary;
                let coverImg = _this.upload.coverImg;
                if (title && summary && coverImg && title.length > 0 && summary.length > 0 && coverImg.length > 0) {
                    _this.confirmLoading = true;
                    if (topicId) {
                        _this.$axios.put(TOPIC_EDIT_PUT.replace("{topicId}", topicId), {
                            title: title,
                            summary: summary,
                            coverImg: coverImg
                        }).then(function (response) {
                            let code = response.data.code;
                            if (code == 200) {
                                _this.confirmLoading = false;
                                _this.visible = false;
                                _this.topic.holder.title = title;
                                _this.topic.holder.summary = summary;
                                _this.topic.holder.coverImg = coverImg;
                                return;
                            }
                            _this.confirmLoading = false;
                            _this.$message.info(response.data.message);
                        }).catch(function () {
                            _this.confirmLoading = false;
                            _this.$message.warn("当前网络不稳定，请稍后重试。");
                        })
                    } else {
                        _this.$axios.post(TOPIC_CREATE_POST, {
                            title: title,
                            summary: summary,
                            coverImg: coverImg
                        }).then(function (response) {
                            let code = response.data.code;
                            if (code == 200) {
                                _this.confirmLoading = false;
                                _this.$message.success("创建成功");
                                _this.visible = false;
                                _this.fetchData();
                                return;
                            }
                            _this.confirmLoading = false;
                            _this.$message.info(response.data.message);
                        }).catch(function () {
                            _this.confirmLoading = false;
                            _this.$message.warn("当前网络不稳定，请稍后重试。");
                        })
                    }
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
            },
            ...mapMutations({
                upgradePrivilege: UPGRADE_PRIVILEGE
            })
        }
    }
</script>

<style scoped>
    .topic-title {
        font-size: 20px;
    }
    .topic-desc {
        font-size: 14px;
    }
    .topic-info {
        font-size: 14px;
        color: #969696;
    }
    .ant-btn-link {
        padding-right: 8px ! important;
    }
    a {
        color: unset;
    }
    a:hover {
        color: black;
        text-decoration:underline;
    }
</style>