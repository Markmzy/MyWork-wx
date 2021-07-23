<template>
	<view>
		<image src="../../static/DXlogo.jpeg" mode="widthFix" class="logo"></image>
		<view class="logo-title">青岛东方鼎信在线办公系统</view>
		<view class="logo-subtitle">Ver 2021.1</view>
		<button class="login-btn" open-type="getUserProfile" @tap="login()">登陆</button>
		<view class="register-container">
			没有账号？
			<text class="register" @tap="toRegister()">立即注册</text>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	methods: {
		toRegister: function() {
			uni.navigateTo({
				url: '../register/register'
			});
		},
		login: function() {
			let that = this;
			uni.login({
				provider: 'weixin',
				success: function(resp) {
					let code = resp.code;
					that.ajax(that.url.login,'POST',{code: code},function(resp) {
							console.log(resp.data.token);
							let permissions = resp.data.permissions;
							uni.setStorageSync('permissions', permissions); //设置权限

							uni.showToast({
								title: '登陆成功',
								duration: 1500,
								success: function() {
									setTimeout(function() {
										//TODO: 跳转页面
										uni.switchTab({
											url: '../index/index'
										});
									}, 1000);
								}
							});
						},	
					);
				},
				fail: function(e) {
					console.log(e);
					uni.showToast({
						icon: 'none',
						title: '执行异常'
					});
				}
			});
		}
	}
};
</script>

<style lang="less">
@import url('login.less');
</style>
