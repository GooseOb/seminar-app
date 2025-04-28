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
						<span class="member-name">
							{student.firstname}
							{student.lastname}
							<span class="student-number">{student.login}</span>
						</span>
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
		padding: 1rem 0;
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
		flex-wrap: wrap;
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
		display: flex;
		align-items: center;
		font-weight: 600;
		font-size: 1.1rem;
		color: var(--text-color);
	}

	.student-number {
		background-color: var(--bg-color);
		color: #888;
		border-radius: 1rem;
		padding: 0 0.25rem;
		font-size: 0.8rem;
		margin-left: 0.5rem;
	}

	.member-text {
		font-size: 0.85rem;
		color: #888;
	}

	.member-actions {
		display: flex;
		gap: 0.5rem;
		margin-left: auto;
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
