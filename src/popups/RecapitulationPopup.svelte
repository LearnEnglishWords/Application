
<Popup animate={false} opened={open}>
  <Page>
    <Header type="popup" popupName="recapitulation"/>
    <center>
      <BlockTitle large >{$_('recapitulation.large_title')}</BlockTitle>
      <BlockTitle medium >{$_('recapitulation.medium_title')}</BlockTitle>
      <Block>
        <Row>
          <Col> {$_('recapitulation.number_words')} </Col> <Col> {info.count} </Col>
        </Row>
        <Row style="color: green">
          <Col> {$_('recapitulation.number_right_words')} </Col> <Col> {info.known} </Col>
        </Row>
        <Row style="color: red">
          <Col> {$_('recapitulation.number_wrong_words')} </Col> <Col> {info.unknown} </Col>
        </Row>
        <br/> <br/>
        <Row>
          <Col width=25> </Col>
          <Col width=50>
            <Button large fill popupClose color="green" > {$_('recapitulation.continue')} </Button>
          </Col>
          <Col width=25> </Col>
        </Row>
      </Block>
    </center>
  </Page>
</Popup>

<script>
  import { 
    Page, Popup, 
    BlockTitle, Block,
    Row, Col, 
    Button
  } from 'framework7-svelte';
  import Header from '../components/Header.svelte';
  import { _ } from 'svelte-i18n';

  export let info;
  export let open;
</script>
