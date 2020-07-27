<Page name="CategoryList">
  <!-- Navbar -->
  <Header {f7router} />
  <!-- View -->
  <div class="page-container view" on:click={ () => $categoryData.categoryDialogOpened = false }>
    <CategoryList 
       title={saveWord === null ? $_('category.select_categories') : $_('category.select_categories_for_save')} 
       categories={$categoryData.categories} />
  </div>
  <!-- Footer -->
  <CategoryButtons {f7router} saveWord={saveWord} on:continueClick={goToDetailView} on:editClick={goToEditView} />
</Page>

<script>
  import { Page } from 'framework7-svelte';
  import { collectionData, categoryData, categoryGroupData, categoryDetailData, allCollectionsData } from '../js/store.js';
  import Header from '../components/Header.svelte';
  import CategoryList from '../components/category/List.svelte';
  import CategoryButtons from '../components/category/Buttons.svelte';
  import CategoryGroup from '../js/entities/category-group.js';
  import Category from '../js/entities/category.js';
  import { WordsType, defaultStatisticsData, Collections } from '../js/utils.js';
  import { _ } from 'svelte-i18n';
                   
  export let f7router;
  export let saveWord = null;

  categoryData.set({
    "selectedCategories": [],
    "isSelectedOneCategory": false,
    "newCategoryText": "",
    "categoryDialogOpened": false,
    "categories": saveWord === null ? $collectionData.categoryGroup.categories : $allCollectionsData.find((c) => c.id === Collections.PERSONAL.id).categoryGroup.categories
  });

  $categoryData.categories.forEach((category) => category.active = false);
  $categoryData.categories.sort((a, b) => { 
    return b.getStatistic(WordsType.LEARNING) - a.getStatistic(WordsType.LEARNING)
  });

  function goToEditView() {
    if ($categoryData.selectedCategories.length === 1) {
      categoryDetailData.set($categoryData.selectedCategories[0]);
      f7router.navigate('/CategoryEdit');
    }
  }

  function goToDetailView() {
    let categories = $categoryData.selectedCategories.length > 0 ? $categoryData.selectedCategories : $collectionData.categoryGroup.categories
    let categoryGroup = new CategoryGroup(collectionData.id, categories, true);

    categoryGroupData.set(categoryGroup);
    categoryDetailData.set(categoryGroup.mainCategory);

    f7router.navigate('/CategoryDetail');
  }
</script>
