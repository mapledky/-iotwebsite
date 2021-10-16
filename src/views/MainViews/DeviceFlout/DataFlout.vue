<template>
	<div>
		<el-breadcrumb separator-class="el-icon-arrow-right" style="height: 4%;">
		  <el-breadcrumb-item>首页</el-breadcrumb-item>
		  <el-breadcrumb-item>设备数据流</el-breadcrumb-item>
		  <el-breadcrumb-item>平台数据流</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="DataFlout">
			<div class="StreamSets">
				<a href="http://116.63.40.126:18630" style="color: #f16baa; font-size: 20px;" 
					onclick="return confirm('即将跳转至StreamSets登陆平台\n初始登录账号为用户id,初始密码为123456\nps:用户id可前往个人详情页面查阅\n密码可前往设置页面修改');" >
					点击查看平台概览详情
				</a>
			</div>
		</div>
	</div>
</template>
<style>
	.DataFlout{
		width: 100%;
		height: 96%;
		/* background-color: antiquewhite; */
	/* 	border: black;
		border-width: 1px;
		border-style: solid; */
	}
	.StreamSets{
		/* width: 100%; */
		height: 10%;
		/* border: 20px solid antiquewhite; */
		/* background-color: #747474; */
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 50px;
		/* padding-left: 450px; */
		/* padding-top: 30px; */
	}
</style>