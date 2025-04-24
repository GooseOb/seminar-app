<script lang="ts">
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();
	const {
		members: { students, lecturer }
	} = data;
</script>

<div class="members-container">
	<div class="member-list">
		<div class="member-card">
			{#if lecturer.photo}
				<img src={lecturer.photo} alt="" class="photo" />
			{:else}
				<div class="photo-placeholder">{lecturer.firstname[0]}</div>
			{/if}
			<div class="member-info">
				<span class="member-name">{lecturer.firstname} {lecturer.lastname}</span
				>
				<span class="member-text"> Lecturer </span>
			</div>
		</div>
		{#if data.role === 'lecturer'}
			<button class="btn add"> Add </button>
		{/if}
		{#if students.length === 0}
			<div class="message">No students found in this group.</div>
		{:else}
			{#each students as student}
				<div class="member-card">
					{#if student.photo}
						<img src={student.photo} alt="" class="photo" />
					{:else}
						<div class="photo-placeholder">{student.firstname[0]}</div>
					{/if}
					<div class="member-info">
						<span class="member-name"
							>{student.firstname} {student.lastname}</span
						>
						<span class="member-text">
							{student.projectName}
						</span>
					</div>
					{#if data.role === 'lecturer'}
						<div class="member-actions">
							{#if student.projectId}
								<a href={`/projects/${student.projectId}`} class="btn">
									Project
								</a>
							{/if}
							<button class="btn danger"> Remove </button>
						</div>
					{/if}
				</div>
			{/each}
		{/if}
	</div>
</div>

<style>
	.members-container {
		display: flex;
		flex-direction: column;
		padding: 1rem;
		overflow-y: auto;
		max-height: 100%;
		box-sizing: border-box;
	}

	.member-list {
		flex: 1;
		overflow-y: auto;
	}

	.member-card {
		display: flex;
		align-items: center;
		padding: 1rem;
		margin-bottom: 0.5rem;
		background: var(--bg2-color);
		border-radius: 8px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		transition: transform 0.2s;
	}

	.photo {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		margin-right: 1rem;
		object-fit: cover;
	}

	.photo-placeholder {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		margin-right: 1rem;
		background: var(--primary-color);
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: bold;
		text-transform: uppercase;
	}

	.member-info {
		display: flex;
		flex-direction: column;
	}

	.member-name {
		font-weight: 600;
		font-size: 1.1rem;
		color: var(--text-color);
	}

	.member-text {
		font-size: 0.85rem;
		color: #666;
	}

	.member-actions {
		display: flex;
		gap: 0.5rem;
		margin-left: auto;
	}

	.danger {
		background: var(--danger-color);
	}

	.add {
		margin-bottom: 1rem;
		padding: 1rem;
		width: 100%;
		border-radius: 8px;
	}

	.message {
		text-align: center;
		padding: 2rem;
		color: var(--text-color);
		font-size: 1.1rem;
	}
</style>
