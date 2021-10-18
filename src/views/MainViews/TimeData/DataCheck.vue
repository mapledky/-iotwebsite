<template>
	<div >
		<div class="location">
			<el-breadcrumb separator-class="el-icon-arrow-right" style="height: 35px;">
				<el-breadcrumb-item>首页</el-breadcrumb-item>
				<el-breadcrumb-item>时序数据库</el-breadcrumb-item>
				<el-breadcrumb-item>数据查询</el-breadcrumb-item>
			</el-breadcrumb>
		</div><!-- //end location -->
		<!-- <el-divider content-position="left">数据查询</el-divider> -->
		<div class="DataCheck">
			<el-divider content-position="left">数据查询</el-divider>
			<el-empty description="系统管理员无法使用该功能" v-if="this.isType3 === true"></el-empty>
			<el-scrollbar style="height: 95%; width: 100%;" v-if="this.isType3 === false">
			<div class="boxhead">
				<el-tabs v-model="tabName" class="leftbox">
					<el-tab-pane label="指标" name="first"></el-tab-pane>
					<el-tab-pane label="轴线" name="second"></el-tab-pane>
					<!-- <el-tab-pane label="图例" name="third"></el-tab-pane>
					<el-tab-pane label="显示" name="fourth"></el-tab-pane> -->
				</el-tabs><!-- //end leftbox -->
				<el-dropdown trigger="click" @command="ChangeSource" class="rightbox">
					<span class="el-dropdown-link" style="font-size: 14px;">
						<span style="margin-right: 15px;">数据源</span>
						<span class="span-size">{{SelcetDataSource}}<i
								class="el-icon-arrow-down el-icon--right"></i></span>
					</span>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item v-for="(item,index) in DataSource" :key="index" :command="item">{{item}}
						</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown><!-- //end rightbox -->
			</div><!-- //end boxhead -->
			<div class="boxbody">
				<div class="firstbox">
					<!-- v-if="tabName==='first'" -->
					<div class="Timebox">
						<span class="el-dropdown-link">
							<span> 时间选择: </span>
							<!-- <span class="span-size">{{time}}<i class="el-icon-arrow-down el-icon--right"></i></span> -->
						</span>
						<!-- <el-dropdown-menu slot="dropdown">
						    <el-dropdown-item v-for="(item,index) in wheretime" :key="index" :command="item" >{{item}}</el-dropdown-item>
						  </el-dropdown-menu> -->
						<el-date-picker v-model="value2" type="datetimerange" :picker-options="pickerOptions"
							range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right" style="margin-left: 10px;">
						</el-date-picker >
						<!-- <el-button class="rightbtn" type="text">
							<i class="el-icon-arrow-right"></i>
							查询条件预览
						</el-button> -->
					</div><!-- end timebox -->
					<div class="checkbox">
						<el-collapse v-model="collapseName">
							<el-collapse-item v-for="(item,index) in infor" :key="index"
								:title="String.fromCharCode(Number(index)+65)" :name="index">
								<div style="width: 600px;float: left;">
									<el-form label-width="80px">
										<el-form-item label="指标">
											<el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}"
												placeholder="请输入内容" v-model="item.target">
											</el-input>
										</el-form-item>
										<el-form-item label="聚合函数">
											<el-select v-model="item.function" placeholder="请选择">
												<el-option v-for="it in options" :key="it.value" :label="it.label"
													:value="it.value">
												</el-option>
											</el-select>
										</el-form-item>
										<el-form-item label="过滤">
											<el-select v-model="item.filtration" multiple placeholder="请选择过滤">
												<el-option v-for="item in options_filtration" :key="item.value"
													:label="item.label" :value="item.value">
												</el-option>
											</el-select>
										</el-form-item>
										<el-form-item>
											<el-checkbox v-model="item.underclocking">降频</el-checkbox>
										</el-form-item>
									</el-form>
								</div>
								<i class="el-icon-delete" style="float: right;font-size: 20px;margin-right: 20px;"
									@click="deletecol(index)"></i>
							</el-collapse-item>
							<el-collapse-item :title="String.fromCharCode(infor.length+65)" name="last">
								<el-button type="primary" size="mini" @click="AddSearch">新增查询</el-button>
								<el-button type="primary" size="mini" @click="SelectData">时序分析</el-button>
							</el-collapse-item>
						</el-collapse>
					</div>
					<div id="main">

					</div>
				</div>
			</div>
			</el-scrollbar>
		</div><!-- end DataCheck -->
	</div>
</template>

<script>
	import * as echarts from 'echarts'
	import axios from 'axios'
	import Qs from 'qs'
	import Cookie from 'js-cookie'
	import mqtt from 'mqtt'
	export default {

		data() {
			return {
				isType3 : false,
				tabName: 'first',
				DataSource: [], //数据源列表
				SelcetDataSource: "选择数据源", //选择的数据源
				pickerOptions: {
					shortcuts: [{
						text: '最近一周',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '最近一个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '最近三个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
							picker.$emit('pick', [start, end]);
						}
					}]
				},
				value2: [],
				time: "请选择", //wheretime选择的时间
				collapseName: [0, "last"],
				infor: [{
					target: "请输入指标eg:\ntemperature>=40;\ntemperature<20",
					function: "请选择聚合函数",
					filtration: [],
					underclocking: false
				}], //折叠面板表单列表
				options: [{
						value: '求和',
						label: '求和'
					}, //聚合函数
					{
						value: '求方差',
						label: '求方差'
					},
					{
						value: '求平均',
						label: '求平均'
					},
					{
						value: '求最大',
						label: '求最大'
					},
					{
						value: '求最小',
						label: '求最小'
					},
				],
				options_filtration: [{
						value: '默认',
						label: '默认'
					},
					{
						value: 'temperature',
						label: 'temperature'
					},
					{
						value: 'humidity',
						label: 'humidity'
					},
					{
						value: 'voltage',
						label: 'voltage'
					},
					{
						value: 'electricity',
						label: 'electricity'
					},
				], //过滤

				ProductionsInfor: [],
				DeviceInfor: [],
				Device: [],
			};
		},
		mounted() {
			const user_id = Cookie.get('user_id')
			const token = Cookie.get('token')
			const company_id = Cookie.get('company_id')

			//产品列表获取
			var ProductionsURL = "https://site.maple.today/IOTplatform/ServerMain"
			var ProductionsData = {
				"requestCode": "005",
				"user_id": user_id,
				"token": token,
				"company_id": company_id,
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
							"company_id": company_id,
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
										"company_id": company_id,
										"device_id": _this.DeviceInfor[j].sensor_id
									};
									// console.log(Qs.stringify(postdata))
									AXIOS.post(url, Qs.stringify(postdata)) //设备属性获取
										.then(res => {
											// console.log(Qs.parse(res.config.data).device_id)
											// console.log(res.data.data)
											var temp = res.data.data
											var temperature_seriesData = []
											var humidity_seriesData = []
											var voltage_seriesData = []
											var electricity_seriesData = []
											var device_id = Qs.parse(res.config.data).device_id
											_this.DataSource.push("device_" + device_id)
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
											_this.Device.push({
												device_id: device_id,
												value: {
													temperature: temperature_seriesData,
													humidity: humidity_seriesData,
													voltage: voltage_seriesData,
													electricity: electricity_seriesData,
												},
											})
										})
										.catch(error => console.log(error));

								}
							})
							.catch(error => console.log(error));
					}
				})
				.catch(error => console.log(error));
			console.log("this.Device", this.Device)
		},
		created() {
			if (Cookie.get('modal') === '3') {
				console.log("检测到为系统管理员")
				this.isType3 = true
			} else {
				console.log("检测为普通用户")
			}
		},
		methods: {
			ChangeSource(data) {
				this.SelcetDataSource = data;
				// console.log(data)
			},
			deletecol(index) {
				this.infor.splice(index, 1)
			},
			AddSearch() {
				if (this.infor.length >= 25) {
					alert("查询点过多")
				} else {
					this.infor.push({
						target: "请输入指标eg:\ntemperature>=40;\ntemperature<20",
						function: "请选择聚合函数",
						filtration: [],
						underclocking: false
					})
					this.collapseName.push(this.infor.length - 1)
				}
				// console.log(this.collapseName)
			},
			SelectData() {

				var _this = this;
				var SourceData = '';
				for (var i = 0; i < _this.Device.length; i++) { //源数据筛选
					if (("device_" + _this.Device[i].device_id) === _this.SelcetDataSource) {
						SourceData = JSON.parse(JSON.stringify(_this.Device[i].value));
						break;
					}
				}

				SourceData.temperature.sort(compare)
				SourceData.humidity.sort(compare)
				SourceData.voltage.sort(compare)
				SourceData.electricity.sort(compare)

				var start = _this.value2[0]
				var end = _this.value2[1]
				start = TimeChangeString(start)
				end = TimeChangeString(end)
				//时间筛选数据
				SourceData.temperature = CheckDate(start, end, SourceData.temperature)
				SourceData.humidity = CheckDate(start, end, SourceData.humidity)
				SourceData.voltage = CheckDate(start, end, SourceData.voltage)
				SourceData.electricity = CheckDate(start, end, SourceData.electricity)

				// target处理
				var LastInforData = [];
				for (i = 0; i < _this.infor.length; i++) {
					var lastinfordata = TargetData(_this.infor[i].target, JSON.parse(JSON.stringify(SourceData)))
					LastInforData.push(lastinfordata)
				}

				//聚合函数处理
				var funList = [];
				for (i = 0; i < _this.infor.length; i++) {
					var temperaturefun = FunctionData(_this.infor[i].function, LastInforData[i].temperature)
					var humidityfun = FunctionData(_this.infor[i].function, LastInforData[i].humidity)
					var voltagefun = FunctionData(_this.infor[i].function, LastInforData[i].voltage)
					var electricityfun = FunctionData(_this.infor[i].function, LastInforData[i].electricity)

					funList.push({
						temperature: temperaturefun,
						humidity: humidityfun,
						voltage: voltagefun,
						electricity: electricityfun,
					})
				}
				console.log(funList)
				// console.log(LastInforData)
				//过滤处理
				for (i = 0; i < _this.infor.length; i++) {
					for (var j = 0; j < _this.infor[i].filtration.length; j++) {
						if (_this.infor[i].filtration[j] === "temperature") {
							LastInforData[i].temperature = []
						} else if (_this.infor[i].filtration[j] === "humidity") {
							LastInforData[i].humidity = []
						} else if (_this.infor[i].filtration[j] === "voltage") {
							LastInforData[i].voltage = []
						} else if (_this.infor[i].filtration[j] === "electricity") {
							LastInforData[i].electricity = []
						}
					}
					// console.log(_this.infor[i].filtration)
				}
				console.log(LastInforData)
				//降频1级处理
				for (i = 0; i < _this.infor.length; i++) {
					if (_this.infor[i].underclocking === true) {
						LastInforData[i].temperature = SubFre(LastInforData[i].temperature)
						LastInforData[i].humidity = SubFre(LastInforData[i].humidity)
						LastInforData[i].voltage = SubFre(LastInforData[i].voltage)
						LastInforData[i].electricity = SubFre(LastInforData[i].electricity)
					}
				}
				//降频2级处理
				for (i = 0; i < _this.infor.length; i++) {
					if (_this.infor[i].underclocking === true) {
						LastInforData[i].temperature = Fre2(LastInforData[i].temperature, 5)
						LastInforData[i].humidity = Fre2(LastInforData[i].humidity, 5)
						LastInforData[i].voltage = Fre2(LastInforData[i].voltage, 5)
						LastInforData[i].electricity = Fre2(LastInforData[i].electricity, 5)
					}
				}
				console.log(LastInforData)

				//图表四项
				if (_this.tabName === "first") {
					for (i = 0; i < _this.infor.length; i++) {
						var maindiv = document.createElement("div")
						maindiv.id = "module_" + String.fromCharCode(Number(i) + 65)
						maindiv.style = "width: 1200px;height: 400px;"
						document.getElementById("main").appendChild(maindiv) //创建设备的图表盒子
						var cdom = document.getElementById(("module_" + String.fromCharCode(Number(i) + 65)));
						var mychart = echarts.init(cdom);
						var optiontemp = {
							tooltip: {
								trigger: 'item'
							},
							legend: {
								top: '5%',
								left: 'center'
							},
							series: [{
								name: '属性',
								type: 'pie',
								radius: ['40%', '70%'],
								avoidLabelOverlap: false,
								itemStyle: {
									borderRadius: 10,
									borderColor: '#fff',
									borderWidth: 2
								},
								label: {
									show: false,
									position: 'center'
								},
								emphasis: {
									label: {
										show: true,
										fontSize: '40',
										fontWeight: 'bold'
									}
								},
								labelLine: {
									show: false
								},
								data: [{
										value: LastInforData[i].temperature.length,
										name: 'temperature'
									},
									{
										value: LastInforData[i].humidity.length,
										name: 'humidity'
									},
									{
										value: LastInforData[i].voltage.length,
										name: 'voltage'
									},
									{
										value: LastInforData[i].electricity.length,
										name: 'electricity'
									}
								]
							}]
						};
						optiontemp && mychart.setOption(optiontemp);
					}
				} else if (_this.tabName === "second") {
					for (i = 0; i < _this.infor.length; i++) {
						maindiv = document.createElement("div")
						maindiv.id = "module_" + String.fromCharCode(Number(i) + 65)
						maindiv.style = "width: 1200px;height: 400px;"
						document.getElementById("main").appendChild(maindiv) //创建设备的图表盒子
						cdom = document.getElementById(("module_" + String.fromCharCode(Number(i) + 65)));
						mychart = echarts.init(cdom);
						optiontemp = {
							title: {
								text: "module_" + String.fromCharCode(Number(i) + 65)
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
							xAxis: {
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
								data: LastInforData[i].temperature
							}, {
								name: 'Humidity',
								type: 'line',
								showSymbol: false,
								hoverAnimation: false,
								data: LastInforData[i].humidity
							}, {
								name: 'Voltage',
								type: 'line',
								showSymbol: false,
								hoverAnimation: false,
								data: LastInforData[i].voltage
							}, {
								name: 'Electricity',
								type: 'line',
								showSymbol: false,
								hoverAnimation: false,
								data: LastInforData[i].electricity
							}]
						};
						optiontemp && mychart.setOption(optiontemp);
					}
				}
				//pg client getdata where time,device,指标，聚合函数，过滤，降频
				// console.log(SourceData)
			}
		}
	};

	function Fre2(arr,freq) {
		var left = -1,
			sum = 0,
			time = '',
			aver = 0,
			i = 0;
		for (i = 0; i < arr.length; i++) {
			if (i % freq === 0) {
				if(i-left!==1){
					aver = sum / (i - left);
					arr.splice(left, i - left, {
						name: time,
						value: [time, aver]
					});
					if(i>=arr.length){
						break
					}
				}

				left = i;
				sum = parseFloat(arr[i].value[1]);
				time = arr[i].name;
			} else {
				sum += parseFloat(arr[i].value[1])
			}
		}
		if (i - left !== 1 && i<arr.length) {
			aver = sum / (i - left);
			arr.splice(left, i - left, {
				name: time,
				value: [time, aver]
			});
		}
		return arr;
	}


	function SubFre(arr) {
		var left = -1,
			sum = 0,
			time = '',
			aver = 0,
			i = 0;
		for (i = 0; i < arr.length; i++) {
			if (arr[i].name !== time) {
				if (i - left !== 1) {
					aver = sum / (i - left);
					arr.splice(left, i - left, {
						name: time,
						value: [time, aver]
					});
					if(i>=arr.length){
						break
					}
				}

				left = i;
				sum = parseFloat(arr[i].value[1]);
				time = arr[i].name;
			} else {
				sum += parseFloat(arr[i].value[1])
			}
		}
		if (i - left !== 1 && i<arr.length) {
			aver = sum / (i - left);
			arr.splice(left, i - left, {
				name: time,
				value: [time, aver]
			});
		}
		return arr;
	}


	function FunctionData(fun, arr) {
		var i = 0;
		var sum = 0;
		var aver = 0;
		var Max = -Infinity
		var Min = Infinity
		if (fun === "求和") {
			sum = 0;
			for (i = 0; i < arr.length; i++) {
				sum = sum + parseFloat(arr[i].value[1])
			}
			return sum;
		} else if (fun === "求方差") {
			sum = 0;
			for (i = 0; i < arr.length; i++) {
				sum = sum + parseFloat(arr[i].value[1])
			}
			aver = sum / arr.length
			for (i = 0; i < arr.length; i++) {
				sum = sum + Math.pow((aver - parseFloat(arr[i].value[1])), 2)
			}
			return Math.sqrt((sum / arr.length), 2)
		} else if (fun === "求平均") {
			sum = 0;
			for (i = 0; i < arr.length; i++) {
				sum = sum + parseFloat(arr[i].value[1])
			}
			aver = sum / arr.length;
			return aver;
		} else if (fun === "求最大") {
			for (i = 0; i < arr.length; i++) {
				if (parseFloat(arr[i].value[1]) > Max) {
					Max = parseFloat(arr[i].value[1])
				}
			}
			return Max;
		} else if (fun === "求最小") {
			for (i = 0; i < arr.length; i++) {
				if (parseFloat(arr[i].value[1]) < Min) {
					Min = parseFloat(arr[i].value[1])
				}
			}
			return Min;
		} else {
			return NaN
		}
	}

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

	function CheckDate(start, end, arr) {
		for (var i = 0; i < arr.length;) {
			if (i >= arr.length) break
			if (CompareDate(start, arr[i].name) || CompareDate(arr[i].name, end)) {
				arr.splice(i, 1)
			} else {
				i++;
			}
		}
		return arr;
	}

	function TargetData(target, SourceData) {
		var i = 0,
			j = 0;
		var value = '',
			DataValue = '';
		target = target.replace("请输入指标eg:", "")
		// console.log(target)
		target = target.replace(/\n/g, "")
		// console.log(target)
		var Temp = target.split(';')
		// console.log(Temp)
		for (i = 0; i < Temp.length; i++) {
			//temperature
			if (Temp[i].search("temperature>=") !== -1) {
				// console.log(i)
				value = Temp[i]
				value = value.replace("temperature>=", "")
				// console.log(value)
				value = parseFloat(value)
				// console.log(value)
				for (j = 0; j < SourceData.temperature.length;) {
					if (j >= SourceData.temperature.length) {
						break;
					}
					DataValue = SourceData.temperature[j].value[1]
					DataValue = parseFloat(DataValue)
					if (DataValue < value) {
						SourceData.temperature.splice(j, 1)
					} else {
						j++
					}
				}
			} else if (Temp[i].search("temperature>") !== -1 && (Temp[i].search("=") === -1)) {
				value = Temp[i].replace("temperature>", "")
				value = parseFloat(value)
				for (j = 0; j < SourceData.temperature.length;) {
					if (j >= SourceData.temperature.length) {
						break;
					}
					DataValue = SourceData.temperature[j].value[1]
					DataValue = parseFloat(DataValue)
					if (DataValue <= value) {
						SourceData.temperature.splice(j, 1)
					} else {
						j++
					}
				}
			} else if (Temp[i].search("temperature<=") !== -1) {
				value = Temp[i].replace("temperature<=", "")
				value = parseFloat(value)
				for (j = 0; j < SourceData.temperature.length;) {
					if (j >= SourceData.temperature.length) {
						break;
					}
					DataValue = SourceData.temperature[j].value[1]
					DataValue = parseFloat(DataValue)
					if (DataValue > value) {
						SourceData.temperature.splice(j, 1)
					} else {
						j++
					}
				}
			} else if (Temp[i].search("temperature<") !== -1 && (Temp[i].search("=") === -1)) {
				value = Temp[i].replace("temperature<", "")
				value = parseFloat(value)
				for (j = 0; j < SourceData.temperature.length;) {
					if (j >= SourceData.temperature.length) {
						break;
					}
					DataValue = SourceData.temperature[j].value[1]
					DataValue = parseFloat(DataValue)
					if (DataValue >= value) {
						SourceData.temperature.splice(j, 1)
					} else {
						j++
					}
				}
			}
			//humidity
			else if (Temp[i].search("humidity>=") !== -1) {
				value = Temp[i].replace("humidity>=", "")
				value = parseFloat(value)
				for (j = 0; j < SourceData.humidity.length;) {
					if (j >= SourceData.humidity.length) {
						break;
					}
					DataValue = SourceData.humidity[j].value[1]
					DataValue = parseFloat(DataValue)
					if (DataValue < value) {
						SourceData.humidity.splice(j, 1)
					} else {
						j++
					}
				}
			} else if (Temp[i].search("humidity>") !== -1 && (Temp[i].search("=") === -1)) {
				value = Temp[i].replace("humidity>", "")
				value = parseFloat(value)
				for (j = 0; j < SourceData.humidity.length;) {
					if (j >= SourceData.humidity.length) {
						break;
					}
					DataValue = SourceData.humidity[j].value[1]
					DataValue = parseFloat(DataValue)
					if (DataValue <= value) {
						SourceData.humidity.splice(j, 1)
					} else {
						j++
					}
				}
			} else if (Temp[i].search("humidity<=") !== -1) {
				value = Temp[i].replace("humidity<=", "")
				value = parseFloat(value)
				for (j = 0; j < SourceData.humidity.length;) {
					if (j >= SourceData.humidity.length) {
						break;
					}
					DataValue = SourceData.humidity[j].value[1]
					DataValue = parseFloat(DataValue)
					if (DataValue > value) {
						SourceData.humidity.splice(j, 1)
					} else {
						j++
					}
				}
			} else if (Temp[i].search("humidity<") !== -1 && (Temp[i].search("=") === -1)) {
				value = Temp[i].replace("humidity<", "")
				value = parseFloat(value)
				for (j = 0; j < SourceData.humidity.length;) {
					if (j >= SourceData.humidity.length) {
						break;
					}
					DataValue = SourceData.humidity[j].value[1]
					DataValue = parseFloat(DataValue)
					if (DataValue >= value) {
						SourceData.humidity.splice(j, 1)
					} else {
						j++
					}
				}
			}
			//voltage
			else if (Temp[i].search("voltage>=") !== -1) {
				value = Temp[i].replace("voltage>=", "")
				value = parseFloat(value)
				for (j = 0; j < SourceData.voltage.length;) {
					if (j >= SourceData.voltage.length) {
						break;
					}
					DataValue = SourceData.voltage[j].value[1]
					DataValue = parseFloat(DataValue)
					if (DataValue < value) {
						SourceData.voltage.splice(j, 1)
					} else {
						j++
					}
				}
			} else if (Temp[i].search("voltage>") !== -1 && (Temp[i].search("=") === -1)) {
				value = Temp[i].replace("voltage>", "")
				value = parseFloat(value)
				for (j = 0; j < SourceData.voltage.length;) {
					if (j >= SourceData.voltage.length) {
						break;
					}
					DataValue = SourceData.voltage[j].value[1]
					DataValue = parseFloat(DataValue)
					if (DataValue <= value) {
						SourceData.voltage.splice(j, 1)
					} else {
						j++
					}
				}
			} else if (Temp[i].search("voltage<=") !== -1) {
				value = Temp[i].replace("voltage<=", "")
				value = parseFloat(value)
				for (j = 0; j < SourceData.voltage.length;) {
					if (j >= SourceData.voltage.length) {
						break;
					}
					DataValue = SourceData.voltage[j].value[1]
					DataValue = parseFloat(DataValue)
					if (DataValue > value) {
						SourceData.voltage.splice(j, 1)
					} else {
						j++
					}
				}
			} else if (Temp[i].search("voltage<") !== -1 && (Temp[i].search("=") === -1)) {
				value = Temp[i].replace("voltage<", "")
				value = parseFloat(value)
				for (j = 0; j < SourceData.voltage.length;) {
					if (j >= SourceData.voltage.length) {
						break;
					}
					DataValue = SourceData.voltage[j].value[1]
					DataValue = parseFloat(DataValue)
					if (DataValue >= value) {
						SourceData.voltage.splice(j, 1)
					} else {
						j++
					}
				}
			}
			//electricity
			else if (Temp[i].search("electricity>=") !== -1) {
				value = Temp[i].replace("electricity>=", "")
				value = parseFloat(value)
				for (j = 0; j < SourceData.electricity.length;) {
					if (j >= SourceData.electricity.length) {
						break;
					}
					DataValue = SourceData.electricity[j].value[1]
					DataValue = parseFloat(DataValue)
					if (DataValue < value) {
						SourceData.electricity.splice(j, 1)
					} else {
						j++
					}
				}
			} else if (Temp[i].search("electricity>") !== -1 && (Temp[i].search("=") === -1)) {
				value = Temp[i].replace("electricity>", "")
				value = parseFloat(value)
				for (j = 0; j < SourceData.electricity.length;) {
					if (j >= SourceData.electricity.length) {
						break;
					}
					DataValue = SourceData.electricity[j].value[1]
					DataValue = parseFloat(DataValue)
					if (DataValue <= value) {
						SourceData.electricity.splice(j, 1)
					} else {
						j++
					}
				}
			} else if (Temp[i].search("electricity<=") !== -1) {
				value = Temp[i].replace("electricity<=", "")
				value = parseFloat(value)
				for (j = 0; j < SourceData.electricity.length;) {
					if (j >= SourceData.electricity.length) {
						break;
					}
					DataValue = SourceData.electricity[j].value[1]
					DataValue = parseFloat(DataValue)
					if (DataValue > value) {
						SourceData.electricity.splice(j, 1)
					} else {
						j++
					}
				}
			} else if (Temp[i].search("electricity<") !== -1 && (Temp[i].search("=") === -1)) {
				value = Temp[i].replace("electricity<", "")
				value = parseFloat(value)
				for (j = 0; j < SourceData.electricity.length;) {
					if (j >= SourceData.electricity.length) {
						break;
					}
					DataValue = SourceData.electricity[j].value[1]
					DataValue = parseFloat(DataValue)
					if (DataValue >= value) {
						SourceData.electricity.splice(j, 1)
					} else {
						j++
					}
				}
			}
		} //end for
		return SourceData;
	}

	function TimeChangeString(now) {
		return now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate() + ' ' +
			(now.getHours() >= 10 ? now.getHours() : '0' + now.getHours()) + ':' +
			(now.getMinutes() >= 10 ? now.getMinutes() : '0' + now.getMinutes()) + ':' +
			(now.getSeconds() >= 10 ? now.getSeconds() : '0' + now.getSeconds());
	}
</script>

<style>
	.DataCheck {
		width: 96%;
		height: 96%;
		background-color: #ffffff;
		border: black;
	}

	.location {
		background-color: #ffffff;
		font-size: 12px;
		/* height: 35px; */
		margin-bottom: -20px;
	}

	.leftbox {
		display: inline-block;
		width: 500px;
		height: 40px;
	}

	.rightbox {
		display: inline-block;
		height: 40px;
		line-height: 40px;
		margin: auto 0;
	}

	.boxhead {
		height: 50px;
		width: auto;
		display: flex;
		justify-content: space-between;
		border-top: #E0E0E0 solid 1px;
		border-bottom: #E0E0E0 solid 1px;
	}


	.Timebox {
		height: 50px;
		line-height: 50px;
		padding-left: 20px;
		border-bottom: #E0E0E0 solid 1px;
		/* width: 100px; */
		border-left: #E0E0E0 solid 1px;
	}

	.rightbtn {
		float: right;
	}

	.span-size {
		border: #000000 solid 1px;
		background-color: #E0E0E0;
		padding: 4px 10px;
	}

</style>
