<Page name="CategoryEdit">
  <!-- Navbar -->
  <Header>
    <div class="navbar-title title" slot="title">{$_('app_name')}</div>
  </Header>
  <!-- Header -->
  <div class="header statistics empty"></div>
  <div class="view Settings">
    <label for="name">Nazev:</label> <input id="name"> <Button> Ulozit nazev </Button>
    <Button class="page-button button-show"> Odstranit kategorii </Button>

    <List simpleList>
      {#each $categoryEditData.wordStorages["all"].getWordIds() as item}
        <ListItem title="{item}"></ListItem>
      {/each}
    </List>

    <Button class="page-button button-show"> Přidat slovíčko </Button>
    <Footer />
  </div>
</Page>

<script>
  import { Page, Button, List, ListItem } from 'framework7-svelte';
  import { categoryEditData } from '../js/store.js';
  import DS from '../js/storages/data.js';
  import Header from '../components/Header.svelte';
  import Footer  from '../components/Footer.svelte';
  import { _ } from 'svelte-i18n';

</script>
