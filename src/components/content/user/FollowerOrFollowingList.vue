<template>
    <div>
        <a-skeleton v-if="loading" avatar :paragraph="{rows: 4}" />
        <a-list v-else :dataSource="data">
            <a-list-item slot="renderItem" slot-scope="item">
                <a-list-item-meta :description="item.signature">
                    <a slot="title">{{item.nickName}}
                        <a-icon v-if="item.sex == 1" type="man" :style="{color:'#1E90FF'}" />
                        <a-icon v-if="item.sex == 2" type="woman" :style="{color:'#eb2f96'}"/>
                    </a>
                    <a-avatar
                            slot="avatar"
                            :src="item.avatar ? item.avatar : defaultAvatar"
                    />
                </a-list-item-meta>
                <a-button v-if="item.subscribe"
                          @click="subscribeStatus(item, false)"
                          @mouseover="cancelBtnMouseOver(item)"
                          @mouseout="cancelBtnMouseOut(item)"
                >{{item.delable ? '取消' : '已关注'}}</a-button>
                <a-button type="primary" v-else @click="subscribeStatus(item, true)">关注</a-button>
            </a-list-item>
            <div v-if="showLoadingMore" slot="loadMore" :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }">
                <a-spin v-if="loadingMore" />
                <a-button v-else id="blog_pool_load_more_btn">加载更多数据</a-button>
            </div>
        </a-list>
    </div>
</template>

<script>
    import { FOLLOWER_LIST, FOLLOWING_LIST, AUTHOR_SUBSCRIBE_POST_OR_DELETE } from "@/components/constant/url_path";
    import qs from 'qs';
    import { mapGetters } from 'vuex';

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
        props:['authorId', "follower"],
        data() {
            return {
                data:[],
                pageNo: 1,
                pageSize: 10,
                defaultAvatar: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
                loading: true,
                showLoadingMore: false,
                loadingMore: false
            }
        },
        computed: {
            ...mapGetters([
                'isLoggingIn'
            ])
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
            cancelBtnMouseOver(item) {
                item.delable = true;
            },
            cancelBtnMouseOut(item) {
                item.delable = false;
            },
            fetchData() {
                let _this = this;
                _this.loadingMore = true;
                if (_this.follower) {
                    _this.$axios.get(FOLLOWER_LIST.replace("{pickerId}", _this.authorId).concat("?").concat(
                        qs.stringify({
                            pageNo: _this.pageNo,
                            pageSize: _this.pageSize
                        })
                    )).then(function (response) {
                        if (response.data.code == 200) {
                            let result = response.data.result;
                            for (let i = 0; i < result.length; i++) {
                                result[i].delable = false;
                                _this.data.push(result[i]);
                            }
                            _this.loading = false;
                            _this.loadingMore = false;
                            _this.showLoadingMore = response.data.total > ((_this.pageNo - 1) * _this.pageSize + response.data.result.length);
                            _this.scrollEvent();
                        } else {
                            _this.loadingMore = false;
                            _this.$message.info(response.data.message);
                        }
                    }).catch(function () {
                        _this.loadingMore = false;
                        _this.$message.warn("当前网络不稳定，请稍后重试。");
                    });
                } else {
                    _this.$axios.get(FOLLOWING_LIST.replace("{pickerId}", _this.authorId).concat("?").concat(
                        qs.stringify({
                            pageNo: _this.pageNo,
                            pageSize: _this.pageSize
                        })
                    )).then(function (response) {
                        if (response.data.code == 200) {
                            let result = response.data.result;
                            for (let i = 0; i < result.length; i++) {
                                result[i].delable = false;
                                _this.data.push(result[i]);
                            }
                            _this.loading = false;
                            _this.loadingMore = false;
                            _this.showLoadingMore = response.data.total > ((_this.pageNo - 1) * _this.pageSize + response.data.result.length);
                            _this.scrollEvent();
                        } else {
                            _this.loadingMore = false;
                            _this.$message.info(response.data.message);
                        }
                    }).catch(function () {
                        _this.loadingMore = false;
                        _this.$message.warn("当前网络不稳定，请稍后重试。");
                    });
                }
            },
            subscribeStatus(item, subscribe) {
                let _this = this;
                if (! _this.isLoggingIn) {
                    _this.$message.info("登录后才可以关注噢~");
                    return;
                }
                if (subscribe) {
                    _this.$axios.post(AUTHOR_SUBSCRIBE_POST_OR_DELETE.replace("{pickerId}", item.userId))
                        .then(function (response) {
                            if (response.data.code == 200) {
                                _this.subscribe = true;
                                _this.$message.success("关注成功");
                                item.subscribe = true;
                            } else {
                                _this.$message.info(response.data.message);
                            }
                        })
                        .catch(function () {
                            _this.$message.warn("当前网络不稳定，请稍后重试。");
                        })
                } else {
                    _this.$axios.delete(AUTHOR_SUBSCRIBE_POST_OR_DELETE.replace("{pickerId}", item.userId))
                        .then(function (response) {
                            if (response.data.code == 200) {
                                _this.subscribe = false;
                                _this.$message.success("取消关注成功");
                                item.subscribe = false;
                            } else {
                                _this.$message.info(response.data.message);
                            }
                        })
                        .catch(function () {
                            _this.$message.warn("当前网络不稳定，请稍后重试。");
                        })
                }
            },
            scrollEvent() {
                let loadMoreBtn = document.getElementById("blog_pool_load_more_btn");
                if (loadMoreBtn != undefined) {
                    let loadMore = inViewArea(loadMoreBtn);
                    if (loadMore) {
                        this.pageNo = this.pageNo + 1;
                        this.fetchData();
                    }
                }
            }

        }
    }
</script>

<style scoped>

</style>