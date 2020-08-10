{#if type === "main"}
  <Navbar noShadow class="navbar-main"> 
    <NavLeft>
      <Link on:click={() => firstPage ? quit() : f7.sheet.close()} class="back">
        <SVGIcon element="navbar" name="left-arrow" size="24" />
      </Link>
    </NavLeft>

    <NavTitle>
      {#if title === undefined} 
        <div on:click={search} class="text {searchInput === "" ? "active" : ""}">{appName}</div>
        <input 
           bind:value={searchText}
           on:keydown={(e) => e.key === "Enter" ? search() : null}
           class="header-search {searchInput}" id="search-{id}" 
           type="text" autocomplete="on" 
           placeholder={searchPlaceholder}
        />
      {:else}
        {title}
      {/if}
    </NavTitle>

    <NavRight>
      {#if title === undefined} 
        <Link on:click={search}>
          <SVGIcon element="navbar" name="magnifier" size="24" />
        </Link>
      {/if}
      {#if showMenu} 
        <Link popoverOpen=".popover-menu">
          <SVGIcon element="navbar" name="menu-8" size="24" />
        </Link>
      {:else}
        <Link></Link>
      {/if}
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
  import { _ } from 'svelte-i18n';

  export let f7router;

  export let type = "main";
  export let searchOpened = false;
  export let title;
  export let popupName;
  export let firstPage;
  export let showMenu = true;

  let searchPlaceholder = $_('search.placeholder');
  let searchText = "";
  let searchInput = searchOpened ? "active" : "";
  let id = Date.now();


  function search() {
    if (searchInput === "") {
      searchInput = "active";
      setTimeout(() => { document.getElementById(`search-${id}`).focus() }, 500);
    } else {
      if (searchText === "") {
        searchInput = "";
      } else {
        f7router.navigate('/Search', { reloadCurrent: searchOpened, props: { query: searchText } });
        resetSearch();
      }
    }
  }

  function resetSearch() {
    searchPlaceholder = searchText;
    searchText = "";
    searchInput = searchOpened ? "active" : "";
    document.activeElement.blur();
  }

  function quit() {
    f7.dialog.confirm($_('dialog.exit.text'), $_('dialog.exit.title'), () => window.navigator.app.exitApp())
  }
</script>
