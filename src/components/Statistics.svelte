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

<script>
  import { Row, Col, Gauge } from 'framework7-svelte';
  import { _ } from 'svelte-i18n';
  import { statisticsData } from '../js/store.js';

  
</script>
