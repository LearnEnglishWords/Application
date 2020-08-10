<div class="personal-navigation">
  <Col class="ripple add-button active">
    <Button on:click={saveClick} class="page-button button-next button-trans {$categoryData.selectedCategories.length === 0 ? 'button-gray' : ''}">
      {$_('category_list.buttons.save')}
    </Button>
  </Col>
</div>

<script>
  import { f7, Button, Col, Row } from 'framework7-svelte';
  import { categoryData } from '../../js/store.js';
  import { openDialog } from '../../js/utils.js';
  import CreateButton from './CreateButton.svelte';
  import { _ } from 'svelte-i18n';

  export let f7router;
  export let saveWord;

 
  function saveClick() {
    if ($categoryData.selectedCategories.length === 0) {
      openDialog(f7, $_('dialog.unselected_category.text'));
      return
    }

    for (let category of $categoryData.selectedCategories) {
      category.addWord(saveWord); 
    }
    openDialog(f7, $_('search.save_text'));
    f7router.back();
  }
</script>
