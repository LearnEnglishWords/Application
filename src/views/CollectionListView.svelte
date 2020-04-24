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
                {#if $downloadedCollections.includes(id) && isLoadingCategories}
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
  import { WordsType, Modes, AppInfo } from '../js/utils.js'
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
  let isLoadingCategories = false;


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
    let selectedCollection = $allCollectionsData.find((c) => c.id === collectionId);

    if (!selectedCollection.isLoaded()) {
      setTimeout(() => { continueButton(collectionId) }, 1000);
      return
    }

    isLoadingCategories = false;
    collectionData.set(selectedCollection);

    if ([2,3,7].includes(selectedCollection.id)) {
      categoryDetailData.set(selectedCollection.categoryGroup.mainCategory);
      categoryGroupData.set(selectedCollection.categoryGroup);
      f7router.navigate('/CategoryDetail');
    } else {
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

  let basicCollection = new Collection(2, 'basic', true);
  let standardCollection = new Collection(7, 'standard', true, basicCollection);
  let advancedCollection = new Collection(3, 'advanced', true, standardCollection);

  let collectionItems = [
    basicCollection,
    standardCollection,
    advancedCollection,
    new Collection(9, 'category', true),
    new Collection("student", 'student', false),
    new Collection("native", 'native', false),
    new Collection("media", 'media', false),
    new Collection("personal", 'personal', false),
  ];
  
  setTimeout(() => { preloadAllCollections() }, 1000);
</script>
