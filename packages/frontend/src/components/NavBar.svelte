<script lang='ts'>

  import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Avatar, Dropdown, DropdownItem, DropdownHeader, DropdownDivider } from 'flowbite-svelte';
  import { ChevronDownOutline } from 'flowbite-svelte-icons'
  import { page } from '$app/stores';
  import { LightSwitch } from '@skeletonlabs/skeleton';
  import { userStore } from '../lib/stores/user';
  import { menuItems } from '../lib/json/menuItems';
	import { logoutSession } from '../lib/newValidate';
  
  let user: string | null
  let email: string | null | undefined
  let activeUrl: string | undefined

  $: {
    user = $userStore?.firstName + " " + $userStore?.lastName;
    email = $userStore?.email;
    activeUrl = $page.url.pathname;
  }

  function logout(event: Event) {
    event.preventDefault();
    user = "bye";
    logoutSession();
  }

  </script>

<Navbar fluid={true}>

  <NavBrand href="/">
    <img src="favicon.png" class="mr-3 h-6 sm:h-9" alt="Flowbite Logo" />
    <span class="
    self-center 
    whitespace-nowrap 
    text-xl font-semibold 
    text-primary-500 dark:text-secondary-300">
    {import.meta.env.VITE_APP_NAME}
</span>
  </NavBrand>
  <div class="flex items-center md:order-2">
    <LightSwitch class="mx-4"/>
    <Avatar id="avatar-menu" src="favicon.png" />
    <NavHamburger class1="w-full md:flex md:w-auto md:order-1" />
  </div>
  <NavUl {activeUrl}>
    {#each menuItems as item}
      {#if item.name === "Settings" && item.menuItems && item.menuItems.length > 0}
        <div class="flex-end">
          <Dropdown placement="bottom" triggeredBy="#avatar-menu">
            <DropdownHeader>
              <span class="block text-sm">{user}</span>
              <span class="block truncate text-sm font-medium">{email}</span>
            </DropdownHeader>
          {#each item.menuItems as subMenuItem}
            <DropdownItem href={subMenuItem.link} class="right-0">
              {subMenuItem.name}
            </DropdownItem>
          {/each}
          <DropdownDivider />
          <DropdownItem href="/" on:click={logout}>
            Logout
          </DropdownItem>
          </Dropdown>
        </div>
      {:else}
        {#if item.menuItems}
          <NavLi class="cursor-pointer">
            {item.name}
            <ChevronDownOutline class="
            w-3 h-3 ml-2 text-primary-800 dark:text-white inline" />
          </NavLi>
            <Dropdown class="w-44 z-20">
            {#each item.menuItems as subMenuItem}
              <DropdownItem href={subMenuItem.link}>
                {subMenuItem.name}
              </DropdownItem>
          {/each} 
            </Dropdown>
          {:else}
          <NavLi href={item.link} class="cursor-pointer">
            {item.name}
          </NavLi>
        {/if}
      {/if}
    {/each}
  </NavUl>
</Navbar>
