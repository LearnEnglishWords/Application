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
      <!--<Button class="page-button button-show" on:click={() => f7router.navigate('/WordList')}>{$_('category.buttons.words_list')}</Button>

      {#if $statisticsData.unknown > 0}
        {#if ($statisticsData.known - $statisticsData.alreadyKnown) === 0 && $statisticsData.learning === 0}
          <Button class="page-button button-start" on:click={() => { currentLearningMode = LearningMode.FILTER; goToTrainingView() }}>{$_('category.buttons.filter_words_start')}</Button>
        {:else if $statisticsData.learning < $settingsData.wordsLimit}
          <Button class="page-button button-show" on:click={() => { currentLearningMode = LearningMode.FILTER; goToTrainingView() }}>{$_('category.buttons.filter_words_normal')}</Button>
        {/if}
      {/if}
      -->
    </div>
  </div>

  <!-- Footer -->
  <div class="bottom-navigation detail-nav {currentLearningMode !== null ? 'activated' : ''}">
    <Row>
      {#if $statisticsData.learning > 0}
        <Col class="ripple mode-{LearningMode.TRAINING} {currentLearningMode === LearningMode.TRAINING ? 'selected' : ''}" on:click={() => currentLearningMode === LearningMode.TRAINING ? currentLearningMode = null : currentLearningMode = LearningMode.TRAINING}>
          <SVGIcon element="navigation" name="book-open-2" size="16" />
          <span>{$_('category.buttons.' + LearningMode.TRAINING)}</span>
        </Col>
        <Col class="ripple mode-{LearningMode.EXAM} {currentLearningMode === LearningMode.EXAM ? 'selected' : ''}" on:click={() => currentLearningMode === LearningMode.EXAM ? currentLearningMode = null : currentLearningMode = LearningMode.EXAM}>
          <SVGIcon element="navigation" name="todo" size="16" />
          <span>{$_('category.buttons.' + LearningMode.EXAM)}</span>
        </Col>
      {/if}
      {#if ($statisticsData.known - $statisticsData.alreadyKnown) > 0}
      <Col class="ripple mode-{LearningMode.REPETITION} {currentLearningMode === LearningMode.REPETITION ? 'selected' : ''}" on:click={() => currentLearningMode === LearningMode.REPETITION ? currentLearningMode = null : currentLearningMode = LearningMode.REPETITION}>
        <SVGIcon element="navigation" name="reload" size="16" />
        <span>{$_('category.buttons.' + LearningMode.REPETITION)}</span>
      </Col>
      {/if}
    </Row>
    {#if currentLearningMode !== null}
      <div transition:slide="{{ delay: 0, duration: 500 }}">
        <Row class="second {currentLearningMode !== null ? currentLearningMode : ''}">
          <Col>
            <TrainingModes bind:modeType={modeType} statistics={$modeStatisticsData} active={currentLearningMode !== null} />
            <div class="separator-modes {currentLearningMode !== null ? 'visible' : ''}"></div>
            <p class="{currentLearningMode === LearningMode.TRAINING ? 'selected' : ''}">
              {$_(`category.learning_mode.${LearningMode.TRAINING}.text1`)} <br /> 
              {$_(`category.learning_mode.${LearningMode.TRAINING}.text2`)}
            </p>
            <p class="{currentLearningMode === LearningMode.EXAM ? 'selected' : ''}">
              {$_(`category.learning_mode.${LearningMode.EXAM}.text1`)} <br /> 
              {$_(`category.learning_mode.${LearningMode.EXAM}.text2`)}
            </p>
            <p class="{currentLearningMode === LearningMode.REPETITION ? 'selected' : ''}">
              {$_(`category.learning_mode.${LearningMode.REPETITION}.text1`)} <br /> 
              {$_(`category.learning_mode.${LearningMode.REPETITION}.text2`)} 
            </p>
          </Col>
        </Row>
      </div>
    {:else}
      <Row class="{currentLearningMode !== null ? currentLearningMode : ''}">
        <Col>
        </Col>
      </Row>
    {/if}
  </div>

  {#if currentLearningMode === null}
    <Button class="start-button" on:click={() => { currentLearningMode = LearningMode.FILTER; goToTrainingView() }}>{$_('category.buttons.filter_words_normal')}</Button>
  {:else}
    <Button class="start-button {currentLearningMode !== null ? currentLearningMode : ''}" on:click={goToTrainingView}>{$_('category.buttons.start')}</Button>
  {/if}
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
    statisticsData, modeStatisticsData
  } from '../js/store.js';

  import { slide } from 'svelte/transition';
  import { trainingModes as defaultTrainingModes, WordsType, LearningMode, AppInfo, setActivity, getDefaultModeStatisticsData } from '../js/utils.js'
  import WordsStorage from '../js/storages/words.js';
  import { numberFilteringWords } from '../js/config.js';
  import Statistics from '../components/Statistics.svelte';
  import TrainingModes from '../components/TrainingModes.svelte';
  import SVGIcon from '../components/SVGIcon.svelte';
  import Header from '../components/Header.svelte';
  import DS from '../js/storages/data.js';
  import { _ } from 'svelte-i18n';

  export let f7router;            

  $categoryDetailData.loadWords("learning"); 
  $categoryDetailData.loadWords("unknown"); 
  $categoryDetailData.loadWords("known"); 

  statisticsData.set($categoryDetailData.getStatistics());
  setupModeStatistics();

  let currentLearningMode = getDefaultLearningMode();
  let modeType = null;

  //if (($statisticsData.known - $statisticsData.alreadyKnown) === 0 && $statisticsData.learning === 0) {
  //  currentLearningMode = LearningMode.FILTER;
  //  goToTrainingView();
  //}

  function getDefaultLearningMode(learningMode = LearningMode.TRAINING) {
    return $statisticsData.learning === 0 ? null : learningMode === LearningMode.FILTER ? LearningMode.TRAINING : learningMode
  }

  function setupModeStatistics() {
    let modeStatistics = $categoryDetailData.getModeStatistics();
    if (modeStatistics !== null) {
      modeStatisticsData.set(modeStatistics);
    } else {
      modeStatisticsData.set(getDefaultModeStatisticsData($statisticsData.learning));
      setTimeout(setupModeStatistics, 100);
    }
  }

  function setupData(isTraining, currentWordStorage, wordsCount) {
    trainingData.set({ 
      mode: [LearningMode.FILTER, LearningMode.REPETITION].includes(currentLearningMode) ? "read" : modeType, 
      type: currentLearningMode, 
      isTraining: currentLearningMode === LearningMode.TRAINING,
      words: currentWordStorage.getWords(wordsCount),
      currentWordIndex: 0
    });
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
    let isTraining = currentLearningMode === LearningMode.TRAINING && currentLearningMode !== LearningMode.FILTER;  
    let isRepetition = currentLearningMode === LearningMode.REPETITION;
    let isFiltering = currentLearningMode === LearningMode.FILTER;
    let wordsCount = isFiltering ? numberFilteringWords : $settingsData.wordsLimit;

    f7.preloader.show();
    let currentWordStorage = $categoryDetailData.wordStorages[isRepetition ? "known" : isFiltering ? "unknown" : "learning"];

    if(currentWordStorage.isLoaded(wordsCount)) {
      setupData(isTraining, currentWordStorage, wordsCount);
      f7.preloader.hide();
      checkAndSetActivity();
      setTimeout(() => currentLearningMode = getDefaultLearningMode(currentLearningMode), 1000);

      f7router.navigate('/Training');
    } else {
      let tmpCurrentLearningMode = currentLearningMode;
      setTimeout(() => { 
        currentLearningMode = tmpCurrentLearningMode;
        goToTrainingView();
      }, 1000);
    }
  }
</script>
