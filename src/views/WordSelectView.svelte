<Page name="WordSelect">
  <!-- Navbar -->
  <Header>
    <div class="navbar-title title" slot="title">{$_('app_name')}</div>
  </Header>
  <div class="page-title">{$_('words_list.info_select')}</div>
    <List class="list-container virtual-list list-words"></List>

    {#if allWordsLength > 0 && allWordsLength < allWordIds.length && unknownWords.length < $settingsData.wordsLimit}
      <Button class="word-button button-next" on:click={loadNextWords}>
        {$_('words_list.next_button')}
      </Button>
    {/if}

    {#if allWordsLength === 0 && allWordIds.length > 0}
      {$_('words_list.loading')}
    {/if}

    <Toolbar position={'bottom'}>
      <Row>
        <Col>
          {#if defaultSelected}
            <Link on:click={() => setDefaultSelect(false)}>{$_('words_list.unselect_all')}</Link>
          {:else}
            <Link on:click={() => setDefaultSelect(true)}>{$_('words_list.select_all')}</Link>
          {/if}
        </Col>
        <Col>
          {allWordsLength}/{allWordIds.length}
        </Col>
        <Col>
          <Link on:click={saveWords}>{$_('words_list.save_button')}</Link>
        </Col>
      </Row>
    </Toolbar>
</Page>

<script>
  import { 
    f7, Page, 
    BlockTitle, Block, 
    Row, Col,
    List, ListItem, ListButton,
    Button, Link,
    Toolbar
  } from 'framework7-svelte';
  import { onMount } from 'svelte';
  import DS from '../js/storages/data.js';
  import Header from '../components/Header.svelte';
  import { playTextSound, WordsType, trainingModes } from '../js/utils.js'
  import { categoryGroupData, categoryDetailData, settingsData, statisticsData, modeStatisticsData } from '../js/store.js';

  import { get } from 'svelte/store';
  import { _ } from 'svelte-i18n';

  export let f7router;
  export let maxLimit = $settingsData.wordsLimit;
	
  let knownWords = [];
  let unknownWords = [];
  let progress = 0;
  let fullProgress = 0;
  let clickedWord = null;
  let allWordsLength = 0;

  let wordState = {};
  let allWords = [];
  var allWordIds = $categoryDetailData.wordStorages[WordsType.UNKNOWN].getWordIds();

  let virtualList = null; 
  let allowInfinite = true;
  let itemsStartLoad = 30;
  let itemsPerLoad = 10;
  let defaultSelected = false;


  onMount(() => { 
    virtualList = f7.virtualList.create({
      el: '.virtual-list',
      items: [],
      itemTemplate:
      `<li class="list-item word-item">
        <div class="list-item item-content">
          <div class="list-media play-sound">
            <div slot="media" class="item-media">
              <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" width="24" height="24" class="mode-icon icon-24-volume play-sound" stroke-width="2"><g transform="translate(0, 0)"><polygon stroke-linecap="square" stroke-miterlimit="10" points="14,22 6,16 1,16 1,8 6,8 14,2" stroke-linejoin="miter"></polygon><line stroke-linecap="square" stroke-miterlimit="10" x1="19" y1="12" x2="23" y2="12" stroke-linejoin="miter"></line><line stroke-linecap="square" stroke-miterlimit="10" x1="17.7" y1="7" x2="21.1" y2="5" stroke-linejoin="miter"></line><line stroke-linecap="square" stroke-miterlimit="10" x1="17.7" y1="17" x2="21.1" y2="19" stroke-linejoin="miter"></line></g></svg>    
            </div>
          </div>
          <div class="item-inner">
            <div class="item-title show-detail">{{word.text}}</div>
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

    virtualList.$el.on('click', '.show-detail', function (e) {
      f7router.navigate('/Search', { props: { query: clickedWord.text, saveAnywhere: true } })
    });

    loadWords(0, itemsStartLoad);
  });


  function loadNextWords() {
    if (!allowInfinite) return;

    allowInfinite = false;
    loadWords(allWords.length, allWords.length + itemsPerLoad);
  }

  function loadWords(from, to) {
    let wordIds = allWordIds.slice(from, to);
    for (let index in wordIds) {
      DS.getWord(wordIds[index]).then((word) => {
        wordState[word.text] = defaultSelected;
        virtualList.appendItem({"word": word, "checked": wordState[word.text] ? "checked" : ""});
        allWords.push(word);
        defaultSelected ? knownWords.push(word) : unknownWords.push(word);
        allWordsLength++;
      });
      if (Number(index)+1 === (to - from)) {
        allowInfinite = true;
      }
    };
  }

  function setDefaultSelect(value) {
    defaultSelected = value;
    reload();
  }

  function reload() {
    allWords = [];
    knownWords = [];
    unknownWords = [];

    virtualList.deleteAllItems();

    loadWords(0, itemsStartLoad);
    allWordsLength = 0;
  }

  function saveWords() {
    progress = 0;
    unknownWords = unknownWords.slice(0, maxLimit);
    fullProgress = knownWords.length + unknownWords.length;
    let dialog = f7.dialog.progress($_('words_list.progress'), 0);

    $categoryGroupData.updateWordList(knownWords, WordsType.ALREADY_KNOWN, () => progress += 1); 
    $categoryGroupData.updateWordList(unknownWords, WordsType.LEARNING, () => progress += 1); 

    updateProgress(dialog);
  }

  function updateProgress(dialog) {
    dialog.setProgress(100/fullProgress*progress);
    setTimeout(() => {
      if (progress >= fullProgress) {
        statisticsData.set($categoryDetailData.getStatistics());
        modeStatisticsData.set($categoryDetailData.getModeStatistics());
        dialog.close();
        knownWords = [];
        unknownWords = [];
        f7router.back(f7router.history[f7router.history.length-2], { force: true });
      } else {
        updateProgress(dialog);
      }
    }, 100);
  }

  function setState(word, known) {
    wordState[word.text] = known;

    let index = knownWords.findIndex((w) => w.text === word.text);
    if (index > -1) { knownWords.splice(index, 1) }

    index = unknownWords.findIndex((w) => w.text === word.text);
    if (index > -1) { unknownWords.splice(index, 1) }


    if (known) {
      knownWords.push(word);
    } else {
      unknownWords.push(word);
    }       
    knownWords = [...knownWords];
    unknownWords = [...unknownWords];
  }
</script>
