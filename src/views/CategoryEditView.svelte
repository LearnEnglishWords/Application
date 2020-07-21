<Page name="CategoryEdit">
  <!-- Navbar -->
  <Header {f7router} />

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
    <div class="ripple button-add {activeDialog !== null ? 'active' : 'inactive'}" on:click={() => { changeDialog(ActiveCategoryDialog.ADD_WORD); document.getElementById(`add-word-input`).focus() }}>
      <SVGIcon element="navigation" name="e-add" size="16" />
    </div>
    <Row noGap class="{activeDialog !== null ? 'opened' : ''}">
      <Col class="{activeDialog === ActiveCategoryDialog.REMOVE ? 'selected' : ''}">
        <span>{$_('category_edit.actions.remove.text')}</span>
        <div class="buttons">
          <Button class="cancel" on:click={closeDialog}>{$_('category_edit.actions.remove.button.cancel')}</Button>
          <Button class="confirm" on:click={removeCategory}>{$_('category_edit.actions.remove.button.confirm')}</Button>
        </div>
      </Col>
      <Col class="{activeDialog === ActiveCategoryDialog.ADD_WORD ? 'selected' : ''}">
        <span>{$_('category_edit.actions.add_word.text')}</span>
        <input bind:value={findWordInput} on:keydown={(e) => e.key === "Enter" ? findWord() : null} id="add-word-input" type="text" autocomplete="on" placeholder="{$_('category_edit.actions.add_word.placeholder')}"/>
        <div class="buttons">
          <Button class="cancel" on:click={closeDialog}>{$_('category_edit.actions.add_word.button.cancel')}</Button>
          <Button class="confirm" on:click={findWord}>{$_('category_edit.actions.add_word.button.confirm')}</Button>
        </div>
      </Col>
      <Col class="{activeDialog === ActiveCategoryDialog.EDIT ? 'selected' : ''}">
        <span>{$_('category_edit.actions.rename.text')}</span>
        <input bind:value={newCategoryName} type="text" autocomplete="off" />
        <div class="buttons">
          <Button class="cancel" on:click={closeDialog}>{$_('category_edit.actions.rename.button.cancel')}</Button>
          <Button class="confirm" on:click={renameCategory}>{$_('category_edit.actions.rename.button.confirm')}</Button>
        </div>
      </Col>
    </Row>
  </div>
</Page>

<script>
  import { Page, Button, List, ListItem, Row, Col } from 'framework7-svelte';
  import { collectionData, categoryDetailData } from '../js/store.js';
  import { WordsType } from '../js/utils.js';
  import DS from '../js/storages/data.js';
  import SVGIcon from '../components/SVGIcon.svelte';
  import Header from '../components/Header.svelte';
  import { _ } from 'svelte-i18n';

  export let f7router;

  let category = $categoryDetailData;
  let activeDialog = null;
  let newCategoryName = category.title;
  let findWordInput = "";

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

  function getCategoriesData() {
    let categories = []
    for (let cat of $collectionData.categoryGroup.categories) {
      categories.push({
          "name": cat.name,
          "czechName": cat.title,
          "collectionId": cat.collectionId,
          "id": cat.id
      });
    }
    return categories
  }

  function renameCategory() {
    if (newCategoryName === "") { return }
    let selectedCategory = $collectionData.categoryGroup.categories.find((c) => c.id === category.id)
    selectedCategory.title = newCategoryName;

    DS.saveCategoryList($collectionData.id, getCategoriesData());

    closeDialog();
    f7router.back(f7router.previousRoute.url, { force: true })
  }

  function removeCategory() {
    $collectionData.categoryGroup.categories = $collectionData.categoryGroup.categories.filter((c) => c.id !== category.id)
    DS.saveCategoryList($collectionData.id, getCategoriesData());

    Object.values(WordsType).forEach((type) => 
      DS.removeWordIdsList($collectionData.id, category.id, type)
    );

    closeDialog();
    f7router.back(f7router.previousRoute.url, { force: true })
  }
  
  function findWord() {
    if (findWordInput !== "") {
      f7router.navigate('/Search', { props: { query: findWordInput } });
      closeDialog();
    }
  }

  function closeDialog() {
    newCategoryName = "";
    activeDialog = null;
    findWordInput = "";
    document.activeElement.blur();
  }
</script>
