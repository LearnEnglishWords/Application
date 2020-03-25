<Page name="CategoryList">
  <Header>
    <div slot="title" class="navbar-title">
      <h1 class="navbar-title">{$_('app.name')}</h1>
    </div>
  </Header>

  <div class="category-list header">
    <p class="category-title">{$_('category.categoryTitle')}</p>
    <Row class="category-counter">
      <Col class="known">
        <span class="count">{globalStatisticsData.known}</span>
        <p class="type">{$_('statistics.known')}</p>
        <p class="text">{$_('statistics.words')}</p>
      </Col>
      <Col class="learning">
        <span class="count">{globalStatisticsData.learning}</span>
        <p class="type">{$_('statistics.learning')}</p>
        <p class="text">{$_('statistics.words')}</p>
      </Col>
      <Col class="unknown">
        <span class="count">{globalStatisticsData.unknown}</span>
        <p class="type">{$_('statistics.unknown')}</p>
        <p class="text">{$_('statistics.words')}</p>
      </Col>
    </Row>
  </div>

  <div class="category-list title">
    <h2>{$_('category.title')}</h2>
    <div class="separator"></div>
  </div>

  <div class="category-list grid">
    {#if $categoryData !== 0}
      {#each $categoryData as category, id}
        <div class="category-item" class:active={category.active} on:click="{() => toggleCategory(category)}">           
          <Icon material={category.icon} />
          <h3>{category.name}</h3>
          <div class="separator"></div>
          <p>{$_('category.words')}</p>
          <Statistics simple categoryId={category} />
        </div>
      {/each}
    {/if}    
  </div>

  <div class="category-list footer">
    <Button round on:click={goToDetailView}> {$_('category.confirm')} </Button>
  </div>
</Page>

<script>
  import { 
    Page,
    Chip, 
    Button, Row, Col, Icon
  } from 'framework7-svelte';
  import { categoryData, collectionData, categoryDetailData } from '../js/store.js';
  import Header from '../components/Header.svelte';
  import Statistics from '../components/Statistics.svelte';
  import { develMode } from '../js/config.js';
  import { defaultStatisticsData } from '../js/utils.js';
  import { onMount } from 'svelte';
  import { _ } from 'svelte-i18n';
                   
  export let f7router;
  let globalStatisticsData = { "count": 0, "known": 0, "learning": 0, "unknown": 0 };

  if(develMode) {
    setDevelData();
  }

  function goToDetailView() {
    //categoryDetailData.set({name: category, id: category});
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
  
  function setDevelData() {
    categoryData.set([
      {name: "Furniture", icon: "room", stats: getRandomStatistics(), active: false},
      {name: "Body", icon: "copyright", stats: getRandomStatistics(), active: false},
      {name: "Food", icon: "card_travel", stats: getRandomStatistics(), active: false},
      {name: "Cars", icon: "dashboard", stats: getRandomStatistics(), active: false},
      {name: "Pets", icon: "face", stats: getRandomStatistics(), active: false},
      {name: "Colors", icon: "eject", stats: getRandomStatistics(), active: false},
      {name: "Vehicles", icon: "feedback", stats: getRandomStatistics(), active: false},
      {name: "Rooms", icon: "favorite", stats: getRandomStatistics(), active: false},
      {name: "Bikes", icon: "home", stats: getRandomStatistics(), active: false},
      {name: "Weather", icon: "room", stats: getRandomStatistics(), active: false},
      {name: "Astronomy", icon: "shop", stats: getRandomStatistics(), active: false},
      {name: "Parents", icon: "store", stats: getRandomStatistics(), active: false}
    ]);

    collectionData.set({id: "basic", name: "Basic"});
  }

  function toggleCategory(category) {
    category.active = !category.active;

    if (category.active) {
      globalStatisticsData.known += category.stats.known;
      globalStatisticsData.learning += category.stats.learning;
      globalStatisticsData.unknown += category.stats.unknown;
    } else {
      globalStatisticsData.known -= category.stats.known;
      globalStatisticsData.learning -= category.stats.learning;
      globalStatisticsData.unknown -= category.stats.unknown;
    }
  }

  onMount(() => {
    var container = document.getElementsByClassName("category-item");
  
    for (var i = 0; i < container.length; i++) {
      container[i].onclick = function(event) {
        this.classList.toggle('active');
      }
    }
  });

</script>

<style>
</style>
