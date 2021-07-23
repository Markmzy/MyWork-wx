<template>
	<view>
		<view class="statistics">
			<image src="../../static/big-icon-1.png" class="big-icon" mode="widthFix"></image>
			<view class="report-title">
				<text class="days">{{ normal + late }}</text>
				<text class="unit">天</text>
			</view>
			<view class="sub-title"><text>本月签到</text></view>
			<view class="report">
				<view class="column green">
					<text class="column-title">正常天数</text>
					<text class="number">{{ normal }}</text>
				</view>
				<view class="column orange">
					<text class="column-title">迟到天数</text>
					<text class="number">{{ late }}</text>
				</view>
				<view class="column red">
					<text class="column-title">缺勤天数</text>
					<text class="number">{{ absent }}</text>
				</view>
			</view>
		</view>

		<view class="calendar-container"><uni-calendar :insert="true" :lunar="false" :selected="list" @monthSwitch="changeMonth" @confirm="changeMonth"></uni-calendar></view>
	</view>
</template>

<script>
import uniCalendar from '@/components/uni-calendar/uni-calendar.vue';
export default {
	components: {
		uniCalendar
	},
	onShow: function() {
		let that = this;
		let date = new Date();
		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		that.searchCheckin(that, year, month);
	},
	data() {
		return {
			list: [],
			normal: 0,
			late: 0,
			absent: 0
		};
	},
	methods: {
		searchCheckin: function(ref, year, month) {
			let that = ref;
			that.normal = 0;
			that.late = 0;
			that.absent = 0;
			that.list.length = 0;
			that.ajax(that.url.searchMonthCheckIn, 'POST', { year: year, month: month }, function(resp) {
				for (let one of resp.data.list) {
					if (one.status != null && (one.type == '节假日' || one.status != '')) {
						let color = '';
						if (one.status == '正常') {
							color = 'green';
						} else if (one.status == '迟到') {
							color = 'orange';
						} else if (one.status == '缺勤') {
							color = 'red';
						} else if (one.type == '节假日') {
							color = 'gray';
						}
						
						let info = '';
						if(one.type == '节假日'){
							info = '休息'
						}
						else{
							info = one.status;
						}
						
						that.list.push({
							date: one.date,
							info: info,
							color: color
						});
					}
				}
				that.normal = resp.data.normal;
				that.late = resp.data.late;
				that.absent = resp.data.absent;
			});
		},
		changeMonth: function(e) {
			let that = this;
			let year = e.year;
			let month = e.month;
			that.searchCheckin(that, year, month);
		}
	}
};
</script>

<style lang="less">
@import url('my_checkin.less');
</style>
