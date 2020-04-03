{#if simple}

  <span class="known">{statistic.known}</span>
  {#if !withoutLearning} <span class="learning">{statistic.learning}</span> {/if}
  <span class="unknown">{statistic.unknown}</span>

{:else}
  <Row>
    <BlockTitle class="category-title">{$_('category.statistics')}</BlockTitle>
    <Col class="category-col">
      <Gauge
        type="semicircle"
        value={$statisticsData.count/10000*$statisticsData.known}
        valueText="{$statisticsData.known}/{$statisticsData.count}"
        valueTextColor="var(--color-green)"
        borderColor="var(--color-green)"
        labelText="{$_('statistics.known')}"
        labelTextColor="var(--color-green)"
      />
    </Col>
    <Col class="category-col">
      <Gauge
        type="semicircle"
        value={$statisticsData.count/10000*$statisticsData.learning}
        valueText="{$statisticsData.learning}/{$statisticsData.count}"
        valueTextColor="var(--color-orange)"
        borderColor="var(--color-orange)"
        labelText="{$_('statistics.learning')}"
        labelTextColor="var(--color-orange)"
      />
    </Col>
    <Col class="category-col">
      <Gauge
        type="semicircle"
        value={$statisticsData.count/10000*$statisticsData.unknown}
        valueText="{$statisticsData.unknown}/{$statisticsData.count}"
        valueTextColor="var(--color-red)"
        borderColor="var(--color-red)"
        labelText="{$_('statistics.unknown')}"
        labelTextColor="var(--color-red)"
      />
    </Col>
  </Row>
{/if}

<script>
  import { BlockTitle, Row, Col, Gauge } from 'framework7-svelte';
  import { _ } from 'svelte-i18n';
  import { statisticsData, collectionData } from '../js/store.js';
  import Collection from '../js/collection.js';

  export let simple = false;
  export let withoutLearning = false;
  export let statistic;

  let collection = new Collection();
  
</script>
