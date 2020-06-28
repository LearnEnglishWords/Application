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
      <div class="personal-edit">
      <Row noGap>
        <Col class="ripple first {activeDialog === ActiveCategoryDialog.REMOVE ? 'active' : 'inactive'}" on:click={() => activeDialog = ActiveCategoryDialog.REMOVE}> <!-- přepínat class active / inactive -->
          <SVGIcon element="navigation" name="pen-01" size="16" />
          <span>{$_('category_list.buttons.edit')}</span>
        </Col>
        <Col class="ripple second {activeDialog === ActiveCategoryDialog.ADD_WORD ? 'active' : 'inactive'}" on:click={() => activeDialog = ActiveCategoryDialog.ADD_WORD}> <!-- přepínat class active / inactive -->
          <SVGIcon element="navigation" name="event-confirm" size="16" />
          <span>{$_('category_list.buttons.continue')}</span>
        </Col>
      </Row>
      <div class="category-add ripple third {activeDialog === ActiveCategoryDialog.EDIT ? 'active' : 'inactive'}" on:click={() => activeDialog = ActiveCategoryDialog.EDIT}> <!-- přepínat class active / inactive -->
        <SVGIcon element="navigation" name="e-add" size="16" />
      </div>
      <Row noGap> <!-- Pokud .first je active, tak přidat class shown, pokud není, tak hidden -->
        <span class="category-name {activeDialog === ActiveCategoryDialog.REMOVE ? 'shown' : 'hidden'}">Odstranit kategorii</span>
        <div class="wrapper">
          <Button>zrušit</Button>
          <Button>potvrdit</Button>
        </div>
      </Row>
      <Row noGap> <!-- Pokud .second je active, tak přidat class shown, pokud není, tak hidden -->
        <span class="category-name {activeDialog === ActiveCategoryDialog.ADD_WORD ? 'shown' : 'hidden'}">nové slovíčko</span>
        <input type="text" autocomplete="off" placeholder="název"/>
        <div class="wrapper">
          <Button>zrušit</Button>
          <Button>potvrdit</Button>
        </div>
      </Row>
      <Row noGap> <!-- Pokud .third je active, tak přidat class shown, pokud není, tak hidden -->
        <span class="category-name {activeDialog === ActiveCategoryDialog.EDIT ? 'shown' : 'hidden'}">Přejmenovat kategorii</span>
        <input type="text" autocomplete="off" placeholder="název"/>
        <div class="wrapper">
          <Button>zrušit</Button>
          <Button>potvrdit</Button>
        </div>
      </Row>
    </div>
</Popup>

<script>
  import { Popup, Button, List, ListItem, Row, Col } from 'framework7-svelte';
  import DS from '../js/storages/data.js';
  import SVGIcon from '../components/SVGIcon.svelte';
  import Header from '../components/Header.svelte';
  import Footer  from '../components/Footer.svelte';
  import { _ } from 'svelte-i18n';

  export let name;
  export let category;

  let activeDialog = null;

  const ActiveCategoryDialog = {
      EDIT: 'edit',
      ADD_WORD: 'add_word',
      REMOVE: 'remove'
  }
</script>
