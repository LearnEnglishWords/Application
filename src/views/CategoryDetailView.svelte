<Page name="CategoryDetail">
  <!-- Navbar -->
  <Header>
    <div class="navbar-title title" slot="title">{$_('app_name')}</div>
  </Header>
  <!-- Header -->
  <div class="header-statistics header-container" on:click={() => currentTestingMode = null}>
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
  <div class="page-container view" on:click={() => currentTestingMode = null}>
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
          ></Stepper>
          </div>
        </ListItem>
      </List>
      <Button class="page-button button-show" on:click={goToWordListView}>{$_('category.buttons.words_list')}</Button>
    </div>
  </div>

  <!-- Footer -->
  <div class="bottom-navigation {currentTestingMode !== null ? 'activated' : ''}">
    <Row>
      {#if $categoryDetailData.wordStorages["known"].getWordIds().length > 0}
      <Col class="ripple mode-repetition {currentTestingMode === 'repetition' ? 'selected' : ''}" on:click={() => currentTestingMode === 'repetition' ? currentTestingMode = null : currentTestingMode = 'repetition'}>
        <SVGIcon element="navigation" name="reload" size="16" />
        <span>{$_('category.buttons.repetition')}</span>
      </Col>
      {/if}
      <Col class="ripple mode-exam {currentTestingMode === 'exam' ? 'selected' : ''}" on:click={() => currentTestingMode === 'exam' ? currentTestingMode = null : currentTestingMode = 'exam'}>
        <SVGIcon element="navigation" name="todo" size="16" />
        <span>{$_('category.buttons.exam')}</span>
      </Col>
      <Col class="ripple mode-training {currentTestingMode === 'training' ? 'selected' : ''}" on:click={() => currentTestingMode === 'training' ? currentTestingMode = null : currentTestingMode = 'training'}>
        <SVGIcon element="navigation" name="book-open-2" size="16" />
        <span>{$_('category.buttons.training')}</span>
      </Col>
    </Row>
    <Row class="{currentTestingMode !== null ? currentTestingMode : ''}">
      <Col>
        {#if currentTestingMode === 'training'}
          <p>
            Slouží jenom k učení a procvičování slovíček nanečisto. 
            Výsledky se nezapočítávají do statistik.
          </p>
        {:else if currentTestingMode === 'exam'}
          <p>
            Slouží k otestování, zda daná slovíčka již umíte a opravdu si je pamatujete. 
            Výsledky se započítávají do statistik a známá slovíčka se zde v přezkoušení již znovu nezobrazí.
          </p>
        {:else if currentTestingMode === 'repetition'}
          <p>
            Slouží ke kontrole, zda si již jednou naučená slovíčka stále ještě pamatujete i po několika dnech či týdnech. 
            Výsledky se započítávají do statistik a slovíčka, která máte špatně se vrací zpátky do procesu učení.
            Naopak slovíčka která zodpovíte správně, se zde již znovu nezobrazí. 
          </p>
        {:else}
          <p></p>
        {/if} 
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
  let currentTestingMode = null;

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
      type: currentTestingMode, 
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
    let isTraining = currentTestingMode === "training";  
    let isRepetition = currentTestingMode === "repetition";

    f7.preloader.show();
    currentWordStorage = $categoryDetailData.wordStorages[isRepetition ? "known" : modeType];

    if(currentWordStorage.isLoaded(wordsLimit)) {
      setupData(isTraining);
      f7.preloader.hide();
      checkAndSetActivity();

      f7router.navigate('/Training');
    } else {
      setTimeout(() => { goToTrainingView(isTraining, isRepetition) }, 1000);
    }
  }

</script>
