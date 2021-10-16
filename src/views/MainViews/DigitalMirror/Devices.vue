<template>

</template>

<script>
	export default {
		data() {
			return {
				height: document.documentElement.clientHeight,
				cards: [{
					name: '测试设备',
					url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
					description: 'test'
				}],
			}
		},
		methods: {
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`);
			},
			handleCurrentChange(val) {
				console.log(`当前页: ${val}`);
			},
			goToInfor() {
				this.$router.push({
					name: 'DeviceInformation'
				})
			},
			deleteRow(index, rows) {
				rows.splice(index, 1);
			},
		}
	}	
</script>

<style scoped>
	.deviceManage {
		width: 100%;
		height: 96%;
		/* background-color: ; */
	}

	.cardBox {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		width: 100%;

	}

	.box-card {
		width: 300px;
		margin-right: 10px;
		margin-bottom: 10px;
	}

	el-scrollbar. el-scrollbar_wrap {
		overflow-x: hidden;
	}
</style>