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
          <Button raised on:click={() => { setState(word, !wordState[word.text]) }}>
            {#if wordState[word.text]} {$_('words_list.unknown')} {:else} {$_('words_list.known')} {/if}
          </Button>
        </ListItem>
      {/each}
    </List>
  </Block>
  {#if removeWords.length > 0 || addWords.length > 0}
    <Toolbar position={'bottom'}>
      <Link></Link>
      <Link on:click={saveWords}>Ulozit</Link>
    </Toolbar>
  {/if}
</Page>

<script>
  import { 
    f7, Page, 
    BlockTitle, Block,
    List, ListItem,
    Button, Link,
    Toolbar
  } from 'framework7-svelte';
  import DS from '../js/storages/data.js';
  import Header from '../components/Header.svelte';
  import Word from '../js/entities/word.js';
  import { isKnown, getState, trainingModes, playSound } from '../js/utils.js'
  import { 
    collectionData, categoryGroupData, 
    categoryDetailData, trainingData,
    statisticsData, trainingModeStatisticsData 
  } from '../js/store.js';

  import { appName }  from '../js/config.js';
  import { get } from 'svelte/store';
  import { _ } from 'svelte-i18n';

  export let name;
  export let f7router;

  let addWords = [];
  let removeWords = [];
  let progress = 0;

  let wordState = {};
  let allWordsSorted = [];
  let batchSize = 20;
  let allWordIds = $categoryDetailData.wordStorages['all'].getWordIds();

  // sort words 
  let allWordsSortedIds = allWordIds.sort((a, b) => {
    return a.charCodeAt(0) - b.charCodeAt(0)
  });

  loadWords(0, batchSize);
  async function loadWords(from, to) {
    allWordsSortedIds.slice(from, to).forEach((wordId) => {
      DS.getWord(wordId).then((word) => {
        allWordsSorted.push(word);
        allWordsSorted = [...allWordsSorted];
        wordState[word.text] = getWordState(word);
      });
    });

    if (to < allWordsSortedIds.length) { 
      setTimeout(() => { loadWords(to, to + batchSize) }, 3000);
    }
  }

  function getWordState(word) {
    if (isKnown(word) && word.knownCategories !== undefined) {
      if ($categoryGroupData === null) {
        return word.knownCategories.includes($categoryDetailData.id);
      } else {
        for (let category of $categoryGroupData.categories) {
          if (word.knownCategories.includes(category.id)) { return true }
        }
      }
    }
    return false
  }

  function updateStatistics() {
    //let removeWordModes = [
    //  {mode: 'read', prevState: true},
    //  {mode: 'write', prevState: true},
    //  {mode: 'listen', prevState: true}
    //];
    //let addWordModes = [
    //  {mode: 'read', prevState: false},
    //  {mode: 'write', prevState: false},
    //  {mode: 'listen', prevState: false}
    //];

    removeWords.forEach((wordId) => {
      let word = allWordsSorted.find((w) => w.text === wordId);
      if (!isKnown(word)) {
        Word.setNewState(word, {"read": true, "write": true, "listen": true}).then(() =>
          progress++
        );
      }
    });

    addWords.forEach((wordId) => {
      let word = allWordsSorted.find((w) => w.text === wordId);
      if (isKnown(word)) {
        Word.setNewState(word, {"read": false, "write": false, "listen": false}).then(() =>
          progress++
        );
      }
    });
  }

  function saveWords() {
    progress = 0;
    let dialog = f7.dialog.progress($_('words_list.progress'), 0);
    updateStatistics();
    trainingModes.forEach((mode) => {
      let currentCategory = $categoryGroupData;
      if (currentCategory === null) { currentCategory = $categoryDetailData }
      currentCategory.updateWords(mode.value, addWords, removeWords);
    });
    updateProgress(dialog);
  }

  function updateProgress(dialog) {
    dialog.setProgress(100/(removeWords.length + addWords.length)*progress);
    setTimeout(() => {
      if (progress === removeWords.length + addWords.length) {
        dialog.close();
        addWords = [];
        removeWords = [];
        f7router.back();
      } else {
        updateProgress(dialog);
      }
    }, 100);
  }

  function setState(word, known) {
    wordState[word.text] = known;

    if (isKnown(word) === known && (word.knownCategories === undefined || word.knownCategories.length === 0)) {
      var index = addWords.indexOf(word.text);
      if (index > -1) { addWords.splice(index, 1) }

      index = removeWords.indexOf(word.text);
      if (index > -1) { removeWords.splice(index, 1) }
      return
    }

    if (known) {
      removeWords.push(word.text);
      removeWords = [...removeWords];
    } else {
      addWords.push(word.text);
      addWords = [...addWords];
    }
  }

</script>
