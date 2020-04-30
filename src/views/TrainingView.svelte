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

  <!-- View -->
  {#if !showRecapitulation}
    <div class="view Training">

      <div class="swiper-container swiper-init">
        <div class="swiper-wrapper">
          {#each $trainingData.words as word, id}
            <div class="swiper-slide">
              <WordSlide {word} on:nextWord={nextWord} on:updateWord={(e) => updateWord(e.detail)} mode="{$trainingData.mode}"/>
          </div>
          {/each}
        </div>
        {#if $trainingData.isTraining}
          <div class="swiper-button-prev" on:click={swiper.slidePrev}><SVGIcon name="left-arrow" size="24"/></div>
          <div class="swiper-button-next" on:click={swiper.slideNext}><SVGIcon name="right-arrow" size="24"/></div>
        {/if}
      </div>

      {#if !isTraining && $trainingData.mode === "read"}
        <!--<BlockTitle><center>{$_('training.question.text')}</center></BlockTitle>-->
        <div class="footer-training two without">
            <div class="footer-buttons">
            <Button large fill color="red" on:click={noButton}>{$_('training.question.no')}</Button>
            <Button large fill color="green" on:click={yesButton}>{$_('training.question.yes')}</Button>
            </div>
        </div>
      {/if}

      {#if $trainingData.mode === "read"}
        <Sheet class="wall" backdrop={false} swipeToClose opened={wallEnable} onSheetClosed={() => wallEnable = false}>
          <div class="wrapper-mode">
            <div class="icon"><SVGIcon name="drag-down" size="24"/></div>
            <span>{$_('training.wall_text')}</span>
          </div>
        </Sheet>
        {#if isTraining}
          <Toolbar style="display:none;" position={'bottom'}>
            <Link on:click={() => goToSlide(0)}>{$_('training.toolbar.start')}</Link>
            <Link on:click={() => goToSlide($trainingData.words.length)}>{$_('training.toolbar.end')}</Link>
          </Toolbar>

          <WordDescriptionPopup word={$trainingData.words[$trainingData.currentWordIndex]} />
        {/if}
      {/if}
    </div>
  {:else}
    <Recapitulation info={recapitulationInfo} />
  {/if}
  
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
    collectionData, trainingData, settingsData,
    categoryGroupData, categoryDetailData,
    statisticsData, trainingModeStatisticsData 
  } from '../js/store.js';
  import Swiper from 'swiper';
  import WordSlide from '../components/WordSlide.svelte';
  import Header from '../components/Header.svelte';
  import SVGIcon from '../components/SVGIcon.svelte';
  import Recapitulation from '../components/Recapitulation.svelte';
  import WordDescriptionPopup from '../popups/WordDescriptionPopup.svelte';
  import WordUpdater from '../js/entities/word-updater.js';
  import { isKnownForMode, getState, playSound, shuffle, WordsType } from '../js/utils.js'
  import DS from '../js/storages/data.js';
  import { _ } from 'svelte-i18n';
  import { onMount } from 'svelte';

  export let f7router;

  let isTraining = $trainingData.isTraining;
  let wallEnable = !isTraining;
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
      allowTouchMove: isTraining,

      // Navigation arrows
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      }
    });

    swiper.on("slideNextTransitionStart", () => { 
      $trainingData.currentWordIndex += 1;
      playAutoSound()
    })
    swiper.on("slidePrevTransitionStart", () => { 
      $trainingData.currentWordIndex -= 1 
      playAutoSound()
    })
    playAutoSound()
  });

  if ($trainingData.mode === "read" && !$trainingData.isTraining) {
    swiperHeight = "52vh";
  }

  function noButton() {
    let currentWord = $trainingData.words[$trainingData.currentWordIndex];
    updateWord({word: currentWord, state: false});
    nextWord();
  }

  function yesButton() {
    let currentWord = $trainingData.words[$trainingData.currentWordIndex];
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

    // if is not same
    if (word.learning === undefined || word.learning[$trainingData.mode] !== state) {  

      DS.getWord(word.text).then((word) => {
        if (word.learning === undefined) { 
          word.learning = {"read": false, "write": false, "listen": false};
        }

        let prevLearningState = {...word.learning};
        word.learning[$trainingData.mode] = state;

        WordUpdater.update(word, prevLearningState);

        let currentCategory = $categoryGroupData;
        if (currentCategory === null) { currentCategory = $categoryDetailData }
        currentCategory.updateWords($trainingData.mode, [], [word.text]);

        WordUpdater.updateOtherCategories(word, prevLearningState, $trainingData.mode);
      });
    }
  }

  function goToSlide(index) {
    if (!isTraining) { f7.sheet.open(".wall", false); }
    $trainingData.currentWordIndex = index-2;
    if($trainingData.currentWordIndex < 0) { $trainingData.currentWordIndex = 1; }  
    swiper.slideTo(index);
  }

  function playAutoSound() {
    if($trainingData.mode !== "write" && $settingsData.enableAutoPlaySound) {
      playSound($trainingData.words[$trainingData.currentWordIndex])
    }
  }

  function nextWord() {
    if ($trainingData.words.length === $trainingData.currentWordIndex+1) {
      showRecapitulation = true;
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
