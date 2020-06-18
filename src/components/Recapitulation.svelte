<h1> {$_('recapitulation.large_title')} {$_('recapitulation.' + info.trainingMode)}</h1>
<p> {$_('recapitulation.info_text.' + info.trainingMode)} {info.known} {$_('recapitulation.info_text_end')} </p>
<p> 
  {$_('recapitulation.info_text_description')} 
  {$_('recapitulation.' + remainingModes[0])} 
  {$_('recapitulation.info_text_conjunction')} 
  {$_('recapitulation.' + remainingModes[1])} 
</p>

{#if successInPercent > 80}    <!-- Udelat zelene -->
<div class="read-mode without recap">
  <div class="read-div"> <!-- DEFAULT SVG: laugh-17 -->
    <div class="title-recapitulation great"><SVGIcon name="happy-sun" size="32"/><span>{$_('recapitulation.score.great')}</span></div>
  </div>
</div>
{:else if successInPercent > 60}   <!-- Udelat svetle zelene -->
<div class="read-mode without recap">
  <div class="read-div">
    <div class="title-recapitulation good"><SVGIcon name="wink-06" size="32"/>{$_('recapitulation.score.good')}</div>
  </div>
</div>
{:else if successInPercent > 40}  <!-- Udelat zlute -->
<div class="read-mode without recap">
  <div class="read-div">
    <div class="title-recapitulation ok"><SVGIcon name="puzzled" size="32"/>{$_('recapitulation.score.ok')}</div>
  </div>
</div>
{:else if successInPercent > 20}  <!-- Udelat oranzove -->
<div class="read-mode without recap">
  <div class="read-div">
    <div class="title-recapitulation bad"><SVGIcon name="disgusted" size="32"/>{$_('recapitulation.score.bad')}</div>
  </div>
</div>
{:else}
<div class="read-mode without recap">
  <div class="read-div">          <!-- Udelat cervene -->
    <div class="title-recapitulation horrible"><SVGIcon name="dizzy-face" size="32"/>{$_('recapitulation.score.horrible')}</div>
  </div>
</div>
{/if}
  <div class="footer-container footer-singular">
    <div class="footer-content">
      <Button back class="page-button button-next">{$_('recapitulation.continue')}</Button>
    </div>
  </div>

<div class="content-mode result">
  <div class="row">
    <div class="col rec-div right">
      <span class="number">{info.known}</span>
      <div>{$_('recapitulation.column.text')}</div>
      <span>{$_('recapitulation.column.known')}</span>
    </div>
    <div class="col rec-div words">
      <span class="number">{info.count}</span>
      <div>{$_('recapitulation.column.text')}</div>
      <span>{$_('recapitulation.column.all')}</span>
    </div>
    <div class="col rec-div wrong">
      <span class="number">{info.unknown}</span>
      <div>{$_('recapitulation.column.text')}</div>
      <span>{$_('recapitulation.column.unknown')}</span>
    </div>
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
