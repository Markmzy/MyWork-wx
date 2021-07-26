<template>
	<view class="page">
		<view class="notify-container" @tap="toPage('消息列表', '../message_list/message_list')" v-if="unreadRows > 0">
			<view class="notify-title">
				<image src="../../static/icon-1.png" mode="widthFix" class="notify-icon"></image>
				消息提醒
			</view>
			<view class="notify-content">您有{{ unreadRows }}条未读消息</view>
			<image src="../../static/icon-2.png" mode="widthFix" class="more-icon"></image>
		</view>

		<swiper circular="true" autoplay="true" interval="5000" duration="500" indicator-dots="indicatorDots" class="swiper">
			<swiper-item><image mode="widthFix" src="https://zhiyuem1-1257317681.cos.ap-shenzhen-fsi.myqcloud.com/swiper/1.jpeg"></image></swiper-item>
			<swiper-item><image mode="widthFix" src="https://zhiyuem1-1257317681.cos.ap-shenzhen-fsi.myqcloud.com/swiper/2.jpeg"></image></swiper-item>
			<swiper-item><image mode="widthFix" src="https://zhiyuem1-1257317681.cos.ap-shenzhen-fsi.myqcloud.com/swiper/3.jpeg"></image></swiper-item>
			<swiper-item><image mode="widthFix" src="https://zhiyuem1-1257317681.cos.ap-shenzhen-fsi.myqcloud.com/swiper/4.jpeg"></image></swiper-item>
			<swiper-item><image mode="widthFix" src="https://zhiyuem1-1257317681.cos.ap-shenzhen-fsi.myqcloud.com/swiper/5.jpg"></image></swiper-item>
		</swiper>

		<view class="nav-container">
			<view class="nav-row">
				<view class="nav" @tap="toPage('在线签到', '../checkin/checkin')">
					<image mode="widthFix" src="../../static/nav-1.png" class="icon"></image>
					<text class="name">在线签到</text>
				</view>
				<view class="nav">
					<image src="../../static/nav-2.png" mode="widthFix" class="icon"></image>
					<text class="name">在线审批</text>
				</view>
				<view class="nav">
					<image src="../../static/nav-3.png" mode="widthFix" class="icon"></image>
					<text class="name">在线请假</text>
				</view>
				<view class="nav">
					<image src="../../static/nav-4.png" mode="widthFix" class="icon"></image>
					<text class="name">公务出差</text>
				</view>
			</view>
			<view class="nav-row">
				<view class="nav">
					<image src="../../static/nav-5.png" mode="widthFix" class="icon"></image>
					<text class="name">员工日报</text>
				</view>
				<view class="nav">
					<image src="../../static/nav-6.png" mode="widthFix" class="icon"></image>
					<text class="name">我的加班</text>
				</view>
				<view class="nav">
					<image src="../../static/nav-7.png" mode="widthFix" class="icon"></image>
					<text class="name">付款申请</text>
				</view>
				<view class="nav">
					<image src="../../static/nav-8.png" mode="widthFix" class="icon"></image>
					<text class="name">费用报销</text>
				</view>
			</view>
			<view class="nav-row">
				<view class="nav">
					<image src="../../static/nav-9.png" mode="widthFix" class="icon"></image>
					<text class="name">公告通知</text>
				</view>
				<view class="nav">
					<image src="../../static/nav-10.png" mode="widthFix" class="icon"></image>
					<text class="name">员工健康</text>
				</view>
				<view class="nav">
					<image src="../../static/nav-11.png" mode="widthFix" class="icon"></image>
					<text class="name">物品领用</text>
				</view>
				<view class="nav">
					<image src="../../static/nav-12.png" mode="widthFix" class="icon"></image>
					<text class="name">采购申请</text>
				</view>
			</view>
		</view>

		<uni-popup ref="popupMsg" type="top"><uni-popup-message type="success" :message="'接收到' + lastRows + '条消息'" :duration="3000" /></uni-popup>
	</view>
</template>

<script>
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue';
import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue';
export default {
	components: {
		uniPopup,
		uniPopupMessage,
		uniPopupDialog
	},
	data() {
		return {
			timer: null,
			unreadRows: 0,
			lastRows: 0
		};
	},
	onLoad: function() {
		let that = this;
		uni.$on('showMessage', function() {
			that.$refs.popupMsg.open();
		});

		that.ajax(that.url.refreshMessage, 'GET', null, function(resp) {
			that.unreadRows = resp.data.unreadRows;
			that.lastRows = resp.data.lastRows;
			if (that.lastRows > 0) {
				uni.$emit('showMessage');
			}
		});
	},
	onUnLoad: function() {
		uni.$off('showMessage');
	},
	onShow: function() {
		let that = this;

		//更新数据
		that.ajax(that.url.refreshMessage, 'GET', null, function(resp) {
			that.unreadRows = resp.data.unreadRows;
			that.lastRows = resp.data.lastRows;
			if (that.lastRows > 0) {
				uni.$emit('showMessage');
			}
		});

		//每5秒再次更新
		that.timer = setInterval(function() {
			that.ajax(that.url.refreshMessage, 'GET', null, function(resp) {
				that.unreadRows = resp.data.unreadRows;
				that.lastRows = resp.data.lastRows;
				if (that.lastRows > 0) {
					uni.$emit('showMessage');
				}
			});
		}, 5000);
	},
	onHide: function() {
		let that = this;
		clearInterval(that.timer);
	},
	methods: {
		toPage: function(name, url) {
			//TODO: 验证用户权限
			uni.navigateTo({
				url: url
			});
		}
	}
};
</script>

<style lang="less">
@import url('index.less');
</style>
