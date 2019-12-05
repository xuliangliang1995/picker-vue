<template>
    <div>
        <a-list v-if="data && data.length > 0" itemLayout="vertical" :dataSource="data" :style="{marginBottom:'50px'}">
            <a-list-item slot="renderItem" slot-scope="item, index">
                <template v-if="! loading">
                    <template  slot="actions">
                            <span :key="index">
                              <a-icon type="star-o" style="margin-right: 8px" />
                              {{item.interaction.favorite}}
                            </span>
                        <span :key="index">
                              <a-icon type="like-o" style="margin-right: 8px" />
                              {{item.interaction.like}}
                            </span>
                        <span :key="index">
                              <a-icon type="eye-o" style="margin-right: 8px" />
                              {{item.interaction.browse}}
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
                            <router-link :to="'/blog/' + item.blogId + '.html'" target="_blank"  :style="{'color':'unset'}" v-html="item.title"/>
                            <template v-for="(tag, index) in item.labels">
                                <a-tag :style="{'margin-left': '5px', 'margin-right': '-2px'}" :key="tag" :color="tagColors[index % tagColors.length]">{{ tag }}</a-tag>
                            </template>
                        </a>
                        <a-avatar slot="avatar" :src="item.authorAvatar"/>
                    </a-list-item-meta>
                </a-skeleton>
                <span v-if="! loading" v-html="item.summary"></span>
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
        <NoContent v-else content="暂无匹配内容"/>
    </div>
</template>
<script>
    import { BLOG_POOL_GET } from "@/components/constant/url_path";
    import NoContent from "@/components/content/NoContent";

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
        components: {NoContent},
        data() {
            return {
                data:[{title: ''},{title: ''},{title: ''},{title: ''},{title: ''},{title: ''}],
                isSkeleton: true,
                loading: true,
                showLoadingMore: false,
                loadingMore: false,
                /*tagColors:[  'red', 'purple', 'cyan', 'orange', 'blue',  'green', 'pink']*/
                tagColors:['cyan'],
                pageNo: 0,
                pageSize: 10,
                keyword: ''
            };
        },
        created() {
            if (this.$route.query.q) {
                this.keyword = this.$route.query.q;
            }
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

                _this.$axios.get(BLOG_POOL_GET + "?keyword=" + _this.keyword + "&pageNo=" + _this.pageNo + "&pageSize=" + _this.pageSize).then(function (response) {
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