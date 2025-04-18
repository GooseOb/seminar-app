<script lang="ts">
import Header from '$lib/components/Header.svelte';
import Sidebar from '$lib/components/Sidebar.svelte';
import { i18n } from '$lib/i18n';
import { isLoginPage } from '$lib/pathname';
import { ParaglideJS } from '@inlang/paraglide-sveltekit';
import type { LayoutProps } from './$types';

const { children, data }: LayoutProps = $props();

let isSidebarOpen = $state(true);
</script>

<div class="app">
	<ParaglideJS {i18n}>
		{#if isLoginPage()}
			<Header />
			<div class="workspace">
				<main class="content">
					{@render children()}
				</main>
			</div>
		{:else}
			<Header>
				<label class="btn-container">
					<input type="checkbox" class="btn" bind:checked={isSidebarOpen} />
					<span class="btn-center"></span>
				</label>
			</Header>
			<div class="workspace">
				<Sidebar isOpen={isSidebarOpen} groups={data.groups} />
				<main class="content">
					{@render children()}
				</main>
			</div>
		{/if}
	</ParaglideJS>
</div>

<style>
	:global {
		html {
			--fg-color: #fff;
			--bg-color: #333;
			--bg2-color: #222;
			--bg3-color: #111;
			--primary-color: #0d6efd;
			--danger-color: #dc3545;

			&.light {
				--fg-color: #000;
				--bg-color: #f0f0f0;
				--bg2-color: #d8d9da;
				--bg3-color: #c1c3c5;
				--primary-color: #007bff;
			}
		}
		* {
			margin: 0;
			padding: 0;
			font-family: sans-serif;
		}
		html,
		body {
			height: 100%;
		}
		body,
		input,
		button,
		textarea,
		select {
			background-color: var(--bg-color);
			color: var(--fg-color);
			font-size: 1rem;
		}
		button {
			border: none;
		}
		input,
		textarea {
			border: none;
			background-color: var(--bg2-color);
		}
		.nolist {
			list-style-type: none;
		}
		a {
			text-decoration: none;
			color: var(--fg-color);
		}
		.btn {
			padding: 0.5rem 1rem;
			background: var(--primary-color);
			color: white;
			border: none;
			border-radius: 0.2em;
			cursor: pointer;
			opacity: 0.8;
			transition: opacity 0.2s;
		}

		.btn:hover {
			opacity: 1;
		}

		.btn:disabled {
			opacity: 0.5;
			cursor: not-allowed;
		}
	}
	.app {
		height: 100%;
		display: flex;
		flex-direction: column;
	}
	.workspace {
		display: flex;
		flex-grow: 1;
		overflow: auto;
	}
	.content {
		padding: 20px;
		width: 100%;
		max-height: calc(100% - 20px);
		box-sizing: border-box;
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
	.btn:hover::before,
	.btn:hover::after,
	.btn:hover ~ .btn-center,
	.btn:focus::before,
	.btn:focus::after,
	.btn:focus ~ .btn-center {
		background-color: var(--primary-color);
	}
</style>
