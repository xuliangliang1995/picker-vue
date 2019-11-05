<template>
    <Main3>
        <a-row type="flex" justify="center" align="top" slot="content">
            <a-col class="gutter-row" :span="6">
                <router-view/>
            </a-col>
            <a-col class="gutter-row" :span="18">
                <router-view name="content"/>
            </a-col>
        </a-row>
    </Main3>
</template>

<script>
    import Main3 from "@/components/layout/Main3";

    export default {
        name: "UserSettingPage",
        data() {
            return {
            }
        },
        components: {
            Main3
        }
    }
</script>

<style scoped>

</style>