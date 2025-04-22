<script lang="ts">
	let { isOpen = $bindable() } = $props();
</script>

<label>
	<input type="checkbox" bind:checked={isOpen} />
	<span></span>
</label>

<style>
	label {
		position: relative;
		cursor: pointer;
	}

	input {
		appearance: none;
		background-color: transparent;
		width: 30px;
		height: 25px;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		outline: none;
	}

	input::before,
	input::after,
	span {
		content: '';
		width: 100%;
		height: 4px;
		background-color: var(--fg-color);
		position: absolute;
		left: 0;
		transition: all 0.3s ease-in-out;
		border-radius: 2px;
	}

	input::before {
		top: 0;
	}

	span {
		top: 50%;
		transform: translateY(-50%);
	}

	input::after {
		bottom: 0;
	}

	input:checked::before {
		top: 50%;
		transform: translateY(-50%) rotate(45deg);
	}

	input:checked ~ span {
		opacity: 0;
	}

	input:checked::after {
		bottom: 50%;
		transform: translateY(50%) rotate(-45deg);
	}
	input:hover::before,
	input:hover::after,
	input:hover ~ span,
	input:focus::before,
	input:focus::after,
	input:focus ~ span {
		background-color: var(--primary-color);
	}
</style>
