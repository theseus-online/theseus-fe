<template>
    <Row>
        <Col span="16" offset="4">
            <Alert type="warning">
                <p>This action will delete service '{{$route.params.svcname}}' and make it <strong>UNAVAILABLE</strong>.
                Input the service's name(aka '{{$route.params.svcname}}') to confirm this.</p>
            </Alert>
            <Form :label-width="0">
                <Form-item>
                    <Input v-model="svcname" placeholder="Input the service's name"></Input>
                </Form-item>
                <Form-item>
                    <Button @click="confirm" type="ghost" :disabled="!confirmed">Do It!</Button>
                    <Button @click="cancel" type="ghost" style="color: #00cc66;">Let me think again</Button>
                </Form-item>
            </Form>
        </Col>
    </Row>
</template>

<script>
    export default {
        data: function() {
            return {
                svcname: null
            }
        },
        computed: {
            confirmed() {
                return this.svcname == this.$route.params.svcname;
            }
        },
        methods: {
            confirm() {
                this.$http.delete('users/' + this.$route.params.username + '/services/' + this.svcname).then(response => {
                    this.$Message.success('Delete success!');
                    this.$router.push({ name: "service" });
                }, response => {
                    this.$Message.error('Delete failed!');
                });
            },
            cancel() {
                this.$router.push({ name: "service" });
            }
        }
    }
</script>
