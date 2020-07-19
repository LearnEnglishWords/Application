<Page name="CategoryDetail">
  <!-- Navbar -->
  <Header>
    <div class="navbar-title title" slot="title">{$_('app_name')}</div>
  </Header>
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
        <TrainingModes bind:modeType={modeType} statistics={$modeStatisticsData} active={currentLearningMode !== null && currentLearningMode !== LearningMode.REPETITION} />
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
    <Row class="text-learning {currentLearningMode === null ? 'active' : 'inactive'}">
      <Col>
        <p>{$_(`category.info.text_intro`)}</p>
        <p>{$_(`category.info.text_stats`)}</p>
        <p>{$_(`category.info.text_filter`)}</p>
      </Col> 
    </Row>
  </div>

  {#if currentLearningMode === null}
    <Button class="start-button" on:click={() => { currentLearningMode = LearningMode.FILTER; $settingsData.advancedUser === null ? showUserLevelDialog() : goToTrainingView() }}>{$_('category.buttons.filter_words_normal')}</Button>
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

  //if (($statisticsData.known - $statisticsData.alreadyKnown) === 0 && $statisticsData.learning === 0) {
  //  currentLearningMode = LearningMode.FILTER;
  //  goToTrainingView();
  //}

  function getDefaultLearningMode(learningMode = null) {
    return $statisticsData.learning <= 4 ? null : learningMode === LearningMode.FILTER ? LearningMode.TRAINING : learningMode
  }

  function showUserLevelDialog() {
    f7.dialog.confirm(
      $_('dialog.user_level_advanced.text'), 
      $_('dialog.user_level_advanced.title'), 
      () => { $settingsData.advancedUser = true; DS.saveSettings($settingsData); goToTrainingView() }, 
      () => { $settingsData.advancedUser = false; DS.saveSettings($settingsData); goToTrainingView() }
    )
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

    if (isFiltering) {
      if ($categoryDetailData.getStatistic(WordsType.LEARNING) >= $settingsData.wordsLimit) {
        currentLearningMode = getDefaultLearningMode(currentLearningMode);
        let dialog = f7.dialog.create({
          text: $_('dialog.learning_full.text'), 
          title: $_('dialog.learning_full.title'),
          buttons: [{ text: "Ok", bold: true }]
        })
        dialog.open();
        return
      }

      if ($settingsData.advancedUser) {
        currentLearningMode = getDefaultLearningMode(currentLearningMode);
        f7router.navigate('/WordSelect', { props: { maxLimit: $settingsData.wordsLimit - $categoryDetailData.getStatistic(WordsType.LEARNING) } });
        return
      }
    }

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
