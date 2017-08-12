import Vue from "vue";
import App from "./App";
import ElementUI from "element-ui";
// import "element-ui/lib/theme-default/index.css";
import './assets/theme/hupo/index.css'
import VueRouter from "vue-router";
import store from "./vuex/store";
import Vuex from "vuex";
import routes from "./routes";
import mavonEditor from 'mavon-editor';
// import 'mavon-editor/dist/css/index.css';
import "font-awesome/css/font-awesome.min.css";
import axios from "axios";
Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(mavonEditor)
const router = new VueRouter({
    mode: 'history',
    routes
})

//检测登录
router.beforeEach((to, from, next) => {
    if (to.path == '/login') {
        sessionStorage.removeItem('access_token');
    }
    let access_token =sessionStorage.getItem('access_token');
    if (!access_token && to.path != '/login') {
        next({path: '/login'})
    } else {
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + sessionStorage.getItem('access_token');
        next()
    }
})

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
