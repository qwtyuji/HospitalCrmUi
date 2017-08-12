<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.keyword" @keyup.enter.native="getDiseases" v-on:blur="getDiseases" placeholder="查询"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getDiseases">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd" v-show="auth.view_disease">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <!--列表-->
        <el-table :data="diseases" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
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
            <el-table-column prop="pidname" label="父级疾病" sortable>
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
                               @click="handleShow(scope.$index, scope.row)" v-show="auth.view_disease">查看
                    </el-button>
                    <el-button type="warning" size="small"
                               @click="handleEdit(scope.$index, scope.row)" v-show="auth.edit_disease">编辑
                    </el-button>
                    <el-button type="danger" size="small"
                               @click="handleDel(scope.$index, scope.row)" v-show="auth.delete_disease">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0" v-show="auth.delete_disease">批量删除</el-button>
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="15" :total="total" style="float:right;">
            </el-pagination>
        </el-col>
        <!--新增页面-->
        <el-dialog title="新增疾病" v-model="addDiseaseVisible" :close-on-click-modal="false">
            <el-form :model="addDisease" label-width="80px" :rules="addDiseaseRules" ref="addDisease">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="addDisease.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="所属科室" prop="department_id">
                    <el-cascader
                            :options="hospitals"
                            v-model="addDisease.department_id"
                            @change="departmentChange">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="疾病分类" prop="pid">
                    <el-select v-model="addDisease.pid" placeholder="选择分类" filterable allow-create>
                        <el-option :label="group.name" :value="group.id" v-for="group in groups" :key="group.id"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="描述">
                    <el-input type="textarea" v-model="addDisease.description"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-radio-group v-model="addDisease.status">
                        <el-radio class="radio" :label="1">启用</el-radio>
                        <el-radio class="radio" :label="0">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addDiseaseVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
        <!--编辑界面-->
        <el-dialog title="编辑疾病" v-model="editDiseaseVisible" :close-on-click-modal="false">
            <el-form :model="editDisease" label-width="80px" :rules="editDiseaseRules" ref="editDisease">
                <el-form-item label="id" prop="id" hidden>
                    <el-input v-model="editDisease.id" auto-complete="off" hidden></el-input>
                </el-form-item>
                <el-form-item label="名称" prop="name">
                    <el-input v-model="editDisease.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="专家号" prop="disease_num">
                    <el-input v-model="editDisease.disease_num" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="所属科室" prop="department_id">
                    <el-cascader
                            :options="hospitals"
                            v-model="editDisease.department_id"
                            @change="departmentChange">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input type="textarea" v-model="editDisease.description"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-radio-group v-model="editDisease.status">
                        <el-radio class="radio" :label="1">启用</el-radio>
                        <el-radio class="radio" :label="0">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editDiseaseVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>
        <el-dialog title="显示详细" v-model="showDiseaseVisible" :close-on-click-model="false">
            <div class="dialog-body">
                <el-card class="box-card">
                    <div class="text item">医生名称:{{ showDisease.name }}</div>
                    <div class="text item">专家号:{{ showDisease.name }}</div>
                    <div class="text item">所属科室:{{showDisease.department.name }}</div>
                    <div class="text item">所属医院:{{showDisease.hospital.name }}</div>
                    <div class="text item">状态:{{ showDisease.status }}</div>
                    <div class="text item">描述:{{ showDisease.description }}</div>
                    <div class="text item">修改时间:{{ showDisease.created_at }}</div>
                    <div class="text item">添加时间:{{ showDisease.updated_at }}</div>
                </el-card>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="showDiseaseVisible = false">关闭</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import {
        getDiseaseListPage,
        getDiseaseList,
        getHospitalDepartment,
        addDisease,
        editDisease,
        removeDisease,
        batchRemoveDisease,
        checkDiseaseNameApi,
        errors
    } from '../api/api';
    export default {
        data() {
            return {
                auth: {
                    view_disease: false,
                    add_disease: false,
                    edit_disease: false,
                    delete_disease: false
                },
                hospitals: [],
                filters: {
                    keyword: ''
                },
                diseases: [],
                groups: [],
                total: 0,
                page: 1,
                listLoading: false,
                sels: [],//列表选中列
                showDiseaseVisible: false,//列表选中列
                editDiseaseVisible: false, //编辑界面是否显示
                editLoading: false,
                //显示页面数据
                showDisease: {
                    id: '',
                    name: '',
                    pid: '',
                    department: '',
                    hospital: '',
                    description: '',
                    status: '',
                },
                //编辑界面数据
                editDisease: {
                    id: '',
                    name: '',
                    disease_num: '',
                    department_id: [],
                    description: '',
                    status: '',
                },
                //新增界面数据
                addDisease: {
                    name: '',
                    pid: '',
                    department_id: [],
                    description: '',
                    status: '',
                },
                editDiseaseRules: {
                    name: [
                        {required: true, message: '请输入名称', trigger: 'blur'},
                    ],
                },
                addDiseaseVisible: false,//新增界面是否显示
                addLoading: false,
                addDiseaseRules: {
                    name: [
                        {required: true, message: '请输入名称', trigger: 'blur'},
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
                this.getDiseases();
            },
            //获取列表
            getDiseases() {
                let para = {
                    page: this.page,
                    keyword: this.filters.keyword
                };
                let _this = this;
                this.listLoading = true;
                getDiseaseListPage(para).then((res) => {
                    this.total = res.data.total;
                    this.diseases = res.data.data;
                    console.log(this.diseases)
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
                this.showDiseaseVisible = true;
                this.showDisease = Object.assign({}, row);
                this.showDisease.hospital = this.showDisease.department.hospital;
                this.showDisease.status = this.formatStatus(row);
            },
            //删除
            handleDel: function (index, row) {
                let _this = this;
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    let para = {id: row.id};
                    removeDisease(para).then((res) => {
                        this.listLoading = false;
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getDiseases();
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
                this.editDiseaseVisible = true;
                this.editDisease = Object.assign({}, row);
                this.editDisease.department_id = [this.editDisease.department.hospital.id, this.editDisease.department_id];

            },
            //显示新增界面
            handleAdd: function () {
                this.hospitals = [];
                getHospitalDepartment().then((res) => {
                    this.hospitals = this.hospitals.concat(res.data);
                });
                this.addDiseaseVisible = true;
                this.addDisease = {
                    name: '',
                    pid: '',
                    department_id: [],
                    description: '',
                    status: 1,
                };
            },
            //编辑
            editSubmit: function () {
                this.$refs.editDisease.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            let _this = this;
                            this.editLoading = true;
                            let para = Object.assign({}, this.editDisease);
                            para.department_id = this.editDisease.department_id[1];
                            editDisease(para).then((res) => {
                                console.log(res)
                                this.editLoading = false;
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['editDisease'].resetFields();
                                this.editDiseaseVisible = false;
                                this.getDiseases();
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
                this.$refs.addDisease.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            let _this = this;
                            this.addLoading = true;
                            let para = Object.assign({}, this.addDisease);
                            para.department_id = this.addDisease.department_id[1]
                            addDisease(para).then((res) => {
                                console.log(res)
                                this.addLoading = false;
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['addDisease'].resetFields();
                                this.addDiseaseVisible = false;
                                this.getDiseases();
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
            departmentChange: function (value) {
                let para = {department_id: value[1]}
                this.groups = [{name:'一级疾病',id:'0'}];
                getDiseaseList(para).then((res) => {
                    this.groups = this.groups.concat(res.data);
                });
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
                    batchRemoveDisease(para).then((res) => {
                        this.listLoading = false;
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getDiseases();
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
            this.getDiseases();
        }
    }

</script>

<style scoped>

</style>