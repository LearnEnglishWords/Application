<Page name="CollectionList">
  <Header />
  <Block strong inset>
    <BlockTitle medium>{$_('collection.title')}</BlockTitle>
    <List accordionList mediaList inset>
      {#each collectionItems as {id, title, text, description, active}}
        {#if active}
          <ListItem accordionItem title="{title}" text="{text}">
            <AccordionContent>
              <Block>
                <p>
                  {description}
                </p>
                {#if $downloadedCollections.includes(id)}
                  <Button fill on:click={ () => continueButton(id) } color="green">{$_('collection.button.continue')}</Button>
                {:else}
                  <p id="collection-loader-{id}"></p>
                  <Button fill on:click={ () => download(id) } color="red">{$_('collection.button.download')}</Button>
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
  import CollectionStorage from '../js/storages/collections.js';
  import DS from '../js/storages/data.js';
  import { WordsType, Modes } from '../js/utils.js'
  import Header from '../components/Header.svelte';
  import { allCollectionsData, collectionData, downloadedCollections} from '../js/store.js';
  import { _ } from 'svelte-i18n';

  export let f7router;
  let collectionStorage = new CollectionStorage();
  let counter;
  let progressBarEl;
  let wordsAmount = 0;
  let downloadingCollectionId = null;
  
  
  setTimeout(() => { preloadAllCollections() }, 1000);

  function preloadAllCollections() {
    if($allCollectionsData.length === 0) {
      $downloadedCollections.forEach((id) => loadCollection(id)); 
    }
  }

  function getCollection(id) {
    return collectionItems.find((c) => c.id === id);
  }

  function checkDependency(currentCollectionId, collectionId, requireCollectionId) {
    if (currentCollectionId === collectionId && !$downloadedCollections.includes(requireCollectionId)) {
      let collection = getCollection(requireCollectionId);
      alert($_('collection.alert.dependency').replace("{0}", collection.title));
      return false
    }
    return true
  }

  function download(collectionId, withoutProgress = false) {
    if (downloadingCollectionId != null) {
      alert($_('collection.alert.downloading'));
      return
    }
    if (!checkDependency(collectionId, 3, 7)) { return }
    if (!checkDependency(collectionId, 7, 2)) { return }

    downloadingCollectionId = collectionId;
    counter = 0;
    progressBarEl = f7.progressbar.show(`#collection-loader-${collectionId}`, 0, 'orange');

    let collection = getCollection(collectionId);
    if (collection.mainCategory === undefined) {
      collection.mainCategory = $_('collection.items.main_category_default');
    }
    collectionStorage.downloadCollection(collection, (amount) => wordsAmount = amount, downloadProgress);
  }

  function downloadProgress() {
    f7.progressbar.set(progressBarEl, 100/wordsAmount*(++counter));

    if(counter === wordsAmount) {
      updateCollectionIds($downloadedCollections.concat([downloadingCollectionId]));
      loadCollection(downloadingCollectionId);
      f7.progressbar.hide(progressBarEl); 
      downloadingCollectionId = null;
    }
  }

  function updateCollectionIds(collectionIds) {
      downloadedCollections.set(collectionIds);
      DS.saveAppInfo("downloadedCollections", collectionIds);
  }

  function continueButton(collectionId){
    let selectedCollection = $allCollectionsData.find((c) => c.id === collectionId);
    collectionData.set(selectedCollection);
    f7router.navigate('/CategoryList');
  }

  function loadCollection(collectionId) {
    let collection = {
      "id": collectionId, 
      "name": getCollection(collectionId).title, 
      "categories": [],
      "categoriesWithWords": []
    }

    DS.getCategoryList(collectionId).then((categories) => {
      categories.forEach((category) => {
        DS.getWordIdsList(collectionId, category.id, WordsType.ALL, Modes.ALL).then((wordIds) => {
          collection.categoriesWithWords.push({"category": category, "wordIds": wordIds})
        });

        DS.getCategoryStatistics(collectionId, category.id).then((stats) => {
          if (stats !== null) {
            category.stats = stats;
            category.active = false;
            DS.getCategoryModeStatistics(collectionId, category.id)
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
      id: 2,
      title: $_('collection.items.basic.title'), 
      text: $_('collection.items.basic.text'), 
      description: $_('collection.items.basic.description'), 
      mainCategory: $_('collection.items.basic.main_category'), 
      active: true
    },
    {
      id: 7,
      title: $_('collection.items.standard.title'), 
      text: $_('collection.items.standard.text'), 
      description: $_('collection.items.standard.description'), 
      mainCategory: $_('collection.items.standard.main_category'), 
      active: true
    },
    {
      id: 3,
      title: $_('collection.items.advanced.title'), 
      text: $_('collection.items.advanced.text'), 
      description: $_('collection.items.advanced.description'), 
      mainCategory: $_('collection.items.advanced.main_category'), 
      active: true
    },
    {
      id: 9,
      title: $_('collection.items.category.title'), 
      text: $_('collection.items.category.text'), 
      description: $_('collection.items.category.description'), 
      active: true
    },
    {
      id: "student",
      title: "Student",
      text: $_('collection.items.student.text'), 
      description: $_('collection.items.student.description'), 
      active: false
    },
    {
      id: "native",
      title: "Native", 
      text: $_('collection.items.native.text'), 
      description: $_('collection.items.native.description'), 
      active: false
    },
    {
      id: "media",
      title: "Media",
      text: $_('collection.items.media.text'), 
      description: $_('collection.items.media.description'), 
      active: false
    },
    {
      id: "personal",
      title: "Personal",
      text: $_('collection.items.personal.text'), 
      description: $_('collection.items.personal.description'), 
      active: false
    }
  ];
</script>
