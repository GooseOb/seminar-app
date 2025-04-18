<script lang="ts">
const {
	messages: _messages,
	doShowSenderName = true,
}: {
	messages: Message[];
	doShowSenderName?: boolean;
} = $props();

const messages: Message[] = $state(_messages);
let newMessage = $state('');
let chatContainer: HTMLDivElement;

const user = {
	id: 'user1',
	name: 'You',
} as User;

const sendMessage = () => {
	const text = newMessage.trim();
	if (text === '') return;
	const message = $state({
		id: -1,
		text,
		user,
		timestamp: new Date(),
	});

	new Promise<number>((resolve) => {
		setTimeout(() => {
			resolve(Date.now());
		}, 1000);
	}).then((id) => {
		message.id = id;
	});

	messages.push(message);
	newMessage = '';

	setTimeout(() => {
		chatContainer.scrollTop = chatContainer.scrollHeight;
	}, 0);
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
		{#each messages as message}
			<div
				class="message"
				class:self={message.user.id === user.id}
				class:pending={message.id === -1}
			>
				{#if doShowSenderName && message.user.id !== user.id}
					<div class="message-photo">
						<img src={message.user.photo || ''} alt="" />
					</div>
				{/if}
				<div class="message-content">
					{#if doShowSenderName && message.user.id !== user.id}
						<span class="user-name">{message.user.name}</span>
					{/if}
					<p>{message.text}</p>
					<span class="timestamp">
						{message.timestamp.toLocaleTimeString()}
					</span>
				</div>
			</div>
		{/each}
	</div>

	<div class="chat-input">
		<textarea
			bind:value={newMessage}
			onkeypress={handleKeyPress}
			placeholder="Type your message..."
			rows="3"
		></textarea>
		<button onclick={sendMessage} class="btn">Send</button>
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

	.message-photo {
		padding: 0.5rem;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: var(--bg2-color);
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
