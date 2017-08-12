<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.keyword" @keyup.enter.native="getPermissions" v-on:blur="getPermissions" placeholder="查询"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getPermissions">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd" v-show="auth.add_permission">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <!--列表-->
        <el-table :data="permissions" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column prop="name" label="名称" sortable>
            </el-table-column>
            <el-table-column prop="cname" label="描述" sortable>
            </el-table-column>
            <el-table-column prop="group" label="分组" sortable>
            </el-table-column>
            <el-table-column prop="updated_at" label="时间" sortable>
            </el-table-column>
            <el-table-column label="操作" width="200">
                <template scope="scope">
                    <el-button type="success" size="small" @click="handleShow(scope.$index, scope.row)" v-show="auth.view_permission">查看</el-button>
                    <el-button type="warning" size="small" @click="handleEdit(scope.$index, scope.row)" v-show="auth.edit_permission">编辑</el-button>
                    <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)" v-show="auth.delete_permission">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="15" :total="total" style="float:right;">
            </el-pagination>
        </el-col>
        <!--新增页面-->
        <el-dialog title="新增权限" v-model="addPermissionVisible" :close-on-click-modal="false">
            <el-form :model="addPermission" label-width="80px" :rules="addPermissionRules" ref="addPermission">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="addPermission.name " auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="描述" prop="cname">
                    <el-input v-model="addPermission.cname " auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="分组" prop="group">
                    <el-input v-model="addPermission.group " auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addPermissionVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
        <!--编辑界面-->
        <el-dialog title="编辑权限" v-model="editPermissionVisible" :close-on-click-modal="false">
            <el-form :model="editPermission" label-width="80px" :rules="editPermissionRules" ref="editPermission">
                <el-form-item label="id" prop="id" hidden>
                    <el-input v-model="editPermission.id" auto-complete="off" hidden></el-input>
                </el-form-item>
                <el-form-item label="名称" prop="name">
                    <el-input v-model="editPermission.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="描述" prop="cname">
                    <el-input v-model="editPermission.cname" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="分组" prop="group">
                    <el-input v-model="editPermission.group" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editPermissionVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>
        <el-dialog title="显示详细" v-model="showPermissionVisible" :close-on-click-model="false">
            <div class="dialog-body">
                <table class="table">
                    <tr>
                        <td>名称:</td>
                        <td>{{ showPermission.name }}</td>
                    </tr>
                    <tr>
                        <td>描述:</td>
                        <td>{{ showPermission.cname }}</td>
                    </tr>
                    <tr>
                        <td>分组:</td>
                        <td>{{ showPermission.group }}</td>
                    </tr>
                    <tr>
                        <td>修改时间:</td>
                        <td>{{ showPermission.updated_at }}</td>
                    </tr>
                    <tr>
                        <td>添加时间:</td>
                        <td>{{ showPermission.created_at }}</td>
                    </tr>
                </table>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="showPermissionVisible = false">关闭</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import {
        getPermissionListPage,
        addPermission,
        editPermission,
        removePermission,
        batchRemovePermission,
        checkPermissionNameApi,
        errors
    } from '../api/api';
    export default {
        data() {
            var checkAddName = (rule, value, callback) => {
                let para = {name: this.addPermission.name}
                checkPermissionNameApi(para).then((res) => {
                    console.log(res.data.status)
                    if (!res.data.status) {
                        callback(new Error('名称已被占用!'));
                    } else {
                        callback();
                    }
                })
            };
            var checkEditName = (rule, value, callback) => {
                let para = {
                    id: this.editPermission.id,
                    name: this.editPermission.name
                }
                checkPermissionNameApi(para).then((res) => {
                    console.log(res.data.status)
                    if (!res.data.status) {
                        callback(new Error('名称已被占用!'));
                    } else {
                        callback();
                    }
                })
            };
            return {
                auth: {
                    view_permission: false,
                    add_permission: false,
                    edit_permission: false,
                    delete_permission: false
                },
                cates: [],
                filters: {
                    keyword: ''
                },
                permissions: [],
                total: 0,
                page: 1,
                listLoading: false,
                sels: [],//列表选中列
                showPermissionVisible: false,//列表选中列
                editPermissionVisible: false, //编辑界面是否显示
                editLoading: false,
                addPermissionVisible: false,//新增界面是否显示
                addLoading: false,
                //显示页面数据
                showPermission: {
                    id: '',
                    name: '',
                    cname: '',
                    group: '',
                    guard_name: '',
                    status: '',
                },
                //编辑界面数据
                editPermission: {
                    id: '',
                    name: '',
                    cname: '',
                    group: '',
                    guard_name: '',
                    status: '',
                },
                //新增界面数据
                addPermission: {
                    name: '',
                    cname: '',
                    group: '',
                    guard_name: '',
                    status: '',
                },
                addPermissionRules: {
                    name: [
                        {required: true, message: '请输入名车', trigger: 'blur'},
                        {validator: checkAddName, trigger: 'blur'},
                    ],
                },
                editPermissionRules: {
                    name: [
                        {required: true, message: '请输入名称', trigger: 'blur'},
                        {validator: checkEditName, trigger: 'blur'}
                    ],
                },
            }
        },
        methods: {
            //显示转换
            formatStatus: function (row, column) {
                return row.status == '1' ? '启用' : row.status = '0' ? '禁用' : '未知';
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getPermissions();
            },
            //获取列表
            getPermissions() {
                let para = {
                    page: this.page,
                    keyword: this.filters.keyword
                };
                let _this = this;
                this.listLoading = true;
                getPermissionListPage(para).then((res) => {
                    this.total = res.data.total;
                    this.permissions = res.data.data;
                    this.listLoading = false;
                }).catch((rs) => {
                    _this.listLoading = false;
                    _this.$message({
                        message: errors(rs).message,
                        type: errors(rs).type,
                        duration: errors(rs).duration
                    });
                });
                ;
            },
            //显示
            handleShow: function (index, row) {
                this.showPermissionVisible = true;
                this.showPermission = Object.assign({}, row);
                this.showPermission.status = this.formatStatus(row);
            },
            //删除
            handleDel: function (index, row) {
                let _this = this;
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    let para = {id: row.id};
                    removePermission(para).then((res) => {
                        this.listLoading = false;
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getPermissions();
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
                this.editPermissionVisible = true;
                this.editPermission = Object.assign({}, row);
            },
            //显示新增界面
            handleAdd: function () {
                this.addPermissionVisible = true;
                this.addPermission = {
                    name: '',
                    description: '',
                    status: 1,
                };
            },
            //编辑
            editSubmit: function () {
                this.$refs.editPermission.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            let _this = this;
                            this.editLoading = true;
                            let para = Object.assign({}, this.editPermission);
                            editPermission(para).then((res) => {
                                console.log(res)
                                this.editLoading = false;
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['editPermission'].resetFields();
                                this.editPermissionVisible = false;
                                this.getPermissions();
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
                this.$refs.addPermission.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            let _this = this;
                            this.addLoading = true;
                            let para = Object.assign({}, this.addPermission);
                            addPermission(para).then((res) => {
                                this.addLoading = false;
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['addPermission'].resetFields();
                                this.addPermissionVisible = false;
                                this.getPermissions();
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
                let _this = this;
                var ids = this.sels.map(item => item.id).toString();
                this.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    let para = {ids: ids};
                    batchRemovePermission(para).then((res) => {
                        this.listLoading = false;
                        this.$message({
                            message: res.data.message,
                            type: 'success'
                        });
                        this.getPermissions();
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
            this.getPermissions();
        }
    }

</script>

<style scoped>
    .table {
        border: 1px solid #99a9bf;
        line-height: 2;
        width: 100%;
    }

    table > tr > td { border: 1px solid #99a9bf; padding-left: 10px; text-align: left }
</style>