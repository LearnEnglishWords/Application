<Page name="CollectionList">
  <Header />
  <Block strong inset>
    <BlockTitle medium>{$_('collection.title')}</BlockTitle>
    <List accordionList mediaList inset>
      {#each collectionItems as {id, title, shortDescription, fullDescription, active}}
        {#if active}
          <ListItem accordionItem title="{title}" text="{shortDescription}">
            <AccordionContent>
              <Block>
                <p>
                  {fullDescription}
                </p>
                <p id="collection-loader-{id}"></p>
                {#if $downloadedCollections.includes(id) && isLoading}
                  <Button fill color="green">{$_('collection.button.loading')}</Button>
                {:else if $downloadedCollections.includes(id)}
                  <Button fill on:click={ () => continueButton(id) } color="green">{$_('collection.button.continue')}</Button>
                {:else if downloadingCollectionId === id && counter === 0}
                  <Button fill color="orange">{$_('collection.button.preparing')}</Button>
                {:else if downloadingCollectionId === id && counter > 0}
                  <Button fill color="orange">{$_('collection.button.downloading')}</Button>
                {:else}
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
  import { WordsType, Modes, AppInfo, Collections } from '../js/utils.js'
  import Collection from '../js/entities/collection.js'
  import Header from '../components/Header.svelte';
  import { _ } from 'svelte-i18n';
  import { 
    allCollectionsData,
    collectionData,
    categoryGroupData,
    categoryDetailData,
    downloadedCollections
  } from '../js/store.js';

  export let f7router;


  var collectionStorage = new CollectionStorage();
  let counter = 0;
  let progressBarEl;
  let wordsAmount = 0;
  let downloadingCollectionId = null;
  let isLoading = false;


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
    if (!checkDependency(collectionId, Collections.ADVANCED.id, Collections.INTERMEDIATE.id)) { return }
    if (!checkDependency(collectionId, Collections.INTERMEDIATE.id, Collections.BASIC.id)) { return }

    downloadingCollectionId = collectionId;
    counter = 0;
    wordsAmount = 0;
    progressBarEl = f7.progressbar.show(`#collection-loader-${collectionId}`, 0, 'orange');

    let collection = getCollection(collectionId);
    collectionStorage.downloadCollection(collection, (amount) => wordsAmount += amount, downloadProgress);
  }

  function downloadProgress() {
    f7.progressbar.set(progressBarEl, 100/wordsAmount*(++counter));

    if(counter === wordsAmount) {
      updateCollectionIds($downloadedCollections.concat([downloadingCollectionId]));
      loadCollection(downloadingCollectionId)
      f7.progressbar.hide(progressBarEl); 
      downloadingCollectionId = null;
    }
  }

  function updateCollectionIds(collectionIds) {
    downloadedCollections.set(collectionIds);
    DS.saveAppInfo(AppInfo.DOWNLOADED_COLLECTIONS, collectionIds);
  }

  function continueButton(collectionId){
    isLoading = true;
    let selectedCollection = $allCollectionsData.find((c) => c.id === collectionId);

    if (!selectedCollection.isLoaded()) {
      setTimeout(() => { continueButton(collectionId) }, 1000);
      return
    }

    isLoading = false;
    collectionData.set(selectedCollection);

    if (coreCollections.includes(selectedCollection.id)) {
      selectedCollection.categoryGroup.loadStatistics();
      categoryGroupData.set(selectedCollection.categoryGroup);
      categoryDetailData.set(selectedCollection.categoryGroup.mainCategory);
      f7router.navigate('/CategoryDetail');
    } else {
      categoryGroupData.set(null);
      f7router.navigate('/CategoryList');
    }
  }

  function loadCollection(collectionId) {
    let collection = getCollection(collectionId);
    collection.load()

    const index = $allCollectionsData.findIndex((c) => c.id === collectionId);
    if (index > -1) { $allCollectionsData.splice(index, 1) }

    $allCollectionsData.push(collection);
  }

  let basicCollection = new Collection(Collections.BASIC.id, Collections.BASIC.name, true);
  let standardCollection = new Collection(Collections.INTERMEDIATE.id, Collections.INTERMEDIATE.name, true, basicCollection);
  let advancedCollection = new Collection(Collections.ADVANCED.id, Collections.ADVANCED.name, true, standardCollection);

  const coreCollections = [
    Collections.BASIC.id,
    Collections.INTERMEDIATE.id,
    Collections.ADVANCED.id
  ]

  let collectionItems = [
    basicCollection,
    standardCollection,
    advancedCollection,
    new Collection(Collections.CATEGORY.id, Collections.CATEGORY.name, true),
    new Collection("student", 'student', false),
    new Collection("native", 'native', false),
    new Collection("media", 'media', false),
    new Collection("personal", 'personal', false),
  ];
  
  setTimeout(() => { preloadAllCollections() }, 1000);
</script>
