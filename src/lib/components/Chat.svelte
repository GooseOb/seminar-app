<script lang="ts">
	import { browser } from '$app/environment';
	import Avatar from './Avatar.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import type { ReceivedMessage } from '$lib/server/db/queries/message/get';
	import { trpc } from '$lib/trpc/client.svelte';

	const {
		messages: messagesPromise,
		roomId,
		userId,
		doShowSenderName = true
	} = $props();

	let chatContainer: HTMLDivElement;

	let messages = $state<ReceivedMessage[]>([]);
	let newMessage = $state('');

	const scrollDown = () => {
		if (chatContainer) {
			queueMicrotask(() => {
				chatContainer.scrollTop = chatContainer.scrollHeight;
			});
		}
	};

	$effect(() => {
		messagesPromise.then((initialMessages) => {
			messages = initialMessages;
			scrollDown();
		});
		return () => {
			messages.length = 0;
		};
	});

	if (browser) {
		$effect(() => {
			const socket = new WebSocket(`/api/rooms/${roomId}/chat`);

			socket.addEventListener('message', (event) => {
				try {
					const data = JSON.parse(event.data);
					if (data.type === 'message') {
						messages.push({
							...data,
							createdAt: new Date(data.createdAt)
						});
						scrollDown();
					}
				} catch (err) {
					console.error('Failed to parse WebSocket message:', err);
				}
			});

			socket.addEventListener('error', (e) => {
				console.error('WebSocket error', e);
				socket.close();
			});

			return () => socket.close();
		});
	}

	const sendMessage = async () => {
		const text = newMessage.trim();
		if (!text) return;

		const tempId = -Date.now();
		messages.push({
			id: tempId,
			text,
			sender: { id: userId },
			roomId,
			createdAt: new Date()
		} as ReceivedMessage);

		trpc.room.chat.sendMessage
			.mutate({
				roomId,
				text
			})
			.then(() => {
				messages = messages.filter((m) => m.id !== tempId);
			})
			.catch((error) => {
				console.error('Failed to send message:', error);
			});

		newMessage = '';
		scrollDown();
	};

	const handleKeyPress = (event: KeyboardEvent) => {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			sendMessage();
		}
	};
</script>

<div class="chat-container">
	<div class="chat-messages" bind:this={chatContainer}>
		{#each messages as message (message.id)}
			<div
				class="message"
				class:self={message.sender.id === userId}
				class:pending={message.id < 0}
			>
				{#if doShowSenderName && message.sender.id !== userId}
					<Avatar user={message.sender} />
				{/if}
				<div class="message-content">
					{#if doShowSenderName && message.sender.id !== userId}
						<span class="user-name">
							{message.sender.firstname}
							{message.sender.lastname}
						</span>
					{/if}
					<p>{message.text}</p>
					<span class="timestamp">
						{message.createdAt.toLocaleTimeString()}
					</span>
				</div>
			</div>
		{/each}
	</div>

	<div class="chat-input">
		<textarea
			bind:value={newMessage}
			onkeypress={handleKeyPress}
			placeholder={m.typeMessage()}
			rows="3"
		></textarea>
		<button onclick={sendMessage} class="btn">{m.send()}</button>
	</div>
</div>

<style>
	.chat-container {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.chat-messages {
		flex: 1;
		overflow-y: auto;
	}

	.chat-input {
		padding: 1rem 0 0 0;
		border-top: 1px solid var(--fg-color);
		display: flex;
		gap: 1rem;
	}

	.message {
		margin: 0.5rem 0;
		display: flex;
		align-items: flex-end;
		gap: 0.5rem;
	}

	.message.self > .message-content {
		border-radius: 12px 12px 0 12px;
		margin-left: auto;
	}

	.message.pending {
		opacity: 0.5;
	}

	.message-content {
		display: flex;
		flex-direction: column;
		padding: 0.75rem;
		border-radius: 8px;
		background: var(--bg2-color);
		word-break: break-word;
		border-radius: 12px 12px 12px 0;
		max-width: 70%;
		width: fit-content;
	}

	.user-name {
		font-weight: bold;
		font-size: 0.9rem;
	}

	.timestamp {
		font-size: 0.75rem;
		opacity: 0.7;
		margin-left: auto;
	}

	p {
		margin: 0.25rem 0;
	}

	textarea {
		flex: 1;
		resize: none;
		padding: 0.5rem;
		border-radius: 4px;
	}
</style>
