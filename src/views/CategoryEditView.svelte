<Page name="CategoryEdit">
  <!-- Navbar -->
  <Header {f7router} />

  <!-- Header -->
  <div class="view personal-page" on:click={() => activeDialog = null} >
    <div class="page-title">{$_('category_edit.words_list')}</div>
    <List simpleList class="personal-list">
      {#each category.wordStorages["all"].getWordIds() as wordText}
        <ListItem title={wordText} on:click={() => f7router.navigate('/Search', { props: { query: wordText, saveAnywhere: true } })}>
          <div class="edit-icon" on:click|stopPropagation={() => removeWord(wordText)}> 
            <SVGIcon name="i-remove" size="24" />
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
    <div class="ripple button-add {activeDialog !== null ? 'active' : 'inactive'}" on:click={() => { changeDialog(ActiveCategoryDialog.ADD_WORD) }}>
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
        <input bind:value={findWordInput} on:keydown={(e) => e.key === "Enter" ? findWord() : null} type="text" autocomplete="on" placeholder="{$_('category_edit.actions.add_word.placeholder')}"/>
        <div class="buttons">
          <Button class="cancel" on:click={closeDialog}>{$_('category_edit.actions.add_word.button.cancel')}</Button>
          <Button class="confirm" on:click={findWord}>{$_('category_edit.actions.add_word.button.confirm')}</Button>
        </div>
      </Col>
      <Col class="{activeDialog === ActiveCategoryDialog.EDIT ? 'selected' : ''}">
        <span>{$_('category_edit.actions.rename.text')}</span>
        <input bind:value={newCategoryName} on:keydown={(e) => e.key === "Enter" ? renameCategory() : null} type="text" autocomplete="off" />
        <div class="buttons">
          <Button class="cancel" on:click={closeDialog}>{$_('category_edit.actions.rename.button.cancel')}</Button>
          <Button class="confirm" on:click={renameCategory}>{$_('category_edit.actions.rename.button.confirm')}</Button>
        </div>
      </Col>
    </Row>
  </div>
</Page>

<script>
  import { f7, Page, Button, List, ListItem, Row, Col } from 'framework7-svelte';
  import { collectionData, categoryDetailData } from '../js/store.js';
  import { WordsType, openDialog } from '../js/utils.js';
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

  if (category.getStatistic(WordsType.ALL) === 0) {
    openDialog(f7, $_("dialog.empty_category.text"));
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

  function removeWord(wordText) {
    DS.getWord(wordText).then((word) => {
      $categoryDetailData.removeWord(word);
      f7router.refreshPage();
    });
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
    let selectedCategory = $collectionData.categoryGroup.categories.find((c) => c.id === category.id);
    selectedCategory.title = newCategoryName;

    DS.saveCategoryList($collectionData.id, getCategoriesData());

    closeDialog();
    f7router.back(f7router.history[f7router.history.length-2], { force: true });
  }

  function removeCategory() {
    $collectionData.categoryGroup.categories = $collectionData.categoryGroup.categories.filter((c) => c.id !== category.id);
    DS.saveCategoryList($collectionData.id, getCategoriesData());

    Object.values(WordsType).forEach((type) => DS.removeWordIdsList($collectionData.id, category.id, type));

    closeDialog();
    f7router.back(f7router.history[f7router.history.length-2], { force: true });
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
