<Page name="CategoryDetail">
  <!-- Navbar -->
  <Header {f7router} />

  <!-- Header -->
  <div class="header-statistics header-container">
    <Row class="header-row">
      <Col class="header-col header-known" on:click={() => f7router.navigate('/WordList', { props: { filter: WordsType.ALL_KNOWN } })}>
        <div class="header-count">{$statisticsData.known}</div>
        <div class="header-type">{$_('statistics.known')}</div>
        <div class="header-subtitle">{$_('statistics.text')}</div>
      </Col>
      <Col class="header-col header-learning" on:click={() => f7router.navigate('/WordList', { props: { filter: WordsType.LEARNING } })}>
        <div class="header-count">{$statisticsData.learning}</div>
        <div class="header-type">{$_('statistics.learning')}</div>
        <div class="header-subtitle">{$_('statistics.text')}</div>
      </Col>
      <Col class="header-col header-unknown" on:click={() => f7router.navigate('/WordList', { props: { filter: WordsType.UNKNOWN } })}>
        <div class="header-count">{$statisticsData.unknown}</div>
        <div class="header-type">{$_('statistics.unknown')}</div>
        <div class="header-subtitle">{$_('statistics.text')}</div>
      </Col>
    </Row>       
  </div>

  <!-- Content -->
  <div class="bottom-navigation detail-nav {currentLearningMode !== null ? 'activated' : ''} {$statisticsData.learning === 0 ? 'inactive' : ''}">
    <Row noGap>
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
    <Row class="second nav-content {currentLearningMode !== null ? "active " + currentLearningMode : ''}">
      <Col>
        <TrainingModes bind:modeType={modeType} 
             enableQuiz={$settingsData.enableQuiz && currentLearningMode === LearningMode.TRAINING} 
             statistics={$modeStatisticsData} 
             active={currentLearningMode !== null && currentLearningMode !== LearningMode.REPETITION} 
         />
        <div class="toggler {currentLearningMode === LearningMode.TRAINING ? "" : "disabled"}">
          <Toggle bind:this={shuffleToggler} on:toggleChange={() => shuffleWordsEnabled = !shuffleWordsEnabled} checked={shuffleWordsEnabled}></Toggle>
          <div class="shuffle-toggle" on:click={() => shuffleToggler.toggle()}>
            {$_('category.shuffle_toggler')}
          </div>
        </div>
        {#if currentLearningMode === LearningMode.EXAM || currentLearningMode === LearningMode.TRAINING}
          <div class="separator-modes {currentLearningMode !== null ? 'visible' : ''}"></div>
        {/if}
        <p class="{currentLearningMode === LearningMode.TRAINING ? 'selected' : ''}">
          {$_(`category.learning_mode.${LearningMode.TRAINING}.text1`)} <br /> 
          {$_(`category.learning_mode.${LearningMode.TRAINING}.text2`)}
        </p>
        <p class="{currentLearningMode === LearningMode.EXAM ? 'selected' : ''}">
          <br/>
          {$_(`category.learning_mode.${LearningMode.EXAM}.text1`)} <br /> 
          {$_(`category.learning_mode.${LearningMode.EXAM}.text2`)}
        </p>
        <p class="{currentLearningMode === LearningMode.REPETITION ? 'selected' : ''}">
          {$_(`category.learning_mode.${LearningMode.REPETITION}.text1`)} <br /> 
          {$_(`category.learning_mode.${LearningMode.REPETITION}.text2`)} 
        </p>
      </Col> 
    </Row>
    <Row class="text-learning {currentLearningMode === null ? 'active' : 'inactive'}">
      <Col>
        <p>{$_(`category.info.text_intro`)}</p>
        <p>{$_(`category.info.text_stats`)}</p>
        <p>{$_(`category.info.text_filter`)}</p>
      </Col> 
    </Row>
  </div>

  {#if currentLearningMode === null}
    <Button class="start-button" on:click={goToFilteringView}>{$_('category.buttons.filter_words_normal')}</Button>
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
    Stepper, Gauge, Toggle,
    Row, Col, 
    Link, Button
  } from 'framework7-svelte';
  import { 
    collectionData, categoryDetailData,
    trainingData, settingsData,
    statisticsData, modeStatisticsData
  } from '../js/store.js';

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

  $categoryDetailData.loadWords(WordsType.LEARNING); 
  $categoryDetailData.loadWords(WordsType.UNKNOWN); 
  $categoryDetailData.loadWords(WordsType.KNOWN); 

  statisticsData.set($categoryDetailData.getStatistics());
  setupModeStatistics();

  let currentLearningMode = getDefaultLearningMode(LearningMode.TRAINING);
  let modeType = null;
  let shuffleWordsEnabled = false;
  let shuffleToggler;

  //if (($statisticsData.known - $statisticsData.alreadyKnown) === 0 && $statisticsData.learning === 0) {
  //  currentLearningMode = LearningMode.FILTER;
  //  goToTrainingView();
  //}

  function getDefaultLearningMode(learningMode = null) {
    return $statisticsData.learning <= 4 ? null : learningMode === LearningMode.FILTER ? LearningMode.TRAINING : learningMode
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
      isFiltering: currentLearningMode === LearningMode.FILTER,
      words: currentWordStorage.getWords(wordsCount),
      shuffleWords: $trainingData.type === LearningMode.REPETITION || $trainingData.type === LearningMode.EXAM ? true : shuffleWordsEnabled,
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
  
  function openDialog(name) {
    let dialog = f7.dialog.create({
      text: $_(`dialog.${name}.text`), 
      title: $_(`dialog.${name}.title`),
      buttons: [{ text: "Ok", bold: true }]
    });
    dialog.open();
  }

  function goToFilteringView() {
    if ($categoryDetailData.getStatistic(WordsType.LEARNING) >= $settingsData.wordsLimit) {
      let dialog = openDialog('learning_full');
      return
    }

    if ($categoryDetailData.getStatistic(WordsType.UNKNOWN) === 0) {
      let dialog = openDialog('unknown_empty');
      return
    }

    if ($settingsData.fastSelectingWords) {
      let maxLimitLearningWords = $settingsData.wordsLimit - $categoryDetailData.getStatistic(WordsType.LEARNING);
      f7router.navigate('/WordSelect', { props: { maxLimit: maxLimitLearningWords } });
    } else {
      currentLearningMode = LearningMode.FILTER; 
      goToTrainingView();
    }
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
