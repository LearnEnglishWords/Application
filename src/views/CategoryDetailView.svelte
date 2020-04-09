<Page name="CategoryDetail">
  <!-- Navbar -->
  <Header>
    <div slot="title">
      <span>{$_('statistics.title')}</span>
    </div>
  </Header>

  <!-- Header -->
  <div style="display:none" class="CategoryDetail header">
    <Row>
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


  <!-- BlockTitle -->
  <BlockTitle>{$_('category.training_title')}</BlockTitle>
  <!-- AccordionList -->
  <Block>
    <List accordionList noHairlines>
      <ListItem accordionItem header={$_('category.training_mode.title')} title="{$_(`category.training_mode.${trainingModes[trainingModeIndex].value}`)}">
        <AccordionContent>
          <List>
            {#each trainingModes as {value, checked}, id}
              <ListItem radio name="mode" checked={checked} on:change={() => changeTrainingMode(id)} title={$_(`category.training_mode.${value}`)}>
                <Statistics simple statistic={$trainingModeStatisticsData[value]} />
              </ListItem>
            {/each}
          </List>
        </AccordionContent>
      </ListItem>
    </List>
  </Block>

  <!-- BlockTitle -->
  <BlockTitle>{$_('category.words_limit')}</BlockTitle>
  <!-- Stepper -->
  <Block>
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


  <!-- Page -->
  <div style="display:none;" class="CategoryDetail page">


    <!-- Footer -->
    <div class="CategoryDetail footer">
      <Button on:click={() => goToTrainingView(true)}>{$_('category.buttons.start_training')}</Button>
      <Button on:click={() => goToTrainingView(false)}>{$_('category.buttons.start_testing')}</Button>
    </div>
  </div>


  <Block style="display: none" inset>
    <Row>
      <Col>
        <Button large raised on:click={goToWordListView}>{$_('category.buttons.words_list')}</Button>
      </Col>
    </Row>
  </Block>
  <Block inset>
    <Row>
      <Col>
        <Button large outline on:click={() => goToTrainingView(true)}>{$_('category.buttons.start_training')}</Button>
      </Col>
      <Col>
        <Button large fill on:click={() => goToTrainingView(false)}>{$_('category.buttons.start_testing')}</Button>
      </Col>
    </Row>
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

  import { trainingModes, WordsType, allWordsDevelData } from '../js/utils.js'
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
  let modeType = trainingModes[trainingModeIndex].value;

  if ($categoryDetailData.wordStorages === undefined) { 
    $categoryDetailData.wordStorages = {
      'read': new WordsStorage('read', 100),
      'write': new WordsStorage('write', 100),
      'listen': new WordsStorage('listen', 100),
    }
  }

  let currentWordStorage = $categoryDetailData.wordStorages[modeType]; 

  trainingModes.forEach((mode) => {
    let wordStorage = $categoryDetailData.wordStorages[mode.value];
    wordStorage.loadIds($collectionData.id, $categoryDetailData.id, mode.value === 'read');
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
