<Page name="WordList">
  <!-- Navbar -->
  <Header>
    <div class="navbar-title title" slot="title">{$_('app_name')}</div>
  </Header>
  <div class="page-title">{$_('words_list.info')}</div>
    <List class="list-container virtual-list list-words">
    
    </List>
    {#if allWordsLength > 0 && allWordsLength < allWordIds.length}
      <Button class="word-button button-next" on:click={loadNextWords}>
        {$_('words_list.next_button')}
      </Button>
    {/if}
    {#if allWordsLength === 0 && allWordIds.length > 0}
      {$_('words_list.loading')}
    {/if}
    {#if allWordIds.length === 0}
      {$_('words_list.zero_words')}
    {/if}

    <Toolbar position={'bottom'}>
      <Row>
        <Col>
          <Link popoverOpen=".filter-menu">{$_('words_list.filter.button')}</Link>
        </Col>
        <Col>
          {allWordsLength}/{allWordIds.length}
        </Col>
        <Col>
          {#if knownWords.length > 0 || unknownWords.length > 0}
            <Link on:click={saveWords}>{$_('words_list.save_button')}</Link>
          {/if}
        </Col>
      </Row>
    </Toolbar>

  <Popover class="filter-menu">
    <List class="filter-menu-list">
      <ListButton popoverClose on:click={() => { saveFilterAndReload(WordsType.UNKNOWN) }} title={$_('words_list.filter.unknown')} />
      <ListButton popoverClose on:click={() => { saveFilterAndReload(WordsType.LEARNING) }} title={$_('words_list.filter.learning')} />
      <ListButton popoverClose on:click={() => { saveFilterAndReload(WordsType.KNOWN) }} title={$_('words_list.filter.known')} />
      <ListButton popoverClose on:click={() => { saveFilterAndReload(WordsType.ALREADY_KNOWN) }} title={$_('words_list.filter.already_known')} />
      <ListButton popoverClose on:click={() => { saveFilterAndReload(WordsType.ALL) }} title={$_('words_list.filter.all')} />
    </List>
  </Popover>
</Page>

<script>
  import { 
    f7, Page, 
    BlockTitle, Block, 
    Row, Col,
    List, ListItem, ListButton,
    Button, Link,
    Toolbar, Popover
  } from 'framework7-svelte';
  import { onMount } from 'svelte';
  import DS from '../js/storages/data.js';
  import Header from '../components/Header.svelte';
  import { isKnown, getState, trainingModes, playTextSound, KnownStages, WordsType, WordListFilter } from '../js/utils.js'
  import { 
    collectionData, categoryGroupData, 
    categoryDetailData, trainingData,
    statisticsData, settingsData,
    allKnownWordsData, allNotKnownWordsData
  } from '../js/store.js';

  import { get } from 'svelte/store';
  import { _ } from 'svelte-i18n';

  export let f7router;
  export let filter = 'all';
	
  let knownWords = [];
  let unknownWords = [];
  let progress = 0;
  let fullProgress = 0;
  let clickedWord = null;

  let wordState = {};
  let allWords = [];
  var allWordIds = $categoryDetailData.wordStorages[filter].getWordIds();
  let allWordsLength = 0;

  let virtualList = null; 
  let allowInfinite = true;
  let itemsPerLoad = 30;


  onMount(() => { 
    virtualList = f7.virtualList.create({
      el: '.virtual-list',
      items: [],
      itemTemplate:
      `<li class="list-item word-item">
        <div class="list-item item-content">
          <div class="list-media">
            <div slot="media" class="item-media">
              <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" width="24" height="24" class="mode-icon icon-24-volume play-sound" stroke-width="2"><g transform="translate(0, 0)"><polygon stroke-linecap="square" stroke-miterlimit="10" points="14,22 6,16 1,16 1,8 6,8 14,2" stroke-linejoin="miter"></polygon><line stroke-linecap="square" stroke-miterlimit="10" x1="19" y1="12" x2="23" y2="12" stroke-linejoin="miter"></line><line stroke-linecap="square" stroke-miterlimit="10" x1="17.7" y1="7" x2="21.1" y2="5" stroke-linejoin="miter"></line><line stroke-linecap="square" stroke-miterlimit="10" x1="17.7" y1="17" x2="21.1" y2="19" stroke-linejoin="miter"></line></g></svg>    
            </div>
          </div>
          <div class="item-inner">
            <div class="item-title play-sound">{{word.text}}</div>
            <div class="item-after">
              <div slot="after">
                <label class="item-checkbox item-content">
                  <input type="checkbox" {{checked}} class="wordbox">
                  <i class="icon icon-checkbox"></i>
                </label>
              </div>
            </div>
          </div>
        </div>
      </li>`,
      height: f7.theme === 'ios' ? 58 : (f7.theme === 'md' ? 68 : 41),
    });

    virtualList.$el.on('click', '.word-item', function (e) {
      let index = this.f7VirtualListIndex;
      clickedWord = allWords[index];
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
        wordState[word.text] = [WordsType.ALREADY_KNOWN, WordsType.KNOWN].includes($categoryDetailData.getWordState(word));
        virtualList.appendItem({"word": word, "checked": wordState[word.text] ? "checked" : ""});
        allWords.push(word);
        allWordsLength++;
      });
      if (index+1 === itemsPerLoad) {
        allowInfinite = true;
      }
    });
  }

  function saveWords() {
    progress = 0;
    fullProgress = knownWords.length + unknownWords.length;
    let dialog = f7.dialog.progress($_('words_list.progress'), 0);

    $categoryGroupData.updateWordList(knownWords, WordsType.ALREADY_KNOWN, () => progress += 1); 
    $categoryGroupData.updateWordList(unknownWords, WordsType.UNKNOWN, () => progress += 1); 

    updateProgress(dialog);
  }

  function updateProgress(dialog) {
    dialog.setProgress(100/fullProgress*progress);
    setTimeout(() => {
      if (progress >= fullProgress) {
        statisticsData.set($categoryDetailData.getStatistics());
        dialog.close();
        knownWords = [];
        unknownWords = [];
        f7router.back();
      } else {
        updateProgress(dialog);
      }
    }, 100);
  }

  function setState(word, known) {
    wordState[word.text] = known;

    var index = knownWords.indexOf(word.text);
    if (index > -1) { knownWords.splice(index, 1) }

    index = unknownWords.indexOf(word.text);
    if (index > -1) { unknownWords.splice(index, 1) }


    if (known) {
      knownWords.push(word);
      knownWords = [...knownWords];
    } else {
      unknownWords.push(word);
      unknownWords = [...unknownWords];
    }       
  }

  function saveFilterAndReload(filter) {
    //$settingsData.defaultWordListFilter = filter;
    //DS.saveSettings($settingsData);
    allWordIds = $categoryDetailData.wordStorages[filter].getWordIds();

    allWords = [];
    virtualList.deleteAllItems();

    loadWords(0, itemsPerLoad);
    allWordsLength = 0;
  }
  
</script>
