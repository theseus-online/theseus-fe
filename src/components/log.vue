<template>
    <Row>
        <Col span="22" offset="1">
            <Button type="ghost" shape="circle" @click="back" style="margin: 20px">
                Back
            </Button>
            <Card :bordered="false">
                <Spin size="large" fix v-if="logs == null"></Spin>
                <Input v-else v-model="logs" class="log-box" type="textarea" :autosize="{minRows: 20}" disabled></Input>
            </Card>
        </Col>
    </Row>
</template>

<script>
    export default {
        data: function() {
            return {
                logs: null,
            }
        },
        mounted: function() {
            let log_url = "users/" + this.$route.params.username
                        + "/pods/" + this.$route.params.pod
                        + "/containers/" + this.$route.params.container
                        + "/logs"
            this.$http.get(log_url).then(response => {
                this.logs = response.data;
            }, response => {
                this.$Message.error('Load logs failed!');
            });
        },
        methods: {
            back() {
                this.$router.push({ name: "deployment" });
            }
        }
    }
</script>

<style>
.log-box .ivu-input-disabled {
    color: black;
}
</style>
