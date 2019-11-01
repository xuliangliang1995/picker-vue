<template>
    <a-list itemLayout="vertical" :dataSource="data">
        <a-list-item slot="renderItem" slot-scope="item, index">
            <template v-if="! loading" slot="actions" v-for="{type, text} in actions">
                <span :key="type">
                  <a-icon :type="type" style="margin-right: 8px" />
                  {{text}}
                </span>
            </template>
            <img
                    v-if="! loading"
                    slot="extra"
                    width="272"
                    alt="logo"
                    src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
            />
            <a-skeleton :loading="loading"  avatar>
                <a-list-item-meta
                        description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                >
                    <a slot="title" href="https://vue.ant.design/">
                        <router-link :to="'/blog/' + item.blogId">
                            {{item.title}}
                        </router-link>
                    </a>
                    <a-avatar
                            slot="avatar"
                            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                    />
                </a-list-item-meta>
            </a-skeleton>
            <span v-if="! loading">
                We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.
            </span>
        </a-list-item>
    </a-list>
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
                ]
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
