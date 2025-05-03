<script lang="ts">
	let { name = 'password', required = true, value = $bindable() } = $props();

	let hidden = $state(true);
</script>

<div class="form-group">
	<div class="input-wrapper">
		<input
			bind:value
			type={hidden ? 'password' : 'text'}
			{name}
			{required}
			placeholder=""
			id={name}
		/>
		<label for={name}>Password</label>
		<button
			type="button"
			class="toggle-button"
			onclick={() => {
				hidden = !hidden;
			}}
			aria-label={hidden ? 'Show password' : 'Hide password'}
		>
			{#if hidden}
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
					<title>eye</title>
					<path
						d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z"
					/>
				</svg>
			{:else}
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
					<title>eye-off</title>
					<path
						d="M11.83,9L15,12.16C15,12.11 15,12.05 15,12A3,3 0 0,0 12,9C11.94,9 11.89,9 11.83,9M7.53,9.8L9.08,11.35C9.03,11.56 9,11.77 9,12A3,3 0 0,0 12,15C12.22,15 12.44,14.97 12.65,14.92L14.2,16.47C13.53,16.8 12.79,17 12,17A5,5 0 0,1 7,12C7,11.21 7.2,10.47 7.53,9.8M2,4.27L4.28,6.55L4.73,7C3.08,8.3 1.78,10 1,12C2.73,16.39 7,19.5 12,19.5C13.55,19.5 15.03,19.2 16.38,18.66L16.81,19.08L19.73,22L21,20.73L3.27,3M12,7A5,5 0 0,1 17,12C17,12.64 16.87,13.26 16.64,13.82L19.57,16.75C21.07,15.5 22.27,13.86 23,12C21.27,7.61 17,4.5 12,4.5C10.6,4.5 9.26,4.75 8,5.2L10.17,7.35C10.74,7.13 11.35,7 12,7Z"
					/>
				</svg>
			{/if}
		</button>
	</div>
</div>

<style>
	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		position: relative;
	}

	.input-wrapper {
		position: relative;
		display: flex;
	}

	input {
		font-size: 1em;
		padding: 0.75em 2.5em 0.75em 0.75em;
		border-radius: 0.5em;
		background-color: var(--bg2-color);
		color: var(--fg-color);
		width: 100%;
		border: none;
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

	.toggle-button {
		position: absolute;
		right: 0.5em;
		top: 0;
		height: 100%;
		background: none;
		border: none;
		border-radius: 0.5em;
		color: var(--fg-color);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1;
		transition: opacity 0.2s ease;
		opacity: 0.8;
		padding: 0 2%;
	}

	svg {
		height: 60%;
		fill: currentColor;
	}

	.toggle-button:hover {
		opacity: 1;
	}

	input:focus,
	input:not(:placeholder-shown) {
		padding-top: 1.25em;
		padding-bottom: 0.25em;
		padding-right: 2.5em;
	}

	input:focus + label,
	input:not(:placeholder-shown) + label {
		top: 0.5em;
		font-size: 0.8em;
		transform: translateY(0);
	}

	input:focus {
		outline: 2px solid var(--primary-color);
	}
</style>
