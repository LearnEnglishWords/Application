<Page name="CollectionList">
  <Navbar title="LearnEnglishWords">
  </Navbar>

                {$_('page_title')}
  <Block strong inset>
    <BlockTitle medium>Vyberte si kolekci slovicek:</BlockTitle>
    <List accordionList mediaList inset>
      {#each collectionItems as {label, text, downloaded, description, disabled}, id}
        <ListItem accordionItem title="{label}" text="{text}">
          <AccordionContent>
            <Block>
              <p>
                {description}
              </p>
              {#if downloaded}
                <Button fill on:click={ () => continueButton(id) } color="green">Continue</Button>
              {:else}
                <p id="demo-determinate-container-{id}"></p>
                <p>
                  <Button fill on:click={ () => downloadButton(id) } color="red">Download</Button>
                </p>
              {/if}
            </Block>
          </AccordionContent>
        </ListItem>
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
  import { collectionData, categoryData } from '../js/store.js';
  import { _ } from 'svelte-i18n';

  export let f7router;
  let collection = new Collection();
  let downLoading = false;

  function downloadButton(id){
    if (downLoading) return;
    downLoading = true;
    let progressBarEl = f7.progressbar.show(`#demo-determinate-container-${id}`, 0, 'orange');
    let counter = 0; 
    collectionData.set({name: "basic", id: "basic"});
    collection.download($collectionData.name, () => {
      collection.getCategories($collectionData.name, (categories) => {
        categoryData.set(categories);
      });
    }, () => {
      counter += 1;
      f7.progressbar.set(progressBarEl, $categoryData.length*counter);
      if(counter === $categoryData.length) {
        f7.progressbar.hide(progressBarEl); 
        collectionItems[id].downloaded = true;
        downLoading = false;
      }
    });
  }

  function setAsDownloaded(counter) {
      if(counter === $categoryData.length) {
        collectionItems[id].downloaded = true;
      }
  }

  function continueButton(id){
    f7router.navigate('/CategoryList');
  }

  const collectionItems = [
    {
      label: "Basic", 
      text: "(Learn 1000 words)", 
      downloaded: false,
      description: "Obsahuje vsechna zakladni anglicka slovicka pro zakladni komunikaci a dorozumeni.", 
      disabled: false
    },
    {
      label: "Standard",
      text: "(Learn 3000 words)", 
      downloaded: false,
      description: "Se znalosti 2500 az 3000 anglickych slov dokážete porozumět az 80 % každodenní anglické konverzace.", 
      disabled: true
    },
    {
      label: "Student",
      text: "(Learn 5000 words)",
      downloaded: false,
      description: "Specialni kolekce pro studenty. Obsahuje slovicka serazena do skupin podle nejznamejsich ucebnic.", 
      disabled: true
    },
    {
      label: "Native", 
      text: "(Learn 15000 words)",
      downloaded: false,
      description: "Rodily mluvci ma celkem 10000 az 20000 slov v aktivni slovni zasobe. V teto kolekci jsou ty nejznamejsi z nich. (Doporucujeme stahovat az po projiti vsech predchozich kolekci)", 
      disabled: true
    },
    {
      label: "Media",
      text: "(Learn with serial, movies and books)",
      downloaded: false,
      description: "Nejsnadnejsi a nejzabavnejsi formou uceni se anglickych slovicek je skrze serialy, filmy a knihy.", 
      disabled: true
    },
    {
      label: "Personal",
      text: "(Add your own words)",
      downloaded: false,
      description: "Zde si muzete pridavat vlastni slovicka pro procvicovani.", 
      disabled: true
    }
  ];
</script>

<style>
  /* Invert navigation bars to fill style */
:root,
:root.theme-dark,
:root .theme-dark {
  --f7-bars-bg-color: var(--f7-theme-color);
  --f7-bars-bg-color-rgb: var(--f7-theme-color-rgb);
  --f7-bars-translucent-opacity: 0.9;
  --f7-bars-text-color: #fff;
  --f7-bars-link-color: #fff;
  --f7-navbar-subtitle-text-color: rgba(255,255,255,0.85);
  --f7-bars-border-color: transparent;
  --f7-tabbar-link-active-color: #fff;
  --f7-tabbar-link-inactive-color: rgba(255,255,255,0.54);
  --f7-sheet-border-color: transparent;
  --f7-tabbar-link-active-border-color: #fff;
}
.appbar,
.navbar,
.toolbar,
.subnavbar,
.calendar-header,
.calendar-footer {
  --f7-touch-ripple-color: var(--f7-touch-ripple-white);
  --f7-link-highlight-color: var(--f7-link-highlight-white);
  --f7-button-text-color: #fff;
  --f7-button-pressed-bg-color: rgba(255,255,255,0.1);
}
.navbar-large-transparent {
  --f7-navbar-large-title-text-color: #000;

  --r: 255;
  --g: 107;
  --b: 34;
  --progress: var(--f7-navbar-large-collapse-progress);
  --f7-bars-link-color: rgb(
    calc(var(--r) + (255 - var(--r)) * var(--progress)),
    calc(var(--g) + (255 - var(--g)) * var(--progress)),
    calc(var(--b) + (255 - var(--b)) * var(--progress))
  );
}
.theme-dark .navbar-large-transparent {
  --f7-navbar-large-title-text-color: #fff;
}
</style>
