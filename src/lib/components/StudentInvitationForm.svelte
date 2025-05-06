<script lang="ts">
	import StudentInvitationInputForm from './StudentInvitationInputForm.svelte';
	import StudentList from './StudentList.svelte';

	let {
		currentInviteeNumber = $bindable(),
		onsubmit = null,
		students,
		actionButtons
	} = $props();
</script>

<form {onsubmit}>
	<h2>Invite existing students</h2>

	<StudentInvitationInputForm bind:value={currentInviteeNumber}>
		Add
	</StudentInvitationInputForm>

	<StudentList {actionButtons} {students} role="lecturer"></StudentList>
</form>
