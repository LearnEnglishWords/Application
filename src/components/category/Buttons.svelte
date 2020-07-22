{#if $collectionData.id === Collections.PERSONAL.id}

  <div class="personal-navigation {$categoryData.categoryDialogOpened ? "opened" : ""}">
    <Row noGap>
      <Col class="ripple {$categoryData.isSelectedOneCategory > 0 ? 'active' : 'inactive'}">
        <Button class="edit" on:click={() => dispatch('editClick')}>{$_('category_list.buttons.edit')}</Button>
      </Col>
      <Col class="ripple {$categoryData.isSelectedOneCategory > 0 ? 'active' : 'inactive'}"> 
        <Button class="continue" on:click={() => dispatch('continueClick')}>{$_('category_list.buttons.continue')}</Button>
      </Col>
    </Row>
    <Col class="ripple add-button {$categoryData.isSelectedOneCategory > 0 ? 'inactive' : 'active'}" 
         on:click={() => $categoryData.selectedCategories.length === 0 ? $categoryData.categoryDialogOpened = !$categoryData.categoryDialogOpened : null}
         >
      {#if !$categoryData.isSelectedOneCategory && $categoryData.selectedCategories.length > 0}
        <Button class="page-button button-next" on:click={() => dispatch('continueClick')}>{$_('category_list.buttons.continue')}</Button>
      {:else}
        <Button class="add">{$_('category_list.buttons.add')}</Button>
      {/if}
    </Col>
    <Row noGap class="{$categoryData.categoryDialogOpened ? "opened" : "closed"}">
      <span class="category-name">{$_('category_list.new')}</span>
      <input bind:value={$categoryData.newCategoryText} on:keydown={(e) => e.key === "Enter" ? createCategory() : null} type="text" autocomplete="off" placeholder=""/>
      <div class="wrapper">
        <Button on:click={closeCategoryDialog}>{$_('category_list.buttons.cancel')}</Button>
        <Button on:click={createCategory}>{$_('category_list.buttons.confirm')}</Button>
      </div>
    </Row>
  </div>

{:else}

  <div class="footer-container footer-singular">
    <div class="footer-content">
      <Button class="page-button button-next" on:click={() => dispatch('continueClick')}>{$_('category_list.buttons.continue')}</Button>
    </div>
  </div>

{/if}

<script>
  import { Button, Row, Col } from 'framework7-svelte';
  import { collectionData, categoryData } from '../../js/store.js';
  import { Collections } from '../../js/utils.js';
  import CollectionStorage from '../../js/storages/collections.js';
  import Category from '../../js/entities/category.js';
  import { createEventDispatcher } from 'svelte';
  import { _ } from 'svelte-i18n';

  export let f7router;

  const dispatch = createEventDispatcher();

  function createCategory() {
    if ($categoryData.newCategoryText === "") { return }

    let collectionStorage = new CollectionStorage();
    collectionStorage.createPersonalCategory($categoryData.newCategoryText).then((cat) => {
      let category = new Category(cat.id, cat.collectionId, cat.name, cat.czechName, cat.icon);  
      $collectionData.categoryGroup.push(category);
    })

    setTimeout(() => { f7router.refreshPage() }, 500);
  }

  function closeCategoryDialog() {
    $categoryData.newCategoryText = "";
    $categoryData.categoryDialogOpened = false;
  }

</script>
