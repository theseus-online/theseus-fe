<template>
    <Row>
        <Col span="16" offset="4">
            <Form :model="newbee" :label-width="80">
                <Form-item label="Name">
                    <Input v-model="newbee.name" placeholder="Volume Name"
                        @on-focus="newbee.name=''" @on-blur="validateVolumeName(newbee)">
                    </Input>
                </Form-item>
                <Form-item>
                    <Tooltip content="Commit this volume" placement="bottom">
                        <Button type="ghost" @click="commit" :disabled="!commitable">Commit</Button>
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
                    name: "volume-" + uuid(),
                    owner: this.$route.params.username,
                },
                volumes: []
            }
        },
        methods: {
            validateVolumeName(volume) {
                let name = 'volume-' + uuid();
                if(!volume.name) {
                    volume.name = name;
                }
                for(let v of this.volumes) {
                    if(v.name == volume.name) {
                        this.$Notice.warning({
                            title: 'Conflict Volume Name',
                            desc: 'volume name ' + volume.name + ' conflict with existed volume, it was reset to ' + name,
                            duration: 0
                        });
                        volume.name = name;
                    }
                }
            },
            commit() {
                let name_regex = /^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/;
                if(!name_regex.test(this.newbee.name)) {
                    this.$Notice.error({
                        title: 'Error Volume Name',
                        desc: 'volume name ' + this.newbee.name + ' is invalid, valid example: my-volume, 123-volume',
                        duration: 0
                    });
                    return;
                }

                this.$http.post('users/' + this.$route.params.username + '/volumes', this.newbee).then(response => {
                    this.$Message.success('Add success!');
                    this.$router.push({ name: "volume" });
                }, response => {
                    this.$Message.error('Add failed!');
                });
            },
            cancel() {
                this.$router.push({ name: "volume" });
            }
        },
        computed: {
            commitable() {
                return !this.newbee.name.startsWith("empty-dir");
            }
        },
        mounted: function() {
            this.$http.get('users/' + this.$route.params.username + '/volumes').then(response => {
                this.volumes = response.data;
            });
        }
    }
</script>
