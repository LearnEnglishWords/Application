<Page name="CategoryDetail">
  <Header />

  <center>
    <BlockTitle medium>{$categoryDetailData.name}</BlockTitle>
  </center>
  <Block inset>
    <BlockTitle>Statistika:</BlockTitle>
    <Statistics/>
  </Block>


  <List accordionList inset>
    <ListItem accordionItem header="Druh cviceni:" title="{trainingModes[trainingModeIndex].title}">
      <AccordionContent>
        <List>
          {#each trainingModes as {title, value, checked}, id}
            <ListItem radio title={title} name="mode" on:change={() => trainingModeIndex = id} checked={checked}>
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
          Pocet slov:
        </block>
      </Col>
      <Col>
        <Stepper round fill value={30} min={10} max={100} step={10}
            on:stepperMinusClick={() => { if(wordsLimit > 10) { wordsLimit -= 10 } }}
            on:stepperPlusClick={() => { if(wordsLimit < 100) { wordsLimit += 10 } }} 
        ></Stepper>
      </Col>
    </Row>
  </Block>


  <Block inset>
    <Row>
      <Col>
        <Button large raised on:click={() => listWordsOpened = true}>Zobrazit seznam vsech slov</Button>
      </Col>
    </Row>
  </Block>
  <Block inset>
    <Row>
      <Col>
        <Button large outline on:click={() => goToTrainingView(true)}>START TRENINK</Button>
      </Col>
      <Col>
        <Button large fill on:click={() => goToTrainingView(false)}>START TESTING</Button>
      </Col>
    </Row>
  </Block>


  <Popup opened={listWordsOpened} onPopupClosed={() => listWordsOpened = false}>
    {#if allWordIds.length > 0}
      <WordList allWordIds={allWordIds}/>
    {/if}
  </Popup>

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
  import { collectionData, categoryDetailData, trainingData, statisticsData, trainingModeStatisticsData } from '../js/store.js';
  import { trainingModes } from '../js/utils.js'
  import Collection from '../js/collection.js';
  import Statistics from '../components/Statistics.svelte';
  import WordList from '../components/WordList.svelte';
  import Header from '../components/Header.svelte';
  import { _ } from 'svelte-i18n';

  export let f7router;

  let collection = new Collection();
  let listWordsOpened = false;
  let allWords = [];
  let allWordIds = [];
  let wordsLimit = 30;
  let trainingModeIndex = 0;
  let trainingModesValues = trainingModes.map((it) => {return {mode: it.value, prevState: false}});

  statisticsData.reset();
  trainingModeStatisticsData.reset();
  //setTestingData();

  collection.getWordList($collectionData.id, $categoryDetailData.id, (wordIds) => {
    // set count of words
    statisticsData.setCount(wordIds.length);
    trainingModeStatisticsData.setCount(wordIds.length, trainingModesValues);
    allWordIds = [...wordIds];

    // load all words
    for (let wordId of wordIds) {

      collection.getWord(wordId, (word) => {
        allWords.push(word);
        statisticsData.updateData(word, "unknown");
        trainingModeStatisticsData.updateData(word, trainingModesValues);
      });
    }
  });

  function goToTrainingView(isTraining) {
    let currentMode = trainingModes[trainingModeIndex];
    f7.preloader.show();
    trainingData.set({ 
      mode: currentMode.value, 
      isTraining: isTraining,
      wallEnabled: !isTraining,
      words: allWords.filter((word) => {
        return word.learning === undefined || word.learning[currentMode.value] === false
      }).slice(0, wordsLimit)
    });
    f7router.navigate('/Training');
  }
  
  function setTestingData() {
    allWords = [
      {text: "hello", pronunciation:"hello", sense: ["ahoj", "cau", "dobry den"], example: ""},
      {text: "car", pronunciation:"car", sense: ["auto", "osobni automobil", "vozidlo"], example: ""},
      {text: "bedroom", pronunciation:"bedroom", sense: ["loznice"], example: ""}
    ];

    allWordsSorted = ["hello", "car", "bedroom"];

    trainingModeStatistics = {
        read: {known: 4, unknown: 96},
        write: {known: 16, unknown: 84},
        listen: {known: 9, unknown: 91},
    } 
  }

</script>

<style>
</style>

