{#if simple}

  <div>
    (&nbsp;<span style="color: green">{statistic.known}</span> &nbsp;
    {#if statistic.learning !== undefined} <span style="color: orange">{statistic.learning}</span> &nbsp; {/if}
    <span style="color: red">{statistic.unknown}</span>&nbsp;)
  </div>
{:else}
  <Row>
    <Col class="text-align-center">
      <Gauge
        type="semicircle"
        value={$statisticsData.count/10000*$statisticsData.known}
        valueText="{$statisticsData.known} {$_('statistics.words_part')}"
        valueTextColor="green"
        borderColor="green"
        labelText="{$_('statistics.known')}"
        labelTextColor="#333"
      />
    </Col>
    <Col class="text-align-center">
      <Gauge
        type="semicircle"
        value={$statisticsData.count/10000*$statisticsData.learning}
        valueText="{$statisticsData.learning} {$_('statistics.words_part')}"
        valueTextColor="orange"
        borderColor="orange"
        labelText="{$_('statistics.learning')}"
        labelTextColor="#333"
      />
    </Col>
    <Col class="text-align-center">
      <Gauge
        type="semicircle"
        value={$statisticsData.count/10000*$statisticsData.unknown}
        valueText="{$statisticsData.unknown} {$_('statistics.words_part')}"
        valueTextColor="red"
        borderColor="red"
        labelText="{$_('statistics.unknown')}"
        labelTextColor="#333"
      />
    </Col>
  </Row>
{/if}

<script>
  import { Row, Col, Gauge } from 'framework7-svelte';
  import { _ } from 'svelte-i18n';
  import { statisticsData, collectionData } from '../js/store.js';
  import { develMode } from '../js/config.js';
  import Collection from '../js/collection.js';

  export let simple = false;
  export let statistic;

  let collection = new Collection();
  
</script>
