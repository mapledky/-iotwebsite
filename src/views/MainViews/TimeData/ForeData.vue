<template>
    <div>
	<el-breadcrumb separator-class="el-icon-arrow-right" style="height: 4%;">
		<el-breadcrumb-item>首页</el-breadcrumb-item>
		<el-breadcrumb-item>时序数据库</el-breadcrumb-item>
		<el-breadcrumb-item>元数据</el-breadcrumb-item>
	</el-breadcrumb>
	<el-divider content-position="left">元数据</el-divider>
	<el-empty description="系统管理员无法使用该功能" v-if="this.isType3 === true"></el-empty>
	<el-scrollbar style="height: 95%; width: 100%;" v-if="this.isType3 === false">
		<div id="box" >
		</div>
	</el-scrollbar>
		
	</div>
</template>
<script>
	import mqtt from 'mqtt'
	import Cookie from 'js-cookie'
	import * as echarts from 'echarts'
	import axios from 'axios'
	import Qs from 'qs'

	export default {
		data() {
			return {
				ProductionsInfor: [],
				DeviceInfor: [],
				Device: [],
				isType3: false
			}
		},
		created() {
			if (Cookie.get('modal') === '3') {
				console.log("检测到为系统管理员")
				this.isType3 = true
			} else {
				console.log("检测为普通用户")
			}
		},
		mounted() {
			//mqtt
			// const user_id = Cookie.get('user_id')
			const user_id = Cookie.get('user_id')
			const token = Cookie.get('token')
			const company_id = Cookie.get('company_id')
			const password = Cookie.get('password')
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
			// const TCP_TLS_URL ='mqtts://localhost:8883'
			// console.log(options)
			this.client = mqtt.connect(TCP_URL, options)
			this.client.on('connect', () => {
				console.log('连接成功')
				this.client.subscribe('update/1/#', (err) => {
					console.log(err || '订阅成功')
				})
			})
			this.client.on('reconnect', (error) => {
				console.log('正在重连:', error)
				this.client.end()
				Cookie.remove("token")
				location.reload();
			})
			this.client.on('error', (error) => {
				console.log('连接失败:', error)
			})
			//时序数据库
			var data = [];
			var now = new Date();
			// var oneDay = 24 * 3600 * 1000;
			var value;
			var option = {
				title: {
					text: '未连接'
				},
				tooltip: {
					trigger: 'axis',
					formatter: function(params) {
						params = params[0];
						return params.name + ' Value: ' + params.value[1];
					},
					axisPointer: {
						animation: false
					}
				},
				xAxis: {
					// type: 'time',
					splitNumber: 30,
					// splitLine: {
					// 	show: false
					// }
					type: 'time',
					axisTick: {
						show: false
					},
					splitLine: {
						show: false
					},
					axisLabel: {
						show: false
					},
				},
				yAxis: {
					type: 'value',
					boundaryGap: [0, '100%'],
					splitLine: {
						show: false
					},
					axisLine: {
						show: true
					}
				},
				series: [{
					name: '模拟数据',
					type: 'line',
					showSymbol: false,
					hoverAnimation: false,
					data: data
				}]
			};
			// option && myChart.setOption(option);
			//产品列表获取
			var ProductionsURL = "https://site.maple.today/IOTplatform/ServerMain"
			var ProductionsData = {
				"requestCode": "005",
				"user_id": user_id,
				"token": token,
				"company_id": 1,
			}
			// console.log(Qs.stringify(ProductionsData));
			var AXIOS = axios.create({
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			});
			var _this = this;
			AXIOS.post(ProductionsURL, Qs.stringify(ProductionsData))
				.then(res => {
					// console.log("产品列表",res.data.data)
					_this.ProductionsInfor = res.data.data
					for (var i = 0; i < _this.ProductionsInfor.length; i++) {
						var DeviceURL = "https://site.maple.today/IOTplatform/ServerMain"
						var DeviceData = {
							"requestCode": "025",
							"user_id": user_id,
							"token": token,
							"company_id": 1,
							"product_id": _this.ProductionsInfor[i].product_id,
						}
						// console.log(Qs.stringify(DeviceData));
						AXIOS.post(DeviceURL, Qs.stringify(DeviceData)) //设备列表获取
							.then(res => {
								// console.log("设备列表"+ProductionsInfor[i].product_id,res)
								// DeviceInfor = res.data
								// console.log("this", res)
								_this.DeviceInfor = res.data.data;
								for (var j = 0; j < _this.DeviceInfor.length; j++) {
									var url = 'https://site.maple.today/IOTplatform/ServerMain';
									let postdata = {
										"requestCode": "027",
										"user_id": user_id,
										"token": token,
										"company_id": 1,
										"device_id": _this.DeviceInfor[j].sensor_id
									};
									// console.log(Qs.stringify(postdata))
									AXIOS.post(url, Qs.stringify(postdata)) //设备属性获取
										.then(res => {
											// console.log(Qs.parse(res.config.data).device_id)
											var temp = res.data.data
											var temperature_seriesData = []
											var humidity_seriesData = []
											var voltage_seriesData = []
											var electricity_seriesData = []
											var device_id = Qs.parse(res.config.data).device_id
											for (var k = 0; k < temp.length; k++) {
												// console.log(eval('(' + temp[k].data + ')'))
												var time = temp[k].time //时间
												//time 变换
												// time = time.replace(/-/g, '/')
												// console.log(time)
												var arr = eval('(' + temp[k].data + ')') //数据
												var temperature = {}; //{name:time变换,value:[valueName,value]}
												var humidity = {};
												var voltage = {};
												var electricity = {};
												for (var l = 0; l < arr.length; l++) {
													if (l === 0) {
														temperature = {
															name: time,
															value: [time, arr[l]]
														}
														temperature_seriesData.push(temperature)
													} else if (l === 1) {
														humidity = {
															name: time,
															value: [time, arr[l]]
														}
														humidity_seriesData.push(humidity)
													} else if (l === 2) {
														voltage = {
															name: time,
															value: [time, arr[l]]
														}
														voltage_seriesData.push(voltage)
													} else {
														electricity = {
															name: time,
															value: [time, arr[l]]
														}
														electricity_seriesData.push(electricity)
													}
												}
											} //1device infor
											temperature_seriesData.sort(compare)
											humidity_seriesData.sort(compare)
											voltage_seriesData.sort(compare)
											electricity_seriesData.sort(compare)
											_this.Device.push({
												device_id: device_id,
												value: {
													temperature: temperature_seriesData,
													humidity: humidity_seriesData,
													voltage: voltage_seriesData,
													electricity: electricity_seriesData,
												},
											})
											var maindiv = document.createElement("div")
											maindiv.id = "device_" + device_id
											maindiv.style = "width: 1200px;height: 400px;"
											document.getElementById("box").appendChild(maindiv) //创建设备的图表盒子
											var cdom = document.getElementById(("device_" + device_id));
											var mychart = echarts.init(cdom);
											var optiontemp = {
												title: {
													text: "device_" + device_id
												},
												legend: {
													data: ['Temperature', 'Humidity', 'Voltage',
														'Electricity'
													]
												},
												tooltip: {
													trigger: 'axis',
													formatter: function(params) {
														params = params[0];
														return params.name + ' Value: ' + params.value[
															1];
													},
													axisPointer: {
														animation: false
													}
												},
												// toolbox: {
												//     show : true,
												//     feature : {
												//         mark : {show: true},
												//         dataView : {show: true, readOnly: false},
												//         magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
												//         restore : {show: true},
												//         saveAsImage : {show: true}
												//     }
												// },
												// calculable : true,
												xAxis: {
													// type: 'time',
													// splitNumber: 30,
													// splitLine: {
													// 	show: false
													// }
													type: 'time',
													axisTick: {
														show: false
													},
													splitLine: {
														show: false
													},
													axisLabel: {
														show: false
													},
												},
												yAxis: {
													type: 'value',
													boundaryGap: [0, '100%'],
													splitLine: {
														show: false
													},
													axisLine: {
														show: true
													}
												},
												series: [{
													name: 'Temperature',
													type: 'line',
													showSymbol: false,
													hoverAnimation: false,
													data: _this.Device[_this.Device.length - 1]
														.value.temperature
												}, {
													name: 'Humidity',
													type: 'line',
													showSymbol: false,
													hoverAnimation: false,
													data: _this.Device[_this.Device.length - 1]
														.value.humidity
												}, {
													name: 'Voltage',
													type: 'line',
													showSymbol: false,
													hoverAnimation: false,
													data: _this.Device[_this.Device.length - 1]
														.value.voltage
												}, {
													name: 'Electricity',
													type: 'line',
													showSymbol: false,
													hoverAnimation: false,
													data: _this.Device[_this.Device.length - 1]
														.value.electricity
												}]
											};
											optiontemp && mychart.setOption(optiontemp);
										})
										.catch(error => console.log(error));

								}
							})
							.catch(error => console.log(error));
					}
				})
				.catch(error => console.log(error));

			this.client.on('message', function(topic, payload) {
				var requestId = topic.slice('update/1/#'.length),
					messageData = JSON.parse(payload.toString());
				console.log("1")
				console.log('messageData:', messageData)


				now = new Date();
				value = messageData.data_upload; //a array
				var temperature = {}; //{name:time变换,value:[valueName,value]}
				var humidity = {};
				var voltage = {};
				var electricity = {};
				var mqtttime = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate() + ' ' +
					(now.getHours() >= 10 ? now.getHours() : '0' + now.getHours()) + ':' +
					(now.getMinutes() >= 10 ? now.getMinutes() : '0' + now.getMinutes()) + ':' +
					(now.getSeconds() >= 10 ? now.getSeconds() : '0' + now.getSeconds());
				for (var mqttindex = 0; mqttindex < value.length; mqttindex++) {
					if (mqttindex === 0) {
						temperature = {
							name: mqtttime,
							value: [mqtttime, value[mqttindex]]
						}
					} else if (mqttindex === 1) {
						humidity = {
							name: mqtttime,
							value: [mqtttime, value[mqttindex]]
						}
					} else if (mqttindex === 2) {
						voltage = {
							name: mqtttime,
							value: [mqtttime, value[mqttindex]]
						}
					} else {
						electricity = {
							name: mqtttime,
							value: [mqtttime, value[mqttindex]]
						}
					}
				} //data
				var mqtt_device_id = messageData.device_id.replace("device_", "")
				var device_tag = false
				for (var Deviceindex = 0; Deviceindex < _this.Device.length; Deviceindex++) {
					if (mqtt_device_id === _this.Device[Deviceindex].device_id) {
						device_tag = true;
						var ChartDom = document.getElementById(("device_" + mqtt_device_id));
						var MyChart = echarts.init(ChartDom);
						_this.Device[Deviceindex].value.temperature.push(temperature)
						_this.Device[Deviceindex].value.humidity.push(humidity)
						_this.Device[Deviceindex].value.voltage.push(voltage)
						_this.Device[Deviceindex].value.electricity.push(electricity)
						option = {
							title: {
								text: "device_" + mqtt_device_id
							},
							legend: {
								data: ['Temperature', 'Humidity', 'Voltage', 'Electricity']
							},
							tooltip: {
								trigger: 'axis',
								formatter: function(params) {
									params = params[0];
									return params.name + ' Value: ' + params.value[1];
								},
								axisPointer: {
									animation: false
								}
							},
							// toolbox: {
							//     show : true,
							//     feature : {
							//         mark : {show: true},
							//         dataView : {show: true, readOnly: false},
							//         magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
							//         restore : {show: true},
							//         saveAsImage : {show: true}
							//     }
							// },
							// calculable : true,
							xAxis: {
								// type: 'time',
								// splitNumber: 30,
								// splitLine: {
								// 	show: false
								// }
								type: 'time',
								axisTick: {
									show: false
								},
								splitLine: {
									show: false
								},
								axisLabel: {
									show: false
								},
							},
							yAxis: {
								type: 'value',
								boundaryGap: [0, '100%'],
								splitLine: {
									show: false
								},
								axisLine: {
									show: true
								}
							},
							series: [{
								name: 'Temperature',
								type: 'line',
								showSymbol: false,
								hoverAnimation: false,
								data: _this.Device[Deviceindex].value.temperature
							}, {
								name: 'Humidity',
								type: 'line',
								showSymbol: false,
								hoverAnimation: false,
								data: _this.Device[Deviceindex].value.humidity
							}, {
								name: 'Voltage',
								type: 'line',
								showSymbol: false,
								hoverAnimation: false,
								data: _this.Device[Deviceindex].value.voltage
							}, {
								name: 'Electricity',
								type: 'line',
								showSymbol: false,
								hoverAnimation: false,
								data: _this.Device[Deviceindex].value.electricity
							}]
						};
						option && MyChart.setOption(option);
						break;
					}
				}
				if (device_tag === false) {
					var newdiv = document.createElement("div")
					newdiv.id = "device_" + mqtt_device_id
					newdiv.style = "width: 1200px;height: 400px;"
					document.getElementById("box").appendChild(newdiv) //创建设备的图表盒子
					var mqttChartDom = document.getElementById(("device_" + mqtt_device_id));
					var mqttMyChart = echarts.init(mqttChartDom); //创建新的chart

					var temperature_seriesData = []
					var humidity_seriesData = []
					var voltage_seriesData = []
					var electricity_seriesData = []
					temperature_seriesData.push(temperature)
					humidity_seriesData.push(humidity)
					voltage_seriesData.push(voltage)
					electricity_seriesData.push(electricity)

					_this.Device.push({
						device_id: mqtt_device_id,
						value: {
							temperature: temperature_seriesData,
							humidity: humidity_seriesData,
							voltage: voltage_seriesData,
							electricity: electricity_seriesData,
						},
					})

					var mqttoption = {
						title: {
							text: "device_" + mqtt_device_id
						},
						legend: {
							data: ['Temperature', 'Humidity', 'Voltage', 'Electricity']
						},
						tooltip: {
							trigger: 'axis',
							formatter: function(params) {
								params = params[0];
								return params.name + ' Value: ' + params.value[1];
							},
							axisPointer: {
								animation: false
							}
						},
						// toolbox: {
						//     show : true,
						//     feature : {
						//         mark : {show: true},
						//         dataView : {show: true, readOnly: false},
						//         magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
						//         restore : {show: true},
						//         saveAsImage : {show: true}
						//     }
						// },
						// calculable : true,
						xAxis: {
							// type: 'time',
							// splitNumber: 30,
							// splitLine: {
							// 	show: false
							// }
							type: 'time',
							axisTick: {
								show: false
							},
							splitLine: {
								show: false
							},
							axisLabel: {
								show: false
							},
						},
						yAxis: {
							type: 'value',
							boundaryGap: [0, '100%'],
							splitLine: {
								show: false
							},
							axisLine: {
								show: true
							}
						},
						series: [{
							name: 'Temperature',
							type: 'line',
							showSymbol: false,
							hoverAnimation: false,
							data: temperature_seriesData
						}, {
							name: 'Humidity',
							type: 'line',
							showSymbol: false,
							hoverAnimation: false,
							data: humidity_seriesData
						}, {
							name: 'Voltage',
							type: 'line',
							showSymbol: false,
							hoverAnimation: false,
							data: voltage_seriesData
						}, {
							name: 'Electricity',
							type: 'line',
							showSymbol: false,
							hoverAnimation: false,
							data: electricity_seriesData
						}]
					};
					mqttoption && mqttMyChart.setOption(mqttoption);
				}


			});

		},
		methods: {

		},
		beforeDestroy() {
			console.log("destroyed")
			this.client.end();
		},
	};

	function CompareDate(d1, d2) {
		return (((new Date(d1.replace(/-/g, "/"))) > (new Date(d2.replace(/-/g, "/")))));
	}

	function compare(obj1, obj2) {
		var d1 = obj1.name;
		var d2 = obj2.name;
		if ((((new Date(d1.replace(/-/g, "/"))) > (new Date(d2.replace(/-/g, "/")))))) {
			return -1;
		} else if ((((new Date(d2.replace(/-/g, "/"))) > (new Date(d1.replace(/-/g, "/")))))) {
			return 1;
		} else {
			return 0;
		}
	}
</script>
<style>
	.ForeData {}
</style>
