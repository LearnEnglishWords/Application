<Page name="WordList">
  <Header title={$_('words_list.title')} />

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
    f7, Page, 
    BlockTitle, Block,
    List, ListItem,
    Button
  } from 'framework7-svelte';
  import Collection from '../js/collection.js';
  import Header from '../components/Header.svelte';
  import { isKnown, getState, trainingModes, playSound, allWordsDevelData } from '../js/utils.js'
  import { 
    updateAllStatisticsAndSaveWord, collectionData,
    categoryDetailData, trainingData,
    statisticsData, trainingModeStatisticsData 
  } from '../js/store.js';

  import { appName, develMode }  from '../js/config.js';
  import { get } from 'svelte/store';
  import { _ } from 'svelte-i18n';

  export let name;

  const collection = new Collection();

  let wordState = {};
  let allWordsSorted = [];

  if (develMode) {
    allWordsSorted = allWordsDevelData;
  } else {
    let allWordIds = $collectionData.categoriesWithWords
                  .find(({category, wordIds}) => 
                    $categoryDetailData.id === category.id
                  ).wordIds;

    // sort words 
    let allWordsSortedIds = allWordIds.sort((a, b) => {
      return a.charCodeAt(0) - b.charCodeAt(0)
    });

    allWordsSortedIds.forEach((wordId) => {
      collection.getWord(wordId, (word) => {
        allWordsSorted.push(word);
        wordState[word.text] = isKnown(word);
      });
    });
  }


  function setState(word, known) {
    let prevState = getState(word);
    word.learning = {"read": known, "write": known, "listen": known};
    wordState[word.text] = isKnown(word);

    if(known) {
      trainingModes.forEach((mode) => $categoryDetailData.wordStorages[mode.value].removeWord(word));
    } else {
      trainingModes.forEach((mode) => $categoryDetailData.wordStorages[mode.value].addWord(word));
    }

    let allModes = [
      {mode: 'read', prevState: isKnown},
      {mode: 'write', prevState: isKnown},
      {mode: 'listen', prevState: isKnown}
    ];
    updateAllStatisticsAndSaveWord(word, prevState, allModes);
  }

</script>
