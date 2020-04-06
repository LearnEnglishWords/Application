<Page name="CategoryList">
  <Header />

  <Block strong inset>
    <BlockTitle medium>{$_('category.title')}</BlockTitle>
    <List>
      {#each categories as category, id} 
        <ListItem on:click="{() => goToDetailView(category)}">
          <h3>{category.czechName}</h3>
          <Statistics simple statistic={category.stats} />
        </ListItem>
      {/each}
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
  import { collectionData, categoryDetailData } from '../js/store.js';
  import Header from '../components/Header.svelte';
  import Statistics from '../components/Statistics.svelte';
  import Collection from '../js/collection.js';
  import { defaultStatisticsData } from '../js/utils.js';
  import { _ } from 'svelte-i18n';
                   
  export let f7router;

  let collection = new Collection();
  let categories = [];

  $collectionData.categories.forEach((category) => {
    collection.getCategoryStatisticsPromise($collectionData.id, category.id).then((stats) => {
      if (stats !== null) {
        category.stats = stats;
        category.active = false;
        collection.getCategoryModeStatisticsPromise($collectionData.id, category.id)
          .then((modeStats) => { 
            category.modeStats = modeStats; 
            categories.push(category);
            categories = [...categories];
          });
      }
    });
  })

  function goToDetailView(category) {
    categoryDetailData.set(category);
    f7router.navigate('/CategoryDetail');
  }

</script>

<style>
</style>
