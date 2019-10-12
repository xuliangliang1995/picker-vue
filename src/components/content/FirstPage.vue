<template>
    <div>
        <template v-for="(value, key, index) in 5">
            <a-skeleton v-bind:key="key" avatar :paragraph="{rows: 4}" />
        </template>
    </div>
</template>
<script>
    export default {
        data() {
            return {
            }
        }
    }
</script>
<style>
    .skeleton-demo {
        border: 1px solid #f4f4f4;
    }
</style>
