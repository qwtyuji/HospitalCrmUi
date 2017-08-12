<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.keyword" @keyup.enter.native="getUsers" v-on:blur="getUsers" placeholder="查询"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getUsers">查询</el-button>
                </el-form-item>
                <el-form-item>

                    <el-button type="primary" @click="handleAdd" v-show="auth.add_user">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <!--列表-->
        <el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column prop="name" label="用户名" sortable>
            </el-table-column>
            <el-table-column prop="email" label="Email" sortable>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="120" :formatter="formatStatus" sortable>
            </el-table-column>
            <el-table-column prop="updated_at" label="修改时间" sortable>
            </el-table-column>
            <el-table-column prop="created_at" label="创建时间" sortable>
            </el-table-column>
            <el-table-column label="操作" width="200">
                <template scope="scope">
                    <el-button type="success" size="small" @click="handleShow(scope.$index, scope.row)" v-show="auth.add_user">查看</el-button>
                    <el-button type="warning" size="small" @click="handleEdit(scope.$index, scope.row)" v-show="auth.edit_user">编辑</el-button>
                    <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)" v-show="auth.delete_user">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0" v-show="auth.delete_user">批量删除</el-button>
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="15" :total="total" style="float:right;">
            </el-pagination>
        </el-col>

        <!--新增页面-->
        <el-dialog title="新增用户" v-model="addUserVisible" :close-on-click-modal="false">
            <el-form :model="addUser" label-width="80px" :rules="addUserRules" ref="addUser">
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="addUser.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="Email" prop="email">
                    <el-input v-model="addUser.email" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="addUser.password" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="checkPass">
                    <el-input type="password" v-model="addUser.checkPass" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addUserVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
        <!--编辑界面-->
        <el-dialog title="编辑" v-model="editUserVisible" :close-on-click-modal="false">
            <el-form :model="editUser" label-width="80px" :rules="editUserRules" ref="editUser">
                <el-form-item label="id" prop="id" hidden>
                    <el-input v-model="editUser.id" auto-complete="off" hidden></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="editUser.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editUser.email" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-radio-group v-model="editUser.status">
                        <el-radio class="radio" :label="1">启用</el-radio>
                        <el-radio class="radio" :label="0">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="editUser.password" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="checkPass">
                    <el-input type="password" v-model="editUser.checkPass" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editUserVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>

    </section>
</template>

<script>
    import {getUserListPage, addUser, editUser, removeUser, batchRemoveUser, checkNameApi, checkEmailApi, errors} from '../api/api';
    export default {
        data() {
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    if (this.addUser.checkPass !== '') {
                        this.$refs.addUser.validateField('checkPass');
                    }
                    callback();
                }
            };
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.addUser.password) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            var validatePass3 = (rule, value, callback) => {
                if (this.editUser.password !== '' & value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.editUser.password) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            var checkAddName = (rule, value, callback) => {
                let para = {name: this.addUser.name}
                checkNameApi(para).then((res) => {
                    console.log(res.data.status)
                    if (!res.data.status) {
                        callback(new Error('用户名已被占用!'));
                    } else {
                        callback();
                    }
                })
            };
            var checkEditName = (rule, value, callback) => {
                let para = {
                    id: this.editUser.id,
                    name: this.editUser.name
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
            var checkAddEmail = (rule, value, callback) => {
                let para = {email: this.addUser.email}
                checkEmailApi(para).then((res) => {
                    if (!res.data.status) {
                        callback(new Error('邮箱已被占用!'));
                    } else {
                        callback();
                    }
                })
            };
            var checkEditEmail = (rule, value, callback) => {
                let para = {
                    id: this.editUser.id,
                    email: this.editUser.email
                }
                checkEmailApi(para).then((res) => {
                    if (!res.data.status) {
                        callback(new Error('邮箱已被占用!'));
                    } else {
                        callback();
                    }
                })
            };
            return {
                auth: {
                    view_user: false,
                    add_user: false,
                    edit_user: false,
                    delete_user: false
                },
                filters: {keyword: ''},
                users: [],
                total: 0,
                page: 1,
                listLoading: false,
                sels: [],//列表选中列
                editUserVisible: false, //编辑界面是否显示
                editLoading: false,
                //编辑界面数据
                editUser: {
                    id: '',
                    name: '',
                    email: '',
                    status: -1,
                    password: '',
                    checkPass: '',
                },
                editUserRules: {
                    name: [
                        {required: true, message: '请输入名称', trigger: 'blur'},
                        {validator: checkEditName, trigger: 'blur'}

                    ],
                    email: [
                        {required: true, message: '请输入邮箱', trigger: 'blur'},
                        {validator: checkEditEmail, trigger: 'blur'}
                    ],
                    password: [],
                    checkPass: [
                        {validator: validatePass3, trigger: 'blur'}
                    ],
                },
                addUserVisible: false,//新增界面是否显示
                addLoading: false,
                addUserRules: {
                    name: [
                        {required: true, message: '请输入姓名', trigger: 'blur'},
                        {validator: checkAddName, trigger: 'blur'},
                    ],
                    email: [
                        {required: true, message: '请输入邮箱', trigger: 'blur'},
                        {type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur'},
                        {validator: checkAddEmail, trigger: 'blur'},
                    ],
                    password: [
                        {validator: validatePass, trigger: 'blur'}
                    ],
                    checkPass: [
                        {validator: validatePass2, trigger: 'blur'}
                    ],
                },
                //新增界面数据
                addUser: {
                    name: '',
                    email: '',
                    password: '',
                    checkPass: '',
                }
            }

        },
        methods: {
            //显示转换
            formatStatus: function (row, column) {
                return row.status == 1 ? '启用' : row.status == 0 ? '禁用' : '未知';
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getUsers();
            },
            //获取用户列表
            getUsers() {
                let para = {
                    page: this.page,
                    keyword: this.filters.keyword
                };
                let _this = this;
                this.listLoading = true;
                getUserListPage(para).then((res) => {
                    this.total = res.data.total;
                    this.users = res.data.data;
                    this.listLoading = false;
                }).catch((rs) => {
                    _this.listLoading = false;
                    _this.$message({
                        message: errors(rs).message,
                        type: errors(rs).type,
                        duration: errors(rs).duration
                    });
                });
            },
            //显示
            handleShow: function (index, row) {
                this.$message({
                    message: `第${index}条:名称:${row.name}`,
                    type: 'success'
                })
            },
            //删除
            handleDel: function (index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    let para = {id: row.id};
                    removeUser(para).then((res) => {
                        this.listLoading = false;
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getUsers();
                    });
                }).catch((rs) => {
                    _this.listLoading = false;
                    _this.$message({
                        message: errors(rs).message,
                        type: errors(rs).type,
                        duration: errors(rs).duration
                    });
                });
            },
            //显示编辑界面
            handleEdit: function (index, row) {
                this.editUserVisible = true;
                this.editUser = Object.assign({}, row);
            },
            //显示新增界面
            handleAdd: function () {
                this.addUserVisible = true;
                this.addUser = {
                    name: '',
                    email: '',
                    password: '',
                    checkPass: '',
                };
            },
            //编辑
            editSubmit: function () {
                this.$refs.editUser.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            let _this = this;
                            this.editLoading = true;
                            let para = Object.assign({}, this.editUser);
                            editUser(para).then((res) => {
                                console.log(res)
                                this.editLoading = false;
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['editUser'].resetFields();
                                this.editUserVisible = false;
                                this.getUsers();
                            }).catch((rs) => {
                                _this.editLoading = false;
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
            //新增
            addSubmit: function () {
                this.$refs.addUser.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            let _this = this;
                            this.addLoading = true;
                            let para = Object.assign({}, this.addUser);
                            addUser(para).then((res) => {
                                this.addLoading = false;
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['addUser'].resetFields();
                                this.addUserVisible = false;
                                this.getUsers();
                            }).catch((rs) => {
                                _this.addLoading = false;
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
            selsChange: function (sels) {
                this.sels = sels;
            },
            //批量删除
            batchRemove: function () {
                var ids = this.sels.map(item => item.id).toString();
                this.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    let para = {ids: ids};
                    batchRemoveUser(para).then((res) => {
                        this.listLoading = false;
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getUsers();
                    });
                }).catch(() => {

                });
            },
            //检测权限显示按钮
            checkAuth(){
                let auth = JSON.parse(sessionStorage.getItem('auth'));
                auth.map((rs) => {
                    this.auth.hasOwnProperty(rs.name) ? this.auth[rs.name] = true : '';
                })
            }
        },
        mounted() {
            this.checkAuth();
            this.getUsers();
        }
    }

</script>

<style scoped>

</style>