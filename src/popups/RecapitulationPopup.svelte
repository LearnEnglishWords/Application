
<Popup animate={false} opened={open}>
  <Header type="popup" popupName="recapitulation"/>
  <center>
    <BlockTitle large >Konec</BlockTitle>
    <BlockTitle medium >Celkove vyhodnoceni:</BlockTitle>
    <Block>
      <Row>
        <Col> Pocet slov: </Col> <Col> {info.count} </Col>
      </Row>
      <Row style="color: green">
        <Col> Pocet slov spravne: </Col> <Col> {info.known} </Col>
      </Row>
      <Row style="color: red">
        <Col> Pocet slov spatne: </Col> <Col> {info.unknown} </Col>
      </Row>
      <br/> <br/>
      <Row>
        <Col width=25> </Col>
        <Col width=50>
          <Button large fill popupClose color="green" > Pokracovat </Button>
        </Col>
        <Col width=25> </Col>
      </Row>
    </Block>
  </center>
</Popup>

<script>
  import { 
    Popup, 
    BlockTitle, Block,
    Row, Col, 
    Button
  } from 'framework7-svelte';
  import Header from '../components/Header.svelte';

  export let info;
  export let open;
</script>
