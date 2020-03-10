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
    <Page>
      <Navbar title="LearnEnglishWords">
        <NavRight>
          <Link popupClose>Close</Link>
        </NavRight>
      </Navbar>
      <BlockTitle>Zde muzete oznacit slovicka, ktera jiz znate:</BlockTitle>
      <Block>
        <List>
          {#each allWordsSorted as word, id}
            <ListItem>
              {word.text}  &#x1F509;
              <Button raised on:click={() => { setState(word, !isKnown(word)) }}>
                {#if wordState[word.text]} Neznam {:else} Znam {/if}
              </Button>
            </ListItem>
          {/each}
        </List>
      </Block>
    </Page>
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
  import Collection from '../js/collection.js';
  import Statistics from '../components/Statistics.svelte';
  import Header from '../components/Header.svelte';
  import { _ } from 'svelte-i18n';

  export let f7router;

  let wordState = {}
  let collection = new Collection();
  let listWordsOpened = false;
  let allWords = [];
  let allWordsSorted = [];
  let wordsLimit = 30;
  let trainingModeIndex = 0;
  let trainingModes = [
    {title: "Cteni", value: "read", checked: true},
    {title: "Psani", value: "write", checked: false},
    {title: "Poslech", value: "listen", checked: false}
  ]; 
  let trainingModesValues = trainingModes.map((it) => {return {mode: it.value, prevState: false}});

  statisticsData.reset();
  trainingModeStatisticsData.reset();
  //setTestingData();

  collection.getWordList($collectionData.id, $categoryDetailData.id, (wordIds) => {
    // set count of words
    statisticsData.setCount(wordIds.length);
    trainingModeStatisticsData.setCount(wordIds.length, trainingModesValues);

    // load all words
    for (let wordId of wordIds) {
      collection.getWord(wordId, (word) => {
        allWords.push(word);
        statisticsData.updateData(word, "unknown");
        trainingModeStatisticsData.updateData(word, trainingModesValues);
        wordState[wordId] = isKnown(word);
      });
    }

    // sort words for list of words
    let allWordsSortedIds = wordIds.sort((a, b) => {
      return a.charCodeAt(0) - b.charCodeAt(0)
    });
    for (let wordId of allWordsSortedIds) {
      collection.getWord(wordId, (word) => {
        allWordsSorted.push(word);
        allWordsSorted = [...allWordsSorted];
      });
    }
  });

  function isKnown(word) {
    if (word.learning === undefined) { return false }
    if (word.learning.read === false && word.learning.write === false && word.learning.listen === false) {
      return false
    } else {
      return true
    }
  }                   

  function setState(word, known) {
    let trainingModesValues = trainingModes.map((it) => {return {mode: it.value, prevState: !known}});
    let prevState = statisticsData.getState(word);
    word.learning = {"read": known, "write": known, "listen": known};
    statisticsData.updateData(word, prevState);
    trainingModeStatisticsData.updateData(word, trainingModesValues);
    collection.saveWord(word.text, word);
    collection.saveCategoryStatistics($collectionData.id, $categoryDetailData.id, $statisticsData);
    wordState[word.text] = isKnown(word);
  }

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

