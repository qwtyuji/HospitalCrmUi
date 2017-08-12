<template>
    <el-row class="container">
        <el-col :span="24" class="header">
            <el-col :span="10" class="logo" :class="collapsed?'logo-collapse-width':'logo-width'">
                <div v-if="collapsed">
                    <img src="../assets/logo.png" />
                </div>
                <div v-else>
                    {{sysName}}
                </div>
            </el-col>
            <el-col :span="2">
                <div class="tools" @click.prevent="collapse">
                    <i class="fa fa-align-justify"></i>
                </div>
            </el-col>
            <el-col :span="8">
                <b>当前医院:</b>
                <el-select v-model="hospital" value-key="value" @change="hospitalChange" placeholder="请选择默认医院">
                    <el-option
                            v-for="hospital in hospitals"
                            :key="hospital.id"
                            :label="hospital.name"
                            :value="hospital.id">
                    </el-option>
                </el-select>
            </el-col>

            <el-col :span="4" class="userinfo">
                <el-dropdown trigger="hover">
                    <span class="el-dropdown-link userinfo-inner"><img :src="this.sysUserAvatar" /> {{sysUserName}}</span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="handleMessage">我的消息</el-dropdown-item>
                        <el-dropdown-item @click.native="handleSet">设置</el-dropdown-item>
                        <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-col>
        </el-col>
        <el-col :span="24" class="main">
            <aside :class="collapsed?'menu-collapsed':'menu-expanded'">
                <!--导航菜单-->
                <el-menu :default-active="$route.path" :class="collapsed?'':'menu-expanded'"
                         @open="handleopen"
                         @close="handleclose"
                         @select="handleselect"
                         unique-opened router v-show="!collapsed">
                    <template v-for="(item,index) in $router.options.routes" v-if="!item.hidden">
                        <el-submenu :index="index+''" v-if="!item.leaf">
                            <template slot="title"><i :class="item.iconCls"></i>{{item.name}}</template>
                            <el-menu-item v-for="child in item.children"
                                          :index="child.path"
                                          :key="child.path"
                                          v-if="!child.hidden">
                                {{child.name}}
                            </el-menu-item>
                        </el-submenu>
                        <el-menu-item v-if="item.leaf&&item.children.length>0" :index="item.children[0].path">
                            <i :class="item.iconCls"></i>
                            {{item.children[0].name}}
                        </el-menu-item>
                    </template>
                </el-menu>
                <!--导航菜单-折叠后-->
                <ul class="el-menu el-menu-vertical-demo collapsed" v-show="collapsed" ref="menuCollapsed">
                    <li v-for="(item,index) in $router.options.routes" v-if="!item.hidden" class="el-submenu item">
                        <template v-if="!item.leaf">
                            <div class="el-submenu__title" style="padding-left: 20px;"
                                 @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)">
                                <i :class="item.iconCls"></i>
                            </div>
                            <ul class="el-menu submenu" :class="'submenu-hook-'+index"
                                @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)">
                                <li v-for="child in item.children" v-if="!child.hidden"
                                    :key="child.path" class="el-menu-item" style="padding-left: 40px;"
                                    :class="$route.path==child.path?'is-active':''" @click="$router.push(child.path)">
                                    {{child.name}}
                                </li>
                            </ul>
                        </template>
                        <template v-else>
                    <li class="el-submenu">
                        <div class="el-submenu__title el-menu-item"
                             style="padding-left: 20px;height: 56px;line-height: 56px;padding: 0 20px;"
                             :class="$route.path==item.children[0].path?'is-active':''"
                             @click="$router.push(item.children[0].path)">
                            <i :class="item.iconCls"></i>
                        </div>
                    </li>
</template>
</li>
</ul>
</aside>
<section class="content-container">
    <div class="grid-content bg-purple-light">
        <el-col :span="24" class="breadcrumb-container">
            <!--<strong class="title">{{$route.name}}</strong>-->
            <el-breadcrumb separator="/" class="breadcrumb-inner">
                <el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
                    {{ item.name }}
                </el-breadcrumb-item>
            </el-breadcrumb>
        </el-col>
        <el-col :span="24" class="content-wrapper">
            <el-dialog title="我的资料" v-model="userVisible" :close-on-click-modal="false">
                <el-form :model="user" label-width="80px" :rules="userRules" ref="user">
                    <el-form-item label="姓名" prop="name">
                        <el-input v-model="user.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="Email" prop="email">
                        <el-input v-model="user.email" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="图像" prop="avatar">
                        <el-upload
                                class="avatar-uploader"
                                action="http://api.mycentos.com/api/user/upavatar"
                                :headers="headers"
                                :show-file-list="false"
                                :on-success="handleAvatarSuccess"
                                :before-upload="beforeAvatarUpload">
                            <img v-if="imageUrl" :src="imageUrl" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>

                    <el-form-item label="密码" prop="password">
                        <el-input type="password" v-model="user.password" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="password_confirmation">
                        <el-input type="password" v-model="user.password_confirmation" auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="userVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="userSubmit" :loading="userLoading">提交</el-button>
                </div>
            </el-dialog>
            <transition name="fade" mode="out-in">
                <router-view></router-view>
            </transition>
        </el-col>
    </div>
</section>
</el-col>
</el-row>
</template>

<script>
    import {getUserInfo, errors, editUser, checkNameApi, checkEmailApi, getUserAuth, getHospitalList} from '../api/api';
    export default {
        data() {
            var checkEditEmail = (rule, value, callback) => {
                let para = {
                    id: this.user.id,
                    email: this.user.email
                }
                checkEmailApi(para).then((res) => {
                    if (!res.data.status) {
                        callback(new Error('邮箱已被占用!'));
                    } else {
                        callback();
                    }
                })
            };
            var validatePass3 = (rule, value, callback) => {
                if (this.user.password !== '' & value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.user.password) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            var checkEditName = (rule, value, callback) => {
                let para = {
                    id: this.user.id,
                    name: this.user.name
                }
                checkNameApi(para).then((res) => {
                    console.log(res.data.status)
                    if (!res.data.status) {
                        callback(new Error('用户名已被占用!'));
                    } else {
                        callback();
                    }
                })
            };
            return {
                imageUrl: '',
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('access_token')
                },
                userVisible: false,
                menu: {},
                sysName: 'MYCENTOSCRM',
                hospitals: [],
                collapsed: true,
                sysUserName: '',
                sysUserAvatar: '',
                userLoading: false,
                user: {
                    id: '',
                    name: '',
                    email: '',
                    avatar: '',
                    password: '',
                    password_confirmation: '',
                },
                userRules: {
                    name: [
                        {required: true, message: '请输入名称', trigger: 'blur'},
                        {validator: checkEditName, trigger: 'blur'}

                    ],
                    email: [
                        {required: true, message: '请输入邮箱', trigger: 'blur'},
                        {validator: checkEditEmail, trigger: 'blur'}
                    ],
                    password: [],
                    password_confirmation: [
                        {validator: validatePass3, trigger: 'blur'}
                    ],
                },
            }
        },
        computed:{
            hospital: {
                get () {
                    return this.$store.state.hospital
                },
                set (value) {
                    this.$store.commit('updateHospital', value)
                }
            }
        },
        methods: {
            handleAvatarSuccess(res, file) {
                console.log(typeof res.status);
                if (res.status) {
                    this.$message({
                        message: res.message,
                        type: 'success'
                    });
                    this.user.avatar = res.data;
                    this.imageUrl = URL.createObjectURL(file.raw);
                } else {
                    this.$message({
                        message: res.message,
                        type: 'error'
                    });
                }

            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;

//                if (!isJPG) {
//                    this.$message.error('上传头像图片只能是 JPG 格式!');
//                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            },
            //编辑
            userSubmit: function () {
                this.$refs.user.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            let _this = this;
                            this.userLoading = true;
                            let para = Object.assign({}, this.user);
                            editUser(para).then((res) => {
                                console.log(res)
                                this.userLoading = false;
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['user'].resetFields();
                                this.userVisible = false;
                                this.imageUrl = '';
                            }).catch((rs) => {
                                _this.userLoading = false;
                                _this.$message({
                                    message: errors(rs).message,
                                    type: errors(rs).type,
                                    duration: errors(rs).duration
                                });
                            });
                        });
                    }
                });
            },
            handleopen() {
//                console.log('handleopen');
            },
            handleMessage() {
                console.log('handleMessage');
            },
            handleSet() {
                this.userVisible = true;
                getUserInfo().then((res) => {
                    this.user = Object.assign({}, res.data);
                    this.imageUrl = res.data.avatar;
                });

            },
            handleclose() {
//                console.log('handleclose');
            },
            handleselect: function (a, b) {
            },
            //退出登录
            logout: function () {
                this.$confirm('确认退出吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    sessionStorage.removeItem('access_token');
                    sessionStorage.removeItem('auth');
                    this.$router.push('/login');
                });
            },
            //折叠导航栏
            collapse: function () {
                this.collapsed = !this.collapsed;
            },
            hospitalChange: function (value) {
                this.$store.state.hospital = value
            },
            showMenu(i, status) {
                this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-' + i)[0].style.display = status ? 'block' : 'none';
            },
            //菜单显示
            checkMenuAuth(){
                let authData = JSON.parse(sessionStorage.getItem('auth'));
                let auth = authData.map((rs) => {
                    return rs.name;
                });
                this.$router.options.routes.map((res) => {
                    if (res.children) {
                        res.children.map((rs) => {
                            if (rs.auth) {
                                if (auth.indexOf(rs.auth) < 0) {
                                    rs.hidden = true;
                                }
                            }
                        })
                    }
                });
            }
        },

        mounted() {
            getUserAuth().then((res) => {
                let data = JSON.stringify(res.data.data)
                sessionStorage.setItem('auth', data);
            }).then(() => {
                this.checkMenuAuth()
            });
            getUserInfo().then((res) => {
                console.log(res)
                this.sysUserName = res.data.name || '';
                this.sysUserAvatar = res.data.avatar || '';
                this.$store.state.hospital = res.data.user_set.default_hospital_id;
            });
            getHospitalList().then((res) => {
                this.hospitals = res.data;
            });
        }
    }
</script>

<style scoped lang="scss">
    @import '~scss_vars';

    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #20a0ff;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }

    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }

    .container {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100%;
        .header {
            height: 60px;
            line-height: 60px;
            background: $color-primary;
            color: #fff;
            .userinfo {
                text-align: right;
                padding-right: 35px;
                float: right;
                .userinfo-inner {
                    cursor: pointer;
                    color: #fff;
                    img {
                        width: 40px;
                        height: 40px;
                        border-radius: 20px;
                        margin: 10px 0 10px 10px;
                        float: right;
                    }
                }
            }
            .logo {
                //width:230px;
                height: 60px;
                font-size: 22px;
                padding-left: 20px;
                padding-right: 20px;
                border-color: rgba(238, 241, 146, 0.3);
                border-right-width: 1px;
                border-right-style: solid;
                img {
                    width: 40px;
                    float: left;
                    margin: 10px 10px 10px -10px;
                    border-radius: 40px;
                }
                .txt {
                    color: #fff;
                }
            }
            .logo-width {
                width: 230px;
            }
            .logo-collapse-width {
                width: 60px;
            }
            .tools {
                padding: 0 23px;
                width: 14px;
                height: 60px;
                line-height: 60px;
                cursor: pointer;
            }
        }
        .main {
            display: flex;
            position: absolute;
            top: 60px;
            bottom: 0;
            overflow: hidden;
            aside {
                flex: 0 0 230px;
                width: 230px;
                .el-menu {
                    height: 100%;
                }
                .collapsed {
                    width: 60px;
                    .item {
                        position: relative;
                    }
                    .submenu {
                        position: absolute;
                        top: 0;
                        left: 60px;
                        z-index: 99999;
                        height: auto;
                        display: none;
                    }

                }
            }
            .menu-collapsed {
                flex: 0 0 60px;
                width: 60px;
            }
            .menu-expanded {
                flex: 0 0 230px;
                width: 230px!important;
            }
            .content-container {
                // background: #f1f2f7;
                flex: 1;
                // position: absolute;
                // right: 0px;
                // top: 0px;
                // bottom: 0px;
                // left: 230px;
                overflow-y: scroll;
                padding: 20px;
                .breadcrumb-container {
                    font-size: 22px;
                    padding-bottom: 20px;
                    /*border-bottom: green 1px solid;*/
                    .breadcrumb-inner {
                        float: left;
                        font-size: 16px;
                    }
                }
                .content-wrapper {
                    background-color: #fff;
                    box-sizing: border-box;
                }
            }
        }
    }
</style>
