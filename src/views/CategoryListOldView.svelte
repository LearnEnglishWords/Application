<Page name="CategoryList">
  <Header />

  <Block strong inset>
    <BlockTitle medium>{$_('category.title')}</BlockTitle>
    <List>
      {#if $categoryData !== 0}
        {#each $categoryData as category, id}
          <ListItem on:click="{() => goToDetailView(category)}">
            <h3>{category}</h3>
            <Statistics simple categoryId={category} />
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
  import { categoryData, collectionData, categoryDetailData } from '../js/store.js';
  import Header from '../components/Header.svelte';
  import Statistics from '../components/Statistics.svelte';
  import { develMode } from '../js/config.js';
  import { defaultStatisticsData } from '../js/utils.js';
  import { _ } from 'svelte-i18n';
                   
  export let f7router;

  if(develMode) {
    setDevelData();
  }

  function goToDetailView(category) {
    categoryDetailData.set({name: category, id: category});
    f7router.navigate('/CategoryDetail');
  }

  function setDevelData() {
    categoryData.set(["Furniture","Body","Food"]);
    collectionData.set({id: "basic", name: "Basic"});
  }

</script>

<style>
</style>
