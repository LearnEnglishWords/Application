{#if simple}
  {#if statistic !== undefined}
      <div class="category-counter">                  
        <span class="category-count green">{statistic.known}</span> -
        <span class="category-count red">{statistic.unknown}</span>
      </div>
  {:else}
    {#if develMode}
      <div class="category-counter">                  
        <span class="category-count green">43</span> -
        <span class="category-count orange">57</span> -
        <span class="category-count red">82</span>
      </div>
    {:else}
      {#await collection.getCategoryStatisticsPromise($collectionData.id, categoryId)}
        <div class="category-counter">                  
          <span class="category-count green">?</span> -
          <span class="category-count orange">??</span> -
          <span class="category-count red">???</span>
        </div>
      {:then statistic}
        <div class="category-counter">                   
          <span class="category-count green">{statistic.known}</span> -
          <span class="category-count orange">{statistic.learning}</span> -
          <span class="category-count red">{statistic.unknown}</span>
        </div>
      {/await}
    {/if}
  {/if}
{:else}
  <Row>
    <BlockTitle class="category-title">{$_('category.statistics')}</BlockTitle>
    <Col class="category-col">
      <Gauge
        type="semicircle"
        value={$statisticsData.count/10000*$statisticsData.known}
        valueText="{$statisticsData.known}/100"
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
        valueText="{$statisticsData.learning}/100"
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
        valueText="{$statisticsData.unknown}/100"
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
  import { develMode } from '../js/config.js';
  import Collection from '../js/collection.js';

  export let simple = false;
  export let categoryId;
  export let statistic;

  let collection = new Collection();
  
</script>
