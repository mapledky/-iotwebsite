<template>
	<div>
		<el-breadcrumb separator-class="el-icon-arrow-right" style="height: 4%;">
		  <el-breadcrumb-item>首页</el-breadcrumb-item>
		  <el-breadcrumb-item>设备地图</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="DeviceMap">
			<el-divider content-position="left">设备地图(设备总数：{{devicenum}},  工厂总数：{{factorynum}})</el-divider>
			<div class="Show">
				<!-- <div class="wrap3">
					<div class="rectangle9">设备总数：{{devicenum}}</div>
					<div class="rectangle10">工厂总数：{{factorynum}}</div>
				</div> -->
				<div id="container1">
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { AMapManager } from 'vue-amap';
import axios from 'axios';
import Cookies from 'js-cookie';

	export default{
		name: 'DeviceMap',
		data() {
			return{
				deviceList: [],
				alldevice: [],
				companyList: [],
				mycompany: {},
				map: '',
				infoWindow: '',
				devicenum: '',
				factorynum: '',
				marker: '',
				token: '',
				userID: '',
				companyID: '',
				modal: ''
			}
		},
		created(){
			this.token = Cookies.get("token");
			this.userID = Cookies.get("user_id");
			this.companyID = Cookies.get("company_id");
			this.modal = Cookies.get("modal");
			if(this.modal==='3'){
				this.fetchData();
			}else{
				this.fetchaData();
			}
		},
		mounted(){
			this.loadmap();
		},
		methods:{
			changeTime(){
			    var that = this;
			    for(var i = 0;i < that.companyList.length;i++){
			     that.companyList[i].create_time = that.timestampToTime(that.companyList[i].create_time);
			    }
			   },
			   timestampToTime(timestamp) {
			        var date=new Date(parseInt(timestamp));
			               var year=date.getFullYear();
			               var mon = date.getMonth()+1;
			               var day = date.getDate();
			               var hours = date.getHours();
			               var minu = date.getMinutes();
			               var sec = date.getSeconds();
			       
			               return year+'/'+mon+'/'+day+' '+hours+':'+minu+':'+sec;
			   },
			loadmap(){
				var that = this
				this.map = new AMap.Map('container1', {
					center: [118.792221, 31.938254],
					zoom: 8
				});
			},
			fetchData(){
				var that = this
				axios.get(
					"https://site.maple.today/IOTplatform/ServerMain",
					{
						params:{
							requestCode: '011',
							user_id: that.userID,
							token: that.token
						}
					})
					.then(function(response){
						console.log(response.data);
						that.companyList = response.data.data;
						that.changeTime();
						that.putCData();
						that.fetchDData();
					})
					.catch(function(error){
						console.log(error);
					})
			},
			fetchDData(){
				var that = this
				axios.get(
					"https://site.maple.today/IOTplatform/ServerMain",
					{
						params:{
							requestCode: '019',
							user_id: that.userID,
							token: that.token,
						}
					})
					.then(function(response){
						console.log(response.data);
						that.alldevice = response.data.data;
						that.devicenum = that.alldevice.length;
					})
					.catch(function(error){
						console.log(error);
					})
			},
			putCData(){
				var that = this;
				that.infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -20)});
				for(var i = 0; i < that.companyList.length; i++){
					var content = [];
					content.push("<h4>" + that.companyList[i].company_name + "</h4>");
					content.push("<p>公司ID:" + that.companyList[i].company_id + "</p>");
					content.push("<p>创建时间:" + that.companyList[i].create_time + "</p>");
					
					that.marker =  new AMap.Marker({
						position: new AMap.LngLat(that.companyList[i].longitude,that.companyList[i].latitude),
						offset: new AMap.Pixel(-10, -10),
						icon: new AMap.Icon({            
							image: require("../../assets/locate.png"),
							size: new AMap.Size(52, 52),  //图标大小
							imageSize: new AMap.Size(32, 32)
						}),
						title: that.companyList[i].company_name
					});
					
					that.marker.content = content.join("");
					that.marker.on('click', that.markerClick);
					that.marker.emit('click', {target: that.marker});//默认初始化不出现信息窗体,打开初始化就出现信息窗体
					
					that.marker.setMap(that.map);
				}
				that.factorynum = that.companyList.length;
			},
			markerClick(e){
				var that = this;
				that.infoWindow.setContent(e.target.content);
				that.infoWindow.open(that.map, e.target.getPosition());
			},
			fetchaData(){
				var that = this;
				console.log(that.companyID);
				console.log(that.userID);
				axios.get(
					"https://site.maple.today/IOTplatform/ServerMain",
					{
						params:{
							requestCode: '021',
							user_id: that.userID,
							token: that.token,
							company_id: that.companyID
						}
					})
					.then(function(response){
						console.log(response.data);
						that.mycompany = response.data.data;
						that.putGData();
					})
					.catch(function(error){
						console.log(error);
					})
				if(that.companyID === '0'){
					that.factorynum = '0';
				}else{
					that.factorynum = '1';
				}
			},
			putGData(){
				var that = this;
				axios.get(
					"https://site.maple.today/IOTplatform/ServerMain",
					{
						params:{
							requestCode: '007',
							user_id: that.userID,
							token: that.token,
							company_id: that.companyID
						}
					})
					.then(function(response){
						console.log(response.data);
						that.deviceList = response.data.data;
						that.devicenum = that.deviceList.length;
					})
					.catch(function(error){
						console.log(error);
					})
				that.marker =  new AMap.Marker({
					position: new AMap.LngLat(that.mycompany.longitude,that.mycompany.latitude),
					offset: new AMap.Pixel(-10, -10),
					icon: new AMap.Icon({            
						image: require("../../assets/locate.png"),
						size: new AMap.Size(52, 52),  //图标大小
						imageSize: new AMap.Size(32, 32)
					}),
					title: that.mycompany.company_name
				});
				that.infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -20)});
				var content = [];
				content.push("<h4>" + that.mycompany.company_name + "</h4>");
				content.push("<p>公司ID:" + that.mycompany.company_id + "</p>");
				content.push("<p>创建时间:" + that.mycompany.create_time + "</p>");
				that.marker.content = content.join("");
				that.marker.on('click', that.markerClick);
				that.marker.emit('click', {target: that.marker});//默认初始化不出现信息窗体,打开初始化就出现信息窗体

				that.marker.setMap(that.map);
			}
		}
	}
</script>

<style>
	.DeviceMap{
		width: 100%;
		height: 96%;
		/* background-color: antiquewhite;
		border: black;
		border-width: 1px;
		border-style: solid; */
		align-items: center;
	}
	#container1{
		margin-top: 10px;
		width: 95%;
		height: 80%;
		border-width: 2px;
	}
	.Show{
		width: 93%;
		height: 93%;
		/* border: 20px solid antiquewhite; */
		/* background-color: #ffffff; */
		padding-left: 50px;
	}
	.wrap3{
		/* padding-left: 10px; */
		width: 90%;
		height: 15%;
		display: flex;
		flex-direction: row;
	}
	.rectangle9,.rectangle10{
		/* flex:1; */
		/* width: 60%; */
		 /* height: ; */
		border:solid 2px #DDDDDD;
		margin-top: 20px;
		margin-left: 20px;
		/* padding-top: 15px; */
		padding-left: 10px;
		padding-right: 10px;
		text-align: center;
		color: #747474;
		font-size: 20px;
		display: flex;
		flex-direction: row;
		align-items: center;
	}
</style>