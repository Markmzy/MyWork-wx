<template>
	<view class="page">
		<image src="../../static/logo-3.jpg" mode="widthFix" class="logo"></image>
		<view class="add" v-if="checkPermission(['ROOT', 'MEETING:INSERT'])" @tap="toMeetingPage(null, 'insert')">
			<image src="../../static/icon-17.png" mode="widthFix" class="icon"></image>
			<text>创建会议</text>
		</view>

		<view v-for="one in list" :key="one.date">
			<view class="list-title">{{ one.date }}</view>
			<view class="item" v-for="meeting in one.list" :key="meeting.id">
				<view class="header">
					<view class="left">
						<image src="../../static/icon-11.png" mode="widthFix" class="icon" v-if="meeting.type == '线上会议'"></image>
						<image src="../../static/icon-12.png" mode="widthFix" class="icon" v-if="meeting.type == '线下会议'"></image>
						<text>{{ meeting.type }}</text>
						<text :class="meeting.status == '已结束' ? 'red' : meeting.status == '未开始' ? 'blue' : 'green'">（{{ meeting.status }}）</text>
					</view>

					<view class="right">
						<view class="update" @tap="toMeetingPage(meeting.id, 'edit')" v-if="checkPermission(['ROOT', 'MEETING:UPDATE']) && meeting.status == '未开始'">
							<text>编辑</text>
						</view>

						<view
							class="delete"
							@tap="deleteById(meeting.id, meeting.date, meeting.start)"
							v-if="checkPermission(['ROOT', 'MEETING:DELETE']) && meeting.status == '未开始'"
						>
							<text>删除</text>
						</view>
					</view>
				</view>

				<view class="content">
					<view class="title">{{ meeting.title }}</view>
					<view class="attr">
						<view class="timer">
							<image src="../../static/icon-14.png" mode="widthFix" class="icon"></image>
							<text>{{ meeting.start }} ~ {{ meeting.end }}</text>
						</view>
						<view class="creator">
							<image :src="meeting.photo" mode="widthFix" class="icon"></image>
							<text>{{ meeting.name }}</text>
						</view>
					</view>
					<view class="place" v-if="meeting.type == '线下会议'">
						<image src="../../static/icon-16.png" mode="widthFix" class="icon"></image>
						<text>{{ meeting.place }}</text>
					</view>
					<view class="desc">{{ meeting.desc }}</view>
					<button class="btn" v-if="meeting.type == '线上会议'" @tap="enter(meeting.id, meeting.uuid, meeting.date, meeting.start)">进入</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			pageNum: 1,
			pageSize: 20,
			list: [],
			isLastPage: false
		};
	},
	onShow: function() {
		let that = this;
		that.pageNum = 1;
		that.isLastPage = false;
		that.list = [];
		that.loadMeetingList(that);
	},
	onReachBottom: function() {
		let that = this;
		// if (that.isLastPage) {
		// 	return;
		// }
		that.pageNum = that.pageNum + 1;
		that.loadMeetingList(that);
	},
	methods: {
		toMeetingPage: function(id, opt) {
			uni.navigateTo({
				url: '../meeting/meeting?id=' + id + '&opt=' + opt
			});
		},
		loadMeetingList: function(ref) {
			let data = {
				pageNum: ref.pageNum,
				pageSize: ref.pageSize
			};
			ref.ajax(ref.url.searchMeetingListByPage, 'POST', data, function(resp) {
				let result = resp.data.result;
				if (result == null || result.length == 0) {
					ref.isLastPage = true;
					ref.pageNum = ref.pageNum - 1;
					if (ref.pageNum > 1) {
						uni.showToast({
							icon: 'none',
							title: '已经没有更多会议了'
						});
					}
				} else {
					for (let one of result) {
						for (let meeting of one.list) {
							if (meeting.type == 1) {
								meeting.type = '线上会议';
							} else if (meeting.type == 2) {
								meeting.type = '线下会议';
							}

							if (meeting.status == 1) {
								meeting.status = '未开始';
							} else if (meeting.status == 2) {
								meeting.status = '进行中';
							} else if (meeting.status == 3) {
								meeting.status = '已结束';
							}
						}
						if (ref.list.length > 0) {
							let last = ref.list[ref.list.length - 1];
							if (last.date == one.date) {
								last.list = last.list.concat(one.list);
							} else {
								ref.list.push(one);
							}
						} else {
							ref.list.push(one);
						}
					}
				}
			});
		},
		deleteById: function(id, date, start) {
			let now = new Date();
			let meetingDate = new Date(date + ' ' + start + ':00');
			if (now.getTime() >= meetingDate.getTime() - 20 * 60 * 1000) {
				uni.showToast({
					icon: 'none',
					title: '还有20分钟会议就开始了,无法删除'
				});
				return;
			}
			let that = this;
			uni.vibrateShort({});
			uni.showModal({
				title: '提示信息',
				content: '是否删除这个会议？',
				success: function(resp) {
					if (resp.confirm) {
						let data = {
							id: id
						};
						that.ajax(that.url.deleteMeetingById, 'POST', data, function(resp) {
							uni.showToast({
								icon: 'success',
								title: '删除成功',
								complete: function() {
									setTimeout(function() {
										that.page = 1;
										that.isLastPage = false;
										uni.pageScrollTo({
											scrollTop: '0'
										});
										that.list = [];
										that.loadMeetingList(that);
									}, 2000);
								}
							});
						});
					}
				}
			});
		}
	}
};
</script>

<style lang="less">
@import url('meeting_list.less');
</style>
