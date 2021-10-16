<template>
	<div class="loginBox">
		<div class="loginContainer">
			<div style="text-align: left; width: 400px">
				<h2>登录</h2>
			</div>
			<div class="login">
				<el-form ref="form" :model="form">
					<el-form-item>
						<el-input v-model="form.name" placeholder="手机号/邮箱"></el-input>
					</el-form-item>
					<el-form-item>
						<el-input v-model="form.password" placeholder="密码" show-password></el-input>
					</el-form-item>
					<el-form-item>
						<el-checkbox style="float: left" label="记住密码" v-model="checked"></el-checkbox>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" style="width: 400px" @click="loading()"> 登录 </el-button>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" style="width: 400px" @click="register()"> 注册 </el-button>
					</el-form-item>
				</el-form>
			</div>
		</div>
	</div>
</template>

<script>
	import sha256 from 'js-sha256'
	import axios from 'axios'
	import Qs from 'qs'
	export default {
		name: 'Loading',
		data() {
			return {
				token: '',
				user_id: '',
				checked: false,
				form: {
					name: '',
					password: '',
				},
			}
		},
		mounted() {
			this.getNameCookie();
			this.getIdCookier();
			if(this.user_id!==''&&this.token!==''&&this.company_id!==''&&this.modal!==''){
				this.$router.push('/mainPage/dataInformation')
			}
		},
		methods: {
			//登录函数
			loading() {
				let _this = this

				let sha256 = require("js-sha256").sha256 //这里用的是require方法，所以没用import
				var sha256password = sha256(this.form.password) //要加密的密码
				// console.log(sha256password)//这就是你加密之后的密码

				var way;
				if (/^(0|86|17951)?(13[0-9]|15[012356789]|17[0-8]|18[0-9]|14[5679]|19[189]|16[56])[0-9]{8}$/.test(this.form.name)) {
					way = 1;
				} else if (/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+$/.test(this.form.name)) {
					way = 2;
				} else {
					way = 3;
					console.log('输入账号非手机号或者邮箱');
				}
				// console.log(way);

				if (this.form.name === '' || this.form.password === '') {
					alert('账号或密码不能为空')
				} else {
					if (_this.checked) {
						_this.setNameCookie(_this.form.name, _this.form.password, 7)
					} else {
						_this.clearNameCookie()
					}
					
					var url = 'https://site.maple.today/IOTplatform/ServerMain';
					let data = {
						"requestCode": "002",
						"account": this.form.name,
						"loginway": way,
						"password": sha256password,
					};
					console.log(Qs.stringify(data));
					var AXIOS = axios.create({
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded'
						}
					});
					AXIOS.post(url, Qs.stringify(data))
						.then(res => {
							if (res.data.result === "1") {
								console.log('登录成功');
								console.log(res);
								_this.setIdCookie(res.data.user_id,res.data.token,res.data.company,res.data.modal,this.form.password,1);
								// _this.$router.push({
								// 	name:'MainPage',
								// })
								_this.$router.push('/mainPage/dataInformation')
							} else if (res.data.result === "0") {
								alert('该用户未注册')
							} else if (res.data.result === "2") {
								alert('密码错误')
							}
							else{
								console.log(res)
							}
						})
						.catch(error => console.log(error));
				}
			},
			
			//注册函数
			register() {
				this.$router.push({
					name: 'Register',
				})
			},
			
			//设置setNameCookie
			setNameCookie(c_name, c_pwd, exdays) {
				var exdate = new Date() //获取时间
				exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays) //保存的天数
				//字符串拼接cookie
				window.document.cookie = 'userName' + '=' + c_name + ';path=/;expires=' + exdate.toGMTString()
				window.document.cookie = 'userPwd' + '=' + c_pwd + ';path=/;expires=' + exdate.toGMTString()
			},
			setIdCookie(c_id,c_token,c_companyid,c_modal,c_password,exdays){
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
				window.document.cookie = 'password' + '=' + c_password + ';path=/;expires=' + exdate.toGMTString()
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
							this.form.name = arr2[1] //保存到保存数据的地方
						}
						if (arr2[0] === 'userPwd') {
							this.form.password = arr2[1]
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
				this.setIdCookie('', '','','','', -1) //修改2值都为空，天数为负1天就好了
			},
		},
	}
</script>

<style>
	.loginBox {
		position: absolute;
		height: 100%;
		width: 100%;
		/* background: pink; */
		margin: 0;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.loginContainer {
		width: 480px;
		background: white;
		display: flex;
		flex-direction: column;
		align-items: center;
		border-radius: 6px;
	}

	h2 {
		margin-bottom: 50px;
		margin-top: 50px;
	}

	.login {
		width: 400px;
		margin-bottom: 50px;
	}
</style>
