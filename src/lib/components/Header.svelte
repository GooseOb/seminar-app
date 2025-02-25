<script lang="ts">
	let { isBtnActive = $bindable() }: { isBtnActive: boolean } = $props();
</script>

<header class="header">
	<label class="btn-container">
		<input type="checkbox" class="btn" bind:checked={isBtnActive} />
		<span class="btn-center"></span>
	</label>
	<h1 class="title">Seminarium App</h1>
</header>

<style>
	.header {
		flex-shrink: 0;
		min-height: 60px;
		display: flex;
		align-items: center;
		padding: 0 20px;
		background-color: var(--bg3-color);
	}
	.title {
		margin-left: 20px;
		font-size: 1.5rem;
	}

	.btn-container {
		position: relative;
		cursor: pointer;
	}

	.btn {
		appearance: none; /* Hide default checkbox */
		background-color: transparent;
		width: 30px;
		height: 25px;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		outline: none;
	}

	.btn::before,
	.btn::after,
	.btn-center {
		content: '';
		width: 100%;
		height: 4px;
		background-color: var(--fg-color);
		position: absolute;
		left: 0;
		transition: all 0.3s ease-in-out;
		border-radius: 2px;
	}

	.btn::before {
		top: 0;
	}

	.btn-center {
		top: 50%;
		transform: translateY(-50%);
	}

	.btn::after {
		bottom: 0;
	}

	.btn:checked::before {
		top: 50%;
		transform: translateY(-50%) rotate(45deg);
	}

	.btn:checked ~ .btn-center {
		opacity: 0;
	}

	.btn:checked::after {
		bottom: 50%;
		transform: translateY(50%) rotate(-45deg);
	}
	/* hover */
	.btn:hover::before,
	.btn:hover::after,
	.btn:hover ~ .btn-center,
	.btn:focus::before,
	.btn:focus::after,
	.btn:focus ~ .btn-center {
		background-color: var(--primary-color);
	}
</style>
