{#if type === "main"}
  <Navbar noShadow class="navbar-main"> 
    <NavLeft>
      <Link on:click={() => f7.sheet.close()} class="back">
        <SVGIcon element="navbar" name="left-arrow" size="24" />
      </Link>
    </NavLeft>
    <slot name="title"></slot>
    <NavRight>
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
    f7,
    Navbar, NavLeft, NavRight, Link,
    Popover, Icon, 
    List, ListButton, 
  } from 'framework7-svelte';
  import Menu  from './Menu.svelte';
  import { appName }  from '../js/config.js';

  import SVGIcon from '../components/SVGIcon.svelte';

  export let type = "main";
  export let title = appName;
  export let popupName;
</script>
