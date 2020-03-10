
<Page>
  <center>
    <BlockTitle large >Konec</BlockTitle>
  <BlockTitle medium >Celkove vyhodnoceni:</BlockTitle>
  <Block>
    <Row>
      <Col>
        Pocet slov:
      </Col>
      <Col>
        {info.count}
      </Col>
    </Row>
    <Row style="color: green">
      <Col>
        Pocet slov spravne:
      </Col>
      <Col>
        {info.known}
      </Col>
    </Row>
    <Row style="color: red">
      <Col>
        Pocet slov spatne:
      </Col>
      <Col>
        {info.unknown}
      </Col>
    </Row>
    <Button large fill popupClose color="green" > Pokracovat </Button>

  </Block>
  </center>
</Page>

<script>
  import { 
    Page, 
    BlockTitle, Block,
    Row, Col, 
    Button
  } from 'framework7-svelte';

  export let info;
</script>
