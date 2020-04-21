<div class="read-mode">
  <div class="read-div">
    <div class="title-recapitulation">{$_('recapitulation.medium_title')}</div>
  </div>
</div>
<div class="footer-training">
<Button large fill back color="green">{$_('recapitulation.continue')}</Button>
</div>
<div class="content-mode">
  <div class="rec-div words">
    <span>{$_('recapitulation.number_words')}</span>
    <span>{info.count}</span>
    </div>
        <div class="rec-div right">
    <span>{$_('recapitulation.number_words')}</span>
    <span>{info.known}</span>
    </div>
        <div class="rec-div wrong">
    <span>{$_('recapitulation.number_words')}</span>
    <span>{info.unknown}</span>
    </div>
</div>


<!--
<Page style="display:none">
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
-->

<script>
  import { 
    Page,  
    BlockTitle, Block,
    Row, Col, 
    Button
  } from 'framework7-svelte';
  import Header from '../components/Header.svelte';
  import { _ } from 'svelte-i18n';

  export let info;
  export let open;
</script>
