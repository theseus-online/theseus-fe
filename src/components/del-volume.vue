<template>
    <Row>
        <Col span="16" offset="4">
            <Alert type="warning">
                <p><strong>ATTENTION PLEASE!</strong>This action is realy realy <strong>dangerous</strong>.
                If you don't known why you get here, please just click "Go Back". If you confirm this action,
                <strong>All</strong> data in volume "{{$route.params.vname}}" will be
                <strong style="color: red;">DELETED FOREVER</strong>.</p>
            </Alert>
            <Form :label-width="0">
                <Form-item>
                    <Input v-model="vname" placeholder="Input the volume's name"></Input>
                </Form-item>
                <Form-item>
                    <Button @click="confirm" type="ghost" :disabled="!confirmed">I Know What Will Happen</Button>
                    <Button @click="cancel" type="ghost" style="color: #00cc66;">Go Back</Button>
                </Form-item>
            </Form>
        </Col>
    </Row>
</template>

<script>
    export default {
        data: function() {
            return {
                vname: null
            }
        },
        computed: {
            confirmed() {
                return this.vname == this.$route.params.vname;
            }
        },
        methods: {
            confirm() {
                this.$http.delete('users/' + this.$route.params.username + '/volumes/' + this.vname).then(response => {
                    this.$Message.success('Delete success!');
                    this.$router.push({ name: "volume" });
                }, response => {
                    this.$Message.error('Delete failed!');
                });
            },
            cancel() {
                this.$router.push({ name: "volume" });
            }
        }
    }
</script>
