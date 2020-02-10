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
    Page, 
    Chip, 
    Block, 
    BlockTitle, 
    Navbar,
    Subnavbar,
    Link,
    List,
    ListItem
  } from 'framework7-svelte';
  import { collectionData, categoryData } from '../js/store.js';

  function goToDetailView(category) {
    alert(`Going to ${category}`);
    categoryData.set(category)
  }

</script>

<style>
</style>
