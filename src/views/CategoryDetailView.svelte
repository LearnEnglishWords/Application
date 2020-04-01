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
      <ListItem accordionItem title="{$_('category.training_mode')}" after={trainingModes[trainingModeIndex].title}>
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
        <block>
          {$_('category.words_limit')}
        </block>
      </Col>
    </Row>
  </Block>


  <Block style="display: none" inset>
    <Row>
      <Col>
        <Button large raised popupOpen=".word-list">{$_('category.buttons.words_list')}</Button>
      </Col>
    </Row>
  </Block>

{#if allWordIds.length > 0}
  <WordListPopup style="display: none" name="word-list" allWordIds={allWordIds}/>
{/if}



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
  let trainingModesValues = trainingModes.map((it) => {return {mode: it.value, prevState: false}});

  statisticsData.reset();
  trainingModeStatisticsData.reset();

  if(develMode) {
    setDevelData();
  } else {
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

