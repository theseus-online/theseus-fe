<template>
    <Row>
        <Col span="16" offset="4">
            <Form :model="newbee" :label-width="80">
                <Form-item label="Name">
                    <Input v-model="newbee.name" placeholder="Ingress Name"
                        @on-focus="newbee.name=''" @on-blur="validateIngressName(newbee)">
                    </Input>
                </Form-item>
                <Form-item label="Domain">
                    <Input v-model="newbee.host" placeholder="Your Site Domain"
                        @on-focus="newbee.host=''" @on-blur="validateIngressHost(newbee)">
                    </Input>
                </Form-item>
                <Form-item label="Secure">
                    <i-switch v-model="newbee.secure">
                        <span slot="open">tls</span>
                        <span slot="close">tcp</span>
                    </i-switch>
                </Form-item>
                <Form-item label="Backend">
                    <Row type="flex" justify="space-between">
                        <Col span="11">
                            <Select v-model="newbee.serviceName" placeholder="Chose Service">
                                <Option v-for="s in services" :key="s.name" :value="s.name">{{s.name}}</Option>
                            </Select>
                        </Col>
                        <Col span="11">
                            <Select v-model="newbee.servicePort" placeholder="Chose Service Port">
                                <Option v-for="p in ports" :key="p.name" :value="p.port" :label="p.name + '(' + p.port + ')'">
                                    <span class="fixed-text-span">{{p.name}}</span>
                                    <span style="float:right;color:#ccc;">{{p.port}}</span>
                                </Option>
                            </Select>
                        </Col>
                    </Row>
                </Form-item>
                <Form-item>
                    <Tooltip content="Commit this ingress" placement="bottom">
                        <Button type="ghost" @click="deploy" :disabled="!commitable">Deploy</Button>
                    </Tooltip>
                    <Tooltip content="Cancel and go back" placement="bottom">
                        <Button type="ghost" @click="cancel">Cancel</Button>
                    </Tooltip>
                </Form-item>
            </Form>
        </Col>
    </Row>
</template>

<script>
    import uuid from 'uuid/v4';

    export default {
        data: function() {
            return {
                newbee: {           // New deployment
                    name: 'ingress-' + uuid(),
                    owner: this.$route.params.username,
                    host: uuid().slice(24) + '.theseus.online',
                    secure: false,
                    serviceName: '',
                    servicePort: ''
                },
                services: [],
                myIngresses: [],
                allIngresses: []
            }
        },
        mounted: function() {
            this.$http.get('users/' + this.$route.params.username + '/services').then(response => {
                this.services = response.data;
            }, response => {
                this.$Message.error('Load services failed!');
            });
            this.$http.get('users/' + this.$route.params.username + '/ingresses').then(response => {
                this.myIngresses = response.data;
            });
            this.$http.get('ingresses').then(response => {
                this.allIngresses = response.data;
            });
        },
        computed: {
            ports() {
                if(this.newbee.serviceName) {
                    for(const s of this.services) {
                        if(s.name == this.newbee.serviceName) {
                            return s.ports.filter(p => {
                                return p.protocol == "TCP";
                            });
                        }
                    }
                }
                return [];
            },
            commitable() {
                if(!this.newbee.serviceName) {
                    return false;
                }
                if(!this.newbee.servicePort) {
                    return false;
                }
                return true;
            }
        },
        methods: {
            validateIngressName(ing) {
                let name = 'ingress-' + uuid();
                if(!ing.name) {
                    ing.name = name;
                }
                for(let i of this.myIngresses) {
                    if(i.name == ing.name) {
                        this.$Notice.warning({
                            title: 'Conflict Ingress Name',
                            desc: 'ingress name ' + ing.name + ' conflict with existed ingress, it was reset to ' + name,
                            duration: 0
                        });
                        ing.name = name;
                    }
                }
            },
            validateIngressHost(ing) {
                let host = uuid().slice(24)  + '.theseus.online';
                if(!ing.host) {
                    ing.host = host;
                }
                for(let i of this.allIngresses) {
                    if(i.host == ing.host) {
                        this.$Notice.warning({
                            title: 'Conflict Host Name',
                            desc: 'host name ' + ing.host + ' conflict with existed host, it was reset to ' + host,
                            duration: 0
                        });
                        ing.host = host;
                    }
                }
                let reservePrefix = ing.host.match(/^(.*)\.?theseus\.online$/)
                if(reservePrefix && reservePrefix[1].length < 9) {
                    this.$Notice.warning({
                        title: 'Reserved Host Name',
                        desc: 'host name ' + ing.host + ' was reserved by theseus.online, it was reset to ' + host,
                        duration: 0
                    });
                    ing.host = host;
                }
            },
            deploy() {
                let ingress_name_regex = /^([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$/
                let domain_name_regex = /^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$/;
                if(!ingress_name_regex.test(this.newbee.name)) {
                    this.$Notice.error({
                        title: 'Error Ingress Name',
                        desc: 'ingress name ' + this.newbee.name + ' is invalid, valid example: ingress, example.com',
                        duration: 0
                    });
                    return;
                }
                if(!domain_name_regex.test(this.newbee.host)) {
                    this.$Notice.error({
                        title: 'Error Domain Format',
                        desc: 'domain ' + this.newbee.host + ' is invalid, valid example: example.com',
                        duration: 0
                    });
                    return;
                }

                this.$http.post('users/' + this.$route.params.username + '/ingresses', this.newbee).then(response => {
                    this.$Message.success('Deploy success!');
                    this.$router.push({ name: "ingress" });
                }, response => {
                    this.$Message.error('Deploy failed!');
                });
            },
            cancel() {
                this.$router.push({ name: "ingress" });
            }
        }
    }
</script>

<style scoped>
    .fixed-text-span {
        display: inline-block;
        width: 85%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>
