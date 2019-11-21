<template>
    <LayBlogView>
        <a-row type="flex" justify="start" slot="content">
            <a-col class="gutter-row" :span="2">
            </a-col>
            <a-col class="gutter-row" :span="17">
                <MyBlogViewPage @author="author" filled="true"  :blogId="blogId"/>
            </a-col>
            <a-col class="gutter-row" :span="3" :style="{paddingLeft: '20px'}">
                <a-affix>
                    <UserCard v-if="pickerId" :pickerId="pickerId"/>
                </a-affix>
            </a-col>
        </a-row>

    </LayBlogView>
</template>
<script>
    import LayBlogView from "@/components/layout/LayBlogView";
    import UserCard from "@/components/content/user/UserCard";
    import MyBlogViewPage from "@/components/content/blog/MyBlogViewPage";

    export default {
        props:['blogId'],
        data() {
            return {
                pickerId: undefined
            }
        },
        components: {
            MyBlogViewPage,
            LayBlogView,
            UserCard
        },
        methods: {
            author(pickerId) {
                this.pickerId = pickerId;
            }
        }
    }
</script>
<style>

</style>