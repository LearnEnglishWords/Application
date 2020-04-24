{#if recapitulation === 'above-average'}
<div class="read-mode without recap">
  <div class="read-div">
    <div class="title-recapitulation"><SVGIcon name="smile" size="32"/><span>Nadprůměrné</span></div>
  </div>
</div>
{:else if recapitulation === 'average'}
<div class="read-mode without recap">
  <div class="read-div">
    <div class="title-recapitulation"><SVGIcon name="speechless" size="32"/>Průměrné</div>
  </div>
</div>
{:else}
<div class="read-mode without recap">
  <div class="read-div">
    <div class="title-recapitulation"><SVGIcon name="sad" size="32"/>Podprůměrné</div>
  </div>
</div>
{/if}
<div class="footer-training">
<Button large fill back color="green">{$_('recapitulation.continue')}</Button>
</div>
<div class="content-mode result">
  <div class="row">
    <div class="col rec-div right">
      <span class="number">{info.known}</span>
      <div>Slov</div>
      <span>Znám</span>
    </div>
    <div class="col rec-div words">
      <span class="number">{info.count}</span>
      <div>Slov</div>
      <span>Celkem</span>
    </div>
    <div class="col rec-div wrong">
      <span class="number">{info.unknown}</span>
      <div>Slov</div>
      <span>Neznám</span>
    </div>
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
  import SVGIcon from '../components/SVGIcon.svelte';
  import { _ } from 'svelte-i18n';

  export let info;
  export let open;

  let recapitulation = 'below-average';
</script>
