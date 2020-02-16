<Page name="CategoryList">
  <Navbar title="LearnEnglishWords">
  </Navbar>              

  <Block strong inset>
    <BlockTitle medium>Vyberte si kategorii:</BlockTitle>
    <List>
      {#if $categoryData !== 0}
        {#each $categoryData as category, id}
          <ListItem text="" link="#" on:click="{() => goToDetailView(category)}">
            <h3>{category}</h3>
          </ListItem>
        {/each}
      {/if}
    </List>
  </Block>
</Page>

<script>
  import { 
    Page, Link,
    Chip, 
    Block, BlockTitle, 
    Navbar, Subnavbar,
    List, ListItem
  } from 'framework7-svelte';
  import { categoryData, categoryDetailData } from '../js/store.js';
  import { _ } from 'svelte-i18n';

  export let f7router;

  function goToDetailView(category) {
    categoryDetailData.set({name: category, id: category});
    f7router.navigate('/CategoryDetail');
  }

</script>

<style>
</style>
