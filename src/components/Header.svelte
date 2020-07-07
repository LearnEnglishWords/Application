{#if type === "main"}
  <Navbar noShadow class="navbar-main"> 
    <NavLeft>
      <Link on:click={() => f7.sheet.close()} class="back">
        <SVGIcon element="navbar" name="left-arrow" size="24" />
      </Link>
    </NavLeft>

    <NavTitle>
      {#if title === undefined} 
        <div class="text {searchInput === "" ? "active" : ""}">{appName}</div>
        <input bind:value={searchText} class="header-search {searchInput}" id="search" type="text" autocomplete="on" placeholder="Vyhledat...">
      {:else}
        {title}
      {/if}
    </NavTitle>

    <NavRight>
      <Link on:click={searchButton}>
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
    f7, Navbar, NavLeft, NavRight, NavTitle, Link,
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

  let searchText = "";
  let searchInput = "";

  function searchButton() {
    if (searchInput === "") {
      searchInput = "active";
      setTimeout(() => { document.getElementById("search").focus() }, 500);
    } else {
      searchText === "" ? searchInput = "" : f7router.navigate('/Search', { props: { query: searchText } });
    }
  }
</script>
