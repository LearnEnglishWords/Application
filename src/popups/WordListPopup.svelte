<Popup class={name} animate={true} >
  <Page>
    <Header type="popup" popupName={name} title={appName}/>

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
</Popup>

<script>
  import { 
    f7, Page, Popup, 
    BlockTitle, Block,
    List, ListItem,
    Button
  } from 'framework7-svelte';
  import Collection from '../js/collection.js';
  import Header from '../components/Header.svelte';
  import { isKnown, getState, trainingModes, playSound } from '../js/utils.js'
  import { 
    updateAllStatisticsAndSaveWord, collectionData,
    categoryDetailData, trainingData,
    statisticsData, trainingModeStatisticsData 
  } from '../js/store.js';

  import { appName, develMode }  from '../js/config.js';
  import { get } from 'svelte/store';
  import { _ } from 'svelte-i18n';

  export let allWordIds = [];
  export let name;

  let collection = new Collection();
  let wordState = {};
  let allWordsSorted = [];
  let batchSize = 20;
  let trainingModesValues = trainingModes.map((it) => {
    return {mode: it.value, prevState: false}
  });

  // sort words 
  let allWordsSortedIds = allWordIds.sort((a, b) => {
    return a.charCodeAt(0) - b.charCodeAt(0)
  });

  loadWords(0, batchSize);
  function loadWords(from, to) {
    allWordsSortedIds.slice(from, to).forEach((wordId) => {
      collection.getWord(wordId, (word) => {
        allWordsSorted.push(word);
        allWordsSorted = [...allWordsSorted];
        wordState[word.text] = isKnown(word);
      });
    });

    if (to < allWordsSortedIds.length) { 
      setTimeout(() => { loadWords(to, to + batchSize) }, 1000);
    }
  }

  async function setState(word, known) {
    let prevState = getState(word);
    word.learning = {"read": known, "write": known, "listen": known};
    wordState[word.text] = isKnown(word);

    let allModes = [
      {mode: 'read', prevState: isKnown},
      {mode: 'write', prevState: isKnown},
      {mode: 'listen', prevState: isKnown}
    ];
    updateAllStatisticsAndSaveWord(word, prevState, allModes);
  }

</script>
