<template>
    <section>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-tabs v-model="access">
                    <el-tab-pane label="访问" name="first">
                        <div class="top">
                            {{hospital}}
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </el-col>
            <el-col :span="8">
                <el-tabs v-model="user">
                    <el-tab-pane label="用户" name="first">
                        <div class="top">
                            11111 个
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </el-col>
            <el-col :span="8">
                <el-tabs v-model="comment">
                    <el-tab-pane label="评论" name="first">
                        <div class="top">
                            11111 条
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </el-col>
        </el-row>
        <el-row class="toparticle">

            <el-tabs v-model="toparticle">
                <el-tab-pane label="最高访问文章" name="first">
                    <template>

                        <el-table :data="articles" highlight-current-row v-loading="listLoading" style="width: 100%;">
                            <el-table-column type="index" width="60">
                            </el-table-column>
                            <el-table-column prop="title" label="标题" sortable>
                            </el-table-column>
                            <el-table-column prop="category.name" label="分类" sortable>
                            </el-table-column>
                            <el-table-column prop="tag" label="标签" sortable :formatter="formatTags">
                            </el-table-column>
                            <el-table-column prop="click" label="点击" width="120" sortable>
                            </el-table-column>
                            <el-table-column prop="comment" label="评论" width="120" sortable>
                            </el-table-column>
                        </el-table>
                    </template>
                </el-tab-pane>
            </el-tabs>
        </el-row>


    </section>
</template>

<script>
    import {
        getTopArticle,
        errors
    } from '../api/api';
    export default {
        data(){
            return {
                access: 'first',
                user: 'first',
                comment: 'first',
                toparticle: 'first',
                listLoading: false,
                articles: [],
            }
        },
        computed: {
            hospital () {
                return this.$store.state.hospital
            }
        },
        watch:{
            hospital(){
                console.log('变化')
            }
        },
        methods: {
            getArticles() {
                let _this = this;
                this.listLoading = true;
                getTopArticle().then((res) => {
                    this.total = res.data.total;
                    this.articles = res.data.data;
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
            //状态转换
            formatStatus: function (row, column) {
                return row.status == '1' ? '启用' : row.status = '0' ? '禁用' : '未知';
            },
            //标签转换
            formatTags: function (row, column) {
                let tagsname = ''
                for (let v of row.tag) {
                    tagsname += v.name + ' '
                }
                return tagsname
            },
        },
        mounted() {

        }
    }

</script>

<style scoped>
    .toparticle {
        margin-top: 20px;
    }

    .top {
        font-size: 18px; color: green; border: 1px solid #D1E5DD; height: 80px; padding: 20px;
    }
</style>