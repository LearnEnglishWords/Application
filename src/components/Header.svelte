{#if type === "main"}
  <Navbar noShadow class="navbar-main"> 
    <!-- Left -->
    <NavLeft>
      <Link class="back">
        <SVGIcon name="left-arrow" size="24" tag="navbar" />
      </Link>
    </NavLeft>
    <!-- Title -->
    <slot name="title"></slot>
    <!-- Right -->
    <NavRight>
      <Link popoverOpen=".popover-menu">
        <SVGIcon name="menu-8" size="24" tag="navbar" />
      </Link>
    </NavRight>
  </Navbar>
  <!-- Popup -->
  <Menu name="popover-menu" />

{:else if type === "popup"}
  <Navbar {title} data-type="popup">
  <NavRight>
    <Link popupClose=".{popupName}">
      <Icon material="clear" />
    </Link>
  </NavRight>
  </Navbar>
{/if}

<script>
  import {
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
