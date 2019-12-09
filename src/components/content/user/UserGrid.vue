<template>
    <div>
        <a-card v-if="data && data.length > 0" :title="title" :style="{marginBottom: '20px'}">
            <a href="#" @click.prevent.stop="toSearch" slot="extra">查看更多</a>
            <a-row :gutter="16" :style="{marginBottom: '20px'}">
                <template v-for="(item, index) in data"  style="background-color: #f7f2f2; padding: 20px;">
                    <a-col :key="index" :span="cardSpan">
                        <a-card :bordered="false" @click="toHome(item.userId)" style="cursor: pointer">
                            <template slot="title">
                                <a-avatar
                                        :src="item.avatar ? item.avatar : 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png'"
                                />
                                {{item.nickName}}
                                <a-icon v-if="item.sex == 1" type="man" :style="{color:'#1E90FF'}" />
                                <a-icon v-if="item.sex == 2" type="woman" :style="{color:'#eb2f96'}"/>
                            </template>
                            <a-button
                                    v-if="! item.subscribe"
                                    @click="subscribe(item.userId)"
                                    slot="extra"
                                    type="primary"
                                    ghost>
                                关注
                            </a-button>
                            <a-card-meta>

                                <a-row slot="description">
                                    <a-col :span="6">
                                        文章：{{item.interactionData.blogCount}}
                                    </a-col>
                                    <a-col :span="6">
                                        关注：{{item.interactionData.subscribeCount}}
                                    </a-col>
                                    <a-col :span="6">
                                        粉丝：{{item.interactionData.fansCount}}
                                    </a-col>
                                    <a-col :span="6">
                                        获赞：{{item.interactionData.likedCount}}
                                    </a-col>
                                </a-row>
                            </a-card-meta>
                        </a-card>
                    </a-col>
                </template>
            </a-row>
        </a-card>
    </div>
</template>
<script>
    import { USER_SEARCH, AUTHOR_SUBSCRIBE_POST_OR_DELETE } from "@/components/constant/url_path";
    import { mapGetters } from 'vuex';

    export default {
        created() {
            if (this.$route.query.q) {
                this.keyword = this.$route.query.q;
                this.title = '相关用户：'
            } else {
                this.keyword = '';
            }
            this.fetchData();
        },
        data() {
            return {
                keyword: undefined,
                pageNo: 1,
                pageSize: 3,
                data: [],
                total: undefined,
                title: '推荐关注：'
            }
        },
        computed: {
            ...mapGetters([
                'isLoggingIn'
            ]),
            cardSpan() {
                let span = 24 / this.data.length;
                return span;
            }
        },
        methods: {
            toHome(pickerId) {
                this.$router.push('/user/'.concat(pickerId));
            },
            fetchData() {
                let _this = this;
                const pageNo = _this.pageNo;
                _this.$axios.get(
                    USER_SEARCH.concat("?keyword=").concat(_this.keyword ? _this.keyword : '')
                        .concat("&pageNo=").concat(_this.pageNo)
                        .concat("&pageSize=").concat(_this.pageSize)
                ).then(function (response) {
                    let code = response.data.code;
                    if (code == 200) {
                        _this.data = response.data.result;
                        _this.total = response.data.total;
                        _this.pageNo = pageNo;
                    }
                })
            },
            pageChange(page, pageSize) {
                this.pageNo = page;
                this.pageSize = pageSize;
                this.fetchData();
            },
            itemRender(current, type, originalElement) {
                if (type === 'prev') {
                    return <a-button>上一页</a-button>;
                } else if (type === 'next') {
                    return <a-button>下一页</a-button>;
                }
                return originalElement;
            },
            subscribe(pickerId) {
                let _this = this;
                if (! _this.isLoggingIn) {
                    _this.$message.info("登录后才可以关注噢~");
                    return;
                }
                _this.$axios.post(AUTHOR_SUBSCRIBE_POST_OR_DELETE.replace("{pickerId}", pickerId))
                    .then(function (response) {
                        if (response.data.code == 200) {
                            _this.subscribe = true;
                            _this.$message.success("关注成功");
                            _this.fetchData();
                        } else {
                            _this.$message.info(response.data.message);
                        }
                    })
                    .catch(function () {
                        _this.$message.warn("当前网络不稳定，请稍后重试。");
                    })
            },
            toSearch() {
                let key = [this.$route.path.split("/")[1].length > 0 ? this.$route.path.split("/")[1] : 'home'];
                let isSearch = "search" == key;
                if (isSearch) {
                    window.location.href = '/search/user'.concat("?q=").concat(this.keyword)
                } else {
                    window.open('/search/user?q='.concat(this.keyword), "_blank");
                }
            },
        }
    }
</script>
<style scoped>
    .ant-card {
        background-color: #f7f2f2;
    }
</style>