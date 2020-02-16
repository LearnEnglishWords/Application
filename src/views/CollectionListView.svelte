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
                <Button fill on:click={ () => downloadButton(id) } color="red">Download</Button>
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
    Page, 
    AccordionContent, 
    Navbar,
    List,
    ListItem,
    BlockTitle,
    Button,
    Block 
  } from 'framework7-svelte';

  import Framework7 from 'framework7/framework7-lite.esm.bundle.js';
  import { Device, Request, Utils } from 'framework7';
  import { onMount } from 'svelte';
  import Collection from '../js/collection.js';
  import { collectionData, categoryData } from '../js/store.js';
  import { _ } from 'svelte-i18n';

  export let f7router;
  let collection = new Collection();

  function downloadButton(id){
    collectionData.set({name: "basic"});
    collection.download($collectionData.name, () => {
      collection.getCategories($collectionData.name, (categories) => {
        categoryData.set(categories);
        collectionItems[id].downloaded = true;
      });
    });
  }

  function continueButton(id){
    f7router.navigate('/CategoryList');
    //appStorage.getItem('collection:basic:category:list').then(function(message){
    //    alert(message);
    //});
  }

  const collectionItems = [
    {
      label: "Basic", 
      text: "(Learn 1000 words)", 
      downloaded: false,
      description: "Obsahuje vsechna zakladni anglicka slovicka pro zakladni komunikaci a dorozumeni. ", 
      disabled: false
    },
    {
      label: "Standard",
      text: "(Learn 3000 words)", 
      downloaded: false,
      description: "Se znalosti 2500 az 3000 anglickych slov dokážete porozumět 90 % každodenní anglické konverzace, anglicky psaným novinám a časopisům.", 
      disabled: true
    },
    {
      label: "Student",
      text: "(Learn 5000 words)",
      downloaded: false,
      description: "Specialni kolekce pro studenty. Obsahuje slovicka serazena do skupin podle lekci nejznamejsich ucebnic.", 
      disabled: true
    },
    {
      label: "Native", 
      text: "(Learn 15000 words)",
      downloaded: false,
      description: "Rodily mluvci ma celkem 10000 az 20000 slov v aktivni slovni zasobe. V teto kolekci jsou ty nejznamejsi z nich. (Doporucujeme stahovat az po projiti vsech predchozich kolekci)", 
      disabled: true
    }
  ];
</script>
