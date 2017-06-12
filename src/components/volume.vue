<template>
    <Row>
        <Col span="18" offset="3">
            <Collapse v-if="volumes" accordion>
                <Panel v-for="v in volumes" :key="v.name">
                    {{v.name}}
                    <div slot="content">
                        <Row>
                            <Col span="12">
                                <Tree :data="v.root" @on-select-change="selectTreeNode"></Tree>
                            </Col>
                            <Col span="12">
                                <Form v-if="selectFile">
                                    <Form-item>
                                        <Button @click="saveNodeContent" type="ghost" shape="circle" v-show="nodeContentEditing">Save</Button>
                                        <Button @click="editNodeContent" type="ghost" shape="circle" v-show="!nodeContentEditing">Edit</Button>
                                        <Button @click="cancelNodeEdit" type="ghost" shape="circle" v-show="nodeContentEditing">Cancel</Button>
                                        <Button @click="deleteFile(v)" type="ghost" shape="circle" v-show="!nodeContentEditing">Delete</Button>
                                    </Form-item>
                                    <Form-item>
                                        <Input v-model="selectedNode.content" type="textarea" :disabled="!nodeContentEditing" :rows="10"></Input>
                                    </Form-item>
                                </Form>
                                <Form v-if="selectFolder">
                                    <Form-item>
                                        <Button @click="newFolder" type="ghost" shape="circle" v-show="!creatingNewBee">New Folder</Button>
                                        <Button @click="newFile" type="ghost" shape="circle" v-show="!creatingNewBee">New File</Button>
                                        <Button @click="deleteFolder(v)" type="ghost" shape="circle" v-show="deleteable && !creatingNewBee">Delete Folder</Button>

                                        <Button @click="saveNewBee" type="ghost" shape="circle" v-show="creatingNewBee">Save</Button>
                                        <Button @click="cancelNewBee" type="ghost" shape="circle" v-show="creatingNewBee">Cancel</Button>
                                    </Form-item>
                                    <Form-item v-show="creatingNewBee">
                                        <Input v-model="newBeeName" type="text" placeholder="Name"></Input>
                                    </Form-item>
                                </Form>
                            </Col>
                        </Row>
                        <Alert type="warning">
                            <Button type="ghost" shape="circle" @click="deleteVolume(v)">
                                Delete This Volume
                            </Button>
                        </Alert>
                    </div>
                </Panel>
            </Collapse>
            <Spin size="large" fix v-else></Spin>
        </Col>
        <Col span="3">
            <Affix :offset-top="80">
                <Button v-if="volumes" @click="createVolume" type="ghost" shape="circle" style="color: #00cc66; float: right;">
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
                volumes: null,
                selectedNode: null,
                nodeContentEditing: false,
                creatingFile: false,
                creatingFolder: false,
                newBeeName: '',
            }
        },
        mounted: function() {
            this.loadVolumes();
        },
        computed: {
            selectFile() {
                if(!this.selectedNode) {
                    return false;
                }
                return !this.selectedNode.children;
            },
            selectFolder() {
                if(!this.selectedNode) {
                    return false;
                }
                return this.selectedNode.children;
            },
            deleteable() {
                if(!this.selectFolder) {
                    return false;
                }
                if(this.selectedNode.path == '/') {
                    return false;
                }
                return this.selectedNode.children.length == 0;
            },
            creatingNewBee() {
                return this.creatingFile || this.creatingFolder;
            }
        },
        methods: {
            newFolder() {
                this.creatingFolder = true;
            },
            newFile() {
                this.creatingFile = true;
            },
            cancelNewBee() {
                this.creatingFolder = this.creatingFile = false;
            },
            saveNewBee() {
                let n = this.selectedNode;
                if(this.creatingFolder) {
                    this.$http.put('users/' + this.$route.params.username + '/volumes/' + n.volume + '/folders' + n.path + '/' + this.newBeeName)
                        .then(response => {
                            n.children.push(this.buildTree({ name: this.newBeeName, type: "folder", children: [] }, n.volume, n.path));
                            this.creatingFolder = false;
                            this.$Message.success('Create folder success!');
                        }, response => {
                            this.$Message.error('Create folder failed!');
                        });
                } else if(this.creatingFile) {
                    this.$http.put('users/' + this.$route.params.username + '/volumes/' + n.volume + '/files' + n.path + '/' + this.newBeeName)
                        .then(response => {
                            n.children.push(this.buildTree({ name: this.newBeeName, type: "file", content: "" }, n.volume, n.path));
                            this.creatingFile = false;
                            this.$Message.success('Create file success!');
                        }, response => {
                            this.$Message.error('Create file failed!');
                        });
                }
            },
            editNodeContent() {
                this.nodeContentEditing = true;
            },
            saveNodeContent() {
                let n = this.selectedNode;
                this.$http.put('users/' + this.$route.params.username + '/volumes/' + n.volume + '/files' + n.path, n.content).then(response => {
                    this.$Message.success('Update file success!');
                    this.nodeContentEditing = false;
                }, response => {
                    this.$Message.error('Update file failed!');
                });
            },
            cancelNodeEdit() {
                this.nodeContentEditing = false;
            },
            reloadVolume(v) {
                this.$http.get('users/' + this.$route.params.username + '/volumes/' + v.name).then(response => {
                    v.root = [];
                    v.root.push(this.buildTree(response.data, v.name , ""));
                }, response => {
                    this.$Message.error('Load files for ' + v.name + ' failed!');
                });
            },
            deleteFolder(v) {
                let n = this.selectedNode;
                this.$http.delete('users/' + this.$route.params.username + '/volumes/' + n.volume + '/folders' + n.path).then(response => {
                    this.$Message.success('Delete success!');
                    this.selectedNode = null;
                    this.reloadVolume(v);
                }, response => {
                    this.$Message.error('Delete failed!');
                });
            },
            deleteFile(v) {
                let n = this.selectedNode;
                this.$http.delete('users/' + this.$route.params.username + '/volumes/' + n.volume + '/files' + n.path).then(response => {
                    this.$Message.success('Delete success!');
                    this.selectedNode = null;
                    this.reloadVolume(v);
                }, response => {
                    this.$Message.error('Delete failed!');
                });
            },
            buildTree(raw, volume, path) {
                let node = {}
                if(raw.type == "folder") {
                    node.title = '<i class="ivu-icon ivu-icon-folder" style="margin-right: 5px;"></i>' + raw.name;
                    node.volume = volume;
                    if(raw.name == '/') {
                        node.path = '/';
                    } else {
                        node.path = path + raw.name + '/';
                    }
                    node.expand = true;     // Open by default.
                    node.children = [];
                    for(let c of raw.children) {
                        node.children.push(this.buildTree(c, volume, node.path));
                    }
                } else {
                    node.title = '<i class="ivu-icon ivu-icon-document" style="margin-right: 5px;"></i>' + raw.name;
                    node.volume = volume;
                    node.path = path + raw.name;
                }
                return node;
            },
            selectTreeNode(nodes) {
                let n = nodes[0];
                if(!n) {
                    this.selectedNode = null;
                    return;
                }
                if(n.children) {
                    // With folder
                    this.selectedNode = n;
                } else {
                    // With file
                    this.$http.get('users/' + this.$route.params.username + '/volumes/' + n.volume + '/files' + n.path)
                        .then(response => {
                            n.content = response.data;
                            this.selectedNode = n;
                        }, response => {
                            this.$Message.error('Load file content failed!');
                        });
                }
            },
            loadVolumes() {
                this.volumes = null;
                this.$http.get('users/' + this.$route.params.username + '/volumes').then(response => {
                    let vs = response.data;
                    for(let v of vs) {
                        v.root = [];
                    }
                    this.volumes = vs;
                    for(let v of this.volumes) {
                        this.$http.get('users/' + this.$route.params.username + '/volumes/' + v.name).then(response => {
                            v.root.push(this.buildTree(response.data, v.name , ""));
                        }, response => {
                            this.$Message.error('Load files for ' + v.name + ' failed!');
                        });
                    }
                }, response => {
                    this.$Message.error('Load volumes failed!');
                });
            },
            createVolume() {
                this.$router.push({ name: "new-volume" });
            },
            deleteVolume(v) {
                this.$router.push({ name: "del-volume", params: { vname: v.name }});
            }
        }
    }
</script>
