<div class="page-mode">
  {#each trainingModes as {value, checked, icon}, id}
    <div class="mode-radio {checked ? "active" : ""}" on:click={() => changeTrainingMode(id)}>
      <input type="radio" name="training-mode" class="mode-input" value={value} id={value} checked/>
      <SVGIcon element="mode" name="{icon}" size="24" />
      <label class="mode-label" for={value}>{$_(`category.training_mode.${value}`)}</label>

      <div class="mode-statistics">
        <Statistics simple withoutLearning statistic={statistics[value]} />
      </div>
    </div>
  {/each}
</div>

<script>
  import Statistics from '../components/Statistics.svelte';
  import SVGIcon from '../components/SVGIcon.svelte';
  import { modeStatisticsData } from '../js/store.js';
  import { trainingModes as defaultTrainingModes } from '../js/utils.js'
  import { _ } from 'svelte-i18n';

  export let modeType;
  export let statistics;

  let trainingModes = defaultTrainingModes;
  let trainingModeIndex = 0;  

  modeType = trainingModes[trainingModeIndex].value;

  trainingModes.forEach((mode, index) => {
    if (mode.checked) {
      trainingModeIndex = index; 
      modeType = mode.value;
    }
  });

  function changeTrainingMode(index) {
    trainingModeIndex = index;
    modeType = trainingModes[index].value;

    trainingModes.forEach((mode) => mode.checked = false);
    trainingModes[index].checked = true;
  }
</script>
