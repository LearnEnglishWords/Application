<Page name="CollectionList">
  <Header />
  <!--
    {$_('page_title')}
  -->
  <Block strong inset>
    <BlockTitle medium>Vyberte si kolekci slovicek:</BlockTitle>
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
                  <Button fill on:click={ () => continueButton(id) } color="green">Continue</Button>
                {:else}
                  <p id="collection-loader-{id}"></p>
                  <Button fill on:click={ () => downloadButton(id) } color="red">Download</Button>
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
    f7, Page, 
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
    f7router.navigate('/CategoryList');
  }

  const collectionItems = [
    {
      id: "basic",
      label: "Basic", 
      text: "(Learn 1000 words)", 
      description: "Obsahuje vsechna zakladni anglicka slovicka pro zakladni komunikaci a dorozumeni.", 
      active: true
    },
    {
      id: "standard",
      label: "Standard",
      text: "(Learn 3000 words)", 
      description: "Se znalosti 2500 az 3000 anglickych slov dokážete porozumět az 80% anglické konverzace.", 
      active: true
    },
    {
      id: "advanced",
      label: "Advanced",
      text: "(Learn 5000 words)", 
      description: "Se znalosti 5000 anglickych slov dokážete porozumět 90% každodenní anglické konverzace, psanym novinam a casopisum.", 
      active: true
    },
    {
      id: "student",
      label: "Student",
      text: "(Learn by textbooks)",
      description: "Specialni kolekce pro studenty. Obsahuje slovicka serazena do skupin podle nejznamejsich ucebnic.", 
      active: false
    },
    {
      id: "native",
      label: "Native", 
      text: "(Learn 15000 words)",
      description: "Rodily mluvci ma celkem 10000 az 20000 slov v aktivni slovni zasobe. V teto kolekci jsou ty nejznamejsi z nich. (Doporucujeme stahovat az po projiti vsech predchozich kolekci)", 
      active: false
    },
    {
      id: "media",
      label: "Media",
      text: "(Learn with serial, movies and books)",
      description: "Nejsnadnejsi a nejzabavnejsi formou uceni se anglickych slovicek je skrze serialy, filmy a knihy.", 
      active: false
    },
    {
      id: "personal",
      label: "Personal",
      text: "(Add your own words)",
      description: "Zde si muzete pridavat vlastni slovicka pro procvicovani.", 
      active: false
    }
  ];
</script>

<style>
</style>
