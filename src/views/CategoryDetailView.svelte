<Page name="CategoryDetail">
  <!-- Navbar -->
  <Header>
    <div class="navbar-title title" slot="title">{$_('app_name')}</div>
  </Header>
  <!-- Header -->
  <div class="header-statistics header-container">
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
  <div class="page-container view">
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
      <!-- Title -->
      <div class="page-title">{$_('category.words_limit')}</div>
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
          ></Stepper>
          </div>
        </ListItem>
      </List>
      <Button class="page-button button-show" on:click={goToWordListView}>{$_('category.buttons.words_list')}</Button>
      {#if $categoryDetailData.wordStorages["known"].getWordIds().length > 0}
        <Button class="page-button button-repeat" on:click={() => goToTrainingView(false, true)}>{$_('category.buttons.start_repeat')}</Button>
      {/if}
    </div>
  </div>
  <!-- Footer -->
  <div class="footer-container footer-double">
    <div class="footer-content">
        <Button class="page-button button-training" on:click={() => goToTrainingView(true, false)}>{$_('category.buttons.start_training')}</Button>
        <Button class="page-button button-practice" on:click={() => goToTrainingView(false, false)}>{$_('category.buttons.start_testing')}</Button>
    </div>
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

  import { trainingModes as defaultTrainingModes, WordsType, AppInfo, setActivity } from '../js/utils.js'
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

  function checkAndSetActivity() {
    DS.getAppInfo(AppInfo.LAST_ACTIVITY).then((lastActivityDay) => { 
      if (lastActivityDay != new Date().getDate()) {
        DS.saveAppInfo(AppInfo.LAST_ACTIVITY, new Date().getDate());
        setActivity(device.uuid);
      }
    });
  }

  function goToTrainingView(isTraining, repetition = false) {
    f7.preloader.show();
    if (repetition) {
      currentWordStorage = $categoryDetailData.wordStorages["known"];
    }

    if(currentWordStorage.isLoaded(wordsLimit)) {
      setupData(isTraining);
      f7.preloader.hide();
      checkAndSetActivity();

      f7router.navigate('/Training');
    } else {
      setTimeout(() => { goToTrainingView(isTraining) }, 1000);
    }
  }

</script>
