<template>
    <div>
        <Upload action="/proxy/users/theseus-online/volumes/test/files/test.jpg" :before-upload="bu">
            <Button type="ghost" icon="ios-cloud-upload-outline">上传文件</Button>
        </Upload>
        <Upload action="//jsonplaceholder.typicode.com/posts/">
                <Button type="ghost" icon="ios-cloud-upload-outline">上传文件</Button>
        </Upload>
    </div>
</template>

<script>
    export default {
        methods: {
            bu: function(x, y, z) {
                console.log(x);
                console.log(y);
                console.log(z);
                return true;
            }
        }
    }
</script>
