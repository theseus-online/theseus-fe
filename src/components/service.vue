<template>
    <Row>
        <Col span="16" offset="4">
            <Collapse v-if="services" accordion>
                <Panel v-for="svc in services" :key="svc.name">
                    {{svc.name}}
                    <div slot="content">
                        <Alert>This app contains {{svc.ports.length}} ports:</Alert>
                        <Collapse accordion>
                            <Panel v-for="p in svc.ports" :key="p.name">
                                {{p.name}}/{{p.protocol}}
                                <Alert type="warning" slot="content">{{svc.name}}.{{svc.owner}}:{{p.port}} -> {{svc.backend}}:{{p.targetPort}}</Alert>
                            </Panel>
                        </Collapse>
                        <Alert type="warning">
                            <Button type="ghost" shape="circle" @click="deleteService(svc)">
                                Delete This Service
                            </Button>
                        </Alert>
                    </div>
                </Panel>
            </Collapse>
            <Spin size="large" fix v-else></Spin>
        </Col>
        <Col span="4">
            <Affix :offset-top="80">
                <Button v-if="services" @click="createService" type="ghost" shape="circle" style="color: #00cc66; float: right;">
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
                services: null,
            }
        },
        mounted: function() {
            this.loadServices();
        },
        methods: {
            loadServices() {
                this.services = null;
                this.$http.get('users/' + this.$route.params.username + '/services').then(response => {
                    this.services = response.data;
                }, response => {
                    this.$Message.error('Load services failed!');
                });
            },
            createService() {
                this.$router.push({ name: "new-service" });
            },
            deleteService(s) {
                this.$router.push({ name: "del-service", params: { svcname: s.name }});
            }
        }
    }
</script>
