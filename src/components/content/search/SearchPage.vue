<template>
    <SearchLay>
        <a-row type="flex" justify="center" align="top" slot="content">
            <a-col class="gutter-row" :span="5">
                <a-affix>
                    <router-view/>
                </a-affix>
            </a-col>
            <a-col class="gutter-row" :span="18" :offset="1">
                <router-view name="content"/>
            </a-col>
        </a-row>
    </SearchLay>
</template>

<script>
    import SearchLay from "@/components/layout/SearchLay";

    export default {
        data() {
            return {
            }
        },
        components: {
            SearchLay
        }
    }
</script>

<style scoped>

</style>