<template>
    <Main>
        <a-row type="flex" justify="center" align="top" slot="content">
            <a-col class="gutter-row" :span="6">
                <router-view/>
            </a-col>
            <a-col class="gutter-row" :span="18">
                <router-view name="content"/>
            </a-col>
        </a-row>
    </Main>
</template>

<script>
    import Main from "@/components/layout/Main";

    export default {
        name: "UserSettingPage",
        data() {
            return {
            }
        },
        components: {
            Main
        }
    }
</script>

<style scoped>

</style>