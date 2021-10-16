<template>
	<div>
		<el-breadcrumb separator-class="el-icon-arrow-right" style="height: 4%;">
			<el-breadcrumb-item>首页</el-breadcrumb-item>
			<el-breadcrumb-item>数字镜像</el-breadcrumb-item>
			<el-breadcrumb-item :to="{name:'DeviceManage'}">设备管理</el-breadcrumb-item>
			<el-breadcrumb-item>设备信息</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="deviceInformation">
			<el-divider content-position="right">设备信息</el-divider>
			<el-form ref="card" :model="card" label-width="80px">
				<el-form-item label="设备名称">
					<el-tag>{{card.sensorName}}</el-tag>
				</el-form-item>
				<el-form-item label="产品型号">
					<el-tag>{{productName}}</el-tag>
				</el-form-item>
				<!-- <el-form-item label="所属工厂">
					<el-tag>{{card.companyName}}</el-tag>
				</el-form-item> -->
				<el-form-item label="创建时间">
					<el-tag>{{createTime | formatDate}}</el-tag>
				</el-form-item>


			</el-form>
		</div>
	</div>
</template>
<script lang="ts">
	import Cookies from 'js-cookie'
	import moment from 'moment'
	export default {
		data() {
			return {
				productions: [],
				productName: '',
				createTime : 0
			}
		},
		filters: {
		      formatDate: function (value) {
		        return moment(value).format('YYYY-MM-DD HH:MM:ss')
		      }
		    },
		props: ['card','companyID'],
		created() {
			// console(this.userID +" "+ this.token + " "+this.company_id)
			// console.log(Cookies.get('user_id'))
			var that = this
			var product = ''
			
			this.$axios.get('https://site.maple.today/IOTplatform/ServerMain', {
					params: {
						requestCode: '005',
						user_id: Cookies.get('user_id'),
						company_id: that.companyID,
						token: Cookies.get('token')
					}
				})
				.then(function(response) {
					// console.log(response.data.data)
					 that.productions = response.data.data
					 var pros = response.data.data
					 console.log("选中的id"+that.card.productID)
					 console.log(response)
					 that.createTime = Number(that.card.createTime)
					
					for( var number in response.data.data){
						if(pros[number].product_id === that.card.productID){
							console.log(pros[number].product_name)
							that.productName = pros[number].product_name
						}
					}

				})
				.catch(function(error) {
					console.log(error)
				})
				// this.card.productID = '2'
			// this.card.productID = product
		},
		mounted() {
			
		}
	}
</script>
<style>
	.deviceInformation {
		width: 100%;
		height: 96%;
	}
</style>
