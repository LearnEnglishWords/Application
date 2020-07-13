<div class="page-title">{$_('training.sense_title')}
  <span>{$trainingData.currentWordIndex+1}/{$trainingData.words.length}</span>
</div>


<script>
  import { _ } from 'svelte-i18n';
  import { LearningMode } from '../../js/utils.js';
  import { trainingData, statisticsData, settingsData } from '../../js/store.js';
</script>
