<template>
	<view>
		<image src="../../static/logo-1.png" mode="widthFix" class="logo"></image>
		<view class="logo-title">MyWork企业在线办公系统</view>
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
			return {

			};
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
					provider: "weixin",
					success: function(resp) {
						let code = resp.code;
						that.ajax(that.url.login, "POST", {
							"code": code
						}, function(resp) {
							let permissions = resp.data.permissions
							uni.setStorageSync("permissions", permissions)
							uni.showToast({
								title: "登陆成功"
							})
						})

						//TODO: 跳转页面
						uni.switchTab({
							url: '../index/index'
						});

					},
					fail: function(e) {
						console.log(e)
						uni.showToast({
							icon: "none",
							title: "执行异常"
						})

					}
				})

			},
		}
	}
</script>

<style lang="less">
	@import url("login.less");
</style>
