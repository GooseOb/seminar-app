<script lang="ts">
	import StudentInvitationInputForm from './StudentInvitationInputForm.svelte';
	import StudentList from './StudentList.svelte';
	import * as m from '$lib/paraglide/messages.js';

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
		{m.add()}
	</StudentInvitationInputForm>

	<StudentList {actionButtons} {students} role="lecturer"></StudentList>
</form>
