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
<script src="https://unpkg.com/mqtt/dist/mqtt.min.js"></script>
<script>
	// import mqtt from 'mqtt'
	const mqtt = require('mqtt')
	import Cookie from 'js-cookie'
	import * as echarts from 'echarts'
	import axios from 'axios'
	import Qs from 'qs'
import { number } from 'echarts'

	export default {
		data() {
			return {
				ProductionsInfor: [],
				DeviceInfor: [],
				Device: [],
				isType3: false,
				DataList: {},
				product_list:[],
				device_list:[],
				// product_id:number,
				// device_id:number,
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
			var updatemess = "update/"+company_id+"/#";
			this.client = mqtt.connect(TCP_URL, options)
			this.client.on('connect', () => {
				console.log('连接成功')
				this.client.subscribe(updatemess, (err) => {
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
				"company_id": company_id,//测试为1，使用是为company_id
			}
			// console.log(Qs.stringify(ProductionsData));
			var AXIOS = axios.create({
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			});
			var _this = this;

			_this.DataList = {
				company_id:company_id,//测试为1，使用是为company_id
				product_list:[],
			}

			AXIOS.post(ProductionsURL, Qs.stringify(ProductionsData))
				.then(res => {
					console.log("产品列表",res.data.data)
					_this.ProductionsInfor = res.data.data

					for(var i = 0; i < _this.ProductionsInfor.length; i++){//data_format记录
						var format_arr =  []
						for(var j=0;j<_this.ProductionsInfor[i].data_format.length;j++){
							 format_arr.push({
								name:_this.ProductionsInfor[i].data_format[j].name,
								unit:_this.ProductionsInfor[i].data_format[j].unit,
							 })
						}
						// console.log("push",format_arr)
						_this.DataList.product_list.push({
							product_id:_this.ProductionsInfor[i].product_id,
							data_format:format_arr,
							device_list:[]
						})
					}
					// console.log("push",_this.DataList)
					for (var i = 0; i < _this.ProductionsInfor.length; i++) {
						var DeviceURL = "https://site.maple.today/IOTplatform/ServerMain"
						var DeviceData = {
							"requestCode": "025",
							"user_id": user_id,
							"token": token,
							"company_id": company_id,//测试为1，使用是为company_id
							"product_id": _this.ProductionsInfor[i].product_id,
						}
						// console.log(Qs.stringify(DeviceData));
						AXIOS.post(DeviceURL, Qs.stringify(DeviceData)) //设备列表获取
							.then(res => {
								console.log("设备列表",res)
								var config_data_product_id = Qs.parse(res.config.data).product_id//获取对应得product_id

								// console.log("config_data",config_data)
								// DeviceInfor = res.data
								_this.DeviceInfor = res.data.data;
								//查询这系列device是哪个product_id的
								var product_id_col = number;
								for(var i=0;i<_this.DataList.product_list.length;i++){
									if(_this.DataList.product_list[i].product_id===config_data_product_id){
										product_id_col = i;
										break;
									}
								}
								// console.log("product_id_col",product_id_col)

								for (var j = 0; j < _this.DeviceInfor.length; j++) {
									//获取device_id，通过config得product_id加入device_list
									_this.DataList.product_list[product_id_col].device_list.push({
										device_id:_this.DeviceInfor[j].sensor_id,
										data:[]
									})
									// console.log("push",_this.DataList)

									var url = 'https://site.maple.today/IOTplatform/ServerMain';
									let postdata = {
										"requestCode": "027",
										"user_id": user_id,
										"token": token,
										"company_id": company_id,
										"device_id": _this.DeviceInfor[j].sensor_id
									};
									// console.log(Qs.stringify(postdata))
									AXIOS.post(url, Qs.stringify(postdata)) //设备属性获取
										.then(res => {
											console.log("设备属性：",res.data.data)
											var temp = res.data.data

											var device_id = Qs.parse(res.config.data).device_id

											var temparr = [];
											var namedata = [];
											for(var i=0;i<_this.DataList.product_list.length;i++){
												for(var j=0;j<_this.DataList.product_list[i].device_list.length;j++){
													if(_this.DataList.product_list[i].device_list[j].device_id===device_id){
														for(var k=0;k<_this.DataList.product_list[i].data_format.length;k++){
															temparr.push([])
															namedata.push(_this.DataList.product_list[i].data_format[k].name)
														}
													}
												}
											}
																	
											for (var k = 0; k < temp.length; k++) {
												
												// console.log(eval('(' + temp[k].data + ')'))
												var time = temp[k].time //时间
												//time 变换
												// time = time.replace(/-/g, '/')
												// console.log(time)
												var arr = eval('(' + temp[k].data + ')') //数据
												if(arr.length!==namedata.length){
													continue;
												}
												for (var l = 0; l < arr.length; l++) {
													var temp_data = {
														name: time,
														value: [time, arr[l]]
													}
													temparr[l].push(temp_data)
												}
											} //1device infor
											// console.log("push",temparr)
											for(var i=0;i<temparr.length;i++){
												temparr[i].sort(compare)
											}
											// console.log("push",temparr)
											for(var i=0;i<_this.DataList.product_list.length;i++){
												for(var j=0;j<_this.DataList.product_list[i].device_list.length;j++){
													if(_this.DataList.product_list[i].device_list[j].device_id===device_id){
														_this.DataList.product_list[i].device_list[j].data = temparr
														// console.log("exchange!!!",temparr)
													}
												}
											}

											console.log("_this.DataList",_this.DataList)

											var maindiv = document.createElement("div")
											maindiv.id = "device_" + device_id
											maindiv.style = "width: 1200px;height: 400px;"
											document.getElementById("box").appendChild(maindiv) //创建设备的图表盒子
											var cdom = document.getElementById(("device_" + device_id));
											var mychart = echarts.init(cdom);

											//构建seriesData
											var seriesData = []
											for(var i=0;i<namedata.length;i++){
												seriesData.push({
													name: namedata[i],
													type: 'line',
													showSymbol: false,
													hoverAnimation: false,
													data: temparr[i]
												})
											}

											var optiontemp = {
												title: {
													text: "device_" + device_id
												},
												legend: {
													data: namedata
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
												series: seriesData
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
				console.log('messageData:', messageData)

				now = new Date();
				value = messageData.data_upload; //a array
				var mqtttime = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate() + ' ' +
					(now.getHours() >= 10 ? now.getHours() : '0' + now.getHours()) + ':' +
					(now.getMinutes() >= 10 ? now.getMinutes() : '0' + now.getMinutes()) + ':' +
					(now.getSeconds() >= 10 ? now.getSeconds() : '0' + now.getSeconds());
				
				var mess_sensorid = messageData.sensor_id; 
				var mess_companyid = messageData.company_id; 
				var i_index=-1,j_index=-1;
				for(var i=0;i<_this.DataList.product_list.length;i++){
					for(var j=0;j<_this.DataList.product_list[i].device_list.length;j++){
						if(_this.DataList.product_list[i].device_list[j].device_id===mess_sensorid){
							i_index = i;
							j_index = j
						}
					}
				}

				if(i_index===-1){
					return -1
				}
				else{
					for(var i=0;i<value.length;i++){
						var temp_data = {
							name: mqtttime,
							value: [mqtttime, value[i]]
						}
						_this.DataList.product_list[i_index].device_list[j_index].data[i].push(temp_data)
						_this.DataList.product_list[i_index].device_list[j_index].data[i].sort(compare)
					}
				}

				var namedata = []
				for(var i=0;i<_this.DataList.product_list[i_index].data_format.length;i++){
					namedata.push(_this.DataList.product_list[i_index].data_format[i].name)
				}

				var mqtt_device_id = "device_"+mess_sensorid
				var ChartDom = document.getElementById(("device_" + mess_sensorid));
				var MyChart = echarts.init(ChartDom);
				var seriesData = []
				for(var i=0;i<namedata.length;i++){
					seriesData.push({
						name: namedata[i],
						type: 'line',
						showSymbol: false,
						hoverAnimation: false,
						data: _this.DataList.product_list[i_index].device_list[j_index].data[i]
					})
				}
				option = {
					title: {
						text: "device_" + mess_sensorid
					},
					legend: {
						data: namedata
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
					series: seriesData
				};
				option && MyChart.setOption(option);
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
