<template>
    <Main>
        <div slot="content">
            <a-carousel autoplay>
                <div><h3>1</h3></div>
                <div><h3>2</h3></div>
                <div><h3>3</h3></div>
                <div><h3>4</h3></div>
            </a-carousel>
            <a-list itemLayout="vertical" :dataSource="data" :style="{marginBottom:'50px'}">
                <a-list-item slot="renderItem" slot-scope="item, index">
                    <template v-if="! loading">
                        <template  slot="actions" v-for="{type, text} in actions">
                            <span :key="type">
                              <a-icon :type="type" style="margin-right: 8px" />
                              {{text}}
                            </span>
                        </template>
                    </template>
                    <img
                            v-if="! loading"
                            slot="extra"
                            width="242"
                            height="150"
                            alt="logo"
                            :src="item.coverImg ? item.coverImg : 'https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png'"
                    />
                    <a-skeleton :loading="loading"  avatar>
                        <a-list-item-meta :description="'作者：' + item.author">
                            <a slot="title">
                                <router-link :to="'/blog/' + item.blogId + '.html'" target="_blank"  :style="{'color':'unset'}">
                                    {{item.title}}
                                </router-link>
                                <template v-for="(tag, index) in item.labels">
                                    <a-tag :style="{'margin-left': '5px', 'margin-right': '-2px'}" :key="tag" :color="tagColors[index % tagColors.length]">{{ tag }}</a-tag>
                                </template>
                            </a>
                            <a-avatar slot="avatar" :src="item.authorAvatar"/>
                        </a-list-item-meta>
                    </a-skeleton>
                    <span v-if="! loading">
                        {{item.summary}}
                    </span>
                </a-list-item>
                <div
                        v-if="showLoadingMore"
                        slot="loadMore"
                        :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }"
                >
                    <a-spin v-if="loadingMore" />
                    <a-button v-else id="blog_pool_load_more_btn">加载更多数据</a-button>
                </div>
            </a-list>
        </div>
    </Main>
</template>
<script>
    import Main from "@/components/layout/LayCenter";
    import { BLOG_POOL_GET } from "@/components/constant/url_path";

    /**
     * 判断某个元素是否在可视区域
     * @param element
     * @returns {boolean}
     */
    function inViewArea(element) {
        let windowHeight = window.innerHeight;
        let rect = element.getBoundingClientRect();
        let top = rect.top;
        let bottom = rect.bottom;
        let isTopInWindow = 0 < top && top < windowHeight;
        let isBottomInWindow = 0 < bottom && bottom <= windowHeight;
        return isTopInWindow || isBottomInWindow;
    }

    export default {
        components: {
            Main
        },
        data() {
            return {
                data:[{title: ''},{title: ''},{title: ''},{title: ''},{title: ''},{title: ''}],
                isSkeleton: true,
                loading: true,
                showLoadingMore: false,
                loadingMore: false,
                actions: [
                    { type: 'star-o', text: '156' },
                    { type: 'like-o', text: '156' },
                    { type: 'message', text: '2' },
                ],
                /*tagColors:[  'red', 'purple', 'cyan', 'orange', 'blue',  'green', 'pink']*/
                tagColors:['cyan'],
                pageNo: 0,
                pageSize: 10
            };
        },
        mounted: function () {
            let _this = this;
            _this.fetchData();
            document.addEventListener('scroll', _this.scrollEvent)
        },
        beforeDestroy() {
            document.removeEventListener('scroll', this.scrollEvent);
        },
        methods: {
            fetchData() {
                let _this = this;
                _this.pageNo += 1;
                _this.loadingMore = true;
                _this.$axios.get(BLOG_POOL_GET+"?pageNo=" + _this.pageNo + "&pageSize=" + _this.pageSize).then(function (response) {
                    _this.loadingMore = false;
                    let code = response.data.code;
                    if (code == 200) {
                        if (_this.isSkeleton) {
                            _this.data = response.data.result;
                            _this.isSkeleton = false;
                        } else {
                            for (let i = 0; i < response.data.result.length; i++) {
                                _this.data.push(response.data.result[i]);
                            }
                        }
                        _this.loading = false;
                        _this.showLoadingMore = response.data.total > ((_this.pageNo - 1) * _this.pageSize + response.data.result.length);
                    }
                }).catch(function () {
                    _this.loadingMore = false;
                    _this.$message.warn("当前网络不稳定，请稍后重试。");
                })
            },
            scrollEvent() {
                let loadMoreBtn = document.getElementById("blog_pool_load_more_btn");
                if (loadMoreBtn != undefined) {
                    let loadMore = inViewArea(loadMoreBtn);
                    if (loadMore) {
                        this.fetchData();
                    }
                }
            }
        }
    }
</script>
<style scoped>
    .skeleton-demo {
        border: 1px solid #f4f4f4;
    }
    .ant-carousel >>> .slick-slide {
        text-align: center;
        height: 240px;
        line-height: 240px;
        background: #364d79;
        overflow: hidden;
        margin-bottom: 30px;
    }

    .ant-carousel >>> .slick-slide h3 {
        color: #fff;
    }
</style>
