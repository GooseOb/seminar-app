<script lang="ts">
	import { isPathnameStart } from '$lib/pathname';

	const { items }: { items: { name: string; href: string }[] } = $props();

	let underline: HTMLElement;
	let activeElement = $state<HTMLAnchorElement | null>(null);

	$effect(() => {
		if (!activeElement) return;
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
				{#if isPathnameStart(href)}
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
