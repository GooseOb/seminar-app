<script lang="ts">
	import { page } from '$app/state';

	const { children, props } = $props();
</script>

<div class="page-container">
	{#key page.url.pathname}
		<div class="page" {...props}>
			{@render children()}
		</div>
	{/key}
</div>

<style>
	.page-container {
		display: flex;
		width: 100%;
		height: 100%;
		position: relative;
	}
	.page {
		display: flex;
		width: 100%;
		height: 100%;
		flex-direction: column;
		position: absolute;
	}
</style>
