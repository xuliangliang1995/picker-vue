<template>
    <Main>
        <template slot="content" v-for="(value, key) in 5">
            <a-skeleton v-bind:key="key" avatar :paragraph="{rows: 4}" />
        </template>
    </Main>
</template>
<script>
    import Main from "@/components/layout/LayCenter";
    export default {
        components: {
            Main
        },
        data() {
            return {
            }
        }
    }
</script>
<style scoped>
    .skeleton-demo {
        border: 1px solid #f4f4f4;
    }
</style>
