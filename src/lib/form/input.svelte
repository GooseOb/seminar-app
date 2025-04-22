<script lang="ts">
	const { type, name, label } = $props();
</script>

<div class="form-group">
	<input {type} {name} required placeholder=" " />
	<label for={name}>{label}</label>
</div>

<style>
	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		position: relative;
	}

	label {
		position: absolute;
		left: 0.75em;
		top: 50%;
		transform: translateY(-50%);
		color: var(--fg-color);
		font-size: 1em;
		pointer-events: none;
		transition: all 0.2s ease;
	}

	input {
		font-size: 1em;
		padding: 0.75em;
		border-radius: 0.5em;
		background-color: var(--bg2-color);
		color: var(--fg-color);
	}

	input:focus,
	input:not(:placeholder-shown) {
		padding-top: 1.25em;
		padding-bottom: 0.25em;
	}

	input:focus + label,
	input:not(:placeholder-shown) + label {
		top: 0.25em;
		font-size: 0.8em;
		transform: translateY(0);
	}

	input:focus {
		outline: 2px solid var(--primary-color);
	}
</style>
