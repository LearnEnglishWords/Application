<Popup class={name}>
  <!-- Navbar -->
  <Header type="popup" popupName={name} title={category.title} />
  <!-- Header -->
  <div class="header statistics empty"></div>
  <div class="view Settings" on:click={() => activeDialog = null} >
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
        <Col class="ripple first {activeDialog === ActiveCategoryDialog.REMOVE ? 'active' : 'inactive'}" on:click={() => activeDialog = activeDialog !== ActiveCategoryDialog.REMOVE ? ActiveCategoryDialog.REMOVE : null}> <!-- přepínat class active / inactive -->
          <SVGIcon element="navigation" name="pen-01" size="16" />
          <span>{$_('category_list.buttons.edit')}</span>
        </Col>
        <Col class="ripple second {activeDialog === ActiveCategoryDialog.ADD_WORD ? 'active' : 'inactive'}" on:click={() => activeDialog = activeDialog !== ActiveCategoryDialog.ADD_WORD ? ActiveCategoryDialog.ADD_WORD : null}> <!-- přepínat class active / inactive -->
          <SVGIcon element="navigation" name="event-confirm" size="16" />
          <span>{$_('category_list.buttons.continue')}</span>
        </Col>
      </Row>
      <div class="category-add ripple third {activeDialog !== null ? 'active' : 'inactive'}" on:click={() => activeDialog = activeDialog !== ActiveCategoryDialog.EDIT ? ActiveCategoryDialog.EDIT : null}> <!-- přepínat class active / inactive -->
        <SVGIcon element="navigation" name="e-add" size="16" />
      </div>
      <Row noGap class="{activeDialog !== null ? 'active' : ''}"> <!-- Pokud .first je active, tak přidat class shown, pokud není, tak hidden -->
        {#if activeDialog === ActiveCategoryDialog.REMOVE}
          <span class="category-name">Odstranit kategorii</span>
          <div class="wrapper">
            <Button>zrušit</Button>
            <Button>potvrdit</Button>
          </div>
        {:else if activeDialog === ActiveCategoryDialog.ADD_WORD}
          <span class="category-name">nové slovíčko</span>
          <input type="text" autocomplete="off" placeholder="název"/>
          <div class="wrapper">
            <Button>zrušit</Button>
            <Button>potvrdit</Button>
          </div>
        {:else if activeDialog === ActiveCategoryDialog.EDIT}   
          <span class="category-name">Přejmenovat kategorii</span>
          <input type="text" autocomplete="off" placeholder="název"/>
          <div class="wrapper">
            <Button>zrušit</Button>
            <Button>potvrdit</Button>
          </div>    
        {/if}
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
