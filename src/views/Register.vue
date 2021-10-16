<template>
	<div class="box">
		<h1>IOT平台注册</h1>
		<h4>已有账号,<a href="/">去登陆></a></h4>
		<el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px"
			style="text-align: left">
			<el-form-item label="手机号/邮箱" prop="phone">
				<el-input v-model="ruleForm.phone"></el-input>
				<el-button type="primary" @click="getCode" class="btn">获取验证码</el-button>
			</el-form-item>

			<el-form-item label="验证码" prop="code">
				<el-input v-model="ruleForm.code"></el-input>
			</el-form-item>

			<el-form-item label="密码" prop="pass">
				<el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
			</el-form-item>

			<el-form-item label="确认密码" prop="checkPass">
				<el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
			</el-form-item>

			<!-- <el-form-item label="身份选择" prop="identity">
				<el-radio-group v-model="ruleForm.identity">
					<el-radio label="管理员" ></el-radio>
					<el-radio label="教师" ></el-radio>
					<el-radio label="学生" ></el-radio>
				</el-radio-group>
			</el-form-item> -->

			<el-form-item>
				<el-button type="primary" @click="submit">立即注册</el-button>
				<el-button @click="resetForm('ruleForm')">重置</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	import axios from 'axios'
	import Qs from 'qs';
	import sha256 from 'js-sha256';
	export default {
		data() {
			var validatePass = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请输入密码'))
				} else {
					if (this.ruleForm.checkPass !== '') {
						this.$refs.ruleForm.validateField('checkPass')
					}
					callback()
				}
			}
			var validatePass2 = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请再次输入密码'))
				} else if (value !== this.ruleForm.pass) {
					callback(new Error('两次输入密码不一致!'))
				} else {
					callback()
				}
			}
			return {
				user_id: '',
				token: '',
				company_id:'',
				modal:'',
				way: false,
				ruleForm: {
					pass: '',
					checkPass: '',
					code: '',
					// identity: '',
					phone: '',
					sms_id: '',
				},
				rules: {
					pass: [{
							validator: validatePass,
							trigger: 'blur'
						},
						{
							required: true,
							message: '请输入密码',
							trigger: 'blur'
						},
					],
					checkPass: [{
							validator: validatePass2,
							trigger: 'blur'
						},
						{
							required: true,
							message: '确认密码',
							trigger: 'blur'
						},
					],
					// identity:[
					// 	{ required: true, message: '选择身份类型', trigger: 'change'},
					// ],
					phone: [{
						required: true,
						message: '请输入手机号/邮箱',
						trigger: 'blur'
					}, ],
					code: [{
						required: true,
						message: '请输入验证码',
						trigger: 'blur'
					}, ],
				},
			}
		},
		mounted() {
			// this.getNameCookie();
			this.getIdCookier();
			if(this.user_id!==''&&this.token!==''&&this.company_id!==''&&this.modal!==''){
				this.$router.push({
					name: 'MainPage',
				})
			}
		},
		methods: {

			//提交表单函数
			submit() {
				let sha256 = require("js-sha256").sha256 //这里用的是require方法
				var sha256password = sha256(this.ruleForm.pass) //要加密的密码
				// console.log(this.sha256password)//这就是你加密之后的密码
				var data;
				if (/^(0|86|17951)?(13[0-9]|15[012356789]|17[0-8]|18[0-9]|14[5679]|19[189]|16[56])[0-9]{8}$/.test(this.ruleForm.phone)) {
					data = {
						"requestCode": "002",
						"phoneNumber": this.ruleForm.phone,
						"code": this.ruleForm.code,
						"sms_id": this.ruleForm.sms_id,
						"password": sha256password,
					}
				} else if (/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+$/.test(this.ruleForm.phone)) {
					data = {
						"requestCode": "004",
						"address": this.ruleForm.phone,
						"code": this.ruleForm.code,
						"sms_id": this.ruleForm.sms_id,
						"password": sha256password,
					}
				} else {
					console.log('输入非手机号或者邮箱');
					return;
				}
				let _this = this;
				var url = 'https://site.maple.today/IOTplatform/SMS';
				
				var AXIOS = axios.create({
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				});
				AXIOS.post(url, Qs.stringify(data))
					.then(res => {
						if (res.data.result === "1") {
							console.log('注册成功');
							_this.setIdCookie(res.data.user_id,res.data.token,res.data.company,res.data.modal,1);
							_this.$router.push({
								name:'MainPage',
							})
						} else if (res.data.result === "0") {
							alert('未知错误')
						} else if (res.data.result === "2") {
							alert('超时或验证码错误')
						}
					})
					.catch(error => console.log(error));
			},

			//清空表单
			resetForm(ruleForm) {
				this.$refs[ruleForm].resetFields();
			},

			//获取验证码函数
			getCode() {
				let _this = this;
				var url;
				var data;
				if (/^(0|86|17951)?(13[0-9]|15[012356789]|17[0-8]|18[0-9]|14[5679]|19[189]|16[56])[0-9]{8}$/.test(this.ruleForm.phone)) {
					url = 'https://site.maple.today/IOTplatform/SMS';
					data = {
						"requestCode": "001",
						"phoneNumber": this.ruleForm.phone,
					}
				} else if (/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+$/.test(this.ruleForm.phone)) {
					url = 'https://site.maple.today/IOTplatform/SMS';
					data = {
						"requestCode": "003",
						"address": this.ruleForm.phone,
					}
				} else {
					console.log('输入非手机号或者邮箱');
				}

				
				console.log(Qs.stringify(data))
				var AXIOS = axios.create({
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				});
				AXIOS.post(url, Qs.stringify(data))
					.then(res => {
						if (res.data.result === "1") {
							_this.ruleForm.sms_id = res.data.sms_id;
							console.log(_this.ruleForm.sms_id);
						} else if (res.data.result === "0") {
							alert('超出本日短信上限')
						} else if (res.data.result === "2") {
							alert('请求过于频繁，1分钟后再请求')
						}
						else{
							console.log(res)
						}
					})
					.catch(error => console.log(error));
			},
			//设置setNameCookie
			setNameCookie(c_name, c_pwd, exdays) {
				var exdate = new Date() //获取时间
				exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays) //保存的天数
				//字符串拼接cookie
				window.document.cookie = 'userName' + '=' + c_name + ';path=/;expires=' + exdate.toGMTString()
				window.document.cookie = 'userPwd' + '=' + c_pwd + ';path=/;expires=' + exdate.toGMTString()
			},
			setIdCookie(c_id,c_token,c_companyid,c_modal,exdays){
				//c_id是用户id
				//c_token是token验证
				//c_companyid是用户的公司id
				//c_modal是用户的身份类型
				var exdate = new Date() //获取时间
				exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays) //保存的天数
				//字符串拼接cookie
				window.document.cookie = 'user_id' + '=' + c_id + ';path=/;expires=' + exdate.toGMTString()
				window.document.cookie = 'token' + '=' + c_token + ';path=/;expires=' + exdate.toGMTString()
				window.document.cookie = 'company_id' + '=' + c_companyid + ';path=/;expires=' + exdate.toGMTString()
				window.document.cookie = 'modal' + '=' + c_modal + ';path=/;expires=' + exdate.toGMTString()
			},
			//读取cookie
			getNameCookie: function() {
				if (document.cookie.length > 0) {
					this.checked = true
					// console.log(document.cookie)
					var arr = document.cookie.split('; ') //这里显示的格式需要切割一下自己可输出看下
					for (var i = 0; i < arr.length; i++) {
						var arr2 = arr[i].split('=') //再次切割
						//判断查找相对应的值
						if (arr2[0] === 'userName') {
							this.ruleForm.name = arr2[1] //保存到保存数据的地方
						}
						if (arr2[0] === 'userPwd') {
							this.ruleForm.password = arr2[1]
						}
					}
				}
			},
			getIdCookier: function(){
				if (document.cookie.length > 0) {
					// console.log(document.cookie)
					var arr = document.cookie.split('; ') //这里显示的格式需要切割一下自己可输出看下
					for (var i = 0; i < arr.length; i++) {
						var arr2 = arr[i].split('=') //再次切割
						//判断查找相对应的值
						if (arr2[0] === 'user_id') {
							this.user_id = arr2[1] //保存到保存数据的地方
						}
						if (arr2[0] === 'token') {
							this.token = arr2[1]
						}
						if (arr2[0] === 'company_id') {
							this.company_id = arr2[1]
						}
						if (arr2[0] === 'modal') {
							this.modal = arr2[1]
						}
					}
				}
			},
			//清除cookie
			clearNameCookie: function() {
				this.setNameCookie('', '', -1) //修改2值都为空，天数为负1天就好了
			},
			clearIdCookie: function() {
				this.setIdCookie('', '','','', -1) //修改2值都为空，天数为负1天就好了
			},
		},
	}
</script>
<style>
	.box {
		width: 650px;
		text-align: center;
		margin: 0 auto;
	}

	a {
		text-decoration: none;
		color: #97caff;
	}

	.btn {}
</style>
