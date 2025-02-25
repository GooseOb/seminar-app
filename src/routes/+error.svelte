<script lang="ts">
	import { page } from '$app/state';
</script>

<main>
	<h1 class="status">{page.status}</h1>
	<p class="msg">{page.error?.message}</p>
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
	}
	.status {
		font-size: 5rem;
		margin-bottom: 1rem;
	}
	.msg {
		font-size: 2rem;
	}
</style>
