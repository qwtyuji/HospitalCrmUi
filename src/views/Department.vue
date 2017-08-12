<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.keyword" @keyup.enter.native="getDepartments" v-on:blur="getDepartments" placeholder="查询"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getDepartments">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd" v-show="auth.view_department">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <!--列表-->
        <el-table :data="departments" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column prop="name" label="名称" sortable>
            </el-table-column>
            <el-table-column prop="hospital.name" label="所属医院" sortable>
            </el-table-column>
            <el-table-column prop="author" label="添加人" sortable>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="120" :formatter="formatStatus" sortable>
            </el-table-column>
            <el-table-column prop="updated_at" label="时间" sortable>
            </el-table-column>
            <el-table-column label="操作" width="200">
                <template scope="scope">
                    <el-button type="success" size="small"
                               @click="handleShow(scope.$index, scope.row)" v-show="auth.view_department">查看
                    </el-button>
                    <el-button type="warning" size="small"
                               @click="handleEdit(scope.$index, scope.row)" v-show="auth.edit_department">编辑
                    </el-button>
                    <el-button type="danger" size="small"
                               @click="handleDel(scope.$index, scope.row)" v-show="auth.delete_department">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0" v-show="auth.delete_department">批量删除</el-button>
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="15" :total="total" style="float:right;">
            </el-pagination>
        </el-col>
        <!--新增页面-->
        <el-dialog title="新增科室" v-model="addDepartmentVisible" :close-on-click-modal="false">
            <el-form :model="addDepartment" label-width="80px" :rules="addDepartmentRules" ref="addDepartment">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="addDepartment.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="所属医院" prop="hospital_id">
                    <el-select v-model="addDepartment.hospital_id" placeholder="选择医院">
                        <el-option :label="hospital.name" :value="hospital.id" v-for="hospital in hospitals" :key="hospital.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input type="textarea" v-model="addDepartment.description"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-radio-group v-model="addDepartment.status">
                        <el-radio class="radio" :label="1">启用</el-radio>
                        <el-radio class="radio" :label="0">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addDepartmentVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
        <!--编辑界面-->
        <el-dialog title="编辑科室" v-model="editDepartmentVisible" :close-on-click-modal="false">
            <el-form :model="editDepartment" label-width="80px" :rules="editDepartmentRules" ref="editDepartment">
                <el-form-item label="id" prop="id" hidden>
                    <el-input v-model="editDepartment.id" auto-complete="off" hidden></el-input>
                </el-form-item>
                <el-form-item label="名称" prop="name">
                    <el-input v-model="editDepartment.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="所属医院" prop="hospital_id">
                    <el-select v-model="editDepartment.hospital_id" placeholder="选择医院">
                        <el-option :label="hospital.name" :value="hospital.id" v-for="hospital in hospitals" :key="hospital.id"></el-option>

                    </el-select>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input type="textarea" v-model="editDepartment.description"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-radio-group v-model="editDepartment.status">
                        <el-radio class="radio" :label="1">启用</el-radio>
                        <el-radio class="radio" :label="0">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editDepartmentVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>
        <el-dialog title="显示详细" v-model="showDepartmentVisible" :close-on-click-model="false">
            <div class="dialog-body">
                <el-card class="box-card">
                    <div class="text item">名称:{{ showDepartment.name }}</div>
                    <div class="text item">所属医院:{{ showDepartment.hospital.name }}</div>
                    <div class="text item">状态:{{ showDepartment.status }}</div>
                    <div class="text item">描述:{{ showDepartment.description }}</div>
                    <div class="text item">修改时间:{{ showDepartment.created_at }}</div>
                    <div class="text item">添加时间:{{ showDepartment.updated_at }}</div>
                </el-card>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="showDepartmentVisible = false">关闭</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import {
        getDepartmentListPage,
        getHospitalList,
        addDepartment,
        editDepartment,
        removeDepartment,
        batchRemoveDepartment,
        checkDepartmentNameApi,
        errors
    } from '../api/api';
    export default {
        data() {
            var checkAddName = (rule, value, callback) => {
                let para = {name: this.addDepartment.name}
                checkDepartmentNameApi(para).then((res) => {
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
                    id: this.editDepartment.id,
                    name: this.editDepartment.name
                }
                checkDepartmentNameApi(para).then((res) => {
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
                    view_department: false,
                    add_department: false,
                    edit_department: false,
                    delete_department: false
                },
                hospitals: [],
                filters: {
                    keyword: ''
                },
                departments: [],
                total: 0,
                page: 1,
                listLoading: false,
                sels: [],//列表选中列
                showDepartmentVisible: false,//列表选中列
                editDepartmentVisible: false, //编辑界面是否显示
                editLoading: false,
                //显示页面数据
                showDepartment: {
                    id: '',
                    name: '',
                    hospital: '',
                    description: '',
                    status: '',
                },
                //编辑界面数据
                editDepartment: {
                    id: '',
                    name: '',
                    hospital_id: '',
                    description: '',
                    status: '',
                },
                //新增界面数据
                addDepartment: {
                    name: '',
                    hospital_id: '',
                    description: '',
                    status: '',
                },
                editDepartmentRules: {
                    name: [
                        {required: true, message: '请输入名称', trigger: 'blur'},
                        {validator: checkEditName, trigger: 'blur'}
                    ],
                },
                addDepartmentVisible: false,//新增界面是否显示
                addLoading: false,
                addDepartmentRules: {
                    name: [
                        {required: true, message: '请输入姓名', trigger: 'blur'},
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
                this.getDepartments();
            },
            //获取列表
            getDepartments() {
                let para = {
                    page: this.page,
                    keyword: this.filters.keyword
                };
                let _this = this;
                this.listLoading = true;
                getDepartmentListPage(para).then((res) => {
                    this.total = res.data.total;
                    this.departments = res.data.data;
                    console.log(this.departments)
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
                this.showDepartmentVisible = true;
                this.showDepartment = Object.assign({}, row);
                this.showDepartment.status = this.formatStatus(row);
            },
            //删除
            handleDel: function (index, row) {
                let _this = this;
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    let para = {id: row.id};
                    removeDepartment(para).then((res) => {
                        this.listLoading = false;
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getDepartments();
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
                this.hospitals = [];
                getHospitalList().then((res) => {
                    this.hospitals = this.hospitals.concat(res.data);
                    console.log(this.hospitals)
                });
                this.editDepartmentVisible = true;
                this.editDepartment = Object.assign({}, row);

            },
            //显示新增界面
            handleAdd: function () {
                this.hospitals = []
                getHospitalList().then((res) => {
                    this.hospitals = this.hospitals.concat(res.data);
                });
                this.addDepartmentVisible = true;
                this.addDepartment = {
                    name: '',
                    hospital_id: '',
                    keyword: '',
                    description: '',
                    status: 1,
                };
            },
            //编辑
            editSubmit: function () {
                this.$refs.editDepartment.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            let _this = this;
                            this.editLoading = true;
                            let para = Object.assign({}, this.editDepartment);
                            editDepartment(para).then((res) => {
                                console.log(res)
                                this.editLoading = false;
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['editDepartment'].resetFields();
                                this.editDepartmentVisible = false;
                                this.getDepartments();
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
                this.$refs.addDepartment.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            let _this = this;
                            this.addLoading = true;
                            let para = Object.assign({}, this.addDepartment);
                            console.log(para);
                            addDepartment(para).then((res) => {
                                console.log(res)
                                this.addLoading = false;
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['addDepartment'].resetFields();
                                this.addDepartmentVisible = false;
                                this.getDepartments();
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
                    batchRemoveDepartment(para).then((res) => {
                        this.listLoading = false;
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getDepartments();
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
            this.getDepartments();
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