<template>
    <LayBlogView>
        <a-row type="flex" justify="start" slot="content">
            <a-col class="gutter-row" :span="2">
                <a-affix :offsetTop="headerHeight">
                    <a-row type="flex" justify="space-around" align="middle" :style="{height: contentHeight}">
                        <a-col>
                            <p :style="{marginTop:'40px'}">
                                <a-tooltip placement="bottom" @click="toLike">
                                    <span slot="title">点 赞</span>
                                    <a-button
                                            shape="circle" size="large"
                                            :style="{height:'60px', width:'60px'}"
                                    >
                                        <a-icon :theme="like?'filled':'outlined'" type="like" :style="{fontSize: '30px'}"/>
                                    </a-button>
                                </a-tooltip>
                            </p>
                            <p :style="{marginTop:'40px'}">
                                <a-tooltip placement="bottom" @click="toFavorite">
                                    <span slot="title">收 藏</span>
                                    <a-button
                                            shape="circle" size="large"
                                            :style="{height:'60px', width:'60px'}"
                                    >
                                        <a-icon :theme="favorite?'filled':'outlined'" type="star" :style="{fontSize: '30px'}"/>
                                    </a-button>
                                </a-tooltip>
                            </p>
                            <p :style="{marginTop:'40px'}">
                                <a-tooltip placement="bottom">
                                    <span slot="title">评 论</span>
                                    <a href="#_comment">
                                        <a-button shape="circle" size="large" :style="{height:'60px', width:'60px'}">
                                            <a-icon type="message" :style="{fontSize: '30px'}"/>
                                        </a-button>
                                    </a>
                                </a-tooltip>
                            </p>
                        </a-col>
                    </a-row>
                </a-affix>
            </a-col>
            <a-col class="gutter-row" :span="17">
                <MyBlogViewPage @author="author" @render="renderToc" filled="true"  :blogId="blogId" :exclude-comments="true" :exclude-toc="true"/>
                <BlogComment :blogId="blogId"/>
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
    import { BLOG_LIKE, BLOG_FAVORITE} from "@/components/constant/url_path";

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
                tocRender: undefined,
                like: false,
                favorite: false
            }
        },
        created() {
            let _this = this;
            _this.$axios.get(BLOG_LIKE.replace("{blogId}", _this.blogId))
                .then(function (response) {
                    let code = response.data.code;
                    if (code == 200) {
                        _this.like = response.data.result;
                    }
                })
            _this.$axios.get(BLOG_FAVORITE.replace("{blogId}", _this.blogId))
                .then(function (response) {
                    let code = response.data.code;
                    if (code == 200) {
                        _this.favorite = response.data.result;
                    }
                })
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
            renderToc(render) {
                this.tocRender = render;
            },
            toLike() {
                let _this = this;
                if (_this.like) {
                    _this.$axios.delete(BLOG_LIKE.replace("{blogId}", _this.blogId))
                        .then(function (response) {
                            let code = response.data.code;
                            if (code == 200) {
                                _this.like = false;
                            }
                        })
                } else {
                    _this.$axios.post(BLOG_LIKE.replace("{blogId}", _this.blogId))
                        .then(function (response) {
                            let code = response.data.code;
                            if (code == 200) {
                                _this.like = true;
                            }
                        })
                }
            },
            toFavorite() {
                let _this = this;
                if (_this.favorite) {
                    _this.$axios.delete(BLOG_FAVORITE.replace("{blogId}", _this.blogId))
                        .then(function (response) {
                            let code = response.data.code;
                            if (code == 200) {
                                _this.favorite = false;
                            }
                        })
                } else {
                    _this.$axios.post(BLOG_FAVORITE.replace("{blogId}", _this.blogId))
                        .then(function (response) {
                            let code = response.data.code;
                            if (code == 200) {
                                _this.favorite = true;
                            }
                        })
                }

            }
        }
    }
</script>
<style>

</style>