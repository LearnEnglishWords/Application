<div class="recapitulation">
  <div class="title" data-mode={info.trainingType}>
    <span>{$_('recapitulation.title')}{#if info.trainingType !== LearningMode.FILTER && info.trainingType !== LearningMode.REPETITION}:{/if}</span>
    {#if info.trainingType !== LearningMode.FILTER && info.trainingType !== LearningMode.REPETITION}
      <span>{$_(`recapitulation.${$settingsData.enableQuiz && info.trainingType === LearningMode.TRAINING && info.trainingMode === 'write' ? 'quiz' : info.trainingMode}`)}</span>
    {/if}
  </div>
  <div class="score">
    {#if info.trainingType !== LearningMode.FILTER && info.trainingType !== LearningMode.TRAINING}
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
        <span>
          {#if info.trainingType === LearningMode.FILTER}
            <SVGIcon name="wink-06" size="32"/>
          {/if}
          <span class="done-text">{$_('recapitulation.score.neutral')}</span>
          {#if info.trainingType === LearningMode.TRAINING}
            <span class="percent-text">{$_('recapitulation.success')} {successInPercent}%</span> 
          {/if}
        </span>
      </div>
    {/if}
  </div>

  <Row>
    <Col class="known">
      <span>{info.known}</span>
      <span>{$_('recapitulation.column.text')}</span>
      <span>{$_('recapitulation.column.known')}</span>
    </Col>
    <Col class="unknown">
      <span>{info.unknown}</span>
      <span>{$_('recapitulation.column.text')}</span>
      <span>{$_('recapitulation.column.unknown')}</span>
    </Col>
    <Col class="all">
      <span>{info.count}</span>
      <span>{$_('recapitulation.column.text')}</span>
      <span>{$_('recapitulation.column.all')}</span>
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
  {#if info.unknown <= 7 && info.known >= 20}
    <p class="recapitulation-text"> 
      {$_('recapitulation.filter.advanced_mode.question')}
    </p>
    <div class="footer-container footer-double">
      <div class="footer-content">
        <Button on:click={goBack} outline class="page-button button-next button-outline">{$_('recapitulation.filter.advanced_mode.disable')}</Button>
          <Button on:click={() => { setAdvancedMode(true); goBack() }} class="page-button button-next">{$_('recapitulation.filter.advanced_mode.enable')}</Button>
      </div>
    </div>
  {:else}
    <ContinueButton on:click={goBack}>
      <p class="recapitulation-text"> {$_('recapitulation.filter.info_text_description')} </p>
    </ContinueButton>
  {/if}
{/if}

{#if info.trainingType !== 'filter'}
  <ContinueButton on:click={goBack} />
{/if}


<script>
  import { 
    f7, Page,  
    BlockTitle, Block,
    Row, Col, 
    Button
  } from 'framework7-svelte';
  import Header from './Header.svelte';
  import SVGIcon from './SVGIcon.svelte';
  import ContinueButton from './ContinueButton.svelte';
  import DS from '../js/storages/data.js';
  import { trainingModes, LearningMode, openDialog } from '../js/utils.js';
  import { settingsData } from '../js/store.js';
  import { _ } from 'svelte-i18n';

  export let info;
  export let open;
  export let f7router;

  let successInPercent = 100/info.count*info.known;

  let recapitulation = 'below-average';
  
  let remainingModes = trainingModes.map((mode) => mode.value).filter((value) => value !== info.trainingMode);

  function goBack() {
    f7router.back(f7router.history[f7router.history.length-2], { force: true }); 
  }

  function setAdvancedMode(enable) {
    if (enable) {
      $settingsData.fastSelectingWords = true; 
      DS.saveSettings($settingsData);
      openDialog(f7, $_('dialog.enable_advanced_mode.text'));
    }
  }
</script>
