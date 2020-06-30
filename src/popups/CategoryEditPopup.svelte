<Popup class={name}>
  <!-- Navbar -->
  <Header type="popup" popupName={name} title={category.title} />
  <!-- Header -->
  <div class="view personal-page" on:click={() => activeDialog = null} >
    <List simpleList class="personal-list">
      {#each category.wordStorages["all"].getWordIds() as item}
        <ListItem title={item}></ListItem>
      {/each}
    </List>
  </div>
  <div class="personal-panel">
    <Row noGap>
      <Col class="ripple {activeDialog === ActiveCategoryDialog.REMOVE ? 'active' : 'inactive'}" on:click={() => activeDialog = activeDialog !== ActiveCategoryDialog.REMOVE ? ActiveCategoryDialog.REMOVE : null}>
        <SVGIcon element="navigation" name="delete-forever" size="16" />
        <span>Smazat</span>
      </Col>
      <Col class="ripple {activeDialog === ActiveCategoryDialog.ADD_WORD ? 'active' : 'inactive'}" on:click={() => activeDialog = activeDialog !== ActiveCategoryDialog.EDIT ? ActiveCategoryDialog.EDIT : null}>
        <SVGIcon element="navigation" name="pen-01" size="16" />
        <span>Přejmenovat</span>
      </Col>
    </Row>
    <div class="ripple button-add {activeDialog !== null ? 'active' : 'inactive'}" on:click={() => activeDialog = activeDialog !== ActiveCategoryDialog.ADD_WORD ? ActiveCategoryDialog.ADD_WORD : null}>
      <SVGIcon element="navigation" name="e-add" size="16" />
    </div>
    <Row noGap class="{activeDialog !== null ? 'opened' : ''}">
      <Col class="{activeDialog === ActiveCategoryDialog.REMOVE ? 'selected' : ''}">
        <span>Opravdu chcete kategorii odstranit? Tuto akci nelze vrátit zpět.</span>
        <div class="buttons">
          <Button class="cancel">Ne</Button>
          <Button class="confirm">Ano</Button>
        </div>
      </Col>
      <Col class="{activeDialog === ActiveCategoryDialog.ADD_WORD ? 'selected' : ''}">
        <span>Přidat slovíčko</span>
        <input type="text" autocomplete="off" placeholder="Zadejte slovíčko"/>
        <div class="buttons">
          <Button class="cancel">Zrušit</Button>
          <Button class="confirm">Potvrdit</Button>
        </div>
      </Col>
      <Col class="{activeDialog === ActiveCategoryDialog.EDIT ? 'selected' : ''}">
        <span>Přejmenovat kategorii</span>
        <div class="buttons">
          <Button class="cancel">Zrušit</Button>
          <Button class="confirm">Potvrdit</Button>
        </div>
      </Col>
    </Row>
  </div>
</Popup>

<script>
  import { Popup, Button, List, ListItem, Row, Col } from 'framework7-svelte';
  import DS from '../js/storages/data.js';
  import SVGIcon from '../components/SVGIcon.svelte';
  import Header from '../components/Header.svelte';
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
