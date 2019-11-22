<template>
    <a-comment :key="item.commentId" :author="item.userName + (replyAuthor != undefined ? (' 回复 ' + replyAuthor) : '')" :avatar="item.userAvatar" :style="{width:'100%'}">
        <template slot="actions">
            <span>
                <a-tooltip>
                  <a-icon type="like" :theme="item.liked ? 'filled' : 'outlined'" @click="like" />
                </a-tooltip>
                <span :style="{paddingLeft: '1px',cursor: 'auto'}">
                  {{item.likes > 0 ? item.likes : '赞'}}
                </span>
            </span>
            <span @click="reply(item.commentId, item.userName)">
                <a-tooltip>
                  <a-icon type="message"/>
                </a-tooltip>
                <span :style="{paddingLeft: '1px',cursor: 'auto'}">
                  回复
                </span>
            </span>
            <span v-if="item.replyComments.length > 0">
                <span :style="{paddingLeft: '1px',cursor: 'auto'}" @click="() => {spread = !spread}">
                  {{spread ? '收起回复' : ('查看回复（'+item.replyComments.length+'）')}}
                </span>
            </span>
        </template>
        <p slot="content">
            {{item.commentContent}}
        </p>
        <template v-if="spread">
            <template  v-for="subItem in item.replyComments">
                <a-row :key="subItem.commentId" type="flex" justify="start">
                    <a-col class="gutter-row" :span="23" :offset="1">
                        <ite-comment @reply="reply" :key="subItem.commentId" :item="subItem" :replyAuthor="item.userName"/>
                    </a-col>
                </a-row>
            </template>
        </template>
        <a-tooltip slot="datetime" :title="item.gmtCreate">
            <span>{{moment(item.gmtCreate, 'YYYY-MM-DD hh:mm:ss').fromNow()}}</span>
        </a-tooltip>
    </a-comment>
</template>
<script>
    import moment from 'moment';
    export default {
        name: 'IteComment',
        data() {
          return {
              moment,
              spread: false
          }
        },
        props:['item', 'replyAuthor'],
        methods: {
            like() {
                this.$message.info("开发中");
            },
            reply(replyCommentId, replyAuthor) {
                this.$emit('reply', replyCommentId, replyAuthor);
            }
        }
    }
</script>
<style scoped></style>