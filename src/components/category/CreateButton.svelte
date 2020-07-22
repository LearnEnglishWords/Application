<span class="category-name">{$_('category_list.new')}</span>
<input bind:value={$categoryData.newCategoryText} on:keydown={(e) => e.key === "Enter" ? createCategory() : null} type="text" autocomplete="off" placeholder=""/>
<div class="wrapper">
  <Button on:click={closeCategoryDialog}>{$_('category_list.buttons.cancel')}</Button>
  <Button on:click={createCategory}>{$_('category_list.buttons.confirm')}</Button>
</div>

<script>
  import { Button } from 'framework7-svelte';
  import { collectionData, categoryData } from '../../js/store.js';
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
