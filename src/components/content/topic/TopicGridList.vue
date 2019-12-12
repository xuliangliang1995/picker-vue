<template>
    <div>
        <template v-for="(item, index) in topics">
            <a-row v-if="index / 3 == 0" :key="index" type="flex" justify="start">
                <a-col v-if="index < topics.length" :span="8">
                    <a-card style="width: 250px" @click="editTopic(topics[index].topicId)">
                        <img height="250" slot="cover" :src="topics[index].coverImg"/>
                        <a-card-meta :title="topics[index].title">
                            <template slot="description">{{topics[index].summary}}</template>
                        </a-card-meta>
                    </a-card>
                </a-col>
                <a-col v-if="index + 1 < topics.length" :span="8">
                    <a-card style="width: 250px" @click="editTopic(topics[index + 1].topicId)">
                        <img height="250" slot="cover" :src="topics[index + 1].coverImg"/>
                        <a-card-meta :title="topics[index + 1].title">
                            <template slot="description">{{topics[index + 1].summary}}</template>
                        </a-card-meta>
                    </a-card>
                </a-col>
                <a-col v-if="index + 2 < topics.length" :span="8">
                    <a-card style="width: 250px" @click="editTopic(topics[index + 2].topicId)">
                        <img height="250" slot="cover" :src="topics[index + 2].coverImg"/>
                        <a-card-meta :title="topics[index + 2].title">
                            <template slot="description">{{topics[index + 2].summary}}</template>
                        </a-card-meta>
                    </a-card>
                </a-col>
            </a-row>
        </template>
    </div>

</template>
<script>
    import { TOPICS_GET} from "@/components/constant/url_path";
    import qs from 'qs';

    export default {
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
        methods: {
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
            }
        }
    }
</script>
<style scoped>

</style>