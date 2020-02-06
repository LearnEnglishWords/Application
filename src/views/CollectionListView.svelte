<Page name="CollectionList">
  <Navbar title="LearnEnglishWords">
  </Navbar>

  <Block strong inset>
    <BlockTitle medium>Vyberte kolekci slovicek:</BlockTitle>
    <List accordionList mediaList inset>
      {#each collectionItems as {label, text, description, disabled}, id}
        <ListItem accordionItem title="{label}" text="{text}">
          <AccordionContent>
            <Block>
              <p>
                {description}
              </p>
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
    Subnavbar,
    List,
    ListItem,
    Block 
  } from 'framework7-svelte';

  const collectionItems = [
    {label: "Basic", text: "(Learn 1000 words)", description: "Obsahuje vsechna zakladni anglicka slovicka pro zakladni komunikaci a dorozumeni. ", disabled: false},
    {label: "Standard", text: "(Learn 3000 words)", description: "Se znalosti 2500 az 3000 anglickych slov dokážete porozumět 90 % každodenní anglické konverzace, anglicky psaným novinám a časopisům.", disabled: true},
    {label: "Student", text: "(Learn 5000 words)", description: "Specialni kolekce pro studenty. Obsahuje slovicka serazena do skupin podle lekci nejznamejsich ucebnic.", disabled: true},
    {label: "Native", text: "(Learn 15000 words)", description: "Rodily mluvci ma celkem 10000 az 20000 slov v aktivni slovni zasobe. V teto kolekci jsou ty nejznamejsi z nich. (Doporucujeme stahovat az po projiti vsech predchozich kolekci)", disabled: true}
  ];
</script>
