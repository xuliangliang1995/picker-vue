<template>
    <LayBlogView>
        <a-row type="flex" justify="start" slot="content">
            <a-col class="gutter-row" :span="2">
                <a-affix :offsetTop="headerHeight">
                    <a-row type="flex" justify="space-around" align="middle" :style="{height: contentHeight}">
                        <a-col>
                            <p :style="{marginTop:'40px'}">
                                <a-tooltip placement="bottom">
                                    <span slot="title">点 赞</span>
                                    <a-button shape="circle" size="large" :style="{height:'60px', width:'60px'}">
                                        <a-icon type="like" :style="{fontSize: '30px'}"/>
                                    </a-button>
                                </a-tooltip>
                            </p>
                            <p :style="{marginTop:'40px'}">
                                <a-tooltip placement="bottom">
                                    <span slot="title">收藏</span>
                                    <a-button shape="circle" size="large" :style="{height:'60px', width:'60px'}">
                                        <a-icon type="star" :style="{fontSize: '30px'}"/>
                                    </a-button>
                                </a-tooltip>
                            </p>
                            <p :style="{marginTop:'40px'}">
                                <a-tooltip placement="bottom" @click.stop="changeCommentBoxShow($event)">
                                    <span slot="title">评论</span>
                                    <a-button shape="circle" size="large" :style="{height:'60px', width:'60px'}">
                                        <a-icon type="message" :style="{fontSize: '30px'}"/>
                                    </a-button>
                                </a-tooltip>
                            </p>
                        </a-col>
                    </a-row>
                </a-affix>
            </a-col>
            <a-col class="gutter-row" :span="17">
                <MyBlogViewPage @author="author" @render="renderToc" filled="true"  :blogId="blogId" :exclude-comments="true" :exclude-toc="true"/>
                <BlogComment :blogId="blogId" :showCommentBox="showCommentBox"/>
            </a-col>
            <a-col class="gutter-row" :span="4" :style="{paddingLeft: '20px'}">
                <a-row>
                    <a-col class="gutter-row">
                        <UserCard v-if="pickerId" :pickerId="pickerId"/>
                    </a-col>
                </a-row>
                <a-row>
                    <a-col class="gutter-row" :offset="1">
                        <a-affix>
                            <BlogAnchor :style="{margin:'50px'}" v-if="tocRender" :render="tocRender"/>
                        </a-affix>
                    </a-col>
                </a-row>
            </a-col>
        </a-row>
    </LayBlogView>
</template>
<script>
    import LayBlogView from "@/components/layout/LayBlogView";
    import UserCard from "@/components/content/user/UserCard";
    import MyBlogViewPage from "@/components/content/blog/MyBlogViewPage";
    import BlogComment from "@/components/content/blog/BlogComment";
    import BlogAnchor from "@/components/content/blog/BlogAnchor";

    const bodyHeight = document.body.clientHeight;
    const headerHeight = window.screen.height * 10 / 100;
    const contentHeight = bodyHeight * 0.8 - headerHeight;
    export default {
        props:['blogId'],
        data() {
            return {
                pickerId: undefined,
                contentHeight: contentHeight.toString().concat('px'),
                headerHeight: headerHeight,
                showCommentBox: false,
                tocRender: undefined
            }
        },
        created() {
            document.addEventListener('click', this.cancelCommentBox);
        },
        beforeDestroy () {
            document.removeEventListener('click', this.cancelCommentBox);
        },
        components: {
            MyBlogViewPage,
            LayBlogView,
            UserCard,
            BlogComment,
            BlogAnchor
        },
        methods: {
            author(pickerId) {
                this.pickerId = pickerId;
            },
            cancelCommentBox() {
                this.showCommentBox = false;
            },
            changeCommentBoxShow(e) {
                e.preventDefault();
                this.showCommentBox = ! this.showCommentBox;
            },
            renderToc(render) {
                this.tocRender = render;
            }
        }
    }
</script>
<style>

</style>