<template>
	<section class="chart-container">
		<el-row>
            <el-col :span="24">
                <div id="gauge" style="width:100%;height: 400px"></div>
            </el-col>
			<el-col :span="12">
				<div id="chartColumn" style="width:100%; height:400px;"></div>
			</el-col>
			<el-col :span="12">
				<div id="chartBar" style="width:100%; height:400px;"></div>
			</el-col>
			<el-col :span="12">
				<div id="chartLine" style="width:100%; height:400px;"></div>
			</el-col>
			<el-col :span="12">
				<div id="chartPie" style="width:100%; height:400px;"></div>
			</el-col>
			<el-col :span="24">
				<a href="http://echarts.baidu.com/examples.html" target="_blank" style="float: right;">more>></a>
			</el-col>
		</el-row>
	</section>
</template>

<script>
    import echarts from 'echarts'

    export default {
        data() {
            return {
                chartColumn: null,
                chartBar: null,
                chartLine: null,
                chartPie: null,
                gauge:null,
            }
        },

        methods: {
            drawColumnChart() {
                this.chartColumn = echarts.init(document.getElementById('chartColumn'));
                this.chartColumn.setOption({
                    title: { text: 'Column Chart' },
                    tooltip: {},
                    xAxis: {
                        data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
                    },
                    yAxis: {},
                    series: [{
                        name: '销量',
                        type: 'bar',
                        data: [5, 20, 36, 10, 10, 20]
                    }]
                });
            },
            gaugeChart() {
                this.gauge = echarts.init(document.getElementById('gauge'));
                this.gauge.setOption({
                    backgroundColor: '#1b1b1b',
                    tooltip : {
                        formatter: "{a} <br/>{c} {b}"
                    },
                    toolbox: {
                        show : true,
                        feature : {
                            mark : {show: true},
                            restore : {show: true},
                            saveAsImage : {show: true}
                        }
                    },
                    series : [
                        {
                            name:'速度',
                            type:'gauge',
                            min:0,
                            max:220,
                            splitNumber:11,
                            radius: '60%',
                            axisLine: {            // 坐标轴线
                                lineStyle: {       // 属性lineStyle控制线条样式
                                    color: [[0.09, 'lime'],[0.82, '#1e90ff'],[1, '#ff4500']],
                                    width: 3,
                                    shadowColor : '#fff', //默认透明
                                    shadowBlur: 10
                                }
                            },
                            axisLabel: {            // 坐标轴小标记
                                textStyle: {       // 属性lineStyle控制线条样式
                                    fontWeight: 'bolder',
                                    color: '#fff',
                                    shadowColor : '#fff', //默认透明
                                    shadowBlur: 10
                                }
                            },
                            axisTick: {            // 坐标轴小标记
                                length :15,        // 属性length控制线长
                                lineStyle: {       // 属性lineStyle控制线条样式
                                    color: 'auto',
                                    shadowColor : '#fff', //默认透明
                                    shadowBlur: 10
                                }
                            },
                            splitLine: {           // 分隔线
                                length :25,         // 属性length控制线长
                                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                                    width:3,
                                    color: '#fff',
                                    shadowColor : '#fff', //默认透明
                                    shadowBlur: 10
                                }
                            },
                            pointer: {           // 分隔线
                                shadowColor : '#fff', //默认透明
                                shadowBlur: 5
                            },
                            title : {
                                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                    fontWeight: 'bolder',
                                    fontSize: 20,
                                    fontStyle: 'italic',
                                    color: '#fff',
                                    shadowColor : '#fff', //默认透明
                                    shadowBlur: 10
                                }
                            },
                            detail : {
                                backgroundColor: 'rgba(30,144,255,0.8)',
                                borderWidth: 1,
                                borderColor: '#fff',
                                shadowColor : '#fff', //默认透明
                                shadowBlur: 5,
                                offsetCenter: [0, '50%'],       // x, y，单位px
                                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                    fontWeight: 'bolder',
                                    color: '#fff'
                                }
                            },
                            data:[{value: 90, name: 'km/h'}]
                        },
                        {
                            name:'转速',
                            type:'gauge',
                            center : ['25%', '55%'],    // 默认全局居中
                            radius : '40%',
                            min:0,
                            max:7,
                            endAngle:45,
                            splitNumber:7,
                            axisLine: {            // 坐标轴线
                                lineStyle: {       // 属性lineStyle控制线条样式
                                    color: [[0.29, 'lime'],[0.86, '#1e90ff'],[1, '#ff4500']],
                                    width: 2,
                                    shadowColor : '#fff', //默认透明
                                    shadowBlur: 10
                                }
                            },
                            axisLabel: {            // 坐标轴小标记
                                textStyle: {       // 属性lineStyle控制线条样式
                                    fontWeight: 'bolder',
                                    color: '#fff',
                                    shadowColor : '#fff', //默认透明
                                    shadowBlur: 10
                                }
                            },
                            axisTick: {            // 坐标轴小标记
                                length :12,        // 属性length控制线长
                                lineStyle: {       // 属性lineStyle控制线条样式
                                    color: 'auto',
                                    shadowColor : '#fff', //默认透明
                                    shadowBlur: 10
                                }
                            },
                            splitLine: {           // 分隔线
                                length :20,         // 属性length控制线长
                                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                                    width:3,
                                    color: '#fff',
                                    shadowColor : '#fff', //默认透明
                                    shadowBlur: 10
                                }
                            },
                            pointer: {
                                width:5,
                                shadowColor : '#fff', //默认透明
                                shadowBlur: 5
                            },
                            title : {
                                offsetCenter: [0, '-30%'],       // x, y，单位px
                                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                    fontWeight: 'bolder',
                                    fontStyle: 'italic',
                                    color: '#fff',
                                    shadowColor : '#fff', //默认透明
                                    shadowBlur: 10
                                }
                            },
                            detail : {
                                //backgroundColor: 'rgba(30,144,255,0.8)',
                                // borderWidth: 1,
                                borderColor: '#fff',
                                shadowColor : '#fff', //默认透明
                                shadowBlur: 5,
                                width: 80,
                                height:30,
                                offsetCenter: [25, '20%'],       // x, y，单位px
                                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                    fontWeight: 'bolder',
                                    color: '#fff'
                                }
                            },
                            data:[{value: 1.5, name: 'x1000 r/min'}]
                        },
                        {
                            name:'油表',
                            type:'gauge',
                            center : ['75%', '50%'],    // 默认全局居中
                            radius : '40%',
                            min:0,
                            max:2,
                            startAngle:135,
                            endAngle:45,
                            splitNumber:2,
                            axisLine: {            // 坐标轴线
                                lineStyle: {       // 属性lineStyle控制线条样式
                                    color: [[0.2, 'lime'],[0.8, '#1e90ff'],[1, '#ff4500']],
                                    width: 2,
                                    shadowColor : '#fff', //默认透明
                                    shadowBlur: 10
                                }
                            },
                            axisTick: {            // 坐标轴小标记
                                length :12,        // 属性length控制线长
                                lineStyle: {       // 属性lineStyle控制线条样式
                                    color: 'auto',
                                    shadowColor : '#fff', //默认透明
                                    shadowBlur: 10
                                }
                            },
                            axisLabel: {
                                textStyle: {       // 属性lineStyle控制线条样式
                                    fontWeight: 'bolder',
                                    color: '#fff',
                                    shadowColor : '#fff', //默认透明
                                    shadowBlur: 10
                                },
                                formatter:function(v){
                                    switch (v + '') {
                                        case '0' : return 'E';
                                        case '1' : return 'Gas';
                                        case '2' : return 'F';
                                    }
                                }
                            },
                            splitLine: {           // 分隔线
                                length :15,         // 属性length控制线长
                                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                                    width:3,
                                    color: '#fff',
                                    shadowColor : '#fff', //默认透明
                                    shadowBlur: 10
                                }
                            },
                            pointer: {
                                width:2,
                                shadowColor : '#fff', //默认透明
                                shadowBlur: 5
                            },
                            title : {
                                show: false
                            },
                            detail : {
                                show: false
                            },
                            data:[{value: 0.5, name: 'gas'}]
                        },
                        {
                            name:'水表',
                            type:'gauge',
                            center : ['75%', '50%'],    // 默认全局居中
                            radius : '40%',
                            min:0,
                            max:2,
                            startAngle:315,
                            endAngle:225,
                            splitNumber:2,
                            axisLine: {            // 坐标轴线
                                lineStyle: {       // 属性lineStyle控制线条样式
                                    color: [[0.2, 'lime'],[0.8, '#1e90ff'],[1, '#ff4500']],
                                    width: 2,
                                    shadowColor : '#fff', //默认透明
                                    shadowBlur: 10
                                }
                            },
                            axisTick: {            // 坐标轴小标记
                                show: false
                            },
                            axisLabel: {
                                textStyle: {       // 属性lineStyle控制线条样式
                                    fontWeight: 'bolder',
                                    color: '#fff',
                                    shadowColor : '#fff', //默认透明
                                    shadowBlur: 10
                                },
                                formatter:function(v){
                                    switch (v + '') {
                                        case '0' : return 'H';
                                        case '1' : return 'Water';
                                        case '2' : return 'C';
                                    }
                                }
                            },
                            splitLine: {           // 分隔线
                                length :15,         // 属性length控制线长
                                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                                    width:3,
                                    color: '#fff',
                                    shadowColor : '#fff', //默认透明
                                    shadowBlur: 10
                                }
                            },
                            pointer: {
                                width:2,
                                shadowColor : '#fff', //默认透明
                                shadowBlur: 5
                            },
                            title : {
                                show: false
                            },
                            detail : {
                                show: false
                            },
                            data:[{value: 0.5, name: 'gas'}]
                        }
                    ]
                });
            },
            drawBarChart() {
                this.chartBar = echarts.init(document.getElementById('chartBar'));
                this.chartBar.setOption({
                    title: {
                        text: 'Bar Chart',
                        subtext: '数据来自网络'
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    legend: {
                        data: ['2011年', '2012年']
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'value',
                        boundaryGap: [0, 0.01]
                    },
                    yAxis: {
                        type: 'category',
                        data: ['巴西', '印尼', '美国', '印度', '中国', '世界人口(万)']
                    },
                    series: [
                        {
                            name: '2011年',
                            type: 'bar',
                            data: [18203, 23489, 29034, 104970, 131744, 630230]
                        },
                        {
                            name: '2012年',
                            type: 'bar',
                            data: [19325, 23438, 31000, 121594, 134141, 681807]
                        }
                    ]
                });
            },
            drawLineChart() {
                this.chartLine = echarts.init(document.getElementById('chartLine'));
                this.chartLine.setOption({
                    title: {
                        text: 'Line Chart'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['邮件营销', '联盟广告', '搜索引擎']
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            name: '邮件营销',
                            type: 'line',
                            stack: '总量',
                            data: [120, 132, 101, 134, 90, 230, 210]
                        },
                        {
                            name: '联盟广告',
                            type: 'line',
                            stack: '总量',
                            data: [220, 182, 191, 234, 290, 330, 310]
                        },
                        {
                            name: '搜索引擎',
                            type: 'line',
                            stack: '总量',
                            data: [820, 932, 901, 934, 1290, 1330, 1320]
                        }
                    ]
                });
            },
            drawPieChart() {
                this.chartPie = echarts.init(document.getElementById('chartPie'));
                this.chartPie.setOption({
                    title: {
                        text: 'Pie Chart',
                        subtext: '纯属虚构',
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
                    },
                    series: [
                        {
                            name: '访问来源',
                            type: 'pie',
                            radius: '55%',
                            center: ['50%', '60%'],
                            data: [
                                { value: 335, name: '直接访问' },
                                { value: 310, name: '邮件营销' },
                                { value: 234, name: '联盟广告' },
                                { value: 135, name: '视频广告' },
                                { value: 1548, name: '搜索引擎' }
                            ],
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                });
            },
            drawCharts() {
                this.gaugeChart()
                this.drawColumnChart()
                this.drawBarChart()
                this.drawLineChart()
                this.drawPieChart()
            },
        },

        mounted: function () {
            this.drawCharts()
        },
        updated: function () {
            this.drawCharts()
        }
    }
</script>

<style scoped>
	.chart-container {
		width: 100%;
		float: left;
	}
	/*.chart div {
        height: 400px;
        float: left;
    }*/

	.el-col {
		padding: 30px 20px;
	}
</style>
