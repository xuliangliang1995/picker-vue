<template>
    <div>
        <div v-if="data && data.length > 0" style="background-color: #f7f2f2; padding: 20px;">
            <template v-for="(item, index) in data">
                <a-row v-if="index % 2 == 0" :key="index" :gutter="16" :style="{marginBottom: '20px'}">
                    <a-col :span="12">
                        <a-card :bordered="false" @click="toHome(data[index].userId)" style="cursor: pointer">
                            <template slot="title">
                                <a-avatar
                                        :src="data[index].avatar ? data[index].avatar : 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png'"
                                />
                                {{data[index].nickName}}
                                <a-icon v-if="data[index].sex == 1" type="man" :style="{color:'#1E90FF'}" />
                                <a-icon v-if="data[index].sex == 2" type="woman" :style="{color:'#eb2f96'}"/>
                            </template>
                            <a-button
                                    v-if="! data[index].subscribe"
                                    @click="subscribe(data[index].userId)"
                                    slot="extra"
                                    type="primary"
                                    ghost>
                                关注
                            </a-button>
                            <a-card-meta>

                                <a-row slot="description">
                                    <a-col :span="6">
                                        文章：{{data[index].interactionData.blogCount}}
                                    </a-col>
                                    <a-col :span="6">
                                        关注：{{data[index].interactionData.subscribeCount}}
                                    </a-col>
                                    <a-col :span="6">
                                        粉丝：{{data[index].interactionData.fansCount}}
                                    </a-col>
                                    <a-col :span="6">
                                        获赞：{{data[index].interactionData.likedCount}}
                                    </a-col>
                                </a-row>
                            </a-card-meta>
                        </a-card>
                    </a-col>
                    <a-col :span="12" v-if="index + 1 < data.length">
                        <a-card :bordered="false" @click="toHome(data[index].userId)" style="cursor: pointer">
                            <template slot="title">
                                <a-avatar
                                        :src="data[index+1].avatar ? data[index+1].avatar : 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png'"
                                />
                                {{data[index+1].nickName}}
                                <a-icon v-if="data[index+1].sex == 1" type="man" :style="{color:'#1E90FF'}" />
                                <a-icon v-if="data[index+1].sex == 2" type="woman" :style="{color:'#eb2f96'}"/>
                            </template>
                            <a-button v-if="! data[index+1].subscribe"
                                      @click="subscribe(data[index+1].userId)"
                                      slot="extra"
                                      type="primary"
                                      ghost>
                                关注
                            </a-button>
                            <a-card-meta>

                                <a-row slot="description">
                                    <a-col :span="6">
                                        文章：{{data[index+1].interactionData.blogCount}}
                                    </a-col>
                                    <a-col :span="6">
                                        关注：{{data[index+1].interactionData.subscribeCount}}
                                    </a-col>
                                    <a-col :span="6">
                                        粉丝：{{data[index+1].interactionData.fansCount}}
                                    </a-col>
                                    <a-col :span="6">
                                        获赞：{{data[index+1].interactionData.likedCount}}
                                    </a-col>
                                </a-row>
                            </a-card-meta>
                        </a-card>
                    </a-col>
                </a-row>
            </template>
            <a-row type="flex" justify="end">
                <a-pagination
                        :total="total"
                        :pageSize="pageSize"
                        :itemRender="itemRender"
                        v-model="pageNo"
                        @change="pageChange"
                />
            </a-row>

        </div>
        <NoContent v-else content="暂无匹配内容"/>
    </div>
</template>
<script>
    import { USER_SEARCH, AUTHOR_SUBSCRIBE_POST_OR_DELETE } from "@/components/constant/url_path";
    import NoContent from "@/components/content/NoContent";
    import { mapGetters } from 'vuex';

    export default {
        components: {NoContent},
        created() {
            if (this.$route.query.q) {
                this.keyword = this.$route.query.q;
            } else {
                this.keyword = '';
            }
            this.fetchData();
        },
        data() {
            return {
                keyword: undefined,
                pageNo: 1,
                pageSize: 10,
                data: [],
                total: undefined
            }
        },
        computed: {
            ...mapGetters([
                'isLoggingIn'
            ])
        },
        methods: {
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
            toHome(pickerId) {
                this.$router.push('/user/'.concat(pickerId));
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
            }
        }
    }
</script>