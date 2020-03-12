<Page>
  <Navbar title={appName}>
    <NavRight>
      <Link popupClose>Close</Link>
    </NavRight>
  </Navbar>
  <BlockTitle>{$_('words_list.info')}</BlockTitle>
  <Block>
    <List>
      {#each allWordsSorted as word, id}
        <ListItem>
          <div on:click={() => playSound(word)}>
            {word.text}  &#x1F509;
          </div>
          <Button raised on:click={() => { setState(word, !isKnown(word)) }}>
            {#if wordState[word.text]} {$_('words_list.unknown')} {:else} {$_('words_list.known')} {/if}
          </Button>
        </ListItem>
      {/each}
    </List>
  </Block>
</Page>

<script>
  import { 
    f7, Page, Popup, 
    Navbar, Subnavbar, NavRight,
    BlockTitle, Block,
    List, ListItem,
    AccordionContent,
    Stepper, Gauge,
    Row, Col, 
    Link, Button
  } from 'framework7-svelte';
  import Collection from '../js/collection.js';
  import { isKnown, getState, trainingModes, playSound } from '../js/utils.js'

  import { collectionData, categoryDetailData, trainingData, statisticsData, trainingModeStatisticsData } from '../js/store.js';
  import { appName }  from '../js/config.js';
  import { _ } from 'svelte-i18n';

  export let allWordIds = [];

  let collection = new Collection();
  let wordState = {};
  let allWordsSorted = [];
  let trainingModesValues = trainingModes.map((it) => {
    return {mode: it.value, prevState: false}
  });

  // sort words 
  let allWordsSortedIds = allWordIds.sort((a, b) => {
    return a.charCodeAt(0) - b.charCodeAt(0)
  });

  for (let wordId of allWordsSortedIds) {
    collection.getWord(wordId, (word) => {
      allWordsSorted.push(word);
      allWordsSorted = [...allWordsSorted];
      wordState[word.text] = isKnown(word);
    });
  }

  function setState(word, known) {
    let trainingModesValues = trainingModes.map((it) => {return {mode: it.value, prevState: !known}});
    let prevState = getState(word);
    word.learning = {"read": known, "write": known, "listen": known};
    statisticsData.updateData(word, prevState);
    trainingModeStatisticsData.updateData(word, trainingModesValues);
    collection.saveWord(word.text, word);
    collection.saveCategoryStatistics($collectionData.id, $categoryDetailData.id, $statisticsData);
    wordState[word.text] = isKnown(word);
  }
</script>
