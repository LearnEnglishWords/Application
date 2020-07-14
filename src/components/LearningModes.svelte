        <div class="page-mode">
          {#each trainingModes as {value, checked, icon}, id}
            <div class="mode-radio {checked ? "active" : ""}" on:click={() => changeTrainingMode(id)}>
              <input type="radio" name="training-mode" class="mode-input" value={value} id={value} checked/>
              <SVGIcon element="mode" name="{icon}" size="24" />
              <label class="mode-label" for={value}>{$_(`category.training_mode.${value}`)}</label>

              <div class="mode-statistics">
                <Statistics simple withoutLearning statistic={$modeStatisticsData[value]} />
              </div>
            </div>
          {/each}
        </div>

<script>
import Statistics from '../components/Statistics.svelte';
import SVGIcon from '../components/SVGIcon.svelte';

  let trainingModes = defaultTrainingModes;
  let trainingModeIndex = 0;  
  let modeType = trainingModes[trainingModeIndex].value;
  let currentLearningMode = null;

  function setupModeStatistics() {
    let modeStatistics = $categoryDetailData.getModeStatistics();
    if (modeStatistics !== null) {
      modeStatisticsData.set(modeStatistics);
    } else {
      modeStatisticsData.set(getDefaultModeStatisticsData($statisticsData.learning));
      setTimeout(setupModeStatistics, 100);
    }
  }
</script>