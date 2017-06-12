<template>
    <Row>
        <Col span="16" offset="4">
            <Form :model="newbee" :label-width="80">
                <Form-item label="App">
                    <Input v-model="newbee.name" placeholder="App Name"
                          @on-focus="newbee.name=''" @on-blur="validateAppName(newbee)">
                    </Input>
                </Form-item>
                <Form-item label="Replicas">
                     <Input-number :min="1" :max="3" v-model="newbee.replicas"></Input-number>
                </Form-item>
                <Form-item v-for="(c, i) in newbee.containers" :key="i" :label="'Image' + (i + 1)">
                    <Row type="flex" justify="space-between" style="margin-top: 7px; margin-bottom: 7px;">
                        <Col span="10">
                            <Input v-model="c.name" placeholder="Image Name"
                                   @on-focus="c.name=''" @on-blur="validateContainerName(c)">
                            </Input>
                        </Col>
                        <Col span="10"><Input v-model="c.image" placeholder="Image Address"></Input></Col>
                        <Col span="3">
                            <Tooltip content="Remove this image" placement="bottom" style="float: right;">
                                <Button type="ghost" style="color: #ff3300;"
                                    @click="removeContainer(i)" :disabled="!canRemoveContainer">
                                    <Icon type="minus-round"></Icon>
                                </Button>
                            </Tooltip>
                        </Col>
                    </Row>
                    <Row  type="flex" justify="space-between" v-for="(v, i) in c.volumes"
                        :key="i" :label="'Volume' + (i + 1)" style="margin-top: 7px; margin-bottom: 7px;">
                        <Col span="10">
                            <Input v-model="v.mountPath" @on-blur="validateMountPath(c, v)"
                                placeholder="Set mouint point(eg. /path/data)">
                            </Input>
                        </Col>
                        <Col span="10">
                            <Select v-model="v.name" placeholder="Chose Volume" @on-change="checkVolume(v)">
                                <Option key="" value="empty-dir">
                                    <span style="color: red">Create A New Empty Directory</span>
                                </Option>
                                <Option v-for="vo in emptydirs" :key="vo.name" :value="vo.name">
                                    {{vo.name}}
                                </Option>
                                <Option v-for="vo in volumes" :key="vo.name" :value="vo.name">
                                    {{vo.name}}
                                </Option>
                            </Select>
                        </Col>
                        <Col span="3">
                            <Tooltip content="Remove this volume" placement="bottom" style="float: right;">
                                <Button type="ghost" style="color: #ff3300;" @click="removeVolume(c, i)">
                                    <Icon type="trash-a"></Icon>
                                </Button>
                            </Tooltip>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="24">
                            <Tooltip content="Add more volume" placement="bottom">
                                <Button type="ghost" style="color: #00cc66;" @click="addVolume(c)">
                                    Attach Volume
                                </Button>
                            </Tooltip>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="8">
                            <Checkbox v-model="c.custom_entry">
                                Use custom entry
                            </Checkbox>
                        </col>
                        <Col span="16">
                            <Input v-model="c.entry" v-show="c.custom_entry"
                                placeholder="Command">
                            </Input>
                        </Col>
                    </Row>
                </Form-item>
                <Form-item>
                    <Tooltip content="Add more image" placement="bottom">
                        <Button type="ghost" style="color: #00cc66;" @click="addContainer">
                            <Icon type="plus-round"></Icon>
                        </Button>
                    </Tooltip>
                </Form-item>
                <Form-item>
                    <Tooltip content="Commit this deployment" placement="bottom">
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
    import stringArgv from 'string-argv';

    export default {
        data: function() {
            return {
                newbee: {           // New deployment
                    name: 'deployment-' + uuid(),
                    owner: this.$route.params.username,
                    replicas: 1,
                    containers: [
                        {
                            name: 'container-' + uuid(),
                            image: null,
                            volumes: [],
                            custom_entry: false,
                            entry: null
                        }
                    ]
                },
                volumes: [],
                deployments: [],
                emptydirs: []
            }
        },
        mounted: function() {
            this.$http.get('users/' + this.$route.params.username + '/volumes').then(response => {
                this.volumes = response.data;
            }, response => {
                this.$Message.error('Load volumes failed!');
            });
            this.$http.get('users/' + this.$route.params.username + '/deployments').then(response => {
                this.deployments = response.data;
            });
        },
        computed: {
            canRemoveContainer: function() {
                return this.newbee.containers.length > 1;
            },
            commitable: function() {
                for(let c of this.newbee.containers) {
                    if(!c.image) {
                        return false;
                    }
                    for(let v of c.volumes) {
                        if(!v.name || !v.mountPath) {
                            return false;
                        }
                    }
                }
                return true;
            }
        },
        methods: {
            validateAppName(app) {
                let name = 'deployment-' + uuid();
                if(!app.name) {
                    app.name = name;
                }
                for(let d of this.deployments) {
                    if(d.name == app.name) {
                        this.$Notice.warning({
                            title: 'Conflict App Name',
                            desc: 'app name ' + app.name + ' conflict with existed deployment, it was reset to ' + name,
                            duration: 0
                        });
                        app.name = name;
                    }
                }
            },
            validateContainerName(cont) {
                let name = 'container-' + uuid();
                let count = 0;
                if(!cont.name) {
                    cont.name = name;
                    return;
                }
                for(let c of this.newbee.containers) {
                    if(c.name == cont.name) {
                        count++;
                        if(count > 1) {
                            this.$Notice.warning({
                                title: 'Conflict Container Name',
                                desc: 'more than one container named ' + cont.name + ', the latter was reset to ' + name,
                                duration: 0
                            });
                            cont.name = name;
                        }
                    }
                }
            },
            validateMountPath(cont, volume) {
                let count = 0;
                if(!volume.mountPath) {
                    return;
                }
                for(let v of cont.volumes) {
                    if(v.mountPath == volume.mountPath) {
                        count++;
                        if(count > 1) {
                            this.$Notice.warning({
                                title: 'Conflict Mount Path',
                                desc: 'more than one volume mount on path ' +
                                      volume.mountPath +
                                      ' in container ' +
                                      cont.name +
                                      ', the latter was reset to empty',
                                duration: 0
                            });
                            volume.mountPath = '';
                        }
                    }
                }
            },
            checkVolume(v) {
                if(v.name == 'empty-dir') {
                    let ndir = {
                        name: 'empty-dir-' + uuid(),
                        owner: this.$route.params.username
                    }
                    this.emptydirs.push(ndir);
                    v.name = ndir.name;
                }
            },
            addVolume(c) {
                c.volumes.push({
                    name: null,
                    mountPath: null,
                });
            },
            removeVolume(c, i) {
                c.volumes.splice(i, 1);
            },
            addContainer() {
                this.newbee.containers.push({
                    name: 'container-' + uuid(),
                    image: null,
                    volumes: []
                });
            },
            removeContainer(i) {
                this.newbee.containers.splice(i, 1);
            },
            deploy() {
                let app_name_regex = /^(([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9])?$/;
                let image_name_regex = /^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/;
                if(!app_name_regex.test(this.newbee.name)) {
                    this.$Notice.error({
                        title: 'Error App Name',
                        desc: 'app name ' + this.newbee.name + ' is invalid, valid example: MyApp, my_app, 12345',
                        duration: 0
                    });
                    return;
                }
                for(let c of this.newbee.containers) {
                    if(!image_name_regex.test(c.name)) {
                        this.$Notice.error({
                            title: 'Error Image Name',
                            desc: 'image name ' + c.name + ' is invalid, valid example: my-name, 123-abc',
                            duration: 0
                        });
                        return;
                    }
                    if(c.custom_entry && c.entry.trim().length > 0) {
                        if(c.entry.indexOf('\\') > -1) {
                            this.$Notice.error({
                                title: 'Error Command',
                                desc: 'escape character is not support currently, in command: ' + c.entry,
                                duration: 0
                            });
                            return;
                        }
                        let a = stringArgv(c.entry);
                        c.command = a[0];
                        c.args = a.splice(1);
                    }
                    delete c.custom_entry;
                    delete c.entry;
                }

                this.$http.post('users/' + this.$route.params.username + '/deployments', this.newbee).then(response => {
                    this.$Message.success('Deploy success!');
                    this.$router.push({ name: "deployment" });
                }, response => {
                    this.$Message.error('Deploy failed!');
                });
            },
            cancel() {
                this.$router.push({ name: "deployment" });
            }
        }
    }
</script>
