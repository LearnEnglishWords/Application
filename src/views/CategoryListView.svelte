<Page name="CategoryList">
  <Header>
    <div slot="title" class="navbar-title">
      <h1 class="navbar-title">{$_('app.name')}</h1>
    </div>
  </Header>

  <div class="category-header">
    <p class="category-list-header">{$_('category.categoryTitle')}</p>
    <Row class="category-counter">
      <Col>
        <span>238</span>
        <p>Naučených</p>
        <p>Slov</p>
      </Col>
      <Col>
        <span>3673</span>
        <p>Nenaučených</p>
        <p>Slov</p>
      </Col>
      <Col>
        <span>14639</span>
        <p>Zbývajících</p>
        <p>Slov</p>
      </Col>
    </Row>
  </div>

  <div class="category-list-title">
    <h2>{$_('category.title')}</h2>
    <div class="separator"></div>
  </div>

  <div class="category-list">
    {#if $categoryData !== 0}
      {#each $categoryData as category, id}
        <div class="category-item" on:click="{() => toggleActiveCategory()}"> 
          <Icon material={category.icon} />
          <h3>{category.name}</h3>
        </div>
      {/each}
    {/if}    
  </div>

  <div class="category-footer">
    <Button round>{$_('category.confirm')}</Button>
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
    categoryData.set([
      {name: "Furniture", icon: "room"},
      {name: "Body", icon: "copyright"},
      {name: "Food", icon: "card_travel"},
      {name: "Cars", icon: "dashboard"},
      {name: "Pets", icon: "face"},
      {name: "Colors", icon: "eject"},
      {name: "Vehicles", icon: "feedback"},
      {name: "Rooms", icon: "favorite"},
      {name: "Bikes", icon: "home"},
      {name: "Weather", icon: "room"},
      {name: "Astronomy", icon: "shop"},
      {name: "Parents", icon: "store"}
    ]);
    //categoryData.set(["Furniture","Body","Food"]);
    collectionData.set({id: "basic", name: "Basic"});
  }

  function toggleActiveCategory() {
    var container = document.getElementsByClassName("category-item");
  
    for (var i = 0; i < container.length; i++) {
      container[i].onclick = function(event) {
        this.classList.toggle('active');
      }
    }
  }

</script>

<style>
</style>
