<template>
    <Row>
        <Col span="16" offset="4">
            <Form :model="newbee" :label-width="80">
                <Form-item label="Service">
                    <Row type="flex" justify="space-between">
                        <Col span="11">
                            <Input v-model="newbee.name" placeholder="Service Name"
                                @on-focus="newbee.name=''" @on-blur="validateServiceName(newbee)">
                            </Input>
                        </Col>
                        <Col span="11">
                            <Select v-model="newbee.backend" placeholder="Chose Backend App">
                                <Option v-for="d in deployments" :key="d.name" :value="d.name">{{d.name}}</Option>
                            </Select>
                        </Col>
                    </Row>
                </Form-item>
                <Form-item v-for="(p, i) in newbee.ports" :key="i" :label="'Port' + (i + 1)">
                    <Row>
                        <Col span="2" style="text-align: right">name:</Col>
                        <Col span="9">
                            <Input v-model="p.name" placeholder="Port Name"
                                @on-focus="p.name=''" @on-blur="validatePortName(p)">
                            </Input>
                        </Col>
                        <Col span="2" offset="2" style="text-align: right">protocol:</Col>
                        <Col span="9">
                            <Select v-model="p.protocol" placeholder="Chose Protocol">
                                <Option value="TCP">TCP</Option>
                                <Option value="UDP">UDP</Option>
                            </Select>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="2" style="text-align: right">srcPort:</Col>
                        <Col span="4"><Input-number :max="65535" :min="1" v-model="p.port"></Input-number></Col>
                        <Col span="2" offset="7" style="text-align: right">dstPort:</Col>
                        <Col span="4"><Input-number :max="65535" :min="1" v-model="p.targetPort"></Input-number></Col>
                        <Col span="5">
                            <Tooltip content="Remove this port" placement="bottom" style="float: right;" v-show="canRemovePort">
                                <Button type="ghost" style="color: #ff3300;" @click="removePort(i)">
                                    <Icon type="minus-round"></Icon>
                                </Button>
                            </Tooltip>
                        </Col>
                    </Row>
                </Form-item>
                <Form-item>
                    <Tooltip content="Add more port" placement="bottom">
                        <Button type="ghost" style="color: #00cc66;" @click="addPort">
                            <Icon type="plus-round"></Icon>
                        </Button>
                    </Tooltip>
                </Form-item>
                <Form-item>
                    <Tooltip content="Commit this service" placement="bottom">
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
                    name: 'service-' + uuid(),
                    owner: this.$route.params.username,
                    backend: '',
                    ports: [
                        {
                            name: 'port-' + uuid(),
                            protocol: 'TCP',
                            port: 80,
                            targetPort: 80
                        }
                    ]
                },
                deployments: [],
                services: []
            }
        },
        mounted: function() {
            this.$http.get('users/' + this.$route.params.username + '/deployments').then(response => {
                this.deployments = response.data;
            }, response => {
                this.$Message.error('Load deployments failed!');
            });
            this.$http.get('users/' + this.$route.params.username + '/services').then(response => {
                this.services = response.data;
            });
        },
        computed: {
            canRemovePort: function() {
                return this.newbee.ports.length > 1;
            },
            commitable: function() {
                if(!this.newbee.backend) {
                    return false;
                }
                return true;
            }
        },
        methods: {
            validateServiceName(svc) {
                let name = 'deployment-' + uuid();
                if(!svc.name) {
                    svc.name = name;
                }
                for(let s of this.services) {
                    if(s.name == svc.name) {
                        this.$Notice.warning({
                            title: 'Conflict Service Name',
                            desc: 'service name ' + svc.name + ' conflict with existed service, it was reset to ' + name,
                            duration: 0
                        });
                        svc.name = name;
                    }
                }
            },
            validatePortName(port) {
                let name = 'port-' + uuid();
                let count = 0;
                if(!port.name) {
                    port.name = name;
                }
                for(let p of this.newbee.ports) {
                    if(p.name == port.name) {
                        count++;
                        if(count > 1) {
                            this.$Notice.warning({
                                title: 'Conflict Port Name',
                                desc: 'more than one port named ' + port.name + ', the latter was reset to ' + name,
                                duration: 0
                            });
                            port.name = name;
                        }
                    }
                }
            },
            addPort() {
                this.newbee.ports.push({
                    name: 'port-' + uuid(),
                    protocol: 'TCP',
                    port: 80,
                    targetPort: 80
                });
            },
            removePort(i) {
                this.newbee.ports.splice(i, 1);
            },
            deploy() {
                let service_name_regex = /^[a-z]([-a-z0-9]*[a-z0-9])?$/;
                let port_name_regex = /^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/
                if(!service_name_regex.test(this.newbee.name)) {
                    this.$Notice.error({
                        title: 'Error Service Name',
                        desc: 'service name ' + this.newbee.name + ' is invalid, valid example: my-svc, abc-123',
                        duration: 0
                    });
                    return;
                }
                for(let p of this.newbee.ports) {
                    if(!port_name_regex.test(p.name)) {
                        this.$Notice.error({
                            title: 'Error Port Name',
                            desc: 'port name ' + p.name + ' is invalid, valid example: my-name, 123-abc',
                            duration: 0
                        });
                        return;
                    }
                }

                this.$http.post('users/' + this.$route.params.username + '/services', this.newbee).then(response => {
                    this.$Message.success('Deploy success!');
                    this.$router.push({ name: "service" });
                }, response => {
                    this.$Message.error('Deploy failed!');
                });
            },
            cancel() {
                this.$router.push({ name: "service" });
            }
        }
    }
</script>
