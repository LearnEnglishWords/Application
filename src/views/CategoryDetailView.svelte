<Page name="CategoryDetail">
  <Navbar title="LearnEnglishWords">
    <Subnavbar title="Kategorie: {$categoryDetailData}">       
    </Subnavbar>
  </Navbar>              

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
        <Button large raised>Zobrazit seznam vsech slov</Button>
      </Col>
    </Row>
  </Block>
  <Block inset>
    <Row>
      <Col>
        <Button large outline on:click={goToTrainingView}>START TRENINK</Button>
      </Col>
      <Col>
        <Button large fill on:click={goToTrainingView}>START TESTING</Button>
      </Col>
    </Row>
  </Block>

</Page>

<script>
  import { 
    Page, 
    Navbar, Subnavbar,
    BlockTitle, Block,
    List, ListItem,
    AccordionContent,
    Stepper, Gauge,
    Row, Col, Button
  } from 'framework7-svelte';
  import { categoryDetailData, trainingData } from '../js/store.js';
  import { _ } from 'svelte-i18n';

  export let f7router;
  let wordsLimit = 30;
  let trainingModeIndex = 0;
  let trainingModes = [
    { title: "Cteni", value: "read", checked: true},
    { title: "Psani", value: "write", checked: false},
    { title: "Poslech", value: "listen", checked: false}
  ]; 

  function goToTrainingView(category) {
    trainingData.set({ mode: trainingModes[trainingModeIndex].value, limit: wordsLimit, words: null });
    f7router.navigate('/Training');
  }

</script>

<style>
</style>

