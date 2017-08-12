<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.keyword" @keyup.enter.native="getMedias" v-on:blur="getMedias" placeholder="查询"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getMedias">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd" v-show="auth.view_media">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <!--列表-->
        <el-table :data="medias" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
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
                               @click="handleShow(scope.$index, scope.row)" v-show="auth.view_media">查看
                    </el-button>
                    <el-button type="warning" size="small"
                               @click="handleEdit(scope.$index, scope.row)" v-show="auth.edit_media">编辑
                    </el-button>
                    <el-button type="danger" size="small"
                               @click="handleDel(scope.$index, scope.row)" v-show="auth.delete_media">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0" v-show="auth.delete_media">批量删除</el-button>
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="15" :total="total" style="float:right;">
            </el-pagination>
        </el-col>
        <!--新增页面-->
        <el-dialog title="新增科室" v-model="addMediaVisible" :close-on-click-modal="false">
            <el-form :model="addMedia" label-width="80px" :rules="addMediaRules" ref="addMedia">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="addMedia.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="所属医院" prop="hospital_id">
                    <el-select v-model="addMedia.hospital_id" placeholder="选择医院">
                        <el-option :label="hospital.name" :value="hospital.id" v-for="hospital in hospitals" :key="hospital.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input type="textarea" v-model="addMedia.description"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-radio-group v-model="addMedia.status">
                        <el-radio class="radio" :label="1">启用</el-radio>
                        <el-radio class="radio" :label="0">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addMediaVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
        <!--编辑界面-->
        <el-dialog title="编辑科室" v-model="editMediaVisible" :close-on-click-modal="false">
            <el-form :model="editMedia" label-width="80px" :rules="editMediaRules" ref="editMedia">
                <el-form-item label="id" prop="id" hidden>
                    <el-input v-model="editMedia.id" auto-complete="off" hidden></el-input>
                </el-form-item>
                <el-form-item label="名称" prop="name">
                    <el-input v-model="editMedia.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="所属医院" prop="hospital_id">
                    <el-select v-model="editMedia.hospital_id" placeholder="选择医院">
                        <el-option :label="hospital.name" :value="hospital.id" v-for="hospital in hospitals" :key="hospital.id"></el-option>

                    </el-select>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input type="textarea" v-model="editMedia.description"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-radio-group v-model="editMedia.status">
                        <el-radio class="radio" :label="1">启用</el-radio>
                        <el-radio class="radio" :label="0">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editMediaVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>
        <el-dialog title="显示详细" v-model="showMediaVisible" :close-on-click-model="false">
            <div class="dialog-body">
                <el-card class="box-card">
                    <div class="text item">名称:{{ showMedia.name }}</div>
                    <div class="text item">所属医院:{{ showMedia.hospital.name }}</div>
                    <div class="text item">状态:{{ showMedia.status }}</div>
                    <div class="text item">描述:{{ showMedia.description }}</div>
                    <div class="text item">修改时间:{{ showMedia.created_at }}</div>
                    <div class="text item">添加时间:{{ showMedia.updated_at }}</div>
                </el-card>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="showMediaVisible = false">关闭</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import {
        getMediaListPage,
        getHospitalList,
        addMedia,
        editMedia,
        removeMedia,
        batchRemoveMedia,
        errors
    } from '../api/api';
    export default {
        data() {
            return {
                auth: {
                    view_media: false,
                    add_media: false,
                    edit_media: false,
                    delete_media: false
                },
                hospitals: [],
                filters: {
                    keyword: ''
                },
                medias: [],
                total: 0,
                page: 1,
                listLoading: false,
                sels: [],//列表选中列
                showMediaVisible: false,//列表选中列
                editMediaVisible: false, //编辑界面是否显示
                editLoading: false,
                //显示页面数据
                showMedia: {
                    id: '',
                    name: '',
                    hospital: '',
                    description: '',
                    status: '',
                },
                //编辑界面数据
                editMedia: {
                    id: '',
                    name: '',
                    hospital_id: '',
                    description: '',
                    status: '',
                },
                //新增界面数据
                addMedia: {
                    name: '',
                    hospital_id: '',
                    description: '',
                    status: '',
                },
                editMediaRules: {
                    name: [
                        {required: true, message: '请输入名称', trigger: 'blur'},
                    ],
                },
                addMediaVisible: false,//新增界面是否显示
                addLoading: false,
                addMediaRules: {
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
                this.getMedias();
            },
            //获取列表
            getMedias() {
                let para = {
                    page: this.page,
                    keyword: this.filters.keyword
                };
                let _this = this;
                this.listLoading = true;
                getMediaListPage(para).then((res) => {
                    this.total = res.data.total;
                    this.medias = res.data.data;
                    console.log(this.medias)
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
                this.showMediaVisible = true;
                this.showMedia = Object.assign({}, row);
                this.showMedia.status = this.formatStatus(row);
            },
            //删除
            handleDel: function (index, row) {
                let _this = this;
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    let para = {id: row.id};
                    removeMedia(para).then((res) => {
                        this.listLoading = false;
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getMedias();
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
                });
                this.editMediaVisible = true;
                this.editMedia = Object.assign({}, row);

            },
            //显示新增界面
            handleAdd: function () {
                this.hospitals = []
                getHospitalList().then((res) => {
                    this.hospitals = this.hospitals.concat(res.data);
                });
                this.addMediaVisible = true;
                this.addMedia = {
                    name: '',
                    hospital_id: '',
                    keyword: '',
                    description: '',
                    status: 1,
                };
            },
            //编辑
            editSubmit: function () {
                this.$refs.editMedia.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            let _this = this;
                            this.editLoading = true;
                            let para = Object.assign({}, this.editMedia);
                            editMedia(para).then((res) => {
                                console.log(res)
                                this.editLoading = false;
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['editMedia'].resetFields();
                                this.editMediaVisible = false;
                                this.getMedias();
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
                this.$refs.addMedia.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            let _this = this;
                            this.addLoading = true;
                            let para = Object.assign({}, this.addMedia);
                            console.log(para);
                            addMedia(para).then((res) => {
                                console.log(res)
                                this.addLoading = false;
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['addMedia'].resetFields();
                                this.addMediaVisible = false;
                                this.getMedias();
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
                    batchRemoveMedia(para).then((res) => {
                        this.listLoading = false;
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getMedias();
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
            this.getMedias();
        }
    }

</script>

<style scoped>
   
</style>