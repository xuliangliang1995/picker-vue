<template>
    <div>
        <UserGrid/>
        <BlogList/>
    </div>
</template>
<script>
    import UserGrid from "@/components/content/user/UserGrid";
    import BlogList from "@/components/content/blog/BlogList";
    export default {
        components: {BlogList, UserGrid}
    }
</script>