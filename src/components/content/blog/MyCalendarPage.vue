<template>
    <div>
        <a-calendar @panelChange="onPanelChange" />
    </div>
</template>
<script>
    export default {
        methods: {
            onPanelChange(value, mode) {
                // eslint-disable-next-line no-console
                console.log(value, mode);
            },
        },
    }
</script>