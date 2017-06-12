<template>
    <Row type="flex" justify="start">
        <Col span="5">
            <Menu theme="light" :active-name="$route.name" @on-select="selectTab">
                <Menu-item name="deployment">
                    <Icon type="android-cloud-outline"></Icon>
                    Deployment
                </Menu-item>
                <Menu-item name="service">
                    <Icon type="android-bulb"></Icon>
                    Service
                </Menu-item>
                <Menu-item name="ingress">
                    <Icon type="social-rss-outline"></Icon>
                    Ingress
                </Menu-item>
                <Menu-item name="volume">
                    <Icon type="social-dropbox-outline"></Icon>
                    Volume
                </Menu-item>
            </Menu>
        </Col>
        <Col span="18" style="margin-top: 20px;">
            <router-view></router-view>
        </Col>
    </Row>
</template>

<script>
    export default {
        mounted: function() {
            if(this.$route.name == 'user') {
                this.$router.push({ name: "deployment" });
            }
        },
        methods: {
            selectTab: function(name) {
                this.$router.push({name: name});
            }
        }
    }
</script>
