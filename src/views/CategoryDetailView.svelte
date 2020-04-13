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
      <Col class="read">
        <span>42</span>
        <span>{$_('statistics.read')}</span>
        <span>{$_('statistics.text')}</span>
      </Col>
      <Col class="write">
        <span>241</span>
        <span>{$_('statistics.write')}</span>
        <span>{$_('statistics.text')}</span>
      </Col>
      <Col class="listen">
        <span>604</span>
        <span>{$_('statistics.listen')}</span>
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
        </div>
      {/each}
    </div>
    <!-- Title -->
    <div class="block-title has-after" data-after="42">{$_('category.words_limit')}</div>
    <!-- Slider -->
    <div class="slider block block-strong">
      <div class="range-slider range-slider-init"
        data-min="0"
        data-max="100"
        data-label="true"
        data-step="5"
        data-value="25"
        data-scale="true"
        data-scale-steps="5"
        data-scale-sub-steps="4"
      ></div>
    </div>
  </div>
  <!-- Footer -->
  <div class="footer two">
    <Button on:click={() => goToTrainingView(true)}>{$_('category.buttons.start_training')}</Button>
    <Button on:click={() => goToTrainingView(false)}>{$_('category.buttons.start_testing')}</Button>
  </div>  
    
    
    
  <!-- můžeš smazat oba tyto BLOCK odstavce, nechal jsem jen, abys viděl své skripty -->
  <Block style="display: none;">
    <List>
      <ListItem title= {$_('category.words_title')}>
        <span slot="after">
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
        </span>
      </ListItem>
    </List>
  </Block>

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

  import { defaultTrainingModes, WordsType, allWordsDevelData } from '../js/utils.js'
  import Collection from '../js/collection.js';
  import WordsStorage from '../js/words.js';
  import Statistics from '../components/Statistics.svelte';
  import Header from '../components/Header.svelte';
  import { develMode } from '../js/config.js';
  import { _ } from 'svelte-i18n';

  export let f7router;            

  let collection = new Collection();
  let wordsLimit = $settingsData.wordsLimit;
  let trainingModeIndex = 0;
  let trainingModes = defaultTrainingModes;
  let modeType = trainingModes[trainingModeIndex].value;

  if ($categoryDetailData.wordStorages === undefined) { 
    $categoryDetailData.wordStorages = {
      'read': new WordsStorage($collectionData.id, $categoryDetailData.id, 'read', 100),
      'write': new WordsStorage($collectionData.id, $categoryDetailData.id, 'write', 100),
      'listen': new WordsStorage($collectionData.id, $categoryDetailData.id, 'listen', 100),
    }
  }

  let currentWordStorage = $categoryDetailData.wordStorages[modeType]; 

  trainingModes.forEach((mode) => {
    let wordStorage = $categoryDetailData.wordStorages[mode.value];
    wordStorage.loadIds(mode.value === 'read');
  });

  if(develMode) {
    //setDevelData();
  } else {
    statisticsData.set($categoryDetailData.stats);
    trainingModeStatisticsData.set($categoryDetailData.modeStats);
  }


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
      words: currentWordStorage.getWords(wordsLimit)
    });
  }

  function goToWordListView(isTraining) {
    f7router.navigate('/WordList');
  }

  function goToTrainingView(isTraining) {
    f7.preloader.show();
    //collection.saveWordIdsList($collectionData.id, $categoryDetailData.id, allWordIds, WordsType.NOT_KNOWN);

    //alert(`counter: ${currentWordStorage.loadedWordsCounter}; idsLength: ${currentWordStorage.allWordIds.length}; wordsLength: ${currentWordStorage.allWords.length}`)

    if(currentWordStorage.isLoaded(wordsLimit)) {
      setupData(isTraining);
      f7.preloader.hide();
      f7router.navigate('/Training');
    } else {
      setTimeout(() => { goToTrainingView(isTraining) }, 1000);
    }
  }
  
  function setDevelData() {
    //allWords = allWordsDevelData;

    //allWordIds = ["hello", "car", "bedroom"];

    categoryDetailData.set({name: "Test category", id: "Test category"});
  }

</script>
