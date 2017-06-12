import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import App from './App.vue';
import router from './router';
import iView from 'iview';
import 'iview/dist/styles/iview.css'
import locale from 'iview/src/locale/lang/en-US';

Vue.use(iView, { locale });
Vue.use(VueRouter);
Vue.use(VueResource);

Vue.http.options.root = '/proxy';

new Vue({
    el: '#app',
    router: router,
    render: h => h(App)
})
