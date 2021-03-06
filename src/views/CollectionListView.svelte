<Page name="CollectionList">
  <Header firstPage {f7router} />
  <div class="page-title">{$_('collection.title')}</div>
  <List accordionList mediaList class="collection-list">
    {#each collectionItems as {id, title, shortDescription, fullDescription, active}}
      {#if active}
        <ListItem accordionItem accordionItemOpened={id === $lastCollectionId} title="{title}" text="{shortDescription}">
          <AccordionContent>
            <Block>
              <p>
                {fullDescription}
              </p>
              <p id="collection-loader-{id}"></p>
              {#if $downloadedCollections.includes(id)}
                <Button class="button-collection" fill on:click={ () => continueButton(id) } style="background-color: var(--app-success)">{$_('collection.button.continue')}</Button>
              {:else if downloadingCollectionId === id && counter === 0}
                <Button class="button-collection" fill style="background-color: var(--app-warning)">{$_('collection.button.preparing')}</Button>
              {:else if downloadingCollectionId === id && counter > 0}
                <Button class="button-collection" fill style="background-color: var(--app-warning)">{$_('collection.button.downloading')}</Button>
              {:else}
                <Button class="button-collection" fill on:click={ () => download(id) } style="background-color: var(--app-error)">{$_('collection.button.download')} <span>({$_('collection.button.download_size')})</span></Button>
              {/if}
            </Block>
          </AccordionContent>
        </ListItem>
      {/if}
    {/each}
  </List>
  <Footer />
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
  import { WordsType, Modes, AppInfo, Collections, coreCollections, log, openDialog } from '../js/utils.js'
  import Collection from '../js/entities/collection.js'
  import Header from '../components/Header.svelte';
  import Footer  from '../components/Footer.svelte';
  import { _ } from 'svelte-i18n';
  import { 
    allCollectionsData,
    collectionData,
    categoryGroupData,
    categoryDetailData,
    downloadedCollections,
    lastCollectionId,
    deviceUUID
  } from '../js/store.js';

  export let f7router;


  var collectionStorage = new CollectionStorage();
  let counter = 0;
  let progressBarEl;
  let wordsAmount = 0;
  let downloadingCollectionId = null;
  let sentLog = false;


  function preloadAllCollections() {
    if($allCollectionsData.length === 0) {
      $downloadedCollections.sort();
      $downloadedCollections.forEach((id) => loadCollection(id)); 
    }
  }

  function getCollection(id) {
    return collectionItems.find((c) => c.id === id);
  }

  function checkDependency(currentCollectionId, collectionId, requireCollectionId) {
    if (currentCollectionId === collectionId && !$downloadedCollections.includes(requireCollectionId)) {
      let collection = getCollection(requireCollectionId);
      openDialog(f7, $_('collection.alert.dependency').replace("{0}", collection.title));
      return false
    }
    return true
  }

  function download(collectionId, withoutProgress = false) {
    if (downloadingCollectionId != null) {
      openDialog(f7, $_('collection.alert.downloading'));
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

  function getCurrentDate() {
    return new Date().toISOString().split("T")[0] + "T00:00:00";
  }

  function saveCurrentDate() {
    DS.saveAppInfo(AppInfo.LAST_UPDATE, getCurrentDate());
  }

  function downloadUpdates(lastUpdateDate, resolve) {
    let dialog = f7.dialog.progress($_('collection.update_progress'), 0);
    collectionStorage.downloadUpdates(lastUpdateDate, (numberWords, counter) => {
      if (numberWords > 0) { 
        dialog.setProgress(100/numberWords*counter);
        if (numberWords === counter) {
          saveCurrentDate();
          dialog.close();
          resolve();
        }
      } else {
        dialog.close();
        resolve(); 
      }
    });
  }

  function updateWords() {
    return new Promise((resolve) => {
      DS.getAppInfo(AppInfo.LAST_UPDATE).then((lastUpdateDate) => {
        if (getCurrentDate() !== lastUpdateDate) {
          if (lastUpdateDate === null) {
            saveCurrentDate();
            resolve();
          } else {
            if (navigator.connection.type === "wifi" || device.platform === "browser") {
              downloadUpdates(lastUpdateDate, resolve);
            } else {
              resolve();
            }
          }
        } else {
          resolve();
        }
      });
    });
  }

  function updateCollectionIds(collectionIds) {
    downloadedCollections.set(collectionIds);
    DS.saveAppInfo(AppInfo.DOWNLOADED_COLLECTIONS, collectionIds);
  }

  function continueButton(collectionId){
    let selectedCollection = $allCollectionsData.find((c) => c.id === collectionId);
    collectionData.set(selectedCollection);
    DS.saveAppInfo(AppInfo.LAST_COLLECTION, collectionId);
    lastCollectionId.set(collectionId);

    if (coreCollections.includes(selectedCollection.id)) {
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
    collection.load();

    const index = $allCollectionsData.findIndex((c) => c.id === collectionId);
    if (index > -1) { $allCollectionsData.splice(index, 1) }

    $allCollectionsData.push(collection);
  }

  let basicCollection = new Collection(Collections.BASIC.id, Collections.BASIC.name, true);
  let standardCollection = new Collection(Collections.INTERMEDIATE.id, Collections.INTERMEDIATE.name, true, basicCollection);
  let advancedCollection = new Collection(Collections.ADVANCED.id, Collections.ADVANCED.name, true, standardCollection);

  let collectionItems = [
    basicCollection,
    standardCollection,
    advancedCollection,
    new Collection(Collections.CATEGORY.id, Collections.CATEGORY.name, true),
    new Collection("student", 'student', false),
    new Collection("native", 'native', false),
    new Collection("media", 'media', false),
    new Collection(Collections.PERSONAL.id, Collections.PERSONAL.name, true),
  ];
  
  // This is disabled because official server is not available right now
  //setTimeout(() => { updateWords().then(preloadAllCollections) }, 2000);
  setTimeout(() => { preloadAllCollections() }, 2000);
</script>
