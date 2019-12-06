<template>
    <a-layout class="main-wrapper">
        <a-row type="flex" justify="start">
            <a-col class="gutter-row" :span="15" :offset="3">
                <div class="content-wrapper" id="picker-content">
                    <a-skeleton v-if="loading" avatar :paragraph="{rows: 4}" />
                    <a-card v-else>
                        <a-card-meta :description="signature">
                            <span slot="title">
                                <a-row type="flex" justify="start">
                                    <a-col :span="5">
                                        {{name}}
                                        <a-icon v-if="sex == 1" type="man" :style="{color:'#1E90FF'}" />
                                        <a-icon v-if="sex == 2" type="woman" :style="{color:'#eb2f96'}"/>
                                        <a-popover v-if="mpQrcode" title="公众号二维码："  placement="rightTop">
                                            <template slot="content">
                                                <img :width="150" :height="150" :src="mpQrcode"/>
                                            </template>
                                            <a-icon style="margin-left: 20px;" type="scan"/>
                                        </a-popover>
                                    </a-col>
                                    <a-col :span="5" :offset="14">
                                        <a-button v-if="subscribe"
                                                  @click="subscribeStatus(false)"
                                                  @mouseover="unsubscribeBtnText='取消'"
                                                  @mouseout="unsubscribeBtnText='已关注'"
                                        >
                                            {{unsubscribeBtnText}}
                                        </a-button>
                                        <a-button v-else @click="subscribeStatus(true)">关注</a-button>
                                        <a-button style="margin-left: 2px" disabled>私信</a-button>
                                    </a-col>
                                </a-row>
                            </span>
                            <a-avatar slot="avatar" :src="avatar" style="width: 100px;height: 100px"/>
                        </a-card-meta>
                        <a-row>
                            <a-col :span="3">
                                文章：{{interactionData.blogCount}}
                            </a-col>
                            <a-col :span="3">
                                关注：{{interactionData.subscribeCount}}
                            </a-col>
                            <a-col :span="3">
                                粉丝：{{interactionData.fansCount}}
                            </a-col>
                            <a-col :span="3">
                                获赞：{{interactionData.likedCount}}
                            </a-col>
                        </a-row>
                    </a-card>
                    <div :style="{marginTop:'20px', minHeight:'500px'}">
                        <a-tabs defaultActiveKey="1">
                            <a-tab-pane tab="文章" key="1">
                                <BlogList :hideAvatar="true"/>
                            </a-tab-pane>
                            <a-tab-pane disabled tab="专题" key="2" forceRender>Content of Tab Pane 2</a-tab-pane>
                            <a-tab-pane disabled tab="动态" key="3">Content of Tab Pane 3</a-tab-pane>
                        </a-tabs>
                    </div>
                </div>
            </a-col>
            <a-col class="gutter-row" :span="4">
                <slot name="sider"></slot>
            </a-col>
        </a-row>
    </a-layout>
</template>

<script>
    import BlogList from "@/components/content/blog/BlogList";
    import { AUTHOR_INFO_GET, AUTHOR_SUBSCRIBE_STATUS_GET, AUTHOR_SUBSCRIBE_POST_OR_DELETE, AUTHOR_MP_QRCODE_GET, USER_INFO_GET } from "@/components/constant/url_path";
    import { mapGetters } from 'vuex';
    export default {
        props:['pickerId'],
        components:{ BlogList },
        created() {
            let _this = this;
            let url = USER_INFO_GET;
            if (_this.pickerId) {
                _this.authorId = _this.pickerId;
                url = AUTHOR_INFO_GET.replace("{pickerId}", _this.authorId);
            }
            _this.$axios.get(url)
                .then(function (response) {
                    let code = response.data.code;
                    if (code == 200) {
                        _this.loading = false;
                        _this.avatar = response.data.result.avatar;
                        _this.name = response.data.result.name;
                        _this.gender = response.data.result.sex;
                        _this.signature = response.data.result.signature;
                        _this.sex = response.data.result.sex;
                        _this.interactionData = response.data.result.interactionData;
                        _this.authorId = response.data.result.authorId;
                        _this.$axios.get(AUTHOR_MP_QRCODE_GET.replace("{pickerId}", _this.authorId))
                            .then(function (response) {
                                let code = response.data.code;
                                if (code == 200) {
                                    _this.mpQrcode = response.data.result;
                                }
                            })
                        if (_this.isLoggingIn) {
                            _this.$axios.get(AUTHOR_SUBSCRIBE_STATUS_GET.replace("{pickerId}", _this.authorId))
                                .then(function (response) {
                                    let code = response.data.code;
                                    if (code == 200) {
                                        _this.subscribe = response.data.result;
                                    }
                                })
                        }
                    }
                })
        },
        data() {
            return {
                authorId: undefined,
                unsubscribeBtnText: '已关注',
                loading: true,
                avatar: undefined,
                name: undefined,
                signature: "暂无签名",
                gender: undefined,
                sexColors: ['unset', '#E0FFFF', '#FFE0E3'],
                sex: 0,
                subscribe: false,
                mpQrcode: undefined,
                showQrcode: true,
                interactionData: undefined
            }
        },
        computed: {
            backgroundColor() {
                return this.sexColors[this.sex];
            },
            ...mapGetters([
                'isLoggingIn'
            ])
        },
        methods: {
            subscribeStatus(subscribe) {
                let _this = this;
                if (! _this.isLoggingIn) {
                    _this.$message.info("登录后才可以关注噢~");
                    return;
                }
                if (subscribe) {
                    _this.$axios.post(AUTHOR_SUBSCRIBE_POST_OR_DELETE.replace("{pickerId}", _this.pickerId))
                        .then(function (response) {
                            if (response.data.code == 200) {
                                _this.subscribe = true;
                                _this.$message.success("关注成功");
                            } else {
                                _this.$message.info(response.data.message);
                            }
                        })
                        .catch(function () {
                            _this.$message.warn("当前网络不稳定，请稍后重试。");
                        })
                } else {
                    _this.$axios.delete(AUTHOR_SUBSCRIBE_POST_OR_DELETE.replace("{pickerId}", _this.pickerId))
                        .then(function (response) {
                            if (response.data.code == 200) {
                                _this.subscribe = false;
                                _this.$message.success("取消关注成功");
                            } else {
                                _this.$message.info(response.data.message);
                            }
                        })
                        .catch(function () {
                            _this.$message.warn("当前网络不稳定，请稍后重试。");
                        })
                }
            }
        }
    }
</script>

<style scoped>
    .main-wrapper {
        padding: 40px 40px 0 0;
        min-height: 80%;
    }
    .content-wrapper {
        padding: 0px 40px 0 40px;
    }
</style>