<Page name="CategoryList">
  <!-- Navbar -->
  <Header>
    <div class="navbar-title title" slot="title">{$_('app_name')}</div>
  </Header>
  <!-- View -->
  <div class="page-container view" on:click={closeCategoryDialog}>
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
  {#if $collectionData.id !== Collections.PERSONAL.id}
    <div class="footer-container footer-singular">
      <div class="footer-content">
        <Button class="page-button button-next" on:click={goToDetailView}>{$_('category_list.buttons.continue')}</Button>
      </div>
    </div>
  {:else}
    <div class="personal-navigation {categoryDialogOpened ? "opened" : ""}">
      <Row noGap>
        <Col class="ripple {isSelectedOneCategory > 0 ? 'active' : 'inactive'}">
          <Button class="edit" on:click={goToEditView}>{$_('category_list.buttons.edit')}</Button>
        </Col>
        <Col class="ripple {isSelectedOneCategory > 0 ? 'active' : 'inactive'}"> 
          <Button class="continue" on:click={goToDetailView}>{$_('category_list.buttons.continue')}</Button>
        </Col>
      </Row>
      <Col class="ripple add-button {isSelectedOneCategory > 0 ? 'inactive' : 'active'}" on:click={() => selectedCategories.length === 0 ? categoryDialogOpened = !categoryDialogOpened : null}>
        {#if !isSelectedOneCategory && selectedCategories.length > 0}
          <Button class="page-button button-next" on:click={goToDetailView}>{$_('category_list.buttons.continue')}</Button>
        {:else}
          <Button class="add">{$_('category_list.buttons.add')}</Button>
        {/if}
      </Col>
      <Row noGap class="{categoryDialogOpened ? "opened" : "closed"}">
        <span class="category-name">{$_('category_list.new')}</span>
        <input bind:value={newCategoryText} type="text" autocomplete="off" placeholder=""/>
        <div class="wrapper">
          <Button on:click={closeCategoryDialog}>{$_('category_list.buttons.cancel')}</Button>
          <Button on:click={createCategory}>{$_('category_list.buttons.confirm')}</Button>
        </div>
      </Row>
    </div>
  {/if}
</Page>

<script>
  import { 
    f7, Page, Button,
    Row, Col,
    List, ListItem 
  } from 'framework7-svelte';
  import { collectionData, categoryGroupData, categoryDetailData } from '../js/store.js';
  import CollectionStorage from '../js/storages/collections.js';
  import Header from '../components/Header.svelte';
  import Statistics from '../components/Statistics.svelte';
  import SVGIcon from '../components/SVGIcon.svelte';
  import CategoryGroup from '../js/entities/category-group.js';
  import Category from '../js/entities/category.js';
  import { WordsType, defaultStatisticsData, Collections } from '../js/utils.js';
  import { _ } from 'svelte-i18n';
                   
  export let f7router;

  let globalStatisticsData = { "count": 0, "known": 0, "learning": 0, "unknown": 0 };

  let selectedCategories = [];
  let categoryDialogOpened = false;
  let isSelectedOneCategory = false;
  let newCategoryText = "";

  setTimeout(() => { setupCategoryToggler() }, 200);
  $collectionData.categoryGroup.categories.forEach((category) => category.active = false);
  $collectionData.categoryGroup.categories.sort((a, b) => { 
    return b.getStatistic(WordsType.LEARNING) - a.getStatistic(WordsType.LEARNING)
  });

  function goToEditView() {
    if (isSelectedOneCategory) {
      categoryDetailData.set(selectedCategories[0]);
      f7router.navigate('/CategoryEdit');
    }
  }

  function goToDetailView() {
    let categories = selectedCategories.length > 0 ? selectedCategories : $collectionData.categoryGroup.categories
    let categoryGroup = new CategoryGroup(collectionData.id, categories, true);

    categoryGroupData.set(categoryGroup);
    categoryDetailData.set(categoryGroup.mainCategory);

    f7router.navigate('/CategoryDetail');
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
    isSelectedOneCategory = selectedCategories.length === 1;
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
  
  function closeCategoryDialog() {
    newCategoryText = "";
    categoryDialogOpened = false;
  }
  
  function createCategory() {
    if (newCategoryText === "") { return }

    let collectionStorage = new CollectionStorage();
    collectionStorage.createPersonalCategory(newCategoryText).then((cat) => {
      let category = new Category(cat.id, cat.collectionId, cat.name, cat.czechName, cat.icon);  
      $collectionData.categoryGroup.push(category);
    })

    closeCategoryDialog();

    setTimeout(() => { f7router.refreshPage() }, 500);
  }
</script>
