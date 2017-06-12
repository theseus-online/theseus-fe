<template>
    <Menu mode="horizontal" theme="light" :active-name="activeTab" @on-select="selectTab">
        <Row type="flex" justify="space-between">
            <Col span="2">
                <img src="../assets/images/logo.png" class="layout-logo"></img>
            </Col>
            <Col span="8">
                <Menu-item name="home">
                    <Icon type="home"></Icon>
                    Home
                </Menu-item>
                <Menu-item name="tutorial">
                    <Icon type="ios-book"></Icon>
                    Tutorial
                </Menu-item>
                <Menu-item name="about">
                    <Icon type="information"></Icon>
                    About
                </Menu-item>
                <Menu-item name="deploy" v-show="user">
                    <Icon type="cloud"></Icon>
                    Deploy
                </Menu-item>
            </Col>
            <Col span="2">
                <Tooltip content="logout" class="layout-avatar" placement="bottom" v-if="user">
                    <a href="/auth/logout"><img :src="user.avatar"></img></a>
                </Tooltip>
                <a href="/auth/login" v-else><Button type="ghost" shape="circle">Login</Button></a>
            </Col>
        </Row>
    </Menu>
</template>

<script>
    export default {
        props: ['user'],
        methods: {
            selectTab: function(name) {
                switch(name) {
                    case "deploy":
                        this.$router.push({ name: "deployment", params: { username: this.user.name }});
                        break;
                    default:
                        this.$router.push({ name: name });
                }
            }
        },
        computed: {
            activeTab : function() {
                if(this.$route.path.startsWith("/users")) {
                    return "deploy";
                }
                return this.$route.name;
            }
        }
    }
</script>

<style scoped>
    .layout-logo {
        width: 30px;
        height: 30px;
        border-radius: 3px;
        float: left;
        position: relative;
        top: 15px;
        left: 20px;
    }

    .layout-avatar {
        float: right;
        position: relative;
        top: 15px;
        right: 20px;
    }

    .layout-avatar img {
        width: 30px;
        height: 30px;
        border-radius: 3px;
    }
</style>
