<template>
	<div>
		<!-- 面包屑导航区域 -->
		<el-breadcrumb separator-class="el-icon-arrow-right" style="height: 4%;">
		  <el-breadcrumb-item>首页</el-breadcrumb-item>
		  <el-breadcrumb-item :to="{name:'DataInformation'}">数据概览</el-breadcrumb-item>
		  <el-breadcrumb-item>平台概览详情</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="ViewDetails2">
			<el-divider content-position="left">平台概览详情</el-divider>
			<!-- 卡片视图区域 -->
			<el-card>
				<!-- 搜索框 -->
				<el-row gutter="8">
					<el-col :span="12">
						<el-input placeholder="请输入内容" >
							<el-button slot="append" icon="el-icon-search" ></el-button>
						</el-input>
					</el-col>
				</el-row>
				<!-- 平台概览列表 -->
				<el-table :data="platformlist" stripe style="width: 901px" border>
					<el-table-column type="index" label="#" width="100px"></el-table-column>
				    <el-table-column prop="name" label="名称" width="400px"></el-table-column>
				    <el-table-column prop="status" label="状态" width="400px"></el-table-column>
					<!-- 后期数据名应修改prop -->
				</el-table>
			</el-card>
		</div>
	</div>
</template>

<script>
export default{
	name: 'ViewDetails2',
	data() {
		return {
			platformlist: [{
				name: '数据流1',
				status: 'running'
			},{
				name: '数据流2',
				status: 'unrunning'
			},{
				name: '数据流3',
				status: 'alert'
			}]
		}
	},
	methods:{
	}
}	
</script>

<style scoped>
.ViewDetails2{/* 原workspack */
	width: 100%;
	height: 96%;
	/* background-color: antiquewhite;
	border: black;
	border-width: 1px;
	border-style: solid; */
}
.el-card{
	margin-top: 20px;
	margin-left: 20px;
}
.el-table{
	margin-top: 15px;
}
</style>
