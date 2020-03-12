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

{#if $trainingData.isTraining}
  <Sheet class="description" opened={descriptionOpened} onSheetClosed={() => descriptionOpened = false}>
    <Toolbar>
      <div class="left"></div>
      <div class="right">
        <Link sheetClose>Close</Link>
      </div>
    </Toolbar>
    <!--  Scrollable sheet content -->
    <PageContent>
      <Block>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quae ducimus dolorum ipsa aliquid accusamus perferendis laboriosam delectus numquam minima animi, libero illo in tempora harum sequi corporis alias ex adipisci.</p>
        <p>Sunt magni enim saepe quasi aspernatur delectus consectetur fugiat necessitatibus qui sed, similique quis facere tempora, laudantium quae expedita ea, aperiam dolores. Aut deserunt soluta alias magnam. Consequatur, nisi, enim.</p>
        <p>Eaque maiores ducimus, impedit unde culpa qui, explicabo accusamus, non vero corporis voluptatibus similique odit ab. Quaerat quasi consectetur quidem libero? Repudiandae adipisci vel voluptatum, autem libero minus dignissimos repellat.</p>
        <p>Iusto, est corrupti! Totam minus voluptas natus esse possimus nobis, delectus veniam expedita sapiente ut cum reprehenderit aliquid odio amet praesentium vero temporibus obcaecati beatae aspernatur incidunt, perferendis voluptates doloribus?</p>
        <p>Illum id laborum tempore, doloribus culpa labore ex iusto odit. Quibusdam consequuntur totam nam obcaecati, enim cumque nobis, accusamus, quos voluptates, voluptatibus sapiente repellendus nesciunt praesentium velit ipsa illo iusto.</p>
      </Block>
    </PageContent>
  </Sheet>
{/if}

<script>
  import { 
    PageContent, Block, 
    List, ListItem,
    Row, Col, Button, Link,
    Sheet, Toolbar
  } from 'framework7-svelte';
  import { _ } from 'svelte-i18n';

  import { trainingData } from '../js/store.js';

  export let word;

  let numbers = ["①", "②", "③", "④", "⑤"];
  let descriptionOpened = false;
</script>
