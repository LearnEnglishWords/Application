<Page name="CategoryDetail">
  <Navbar title="LearnEnglishWords">
  </Navbar>              

  <center>
    <BlockTitle medium>{$categoryDetailData.name}</BlockTitle>
  </center>
  <Block inset>
    <BlockTitle>Statistika:</BlockTitle>
    <Row>
      <Col class="text-align-center">
        <Gauge
          type="semicircle"
          value={0.4}
          valueText="45 slov"
          valueTextColor="green"
          borderColor="green"
          labelText="uz umim"
          labelTextColor="#333"
        />
      </Col>
      <Col class="text-align-center">
        <Gauge
          type="semicircle"
          value={0.2}
          valueText="24 slov"
          valueTextColor="orange"
          borderColor="orange"
          labelText="ucim se"
          labelTextColor="#333"
        />
      </Col>
      <Col class="text-align-center">
        <Gauge
          type="semicircle"
          value={0.6}
          valueText="87 slov"
          valueTextColor="red"
          borderColor="red"
          labelText="zbyva se naucit"
          labelTextColor="#333"
        />
      </Col>
    </Row>
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
              {word.text}  &#x1F509;
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
  import { collectionData, categoryDetailData, trainingData } from '../js/store.js';
  import Collection from '../js/collection.js';
  import { _ } from 'svelte-i18n';

  export let f7router;

  let collection = new Collection();
  let listWordsOpened = false;
  let allWords = [];
  let allWordsSorted = [];
  let wordsLimit = 30;
  let trainingModeIndex = 0;
  let trainingModes = [
    { title: "Cteni", value: "read", checked: true},
    { title: "Psani", value: "write", checked: false},
    { title: "Poslech", value: "listen", checked: false}
  ]; 

  collection.getWords($collectionData.id, $categoryDetailData.id, (words) => {
    allWords = [...words];
    allWordsSorted = words.sort((a, b) => {
      return a.text.charCodeAt(0) - b.text.charCodeAt(0)
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

