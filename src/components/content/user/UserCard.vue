<template>
    <a-card hoverable :style="{width: '300px', backgroundColor: backgroundColor}">
        <img
                :width="297"
                :height="298"
                alt="cover"
                :src="avatar"
                slot="cover"
        />
        <template class="ant-card-actions" slot="actions">
            <a-icon v-if="subscribe" @click="subscribeStatus(false)" type="heart" theme="twoTone" twoToneColor="#eb2f96"/>
            <a-icon v-else type="heart" @click="subscribeStatus(true)"/>
            <a-icon type="message" />
            <a-icon type="home" />
        </template>
        <a-card-meta :description="signature ? signature : '暂无签名'">
            <span slot="title">
                {{name}}
                <a-icon v-if="sex == 1" type="man" :style="{color:'#1E90FF'}" />
                <a-icon v-if="sex == 2" type="woman" :style="{color:'#eb2f96'}"/>
            </span>
            <!--<a-avatar
                    slot="avatar"
                    :src="avatar"
            />-->
        </a-card-meta>
    </a-card>
</template>
<script>
    import { AUTHOR_INFO_GET, AUTHOR_SUBSCRIBE_STATUS_GET, AUTHOR_SUBSCRIBE_POST_OR_DELETE } from "@/components/constant/url_path";
    import { mapGetters } from 'vuex';
    export default {
        props:['pickerId'],
        created() {
            let _this = this;
            _this.$axios.get(AUTHOR_INFO_GET.replace("{pickerId}", _this.pickerId))
                .then(function (response) {
                    let code = response.data.code;
                    if (code == 200) {
                        _this.avatar = response.data.result.avatar;
                        _this.name = response.data.result.name;
                        _this.gender = response.data.result.sex;
                        _this.signature = response.data.result.signature;
                        _this.sex = response.data.result.sex;
                    }
                })
            _this.subscribe = false;
            if (_this.isLoggingIn) {
                _this.$axios.get(AUTHOR_SUBSCRIBE_STATUS_GET.replace("{pickerId}", _this.pickerId))
                    .then(function (response) {
                        let code = response.data.code;
                        if (code == 200) {
                            _this.subscribe = response.data.result;
                        }
                    })
            }
        },
        data() {
            return {
                avatar: "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
                name: "",
                signature: "暂无签名",
                gender: undefined,
                sexColors: ['unset', '#E0FFFF', '#FFF5EE'],
                sex: 0,
                subscribe: false
            }
        },
        computed: {
            backgroundColor() {
                return this.sexColors[this.sex];
            },
            ...mapGetters([
                'isLoggingIn'
            ])
        },
        methods: {
            subscribeStatus(subscribe) {
                let _this = this;
                if (! _this.isLoggingIn) {
                    _this.$message.info("登录后才可以关注噢~");
                    return;
                }
                if (subscribe) {
                    _this.$axios.post(AUTHOR_SUBSCRIBE_POST_OR_DELETE.replace("{pickerId}", _this.pickerId))
                        .then(function (response) {
                            if (response.data.code == 200) {
                                _this.subscribe = true;
                                _this.$message.success("关注成功");
                            } else {
                                _this.$message.info(response.data.message);
                            }
                        })
                        .catch(function () {
                            _this.$message.warn("当前网络不稳定，请稍后重试。");
                        })
                } else {
                    _this.$axios.delete(AUTHOR_SUBSCRIBE_POST_OR_DELETE.replace("{pickerId}", _this.pickerId))
                        .then(function (response) {
                            if (response.data.code == 200) {
                                _this.subscribe = false;
                                _this.$message.success("取消关注成功");
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
    }
</script>
<style scoped>
    .ant-card-bordered {
        border:unset
    }
</style>