<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.keyword" @keyup.enter.native="getRoles" v-on:blur="getRoles" placeholder="查询"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getRoles">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <!--列表-->
        <el-table :data="roles" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column prop="name" label="名称" sortable>
            </el-table-column>
            <el-table-column prop="updated_at" label="时间" sortable>
            </el-table-column>
            <el-table-column label="操作" width="200">
                <template scope="scope">
                    <el-button type="success" size="small" @click="handleShow(scope.$index, scope.row)">查看</el-button>
                    <el-button type="warning" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
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
        <el-dialog title="新增用户组" v-model="addRoleVisible" :close-on-click-modal="false">
            <el-form :model="addRole" label-width="80px" :rules="addRoleRules" ref="addRole">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="addRole.name " auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="权限" prop="permission">
                    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleAddPermissionAllChange">全选</el-checkbox>
                    <el-checkbox-group v-model="addRole.permissions" @change="handleAddPermissionChange">
                        <el-checkbox v-for="item in allPermissions" :label="item.name" :key="item.id" class="permission">{{item.cname}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addRoleVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
        <!--编辑界面-->
        <el-dialog title="编辑用户组" v-model="editRoleVisible" :close-on-click-modal="false">
            <el-form :model="editRole" label-width="80px" :rules="editRoleRules" ref="editRole">
                <el-form-item label="id" prop="id" hidden>
                    <el-input v-model="editRole.id" auto-complete="off" hidden></el-input>
                </el-form-item>
                <el-form-item label="名称" prop="name">
                    <el-input v-model="editRole.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="权限" prop="permission">
                    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleEditPermissionAllChange">全选</el-checkbox>
                    <el-checkbox-group v-model="editRole.permissions" @change="handleEditPermissionChange">
                        <el-checkbox v-for="item in allPermissions" :label="item.name" :key="item.id" class="permission">{{item.cname}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editRoleVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>
        <el-dialog title="显示详细" v-model="showRoleVisible" :close-on-click-model="false">
            <div class="dialog-body">
                <table class="table">
                    <tr>
                        <td>名称:</td>
                        <td>{{ showRole.name }}</td>
                    </tr>
                    <tr>
                        <td>状态:</td>
                        <td>{{ showRole.status }}</td>
                    </tr>
                    <tr>
                        <td>描述:</td>
                        <td>{{ showRole.description }}</td>
                    </tr>
                    <tr>
                        <td>修改时间:</td>
                        <td>{{ showRole.updated_at }}</td>
                    </tr>
                    <tr>
                        <td>添加时间:</td>
                        <td>{{ showRole.created_at }}</td>
                    </tr>
                </table>


            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="showRoleVisible = false">关闭</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import {
        getRoleListPage,
        addRole,
        editRole,
        removeRole,
        batchRemoveRole,
        checkRoleNameApi,
        getAllPermissions,
        errors
    } from '../api/api';
    export default {
        data() {
            var checkAddName = (rule, value, callback) => {
                let para = {name: this.addRole.name}
                checkRoleNameApi(para).then((res) => {
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
                    id: this.editRole.id,
                    name: this.editRole.name
                }
                checkRoleNameApi(para).then((res) => {
                    console.log(res.data.status)
                    if (!res.data.status) {
                        callback(new Error('名称已被占用!'));
                    } else {
                        callback();
                    }
                })
            };
            return {
                checkAll: false,
                allPermissions: [],
                isIndeterminate: true,
                cates: [],
                filters: {
                    keyword: ''
                },
                roles: [],
                total: 0,
                page: 1,
                listLoading: false,
                sels: [],//列表选中列
                showRoleVisible: false,//列表选中列
                editRoleVisible: false, //编辑界面是否显示
                editLoading: false,
                addRoleVisible: false,//新增界面是否显示
                addLoading: false,
                //显示页面数据
                showRole: {
                    id: '',
                    name: '',
                    guard_name: '',
                    description: '',
                    status: '',
                },
                //编辑界面数据
                editRole: {
                    id: '',
                    name: '',
                    guard_name: '',
                    permissions: [],
                    status: '',
                },
                //新增界面数据
                addRole: {
                    name: '',
                    guard_name: '',
                    permissions: [],
                    status: '',
                },
                addRoleRules: {
                    name: [
                        {required: true, message: '请输入姓名', trigger: 'blur'},
                        {validator: checkAddName, trigger: 'blur'},
                    ],
                },
                editRoleRules: {
                    name: [
                        {required: true, message: '请输入名称', trigger: 'blur'},
                        {validator: checkEditName, trigger: 'blur'}
                    ],
                },

            }

        },
        methods: {
            handleAddPermissionAllChange(event) {
                this.addRole.permissions = event.target.checked ? this.allPermissions.map(item => item.name) : [];
                this.isIndeterminate = false;
            },
            handleEditPermissionAllChange(event) {
                this.editRole.permissions = event.target.checked ? this.allPermissions.map(item => item.name) : [];
                this.isIndeterminate = false;
            },
            handleAddPermissionChange(value) {
                let checkedCount = value.length;
                this.checkAll = checkedCount === this.addRole.permissions.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.addRole.permissions.length;
            },
            handleEditPermissionChange(value) {
                let checkedCount = value.length;
                this.checkAll = checkedCount === this.editRole.permissions.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.editRole.permissions.length;
            },
            //显示转换
            formatStatus: function (row, column) {
                return row.status == '1' ? '启用' : row.status = '0' ? '禁用' : '未知';
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getRoles();
            },
            //获取列表
            getRoles() {
                let para = {
                    page: this.page,
                    keyword: this.filters.keyword
                };
                let _this = this;
                this.listLoading = true;
                getRoleListPage(para).then((res) => {
                    this.total = res.data.total;
                    this.roles = res.data.data;
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
                this.showRoleVisible = true;
                this.showRole = Object.assign({}, row);
                this.showRole.status = this.formatStatus(row);
            },
            //删除
            handleDel: function (index, row) {
                let _this = this;
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    let para = {id: row.id};
                    removeRole(para).then((res) => {
                        this.listLoading = false;
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getRoles();
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
                getAllPermissions().then((res) => {
                    this.allPermissions = res.data
                });
                this.editRoleVisible = true;
                this.editRole = Object.assign({}, row);
                this.editRole.permissions = row.permissions.map(item => item.name)
            },
            //显示新增界面
            handleAdd: function () {
                this.addRoleVisible = true;
                getAllPermissions().then((res) => {
                    this.allPermissions = res.data
                });
                this.addRole = {
                    name: '',
                    gurdname: '',
                    permissions: [],
                    status: 1,
                };
            },
            //编辑
            editSubmit: function () {
                this.$refs.editRole.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            let _this = this;
                            this.editLoading = true;
                            let para = Object.assign({}, this.editRole);
                            editRole(para).then((res) => {
                                this.editLoading = false;
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['editRole'].resetFields();
                                this.editRoleVisible = false;
                                this.getRoles();
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
                this.$refs.addRole.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            let _this = this;
                            this.addLoading = true;
                            let para = Object.assign({}, this.addRole);
                            addRole(para).then((res) => {
                                this.addLoading = false;
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['addRole'].resetFields();
                                this.addRoleVisible = false;
                                this.getRoles();
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
                    batchRemoveRole(para).then((res) => {
                        this.listLoading = false;
                        this.$message({
                            message: res.data.message,
                            type: 'success'
                        });
                        this.getRoles();
                    });
                }).catch((rs) => {
                    _this.listLoading = false;
                    _this.$message({
                        message: errors(rs).message,
                        type: errors(rs).type,
                        duration: errors(rs).duration
                    });
                });
            }
        },
        mounted() {
            this.getRoles();
        }
    }

</script>

<style scoped>
    .table {
        border: 1px solid #99a9bf;
        line-height: 2;
        width: 100%;
    }

    .permission {
        margin-left: 0; margin-right: 10px;
    }

    table > tr > td { border: 1px solid #99a9bf; padding-left: 10px; text-align: left }
</style>