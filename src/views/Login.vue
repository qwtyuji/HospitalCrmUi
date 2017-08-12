<template>
    <el-form :model="Login" :rules="rules2" ref="Login" label-position="left" label-width="0px" class="demo-ruleForm login-container">
        <h3 class="title">系统登录</h3>
        <el-form-item prop="email">
            <el-input type="text" v-model="Login.email" auto-complete="off" placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item prop="password">
            <el-input type="password" v-model="Login.password" auto-complete="off" placeholder="密码"></el-input>
        </el-form-item>
        <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
        <el-form-item style="width:100%;">
            <el-button type="primary" style="width:70%;" @click.native.prevent="handleSubmit" :loading="logining">登录</el-button>
            <el-button type="primary"  @click.native.prevent="handleReset">重置</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    import {requestLogin} from '../api/api';
    export default {
        data() {
            return {
                logining: false,
                Login: {
                    grant_type:'password',
                    client_id:'2',
                    client_secret:'hmiYMs6XXF4ihZ92ltstnqMtI7K0bXLEW5HBV2Je',
                    scope:'',
                    email: '317559272@qq.com',
                    password: '4988yuji'
                },
                rules2: {
                    email: [
                        {required: true, message: '请输入邮箱', trigger: 'blur'},
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                    ]
                },
                checked: true
            };
        },
        methods: {
            handleReset() {
                this.$refs.Login.resetFields();
            },
            handleSubmit(ev) {
                var _this = this;
                this.$refs.Login.validate((valid) => {
                    if (valid) {
                        this.logining = true;
                        var loginParams = {
                            grant_type: this.Login.grant_type,
                            client_id: this.Login.client_id,
                            client_secret: this.Login.client_secret,
                            scope: this.Login.scope,
                            email: this.Login.email,
                            password: this.Login.password
                        };
                        requestLogin(loginParams).then(data => {
                            this.logining = false;
                            let {msg, code, access_token,refresh_token} = data;
                            if (code == 401) {
                                this.$message({
                                    message: msg,
                                    type: 'error'
                                });
                            } else {
                                sessionStorage.setItem('access_token', access_token);
                                this.$router.push({path: '/home'});
                            }
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            }
        }
    }

</script>

<style lang="scss" scoped>
    .login-container {
        /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
        -webkit-border-radius: 5px;
        border-radius: 5px;
        -moz-border-radius: 5px;
        background-clip: padding-box;
        margin: 180px auto;
        width: 350px;
        padding: 35px 35px 15px 35px;
        background: #fff;
        border: 1px solid #eaeaea;
        box-shadow: 0 0 25px #cac6c6;
        .title {
            margin: 0px auto 40px auto;
            text-align: center;
            color: #505458;
        }
        .remember {
            margin: 0px 0px 35px 0px;
        }
    }
</style>