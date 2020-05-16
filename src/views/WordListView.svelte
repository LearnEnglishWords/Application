<Page name="WordList">
  <Header title={$_('words_list.title')} />
  <BlockTitle>{$_('words_list.info')}</BlockTitle>

  <Block>
    <div class="list virtual-list media-list"></div>
    {#if allWordsLength > 0 && allWordsLength < allWordIds.length}
      <Button on:click={loadNextWords}>
        {$_('words_list.next_button')}
      </Button>
    {/if}
    {#if allWordsLength === 0}
      {$_('words_list.loading')}
    {/if}
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
  import { onMount } from 'svelte';
  import DS from '../js/storages/data.js';
  import Header from '../components/Header.svelte';
  import WordUpdater from '../js/entities/word-updater.js';
  import { isKnown, getState, trainingModes, playTextSound } from '../js/utils.js'
  import { 
    collectionData, categoryGroupData, 
    categoryDetailData, trainingData,
    statisticsData, trainingModeStatisticsData,
    settingsData
  } from '../js/store.js';

  import { appName }  from '../js/config.js';
  import { get } from 'svelte/store';
  import { _ } from 'svelte-i18n';

  export let name;
  export let f7router;
	
  let addWords = [];
  let removeWords = [];
  let progress = 0;
  let fullProgress = 0;
  let clickedWord = null;

  let wordState = {};
  let allWords = [];
  let allWordIds = $categoryDetailData.wordStorages['all'].getWordIds();
  let allWordsLength = 0;

  let virtualList = null; 
  let allowInfinite = true;
  let itemsPerLoad = 30;


  onMount(() => { 
    virtualList = f7.virtualList.create({
      el: '.virtual-list',
      items: allWords,
      itemTemplate:
      `<li class="word-item">
          <div class="item-inner">
            <div class="item-title-row">
              <div class="item-title play-sound">{{word.text}} &#x1F509;</div>
              <input type="checkbox" {{checked}} class="wordbox">
            </div>
          </div>
        </li>`,
      height: f7.theme === 'ios' ? 42 : (f7.theme === 'md' ? 52 : 25),
    });


    virtualList.$el.on('click', '.word-item', function (e) {
      let index = this.f7VirtualListIndex;
      clickedWord = allWords[index].word;
    });

    virtualList.$el.on('click', '.wordbox', function (e) {
      setState(clickedWord, !wordState[clickedWord.text]);
    });

    virtualList.$el.on('click', '.play-sound', function (e) {
      playTextSound(clickedWord.text, $settingsData.pronunciation);
    });

    loadWords(0, itemsPerLoad);
  });


  function loadNextWords() {
    if (!allowInfinite) return;

    allowInfinite = false;
    loadWords(allWords.length, allWords.length + itemsPerLoad);
  }

  function loadWords(from, to) {
    allWordIds.slice(from, to).forEach((wordId, index) => {
      DS.getWord(wordId).then((word) => {
        wordState[word.text] = isKnown(word);
        virtualList.appendItem({"word": word, "checked": wordState[word.text] ? "checked" : ""});
        allWordsLength++;
      });
      if (index+1 === itemsPerLoad) {
        allowInfinite = true;
      }
    });
  }

  function updateStatistics() {
    removeWords.forEach((wordId) => {
      let word = allWords.find((item) => item.word.text === wordId).word;
      if (!isKnown(word)) {
        let prevLearningState = {...word.learning};
        word.learning = {"read": true, "write": true, "listen": true};
        WordUpdater.update(word, prevLearningState).then(() =>
          progress++
        );
      }
    });

    addWords.forEach((wordId) => {
      let word = allWords.find((item) => item.word.text === wordId).word;

      if (isKnown(word)) {
        let prevLearningState = {...word.learning};

        word.learning = {"read": false, "write": false, "listen": false};
        WordUpdater.update(word, prevLearningState).then(() =>
          progress++
        );
      }
    });
  }

  function saveWords() {
    progress = 0;
    fullProgress = removeWords.length + addWords.length;
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
    dialog.setProgress(100/fullProgress*progress);
    setTimeout(() => {
      if (progress === fullProgress) {
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

    if (isKnown(word) === known) {
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
