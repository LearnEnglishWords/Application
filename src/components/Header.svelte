{#if type === "main"}
  <Navbar noShadow class="navbar-main"> 
    <NavLeft>
      <Link on:click={() => f7.sheet.close()} class="back">
        <SVGIcon element="navbar" name="left-arrow" size="24" />
      </Link>
    </NavLeft>

    <div class="navbar-title title" slot="title">
      {#if title === undefined}
        <input class="header-search" type="text" autocomplete="off" placeholder="">
      {:else}
        {title}
      {/if}
    </div>

    <NavRight>
      <Link on:click={() => f7router.navigate('/Search')}>
        <SVGIcon element="navbar" name="magnifier" size="24" />
      </Link>
      <Link popoverOpen=".popover-menu">
        <SVGIcon element="navbar" name="menu-8" size="24" />
      </Link>
    </NavRight>
  </Navbar>
  <!-- Popup -->
  <Menu name="popover-menu" />

{:else if type === "popup"}
  <Navbar {title} class="navbar-popup">
  <NavRight>
    <Link popupClose=".{popupName}">
      <SVGIcon name="e-remove" size="24" />
    </Link>
  </NavRight>
  </Navbar>
{/if}

<script>
  import {
    f7, Navbar, NavLeft, NavRight, Link,
    Popover, List, ListButton, 
  } from 'framework7-svelte';
  import Menu  from './Menu.svelte';
  import SVGIcon from '../components/SVGIcon.svelte';
  import SearchView  from '../views/SearchView.svelte';
  import { appName }  from '../js/config.js';

  export let f7router;

  export let type = "main";
  export let title;
  export let popupName;
</script>
