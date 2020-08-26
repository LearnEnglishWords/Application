<Sheet class="{popupName}" {opened} on:sheetClosed={() => close()}>
  <div class="sheet-title">
    <span>{$_('training.examples.title')}</span>
    <div class="sheet-link" on:click={() => f7.sheet.close()}>
      <SVGIcon name="e-remove" size="24"/>
    </div>
  </div>
  <div class="page-title examples-title">
    {$_('training.examples.text')} 
  </div>
  <List class="list-container list-categories examples-list">
    {#each word.examples as example, id}
      <ListItem class="list-item">
        <div slot="media" class="item-media">
          <div on:click={playExampleSound(example, $settingsData.pronunciation)}>
            <SVGIcon name="volume" size="24"/>
          </div>
        </div>
        <div on:click={() => translateText(example, id)}>
          {#if showTranslate[id]}
            {translatedExamples[id] === "" ? $_('training.examples.translate') : translatedExamples[id]}
          {:else}
            {example}
          {/if}
        </div>
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
  import { playExampleSound, translate } from '../js/utils.js'
  import { settingsData } from '../js/store.js'

  export let word;
  export let popupName;
  export let opened = false;

  let translatedExamples = word.examples.map(() => "");
  let showTranslate = word.examples.map(() => false);

  function translateText(text, id) {
    if (translatedExamples[id] === "") {
      translate(text, $settingsData.translator).then((data) => translatedExamples[id] = data);
    } 
    showTranslate[id] = !showTranslate[id];
  }
  
  function close() {
    opened = false;
    translatedExamples = word.examples.map(() => "");
    showTranslate = word.examples.map(() => false);
  }
</script>
