<template>
	<d-search-log
		:search_list_hot="search_list_hot"
		@onSearchNameApi="onSearchName"
	></d-search-log>
	<List
		v-if="search"
		:where="
			`${new RegExp(search, 'i')}.test(headline)||${new RegExp(
				search,
				'i'
			)}.test(content)`
		"
	></List>
</template>

<script lang="ts" setup>
const search_list_hot = reactive(['杭州市', '麦当劳', '肯德基', '汉堡王']);
const search = ref<string>('');
const onSearchName = (e: string) => {
	search.value = e;
};
</script>

<style lang="scss" scoped></style>
