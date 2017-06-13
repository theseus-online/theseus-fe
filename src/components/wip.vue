<template>
    <div class="wip">
        <!--<img src="../assets/images/wip.png"></img>-->
        <div class="title">Member List</div>
        <div class="member" v-for="user in userList" :key="user">
            <div class="avatar"><img :src="user.avatar_url" /></div>
            <div class="member-info">
                <div class="member-name">{{ user.name }}</div>
                <div class="member-id"><a target="_blank" :href="user.html_url">@{{ user.login }}</a></div>
            </div>
            
        </div>
    </div>
</template>
<script>
export default {
    mounted () {
        const memberListReq = new Request('https://api.github.com/orgs/theseus-online/members')
        fetch(memberListReq).then(res => {
            return res.json()
        }).then(res => {
            for (let i of res) {
                const userReq = new Request(i.url)
                fetch(userReq).then(res => {
                    return res.json()
                }).then(res => {
                    i.name = res.name
                    i.html_url = res.html_url
                    this.userList.push(i)
                })

            }
        })
    },
    data () {
        return {
            userList: []
        }
    }
}
</script>
<style scoped>
    .wip {
        /*display: flex;
        align-items: center;
        justify-content: center;*/
        margin-top: 10px;
    }
    .title {
        width: 420px;
        padding-left: 10px;
        margin: 0 auto;
        border-bottom: 2px solid #2d8cf0;
        font-size: 18px;
    }
    .member {
        width: 300px;
        margin: 10px auto;
    }
    .member .avatar {
        display: inline-block;
        width: 60px;
        height: 60px;
        border-radius: 30px;
        overflow: hidden;
        vertical-align: top;
        border: 1px solid #aaa;
    }
    .member .avatar img {
        width: 60px;
        height: 60px;
    }
    .member .member-info {
        display: inline-block;
        width: 200px;
        height: 60px;
        margin-left: 10px;
        text-align: center;
    }
    .member-info div {
        height: 30px;
        line-height: 30px;
    }
    .member-info .member-name {
        /*font-weight: bold;*/
        font-size: 16px;
    }
</style>
