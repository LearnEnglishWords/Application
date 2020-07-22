<div class="personal-navigation {$categoryData.categoryDialogOpened ? "opened" : ""}">
  <Col class="ripple add-button active" on:click={() => $categoryData.selectedCategories.length === 0 ? $categoryData.categoryDialogOpened = !$categoryData.categoryDialogOpened : null}>
    {#if $categoryData.selectedCategories.length > 0}
      <Button class="page-button button-next" on:click={saveClick}>{$_('category_list.buttons.save')}</Button>
    {:else}
      <Button class="add">{$_('category_list.buttons.add')}</Button>
    {/if}
  </Col>
  <Row noGap class="{$categoryData.categoryDialogOpened ? "opened" : "closed"}">
    <CreateButton {f7router} />
  </Row>
</div>

<script>
  import { Button, Col, Row } from 'framework7-svelte';
  import { categoryData } from '../../js/store.js';
  import CreateButton from './CreateButton.svelte';
  import { _ } from 'svelte-i18n';

  export let f7router;
  export let saveWord;

 
  function saveClick() {
    for (let category of $categoryData.selectedCategories) {
      category.addWord(saveWord); 
    }
    f7router.back();
  }
</script>
