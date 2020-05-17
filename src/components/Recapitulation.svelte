{#if successInPercent > 80}    <!-- Udelat zelene -->
<div class="read-mode without recap">
  <div class="read-div">
    <div class="title-recapitulation right"><SVGIcon name="smile" size="32"/><span>{$_('recapitulation.score.great')}</span></div>
  </div>
</div>
{:else if successInPercent > 60}   <!-- Udelat svetle zelene -->
<div class="read-mode without recap">
  <div class="read-div">
    <div class="title-recapitulation neutral"><SVGIcon name="speechless" size="32"/>{$_('recapitulation.score.good')}</div>
  </div>
</div>
{:else if successInPercent > 40}  <!-- Udelat zlute -->
<div class="read-mode without recap">
  <div class="read-div">
    <div class="title-recapitulation neutral"><SVGIcon name="speechless" size="32"/>{$_('recapitulation.score.ok')}</div>
  </div>
</div>
{:else if successInPercent > 20}  <!-- Udelat oranzove -->
<div class="read-mode without recap">
  <div class="read-div">
    <div class="title-recapitulation neutral"><SVGIcon name="speechless" size="32"/>{$_('recapitulation.score.bad')}</div>
  </div>
</div>
{:else}
<div class="read-mode without recap">
  <div class="read-div">          <!-- Udelat cervene -->
    <div class="title-recapitulation wrong"><SVGIcon name="sad" size="32"/>{$_('recapitulation.score.horrible')}</div>
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
  let successInPercent = 100/info.count*info.known;

  let recapitulation = 'below-average';
</script>
