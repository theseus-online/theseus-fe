<template>
    <Row>
        <Col span="16" offset="4">
            <Collapse v-if="ingresses" accordion>
                <Panel v-for="ing in ingresses" :key="ing.name">
                    {{ing.name}}
                    <span style="float: right; margin-right: 20px;">
                        <span v-if="ing.secure">https</span><span v-else>http</span>:{{ing.host}}
                    </span>
                    <div slot="content">
                        <Alert>
                            This ingress points domain
                            <strong>{{ing.host}}</strong>
                            to service
                            <strong>{{ing.serviceName}}.{{ing.owner}}:{{ing.servicePort}}</strong>
                        </Alert>
                        <Alert type="warning">
                            <Button type="ghost" shape="circle" @click="deleteIngress(ing)">
                                Delete This Ingress
                            </Button>
                        </Alert>
                    </div>
                </Panel>
            </Collapse>
            <Spin size="large" fix v-else></Spin>
        </Col>
        <Col span="4">
            <Affix :offset-top="80">
                <Button v-if="ingresses" @click="createIngress" type="ghost" shape="circle" style="color: #00cc66; float: right;">
                    <Icon type="plus-round"></Icon>
                </Button>
            </Affix>
        </Col>
    </Row>
</template>

<script>
    export default {
        data: function() {
            return {
                ingresses: null,
            }
        },
        mounted: function() {
            this.loadIngresses();
        },
        methods: {
            loadIngresses() {
                this.ingresses = null;
                this.$http.get('users/' + this.$route.params.username + '/ingresses').then(response => {
                    this.ingresses = response.data;
                }, response => {
                    this.$Message.error('Load ingresses failed!');
                });
            },
            createIngress() {
                this.$router.push({ name: "new-ingress" });
            },
            deleteIngress(i) {
                this.$router.push({ name: "del-ingress", params: { ingname: i.name }});
            }
        }
    }
</script>
