<template>
    <a-anchor :affix="true" :offsetTop="110">
        <template v-for="item in data">
            <a-anchor-link :key="item.href" :href="item.href" :title="item.title" />
        </template>
    </a-anchor>
</template>
<script>
    export default {
        props: ['render'],
        data() {
            return {
                data:[]
            }
        },
        created() {
            let _this = this;
            _this.data = [];
            let dom = document.createElement('div')
            dom.innerHTML = _this.render;
            let newDom = dom.childNodes;
            let reg = /H[1-6]{1}/;
            for (let i = 0; i < newDom.length ; i++) {
                let nodeName = newDom[i].nodeName;
                if (reg.test(nodeName) && newDom[i].hasChildNodes()) {
                    // h 标签
                    let aTag = newDom[i].childNodes[0];
                    let text = newDom[i].textContent;
                    if (aTag.nodeName == 'A') {
                        let tagId = aTag.id;
                        _this.data.push({
                            title: text,
                            href: '#'.concat(tagId)
                        })
                    }
                }
            }
        }
    }

</script>
<style>

</style>