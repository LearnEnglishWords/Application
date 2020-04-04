<Block>
  <Row>
    <Col width="20">
    </Col>
    <Col width="60">
      <List>
        {#each word.sense.slice(0,3) as sense, id}
          <ListItem> {numbers[id]} {sense.toLowerCase()} </ListItem>
        {/each}
      </List>
      {#if $trainingData.isTraining}
        <Button fill sheetOpen=".description" color="lightblue">{$_('training.buttons.examples')}</Button>
      {/if}
    </Col>
    <Col width="10">
    </Col>
  </Row>
</Block>

<script>
  import { 
    PageContent, Block, 
    List, ListItem,
    Row, Col, Button, Link,
    Sheet, Icon
  } from 'framework7-svelte';
  import { _ } from 'svelte-i18n';

  import Header  from './Header.svelte';
  import { trainingData } from '../js/store.js';

  export let word;

  let numbers = ["①", "②", "③", "④", "⑤"];
</script>
