<Page name="CollectionList">
  <Header />
  <!--
    {$_('page_title')}
  -->
  <Block strong inset>
    <BlockTitle medium>{$_('collection.title')}</BlockTitle>
    <List accordionList mediaList inset>
      {#each collectionItems as {id, label, text, description, active}}
        {#if active}
          <ListItem accordionItem title="{label}" text="{text}">
            <AccordionContent>
              <Block>
                <p>
                  {description}
                </p>
                {#if $downloadedCollections.includes(id)}
                  <Button fill on:click={ () => continueButton(id) } color="green">{$_('collection.button.continue')}</Button>
                {:else}
                  <p id="collection-loader-{id}"></p>
                  <Button fill on:click={ () => downloadButton(id) } color="red">{$_('collection.button.download')}</Button>
                {/if}
              </Block>
            </AccordionContent>
          </ListItem>
        {/if}
      {/each}
    </List>
  </Block>
</Page>

<script>
  import { 
    f7, f7ready, Page, 
    AccordionContent, 
    Navbar, Button,
    List, ListItem,
    BlockTitle, Block, 
  } from 'framework7-svelte';

  import Framework7 from 'framework7/framework7-lite.esm.bundle.js';
  import { Device, Request, Utils } from 'framework7';
  import { onMount } from 'svelte';
  import Collection from '../js/collection.js';
  import Header from '../components/Header.svelte';
  import { collectionData, downloadedCollections, categoryData } from '../js/store.js';
  import { _ } from 'svelte-i18n';

  export let f7router;
  let collection = new Collection();
  let downLoading = false;
  let counter;
  let progressBarEl;

  function downloadButton(collectionId) {
    if (downLoading) return;
    downLoading = true;
    progressBarEl = f7.progressbar.show(`#collection-loader-${collectionId}`, 0, 'orange');
    counter = 0; 
    collection.download(collectionId, () => setCategoryData(collectionId), () => downloadProgress(collectionId));
  }

  function setCategoryData(collectionId) {
    collection.getCategoryList(collectionId, (categories) => {
      categoryData.set(categories);
    });
  }

  function downloadProgress(collectionId) {
    counter += 1;
    f7.progressbar.set(progressBarEl, $categoryData.length*counter);
    if(counter === $categoryData.length) {
      updateCollectionIds($downloadedCollections.concat([collectionId]));
      f7.progressbar.hide(progressBarEl); 
      downLoading = false;
    }
  }

  function updateCollectionIds(collectionIds) {
      downloadedCollections.set(collectionIds);
      collection.saveAppInfo("downloadedCollections", collectionIds);
  }

  function continueButton(collectionId){
    collectionData.set({"name": collectionId, "id": collectionId});
    setCategoryData(collectionId);
    f7router.navigate('/CategoryList')
  }

  const collectionItems = [
    {
      id: "basic",
      label: "Basic", 
      text: $_('collection.items.basic.text'), 
      description: $_('collection.items.basic.description'), 
      active: true
    },
    {
      id: "standard",
      label: "Standard",
      text: $_('collection.items.standard.text'), 
      description: $_('collection.items.standard.description'), 
      active: true
    },
    {
      id: "advanced",
      label: "Advanced",
      text: $_('collection.items.advanced.text'), 
      description: $_('collection.items.advanced.description'), 
      active: true
    },
    {
      id: "student",
      label: "Student",
      text: $_('collection.items.student.text'), 
      description: $_('collection.items.student.description'), 
      active: false
    },
    {
      id: "native",
      label: "Native", 
      text: $_('collection.items.native.text'), 
      description: $_('collection.items.native.description'), 
      active: false
    },
    {
      id: "media",
      label: "Media",
      text: $_('collection.items.media.text'), 
      description: $_('collection.items.media.description'), 
      active: false
    },
    {
      id: "personal",
      label: "Personal",
      text: $_('collection.items.personal.text'), 
      description: $_('collection.items.personal.description'), 
      active: false
    }
  ];
</script>

<style>
</style>
