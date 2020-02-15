<Page name="CategoryDetail">
  <Navbar title="LearnEnglishWords">
  </Navbar>              
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
      <ListItem radio title="Cteni" value="read" name="mode" checked></ListItem>
      <ListItem radio title="Psani" value="write" name="mode"></ListItem>
      <ListItem radio title="Poslech" value="listen" name="mode"></ListItem>
    </List>
  </Block>

  <BlockTitle>Pocet slov:</BlockTitle>
  <Block>
    <center>
      <Stepper round large fill value={30} min={10} max={100} step={10}></Stepper>
    </center>
  </Block>
  <Button large fill>START</Button>

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
  import { categoryDetailData } from '../js/store.js';
  import { _ } from 'svelte-i18n';
   
  let wordsCount = 0;
  function setWords(value) {
    wordsCount = value;
  }

</script>

<style>
</style>

