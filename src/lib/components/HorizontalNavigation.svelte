<script lang="ts">
	import { isPathnameStart } from '$lib/pathname';
	import { mainResizeListeners } from '$lib/resize';

	const { items }: { items: { name: string; href: string }[] } = $props();

	let underline: HTMLElement;
	let activeElement = $state<HTMLAnchorElement | null>(null);

	const repaintUnderline = () => {
		if (!activeElement) return;
		const { width, left } = activeElement.getBoundingClientRect();
		const parentRect = underline.parentElement!.getBoundingClientRect();
		underline.style.width = `${width}px`;
		underline.style.left = `${left - parentRect.left}px`;
	};
	$effect(() => {
		mainResizeListeners.push(repaintUnderline);
		repaintUnderline();
		return () => {
			const index = mainResizeListeners.indexOf(repaintUnderline);
			if (index !== -1) {
				mainResizeListeners.splice(index, 1);
			}
		};
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
		width: 100%;
		font-size: 1.25rem;
		padding-bottom: 0.5rem;
	}
	ul {
		display: flex;
		list-style: none;
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
		height: 100%;
		background-color: var(--bg2-color);
		border-radius: 1rem;
		transition: all 0.3s ease-out;
		z-index: -1;
	}
	li {
		flex: 1;
		text-align: center;
	}
</style>
