<div class="page-wrapper">
  <!-- Title -->
  <div class="page-title">{title}</div>
  <!-- List -->
  <List class="list-container list-categories">
    {#each categories as category, id}
      <ListItem class="list-item" title="{category.title}" on:click="{() => toggleCategory(category)}">
        <div slot="media" class="item-media">
          <SVGIcon element="item" name="{category.icon}" size="24" />
        </div>
        <div slot="after"><Statistics simple statistic={category.getStatistics()} /></div>
      </ListItem>
    {/each}
  </List> 
</div>

<script>
  import { List, ListItem } from 'framework7-svelte';
  import SVGIcon from '../SVGIcon.svelte';
  import Statistics from '../Statistics.svelte';
  import { categoryData } from '../../js/store.js';
  import { _ } from 'svelte-i18n';

  export let categories;
  export let title;

  setTimeout(() => { setupCategoryToggler() }, 200);

  function toggleCategory(category) {
    category.active = !category.active;

    if (category.active) {
      $categoryData.selectedCategories.push(category);
    } else {
      removeSelectedCategory(category);
    }
    $categoryData.isSelectedOneCategory = $categoryData.selectedCategories.length === 1;
  }

  function removeSelectedCategory(category) {
    let removingCategory = $categoryData.selectedCategories.find(c => category.id === c.id);
    let index = $categoryData.selectedCategories.findIndex(c => removingCategory.id === c.id);
    if (index > -1) {
      $categoryData.selectedCategories.splice(index, 1);
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
