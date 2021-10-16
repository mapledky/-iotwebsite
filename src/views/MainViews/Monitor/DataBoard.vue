<template>
	<div>
		<el-breadcrumb separator-class="el-icon-arrow-right" style="height: 4%">
			<el-breadcrumb-item>首页</el-breadcrumb-item>
			<el-breadcrumb-item>监控运维</el-breadcrumb-item>
			<el-breadcrumb-item>仪表盘</el-breadcrumb-item>
			<span style="display: flex;flex-direction: row;">
				<div style="font-weight: 700; color: #000000; display: flex; flex-direction: row;" @click="goBack"> 设备列表
				</div>
				<!-- 设备列表 -->
				<i class="el-icon-arrow-right" style="color: #9fa0a3;"></i>
			</span>
			<el-breadcrumb-item>数据查看</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="workspace">
			<div class="title-bar">
				<div v-if="device">{{ device.sensor_name }}</div>
				<div style="display: flex">
					<div style="margin-right: 5px">
						<el-select size="small" placeholder="请选择日期" v-model="value" @change="getChange">
							<el-option v-for="(item, index) in dateOptions" :key="index" :label="item.label"
								:value="item.value"></el-option>
						</el-select>
					</div>
					<div>
						<el-select size="small" v-model="val" @change="getType" placeholder="请选择日期">
							<el-option v-for="(item, index) in datatype" :key="index" :label="item.label"
								:value="item.value"></el-option>
						</el-select>
					</div>
				</div>
			</div>
			<div class="scrollbox">
				<el-scrollbar style="height: 100%; width: 100%">
					<div class="data-board">
						<div class="chartbox">
							<div class="chart-container">
								<div id="linechart1"
									style="width: 49%; height: 400px; border: 1px solid #aaaaaa; border-radius: 5px">
								</div>
								<div id="linechart2"
									style="width: 49%; height: 400px; border: 1px solid #aaaaaa; border-radius: 5px">
								</div>
							</div>
							<div style="border: 1px solid #aaaaaa; color: black; border-radius: 5px; height: 300px">
								<el-table :data="chartData.slice((currentPage - 1) * pagesize, currentPage * pagesize)"
									height="250" style="width: 100%">
									<el-table-column label="Time" prop="name"></el-table-column>
									<el-table-column label="数值" prop="value[1]"></el-table-column>
								</el-table>
								<div
									style="width: 100%; height: 50px; display: flex; justify-content: center; align-items: center">
									<el-pagination background layout="prev, pager, next" :total="chartData.length"
										:page-size="pagesize" :current-page="currentPage"
										@current-change="handleChange"></el-pagination>
								</div>
							</div>
						</div>
					</div>
				</el-scrollbar>
			</div>
		</div>
	</div>
</template>

<script>
	import Cookies from 'js-cookie'
	import axios from 'axios'
	import mqtt from 'mqtt'

	String.prototype.replaceAll = function(s1, s2) {
		return this.replace(new RegExp(s1, 'gm'), s2)
	}

	export default {
		data() {
			return {
				device: '',
				user_id: '',
				token: '',
				password: '',
				company_id: '',
				device_id: '',
				fetchdata: [],
				dateOptions: [],
				datatype: [],
				value: '',
				val: '',
				chartData: [],
				chartData2: [],
				newchartData: [],
				data: [],
				msg: '',
				currentPage: 1,
				pagesize: 10,
				length: '',
			}
		},
		created() {
			this.getDateArray()
			this.getDataType()
			this.getRouteData()
			this.getCookieData()
			this.fetchDeviceData()
			this.getMqtt()
			//this.length = this.sliceDataArray('2021-08-28').length
		},
		watch: {
			msg: {
				deep: true,
				handler(newval) {
					const that = this
					that.fetchdata.push(newval)
					//数据处理
					for (var j = 0; j < that.fetchdata.length; j++) {
						delete that.fetchdata[j].company_id
						delete that.fetchdata[j].sensor_id
						delete that.fetchdata[j].device_id
					}

					var date = that.getBeforeDate(0)
					if (that.value === date) {
						var chartData = that.sliceDataArray(date)
						var type = chartData[0].data_format[0].name
						var count
						for (var k = 0; k < chartData[0].data_format.length; k++) {
							if (chartData[0].data_format[k].name === type) {
								count = k
							}
						}
						var chartdata1 = []
						for (var h = 0; h < chartData.length; h++) {
							var b = {
								name: '',
								value: []
							}
							b.name = chartData[h].time
							b.value.push(chartData[h].time)
							b.value.push(parseInt(chartData[h].data[count]))
							chartdata1.push(b)
						}
						var chartData2 = chartdata1.sort(function(a, b) {
							return a.name > b.name ? 1 : -1
						})
						that.chartData = chartData2
						var chartdata3 = []
						var a = 0
						var max = that.chartData[0].value[1]
						var min = that.chartData[0].value[1]
						for (var p = 0; p < that.chartData.length; p++) {
							a = a + that.chartData[p].value[1]
							if (max < that.chartData[p].value[1]) {
								max = that.chartData[p].value[1]
							}
							if (min > that.chartData[p].value[1]) {
								min = that.chartData[p].value[1]
							}
						}
						a = a / that.chartData.length
						a = a.toFixed(2)
						chartdata3.push(a)
						chartdata3.push(max)
						chartdata3.push(min)
						that.newchartData = chartdata3
					}
				},
			},
			chartData: {
				deep: true,
				handler() {
					this.$nextTick(() => {
						setTimeout(() => {
							// setTimeout
							this.drawChart('linechart1')
						}, 300)
					})
				},
			},
			newchartData: {
				deep: true,
				handler() {
					this.$nextTick(() => {
						setTimeout(() => {
							// setTimeout
							this.drawChart2('linechart2')
						}, 300)
					})
				},
			},
		},
		methods: {
			goBack() {
				this.$router.go(-1)
			},
			handleChange(val) {
				// eslint-disable-next-line no-console
				console.log(val)
				this.currentPage = val
			},
			//获取用户信息
			getCookieData() {
				const that = this
				that.user_id = Cookies.get('user_id')
				that.token = Cookies.get('token')
				that.company_id = Cookies.get('company_id')
			},

			//获取路由信息
			getRouteData() {
				const that = this
				var new_device = decodeURIComponent(that.$route.query.device)
				that.device = JSON.parse(new_device)
				// eslint-disable-next-line no-console
				console.log(that.device)
			},

			//获取时间选择器
			getBeforeDate(n) {
				var d = new Date()
				var year = d.getFullYear()
				var mon = d.getMonth() + 1
				var day = d.getDate()
				if (day <= n) {
					if (mon > 1) {
						mon = mon - 1
					} else {
						year = year - 1
						mon = 12
					}
				}
				d.setDate(d.getDate() - n)
				year = d.getFullYear()
				mon = d.getMonth() + 1
				day = d.getDate()
				var s = year + '-' + (mon < 10 ? '0' + mon : mon) + '-' + (day < 10 ? '0' + day : day)
				return s
				// eslint-disable-next-line no-console
				//console.log(s)
			},
			getDateArray() {
				const that = this
				for (var i = 0; i < 5; i++) {
					var a = {}
					a.value = that.getBeforeDate(i)
					a.label = that.getBeforeDate(i)
					that.dateOptions.push(a)
				}
				that.value = that.dateOptions[0].value
				// eslint-disable-next-line no-console
				console.log(that.dateOptions)
			},

			//获取数据类型选择器
			getDataType() {
				const that = this
				var new_device = decodeURIComponent(that.$route.query.device)
				var device1 = JSON.parse(new_device)
				for (var i = 0; i < device1.data_format.length; i++) {
					var a = {}
					a.value = device1.data_format[i].name
					a.label = device1.data_format[i].name
					that.datatype[i] = a
				}
				that.val = that.datatype[0].value
				// eslint-disable-next-line no-console
				console.log(that.datatype)
			},

			//时间转换
			getYMDHMS(timestamp) {
				let time = new Date(timestamp)
				let year = time.getFullYear()
				let month = time.getMonth() + 1
				let date = time.getDate()
				let hours = time.getHours()
				let minute = time.getMinutes()
				let second = time.getSeconds()

				if (month < 10) {
					month = '0' + month
				}
				if (date < 10) {
					date = '0' + date
				}
				if (hours < 10) {
					hours = '0' + hours
				}
				if (minute < 10) {
					minute = '0' + minute
				}
				if (second < 10) {
					second = '0' + second
				}
				return year + '-' + month + '-' + date + ' ' + hours + ':' + minute + ':' + second
			},

			//连接mqtt
			getMqtt() {
				const that = this
				const user_id = Cookies.get('user_id')
				const password = Cookies.get('password')
				const company_id = Cookies.get('company_id')
				// var new_device = decodeURIComponent(that.$route.query.device)
				// const device2 = JSON.parse(new_device)
				const options = {
					// 超时时间
					connectTimeout: 4000,
					// 认证信息
					clientId: user_id,
					username: user_id,
					password: password, //未加密的password
					// 心跳时间
					keepalive: 60,
					clean: true,
				}
				// WebSocket 连接字符串
				// const constWebSocket_URL='ws://localhost:8083/mqtt'
				// TCP/TLS 连接字符串，仅限 Node.js 环境
				const TCP_URL = 'wss://mqtt.maple.today:8084/mqtt'
				this.client = mqtt.connect(TCP_URL, options)
				var url = 'update' + '/' + company_id + '/device_' + that.device.sensor_id
				this.client.on('connect', () => {
					// eslint-disable-next-line no-console
					console.log('连接成功')
					this.client.subscribe(url, err => {
						// eslint-disable-next-line no-console
						console.log(err || '订阅成功')
					})
				})
				this.client.on('reconnect', error => {
					// eslint-disable-next-line no-console
					console.log('正在重连:', error)
					this.client.end()
					Cookies.remove('token')
					location.reload()
				})
				this.client.on('error', error => {
					// eslint-disable-next-line no-console
					console.log('连接失败:', error)
				})
				this.client.on('message', function(topic, payload) {
					//var requestId = topic.slice('update/1/1'.length)
					var messageData = JSON.parse(payload.toString())
					// eslint-disable-next-line no-console
					console.log('messageData:', messageData)
					var data = {
						data: [],
						data_format: [],
						sensor_id: '',
						time: '',
						device_id: '',
						company_id: ''
					}
					data.company_id = messageData.company_id
					data.sensor_id = messageData.sensor_id
					data.device_id = messageData.device_id
					data.data = messageData.data_upload
					data.data_format = that.device.data_format
					data.time = that.getYMDHMS(parseInt(messageData.timestamp))
					that.msg = data
				})
			},

			endMqtt() {
				this.client.end()
			},

			//获取设备所有数据
			fetchDeviceData() {
				const that = this
				var url = 'https://site.maple.today/IOTplatform/ServerMain?requestCode=027'
				axios
					.get(url, {
						params: {
							user_id: that.user_id,
							company_id: that.company_id,
							token: that.token,
							device_id: that.device.sensor_id,
						},
					})
					.then(function(response) {
						// eslint-disable-next-line no-console
						console.log(response.data)
						for (var i = 0; i < response.data.data.length; i++) {
							var fetchdata1 = response.data.data[i].data.replace('[', '')
							var fetchdata2 = fetchdata1.replace(']', '')
							var fetchdata3 = fetchdata2.replaceAll('"', '')
							response.data.data[i].data = fetchdata3.split(',')
							response.data.data[i].data_format = that.device.data_format
						}
						that.fetchdata = response.data.data

						//数据处理
						for (var j = 0; j < that.fetchdata.length; j++) {
							delete that.fetchdata[j].company_id
							delete that.fetchdata[j].sensor_id
							delete that.fetchdata[j].device_id
						}

						var date = that.getBeforeDate(0)
						var chartData = that.sliceDataArray(date)
						var type = chartData[0].data_format[0].name
						var count
						for (var k = 0; k < chartData[0].data_format.length; k++) {
							if (chartData[0].data_format[k].name === type) {
								count = k
							}
						}
						var chartdata1 = []
						for (var h = 0; h < chartData.length; h++) {
							var b = {
								name: '',
								value: []
							}
							b.name = chartData[h].time
							b.value.push(chartData[h].time)
							b.value.push(parseInt(chartData[h].data[count]))
							chartdata1.push(b)
						}
						that.chartData = chartdata1.sort(function(a, b) {
							return a.name > b.name ? 1 : -1
						})

						var chartdata3 = []
						var a = 0
						var max = that.chartData[0].value[1]
						var min = that.chartData[0].value[1]
						for (var p = 0; p < that.chartData.length; p++) {
							a = a + that.chartData[p].value[1]
							if (max < that.chartData[p].value[1]) {
								max = that.chartData[p].value[1]
							}
							if (min > that.chartData[p].value[1]) {
								min = that.chartData[p].value[1]
							}
						}
						a = a / that.chartData.length
						a = a.toFixed(2)
						chartdata3.push(a)
						chartdata3.push(max)
						chartdata3.push(min)
						that.newchartData = chartdata3
					})
					.catch(function(error) {
						// eslint-disable-next-line no-console
						console.log(error)
					})
			},

			//根据日期截取数据
			sliceDataArray(chosendate) {
				const that = this
				var chartData = []
				for (var i = 0; i < that.fetchdata.length; i++) {
					var str = that.fetchdata[i].time.slice(0, 10)
					if (str === chosendate) {
						chartData.push(that.fetchdata[i])
					}
				}
				return chartData
			},

			//日期选择
			getChange(val) {
				const that = this
				that.value = val
				var val1 = val
				// var date = that.getBeforeDate(0)
				// if (val1 !== date) {
				var chartData = that.sliceDataArray(val1)
				that.length = chartData.length
				if (that.length === 0) {
					that.chartData = []
					that.newchartData = []
				}

				var count
				for (var k = 0; k < chartData[0].data_format.length; k++) {
					if (chartData[0].data_format[k].name === that.val) {
						count = k
					}
				}
				var chartdata1 = []
				for (var h = 0; h < chartData.length; h++) {
					var b = {
						name: '',
						value: []
					}
					b.name = chartData[h].time
					b.value.push(chartData[h].time)
					b.value.push(parseInt(chartData[h].data[count]))
					chartdata1.push(b)
				}
				that.chartData = chartdata1.sort(function(a, b) {
					return a.name > b.name ? 1 : -1
				})
				that.chartData2 = chartdata1.sort(function(a, b) {
					return a.name > b.name ? 1 : -1
				})
				var chartdata3 = []
				var a = 0
				var max = that.chartData[0].value[1]
				var min = that.chartData[0].value[1]
				for (var p = 0; p < that.chartData.length; p++) {
					a = a + that.chartData[p].value[1]
					if (max < that.chartData[p].value[1]) {
						max = that.chartData[p].value[1]
					}
					if (min > that.chartData[p].value[1]) {
						min = that.chartData[p].value[1]
					}
				}
				a = a / that.chartData.length
				a = a.toFixed(2)
				chartdata3.push(a)
				chartdata3.push(max)
				chartdata3.push(min)
				that.newchartData = chartdata3

				// }
				// if (val1 === date) {
				// }
			},

			//数据类型选择
			getType(val) {
				const that = this
				that.val = val
				var chartData = that.sliceDataArray(that.value)
				var type = val
				var count
				for (var k = 0; k < chartData[0].data_format.length; k++) {
					if (chartData[0].data_format[k].name === type) {
						count = k
					}
				}
				var chartdata1 = []
				for (var h = 0; h < chartData.length; h++) {
					var b = {
						name: '',
						value: []
					}
					b.name = chartData[h].time
					b.value.push(chartData[h].time)
					b.value.push(parseInt(chartData[h].data[count]))
					chartdata1.push(b)
				}
				that.chartData = chartdata1.sort(function(a, b) {
					return a.name > b.name ? 1 : -1
				})
				that.chartData2 = chartdata1.sort(function(a, b) {
					return a.name > b.name ? 1 : -1
				})
				var chartdata3 = []
				var a = 0
				var max = that.chartData[0].value[1]
				var min = that.chartData[0].value[1]
				for (var p = 0; p < that.chartData.length; p++) {
					a = a + that.chartData[p].value[1]
					if (max < that.chartData[p].value[1]) {
						max = that.chartData[p].value[1]
					}
					if (min > that.chartData[p].value[1]) {
						min = that.chartData[p].value[1]
					}
				}
				a = a / that.chartData.length
				a = a.toFixed(2)
				chartdata3.push(a)
				chartdata3.push(max)
				chartdata3.push(min)
				that.newchartData = chartdata3
			},

			//画图
			drawChart(name) {
				var myChart = this.$echarts.init(document.getElementById(name))
				var data = this.chartData

				const option = {
					title: {},
					tooltip: {
						trigger: 'axis',
						formatter: function(params) {
							params = params[0]
							var date = new Date(params.name)
							var hour = date.getHours()
							var minutes = date.getMinutes()
							var seconds = date.getSeconds()
							if (hour < 10) {
								hour = '0' + hour
							}
							if (minutes < 10) {
								minutes = '0' + minutes
							}
							if (seconds < 10) {
								seconds = '0' + seconds
							}
							var dateStr = hour + ':' + minutes + ':' + seconds
							return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + '/' +
								dateStr + ' - ' + params.value[1]
						},
						axisPointer: {
							animation: false,
						},
					},
					xAxis: {
						type: 'time',
						splitLine: {
							show: false,
						},
					},
					yAxis: {
						type: 'value',
						boundaryGap: [0, '100%'],

						axisLine: {
							show: true, //这里的show用于设置是否显示y轴那一条线 默认为true
							lineStyle: {
								//lineStyle里面写y轴那一条线的样式
								width: 1, //轴线的粗细 我写的是2 最小为0，值为0的时候线隐藏
							},
						},
					},
					series: [{
						type: 'line',
						showSymbol: false,
						areaStyle: {},
						hoverAnimation: false,
						data: data,
					}, ],
					dataZoom: [{
							type: 'inside',
							start: 0,
							end: 100,
						},
						{
							start: 0,
							end: 100,
						},
					],
				}

				myChart.setOption(option)

				window.addEventListener('resize', function() {
					if (myChart) {
						// 防止拉动窗口时，resize报错
						myChart.resize()
					}
				})
			},
			drawChart2(name) {
				var myChart = this.$echarts.init(document.getElementById(name))

				const option = {
					tooltip: {},
					xAxis: {
						type: 'category',
						data: ['均值', '极大值', '极小值'],
					},
					yAxis: {
						type: 'value',
					},

					series: [{
						data: this.newchartData,
						type: 'bar',
						// 实现数字展示在柱状图
						itemStyle: {
							normal: {
								label: {
									show: true, //开启显示
									position: 'top', //在上方显示
									textStyle: {
										//数值样式
										color: 'black',
										fontSize: 16,
									},
								},
							},
						},
					}, ],
				}
				myChart.setOption(option)

				window.addEventListener('resize', function() {
					if (myChart) {
						// 防止拉动窗口时，resize报错
						myChart.resize()
					}
				})
			},
		},
		mounted() {
			//this.getMqtt()
			this.$nextTick(() => {
				setTimeout(() => {
					// setTimeout
					this.drawChart('linechart1')
					this.drawChart2('linechart2')
				}, 300)
			})
		},
		beforeDestroy() {
			this.endMqtt()
		},
	}
</script>

<style scoped>
	.workspace {
		width: 100%;
		height: 96%;
		background: rgb(225, 243, 243);
		border: black;
		border-width: 1px;
		border-style: solid;
	}

	.scrollbox {
		height: 100%;
		width: 100%;
	}

	.data-board {
		margin-top: 15px;
		height: 800px;
		width: 98%;
		margin-left: 1%;
		margin-right: 1%;
		background: white;
	}

	.mybox {
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: space-around;
	}

	.title-bar {
		height: 60px;
		line-height: 60px;
		background: white;
		padding-left: 1%;
		padding-right: 1%;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.titleBox {
		display: flex;
		flex-direction: row;
	}

	.titleitem {
		flex: 1;
		height: 50px;
		line-height: 50px;
		text-align: center;
		font-size: 20px;
		font-weight: bold;
	}

	.card-container {
		display: flex;
		margin-top: 20px;
		width: 96%;
		margin-left: 2%;
	}

	.card-item {
		width: 200px;
		height: 60px;
		border: 1px solid black;
		border-radius: 5px;
		background: rgb(78, 124, 224);
		display: flex;
		align-items: center;
	}

	.chartbox {
		width: 98%;
		margin-top: 10px;
		margin-left: 1%;
		margin-right: 1%;
		background: white;
		height: 700px;
	}

	.chart-container {
		height: 410px;
		padding-top: 10px;
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: space-around;
	}

	.el-scrollbar .el-scrollbar__wrap {
		overflow-x: hidden;
	}
</style>
