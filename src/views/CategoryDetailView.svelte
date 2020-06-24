<Page name="CategoryDetail">
  <!-- Navbar -->
  <Header>
    <div class="navbar-title title" slot="title">{$_('app_name')}</div>
  </Header>
  <!-- Header -->
  <div class="header-statistics header-container" on:click={() => currentLearningMode = null}>
    <Row class="header-row">
      <Col class="header-col header-known">
        <div class="header-count">{$statisticsData.known}</div>
        <div class="header-type">{$_('statistics.known')}</div>
        <div class="header-subtitle">{$_('statistics.text')}</div>
      </Col>
      <Col class="header-col header-learning">
        <div class="header-count">{$statisticsData.learning}</div>
        <div class="header-type">{$_('statistics.learning')}</div>
        <div class="header-subtitle">{$_('statistics.text')}</div>
      </Col>
      <Col class="header-col header-unknown">
        <div class="header-count">{$statisticsData.unknown}</div>
        <div class="header-type">{$_('statistics.unknown')}</div>
        <div class="header-subtitle">{$_('statistics.text')}</div>
      </Col>
    </Row>       
  </div>
  <!-- View -->
  <div class="page-container view" on:click={() => currentLearningMode = null}>
    <div class="page-wrapper">
      <!-- Title -->
      <div class="page-title">{$_('category.training_title')}</div>
      <!-- Mode -->
      <div class="page-mode">
        {#each trainingModes as {value, checked, icon}, id}
          <div class="mode-radio {checked ? "active" : ""}" on:click={() => changeTrainingMode(id)}>
            <input type="radio" name="training-mode" class="mode-input" value={value} id={value} checked/>
            <SVGIcon element="mode" name="{icon}" size="24" />
            <label class="mode-label" for={value}>{$_(`category.training_mode.${value}`)}</label>
            <div class="mode-statistics">
              <Statistics simple withoutLearning statistic={$trainingModeStatisticsData[value]} />
            </div>
          </div>
        {/each}
      </div>
      <!-- Stepper -->
      <List class="list-container list-stepper">
        <ListItem class="list-item" title="{$_('category.words_title')}">
          <div slot="after"><Stepper
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
            on:stepperChange={saveWordLimit}
          ></Stepper>
          </div>
        </ListItem>
      </List>
      <Button class="page-button button-show" on:click={goToWordListView}>{$_('category.buttons.words_list')}</Button>
    </div>
  </div>

  <!-- Footer -->
  <div class="bottom-navigation {currentLearningMode !== null ? 'activated' : ''}">
    <Row>
      {#if $categoryDetailData.wordStorages["known"].getWordIds().length > 0}
      <Col class="ripple mode-{LearningMode.REPETITION} {currentLearningMode === LearningMode.REPETITION ? 'selected' : ''}" on:click={() => currentLearningMode === LearningMode.REPETITION ? currentLearningMode = null : currentLearningMode = LearningMode.REPETITION}>
        <SVGIcon element="navigation" name="reload" size="16" />
        <span>{$_('category.buttons.' + LearningMode.REPETITION)}</span>
      </Col>
      {/if}
      <Col class="ripple mode-{LearningMode.EXAM} {currentLearningMode === LearningMode.EXAM ? 'selected' : ''}" on:click={() => currentLearningMode === LearningMode.EXAM ? currentLearningMode = null : currentLearningMode = LearningMode.EXAM}>
        <SVGIcon element="navigation" name="todo" size="16" />
        <span>{$_('category.buttons.' + LearningMode.EXAM)}</span>
      </Col>
      <Col class="ripple mode-{LearningMode.TRAINING} {currentLearningMode === LearningMode.TRAINING ? 'selected' : ''}" on:click={() => currentLearningMode === LearningMode.TRAINING ? currentLearningMode = null : currentLearningMode = LearningMode.TRAINING}>
        <SVGIcon element="navigation" name="book-open-2" size="16" />
        <span>{$_('category.buttons.' + LearningMode.TRAINING)}</span>
      </Col>
    </Row>
    <Row class="{currentLearningMode !== null ? currentLearningMode : ''}">
      <Col>
        <p class="{currentLearningMode === LearningMode.REPETITION ? 'selected' : ''}">
          {$_(`category.learning_mode.${LearningMode.REPETITION}.text1`)} <br /> 
          {$_(`category.learning_mode.${LearningMode.REPETITION}.text2`)} <br />
          {$_(`category.learning_mode.${LearningMode.REPETITION}.text3`)} 
        </p>
        <p class="{currentLearningMode === LearningMode.EXAM ? 'selected' : ''}">
          {$_(`category.learning_mode.${LearningMode.EXAM}.text1`)} <br /> 
          {$_(`category.learning_mode.${LearningMode.EXAM}.text2`)}
        </p>
        <p class="{currentLearningMode === LearningMode.TRAINING ? 'selected' : ''}">
          {$_(`category.learning_mode.${LearningMode.TRAINING}.text1`)} <br /> 
          {$_(`category.learning_mode.${LearningMode.TRAINING}.text2`)}
        </p>
        <Button on:click={goToTrainingView}>{$_('category.buttons.start')}</Button>
      </Col>
    </Row>
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

  import { trainingModes as defaultTrainingModes, WordsType, LearningMode, AppInfo, setActivity } from '../js/utils.js'
  import WordsStorage from '../js/storages/words.js';
  import Statistics from '../components/Statistics.svelte';
  import SVGIcon from '../components/SVGIcon.svelte';
  import Header from '../components/Header.svelte';
  import DS from '../js/storages/data.js';
  import { _ } from 'svelte-i18n';

  export let f7router;            

  let wordsLimit = $settingsData.wordsLimit;
  let trainingModes = defaultTrainingModes;
  let trainingModeIndex = 0;  
  let modeType = trainingModes[trainingModeIndex].value;
  let currentLearningMode = null;

  trainingModes.forEach((mode, index) => {
    if (mode.checked) {
      trainingModeIndex = index; 
      modeType = mode.value;
    }
  });

  let currentWordStorage = $categoryDetailData.wordStorages[modeType]; 
  currentWordStorage.loadWords();
  $categoryDetailData.loadWords("known"); 

  statisticsData.set($categoryDetailData.statistics.stats);
  setCorrectModeStats(); // Sometimes modeStats are not loaded right. This function fix it.
  trainingModeStatisticsData.set($categoryDetailData.statistics.modeStats);

  function changeTrainingMode(index) {
    trainingModeIndex = index;
    modeType = trainingModes[index].value;
    currentWordStorage = $categoryDetailData.wordStorages[modeType];

    trainingModes.forEach((mode) => mode.checked = false);
    trainingModes[index].checked = true;

    if (currentWordStorage.getWords(wordsLimit).length === 0) {
      currentWordStorage.loadIds(true);
    }
  }

  function saveWordLimit() {
    $settingsData.wordsLimit = wordsLimit;
    DS.saveSettings($settingsData);
  }

  function setCorrectModeStats() {
    let maxValue = 0;
    // Fix number of unknown words when it is zero or negative
    for (let modeType of trainingModes.map((mode) => mode.value)) {
      let modeState = $categoryDetailData.statistics.modeStats[modeType];
      if(modeState.unknown <= 0) {
        modeState.unknown = $statisticsData.unknown;
      }
      if(maxValue < modeState.known) {
        maxValue = modeState.known;
      }
    }

    // Fix when user know more words than is saved in mode statistics. 
    if(maxValue < ($statisticsData.known + $statisticsData.learning)) {
      let diffValue = ($statisticsData.known + $statisticsData.learning) - maxValue;
      for (let modeType of trainingModes.map((mode) => mode.value)) {
        $categoryDetailData.statistics.modeStats[modeType].known += diffValue;
      }
    }
  }

  function setupData(isTraining) {
    trainingData.set({ 
      mode: modeType, 
      type: currentLearningMode, 
      isTraining: isTraining,
      wallEnabled: !isTraining,
      words: currentWordStorage.getWords(wordsLimit),
      currentWordIndex: 0
    });
  }

  function goToWordListView(isTraining) {
    f7router.navigate('/WordList');
  }

  function checkAndSetActivity() {
    DS.getAppInfo(AppInfo.LAST_ACTIVITY).then((lastActivityDay) => { 
      if (lastActivityDay != new Date().getDate()) {
        DS.saveAppInfo(AppInfo.LAST_ACTIVITY, new Date().getDate());
        setActivity(device.uuid);
      }
    });
  }

  function goToTrainingView() {
    let isTraining = currentLearningMode === LearningMode.TRAINING;  
    let isRepetition = currentLearningMode === LearningMode.REPETITION;

    f7.preloader.show();
    currentWordStorage = $categoryDetailData.wordStorages[isRepetition ? "known" : modeType];

    if(currentWordStorage.isLoaded(wordsLimit)) {
      setupData(isTraining);
      f7.preloader.hide();
      checkAndSetActivity();
      setTimeout(() => currentLearningMode = null, 1000);

      f7router.navigate('/Training');
    } else {
      setTimeout(() => { goToTrainingView(isTraining, isRepetition) }, 1000);
    }
  }

</script>
