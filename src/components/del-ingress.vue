<template>
    <Row>
        <Col span="16" offset="4">
            <Alert type="warning">
                <p>This action will delete ingress '{{$route.params.ingname}}'.
                <strong>All</strong> access to this ingress from internet will be <strong>DISCARDED</strong>.
                Input the ingress's name(aka '{{$route.params.ingname}}') to confirm this.</p>
            </Alert>
            <Form :label-width="0">
                <Form-item>
                    <Input v-model="ingname" placeholder="Input the ingress's name"></Input>
                </Form-item>
                <Form-item>
                    <Button @click="confirm" type="ghost" :disabled="!confirmed">Let it go!</Button>
                    <Button @click="cancel" type="ghost" style="color: #00cc66;">Back</Button>
                </Form-item>
            </Form>
        </Col>
    </Row>
</template>

<script>
    export default {
        data: function() {
            return {
                ingname: null
            }
        },
        computed: {
            confirmed() {
                return this.ingname == this.$route.params.ingname;
            }
        },
        methods: {
            confirm() {
                this.$http.delete('users/' + this.$route.params.username + '/ingresses/' + this.ingname).then(response => {
                    this.$Message.success('Delete success!');
                    this.$router.push({ name: "ingress" });
                }, response => {
                    this.$Message.error('Delete failed!');
                });
            },
            cancel() {
                this.$router.push({ name: "ingress" });
            }
        }
    }
</script>
