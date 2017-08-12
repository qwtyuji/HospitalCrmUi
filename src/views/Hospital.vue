<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.keyword" @keyup.enter.native="getHospitals" v-on:blur="getHospitals" placeholder="查询"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getHospitals">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd" v-show="auth.view_hospital">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <!--列表-->
        <el-table :data="hospitals" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column prop="name" label="名称" sortable>
            </el-table-column>
            <el-table-column prop="group" label="分组" sortable>
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
                               @click="handleShow(scope.$index, scope.row)" v-show="auth.view_hospital">查看
                    </el-button>
                    <el-button type="warning" size="small"
                               @click="handleEdit(scope.$index, scope.row)" v-show="auth.edit_hospital">编辑
                    </el-button>
                    <el-button type="danger" size="small"
                               @click="handleDel(scope.$index, scope.row)" v-show="auth.delete_hospital">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0" v-show="auth.delete_hospital">批量删除</el-button>
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="15" :total="total" style="float:right;">
            </el-pagination>
        </el-col>
        <!--新增页面-->
        <el-dialog title="新增医院" v-model="addHospitalVisible" :close-on-click-modal="false">
            <el-form :model="addHospital" label-width="80px" :rules="addHospitalRules" ref="addHospital">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="addHospital.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="选择分组" prop="group">
                    <el-select v-model="addHospital.group" placeholder="选择分组" filterable allow-create>
                        <el-option :label="group.name" :value="group.name" v-for="group in groups" :key="group.name"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input type="textarea" v-model="addHospital.description"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-radio-group v-model="addHospital.status">
                        <el-radio class="radio" :label="1">启用</el-radio>
                        <el-radio class="radio" :label="0">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addHospitalVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
        <!--编辑界面-->
        <el-dialog title="编辑医院" v-model="editHospitalVisible" :close-on-click-modal="false">
            <el-form :model="editHospital" label-width="80px" :rules="editHospitalRules" ref="editHospital">
                <el-form-item label="id" prop="id" hidden>
                    <el-input v-model="editHospital.id" auto-complete="off" hidden></el-input>
                </el-form-item>
                <el-form-item label="名称" prop="name">
                    <el-input v-model="editHospital.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="选择分组" prop="group">
                    <el-select v-model="editHospital.group" placeholder="选择分组">
                        <el-option :label="group.name" :value="group.name" v-for="group in groups" :key="group.name"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="描述">
                    <el-input type="textarea" v-model="editHospital.description"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-radio-group v-model="editHospital.status">
                        <el-radio class="radio" :label="1">启用</el-radio>
                        <el-radio class="radio" :label="0">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editHospitalVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>
        <el-dialog title="显示详细" v-model="showHospitalVisible" :close-on-click-model="false">
            <div class="dialog-body">
                <el-card class="box-card">
                    <div class="text item">名称:{{ showHospital.name }}</div>
                    <div class="text item">分组:{{ showHospital.group }}</div>
                    <div class="text item">状态:{{ showHospital.status }}</div>
                    <div class="text item">描述:{{ showHospital.description }}</div>
                    <div class="text item">修改时间:{{ showHospital.created_at }}</div>
                    <div class="text item">添加时间:{{ showHospital.updated_at }}</div>
                </el-card>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="showHospitalVisible = false">关闭</el-button>
            </div>


        </el-dialog>
    </section>
</template>

<script>
    import {
        getHospitalListPage,
        getHospitalGroup,
        addHospital,
        editHospital,
        removeHospital,
        batchRemoveHospital,
        checkHospitalNameApi,
        errors
    } from '../api/api';
    export default {
        data() {
            var checkAddName = (rule, value, callback) => {
                let para = {name: this.addHospital.name}
                checkHospitalNameApi(para).then((res) => {
                    console.log(res.data.status)
                    if (!res.data.status) {
                        callback(new Error('医院名称已被占用!'));
                    } else {
                        callback();
                    }
                })
            };
            var checkEditName = (rule, value, callback) => {
                let para = {
                    id: this.editHospital.id,
                    name: this.editHospital.name
                }
                checkHospitalNameApi(para).then((res) => {
                    console.log(res.data.status)
                    if (!res.data.status) {
                        callback(new Error('医院名称已被占用!'));
                    } else {
                        callback();
                    }
                })
            };
            return {
                auth: {
                    view_hospital: false,
                    add_hospital: false,
                    edit_hospital: false,
                    delete_hospital: false
                },
                groups: [],
                filters: {
                    keyword: ''
                },
                hospitals: [],
                total: 0,
                page: 1,
                listLoading: false,
                sels: [],//列表选中列
                showHospitalVisible: false,//列表选中列
                editHospitalVisible: false, //编辑界面是否显示
                editLoading: false,
                //显示页面数据
                showHospital: {
                    id: '',
                    name: '',
                    group: '',
                    description: '',
                    status: '',
                },
                //编辑界面数据
                editHospital: {
                    id: '',
                    name: '',
                    group: '',
                    description: '',
                    status: '',
                },
                //新增界面数据
                addHospital: {
                    name: '',
                    group: '',
                    description: '',
                    status: '',
                },
                editHospitalRules: {
                    name: [
                        {required: true, message: '请输入名称', trigger: 'blur'},
                        {validator: checkEditName, trigger: 'blur'}
                    ],
                },
                addHospitalVisible: false,//新增界面是否显示
                addLoading: false,
                addHospitalRules: {
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
                this.getHospitals();
            },
            //获取列表
            getHospitals() {
                let para = {
                    page: this.page,
                    keyword: this.filters.keyword
                };
                let _this = this;
                this.listLoading = true;
                getHospitalListPage(para).then((res) => {
                    this.total = res.data.total;
                    this.hospitals = res.data.data;
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
                this.showHospitalVisible = true;
                this.showHospital = Object.assign({}, row);
                this.showHospital.status = this.formatStatus(row);
            },
            //删除
            handleDel: function (index, row) {
                let _this = this;
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    let para = {id: row.id};
                    removeHospital(para).then((res) => {
                        this.listLoading = false;
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getHospitals();
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
                this.groups = [];
                getHospitalGroup().then((res) => {
                    this.groups = this.groups.concat(res.data);
                });
                this.editHospitalVisible = true;
                this.editHospital = Object.assign({}, row);

            },
            //显示新增界面
            handleAdd: function () {
                getHospitalGroup().then((res) => {
                    this.groups = [];
                    this.groups = this.groups.concat(res.data);
                });
                this.addHospitalVisible = true;
                this.addHospital = {
                    name: '',
                    group: '',
                    description: '',
                    status: 1,
                };
            },
            //编辑
            editSubmit: function () {
                this.$refs.editHospital.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            let _this = this;
                            this.editLoading = true;
                            let para = Object.assign({}, this.editHospital);
                            editHospital(para).then((res) => {
                                console.log(res)
                                this.editLoading = false;
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['editHospital'].resetFields();
                                this.editHospitalVisible = false;
                                this.getHospitals();
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
                this.$refs.addHospital.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            let _this = this;
                            this.addLoading = true;
                            let para = Object.assign({}, this.addHospital);
                            addHospital(para).then((res) => {
                                console.log(res)
                                this.addLoading = false;
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['addHospital'].resetFields();
                                this.addHospitalVisible = false;
                                this.getHospitals();
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
                    batchRemoveHospital(para).then((res) => {
                        this.listLoading = false;
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getHospitals();
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
            this.getHospitals();
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