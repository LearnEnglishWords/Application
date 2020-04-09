<Page name="CategoryDetail">
  <Header />

  <center>
    <BlockTitle medium>{$categoryDetailData.czechName}</BlockTitle>
  </center>
  <Block inset>
    <BlockTitle>{$_('category.statistics')}</BlockTitle>
    <Statistics />
  </Block>


  <List accordionList inset>
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

  <Block inset>
    <Row>
      <Col>
        <block>
          {$_('category.words_limit')}
        </block>
      </Col>
      <Col>
        <Stepper round fill value={$settingsData.wordsLimit} min={10} max={100} step={10}
            on:stepperMinusClick={() => { if(wordsLimit > 10) { wordsLimit -= 10 } }}
            on:stepperPlusClick={() => { if(wordsLimit < 100) { wordsLimit += 10 } }} 
        ></Stepper>
      </Col>
    </Row>
  </Block>


  <Block inset>
    <Row>
      <Col>
        <Button large raised popupOpen=".word-list">{$_('category.buttons.words_list')}</Button>
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

  <WordListPopup name="word-list" on:addWord={addWord} on:removeWord={removeWord} />
</Page>

<script>
  import { 
    f7, Page, Popup, 
    Navbar, Subnavbar, NavRight,
    BlockTitle, Block,
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

  import { trainingModes, WordsType } from '../js/utils.js'
  import Collection from '../js/collection.js';
  import WordsStorage from '../js/words.js';
  import Statistics from '../components/Statistics.svelte';
  import WordListPopup from '../popups/WordListPopup.svelte';
  import Header from '../components/Header.svelte';
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


  statisticsData.set($categoryDetailData.stats);
  trainingModeStatisticsData.set($categoryDetailData.modeStats);

  currentWordStorage.load($collectionData.id, $categoryDetailData.id);


  function changeTrainingMode(index) {
    trainingModeIndex = index;
    modeType = trainingModes[index].value;
    currentWordStorage = $categoryDetailData.wordStorages[modeType];

    if (currentWordStorage.getWords(wordsLimit).length === 0) {
      currentWordStorage.load($collectionData.id, $categoryDetailData.id);
    }
  }

  function addWord(event) {
    let word = event.detail.word;
    currentWordStorage.addWord(word);
  }

  function removeWord(event) {
    let word = event.detail.word;
    currentWordStorage.removeWord(word);
  }

  function setupData(isTraining) {
    trainingData.set({ 
      mode: modeType, 
      isTraining: isTraining,
      wallEnabled: !isTraining,
      words: currentWordStorage.getWords(wordsLimit)
    });
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

</script>
