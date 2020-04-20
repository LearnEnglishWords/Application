<Page name="Training">
  <!-- Navbar -->
  <Header>
    <div slot="title" class="title">
      <span>
        {#if isTraining}
          {$_('training.subtitle.trenink')}
        {:else}
          {$_('training.subtitle.testing')}
        {/if}
      </span>
    </div>
  </Header>
  <!-- Header -->
  <div class="header statistics empty">
  
  </div>
  <!-- View -->
  <div class="view Training">

    <div class="swiper-container swiper-init">
      <div class="swiper-wrapper">
        {#each $trainingData.words as word, id}
          <div class="swiper-slide">
            <WordSlide {word} on:nextWord={nextWord} on:updateWord={(e) => updateWord(e.detail)} mode="{$trainingData.mode}"/>
          <div class="length">{currentWordIndex+1}/{$trainingData.words.length}</div>
        </div>
        {/each}
      </div>
      <div class="swiper-button-prev" on:click={swiper.slidePrev}><SVGIcon name="nav-left" size="24"/></div>
      <div class="swiper-button-next" on:click={swiper.slideNext}><SVGIcon name="nav-right" size="24"/></div>
    </div>

    {#if !isTraining && $trainingData.mode === "read"}
      <BlockTitle><center>{$_('training.question.text')}</center></BlockTitle>
      <Row>
        <Col width="25">
        </Col>
        <Col width="25">
          <Button large fill color="red" on:click={noButton}>{$_('training.question.no')}</Button>
        </Col>
        <Col width="25">
          <Button large fill color="green" on:click={yesButton}>{$_('training.question.yes')}</Button>
        </Col>
        <Col width="25">
        </Col>
      </Row> 
    {/if}

    {#if $trainingData.mode === "read"}
      <Sheet class="wall" backdrop={false} swipeToClose opened={wallEnable} onSheetClosed={() => wallEnable = false}>
        <Row>
          <Col width="25">
          </Col>
          <Col width="50">
            <center>
              <div class="arrow">&#8964;</div> <br>
              {$_('training.wall_text')}
            </center>
          </Col>
          <Col width="25">
          </Col>
        </Row>
      </Sheet>
      {#if isTraining}
        <Toolbar style="display:none;" position={'bottom'}>
          <Link on:click={() => goToSlide(0)}>{$_('training.toolbar.start')}</Link>
          <Link on:click={() => goToSlide($trainingData.words.length)}>{$_('training.toolbar.end')}</Link>
        </Toolbar>

        <WordDescriptionPopup word={$trainingData.words[currentWordIndex]} />
      {/if}
    {/if}

    <RecapitulationPopup info={recapitulationInfo} open={showRecapitulation} />

  </div>
  
  <div class="footer-training">
    {#if $trainingData.mode === "read"}
      {#if $trainingData.isTraining}
        <Button sheetOpen=".description">{$_('training.buttons.examples')}</Button>
      {/if}
    {/if}
  </div>
</Page>

<script>
  import { 
    f7, Page, PageContent, 
    Block, BlockTitle, BlockHeader, 
    Navbar, Subnavbar,
    List, ListItem, AccordionContent,
    Row, Col, Button, Link,
    Sheet, Toolbar, Popup
  } from 'framework7-svelte';
  import { 
    updateAllStatisticsAndSaveWord, trainingData,
    statisticsData, settingsData,
    collectionData, categoryDetailData,
    trainingModeStatisticsData 
  } from '../js/store.js';
  import Swiper from 'swiper';
  import WordSlide from '../components/WordSlide.svelte';
  import Header from '../components/Header.svelte';
  import SVGIcon from '../components/SVGIcon.svelte';
  import RecapitulationPopup from '../popups/RecapitulationPopup.svelte';
  import WordDescriptionPopup from '../popups/WordDescriptionPopup.svelte';
  import { isKnownForMode, getState, playSound, shuffle, WordsType } from '../js/utils.js'
  import { _ } from 'svelte-i18n';
  import { onMount } from 'svelte';

  export let f7router;

  let isTraining = $trainingData.isTraining;
  let wallEnable = !isTraining;
  let currentWordIndex = 0;
  let swiperHeight = "80vh";
  let swiper;     
  let showRecapitulation = false;
  let recapitulationInfo = {
    count: $trainingData.words.length,
    known: 0,
    unknown: 0
  };

  $trainingData.words = $trainingData.words.filter((word) => word.state !== 'IMPORT');

  if (!isTraining) {
    $trainingData.words = shuffle($trainingData.words);
  }
  
  onMount(() => {
    swiper = new Swiper ('.swiper-container', {
      // Optional parameters
      direction: 'horizontal',
      speed: $settingsData.swiperTransitionSpeed,
      loop: false,

      // Navigation arrows
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      }
    });

    swiper.on("slideNextTransitionStart", () => { 
      currentWordIndex += 1;
      playAutoSound()
    })
    swiper.on("slidePrevTransitionStart", () => { 
      currentWordIndex -= 1 
      playAutoSound()
    })
    playAutoSound()
  });

  if ($trainingData.mode === "read" && !$trainingData.isTraining) {
    swiperHeight = "52vh";
  }

  function noButton() {
    let currentWord = $trainingData.words[currentWordIndex];
    updateWord({word: currentWord, state: false});
    nextWord();
  }

  function yesButton() {
    let currentWord = $trainingData.words[currentWordIndex];
    updateWord({word: currentWord, state: true});
    nextWord();
  }

  function updateRecapitulation(state) {
    if (state) {
      recapitulationInfo.known += 1;
    } else {
      recapitulationInfo.unknown += 1;
    }
  }

  function updateWord({word, state}) {
    updateRecapitulation(state);

    if ($trainingData.isTraining) { return }
    if (word.learning === undefined) { 
      word.learning = {"read": false, "write": false, "listen": false};
    }

    let previousState = getState(word);
    let isKnown = isKnownForMode(word, $trainingData.mode);

    // if is not same
    if (word.learning[$trainingData.mode] !== state) {  
      word.learning[$trainingData.mode] = state;
      updateAllStatisticsAndSaveWord(word, previousState, [{mode: $trainingData.mode, prevState: isKnown}]);
      $categoryDetailData.wordStorages[$trainingData.mode].removeWord(word);
    }
  }

  function goToSlide(index) {
    if (!isTraining) { f7.sheet.open(".wall", false); }
    currentWordIndex = index-2;
    if(currentWordIndex < 0) { currentWordIndex = 1; }  
    swiper.slideTo(index);
  }

  function playAutoSound() {
    if($trainingData.mode !== "write" && $settingsData.enableAutoPlaySound) {
      playSound($trainingData.words[currentWordIndex])
    }
  }

  function nextWord() {
    if ($trainingData.words.length === currentWordIndex+1) {
      showRecapitulation = true;
      f7router.back();
    } else {
      f7.sheet.open(".wall", false);
      swiper.slideNext();
      playAutoSound();
    }
  }
</script>

<style>
  :root {
    --f7-sheet-height: 67vh;
    --f7-sheet-border-color: var(--f7-theme-color);
    --f7-sheet-transition-duration: 300ms;
    --f7-sheet-push-border-radius: 10px;
    --f7-sheet-push-offset: var(--f7-safe-area-top);
    --f7-sheet-bg-color: #1AA9D9;
  }
  .arrow {
    font-size: 100px;
  }
</style>
