<template>
	<view class="page">
		<uni-list>
			<uni-list-chat
				v-for="one in list"
				:key="one.id"
				:title="one.senderName"
				:note="one.msg"
				:avatar="one.senderPhoto"
				:badgeText="one.readFlag ? '' : 'dot'"
				badgePositon="left"
				link="navigateTo"
				:to="'../message/message?id=' + one.id + '&readFlag=' + one.readFlag + '&refId=' + one.refId"
			>
				<view class="chat-custom-right">
					<text class="chat-custom-text">{{ one.sendTime }}</text>
				</view>
			</uni-list-chat>
		</uni-list>
	</view>
</template>

<script>
import uniList from '@/components/uni-list/uni-list.vue';
import uniListItem from '@/components/uni-list-item/uni-list-item.vue';
export default {
	components: {
		uniList,
		uniListItem
	},
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
		
		//滚动到顶部
		uni.pageScrollTo({
			scrollTop: '0'
		});

		that.loadMessageList(that);
	},
	onReachBottom: function() {
		let that = this;

		that.pageNum = that.pageNum + 1;
		that.loadMessageList(that);
	},
	methods: {
		loadMessageList: function(ref) {
			let data = {
				pageNum: ref.pageNum,
				pageSize: ref.pageSize
			};

			ref.ajax(ref.url.searchMessageByPage, 'POST', data, function(resp) {
				let result = resp.data.result;
				if (result == null || result.length == 0) {
					ref.isLastPage = true;
					//回滚一页
					ref.pageNum = ref.pageNum - 1;
					uni.showToast({
						icon: 'none',
						title: '已经没有更多的消息了'
					});
				} else {
					if (ref.pageNum == 1) {
						ref.list = [];
					}

					ref.list = ref.list.concat(result);
				}
			});
		}
	}
};
</script>

<style lang="less">
@import url('message_list.less');
</style>
