<Page name="CategoryDetail">
  <!-- Navbar -->
  <Header>
    <div slot="title" class="title">
      <span>{$_('statistics.title')}</span>
    </div>
  </Header>
  <!-- Header -->
  <div class="header statistics">
    <Row class="CategoryDetail">
      <Col class="known">
        <span>42</span>
        <span>{$_('statistics.known')}</span>
        <span>{$_('statistics.text')}</span>
      </Col>
      <Col class="learning">
        <span>241</span>
        <span>{$_('statistics.learning')}</span>
        <span>{$_('statistics.text')}</span>
      </Col>
      <Col class="unknown">
        <span>604</span>
        <span>{$_('statistics.unknown')}</span>
        <span>{$_('statistics.text')}</span>
      </Col>
    </Row>
  </div>
  <!-- View -->
  <div class="view CategoryDetail">
    <!-- Title -->
    <BlockTitle>{$_('category.training_title')}</BlockTitle>
    <!-- Mode -->
    <div class="training-mode">
      {#each trainingModes as {value, checked, icon}, id}
        <div class="radio {checked ? "active" : ""}" on:click={() => changeTrainingMode(id)}>
          <input type="radio" name="training-mode" value={value} id={value} checked/>
          <i class="material-icons">{icon}</i>
          <label for={value}>{$_(`category.training_mode.${value}`)}</label>
          <Statistics simple withoutLearning statistic={$trainingModeStatisticsData[value]} />
        </div>
      {/each}
    </div>
    <!-- Title -->
    <BlockTitle>{$_('category.words_limit')}</BlockTitle>
    <!-- Stepper -->
    <div class="list">
      <ul>
        <ListItem>
          <div class="title">{$_('category.words_title')}</div>
          <Stepper
            min={10}
            max={100}
            step={10}
            value={$settingsData.wordsLimit}
            autorepeat={true} 
            autorepeatDynamic={true}
            small
            fill
            on:stepperMinusClick={() => { if(wordsLimit > 10) { wordsLimit -= 10 } }}
            on:stepperPlusClick={() => { if(wordsLimit < 100) { wordsLimit += 10 } }} 
          ></Stepper>
        </ListItem>
      </ul>
    </div>
    <Button large class="show-more" on:click={goToWordListView}>{$_('category.buttons.words_list')}</Button>
  </div>
  <!-- Footer -->
  <div class="footer two">
    <Button large on:click={() => goToTrainingView(true)}>{$_('category.buttons.start_training')}</Button>
    <Button large on:click={() => goToTrainingView(false)}>{$_('category.buttons.start_testing')}</Button>
  </div>  
</Page>

<script>
  import { 
    f7, Page, Popup, 
    Navbar, Subnavbar, NavRight,
    BlockTitle, Block, BlockHeader,
    List, ListItem,
    AccordionContent,
    Stepper, Gauge,
    Row, Col, 
    Link, Button
  } from 'framework7-svelte';
  import { 
    collectionData, categoryDetailData,
    trainingData, settingsData,
    statisticsData, trainingModeStatisticsData
  } from '../js/store.js';

  import { defaultTrainingModes, WordsType } from '../js/utils.js'
  import WordsStorage from '../js/storages/words.js';
  import Statistics from '../components/Statistics.svelte';
  import Header from '../components/Header.svelte';
  import { _ } from 'svelte-i18n';

  export let f7router;            

  let wordsLimit = $settingsData.wordsLimit;
  let trainingModeIndex = 0;
  let trainingModes = defaultTrainingModes;
  let modeType = trainingModes[trainingModeIndex].value;

  let currentWordStorage = $categoryDetailData.wordStorages[modeType]; 
  currentWordStorage.loadWords();

  statisticsData.set($categoryDetailData.statistics.stats);
  trainingModeStatisticsData.set($categoryDetailData.statistics.modeStats);


  function changeTrainingMode(index) {
    trainingModeIndex = index;
    modeType = trainingModes[index].value;
    currentWordStorage = $categoryDetailData.wordStorages[modeType];

    trainingModes.forEach((mode) => mode.checked = false);
    trainingModes[index].checked = true;

    if (currentWordStorage.getWords(wordsLimit).length === 0) {
      currentWordStorage.loadIds($collectionData.id, $categoryDetailData.id, true);
    }
  }

  function setupData(isTraining) {
    trainingData.set({ 
      mode: modeType, 
      isTraining: isTraining,
      wallEnabled: !isTraining,
      words: currentWordStorage.getWords(wordsLimit),
      currentWordIndex: 0
    });
  }

  function goToWordListView(isTraining) {
    f7router.navigate('/WordList');
  }

  function goToTrainingView(isTraining) {
    f7.preloader.show();

    if(currentWordStorage.isLoaded(wordsLimit)) {
      setupData(isTraining);
      f7.preloader.hide();
      f7router.navigate('/Training');
    } else {
      setTimeout(() => { goToTrainingView(isTraining) }, 1000);
    }
  }

</script>
