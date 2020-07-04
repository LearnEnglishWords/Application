<div class="page-title">{$_('training.sense_title')}
  {#if $trainingData.type === LearningMode.FILTER}
    <span>{$statisticsData.learning}/{$settingsData.wordsLimit}</span>
  {:else}
    <span>{$trainingData.currentWordIndex+1}/{$trainingData.words.length}</span>
  {/if}
</div>

<!-- List -->
<List class="list-container list-categories">
  {#each word.sense.slice(0,4) as sense, id}
    <ListItem class="list-item" title={sense.toLowerCase()}>
      <div slot="media" class="item-media">
        <SVGIcon name="translation" size="24" />
      </div>
    </ListItem>
  {/each}
</List>

<script>
  import { 
    Block, List, ListItem,
    Row, Col, Button
  } from 'framework7-svelte';
  import { _ } from 'svelte-i18n';
  import { trainingData, settingsData, statisticsData } from '../js/store.js';
  import { LearningMode } from '../js/utils.js';
  import SVGIcon from '../components/SVGIcon.svelte';

  export let word;

  let numbers = ["①", "②", "③", "④", "⑤"];
</script>
