<Page name="CategoryDetail">
  <Header />

  <center>
    <BlockTitle medium>{$categoryDetailData.name}</BlockTitle>
  </center>
  <Block inset>
    <BlockTitle>{$_('category.statistics')}</BlockTitle>
    <Statistics/>
  </Block>


  <List accordionList inset>
    <ListItem accordionItem header={$_('category.training_mode')} title="{trainingModes[trainingModeIndex].title}">
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

{#if allWordIds.length > 0}
  <WordListPopup name="word-list" allWordIds={allWordIds}/>
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
    collectionData,
    categoryDetailData,
    trainingData,
    settingsData,
    statisticsData,
    trainingModeStatisticsData
  } from '../js/store.js';

  import { trainingModes } from '../js/utils.js'
  import { develMode } from '../js/config.js';
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
  let trainingModesValues = trainingModes.map((it) => { return { mode: it.value, prevState: false } });

  statisticsData.reset();
  trainingModeStatisticsData.reset();

  if(develMode) {
    setDevelData();
  } else {
    collection.getWordIdsList($collectionData.id, $categoryDetailData.id, (wordIds) => {
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
  
  function setDevelData() {
    allWords = [
      {
        text: "hello",
        pronunciation:"hello",
        sense: ["ahoj", "cau", "dobry den"],
        examples: [
          "Hello, Paul. I haven't seen you for ages.",
          "I know her vaguely - we've exchanged hellos a few times.",
          "I just thought I'd call by and say hello.",
          "And a big hello (= welcome) to all the parents who've come to see the show.",
          "\"Hello, I'd like some information about flights to the US, please.\""
      ]}, {
        text: "car",
        pronunciation:"car",
        sense: ["auto", "osobni automobil", "vozidlo"], 
        examples: [
          "They don't have a car.",
          "Where did you park your car?",
          "It's quicker by car.",
          "Eight children were crammed into the back of the car."
      ]},
      {
        text: "bedroom",
        pronunciation:"bedroom", 
        sense: ["loznice"],
        examples: [
          "Our home has three bedrooms.",
          "You can stay in the spare bedroom.",
          "We've just bought some new bedroom furniture.",
          "The top of the tree is level with his bedroom window."
      ]}
    ];

    allWordIds = ["hello", "car", "bedroom"];

    categoryDetailData.set({name: "Test category", id: "Test category"});
  }

</script>

<style>
</style>

