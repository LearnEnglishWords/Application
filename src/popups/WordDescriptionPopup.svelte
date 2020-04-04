<Sheet style="--f7-sheet-bg-color: #ffffff" class="description" opened={descriptionOpened} onSheetClosed={() => descriptionOpened = false}>
  <PageContent>
    <Header type="popup" popupName="description" title={$_('training.description_title')} />
    <Block>
      <List>
        {#each word.examples as example, id}
          <ListItem> {example} <Button>&#x1F509;</Button></ListItem>
        {/each}
      </List>
    </Block>
  </PageContent>
</Sheet>

<script>
  import { 
    PageContent, Block, 
    List, ListItem,
    Button, Sheet
  } from 'framework7-svelte';
  import { _ } from 'svelte-i18n';
  import Header from '../components/Header.svelte';

  export let word;
  let descriptionOpened = false;
</script>
