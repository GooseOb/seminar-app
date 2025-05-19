<script lang="ts">
	import { PUBLIC_S3_URL } from '$env/static/public';

	const {
		user
	}: {
		user: {
			id: number;
			hasPhoto?: string;
			firstname: string;
		};
	} = $props();
</script>

{#if user.hasPhoto}
	<img src={`${PUBLIC_S3_URL}/users/${user.id}/image`} alt="" class="photo" />
{:else}
	<div class="photo placeholder">{user.firstname[0]}</div>
{/if}

<style>
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
