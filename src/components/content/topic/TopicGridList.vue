<template>
    <div>
        <template v-for="(item, index) in topics">
            <a-row v-if="index % 3 == 0" :key="index" type="flex" justify="start">
                <a-col v-if="index < topics.length" :span="8">
                    <a-card style="width: 250px;marginBottom: 10px">
                        <img height="250" slot="cover" :src="topics[index].coverImg"/>
                        <template class="ant-card-actions" slot="actions">
                            <a-icon type="setting" @click="toEditTopic(topics[index])"/>
                            <a-icon type="read" @click="editTopic(topics[index].topicId)"/>
                            <a-dropdown :trigger="['click']">
                                <a-icon type="ellipsis" />
                                <a-menu slot="overlay">
                                    <a-menu-item @click="changeTopicStatus(topics[index], 1 - topics[index].status)">
                                        {{ topics[index].status == 0 ? '设为公开': '设为私密'}}
                                    </a-menu-item>
                                    <a-menu-item>
                                            <a-popconfirm
                                                    title="删除后无法恢复"
                                                    @confirm="deleteTopic(topics[index])"
                                                    okText="删除"
                                                    cancelText="取消"
                                            >
                                                    <template>
                                                        <a-icon type="delete"/> 删除
                                                    </template>
                                            </a-popconfirm>
                                    </a-menu-item>
                                </a-menu>
                            </a-dropdown>
                        </template>
                        <a-card-meta>
                            <span slot="title">
                                {{topics[index].title}} <PrivateTag v-if='topics[index].status == 0'/>
                            </span>
                            <template slot="description">{{topics[index].summary}}</template>
                        </a-card-meta>
                    </a-card>
                </a-col>
                <a-col v-if="index + 1 < topics.length" :span="8">
                    <a-card style="width: 250px;marginBottom: 10px">
                        <img height="250" slot="cover" :src="topics[index + 1].coverImg"/>
                        <template class="ant-card-actions" slot="actions">
                            <a-icon type="setting" @click="toEditTopic(topics[index + 1])"/>
                            <a-icon type="read" @click="editTopic(topics[index + 1].topicId)"/>
                            <a-dropdown :trigger="['click']">
                                <a-icon type="ellipsis" />
                                <a-menu slot="overlay">
                                    <a-menu-item @click="changeTopicStatus(topics[index + 1], 1 - topics[index + 1].status)">
                                        {{ topics[index + 1].status == 0 ? '设为公开': '设为私密'}}
                                    </a-menu-item>
                                    <a-menu-item>
                                        <a-popconfirm
                                                title="删除后无法恢复"
                                                @confirm="deleteTopic(topics[index + 1])"
                                                okText="删除"
                                                cancelText="取消"
                                        >
                                            <template>
                                                <a-icon type="delete"/> 删除
                                            </template>
                                        </a-popconfirm>
                                    </a-menu-item>
                                </a-menu>
                            </a-dropdown>
                        </template>
                        <a-card-meta>
                            <span slot="title">
                                {{topics[index + 1].title}} <PrivateTag v-if='topics[index + 1].status == 0'/>
                            </span>
                            <template slot="description">{{topics[index + 1].summary}}</template>
                        </a-card-meta>
                    </a-card>
                </a-col>
                <a-col v-if="index + 2 < topics.length" :span="8">
                    <a-card style="width: 250px;marginBottom: 10px">
                        <img height="250" slot="cover" :src="topics[index + 2].coverImg"/>
                        <template class="ant-card-actions" slot="actions">
                            <a-icon type="setting" @click="toEditTopic(topics[index + 2])"/>
                            <a-icon type="read" @click="editTopic(topics[index + 2].topicId)"/>
                            <a-dropdown :trigger="['click']">
                                <a-icon type="ellipsis" />
                                <a-menu slot="overlay">
                                    <a-menu-item @click="changeTopicStatus(topics[index + 2], 1 - topics[index + 2].status)">
                                        {{ topics[index + 2].status == 0 ? '设为公开': '设为私密'}}
                                    </a-menu-item>
                                    <a-menu-item>
                                        <a-popconfirm
                                                title="删除后无法恢复"
                                                @confirm="deleteTopic(topics[index + 2])"
                                                okText="删除"
                                                cancelText="取消"
                                        >
                                            <template>
                                                <a-icon type="delete"/> 删除
                                            </template>
                                        </a-popconfirm>
                                    </a-menu-item>
                                </a-menu>
                            </a-dropdown>
                        </template>
                        <a-card-meta>
                            <span slot="title">
                                {{topics[index + 2].title}} <PrivateTag v-if='topics[index + 2].status == 0'/>
                            </span>
                            <template slot="description">{{topics[index + 2].summary}}</template>
                        </a-card-meta>
                    </a-card>
                </a-col>
            </a-row>
        </template>
    </div>

</template>
<script>
    import PrivateTag from "@/components/content/topic/PrivateTag";
    import { TOPICS_GET, TOPIC_STATUS_PATCH, TOPIC_DELETE } from "@/components/constant/url_path";
    import { UPGRADE_PRIVILEGE } from "@/components/constant/mutation_types";
    import { mapMutations, mapState } from 'vuex';
    import qs from 'qs';

    export default {
        components: {
            PrivateTag
        },
        data() {
            return {
                topics:[],
                pageNo: 1,
                pageSize: 12
            }
        },
        created() {
            this.fetchData();
        },
        computed: {
            ...mapState([
                'upgrade_privilege'
            ])
        },
        methods: {
            init() {
                this.topics = [];
                this.pageNo = 1;
                this.pageSize = 12;
                this.fetchData();
            },
            fetchData() {
                let _this = this;
                _this.$axios.get(TOPICS_GET.concat("?").concat(qs.stringify({
                    pageNo: _this.pageNo,
                    pageSize: _this.pageSize
                }))).then(function (response) {
                    let code = response.data.code;
                    if (code == 200) {
                        let topics = response.data.result;
                        for (let i = 0; i < topics.length; i++) {
                            _this.topics.push(topics[i]);
                        }
                    }
                })
            },
            editTopic(topicId) {
                this.$router.push('/topic/'.concat(topicId));
            },
            toEditTopic(topic) {
                this.$emit("editTopic", topic);
            },
            changeTopicStatus(topic, status) {
                let _this = this;
                _this.$axios.patch(TOPIC_STATUS_PATCH.replace("{topicId}", topic.topicId), {
                    status: status
                }).then(function (response) {
                    let code = response.data.code;
                    if (code == 200) {
                        topic.status = status;
                    } else {
                        _this.$message.info(response.data.message);
                    }
                }).catch(function () {
                    _this.$message.warn("当前网络不稳定，请稍后重试。");
                })
            },
            deleteTopic(topic) {
                let _this = this;
                if (_this.upgrade_privilege) {
                    _this.$axios.delete(TOPIC_DELETE.replace("{topicId}", topic.topicId))
                        .then(function (response) {
                            let code = response.data.code;
                            if (code == 200) {
                                for (let i = 0; i < _this.topics.length; i++) {
                                    if (_this.topics[i].topicId == topic.topicId) {
                                        _this.topics.splice(i, 1);
                                        break;
                                    }
                                }
                            } else {
                                _this.$message.info(response.data.message);
                            }
                        }).catch(function () {
                        _this.$message.warn("当前网络不稳定，请稍后重试。");
                    })
                } else {
                    _this.upgradePrivilege({
                        privilege: true,
                        url: undefined
                    })
                }

            },
            refreshTopic(topic) {
                let _this = this;
                for (let i = 0; i < _this.topics.length; i++) {
                    if (_this.topics[i].topicId == topic.topicId) {
                        _this.topics[i] = topic;
                        break;
                    }
                }
            },
            ...mapMutations({
                upgradePrivilege: UPGRADE_PRIVILEGE
            })
        }
    }
</script>
<style scoped>

</style>