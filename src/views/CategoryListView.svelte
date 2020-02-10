<Page name="CategoryList">
  <Navbar title="LearnEnglishWords">
  </Navbar>              

  <Block strong inset>
    <BlockTitle medium>Vyberte si kategorii:</BlockTitle>
    <List>
      {#if $collectionData !== 0}
        {#each $collectionData as category, id}
          <ListItem text="" link="#" on:click="{() => goToDetailView(category)}">
            <h3>{category.name.slice(6,-5)}</h3>
              <div class="number red">          
                {category.readAsJSON().length}
              </div>
              <div class="number orange"> 0 </div>
              <div class="number green"> 0 </div>
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
  .number {
    font-size: 12pt;
    background-color: coral;
    padding: 3pt;
  }
</style>
