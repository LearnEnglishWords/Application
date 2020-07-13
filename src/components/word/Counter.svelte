<div class="page-title">{$_('training.sense_title')}
  {#if $trainingData.type === LearningMode.FILTER}
    <span>{$statisticsData.learning}/{$settingsData.wordsLimit}</span>
  {:else}
    <span>{$trainingData.currentWordIndex+1}/{$trainingData.words.length}</span>
  {/if}
</div>


<script>
  import { _ } from 'svelte-i18n';
  import { LearningMode } from '../../js/utils.js';
  import { trainingData, statisticsData, settingsData } from '../../js/store.js';
</script>
