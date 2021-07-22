import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()

let baseUrl = "http://localhost:8080/mywork"
Vue.prototype.url = {
	register: baseUrl + "/user/register",
	login: baseUrl + "/user/login",
	checkin: baseUrl + "/checkin/checkin",
	createFaceModel: baseUrl + "/checkin/createFaceModel",
	validCanCheckIn: baseUrl + "/checkin/validCanCheckIn",
	searchTodayCheckIn: baseUrl + "/checkin/searchTodayCheckIn",
	searchUserSummary: baseUrl + "/user/searchUserSummary",
	searchMonthCheckIn: baseUrl + "/checkin/searchMonthCheckIn"
}

Vue.prototype.ajax = function(url, method, data, fun) {
	uni.request({
		"url": url,
		"method": method,
		"header": {
			token: uni.getStorageSync("token")
		},
		"data": data,
		success: function(resp) {
			if (resp.statusCode == 401) { //未登录
				uni.redirectTo({
					url: "/pages/login/login.vue"
				})
			} else if (resp.statusCode == 200 && resp.data.code == 200) { //请求成功
				let data = resp.data
				if (data.hasOwnProperty("token")) {
					let token = data.token
					uni.setStorageSync("token", token)
				}
				fun(resp)
			} else {
				uni.showToast({ //异常
					icon: "none",
					title: resp.data
				})
			}
		},
	})
}

Vue.prototype.checkPermission = function(perms) {
	let permissions = uni.getStorageSync("permissions")
	let result = false;
	for (let one of perms) {
		if (permissions.indexOf(one) != -1) {
			result = true;
			break;
		}
	}

	return result;
}
