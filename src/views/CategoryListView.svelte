<Page name="CategoryList">
  <!-- Navbar -->
  <Header>
    <div class="navbar-title title" slot="title">{$_('app_name')}</div>
  </Header>
  <!-- Header -->
  <div class="header-statistics">
    <Row class="header-row">
      <Col class="header-col">
        <div class="header-count">{globalStatisticsData.known}</div>
        <div class="header-type">{$_('statistics.known')}</div>
        <div class="header-subtitle">{$_('statistics.text')}</div>
      </Col>
      <Col class="header-col">
        <div class="header-count">{globalStatisticsData.learning}</div>
        <div class="header-type">{$_('statistics.learning')}</div>
        <div class="header-subtitle">{$_('statistics.text')}</div>
      </Col>
      <Col class="header-col">
        <div class="header-count">{globalStatisticsData.unknown}</div>
        <div class="header-type">{$_('statistics.unknown')}</div>
        <div class="header-subtitle">{$_('statistics.text')}</div>
      </Col>
    </Row>       
  </div>
  <!-- View -->
  <div class="page-view view">
    <div class="page-container">
    <!-- Title -->
    <div class="page-title">{$_('category.select_categories')}</div>
    <!-- List -->
    <List class="list-categories">
      {#each $collectionData.categoryGroup.categories as category, id}
        <ListItem class="list-item" title="{category.title}" on:click="{() => toggleCategory(category)}">
          <!-- 
            "zvířata": "paw",
            "tělo": "male",
            "město": "new-construction",
            "práce a zaměstnání": "bag",
            "auto": "car-2",
            "oblečení": "shorts",
            "barvy": "palette",
            "lidé": "multiple-11",
            "jídlo": "cutlery",
            "dům a zahrada": "fence",
            "zdraví": "heartbeat",
            "zákon a pořádek": "law",
            "matematika": "math",
            "hudba": "music",
            "škola": "school",
            "věda a výzkum": "flask-2",
            "sport": "soccer-ball",
            "datum a čas": "time-clock",
            "cestování": "map-pin",
            "počasí": "sun-fog-43",
            "ostatní": "trash",
          -->
          <div slot="media" class="item-media">
            <SVGIcon name="{category.icon}" size="24" tag="list" />
          </div>
          <div slot="after"><Statistics simple statistic={category.statistics.stats} /></div>
        </ListItem>
      {/each}
    </List> 
  </div>
  </div>
  <!-- Footer -->
  <div class="footer">
    <div class="footer-single">
      <div class="footer-buttons">
        <Button class="button-next" on:click={goToDetailView}>{$_('category.confirm')}</Button>
      </div>
    </div>
  </div>
</Page>

<script>
  import { 
    Page, Button, 
    Block, BlockTitle,
    Row, Col, Icon,
    List, ListItem 
  } from 'framework7-svelte';
  import { collectionData, categoryDetailData } from '../js/store.js';
  import Header from '../components/Header.svelte';
  import Statistics from '../components/Statistics.svelte';
  import SVGIcon from '../components/SVGIcon.svelte';
  import { defaultStatisticsData } from '../js/utils.js';
  import { onMount } from 'svelte';
  import { _ } from 'svelte-i18n';
                   
  export let f7router;

  let globalStatisticsData = { "count": 0, "known": 0, "learning": 0, "unknown": 0 };
  let selectedCategories = [];

  setTimeout(() => { setupCategoryToggler() }, 200);


  function goToDetailView() {
    if (selectedCategories.length > 0) {
      categoryDetailData.set(selectedCategories[0]);
      f7router.navigate('/CategoryDetail');
    }
  }

  function toggleCategory(category) {
    category.active = !category.active;

    if (category.active) {
      globalStatisticsData.known += category.statistics.stats.known;
      globalStatisticsData.learning += category.statistics.stats.learning;
      globalStatisticsData.unknown += category.statistics.stats.unknown;
      selectedCategories.push(category);
    } else {
      globalStatisticsData.known -= category.statistics.stats.known;
      globalStatisticsData.learning -= category.statistics.stats.learning;
      globalStatisticsData.unknown -= category.statistics.stats.unknown;
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
