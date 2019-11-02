<template>
    <a-row type="flex" justify="start">
        <a-col class="gutter-row" :span="20">
            <a-list itemLayout="vertical" :dataSource="data">
                <a-list-item slot="renderItem" slot-scope="item, index">
                    <div v-if="! loading">
                        <template  slot="actions" v-for="{type, text} in actions">
                    <span :key="type">
                      <a-icon :type="type" style="margin-right: 8px" />
                      {{text}}
                    </span>
                        </template>
                    </div>
                    <img
                            v-if="! loading"
                            slot="extra"
                            width="161"
                            height="100"
                            alt="logo"
                            :src="item.coverImg ? item.coverImg : 'https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png'"
                    />
                    <a-skeleton :loading="loading"  avatar>
                        <a-list-item-meta :description="'创建时间：' + item.gmtCreate">
                            <a slot="title">
                                <router-link :to="'/blog/' + item.blogId" :style="{'color':'unset'}">
                                    {{item.title}}
                                </router-link>
                                <template v-for="(tag, index) in item.labels">
                                    <a-tag :style="{'margin-left': '5px', 'margin-right': '-2px'}" :key="tag" :color="tagColors[index % tagColors.length]">{{ tag }}</a-tag>
                                </template>
                            </a>
                            <a-avatar
                                    slot="avatar"
                                    src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                            />
                        </a-list-item-meta>
                    </a-skeleton>
                    <span v-if="! loading">
                {{item.summary}}
            </span>
                </a-list-item>
            </a-list>
        </a-col>
    </a-row>
</template>

<script>
    import { BLOG_LIST_GET } from "@/components/constant/url_path";

    const data = [
        {
            title: 'Ant Design Title 1',
        },
        {
            title: 'Ant Design Title 2',
        },
        {
            title: 'Ant Design Title 3',
        },
        {
            title: 'Ant Design Title 4',
        },
        {
            title: 'Ant Design Title 5',
        }
    ];
    export default {
        data() {
            return {
                data,
                loading: true,
                actions: [
                    { type: 'star-o', text: '156' },
                    { type: 'like-o', text: '156' },
                    { type: 'message', text: '2' },
                ],
                tagColors:[  'red', 'purple', 'cyan', 'orange', 'blue',  'green', 'pink']
            };
        },
        mounted: function () {
            let _this = this;
            _this.$axios.get(BLOG_LIST_GET+"?pageNo=1&pageSize=10&categoryId=0").then(function (response) {
                let code = response.data.code;
                if (code == 200) {
                    _this.data = response.data.result;
                    _this.loading = false;
                }
            }).catch(function () {

            })
        }
    };
</script>
<style></style>
