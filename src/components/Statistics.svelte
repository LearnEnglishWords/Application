{#if simple}
  {#if statistic !== undefined}
      <div> (                   
        <span style="color: green"> {statistic.known} </span> /
        <span style="color: red"> {statistic.unknown} </span> )
      </div>
  {:else}
    {#await collection.getCategoryStatisticsPromise($collectionData.id, categoryId)}
      <div> (                   
        <span style="color: green"> 0 </span> /
        <span style="color: orange"> 0 </span> /
        <span style="color: red"> 100 </span> )
      </div>
    {:then statistic}
      <div> (                   
        <span style="color: green"> {statistic.known} </span> /
        <span style="color: orange"> {statistic.learning} </span> /
        <span style="color: red"> {statistic.unknown} </span> )
      </div>
    {/await}
  {/if}
{:else}
  <Row>
    <Col class="text-align-center">
      <Gauge
        type="semicircle"
        value={$statisticsData.count/10000*$statisticsData.known}
        valueText="{$statisticsData.known} slov"
        valueTextColor="green"
        borderColor="green"
        labelText="uz umim"
        labelTextColor="#333"
      />
    </Col>
    <Col class="text-align-center">
      <Gauge
        type="semicircle"
        value={$statisticsData.count/10000*$statisticsData.learning}
        valueText="{$statisticsData.learning} slov"
        valueTextColor="orange"
        borderColor="orange"
        labelText="ucim se"
        labelTextColor="#333"
      />
    </Col>
    <Col class="text-align-center">
      <Gauge
        type="semicircle"
        value={$statisticsData.count/10000*$statisticsData.unknown}
        valueText="{$statisticsData.unknown} slov"
        valueTextColor="red"
        borderColor="red"
        labelText="zbyva se naucit"
        labelTextColor="#333"
      />
    </Col>
  </Row>
{/if}

<script>
  import { Row, Col, Gauge } from 'framework7-svelte';
  import { _ } from 'svelte-i18n';
  import { statisticsData, collectionData } from '../js/store.js';
  import Collection from '../js/collection.js';

  export let simple = false;
  export let categoryId;
  export let statistic;

  let collection = new Collection();
  
</script>
