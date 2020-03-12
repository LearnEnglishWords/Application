{#if type === "main"}
  <Navbar backLink {title}>
    <slot name="subnavbar"> </slot>
    <NavRight>
      <Link popoverOpen=".popover-menu">
        <Icon material="reorder" />
      </Link>
    </NavRight>
  </Navbar>
  <Menu name="popover-menu" />

{:else if type === "popup"}
  <Navbar {title}>
  <NavRight>
    <Link popupClose=".{popupName}">
      <Icon material="clear" />
    </Link>
  </NavRight>
  </Navbar>
{/if}

<script>
  import {
    Navbar, NavRight, Link,
    Popover, Icon, 
    List, ListButton, 
  } from 'framework7-svelte';
  import Menu  from './Menu.svelte';
  import { appName }  from '../js/config.js';

  export let type = "main";
  export let title = appName;
  export let popupName;
</script>
