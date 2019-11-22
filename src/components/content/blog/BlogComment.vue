<template>
    <div :style="{marginTop: '50px'}">
        <a-comment>
            <a-avatar
                    v-if="isLoggingIn"
                    slot="avatar"
                    :src="avatar"
            />
            <div slot="content">
                <a-form-item>
                    <a-textarea :rows="4"  v-model="comment" :placeholder="commentPlaceholder"></a-textarea>
                </a-form-item>
                <a-form-item v-if="isLoggingIn">
                    <a-button htmlType="submit" :disabled="comment.length == 0" :loading="submitting" @click="handleSubmit" type="primary">
                        提交
                    </a-button>
                    <a-button type="dashed" :style="{marginLeft: '3px'}" v-if="replyCommentId > 0"  @click="cancelReply">
                        取消@{{replyAuthor}}
                    </a-button>
                </a-form-item>
            </div>
        </a-comment>
        <a-list
                class="comment-list"
                :header="`${commentsTotal} 条评论`"
                itemLayout="horizontal"
                :dataSource="data"
        >
            <a-list-item slot="renderItem" slot-scope="item">
                <IteComment :key="item.commentId" :item="item" @reply="reply"/>
            </a-list-item>
        </a-list>
    </div>
</template>
<script>
    import moment from 'moment';
    import IteComment from "@/components/content/blog/IteComment";
    import { mapState, mapGetters } from 'vuex';
    import { BLOG_COMMENT_POST, BLOG_COMMENT_GET } from "@/components/constant/url_path";

    export default {
        components: {IteComment},
        props: ['blogId'],
        data() {
            return {
                data: [],
                moment,
                comment: '',
                commentsTotal: 0,
                submitting: false,
                replyCommentId: 0,
                replyAuthor: undefined
            };
        },
        created() {
            let _this = this;
            _this.$axios.get(BLOG_COMMENT_GET.replace("{blogId}", _this.blogId).concat("?pageNo=1&pageSize=10"))
                .then(function (response) {
                    let code = response.data.code;
                    if (code == 200) {
                        let comments = response.data.result;
                        for (let i = 0; i < comments.length; i++) {
                            _this.data.push(comments[i]);
                        }
                        _this.commentsTotal = response.data.total;
                        /*commentContent: "评论内容"
                        commentId: 2
                        gmtCreate: null
                        replyCommentId: 0
                        replyComments: []
                        replyCount: null
                        userAvatar: "https://picker-oss.oss-cn-beijing.aliyuncs.com/20191121/f71581632c097e17d810e9b3a1b3f1f3.jpg_target"
                        userId: "d348b6e99cfc7e7a"
                        userName: "树林里面丢了鞋"*/
                    }
                })
                .catch(function () {
                    _this.$message.warn("评论加载失败")
                })
        },
        computed: {
            ...mapGetters([
                'isLoggingIn',
            ]),
            ...mapState([
                'avatar'
            ]),
            commentPlaceholder() {
                if (! this.isLoggingIn) {
                    return '登录后方可评论';
                }
                if (this.replyCommentId == 0) {
                    return '添加评论';
                }
                return '回复： ' + this.replyAuthor;
            }
        },
        methods: {
            handleSubmit() {
                let _this = this;
                _this.submitting = true;
                _this.$axios.post(BLOG_COMMENT_POST.replace("{blogId}", _this.blogId), {
                    replyCommentId: _this.replyCommentId,
                    content: _this.comment
                })
                    .then(function (response) {
                        _this.submitting = false;
                        let code = response.data.code;
                        if (code == 200) {
                            _this.comment = '';
                            _this.$message.success("添加成功");
                        } else {
                            _this.$message.info(response.data.message);
                        }
                    })
                    .catch(function () {
                        _this.submitting = false;
                        _this.$message.warn("当前网络环境不稳定，请稍后重试。");
                    })

            },
            reply(replyCommentId, replyAuthor) {
                this.replyCommentId = replyCommentId;
                this.replyAuthor = replyAuthor;
            },
            cancelReply() {
                this.replyCommentId = 0;
                this.replyAuthor = undefined;
            }
        }
    };
</script>
