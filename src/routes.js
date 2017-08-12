import Login from "./views/Login.vue";
import NotFound from "./views/404.vue";
import Home from "./views/Home.vue";
import Main from "./views/Main.vue";
import Report from "./views/Report.vue";
import User from "./views/User.vue";
import Role from "./views/Role.vue";
import Permission from "./views/Permission.vue";
import Log from "./views/Log.vue";
import Hospital from "./views/Hospital.vue";
import Department from "./views/Department.vue";
import Disease from "./views/Disease.vue";
import Doctor from "./views/Doctor.vue";
import Media from "./views/Media.vue";
import Depart from "./views/Depart.vue";
import Patient from "./views/Patient.vue";

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    {
        path: '/',
        component: Home,
        name: '主页',
        leaf: true,//只有一个节点
        iconCls: 'el-icon-menu',//图标样式class
        children: [
            {path: '/home', component: Main, name: '主页', hidden: false},
        ]
    },
    {
        path: '/',
        component: Home,
        name: '预约管理',
        leaf: true,//只有一个节点
        iconCls: 'fa fa-indent',
        children: [
            {path: '/patient', component: Patient, name: '预约列表',auth:'view_patient'},

        ]
    },
    {
        path: '/',
        component: Home,
        name: '系统配置',
        iconCls: 'fa fa-indent',
        children: [
            {path: '/hospital', component: Hospital, name: '医院管理',auth:'view_hospital'},
            {path: '/department', component: Department, name: '科室管理',auth:'view_department'},
            {path: '/doctor', component: Doctor, name: '医生管理',auth:'view_doctor'},
            {path: '/disease', component: Disease, name: '疾病管理',auth:'view_disease'},
            {path: '/media', component: Media, name: '媒体管理',auth:'view_media'},
        ]
    },
    {
        path: '/',
        component: Home,
        name: '系统管理',
        iconCls: 'fa el-icon-setting',
        children: [
            {path: '/depart', component: Depart, name: '部门管理',auth:'view_depart'},
            {path: '/user', component: User, name: '用户管理',auth:'view_user'},
            {path: '/role', component: Role, name: '角色管理',auth:'view_role'},
            {path: '/permission', component: Permission, name: '权限管理',auth:'view_permission'},
            {path: '/log', component: Log, name: '日志管理',auth:'view_log'},
        ]
    },
    {
        path: '/',
        component: Home,
        name: '报表',
        iconCls: 'fa fa-bar-chart',
        children: [
            {path: '/report', component: Report, name: '数据报表',auth:'view_report'},

        ]
    },

    {
        path: '*',
        hidden: true,
        redirect: {path: '/404'}
    }
];

export default routes;