<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.keyword" @keyup.enter.native="getPatients" v-on:blur="getPatients" placeholder="查询"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getPatients">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd" v-show="auth.view_patient">新增</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleTable">设置表头</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <!-- 设置表头-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;" v-show="tableColumns">
            <el-form inline>
                <el-form-item>
                    <el-checkbox-group v-model="tableColumnsChecked">
                        <el-checkbox :label="index" v-for="(item,index) in cols">{{item.label}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="saveTableColumns">保存</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <!--列表-->
        <el-table :data="patients" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
                  border :default-expand-all="false">
            <el-table-column width="30" type="expand" label="信息">
                <template scope="props">
                    <el-form label-position="left" class="table-expand" label-width="40px">
                        <el-form-item label="内容" style="margin-bottom: 5px;">
                            {{props.row.patient_content.content}}
                        </el-form-item>
                        <el-form-item label="回访" style="margin-bottom: 5px;">
                            <ul>
                                <li v-for="item in props.row.patient_callback">
                                    {{item}}
                                </li>
                            </ul>
                        </el-form-item>
                        <el-form-item label="备注" style="margin-bottom: 5px;">
                            <ul>
                                <li v-for="item in props.row.patient_remark">
                                    {{item}}
                                </li>
                            </ul>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column
                    v-for="col in newcols"
                    :prop="col.prop"
                    :label="col.label"
                    :sortable="true"
                    align="center"
                    :width="col.width"
                    :resizable="true">
            </el-table-column>
            <el-table-column label="操作" width="200" fixed="right">
                <template scope="scope">
                    <el-button type="success" size="small"
                               @click="handleShow(scope.$index, scope.row)"
                               v-show="auth.view_patient">查看
                    </el-button>
                    <el-button type="warning" size="small"
                               @click="handleEdit(scope.$index, scope.row)" v-show="auth.edit_patient">编辑
                    </el-button>
                    <el-button type="danger" size="small"
                               @click="handleDel(scope.$index, scope.row)" v-show="auth.delete_patient">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0" v-show="auth.delete_patient">批量删除</el-button>
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="15" :total="total" style="float:right;">
            </el-pagination>
        </el-col>
        <!--新增预约-->
        <el-dialog title="新增预约" v-model="addPatientVisible" :close-on-click-modal="false">
            <el-form :model="addPatient" label-width="80px" :rules="addPatientRules" ref="addPatient">
                <el-tabs type="border-card">
                    <el-tab-pane label="患者信息">
                        <el-form-item label="姓名" prop="name">
                            <el-input v-model="addPatient.name" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="电话" prop="phone">
                            <el-input v-model="addPatient.phone" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="年龄" prop="age">
                            <el-input v-model="addPatient.age" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="性别" prop="sex">
                            <el-radio-group v-model="addPatient.sex">
                                <el-radio label="0">男</el-radio>
                                <el-radio label="1">女</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="咨询内容" prop="content">
                            <el-input type="textarea" v-model="addPatient.content" placeholder="请填写咨询总结，不要放聊天记录"
                                      :autosize="{ minRows: 4, maxRows: 4}"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="聊天记录" prop="chatlog">
                            <el-input type="textarea" v-model="addPatient.chatlog" placeholder="可复制聊天记录备查"
                                      :autosize="{ minRows: 4, maxRows: 4}"
                            ></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="预约信息">
                        <el-form-item label="预约科室" prop="deparment_id">
                            <el-select v-model="addPatient.department_id" placeholder="选择科室" @change="handleDepartment">
                                <el-option :label="department.name" :value="department.id" v-for="department in departments" :key="department.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="预约医生" prop="doctor_id">
                            <el-select v-model="addPatient.doctor_id" placeholder="选择医生">
                                <el-option :label="doctor.name" :value="doctor.id" v-for="doctor in doctors" :key="doctor.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="疾病类型" prop="disease_id">
                            <el-select v-model="addPatient.disease_id" placeholder="选择疾病类型">
                                <el-option :label="disease.name" :value="disease.id" v-for="disease in diseases" :key="disease.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="媒体" prop="media_id">
                            <el-select v-model="addPatient.media_id" placeholder="选择媒体">
                                <el-option :label="media.name" :value="media.id" v-for="media in medias" :key="media.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="预约时间" prop="order_time">
                            <el-date-picker
                                    @change="handleAddOrderTime"
                                    v-model="addPatient.order_time"
                                    align="left"
                                    type="datetime"
                                    format="yyyy-MM-dd HH:mm"
                                    placeholder="选择日期"
                                    :picker-options="pickerOptions">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="备注" prop="remark">
                            <el-input type="textarea" v-model="addPatient.remark" :autosize="{ minRows: 4, maxRows: 4}"></el-input>
                        </el-form-item>
                    </el-tab-pane>

                </el-tabs>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addPatientVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
        <!--编辑预约-->
        <el-dialog title="编辑预约" v-model="editPatientVisible" :close-on-click-modal="false">
            <el-form :model="editPatient" label-width="80px" :rules="editPatientRules" ref="editPatient">
                <el-tabs type="border-card">
                    <el-tab-pane label="患者信息">
                        <el-form-item label="姓名" prop="name">
                            <el-input v-model="editPatient.name" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="电话" prop="phone">
                            <el-input v-model="editPatient.phone" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="年龄" prop="age">
                            <el-input v-model="editPatient.age" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="性别" prop="sex">
                            <el-radio-group v-model="editPatient.sex">
                                <el-radio :label="1">男</el-radio>
                                <el-radio :label="0">女</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="咨询内容" prop="content">
                            <el-input type="textarea" v-model="editPatient.content" placeholder="请填写咨询总结，不要放聊天记录"
                                      :autosize="{ minRows: 4, maxRows: 4}"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="聊天记录" prop="chatlog">
                            <el-input type="textarea" v-model="editPatient.chatlog" placeholder="可复制聊天记录备查"
                                      :autosize="{ minRows: 4, maxRows: 4}"
                            ></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="预约信息">
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="预约科室" prop="deparment_id">
                                    <el-select v-model="editPatient.department_id" placeholder="选择科室" @change="handleDepartment">
                                        <el-option :label="department.name" :value="department.id" v-for="department in departments"
                                                   :key="department.id"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="预约医生" prop="doctor_id">
                                    <el-select v-model="editPatient.doctor_id" placeholder="选择医生">
                                        <el-option :label="doctor.name" :value="doctor.id" v-for="doctor in doctors"
                                                   :key="doctor.id"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="疾病类型" prop="disease_id">
                                    <el-select v-model="editPatient.disease_id" placeholder="选择疾病类型">
                                        <el-option :label="disease.name" :value="disease.id" v-for="disease in diseases" :key="disease.id"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="媒体" prop="media_id">
                                    <el-select v-model="editPatient.media_id" placeholder="选择媒体">
                                        <el-option :label="thismedia.name" :value="thismedia.id" v-for="thismedia in medias"
                                                   :key="thismedia.id"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="预约时间" prop="order_time">
                                    <el-date-picker
                                            @change="handleEditOrderTime"
                                            v-model="editPatient.order_time"
                                            align="left"
                                            type="datetime"
                                            format="yyyy-MM-dd HH:mm"
                                            placeholder="选择日期"
                                            :picker-options="pickerOptions">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="预约状态" prop="status">
                                    <el-select v-model="editPatient.status" placeholder="状态">
                                        <el-option label="未到" :value="0">未到</el-option>
                                        <el-option label="已到" :value="1">已到</el-option>
                                        <el-option label="等待" :value="2">等待</el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-form-item label="备注记录">
                            <p v-for="item in editPatient.patient_remark" style="margin: 0;">{{item}}</p>
                        </el-form-item>
                        <el-form-item label="备注" prop="remark">
                            <el-input type="textarea" v-model="editPatient.remark" :autosize="{ minRows: 2, maxRows: 2}"></el-input>
                        </el-form-item>
                        <el-form-item label="回访记录">
                            <p v-for="item in editPatient.patient_callback" style="margin: 0;">{{item}}</p>
                        </el-form-item>
                        <el-form-item label="回访" prop="callback">
                            <el-input type="textarea" v-model="editPatient.callback" :autosize="{ minRows: 2, maxRows: 2}"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editPatientVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import {
        getPatientListPage,
        getPatientMedia,
        getPatientDepartment,
        getPatientDisease,
        getPatientDoctor,
        addPatient,
        editPatient,
        removePatient,
        batchRemovePatient,
        savePatientColumns,
        getUserInfo,
        errors
    } from '../api/api';
    export default {
        data() {

            return {
                auth: {
                    view_patient: false,
                    add_patient: false,
                    edit_patient: false,
                    delete_patient: false
                },
                defaultexpandall: true,
                tableColumns: false,
                tableColumnsChecked: [],
                newcols: [],
                cols: {
                    name: {prop: 'name', label: '名字'},
                    sex: {prop: 'sex_name', label: '性别',},
                    age: {prop: 'age', label: '年龄',},
                    phone: {prop: 'phone', label: '电话', width: '140'},
                    order_time: {prop: 'order_time', label: '预约时间', width: '180'},
                    erea: {prop: 'erea', label: '地区',},
                    media: {prop: 'media.name', label: '媒体',},
                    disease: {prop: 'disease.name', label: '疾病',},
                    department: {prop: 'department.name', label: '科室',},
                    depart: {prop: 'depart.name', label: '部门',},
                    doctor: {prop: 'doctor.name', label: '医生',},
                    user: {prop: 'user.name', label: '客服',},
                    status: {prop: 'status_name', label: '赴约',},
                    updated_at: {prop: 'updated_at', label: '添加时间', width: '180'},
                },
                departments: [],
                doctors: [],
                diseases: [],
                medias: [],
                filters: {
                    keyword: ''
                },
                patients: [],
                total: 0,
                page: 1,
                pickerOptions: {
                    shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                            picker.$emit('pick', new Date());
                        }
                    }, {
                        text: '明天',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() + 3600 * 1000 * 24);
                            picker.$emit('pick', date);
                        }
                    }, {
                        text: '后天',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() + 3600 * 1000 * 24 * 2);
                            picker.$emit('pick', date);
                        }
                    }, {
                        text: '一周后',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', date);
                        }
                    }]
                },
                listLoading: false,
                sels: [],//列表选中列
                showPatientVisible: false,//列表选中列
                editPatientVisible: false, //编辑界面是否显示
                editLoading: false,
                //显示页面数据
                showPatient: {
                    id: '',
                    name: '',
                    group: '',
                    description: '',
                    status: '',
                },
                //编辑界面数据
                editPatient: {
                    name: '',
                    sex: '',
                    age: '',
                    phone: '',
                    department_id: '',
                    doctor_id: '',
                    disease_id: '',
                    media_id: '',
                    order_time: '',
                    chatlog: '',
                    content: '',
                    remark: '',
                    callback: '',
                    status: '',
                },
                //新增界面数据
                addPatient: {
                    name: '',
                    sex: '',
                    age: '',
                    phone: '',
                    department_id: '',
                    doctor_id: '',
                    disease_id: '',
                    media_id: '',
                    order_time: '',
                    chatlog: '',
                    content: '',
                    remark: '',
                },
                editPatientRules: {
                    name: [
                        {required: true, message: '请输入名字', trigger: 'blur'},
                    ],

                },
                addPatientVisible: false,//新增界面是否显示
                addLoading: false,
                addPatientRules: {
                    name: [
                        {required: true, message: '请输入名字', trigger: 'blur'},
                    ],
                },
            }

        },
        computed: {
            hospital () {
                return this.$store.state.hospital
            }
        },
        watch: {
            hospital(){
                this.getPatients();
            }
        },
        methods: {
            handleAddOrderTime(value){
                this.addPatient.order_time = value;
            },
            handleEditOrderTime(value){
                this.editPatient.order_time = value;
            },
            handleTable(){
                this.tableColumns = !this.tableColumns;
            },
            saveTableColumns(){
                let para = {tableColumns: this.tableColumnsChecked}
                savePatientColumns(para).then((res) => {
                    if (res.status === 200) {
                        this.$router.go({name: 'patient'})
                    } else {
                        this.$message({
                            message: '修改失败',
                            type: 'error'
                        });
                    }

                });
            },
            changeTableColumns () {
                getUserInfo().then((res) => {
                    let defaltColumns = [];
                    for (let col in this.cols) {
                        defaltColumns.push(col)
                    }
                    let setColumns = JSON.parse(res.data.user_set.patient_column);
                    this.tableColumnsChecked = setColumns.length ? setColumns : defaltColumns;
                    let data = [];
                    for (let col in this.cols) {
                        if (this.tableColumnsChecked.indexOf(col) >= 0) {
                            data.push(this.cols[col])
                        }
                    }
                    this.newcols = data;
                })
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getPatients();
            },
            //获取列表
            getPatients() {
                let para = {
                    page: this.page,
                    keyword: this.filters.keyword,
                    hospital: this.hospital
                };
                let _this = this;
                this.listLoading = true;
                getPatientListPage(para).then((res) => {
                    this.total = res.data.total;
                    this.patients = res.data.data;
                    this.listLoading = false;
                }).catch((rs) => {
                    _this.listLoading = false;
                    _this.$message({
                        message: errors(rs).message,
                        type: errors(rs).type,
                        duration: errors(rs).duration
                    });
                });
                this.changeTableColumns();
            },
            //显示
            handleShow: function (index, row) {
                this.showPatientVisible = true;
                this.showPatient = Object.assign({}, row);
                this.showPatient.status = this.formatStatus(row);
            },
            //删除
            handleDel: function (index, row) {
                let _this = this;
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    let para = {id: row.id};
                    removePatient(para).then((res) => {
                        this.listLoading = false;
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getPatients();
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
                if (this.hospital == '') {
                    this.$message({
                        message: '请选择医院',
                        type: 'error'
                    });
                } else {
                    this.editPatientVisible = true;
                    this.editPatient = Object.assign({}, row);
                    console.log(this.editPatient)
                    this.editPatient.content = this.editPatient.patient_content.content ? this.editPatient.patient_content.content : '';
                    this.editPatient.chatlog = this.editPatient.patient_content.chat_record ? this.editPatient.patient_content.chat_record : '';
                    let para = {hospital: this.hospital}
                    getPatientMedia(para).then((res) => {
                        this.medias = [];
                        this.medias = this.medias.concat(res.data);
                    });
                    getPatientDepartment(para).then((res) => {
                        this.departments = [];
                        this.departments = this.departments.concat(res.data);
                    });
                    let department_id = {department_id: this.editPatient.department_id}
                    getPatientDoctor(department_id).then((res) => {
                        this.doctors = [];
                        this.doctors = this.doctors.concat(res.data);
                    });
                    getPatientDisease(department_id).then((res) => {
                        this.diseases = [];
                        this.diseases = this.diseases.concat(res.data);
                    });

                }
            },

            //显示新增界面
            handleAdd: function () {
                if (this.hospital == '') {
                    this.$message({
                        message: '请选择医院',
                        type: 'error'
                    });
                } else {
                    let para = {hospital: this.hospital}
                    getPatientMedia(para).then((res) => {
                        this.medias = [];
                        this.medias = this.medias.concat(res.data);
                    });
                    getPatientDepartment(para).then((res) => {
                        this.departments = [];
                        this.departments = this.departments.concat(res.data);
                    });

                    this.addPatientVisible = true;
                    this.addPatient = {
                        name: '',
                        sex: '',
                        age: '',
                        phone: '',
                        department_id: '',
                        doctor_id: '',
                        disease_id: '',
                        media_id: '',
                        order_time: '',
                        chatlog: '',
                        content: '',
                        remark: '',
                    };
                }
            },
            handleDepartment: function (value) {
                let para = {department_id: value}
                getPatientDoctor(para).then((res) => {
                    this.doctors = [];
                    this.doctors = this.doctors.concat(res.data);
                });
                getPatientDisease(para).then((res) => {
                    this.diseases = [];
                    this.diseases = this.diseases.concat(res.data);
                });
            },
            //编辑
            editSubmit: function () {
                this.$refs.editPatient.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            let _this = this;
                            this.editLoading = true;
                            let para = Object.assign({}, this.editPatient);
                            editPatient(para).then((res) => {
                                console.log(res)
                                this.editLoading = false;
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['editPatient'].resetFields();
                                this.editPatientVisible = false;
                                this.getPatients();
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
                this.$refs.addPatient.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            let _this = this;
                            this.addLoading = true;
                            let para = Object.assign({}, this.addPatient);
                            para.hospital_id = this.hospital;
                            addPatient(para).then((res) => {
                                console.log(res)
                                this.addLoading = false;
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['addPatient'].resetFields();
                                this.addPatientVisible = false;
                                this.getPatients();
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
                    batchRemovePatient(para).then((res) => {
                        this.listLoading = false;
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getPatients();
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
            this.getPatients();
        }
    }

</script>

<style scoped>
    .text {
        font-size: 14px;
    }

    .line { text-align: center; }

    .item {
        padding: 5px 0;
    }

    .table-expand div { width: 30%; float: left; }

    .table-expand ul { line-height: 24px; float: left; padding: 5px; margin: 0; }

    .table-expand ul li { list-style: none }

    .cell { padding-left: 5px; padding-right: 5px; }

</style>