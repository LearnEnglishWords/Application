<Page name="CategoryList">
  <Header />

  <Block strong inset>
    <BlockTitle medium>{$_('category.title')}</BlockTitle>
    <List>
      {#each $collectionData.categories as category, id} 
        <ListItem on:click="{() => goToDetailView(category)}">
          <h3>{category.title}</h3>
          <Statistics simple statistic={category.statistics} />
        </ListItem>
      {/each}
    </List>
  </Block>
</Page>

<script>
  import { 
    Page, Link,
    Block, BlockTitle, 
    Navbar, Subnavbar,
    List, ListItem
  } from 'framework7-svelte';
  import { collectionData, categoriesData, categoryDetailData } from '../js/store.js';
  import Header from '../components/Header.svelte';
  import Statistics from '../components/Statistics.svelte';
  import { defaultStatisticsData } from '../js/utils.js';
  import { _ } from 'svelte-i18n';
                   
  export let f7router;

  function goToDetailView(category) {
    categoryDetailData.set(category);
    f7router.navigate('/CategoryDetail');
  }

</script>
