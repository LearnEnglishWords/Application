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

<!--{#if $trainingData.isTraining}-->
  <Sheet style="--f7-sheet-bg-color: #ffffff" class="description" opened={descriptionOpened} onSheetClosed={() => descriptionOpened = false}>
    <Toolbar>
      <div class="left">Examples</div>
      <div class="right">
        <Link sheetClose>
          <Icon material="clear" />
        </Link>
      </div>
    </Toolbar>
    <!--  Scrollable sheet content -->
    <PageContent>
      <Block>
        <List>
          {#each word.examples as example, id}
            <ListItem> {example} <Button>&#x1F509;</Button></ListItem>
          {/each}
        </List>
      </Block>
    </PageContent>
  </Sheet>
<!--{/if}-->

<script>
  import { 
    PageContent, Block, 
    List, ListItem,
    Row, Col, Button, Link,
    Sheet, Toolbar, Icon
  } from 'framework7-svelte';
  import { _ } from 'svelte-i18n';

  import { trainingData } from '../js/store.js';

  export let word;

  let numbers = ["①", "②", "③", "④", "⑤"];
  let descriptionOpened = false;
</script>
