<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.keyword" @keyup.enter.native="getDeparts" v-on:blur="getDeparts" placeholder="查询"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getDeparts">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd" v-show="auth.view_depart">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <!--列表-->
        <el-table :data="departs" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column prop="name" label="名称" sortable>
            </el-table-column>
            <el-table-column prop="pidName" label="上级部门" sortable>
            </el-table-column>
            <el-table-column prop="author" label="添加人" sortable>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="100" :formatter="formatStatus" sortable>
            </el-table-column>
            <el-table-column prop="updated_at" label="时间" sortable>
            </el-table-column>
            <el-table-column label="操作" width="200">
                <template scope="scope">
                    <el-button type="success" size="small"
                               @click="handleShow(scope.$index, scope.row)" v-show="auth.view_depart">查看
                    </el-button>
                    <el-button type="warning" size="small"
                               @click="handleEdit(scope.$index, scope.row)" v-show="auth.edit_depart">编辑
                    </el-button>
                    <el-button type="danger" size="small"
                               @click="handleDel(scope.$index, scope.row)" v-show="auth.delete_depart">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0" v-show="auth.delete_depart">批量删除</el-button>
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="15" :total="total" style="float:right;">
            </el-pagination>
        </el-col>
        <!--新增页面-->
        <el-dialog title="新增部门" v-model="addDepartVisible" :close-on-click-modal="false">
            <el-form :model="addDepart" label-width="80px" :rules="addDepartRules" ref="addDepart">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="addDepart.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="上级部门" prop="pid">
                    <el-select v-model="addDepart.pid" placeholder="上级部门">
                        <el-option :label="parentdpart.name" :value="parentdpart.id" v-for="parentdpart in parentDeparts" :key="parentdpart.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input type="textarea" v-model="addDepart.description"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-radio-group v-model="addDepart.status">
                        <el-radio class="radio" :label="1">启用</el-radio>
                        <el-radio class="radio" :label="0">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addDepartVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
        <!--编辑界面-->
        <el-dialog title="编辑部门" v-model="editDepartVisible" :close-on-click-modal="false">
            <el-form :model="editDepart" label-width="80px" :rules="editDepartRules" ref="editDepart">
                <el-form-item label="id" prop="id" hidden>
                    <el-input v-model="editDepart.id" auto-complete="off" hidden></el-input>
                </el-form-item>
                <el-form-item label="名称" prop="name">
                    <el-input v-model="editDepart.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="上级部门" prop="pid">
                    <el-select v-model="editDepart.pid" placeholder="选择上级部门">
                        <el-option :label="parentdpart.name" :value="parentdpart.id" v-for="parentdpart in parentDeparts" :key="parentdpart.id"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="描述">
                    <el-input type="textarea" v-model="editDepart.description"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-radio-group v-model="editDepart.status">
                        <el-radio class="radio" :label="1">启用</el-radio>
                        <el-radio class="radio" :label="0">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editDepartVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>
        <el-dialog title="显示详细" v-model="showDepartVisible" :close-on-click-model="false">
            <div class="dialog-body">
                <el-card class="box-card">
                    <div class="text item">名称:{{ showDepart.name }}</div>
                    <div class="text item">分组:{{ showDepart.parentName }}</div>
                    <div class="text item">状态:{{ showDepart.status }}</div>
                    <div class="text item">描述:{{ showDepart.description }}</div>
                    <div class="text item">修改时间:{{ showDepart.created_at }}</div>
                    <div class="text item">添加时间:{{ showDepart.updated_at }}</div>
                </el-card>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="showDepartVisible = false">关闭</el-button>
            </div>


        </el-dialog>
    </section>
</template>

<script>
    import {
        getDepartListPage,
        getDepartList,
        addDepart,
        editDepart,
        removeDepart,
        batchRemoveDepart,
        checkDepartNameApi,
        errors
    } from '../api/api';
    export default {
        data() {
            var checkAddName = (rule, value, callback) => {
                let para = {name: this.addDepart.name}
                checkDepartNameApi(para).then((res) => {
                    console.log(res.data.status)
                    if (!res.data.status) {
                        callback(new Error('部门名称已被占用!'));
                    } else {
                        callback();
                    }
                })
            };
            var checkEditName = (rule, value, callback) => {
                let para = {
                    id: this.editDepart.id,
                    name: this.editDepart.name
                }
                checkDepartNameApi(para).then((res) => {
                    console.log(res.data.status)
                    if (!res.data.status) {
                        callback(new Error('部门名称已被占用!'));
                    } else {
                        callback();
                    }
                })
            };
            return {
                auth: {
                    view_depart: false,
                    add_depart: false,
                    edit_depart: false,
                    delete_depart: false
                },
                parentDeparts: [],
                filters: {
                    keyword: ''
                },
                departs: [],
                total: 0,
                page: 1,
                listLoading: false,
                sels: [],//列表选中列
                showDepartVisible: false,//列表选中列
                editDepartVisible: false, //编辑界面是否显示
                editLoading: false,
                //显示页面数据
                showDepart: {
                    id: '',
                    name: '',
                    parentName: '',
                    description: '',
                    status: '',
                },
                //编辑界面数据
                editDepart: {
                    id: '',
                    name: '',
                    pid: '',
                    description: '',
                    status: '',
                },
                //新增界面数据
                addDepart: {
                    name: '',
                    pid: '',
                    description: '',
                    status: '',
                },
                editDepartRules: {
                    name: [
                        {required: true, message: '请输入名称', trigger: 'blur'},
                        {validator: checkEditName, trigger: 'blur'}
                    ],
                },
                addDepartVisible: false,//新增界面是否显示
                addLoading: false,
                addDepartRules: {
                    name: [
                        {required: true, message: '请输入名称', trigger: 'blur'},
                        {validator: checkAddName, trigger: 'blur'},
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
                this.getDeparts();
            },
            //获取列表
            getDeparts() {
                let para = {
                    page: this.page,
                    keyword: this.filters.keyword
                };
                let _this = this;
                this.listLoading = true;
                getDepartListPage(para).then((res) => {
                    this.total = res.data.total;
                    this.departs = res.data.data;
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
                this.showDepartVisible = true;
                this.showDepart = Object.assign({}, row);
                this.showDepart.status = this.formatStatus(row);
            },
            //删除
            handleDel: function (index, row) {
                let _this = this;
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    let para = {id: row.id};
                    removeDepart(para).then((res) => {
                        this.listLoading = false;
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getDeparts();
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
                this.parentDeparts = [{name: '顶级部门', id: 0}];
                getDepartList().then((res) => {
                    this.parentDeparts = this.parentDeparts.concat(res.data);
                });

                this.editDepartVisible = true;
                this.editDepart = Object.assign({}, row);

            },
            //显示新增界面
            handleAdd: function () {
                this.parentDeparts = [{name: '顶级部门', id: 0}];
                getDepartList().then((res) => {
                    console.log(res)
                    this.parentDeparts = this.parentDeparts.concat(res.data);
                });
                console.log(this.parentDeparts)
                this.addDepartVisible = true;
                this.addDepart = {
                    name: '',
                    pid: '',
                    description: '',
                    status: 1,
                };
            },
            //编辑
            editSubmit: function () {
                this.$refs.editDepart.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            let _this = this;
                            this.editLoading = true;
                            let para = Object.assign({}, this.editDepart);
                            editDepart(para).then((res) => {
                                this.editLoading = false;
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['editDepart'].resetFields();
                                this.editDepartVisible = false;
                                this.getDeparts();
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
                this.$refs.addDepart.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            let _this = this;
                            this.addLoading = true;
                            let para = Object.assign({}, this.addDepart);
                            addDepart(para).then((res) => {
                                console.log(res)
                                this.addLoading = false;
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['addDepart'].resetFields();
                                this.addDepartVisible = false;
                                this.getDeparts();
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
                    batchRemoveDepart(para).then((res) => {
                        this.listLoading = false;
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getDeparts();
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
            this.getDeparts();
        }
    }

</script>

<style scoped>
    .text {
        font-size: 14px;
    }

    .item {
        padding: 5px 0;
    }
</style>