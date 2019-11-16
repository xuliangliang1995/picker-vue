<template>
    <div>
        <a-row class="info_row" type="flex" justify="start" align="middle">
            <a-col class="gutter-row" :span="3" :offset="5">
                <a-spin :spinning="spinning" :style="{width:'400px', height:'400px'}">
                    <img :src="qrcodeUrl" width="400" height="400"/>
                </a-spin>
            </a-col>
        </a-row>
    </div>
</template>
<script>
    import { QRCODE_GET } from "@/components/constant/url_path";

    export default {
        data() {
            return {
                qrcodeUrl: undefined,
                spinning: true
            }
        },
        created() {
            let _this = this;
            _this.$axios.get(QRCODE_GET)
                .then(function (response) {
                    let code = response.data.code;
                    if (code == 200) {
                        _this.qrcodeUrl = response.data.result.qrcode;
                        _this.spinning = false;
                    } else {
                        _this.$message.warn(response.data.message);
                        _this.spinning = false;
                    }
                })
                .catch(function () {
                    _this.$message.warn("当前网络不稳定，请稍后重试。");
                    _this.spinning = false;
                })
        }
    }
</script>
<style>
</style>