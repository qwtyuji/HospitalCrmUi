import axios from "axios";

axios.defaults.baseURL = 'http://hospitalcrm.dev/api';
axios.defaults.headers.common['Authorization'] = 'Bearer ' + sessionStorage.getItem('access_token');
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
//获取用户信息
export const getUserInfo = params => {
    return axios.get(`/userinfo`, {params: params});
};
//获取用户权限
export const getUserAuth = params => {
    return axios.get(`/userauth`, {params: params});
};
export const requestLogin = params => {
    return axios.post(`/user/login`, params).then(res => res.data);
};
export const getUserList = params => {
    return axios.get(`/user/list`, {params: params});
};
//用户管理
export const getUserListPage = params => {
    return axios.get(`/user`, {params: params});
};
//用户管理
export const removeUser = params => {
    return axios.get(`/user/remove`, {params: params});
};
export const batchRemoveUser = params => {
    return axios.get(`/user/batchremove`, {params: params});
};
export const addUser = params => {
    return axios.post(`/user/store`, params);
};
export const editUser = params => {
    return axios.post(`/user/update`, params);
};
export const checkNameApi = params => {
    return axios.get(`/checkusername`, {params: params});
};
export const checkEmailApi = params => {
    return axios.get(`/checkuseremail`, {params: params});
};


//医院管理
export const getHospitalListPage = params => {
    return axios.get(`/hospital`, {params: params});
};
export const getHospitalList = params => {
    return axios.get(`/hospital/list`, {params: params});
};
export const getHospitalGroup = params => {
    return axios.get(`/hospitalgroup`, {params: params});
};
export const removeHospital = params => {
    return axios.get(`/hospital/remove`, {params: params});
};
export const batchRemoveHospital = params => {
    return axios.get(`/hospital/batchremove`, {params: params});
};
export const addHospital = params => {
    return axios.post(`/hospital/store`, params);
};
export const editHospital = params => {
    return axios.post(`/hospital/update`, params);
};
export const checkHospitalNameApi = params => {
    return axios.get(`/checkhospitalname`, {params: params});
};

//科室管理
export const getDepartmentListPage = params => {
    return axios.get(`/department`, {params: params});
};
export const removeDepartment = params => {
    return axios.get(`/department/remove`, {params: params});
};
export const batchRemoveDepartment = params => {
    return axios.get(`/department/batchremove`, {params: params});
};
export const addDepartment = params => {
    return axios.post(`/department/store`, params);
};
export const editDepartment = params => {
    return axios.post(`/department/update`, params);
};
export const checkDepartmentNameApi = params => {
    return axios.get(`/checkdepartmentname`, {params: params});
};

//医生管理
export const getDoctorListPage = params => {
    return axios.get(`/doctor`, {params: params});
};
export const getHospitalDepartment = params => {
    return axios.get(`/hospitaldepartment`, {params: params});
};
export const removeDoctor = params => {
    return axios.get(`/doctor/remove`, {params: params});
};
export const batchRemoveDoctor = params => {
    return axios.get(`/doctor/batchremove`, {params: params});
};
export const addDoctor = params => {
    return axios.post(`/doctor/store`, params);
};
export const editDoctor = params => {
    return axios.post(`/doctor/update`, params);
};
export const checkDoctorNameApi = params => {
    return axios.get(`/checkdoctorname`, {params: params});
};

//媒体管理
export const getMediaListPage = params => {
    return axios.get(`/media`, {params: params});
};
export const removeMedia = params => {
    return axios.get(`/media/remove`, {params: params});
};
export const batchRemoveMedia = params => {
    return axios.get(`/media/batchremove`, {params: params});
};
export const addMedia = params => {
    return axios.post(`/media/store`, params);
};
export const editMedia = params => {
    return axios.post(`/media/update`, params);
};
export const checkMediaNameApi = params => {
    return axios.get(`/checkmedianame`, {params: params});
};

//疾病管理
export const getDiseaseListPage = params => {
    return axios.get(`/disease`, {params: params});
};
export const getDiseaseList = params => {
    return axios.get(`/disease/list`, {params: params});
};
export const removeDisease = params => {
    return axios.get(`/disease/remove`, {params: params});
};
export const batchRemoveDisease = params => {
    return axios.get(`/disease/batchremove`, {params: params});
};
export const addDisease = params => {
    return axios.post(`/disease/store`, params);
};
export const editDisease = params => {
    return axios.post(`/disease/update`, params);
};
export const checkDiseaseNameApi = params => {
    return axios.get(`/checkdiseasename`, {params: params});
};

//预约管理
export const getPatientListPage = params => {
    return axios.get(`/patient`, {params: params});
};

export const getPatientMedia = params => {
    return axios.get(`/patient/medialist`, {params: params});
};
export const getPatientDepartment = params => {
    return axios.get(`/patient/departmentlist`, {params: params});
};
export const getPatientDisease = params => {
    return axios.get(`/patient/diseaselist`, {params: params});
};
export const getPatientDoctor = params => {
    return axios.get(`/patient/doctorlist`, {params: params});
};

export const removePatient = params => {
    return axios.get(`/patient/remove`, {params: params});
};
export const batchRemovePatient = params => {
    return axios.get(`/patient/batchremove`, {params: params});
};
export const addPatient = params => {
    return axios.post(`/patient/store`, params);
};
export const editPatient = params => {
    return axios.post(`/patient/update`, params);
};
export const checkPatientNameApi = params => {
    return axios.get(`/checkpatientname`, {params: params});
};

export const savePatientColumns = params => {
    return axios.post(`/userset`, params);
};

//部门管理
export const getDepartListPage = params => {
    return axios.get(`/depart`, {params: params});
};
export const getDepartList = params => {
    return axios.get(`/depart/list`, {params: params});
};
export const removeDepart = params => {
    return axios.get(`/depart/remove`, {params: params});
};
export const batchRemoveDepart = params => {
    return axios.get(`/depart/batchremove`, {params: params});
};
export const addDepart = params => {
    return axios.post(`/depart/store`, params);
};
export const editDepart = params => {
    return axios.post(`/depart/update`, params);
};
export const checkDepartNameApi = params => {
    return axios.get(`/checkdepartname`, {params: params});
};

//角色管理
export const getRoleListPage = params => {
    return axios.get(`/role`, {params: params});
};
export const getAllPermissions = params => {
    return axios.get(`/getallpermissions`, {params: params});
};
export const removeRole = params => {
    return axios.get(`/role/remove`, {params: params});
};
export const batchRemoveRole = params => {
    return axios.get(`/role/batchremove`, {params: params});
};
export const addRole = params => {
    return axios.post(`/role/store`, params);
};
export const editRole = params => {
    return axios.post(`/role/update`, params);
};
export const checkRoleNameApi = params => {
    return axios.get(`/checkrolename`, {params: params});
};

//权限管理
export const getPermissionListPage = params => {
    return axios.get(`/permission`, {params: params});
};
export const removePermission = params => {
    return axios.get(`/permission/remove`, {params: params});
};
export const batchRemovePermission = params => {
    return axios.get(`/permission/batchremove`, {params: params});
};
export const addPermission = params => {
    return axios.post(`/permission/store`, params);
};
export const editPermission = params => {
    return axios.post(`/permission/update`, params);
};
export const checkPermissionNameApi = params => {
    return axios.get(`/checkpermissionname`, {params: params});
};


//日志管理
export const getLogListPage = params => {
    return axios.get(`/log`, {params: params});
};
export const removeLog = params => {
    return axios.get(`/log/remove`, {params: params});
};
export const batchRemoveLog = params => {
    return axios.get(`/log/batchremove`, {params: params});
};


export const errors = rs => {
    if (rs.response.status == '500') {
        return {message: '服务器错误', type: 'error', duration: '3000'};
    } else if (rs.response.status == '422') {
        let msg =''
        for(let v in rs.response.data){
           msg += rs.response.data[v].join()
        }
        return {message: '验证数据失败!!' + msg, type: 'error', duration: '3000'};
    } else if (rs.response.status == '403') {
        return {message: '没有权限', type: 'error', duration: '3000'};
    } else {
        return {message: rs.response.status, type: 'error', duration: '3000'};
    }
};
