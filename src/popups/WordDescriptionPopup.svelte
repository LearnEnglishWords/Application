<Sheet class="{popupName}" {opened} on:sheetClosed={() => opened = false }>
  <div class="sheet-title">
    <span>{$_('training.description_title')}</span>
    <div class="sheet-link" on:click={() => f7.sheet.close()}>
      <SVGIcon name="e-remove" size="24"/>
    </div>
  </div>
  <List class="list-container list-categories">
    {#each word.examples as example, id}
      <ListItem class="list-item" on:click={playExampleSound(example, $settingsData.pronunciation)}>
        {example}
        <div slot="media" class="item-media"><SVGIcon name="volume" size="24"/></div>
      </ListItem>
    {/each}
  </List>
</Sheet>

<script>
  import { 
    f7, PageContent, Block, 
    List, ListItem,
    Button, Sheet
  } from 'framework7-svelte';
  import { _ } from 'svelte-i18n';
  import Header from '../components/Header.svelte';
  import SVGIcon from '../components/SVGIcon.svelte';
  import { playExampleSound } from '../js/utils.js'
  import { settingsData } from '../js/store.js'

  export let word;
  export let popupName;
  export let opened = false;
</script>
