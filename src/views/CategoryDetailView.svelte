<Page name="CategoryDetail">
  <Navbar title="LearnEnglishWords">
  </Navbar>              

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
            <ListItem radio title={title} name="mode" on:change={() => trainingModeIndex = id} checked={checked}></ListItem>
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
              {word}  &#x1F509;
              <Button raised>Jiz znam</Button>
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
  import { collectionData, categoryDetailData, trainingData, statisticsData } from '../js/store.js';
  import Collection from '../js/collection.js';
  import Statistics from '../components/Statistics.svelte';
  import { _ } from 'svelte-i18n';

  export let f7router;

  let collection = new Collection();
  let listWordsOpened = false;
  let allWords = [
    {text: "hello", pronunciation:"hello", sense: ["ahoj", "cau", "dobry den"], example: ""},
    {text: "car", pronunciation:"car", sense: ["auto", "vozidlo"], example: ""},
    {text: "bedroom", pronunciation:"bedroom", sense: ["loznice"], example: ""}
  ];
  let allWordsSorted = ["hello", "car", "bedroom"];
  let wordsLimit = 30;
  let trainingModeIndex = 0;
  let trainingModes = [
    { title: "Cteni", value: "read", checked: true},
    { title: "Psani", value: "write", checked: false},
    { title: "Poslech", value: "listen", checked: false}
  ]; 
  statisticsData.reset();

  collection.getWordList($collectionData.id, $categoryDetailData.id, (wordIds) => {
    allWords = [];
    allWordsSorted = [];
    statisticsData.setCount(wordIds.length);

    for (let wordId of wordIds) {
      collection.getWord(wordId, (word) => {
        allWords.push(word);
        statisticsData.updateData(word, "unknown");
      });
    }
    allWordsSorted = wordIds.sort((a, b) => {
      return a.charCodeAt(0) - b.charCodeAt(0)
    });
  });

  function goToTrainingView(isTraining) {
    f7.preloader.show();
    trainingData.set({ 
      mode: trainingModes[trainingModeIndex].value, 
      isTraining: isTraining,
      wallEnabled: !isTraining,
      words: allWords.slice(0, wordsLimit-1)
    });
    f7router.navigate('/Training');
  }

</script>

<style>
</style>

