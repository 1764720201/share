<template>
	<view class="homepage">
		<UserInfo></UserInfo>
		<List :where="where"></List>
	</view>
</template>
<script lang="ts" setup>
import UserInfo from './userinfo/index';
const where = ref<string>();
const { getHomepage, getNotePraise, getAttention, getFans } = useStore(
	'homepage'
);
onLoad(async options => {
	where.value = `user_id=='${options.id!}'`;
	// 获取用户信息
	await getHomepage(options.id!);
	getNotePraise();
	getAttention();
	getFans();
});
</script>
<style lang="scss" scoped></style>
