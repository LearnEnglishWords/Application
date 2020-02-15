<Page name="CategoryDetail">
  <BlockTitle medium>Kategorie: {$categoryDetailData}</BlockTitle>

  <BlockTitle>Statistika:</BlockTitle>
  <Block strong>
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


  <BlockTitle>Druh treninku:</BlockTitle>
  <Block>
    <List>
      <ListItem radio title="Cteni" name="mode" on:change={() => trainingMode = "read"} checked></ListItem>
      <ListItem radio title="Psani" name="mode" on:change={() => trainingMode = "write"}></ListItem>
      <ListItem radio title="Poslech" name="mode" on:change={() => trainingMode = "listen"}></ListItem>
    </List>
  </Block>

  <BlockTitle>Pocet slov:</BlockTitle>
  <Block>
    <center>
      <Stepper round large fill value={30} min={10} max={100} step={10}
          on:stepperMinusClick={() => { if(wordsLimit > 10) { wordsLimit -= 10 } }}
          on:stepperPlusClick={() => { if(wordsLimit < 100) { wordsLimit += 10 } }} 
      ></Stepper>
    </center>
  </Block>
  <Row>
    <Col width="25">
    </Col>
    <Col width="50">
      <Button large fill on:click={goToTrainingView}>START TRENINK</Button>
    </Col>
    <Col width="25">
    </Col>
  </Row>

</Page>

<script>
  import { 
    Page, 
    Navbar, Subnavbar,
    BlockTitle, Block,
    List, ListItem, 
    Stepper, Gauge,
    Row, Col,
    Button
  } from 'framework7-svelte';
  import { categoryDetailData, trainingData } from '../js/store.js';
  import { _ } from 'svelte-i18n';

  export let f7router;
  let wordsLimit = 30;
  let trainingMode = "read";

  function goToTrainingView(category) {
    trainingData.set({ mode: trainingMode, limit: wordsLimit, words: null });
    f7router.navigate('/Training');
  }

</script>

<style>
</style>

