<Popup class={name}>
  <!-- Navbar -->
  <Header type="popup" popupName={name} title={category.title} />
  <!-- Header -->
  <div class="header statistics empty"></div>
  <div class="view Settings">
    <label for="name">Nazev:</label> <input id="name"> <Button> Ulozit nazev </Button>
    <Button class="page-button button-show"> Odstranit kategorii </Button>

    <List simpleList>
      {#each category.wordStorages["all"].getWordIds() as item}
        <ListItem title={item}></ListItem>
      {/each}
    </List>

    <Button class="page-button button-show"> Přidat slovíčko </Button>
    <Footer />
  </div>
</Popup>

<script>
  import { Popup, Button, List, ListItem } from 'framework7-svelte';
  import DS from '../js/storages/data.js';
  import Header from '../components/Header.svelte';
  import Footer  from '../components/Footer.svelte';
  import { _ } from 'svelte-i18n';

  export let name;
  export let category;

</script>
