<template>
    <div>
        <a-skeleton v-if="loading"/>
        <template v-else v-for="item in data">
            <a-row :key="item.topicId" type="flex" justify="start">
                <a-col :span="3">
                    <img width="127" height="168" :src="item.coverImg" @click="routeTopic(item.topicId)"/>
                </a-col>
                <a-col :span="21">
                    <a-row>
                        <a-col :span="10">
                                <span class="topic-title">
                                    <strong>
                                        <a type="link" @click.stop.prevent="routeTopic(item.topicId)">{{ item.title }}</a>
                                    </strong>
                                    <PrivateTag v-if='item.status == 0'/>
                                </span>
                        </a-col>
                        <a-col :span="12" class="topic-info" :style="{textAlign: 'right'}">
                            <a-rate disabled :value="5"/>
                        </a-col>
                    </a-row>
                    <a-row>
                        <span class="topic-info">{{ item.summary }} </span>
                    </a-row>
                    <template v-if="item.links && item.links.length > 0">
                        <a-row :style="{marginTop: '15px'}">
                            <a-col :span="8">
                                        <span class="topic-desc">
                                            <a href="#" @click.stop.prevent="routeBlog(item.topicId, item.links[0].blogId)">01 | {{item.links[0].title}}</a>
                                        </span>
                            </a-col>
                            <a-col :span="8" v-if="item.links.length > 1">
                                        <span class="topic-desc">
                                            <a href="#" @click.stop.prevent="routeBlog(item.topicId, item.links[1].blogId)">02 | {{item.links[1].title}}</a>
                                        </span>
                            </a-col>
                        </a-row>
                    </template>
                    <template v-else>
                        <a-row :style="{height: '15px'}"></a-row>
                    </template>
                    <template v-if="item.links && item.links.length > 2">
                        <a-row :style="{marginTop: '20px'}">
                            <a-col :span="8">
                                        <span class="topic-desc">
                                            <a href="#" @click.stop.prevent="routeBlog(item.topicId, item.links[2].blogId)">03 | {{item.links[2].title}}</a>
                                        </span>
                            </a-col>
                            <a-col :span="8" v-if="item.links.length > 3">
                                        <span class="topic-desc">
                                            <a href="#" @click.stop.prevent="routeBlog(item.topicId, item.links[3].blogId)">04 | {{item.links[3].title}}</a>
                                        </span>
                            </a-col>
                        </a-row>
                    </template>
                    <template v-else>
                        <a-row :style="{height: '20px'}"></a-row>
                    </template>
                    <a-row :style="{marginTop: '10px'}">
                        <a-col :span="11">
                            <span class="topic-info">{{ item.ownerName }} </span>
                            <span class="topic-info" :style="{marginLeft: '10px'}">{{ item.gmtCreate }}</span>
                        </a-col>
                        <a-col :span="11" class="topic-desc" :style="{textAlign: 'right'}">
                            <a-button type="link">评分</a-button>
                            <a-button type="link">收藏</a-button>
                        </a-col>
                    </a-row>
                    <a-divider/>
                </a-col>
            </a-row>
        </template>
        <div
                v-if="showLoadingMore"
                :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }"
        >
            <a-spin id="topic_pool_load_more_btn"/>
        </div>

    </div>
</template>

<script>
    import { TOPIC_POOL_GET } from "@/components/constant/url_path";
    import qs from 'qs';

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
        name: "TopicPool",
        data() {
            return {
                loading: true,
                showLoadingMore: false,
                data: [],
                queryParams:{
                    keyword: undefined,
                    pageNo: 1,
                    pageSize: 10,
                    authorId: undefined
                }
            }
        },
        created() {
            if (this.$route.query.q) {
                this.queryParams.keyword = this.$route.query.q;
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
                _this.$axios.get(TOPIC_POOL_GET.concat("?").concat(qs.stringify(_this.queryParams)))
                    .then(function (response) {
                        let code = response.data.code;
                        _this.loading = false;
                        if (code == 200) {
                            let result = response.data.result;
                            for (let i = 0; i < result.length ; i++) {
                                _this.data.push(result[i]);
                            }
                            let total = response.data.total;
                            _this.showLoadingMore = total > (_this.queryParams.pageNo - 1) * _this.queryParams.pageSize + result.length;
                            _this.scrollEvent();
                        } else {
                            _this.$message.info(response.data.message);
                        }
                    }).catch(function () {
                        _this.loading = false;
                        _this.$message.warn("当前网络不稳定，请稍后重试。");
                    })
            },
            routeTopic(topicId) {
                window.open('/topic/'.concat(topicId), "_blank");
            },
            routeBlog(topicId, blogId) {
                window.open('/topic/'.concat(topicId).concat('/blog/'.concat(blogId)), "_blank");
            },
            scrollEvent() {
                let loadMoreBtn = document.getElementById("topic_pool_load_more_btn");
                if (loadMoreBtn != undefined) {
                    let loadMore = inViewArea(loadMoreBtn);
                    if (loadMore) {
                        this.queryParams.pageNo = this.queryParams.pageNo + 1;
                        this.fetchData();
                    }
                }
            }
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