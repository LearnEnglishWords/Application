<Page name="CategoryList">
  <!-- Navbar -->
  <Header>
    <div slot="title" class="title">
      <span>{$_('statistics.title')}</span>
    </div>
  </Header>
  <!-- Header -->
  <div class="header statistics">
    <Row class="CategoryList">
      <Col class="known">
        <span>{globalStatisticsData.known}</span>
        <span>{$_('statistics.known')}</span>
        <span>{$_('statistics.text')}</span>
      </Col>
      <Col class="learning">
        <span>{globalStatisticsData.learning}</span>
        <span>{$_('statistics.learning')}</span>
        <span>{$_('statistics.text')}</span>
      </Col>
      <Col class="unknown">
        <span>{globalStatisticsData.unknown}</span>
        <span>{$_('statistics.unknown')}</span>
        <span>{$_('statistics.text')}</span>
      </Col>
    </Row>
  </div>
  <!-- View -->
  <div class="view CategoryList">
    <!-- Title -->
    <BlockTitle>{$_('category.select_categories')}</BlockTitle>
    <!-- List -->
    <List>
      {#each $collectionData.categories as category, id} 
        <ListItem class="list-item" title="{category.czechName}" on:click="{() => toggleCategory(category)}">
          <i slot="media" class="material-icons">{category.icon}</i>
          <div slot="after"><Statistics simple statistic={category.stats} /></div>
        </ListItem> 
      {/each}
    </List> 
  </div>

  <!-- Footer -->
  <div class="footer one">
    <Button on:click={goToDetailView}>{$_('category.confirm')}</Button>
  </div>

</Page>

<script>
  import { 
    Page, Button, 
    Block, BlockTitle,
    Row, Col, Icon,
    List, ListItem 
  } from 'framework7-svelte';
  import { collectionData, categoriesData, categoryDetailData } from '../js/store.js';
  import Header from '../components/Header.svelte';
  import Statistics from '../components/Statistics.svelte';
  import Collection from '../js/collection.js';
  import { defaultStatisticsData } from '../js/utils.js';
  import { onMount } from 'svelte';
  import { _ } from 'svelte-i18n';
                   
  export let f7router;
  let globalStatisticsData = { "count": 0, "known": 0, "learning": 0, "unknown": 0 };
  let collection = new Collection();
  let selectedCategories = [];

  setTimeout(() => { setupCategoryToggler() }, 200);


  function goToDetailView() {
    categoryDetailData.set({categories: selectedCategories});
    f7router.navigate('/CategoryDetail');
  }

  function getRandomStatistics() {
    let known = Math.floor(Math.random() * 101);
    let learning = Math.floor(Math.random() * 101);
    let unknown = Math.floor(Math.random() * 101);
    return {
      "count": known + learning + unknown,
      "known": known,
      "learning": learning,
      "unknown": unknown
    }
  }

  function toggleCategory(category) {
    category.active = !category.active;

    if (category.active) {
      globalStatisticsData.known += category.stats.known;
      globalStatisticsData.learning += category.stats.learning;
      globalStatisticsData.unknown += category.stats.unknown;
      selectedCategories.push(category);
    } else {
      globalStatisticsData.known -= category.stats.known;
      globalStatisticsData.learning -= category.stats.learning;
      globalStatisticsData.unknown -= category.stats.unknown;
      removeSelectedCategory(category);
    }
  }

  function removeSelectedCategory(category) {
    let removingCategory = selectedCategories.find(c => category.id === c.id);
    let index = selectedCategories.findIndex(c => removingCategory.id === c.id);
    if (index > -1) {
      selectedCategories.splice(index, 1);
    }
  }

  function setupCategoryToggler() {
    var container = document.getElementsByClassName("list-item");
  
    for (var i = 0; i < container.length; i++) {
      container[i].onclick = function(event) {
        this.classList.toggle('active');

        let isActive = false;
        for(let value of this.classList) {
          if(value === 'active') { isActive = true; break }
        } 
      }
    }
  }

</script>
