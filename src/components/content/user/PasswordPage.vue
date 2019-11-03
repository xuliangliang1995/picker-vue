<template>
    <div>
        <a-row type="flex" justify="center" align="middle" style="margin:50px">
            <a-col :span="18">
                <a-divider style="font-size:30px"><a-icon type="lock" /></a-divider>
            </a-col>
        </a-row>
        <a-row type="flex" justify="center" align="middle">
            <a-col :span="5">
                <ChangePwdForm/>
            </a-col>
        </a-row>
    </div>
</template>

<script>
    import ChangePwdForm from "@/components/form/ChangePwdForm";
    export default {
        name: "Password",
        components: {
            ChangePwdForm
        }
    }
</script>

<style scoped>

</style>