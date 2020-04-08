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
            on:stepperChange={wordsLimitChanged}
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
        <Button large raised popupOpen=".word-list">{$_('category.buttons.words_list')}</Button>
      </Col>
    </Row>
  </Block>

  <WordListPopup style="display: none" name="word-list" on:addWord={addWord} on:removeWord={removeWord} />
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
  import Statistics from '../components/Statistics.svelte';
  import WordListPopup from '../popups/WordListPopup.svelte';
  import Header from '../components/Header.svelte';
  import { develMode } from '../js/config.js';
  import { _ } from 'svelte-i18n';

  export let f7router;

  let collection = new Collection();
  let allWords = [];
  let allWordIds = [];
  let wordsLimit = $settingsData.wordsLimit;
  let trainingModeIndex = 0;
  let wordsLoaded = 0;
  let filtredWords = filterNotKnownWords();
  let loadingInProgress = true;
  let batchSize = wordsLimit;


  if(develMode) {
    setDevelData();
  } else {
    statisticsData.set($categoryDetailData.stats);
    trainingModeStatisticsData.set($categoryDetailData.modeStats);

    collection.getWordIdsList($collectionData.id, $categoryDetailData.id, WordsType.NOT_KNOWN, (wordIds) => {
      allWordIds = [...wordIds];
      $categoryDetailData.wordIds = allWordIds; 
      loadWords(0, batchSize);
    });
  }

  function loadWords(from, to) {
    filtredWords = filterNotKnownWords()

    if(allWords.length !== allWordIds.length && filtredWords.length < batchSize) {
      for (let wordId of allWordIds.slice(from, to)) {
        collection.getWord(wordId, (word) => {
          allWords.push(word);
          wordsLoaded++;
          if(wordsLoaded === to) {
            loadWords(to, to + batchSize);
          }
        });
      }
    } else {
      loadingInProgress = false;
      //alert("Stopped loading.");
    }
  }

  function filterNotKnownWords() {
    let currentMode = trainingModes[trainingModeIndex];
    return allWords.filter((word) => 
      word.learning === undefined || word.learning[currentMode.value] === false
    )
  }

  function changeTrainingMode(index) {
    trainingModeIndex = index;
    if(loadingInProgress === false) {
      loadWords(wordsLoaded, wordsLoaded + batchSize);
    }
  }

  function wordsLimitChanged() {
    if(loadingInProgress === false) {
      loadWords(wordsLoaded, wordsLoaded + batchSize);
    }
  }

  function addWord(event) {
    let word = event.detail.word;
    allWordIds.push(word.text);
    allWords.push(word);
  }

  function removeWord(event) {
    let word = event.detail.word;
    var index = allWordIds.findIndex((wordText) => wordText === word.text);
    allWordIds.splice(index, 1);
    index = allWords.findIndex((w) => w.text === word.text);
    allWords.splice(index, 1);
  }

  function setupData(isTraining) {
    let currentMode = trainingModes[trainingModeIndex];

    trainingData.set({ 
      mode: currentMode.value, 
      isTraining: isTraining,
      wallEnabled: !isTraining,
      words: filterNotKnownWords().slice(0, wordsLimit)
    });
  }

  function goToTrainingView(isTraining) {
    f7.preloader.show();
    //collection.saveWordIdsList($collectionData.id, $categoryDetailData.id, allWordIds, WordsType.NOT_KNOWN);

    if(loadingInProgress === false) {
      setupData(isTraining, filtredWords);
      f7.preloader.hide();
      f7router.navigate('/Training');
    } else {
      setTimeout(() => { goToTrainingView(isTraining) }, 1000);
    }
  }
  
  function setDevelData() {
    allWords = allWordsDevelData;

    allWordIds = ["hello", "car", "bedroom"];

    categoryDetailData.set({name: "Test category", id: "Test category"});
  }

</script>
