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
            <div slot="after"><Statistics simple statistic={category.statistics.stats} /></div>
          </ListItem>
        {/each}
      </List> 
    </div>
  </div>
  <!-- Footer -->
  {#if $collectionData.id !== Collections.PERSONAL.id}
    <div class="footer-container footer-singular">
      <div class="footer-content">
        <Button class="page-button button-next" on:click={goToDetailView}>{$_('category_list.buttons.continue')}</Button>
      </div>
    </div>
  {:else}
    {#if selectedCategories.length === 0} <!-- pokud je to personal stránka, zobrazit toto -->
      <div class="personal-navigation">
        <Row noGap>
          {#if selectedCategories.length > 0} <!-- nevím zda toto je tu nutné -->
          <Col class="ripple"> <!-- pokud není aktivní žádná kategorie, tak class "inactive", pokud je, tak "active" -->
            <SVGIcon element="navigation" name="pen-01" size="16" />
            <span>Upravit</span>
          </Col>
          {/if}
          <div class="plus ripple" on:click={() => categoryDialogOpened = !categoryDialogOpened}>
            <SVGIcon element="navigation" name="e-add" size="16" />
          </div>
          {#if selectedCategories.length > 0} <!-- nevím zda toto je tu nutné -->
          <Col class="ripple"> <!-- pokud není aktivní žádná kategorie, tak class "inactive", pokud je, tak "active" -->
            <SVGIcon element="navigation" name="event-confirm" size="16" />
            <span>Pokračovat</span>
          </Col>
          {/if}
        </Row>
        <Row noGap class="category-add {categoryDialogOpened ? "opened" : "closed"}"> <!-- tohle si udělám sám -->
          <span>Pojmenujte si novou kategorii</span>
          <input type="text" />
          <Button>zrušit</Button>
          <Button>potvrdit</Button>
        </Row>
      </div>


      <!-- tohle až na konec odstranit a ty "funkce" mi vlož do toho kodu nahoře jako je např to createNewCategory-->
      <div style="display:none" class="footer-container footer-singular">
        <div class="footer-content">
          <Button class="page-button button-next" on:click={() => f7.dialog.prompt("Zadejte název nové kategorie:", "Nová kategorie", createNewCategory)}>{$_('category_list.buttons.add')}</Button>
        </div>
      </div>
    {:else}
      <div style="display:none" class="footer-container footer-singular">
        <div class="footer-content">
          <Button class="page-button button-next" on:click={goToDetailView}>{$_('category_list.buttons.edit')}</Button>
          <Button class="page-button button-next" on:click={goToDetailView}>{$_('category_list.buttons.continue')}</Button>
        </div>
      </div>
    {/if}
  {/if}
</Page>

<script>
  import { 
    f7, Page, Button,
    Row, Col,
    List, ListItem 
  } from 'framework7-svelte';
  import { collectionData, categoryGroupData, categoryDetailData } from '../js/store.js';
  import Header from '../components/Header.svelte';
  import Statistics from '../components/Statistics.svelte';
  import SVGIcon from '../components/SVGIcon.svelte';
  import CategoryGroup from '../js/entities/category-group.js';
  import { defaultStatisticsData, Collections } from '../js/utils.js';
  import { onMount } from 'svelte';
  import { _ } from 'svelte-i18n';
                   
  export let f7router;

  let globalStatisticsData = { "count": 0, "known": 0, "learning": 0, "unknown": 0 };
  let selectedCategories = [];
  let categoryDialogOpened = false;

  setTimeout(() => { setupCategoryToggler() }, 200);
  $collectionData.categoryGroup.categories.forEach((category) => category.active = false);


  function goToDetailView() {
    if (selectedCategories.length > 0) {
      let categoryGroup = new CategoryGroup(collectionData.id, selectedCategories);

      categoryGroup.loadStatistics();
      categoryGroupData.set(categoryGroup);
      categoryDetailData.set(categoryGroup.mainCategory);

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

  function createNewCategory(e) {
    alert(JSON.stringify("Uživatel zadal hodnotu: " + e, null, 2))
  }
</script>
