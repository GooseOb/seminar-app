<script lang="ts">
	import Input from './Input.svelte';
	import StudentList from './StudentList.svelte';

	const { currentStudent = $bindable(), students, actionButtons } = $props();
</script>

<h2>Students</h2>
<Input
	type="text"
	label="First Name"
	name="student_firstname"
	bind:value={currentStudent.firstname}
/>
<Input
	type="text"
	label="Last Name"
	name="student_lastname"
	bind:value={currentStudent.lastname}
/>
<Input
	type="text"
	label="Student Number"
	name="student_number"
	bind:value={currentStudent.login}
/>
<Input
	type="text"
	label="Password"
	name="student_password"
	required={false}
	bind:value={currentStudent.password}
/>

<button type="submit" class="btn"> Submit student </button>

<StudentList {actionButtons} {students} role="lecturer" />
