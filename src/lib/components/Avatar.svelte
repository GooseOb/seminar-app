<script lang="ts">
	const {
		user
	}: {
		user: {
			photo?: string;
			firstname: string;
		};
	} = $props();
</script>

{#if user.photo}
	<img src={user.photo} alt="" class="photo" />
{:else}
	<div class="photo-placeholder">{user.firstname[0]}</div>
{/if}

<style>
	.photo {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		object-fit: cover;
	}

	.photo-placeholder {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: var(--primary-color);
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: bold;
		text-transform: uppercase;
	}
</style>
