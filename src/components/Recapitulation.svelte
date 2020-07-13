<div class="recapitulation">
  <div class="title" data-mode={info.trainingType}>
    <span>{$_('recapitulation.title')}:</span>
    {#if info.trainingType !== 'filter'}
      <span>{$_('recapitulation.' + info.trainingMode)}</span>
    {/if}
  </div>
  <div class="score">
    {#if info.trainingType !== 'filter'}
      {#if successInPercent > 80}
      <div data-stars="5">
        <SVGIcon name="happy-sun" size="32"/><span>{$_('recapitulation.score.5')}</span>
      </div>
      {:else if successInPercent > 60}
      <div data-stars="4">
        <SVGIcon name="wink-06" size="32"/><span>{$_('recapitulation.score.4')}</span>
      </div>
      {:else if successInPercent > 40}
      <div data-stars="3">
        <SVGIcon name="puzzled" size="32"/><span>{$_('recapitulation.score.3')}</span>
      </div>
      {:else if successInPercent > 20}
      <div data-stars="2">
        <SVGIcon name="disgusted" size="32"/><span>{$_('recapitulation.score.2')}</span>
      </div>
      {:else}
      <div data-stars="1">
        <SVGIcon name="dizzy-face" size="32"/><span>{$_('recapitulation.score.1')}</span>
      </div>
      {/if}
    {:else}
      <div data-stars="4">
        <SVGIcon name="wink-06" size="32"/><span>{$_('recapitulation.score.neutral')}</span>
      </div>
    {/if}
  </div>

  <Row>
    <Col class="known">
      <span>{info.known}</span>
      <span>{$_('recapitulation.column.text')}</span>
      <span>{$_('recapitulation.column.known')}</span>
    </Col>
    <Col class="all">
      <span>{info.count}</span>
      <span>{$_('recapitulation.column.text')}</span>
      <span>{$_('recapitulation.column.all')}</span>
    </Col>
    <Col class="unknown">
      <span>{info.unknown}</span>
      <span>{$_('recapitulation.column.text')}</span>
      <span>{$_('recapitulation.column.unknown')}</span>
    </Col>
  </Row>
</div>

{#if info.trainingType === 'exam'}
  {#if info.alreadyKnown < 4}
    <p class="recapitulation-text"> {$_('recapitulation.exam.info_text.' + info.trainingMode)} <span>{info.known}</span> {$_('recapitulation.exam.info_text_end')} </p>
    <p class="recapitulation-text"> 
      {$_('recapitulation.exam.info_text_description')} 
      <span>{$_('recapitulation.' + remainingModes[0])}</span>
      {$_('recapitulation.exam.info_text_conjunction')} 
      <span>{$_('recapitulation.' + remainingModes[1])}</span> 
    </p>
  {:else}
    <p class="recapitulation-text"> {$_('recapitulation.exam.info_text_known1')} <span>{info.alreadyKnown}</span> {$_('recapitulation.exam.info_text_end')} </p>
    <p class="recapitulation-text"> 
      {$_('recapitulation.exam.info_text_known2')} 
      {$_('recapitulation.exam.info_text_known3')} 
    </p>
  {/if}
{:else if info.trainingType === 'repetition' && info.unknown > 0}
  <p class="recapitulation-text"> {$_('recapitulation.repetition.info_text')} <span>{info.unknown}</span> {$_('recapitulation.repetition.info_text_end')} </p>
  <p class="recapitulation-text"> {$_('recapitulation.repetition.info_text_description')} </p>
{:else if info.trainingType === 'filter'}
  <p class="recapitulation-text"> {$_('recapitulation.filter.info_text')} <span>{info.known}</span> {$_('recapitulation.filter.info_text_end')} </p>
  <p class="recapitulation-text"> {$_('recapitulation.filter.info_text_description')} </p>
{/if}


<div class="footer-container footer-singular">
  <div class="footer-content">
    <Button back class="page-button button-next">{$_('recapitulation.continue')}</Button>
  </div>
</div>
<script>
  import { 
    Page,  
    BlockTitle, Block,
    Row, Col, 
    Button
  } from 'framework7-svelte';
  import Header from '../components/Header.svelte';
  import SVGIcon from '../components/SVGIcon.svelte';
  import { trainingModes } from '../js/utils.js';
  import { _ } from 'svelte-i18n';

  export let info;
  export let open;
  let successInPercent = 100/info.count*info.known;

  let recapitulation = 'below-average';
  
  let remainingModes = trainingModes.map((mode) => mode.value).filter((value) => value !== info.trainingMode);
</script>
