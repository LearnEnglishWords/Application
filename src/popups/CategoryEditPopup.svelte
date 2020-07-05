<Popup class={name}>
  <!-- Navbar -->
  <Header type="popup" popupName={name} title={category.title} />
  <!-- Header -->
  <div class="view personal-page" on:click={() => activeDialog = null} >
    <div class="page-title">{$_('category_edit.words_list')}</div>
    <List simpleList class="personal-list">
      {#each category.wordStorages["all"].getWordIds() as item}
        <ListItem title={item}>
          <div class="edit-icon"> <!-- tu na DIV přidej onclick - tlačítko -->
            <SVGIcon name="n-edit" size="24" />
          </div>
        </ListItem>
      {/each}
    </List>
  </div>
  <div class="personal-panel">
    <Row noGap>
      <Col class="ripple {activeDialog === ActiveCategoryDialog.REMOVE ? 'active' : 'inactive'}" on:click={() => changeDialog(ActiveCategoryDialog.REMOVE)}>
        <SVGIcon element="navigation" name="delete-forever" size="16" />
        <span>{$_('category_edit.actions.remove.button_text')}</span>
      </Col>
      <Col class="ripple {activeDialog === ActiveCategoryDialog.ADD_WORD ? 'active' : 'inactive'}" on:click={() => changeDialog(ActiveCategoryDialog.EDIT)}>
        <SVGIcon element="navigation" name="pen-01" size="16" />
        <span>{$_('category_edit.actions.rename.button_text')}</span>
      </Col>
    </Row>
    <div class="ripple button-add {activeDialog !== null ? 'active' : 'inactive'}" on:click={() => changeDialog(ActiveCategoryDialog.ADD_WORD)}>
      <SVGIcon element="navigation" name="e-add" size="16" />
    </div>
    <Row noGap class="{activeDialog !== null ? 'opened' : ''}">
      <Col class="{activeDialog === ActiveCategoryDialog.REMOVE ? 'selected' : ''}">
        <span>{$_('category_edit.actions.remove.text')}</span>
        <div class="buttons">
          <Button class="cancel">{$_('category_edit.actions.remove.button.cancel')}</Button>
          <Button class="confirm">{$_('category_edit.actions.remove.button.confirm')}</Button>
        </div>
      </Col>
      <Col class="{activeDialog === ActiveCategoryDialog.ADD_WORD ? 'selected' : ''}">
        <span>{$_('category_edit.actions.add_word.text')}</span>
        <input type="text" autocomplete="off" placeholder="{$_('category_edit.actions.add_word.placeholder')}"/>
        <div class="buttons">
          <Button class="cancel">{$_('category_edit.actions.add_word.button.cancel')}</Button>
          <Button class="confirm">{$_('category_edit.actions.add_word.button.confirm')}</Button>
        </div>
      </Col>
      <Col class="{activeDialog === ActiveCategoryDialog.EDIT ? 'selected' : ''}">
        <span>{$_('category_edit.actions.rename.text')}</span>
        <input type="text" autocomplete="off" placeholder="{$_('category_edit.actions.rename.placeholder')}"/>
        <div class="buttons">
          <Button class="cancel">{$_('category_edit.actions.rename.button.cancel')}</Button>
          <Button class="confirm">{$_('category_edit.actions.rename.button.confirm')}</Button>
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
  
  function changeDialog(newActiveDialog) {
    if (activeDialog === null) {
      activeDialog = newActiveDialog;
    } else if (activeDialog === newActiveDialog) {
      activeDialog = null;
    } else {
      activeDialog = null;
      setTimeout(() => { activeDialog = newActiveDialog }, 350);
    }
  }
</script>
