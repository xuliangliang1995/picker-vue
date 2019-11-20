<template>
    <LayBlogView>
        <a-row type="flex" justify="start" slot="content">
            <a-col class="gutter-row" :span="2">
            </a-col>
            <a-col class="gutter-row" :span="17">
                <MyBlogViewPage filled="true"  :blogId="blogId"/>
            </a-col>
            <a-col class="gutter-row" :span="3" :style="{paddingLeft: '20px'}">
                <a-affix>
                    <a-card hoverable style="width: 300px">
                        <img
                                alt="example"
                                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                                slot="cover"
                        />
                        <template class="ant-card-actions" slot="actions">
                            <a-icon type="setting" />
                            <a-icon type="edit" />
                            <a-icon type="ellipsis" />
                        </template>
                        <a-card-meta title="Card title" description="This is the description">
                            <a-avatar
                                    slot="avatar"
                                    src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                            />
                        </a-card-meta>
                    </a-card>
                </a-affix>
            </a-col>
        </a-row>

    </LayBlogView>
</template>
<script>
    import LayBlogView from "@/components/layout/LayBlogView";
    import MyBlogViewPage from "@/components/content/blog/MyBlogViewPage";

    export default {
        props:['blogId'],
        data() {
            return {
            }
        },
        components: {
            MyBlogViewPage,
            LayBlogView
        }
    }
</script>
<style>

</style>