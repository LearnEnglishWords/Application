<Page name="CategoryList">
  <!-- Navbar -->
  <Header>
    <div class="navbar-title title" slot="title">{$_('app_name')}</div>
  </Header>
  <!-- Header -->
  <div class="header-statistics header-container">
    <Row class="header-row">
      <Col class="header-col header-known">
        <div class="header-count">{globalStatisticsData.known}</div>
        <div class="header-type">{$_('statistics.known')}</div>
        <div class="header-subtitle">{$_('statistics.text')}</div>
      </Col>
      <Col class="header-col header-learning">
        <div class="header-count">{globalStatisticsData.learning}</div>
        <div class="header-type">{$_('statistics.learning')}</div>
        <div class="header-subtitle">{$_('statistics.text')}</div>
      </Col>
      <Col class="header-col header-unknown">
        <div class="header-count">{globalStatisticsData.unknown}</div>
        <div class="header-type">{$_('statistics.unknown')}</div>
        <div class="header-subtitle">{$_('statistics.text')}</div>
      </Col>
    </Row>       
  </div>
  <!-- View -->
  <div class="page-container view">
    <div class="page-wrapper">
      <!-- Title -->
      <div class="page-title">{$_('category.select_categories')}</div>
      <!-- List -->
      <List class="list-container list-categories">
        {#each $collectionData.categoryGroup.categories as category, id}
          <ListItem class="list-item" title="{category.title}" on:click="{() => toggleCategory(category)}">
            <div slot="media" class="item-media">
              <SVGIcon element="item" name="{category.icon}" size="24" />
            </div>
            <div slot="after"><Statistics simple statistic={category.getStatistics()} /></div>
          </ListItem>
        {/each}
      </List> 
    </div>
  </div>
  <!-- Footer -->
  <div class="footer-container footer-singular">
    <div class="footer-content">
      <Button class="page-button button-next" on:click={goToDetailView}>{$_('category.confirm')}</Button>
    </div>
  </div>
</Page>

<script>
  import { 
    Page, Button,
    Row, Col,
    List, ListItem 
  } from 'framework7-svelte';
  import { collectionData, categoryGroupData, categoryDetailData } from '../js/store.js';
  import Header from '../components/Header.svelte';
  import Statistics from '../components/Statistics.svelte';
  import SVGIcon from '../components/SVGIcon.svelte';
  import CategoryGroup from '../js/entities/category-group.js';
  import { WordsType, defaultStatisticsData } from '../js/utils.js';
  import { onMount } from 'svelte';
  import { _ } from 'svelte-i18n';
                   
  export let f7router;

  let globalStatisticsData = { "count": 0, "known": 0, "learning": 0, "unknown": 0 };

  let selectedCategories = [];

  setTimeout(() => { setupCategoryToggler() }, 200);
  $collectionData.categoryGroup.categories.forEach((category) => category.active = false);
  $collectionData.categoryGroup.categories.sort((a, b) => { 
    return b.getStatistic(WordsType.LEARNING) - a.getStatistic(WordsType.LEARNING)
  });


  function goToDetailView() {
    if (selectedCategories.length > 0) {
      let categoryGroup = new CategoryGroup(collectionData.id, selectedCategories, true);

      categoryGroupData.set(categoryGroup);
      categoryDetailData.set(categoryGroup.mainCategory);

      f7router.navigate('/CategoryDetail');
    }
  }

  function toggleCategory(category) {
    category.active = !category.active;
    let categoryStats = category.getStatistics();

    if (category.active) {
      globalStatisticsData.known += categoryStats.known;
      globalStatisticsData.learning += categoryStats.learning;
      globalStatisticsData.unknown += categoryStats.unknown;
      selectedCategories.push(category);
    } else {
      globalStatisticsData.known -= categoryStats.known;
      globalStatisticsData.learning -= categoryStats.learning;
      globalStatisticsData.unknown -= categoryStats.unknown;
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
