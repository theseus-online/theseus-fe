<template>
    <Row>
        <Col span="18" offset="3">
            <Collapse v-if="deployments" accordion>
                <Panel v-for="dep in deployments" :key="dep.name">
                    {{dep.name}}
                    <div slot="content">
                        <Alert>This app contains {{dep.pods.length}} pods:</Alert>
                        <Collapse accordion>
                            <Panel v-for="p in dep.pods" :key="p.name">
                                {{p.name}}
                                <span style="float: right; margin-right: 20px;">
                                    {{p.ip}}
                                </span>
                                <div slot="content">
                                    <Alert>This pod contains {{p.containers.length}} containers:</Alert>
                                    <Collapse accordion>
                                        <Panel v-for="c in p.containers" :key="c.name">
                                            {{c.name}}
                                            <span style="float: right; margin-right: 20px;">
                                                <Tag color="green" v-if="c.status.running">running</Tag>
                                                <Tag color="yellow" v-if="c.status.waiting">waiting</Tag>
                                                <Tag color="red" v-if="c.status.terminated">terminated</Tag>
                                            </span>
                                            <div slot="content">
                                                <Alert>{{c.image}}</Alert>
                                                <Alert v-if="c.status.running">
                                                    started at {{moment(c.status.running.started).startOf().fromNow()}}
                                                </Alert>
                                                <Alert type="warning" v-if="c.status.waiting && c.status.waiting.reason">
                                                    {{c.status.waiting.reason}}
                                                </Alert>
                                                <Alert type="warning" v-if="c.status.waiting && c.status.waiting.message">
                                                    {{c.status.waiting.message}}
                                                </Alert>
                                                <Alert type="error" v-if="c.status.terminated">
                                                    started at {{moment(c.status.terminated.started).startOf().fromNow()}}
                                                </Alert>
                                                <Alert type="error" v-if="c.status.terminated">
                                                    exited at {{moment(c.status.terminated.finished).startOf().fromNow()}}
                                                </Alert>
                                                <Alert type="error" v-if="c.status.terminated">
                                                    exit code: {{c.status.terminated.exitCode}}
                                                </Alert>
                                                <Alert type="error" v-if="c.status.terminated && c.status.terminated.reason">
                                                    {{c.status.terminated.reason}}
                                                </Alert>
                                                <Alert type="error" v-if="c.status.terminated && c.status.terminated.message">
                                                    {{c.status.terminated.message}}
                                                </Alert>
                                                <Button type="ghost" shape="circle" @click="checkLogs(p.name, c.name)">
                                                    Logs
                                                </Button>
                                                <Button type="ghost" shape="circle" @click="openShell(p.name, c.name)">
                                                    Shell
                                                </Button>
                                            </div>
                                        </Panel>
                                    </Collapse>
                                </div>
                            </Panel>
                        </Collapse>
                        <Alert type="warning">
                            <Button type="ghost" shape="circle" @click="deleteDeployment(dep)">
                                Delete This App
                            </Button>
                        </Alert>
                    </div>
                </Panel>
            </Collapse>
            <Spin size="large" fix v-else></Spin>
        </Col>
        <Col span="3">
            <Affix :offset-top="80">
                <Button v-if="deployments"
                    @click="createDeployment"
                    type="ghost" shape="circle"
                    style="color: #00cc66; float: right;">
                    <Icon type="plus-round"></Icon>
                </Button>
            </Affix>
        </Col>
    </Row>
</template>

<script>
    import moment from 'moment';

    export default {
        data: function() {
            return {
                deployments: null,
            }
        },
        mounted: function() {
            this.loadDeployments();
        },
        methods: {
            moment: moment,
            loadDeployments() {
                this.deployments = null;
                this.$http.get('users/' + this.$route.params.username + '/deployments').then(response => {
                    let deps = response.data;
                    for(let d of deps) {
                        let m = {}
                        for(let c of d.containers) {
                            m[c.name] = c;
                        }
                        for(let p of d.pods) {
                            for(let c of p.containers) {
                                c["image"] = m[c.name].image;
                                c["volumes"] = m[c.name].volumes;
                            }
                        }
                    }
                    this.deployments = deps;
                }, response => {
                    this.$Message.error('Load deployments failed!');
                });
            },
            createDeployment() {
                this.$router.push({ name: 'new-deployment' });
            },
            deleteDeployment(d) {
                this.$router.push({ name: 'del-deployment', params: { depname: d.name }});
            },
            checkLogs(pod, container) {
                this.$router.push({ name: 'log', params: { pod: pod, container: container }})
            },
            openShell(pod, container) {
                window.open('/web-shell/index.html?user=' + this.$route.params.username 
                           + '&pod=' + pod
                           + '&container=' + container);
            }
        }
    }
</script>
