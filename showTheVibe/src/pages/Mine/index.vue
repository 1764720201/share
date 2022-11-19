<template>
	<view class="mine">
		<Header></Header>
		<Order></Order>
		<Personage></Personage>
	</view>
</template>
<script lang="ts" setup>
// 用户信息
import Header from './header/index';
// 我的订单
import Order from './order/index';
// 个人资料
import Personage from './personage/index';
</script>
<style lang="scss" scoped>
.mine {
	padding: 30rpx;
}
</style>
