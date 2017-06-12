<template>
    <div>
        <Affix @on-change="onAffix"><header-bar :user="userinfo"></header-bar></Affix>
        <header-bar :user="userinfo" v-if="showFakeBar" style="z-index: -1;"></header-bar>
        <router-view></router-view>
        <footer-bar></footer-bar>
    </div>
</template>

<script>
    import HeaderBar from './components/header.vue';
    import FooterBar from './components/footer.vue';

    export default {
        data: function() {
            return {
                userinfo: null,
                showFakeBar: false,
            }
        },
        mounted: function() {
            this.$http.get('myself').then(response => {
                this.userinfo = response.data;
            }, response => {});
        },
        components: {
            headerBar: HeaderBar,
            footerBar: FooterBar
        },
        methods: {
            onAffix: function() {
                this.showFakeBar = true;
            }
        }
    }
</script>
