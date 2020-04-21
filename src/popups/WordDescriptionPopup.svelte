<Sheet class="description" opened={descriptionOpened} onSheetClosed={() => descriptionOpened = false}>
  <div class="sheet-title">
    <span>{$_('training.description_title')}</span>
    <SVGIcon name="e-remove" size="24"/>
  </div>
            <List>
        {#each word.examples as example, id}
          <ListItem>{example}<SVGIcon name="sound" size="24"/></ListItem>
        {/each}
      </List>
  
  
  
  <!--<PageContent>
    <Header type="popup" popupName="description" title={$_('training.description_title')} />
      <List>
        {#each word.examples as example, id}
          <ListItem> {example} <Button>&#x1F509;</Button></ListItem>
        {/each}
      </List>
  </PageContent>-->
</Sheet>

<script>
  import { 
    PageContent, Block, 
    List, ListItem,
    Button, Sheet
  } from 'framework7-svelte';
  import { _ } from 'svelte-i18n';
  import Header from '../components/Header.svelte';
  import SVGIcon from '../components/SVGIcon.svelte';

  export let word;
  let descriptionOpened = false;
</script>
