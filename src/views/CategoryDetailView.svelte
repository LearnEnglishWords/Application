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
            on:stepperChange={wordsLimitChanged}
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

{#if allWordIds.length > 0}
  <WordListPopup name="word-list" allWordIds={allWordIds} />
{/if}

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

  import { trainingModes } from '../js/utils.js'
  import Collection from '../js/collection.js';
  import Statistics from '../components/Statistics.svelte';
  import WordListPopup from '../popups/WordListPopup.svelte';
  import Header from '../components/Header.svelte';
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

  statisticsData.set($categoryDetailData.stats);
  trainingModeStatisticsData.set($categoryDetailData.modeStats);

  collection.getWordIdsList($collectionData.id, $categoryDetailData.id, (wordIds) => {
    allWordIds = [...wordIds];
    loadWords(0, wordsLimit)
  });

  function loadWords(from, to) {
    filtredWords = filterNotKnownWords()

    if(allWords.length !== allWordIds.length && filtredWords.length < wordsLimit) {
      for (let wordId of allWordIds.slice(from, to)) {
        collection.getWord(wordId, (word) => {
          allWords.push(word);
          wordsLoaded++;
          if(wordsLoaded === to) {
            loadWords(to, to + wordsLimit);
          }
        });
      }
    } else {
      loadingInProgress = false;
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
      loadWords(wordsLoaded, wordsLoaded + wordsLimit);
    }
  }

  function wordsLimitChanged() {
    if(loadingInProgress === false) {
      loadWords(wordsLoaded, wordsLoaded + wordsLimit);
    }
  }

  function setupData(isTraining) {
    let currentMode = trainingModes[trainingModeIndex];

    trainingData.set({ 
      mode: currentMode.value, 
      isTraining: isTraining,
      wallEnabled: !isTraining,
      words: filtredWords.slice(0, wordsLimit)
    });
  }

  function goToTrainingView(isTraining) {
    f7.preloader.show();

    if(allWords.length === allWordIds.length || filtredWords.length > wordsLimit) {
      setupData(isTraining, filtredWords);
      f7.preloader.hide();
      f7router.navigate('/Training');
    } else {
      setTimeout(() => { goToTrainingView(isTraining) }, 1000);
    }
  }

</script>

<style>
</style>

