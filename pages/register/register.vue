<template>
	<view>
		<image src="../../static/logo-2.png" mode="widthFix" class="logo"></image>
		<view class="register-container">
			<input type="text" placeholder="输入你的企业邀请码" class="register-code" maxlength="8" v-model="registerCode" />
			<view class="register-desc">管理员创建员工账号之后，你可以从你的企业邮箱中获得企业邀请码</view>
			<button class="register-btn" open-type="getUserProfile" @tap="register()">注册</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				registerCode: ''
			};
		},
		methods: {
			register: function() {
				let that = this
				console.log(that.url.register)
				if (that.registerCode == null || that.registerCode.length == 0) {
					uni.showToast({
						icon: "none",
						title: "邀请码不能为空"
					})
					return;
				} else if (/^[0-9]{8}$/.test(that.registerCode) == false) {
					uni.showToast({
						icon: "none",
						title: "邀请码必须是8位数字"
					})
					return;
				}

				uni.login({
					provider: "weixin",
					success: function(resp) {
						console.log(resp.code)
						let code = resp.code;
						//获取用户信息
						uni.getUserProfile({
							desc: "用于完善会员资料",
							success: function(resp) {
								let nickName = resp.userInfo.nickName
								let avatarUrl = resp.userInfo.avatarUrl
								console.log(nickName)
								console.log(avatarUrl)
								let data = {
									code: code,
									nickname: nickName,
									photo: avatarUrl,
									registerCode: that.registerCode
								}

								that.ajax(that.url.register, "POST", data, function(resp) {
									let permissions = resp.data.permission;
									let token = resp.data.token;
									uni.setStorageSync('token', token);
									uni.setStorageSync('permissions', permissions);
									uni.showToast({
										title: "注册成功",
									})
									uni.switchTab({
										url: '../index/index'
									});
								})
							}
						})
					}
				})
			}
		}
	}
</script>

<style lang="less">
	@import url('register.less');
</style>
