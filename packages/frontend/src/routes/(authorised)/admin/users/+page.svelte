<!-- src/routes/users/+page.svelte -->
<script lang="ts">
  /** @type {import('./$types').PageData} */
  import { Input, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Checkbox, TableSearch } from 'flowbite-svelte';
	import { onMount } from 'svelte';
  import type { User as UserType } from '../../../../../../core/user';

  // This will receive the props from +page.server.ts
  import type { ExtendedUser } from './+page.server'; 

	export let data
  let users:ExtendedUser[] = data.props.extendedUsers

  onMount(async () => {
      // Assuming you have a load function in your +page.server.ts that returns extendedUsers
      // This data will be available as a prop in your Svelte component
      // If you're fetching data here instead, adjust the fetch call accordingly
  });

  // Define your functions for deleteUser, editUser, addUser, revokeRole, assignRole here

  // Functions to handle user actions
  async function addUser() {
      // Logic to add a user
  }

  async function updateUser(user: ExtendedUser) : Promise<void>{
      user.isEditing = false;
      const userToUpdate: UserType = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            roles: user.rolesArray.join(','), // Convert rolesArray back to CSV string
        };
      try {
      //   // const apiEndpoint = env.PUBLIC_API_URL;
      // // const response = await User.createUpdate(userToUpdate);
      // } catch (error) {
      //     console.error('Network error:', error);
      // }

      // reassing users to trigger reactivity in the browser
      } catch (error) {
          console.error('Network error:', error);
      }
      users = [...users];
    }
  
  async function deleteUser(userId: string) {
      // Logic to delete a user
  }

  async function editUser(user: ExtendedUser) {
      // Logic to edit a user
  }

  async function assignRole(userId: string, role: string) {
      // Logic to assign a role
  }

  async function revokeRole(userId: string, role: string) {
      // Logic to revoke a role
  }


</script>
{#await users}
<p>Loading...</p>
{:then}

<div class="container mx-auto px-4 sm:px-6 lg:px-8">
<button class="btn btn-primary" on:click={() => addUser()}>Add User</button>
<Table items={users} striped={true} class="divide-y">
  <TableHead>
    <TableHeadCell>First Name</TableHeadCell>
    <TableHeadCell>Last Name</TableHeadCell>
    <TableHeadCell>Email</TableHeadCell>
    <TableHeadCell>Roles</TableHeadCell>
    <TableHeadCell>Actions</TableHeadCell>
  </TableHead>
  <TableBody>
    {#each users as user (user.id)}
    <TableBodyRow>
      {#if user.isEditing}
      <TableBodyCell class='px-2 py-0'><Input class='' id='firstName' size="sm" bind:value={user.firstName} /></TableBodyCell>
      <TableBodyCell class='px-2 py-0'><Input class='' id='lastName' size="sm" bind:value={user.lastName} /></TableBodyCell>
      <TableBodyCell class='px-2 py-0'><Input class='' id='email' size="sm" bind:value={user.email} /></TableBodyCell>
    {:else}
    <TableBodyCell>{user.firstName}</TableBodyCell>
    <TableBodyCell>{user.lastName}</TableBodyCell>
    <TableBodyCell>{user.email}</TableBodyCell>
    {/if}
      <TableBodyCell>
            <!-- Display roles -->
            {#each user.rolesArray as role}
                <span>{role}</span>{#if role !== user.rolesArray[user.rolesArray.length - 1]}, {/if}
            {/each}
        </TableBodyCell>
        <TableBodyCell>
          {#if user.isEditing}
          <button on:click={() => updateUser(user)}>Save</button>
          {:else}
          <button on:click={() => user.isEditing = true}>Edit</button>
          {/if}
          <button on:click={() => deleteUser(user.id)}>Delete</button>
        </TableBodyCell>
    </TableBodyRow>
    {/each}
  </TableBody>
</Table>
</div>
{:catch error}
<p style="color: red">{error.message}</p>
{/await}