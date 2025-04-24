<div class="container">
	<a href="/register/student"> Student </a>
	<hr />
	<a href="/register/lecturer"> Lecturer </a>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		gap: 3rem;
		align-items: center;
		height: 100%;
	}
	hr {
		color: var(--fg-color);
		width: 100%;
	}
	a {
		display: flex;
		flex: 1;
		align-items: center;
		justify-content: center;
		width: 100%;
		font-size: min(15vw, 20vh);
		background-color: var(--bg2-color);
		transition: background-color 0.2s;
		border-radius: 0.2em;
	}
	a:hover {
		background-color: var(--bg3-color);
	}
</style>
