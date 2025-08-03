<script lang="ts">
	import Input from './Input.svelte';
	import StudentList from './StudentList.svelte';
	import * as m from '$lib/paraglide/messages';

	type Student = {
		firstname: string;
		lastname: string;
		login: string;
		password?: string;
	};

	const {
		currentStudent = $bindable(),
		students,
		actionButtons
	}: {
		currentStudent: Student;
		students: Student[];
		actionButtons: (student: Student) => any;
	} = $props();
</script>

<h2>Students</h2>
<Input
	type="text"
	label={m.firstName()}
	name="student_firstname"
	bind:value={currentStudent.firstname}
/>
<Input
	type="text"
	label={m.lastName()}
	name="student_lastname"
	bind:value={currentStudent.lastname}
/>
<Input
	type="text"
	label={m.studentNumber()}
	name="student_number"
	bind:value={currentStudent.login}
/>
<Input
	type="text"
	label={m.password()}
	name="student_password"
	required={false}
	bind:value={currentStudent.password}
/>

<button type="submit" class="btn"> {m.submitStudent()} </button>

<StudentList {actionButtons} {students} role="lecturer" />
