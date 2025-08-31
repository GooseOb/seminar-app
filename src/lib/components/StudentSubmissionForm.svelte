<script
	lang="ts"
	generics="Student extends Omit<OptionalNull<StudentWithProject>, 'id' | 'hasPhoto'>"
>
	import Input from './Input.svelte';
	import StudentList from './StudentList.svelte';
	import * as m from '$lib/paraglide/messages';
	import type { StudentWithProject } from '$lib/server/db/queries/group/getStudentsWithProjects';
	import type { OptionalNull } from '$lib/utils/types';

	type CurrentStudent = {
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
		currentStudent: CurrentStudent;
		students: Student[];
		actionButtons: (student: Student, index: number) => any;
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
