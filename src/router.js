import VueRouter from 'vue-router';
import Wip from './components/wip.vue';
import Test from './components/test.vue';
import Home from './components/home.vue';
import User from './components/user.vue';
import Deployment from './components/deployment.vue';
import NewDeployment from './components/new-deployment.vue';
import DelDeployment from './components/del-deployment.vue';
import Service from './components/service.vue';
import NewService from './components/new-service.vue';
import DelService from './components/del-service.vue';
import Ingress from './components/ingress.vue';
import NewIngress from './components/new-ingress.vue';
import DelIngress from './components/del-ingress.vue';
import Volume from './components/volume.vue';
import NewVolume from './components/new-volume.vue';
import DelVolume from './components/del-volume.vue';
import Log from './components/log.vue'

export default new VueRouter({
    routes: [
        {
            name: 'home',
            path: '/',
            component: Home,
        },
        {
            name: 'tutorial',
            path: '/tutorial',
            component: Wip,
        },
        {
            name: 'about',
            path: '/about',
            component: Wip,
        },
        {
             name: 'user',
             path: '/users/:username',
             component: User,
             children: [
                 {
                     name: "deployment",
                     path: "deployments",
                     component: Deployment,
                 },
                 {
                     name: "service",
                     path: "services",
                     component: Service,
                 },
                 {
                     name: "ingress",
                     path: "ingresses",
                     component: Ingress,
                 },
                 {
                     name: "volume",
                     path: "volumes",
                     component: Volume,
                 },
                 {
                     name: "new-deployment",
                     path: "new-deployment",
                     component: NewDeployment,
                 },
                 {
                     name: "new-service",
                     path: "new-service",
                     component: NewService,
                 },
                 {
                     name: "new-ingress",
                     path: "new-ingress",
                     component: NewIngress,
                 },
                 {
                     name: "new-volume",
                     path: "new-volume",
                     component: NewVolume,
                 },
                 {
                     name: "del-deployment",
                     path: "deployments/:depname/delete",
                     component: DelDeployment,
                 },
                 {
                     name: "del-service",
                     path: "services/:svcname/delete",
                     component: DelService,
                 },
                 {
                     name: "del-ingress",
                     path: "ingresses/:ingname/delete",
                     component: DelIngress,
                 },
                 {
                     name: "del-volume",
                     path: "volumes/:vname/delete",
                     component: DelVolume,
                 },
                 {
                     name: "log",
                     path: "pods/:pod/containers/:container/logs",
                     component: Log
                 }
             ]
         }
    ]
})
