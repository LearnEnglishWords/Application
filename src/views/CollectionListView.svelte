<Page name="CollectionList">
  <Header />
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
  import { WordsType, Modes } from '../js/utils.js'
  import Header from '../components/Header.svelte';
  import { allCollectionsData, collectionData, downloadedCollections} from '../js/store.js';
  import { _ } from 'svelte-i18n';

  export let f7router;
  let data = new Collection();
  let downLoading = false;
  let counter;
  let progressBarEl;
  
  
  setTimeout(() => { preloadAllCollections() }, 1000);

  function preloadAllCollections() {
    if($allCollectionsData.length === 0) {
      $downloadedCollections.forEach((id) => loadCollection(id)); 
    }
  }

  function downloadButton(collectionId) {
    if (downLoading) return;
    downLoading = true;
    progressBarEl = f7.progressbar.show(`#collection-loader-${collectionId}`, 0, 'orange');
    counter = 0; 
    data.download(collectionId, () => loadCollection(collectionId), () => downloadProgress(collectionId));
  }

  function downloadProgress(collectionId) {
    let collection = $allCollectionsData.find((c) => c.id === collectionId);
    f7.progressbar.set(progressBarEl, 100/collection.categoriesWithWords.length*(++counter));

    if(counter === collection.categoriesWithWords.length) {
      updateCollectionIds($downloadedCollections.concat([collectionId]));
      loadCollection(collectionId);
      f7.progressbar.hide(progressBarEl); 
      downLoading = false;
    }
  }

  function updateCollectionIds(collectionIds) {
      downloadedCollections.set(collectionIds);
      data.saveAppInfo("downloadedCollections", collectionIds);
  }

  function continueButton(collectionId){
    let selectedCollection = $allCollectionsData.find((c) => c.id === collectionId);
    collectionData.set(selectedCollection);
    f7router.navigate('/CategoryList');
  }

  function loadCollection(collectionId) {
    let collection = {
      "id": collectionId, 
      "name": collectionItems.find((c) => c.id === collectionId).label, 
      "categories": [],
      "categoriesWithWords": []
    }

    data.getCategoryList(collectionId, (categories) => {
      categories.forEach((category) => {
        data.getWordIdsList(collectionId, category.id, WordsType.ALL, Modes.ALL, (wordIds) => {
          collection.categoriesWithWords.push({"category": category, "wordIds": wordIds})
        });

        data.getCategoryStatisticsPromise(collectionId, category.id).then((stats) => {
          if (stats !== null) {
            category.stats = stats;
            category.active = false;
            data.getCategoryModeStatisticsPromise(collectionId, category.id)
              .then((modeStats) => { 
                category.modeStats = modeStats; 
              });
            collection.categories.push(category);
          }
        });
      });
    });
    const index = $allCollectionsData.findIndex((c) => c.id === collectionId);
    if (index > -1) { $allCollectionsData.splice(index, 1) }

    $allCollectionsData.push(collection);
  }

  const collectionItems = [
    {
      id: "2",
      label: "Basic", 
      text: $_('collection.items.basic.text'), 
      description: $_('collection.items.basic.description'), 
      active: true
    },
    {
      id: "7",
      label: "Standard",
      text: $_('collection.items.standard.text'), 
      description: $_('collection.items.standard.description'), 
      active: true
    },
    {
      id: "3",
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
