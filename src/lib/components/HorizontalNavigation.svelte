<script lang="ts">
	import { page } from '$app/state';

	const { items } = $props<{ items: { name: string; href: string }[] }>();

	let underline: HTMLElement;
	let activeElement = $state<HTMLAnchorElement | null>(null)!;

	$effect(() => {
		const { width, left } = activeElement.getBoundingClientRect();
		const parentRect = underline.parentElement!.getBoundingClientRect();
		underline.style.width = `${width}px`;
		underline.style.left = `${left - parentRect.left}px`;
	});
</script>

<nav class="horizontal-navigation">
	<ul>
		{#each items as { name, href }}
			<li>
				{#if href === page.url.pathname}
					<a {href} bind:this={activeElement} class="active">{name}</a>
				{:else}
					<a {href}>{name}</a>
				{/if}
			</li>
		{/each}
		<span class="underline" bind:this={underline}></span>
	</ul>
</nav>

<style>
	.horizontal-navigation {
		font-size: 1.25rem;
		ul {
			display: flex;
			list-style: none;
			gap: 2rem;
			font-weight: bold;
			position: relative;
		}
		a {
			text-decoration: none;
			padding-bottom: 4px;
			display: block;
		}
		.underline {
			position: absolute;
			bottom: 0;
			height: 0.15em;
			background-color: currentColor;
			border-radius: 2px;
			transition: all 0.3s ease-out;
		}
	}
</style>
