<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.keyword" @keyup.enter.native="getDoctors" v-on:blur="getDoctors" placeholder="查询"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getDoctors">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd" v-show="auth.view_doctor">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <!--列表-->
        <el-table :data="doctors" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column prop="name" label="名称" sortable>
            </el-table-column>
            <el-table-column prop="department.hospital.name" label="所属医院" sortable>
            </el-table-column>
            <el-table-column prop="department.name" label="所属科室" sortable>
            </el-table-column>
            <el-table-column prop="doctor_num" label="专家号" sortable>
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
                               @click="handleShow(scope.$index, scope.row)" v-show="auth.view_doctor">查看</el-button>
                    <el-button type="warning" size="small"
                               @click="handleEdit(scope.$index, scope.row)" v-show="auth.edit_doctor">编辑</el-button>
                    <el-button type="danger" size="small"
                               @click="handleDel(scope.$index, scope.row)" v-show="auth.delete_doctor">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0" v-show="auth.delete_doctor">批量删除</el-button>
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="15" :total="total" style="float:right;">
            </el-pagination>
        </el-col>
        <!--新增页面-->
        <el-dialog title="新增医生" v-model="addDoctorVisible" :close-on-click-modal="false">
            <el-form :model="addDoctor" label-width="80px" :rules="addDoctorRules" ref="addDoctor">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="addDoctor.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="专家号" prop="doctor_num">
                    <el-input v-model="addDoctor.doctor_num" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="所属科室" prop="department_id">
                        <el-cascader
                                :options="hospitals"
                                v-model="addDoctor.department_id"
                                @change="departmentChange">
                        </el-cascader>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input type="textarea" v-model="addDoctor.description"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-radio-group v-model="addDoctor.status">
                        <el-radio class="radio" :label="1">启用</el-radio>
                        <el-radio class="radio" :label="0">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addDoctorVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
        <!--编辑界面-->
        <el-dialog title="编辑医生" v-model="editDoctorVisible" :close-on-click-modal="false">
            <el-form :model="editDoctor" label-width="80px" :rules="editDoctorRules" ref="editDoctor">
                <el-form-item label="id" prop="id" hidden>
                    <el-input v-model="editDoctor.id" auto-complete="off" hidden></el-input>
                </el-form-item>
                <el-form-item label="名称" prop="name">
                    <el-input v-model="editDoctor.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="专家号" prop="doctor_num">
                    <el-input v-model="editDoctor.doctor_num" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="所属科室" prop="department_id">
                        <el-cascader
                                :options="hospitals"
                                v-model="editDoctor.department_id"
                                @change="departmentChange">
                        </el-cascader>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input type="textarea" v-model="editDoctor.description"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-radio-group v-model="editDoctor.status">
                        <el-radio class="radio" :label="1">启用</el-radio>
                        <el-radio class="radio" :label="0">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editDoctorVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>
        <el-dialog title="显示详细" v-model="showDoctorVisible" :close-on-click-model="false">
            <div class="dialog-body">
                <el-card class="box-card">
                    <div class="text item">医生名称:{{ showDoctor.name }}</div>
                    <div class="text item">专家号:{{ showDoctor.name }}</div>
                    <div class="text item">所属科室:{{showDoctor.department.name }}</div>
                    <div class="text item">所属医院:{{showDoctor.hospital.name }}</div>
                    <div class="text item">状态:{{ showDoctor.status }}</div>
                    <div class="text item">描述:{{ showDoctor.description }}</div>
                    <div class="text item">修改时间:{{ showDoctor.created_at }}</div>
                    <div class="text item">添加时间:{{ showDoctor.updated_at }}</div>
                </el-card>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="showDoctorVisible = false">关闭</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import {
        getDoctorListPage,
        getHospitalDepartment,
        addDoctor,
        editDoctor,
        removeDoctor,
        batchRemoveDoctor,
        checkDoctorNameApi,
        errors
    } from '../api/api';
    export default {
        data() {
            var checkAddName = (rule, value, callback) => {
                let para = {name: this.addDoctor.name}
                checkDoctorNameApi(para).then((res) => {
                    console.log(res.data.status)
                    if (!res.data.status) {
                        callback(new Error('医生名称已被占用!'));
                    } else {
                        callback();
                    }
                })
            };
            var checkEditName = (rule, value, callback) => {
                let para = {
                    id: this.editDoctor.id,
                    name: this.editDoctor.name
                }
                checkDoctorNameApi(para).then((res) => {
                    console.log(res.data.status)
                    if (!res.data.status) {
                        callback(new Error('医生名称已被占用!'));
                    } else {
                        callback();
                    }
                })
            };
            return {
                auth: {
                    view_doctor: false,
                    add_doctor: false,
                    edit_doctor: false,
                    delete_doctor: false
                },
                hospitals: [],
                filters: {
                    keyword: ''
                },
                doctors: [],
                total: 0,
                page: 1,
                listLoading: false,
                sels: [],//列表选中列
                showDoctorVisible: false,//列表选中列
                editDoctorVisible: false, //编辑界面是否显示
                editLoading: false,
                //显示页面数据
                showDoctor: {
                    id: '',
                    name: '',
                    doctor_num: '',
                    department: '',
                    hospital:'',
                    description: '',
                    status: '',
                },
                //编辑界面数据
                editDoctor: {
                    id: '',
                    name: '',
                    doctor_num: '',
                    department_id: [],
                    description: '',
                    status: '',
                },
                //新增界面数据
                addDoctor: {
                    name: '',
                    doctor_num: '',
                    department_id: [],
                    description: '',
                    status: '',
                },
                editDoctorRules: {
                    name: [
                        {required: true, message: '请输入名称', trigger: 'blur'},
                        {validator: checkEditName, trigger: 'blur'}
                    ],
                },
                addDoctorVisible: false,//新增界面是否显示
                addLoading: false,
                addDoctorRules: {
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
                this.getDoctors();
            },
            //获取列表
            getDoctors() {
                let para = {
                    page: this.page,
                    keyword: this.filters.keyword
                };
                let _this = this;
                this.listLoading = true;
                getDoctorListPage(para).then((res) => {
                    this.total = res.data.total;
                    this.doctors = res.data.data;
                    console.log(this.doctors)
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
                this.showDoctorVisible = true;
                this.showDoctor = Object.assign({}, row);
                this.showDoctor.hospital = this.showDoctor.department.hospital;
                this.showDoctor.status = this.formatStatus(row);
            },
            //删除
            handleDel: function (index, row) {
                let _this = this;
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    let para = {id: row.id};
                    removeDoctor(para).then((res) => {
                        this.listLoading = false;
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getDoctors();
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
                getHospitalDepartment().then((res) => {
                    this.hospitals = this.hospitals.concat(res.data);
                });
                this.editDoctorVisible = true;
                this.editDoctor = Object.assign({}, row);
                this.editDoctor.department_id =[this.editDoctor.department.hospital.id,this.editDoctor.department_id];

            },
            //显示新增界面
            handleAdd: function () {
                this.hospitals = [];
                getHospitalDepartment().then((res) => {
                    this.hospitals = this.hospitals.concat(res.data);
                });
                this.addDoctorVisible = true;
                this.addDoctor = {
                    name: '',
                    doctor_num: '',
                    department_id: [],
                    description: '',
                    status: 1,
                };
            },
            //编辑
            editSubmit: function () {
                this.$refs.editDoctor.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            let _this = this;
                            this.editLoading = true;
                            let para = Object.assign({}, this.editDoctor);
                            para.department_id = this.editDoctor.department_id[1];
                            editDoctor(para).then((res) => {
                                console.log(res)
                                this.editLoading = false;
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['editDoctor'].resetFields();
                                this.editDoctorVisible = false;
                                this.getDoctors();
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
                this.$refs.addDoctor.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            let _this = this;
                            this.addLoading = true;
                            let para = Object.assign({}, this.addDoctor);
                            para.department_id = this.addDoctor.department_id[1]
                            addDoctor(para).then((res) => {
                                console.log(res)
                                this.addLoading = false;
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['addDoctor'].resetFields();
                                this.addDoctorVisible = false;
                                this.getDoctors();
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
            departmentChange:function (value) {
                console.log(value);
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
                    batchRemoveDoctor(para).then((res) => {
                        this.listLoading = false;
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getDoctors();
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
            this.getDoctors();
        }
    }

</script>

<style scoped>

</style>