<script lang="ts">
	import { PUBLIC_S3_URL } from '$env/static/public';
	import ImageView from './ImageView.svelte';

	let isOpen = $state(false);

	const {
		user
	}: {
		user: {
			id?: number;
			hasPhoto?: boolean;
			firstname: string;
		};
	} = $props();
</script>

{#if user.hasPhoto}
	{@const src = `${PUBLIC_S3_URL}/users/${user.id!}/image`}
	<button
		onclick={() => {
			isOpen = true;
		}}
	>
		<img {src} alt="" class="photo" />
	</button>
	<ImageView bind:isOpen {src} />
{:else}
	<div class="photo placeholder">{user.firstname[0]}</div>
{/if}

<style>
	button {
		background: none;
		border: none;
		padding: 0;
		margin: 0;
		cursor: pointer;
		width: 2.5em;
		height: 2.5em;
	}
	.photo {
		width: 2.5em;
		height: 2.5em;
		border-radius: 50%;
		object-fit: cover;
	}

	.placeholder {
		background: var(--primary-color);
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: bold;
		text-transform: uppercase;
	}
</style>
