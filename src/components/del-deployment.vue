<template>
    <Row>
        <Col span="16" offset="4">
            <Alert type="warning">
                <p>This action will undeploy app '{{$route.params.depname}}' and remove it's data <strong>FOREVER</strong>.
                Input the app's name(aka '{{$route.params.depname}}') to confirm this.</p>
            </Alert>
            <Form :label-width="0">
                <Form-item>
                    <Input v-model="depname" placeholder="Input the app's name"></Input>
                </Form-item>
                <Form-item>
                    <Button @click="confirm" type="ghost" :disabled="!confirmed">I Know What I'm Doing</Button>
                    <Button @click="cancel" type="ghost" style="color: #00cc66;">I Regret</Button>
                </Form-item>
            </Form>
        </Col>
    </Row>
</template>

<script>
    export default {
        data: function() {
            return {
                depname: null
            }
        },
        computed: {
            confirmed() {
                return this.depname == this.$route.params.depname;
            }
        },
        methods: {
            confirm() {
                this.$http.delete('users/' + this.$route.params.username + '/deployments/' + this.depname).then(response => {
                    this.$Message.success('Delete success!');
                    this.$router.push({ name: "deployment" });
                }, response => {
                    this.$Message.error('Delete failed!');
                });
            },
            cancel() {
                this.$router.push({ name: "deployment" });
            }
        }
    }
</script>
