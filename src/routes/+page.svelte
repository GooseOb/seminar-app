<script>
	import * as m from '$lib/paraglide/messages';
</script>

<div class="container">
	<h1>{m.mainTitle()}</h1>
	<h2>{m.mainContent()}</h2>
</div>

<style>
	.container {
		display: flex;
		gap: 2rem;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
	}
</style>
