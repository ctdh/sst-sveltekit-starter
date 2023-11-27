<script context='module'>
	
    // export async function load({ session }) {
    //     const user = session.user;
    //     // Do something with user
    // }
</script>
<script lang='ts'>
  import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Avatar, Dropdown, DropdownItem, DropdownHeader, DropdownDivider } from 'flowbite-svelte';
  import { LightSwitch } from '@skeletonlabs/skeleton';
  import { ChevronDownOutline } from 'flowbite-svelte-icons'
  import { menuItems } from '$lib/json/menuItems';
	import { page } from '$app/stores';
  import { userStore } from '$lib/stores/user';
  import { env } from '$env/dynamic/public';
  import { goto } from '$app/navigation';
  import type { User } from '../../../core/user';
	import { onMount } from 'svelte';
  // import { favicon } from '../../static/favicon.png';
  // import { usericon } from '../../static/usericon.png';

  let user: User
  let userName: string | null | undefined
  let email: string | null | undefined
  let activeUrl: string | undefined
  let appName = env.PUBLIC_APP_NAME;
  let userStoreValue: string;

  onMount(async () => {
    activeUrl = $page.url.pathname;
      user = $userStore;
      // Subscribe to the userStore and log whenever its value changes
      activeUrl = $page.url.pathname; 
      email = $userStore ? $userStore.email : null;
  })
  </script>
<Navbar fluid={true}>
  <NavBrand href="/">
    <img src="/favicon.png" class="mr-3 h-6 sm:h-9" alt="Flowbite Logo" />
    <span class="
      self-center 
      whitespace-nowrap 
      text-xl font-semibold 
      text-primary-500 dark:text-secondary-300">
      {appName}
    </span>
  </NavBrand>
  <div class="flex items-center md:order-2">
    <LightSwitch class="mx-4"/>
    <Avatar class="cursor-pointer" id="avatar-menu" src="/usericon.png" />
    <NavHamburger class="cursor-pointer" class1="w-full md:flex md:w-auto md:order-1" />
  </div>
  <NavUl >
    {#each menuItems as item}
      {#if item.name === "Settings" && item.menuItems && item.menuItems.length > 0}
        <div class="flex-end">
          <Dropdown placement="bottom" triggeredBy="#avatar-menu">
            <DropdownHeader>
              <span class="block text-sm">{#if user}{user}{/if}</span>
              <span class="block truncate text-sm font-medium">{#if email}{email}{/if}</span>
            </DropdownHeader>
          {#each item.menuItems as subMenuItem}
            <DropdownItem href={subMenuItem.link} class="right-0">
              {subMenuItem.name}
            </DropdownItem>
          {/each}
          <DropdownDivider />
          <DropdownItem href="/logout">
            <a href="/logout" on:click|preventDefault={() => goto('/logout')}>
            Logout
          </DropdownItem>
          </Dropdown>
        </div>
      {:else}
        {#if item.menuItems}
          <NavLi class="cursor-pointer" href={item.link}>
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
          <NavLi  href={item.link} class="cursor-pointer">
            {item.name}
          </NavLi>
        {/if}
      {/if}
    {/each}
  </NavUl>
</Navbar>