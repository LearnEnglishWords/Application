<Page name="Training">
  <!-- Navbar -->
  <Header {f7router} showMenu={false} title={getTitle()} />

  <!-- View -->
  {#if !showRecapitulation}
    <div class="view">
      <div class="swiper-container swiper-init">
        <div class="swiper-wrapper">
          {#each $trainingData.words as word, id}
            <div class="swiper-slide">
              <WordSlide {word} 
                 showPronunciation={$trainingData.isTraining} 
                 enableWallButton={$trainingData.isTraining || $trainingData.isFiltering} 
                 on:nextWord={nextWord}
                 on:updateWord={(e) => updateWord(e.detail)} 
                 mode={$trainingData.type === LearningMode.REPETITION ? randomModes[word.text] : $trainingData.mode}
                 learnType={$trainingData.type} 
               />
            </div>
          {/each}
        </div>
        {#if $trainingData.isTraining && $trainingData.mode === 'read'}
          <div class="swiper-button-prev" on:click={swiper.slidePrev}><SVGIcon name="ctrl-left" size="24"/></div>
          <div class="swiper-button-next" on:click={swiper.slideNext}><SVGIcon name="ctrl-right" size="24"/></div>
        {/if}
      </div>  

      {#if $trainingData.mode === "read"}
        <Sheet class="wall" bind:this={wallSheet} backdrop={false} swipeToClose opened={$trainingData.isTraining || $trainingData.isFiltering ? $settingsData.enableTrainingModeWall : $trainingData.wallOpened }>
          <div class="wrapper-mode" on:click={() => { $trainingData.wallOpened = false; wallSheet.instance().close(true) }}>
            <div class="icon"><SVGIcon name="drag-down" size="24"/></div>
            <span>{$_('training.wall_text')}</span>
          </div>
        </Sheet>
        {#if $trainingData.isTraining}
          <Toolbar style="display:none;" position={'bottom'}>
            <Link on:click={() => goToSlide(0)}>{$_('training.toolbar.start')}</Link>
            <Link on:click={() => goToSlide($trainingData.words.length)}>{$_('training.toolbar.end')}</Link>
          </Toolbar>
          <WordDescriptionPopup word={$trainingData.words[$trainingData.currentWordIndex]} popupName="description" />
        {/if}
      {/if}
    </div>
  {:else}
    <Recapitulation info={recapitulationInfo} {f7router} />
  {/if}
  <!-- Footer -->

  {#if $trainingData.isTraining}
    {#if $trainingData.words.length === $trainingData.currentWordIndex + 1}
      <div class="footer-container footer-double arrows">
        <div class="footer-content arrows">
        {#if $trainingData.mode === "read"}
          {#if $trainingData.isTraining}
            <Button class="page-button button-examples" sheetOpen=".description">{$_('training.buttons.examples')}</Button>
            <Button class="page-button button-examples" on:click={() => f7router.back()}>{$_('training.buttons.exit')}</Button>
          {/if}
        {/if}
        </div>
      </div>
    {:else if $trainingData.words.length > $trainingData.currentWordIndex}
      <div class="footer-container footer-singular arrows">
        <div class="footer-content arrows">
        {#if $trainingData.mode === "read"}
          {#if $trainingData.isTraining}
            <Button class="page-button button-examples" sheetOpen=".description">{$_('training.buttons.examples')}</Button>
          {/if}
        {/if}
        </div>
      </div>
    {/if}
  {/if}
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
    statisticsData, modeStatisticsData 
  } from '../js/store.js';
  import Swiper from 'swiper';
  import WordSlide from '../components/word/Slide.svelte';
  import Header from '../components/Header.svelte';
  import SVGIcon from '../components/SVGIcon.svelte';
  import Recapitulation from '../components/Recapitulation.svelte';
  import WordDescriptionPopup from '../popups/WordDescriptionPopup.svelte';
  import { isKnown, getState, playTextSound, shuffle, WordsType, LearningMode } from '../js/utils.js'
  import DS from '../js/storages/data.js';
  import { _ } from 'svelte-i18n';
  import { onMount } from 'svelte';

  export let f7router;

  let swiperHeight = "80vh";
  let swiper;     
  let showRecapitulation = false;
  let recapitulationInfo = {
    count: $trainingData.words.length,
    alreadyKnown: 0,
    known: 0,
    unknown: 0,
    trainingMode: $trainingData.mode,
    trainingType: $trainingData.type
  };
  let randomModes = {};
  let wallSheet;

  $trainingData.wallOpened = canOpenWall();
  $trainingData.words = $trainingData.words.filter((word) => word.state !== 'IMPORT');

  if ($trainingData.type === LearningMode.REPETITION) {
    for (let word of $trainingData.words) {
      randomModes[word.text] = getRandomMode(word);
    }
    $trainingData.wallOpened = canOpenWall();
  }

  if ($trainingData.shuffleWords) {
    $trainingData.words = shuffle($trainingData.words);
  }

  
  onMount(() => {
    swiper = new Swiper ('.swiper-container', {
      // Optional parameters
      direction: 'horizontal',
      speed: $settingsData.swiperTransitionSpeed,
      loop: false,
      allowTouchMove: $trainingData.isTraining,

      // Navigation arrows
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      }
    });

    swiper.on("slideNextTransitionStart", () => { 
      $trainingData.currentWordIndex += 1;
      playAutoSound();
      openWall();
    })
    swiper.on("slidePrevTransitionStart", () => { 
      $trainingData.currentWordIndex -= 1 
      playAutoSound();
      openWall();
    })
    playAutoSound();
  });

  if ($trainingData.mode === "read" && !$trainingData.isTraining) {
    swiperHeight = "52vh";
  }

  function getRandomMode(word) {
    let modes = Object.keys(word.repetition).filter((key) => !word.repetition[key]);
    let randomNumber = Math.floor(Math.random() * modes.length);
    return modes[randomNumber];
  }

  function canOpenWall() {
    if ($trainingData.type === LearningMode.REPETITION) {
      let currentWord = $trainingData.words[$trainingData.currentWordIndex];
      return randomModes[currentWord.text] === "read";
    } else if($trainingData.isFiltering || $trainingData.isTraining) {
      return $settingsData.enableTrainingModeWall
    } else {
      return $trainingData.type === LearningMode.EXAM;
    }
  }

  function openWall() {
    $trainingData.wallOpened = canOpenWall();
    if ($trainingData.wallOpened && $trainingData.mode === "read") {
      wallSheet.instance().open(false);
    }
  }

  function updateRecapitulation(state, known) {
    recapitulationInfo.alreadyKnown += state && known ? 1 : 0;
    recapitulationInfo.known += state ? 1 : 0;
    recapitulationInfo.unknown += !state ? 1 : 0;
  }

  function updateWord({word, state, mode}) {
    if (!$trainingData.isTraining) { 
      $categoryGroupData.updateWord(word, state, $trainingData.type, mode);
      $categoryDetailData.updateWord(word, state, $trainingData.type, mode); 
      statisticsData.set($categoryDetailData.getStatistics());
      modeStatisticsData.set($categoryDetailData.getModeStatistics());
    }

    updateRecapitulation(state, isKnown(word));
  }

  function goToSlide(index) {
    if (!$trainingData.isTraining) { f7.sheet.open(".wall", false); }
    $trainingData.currentWordIndex = index-2;
    if($trainingData.currentWordIndex < 0) { $trainingData.currentWordIndex = 1; }  
    swiper.slideTo(index);
  }

  function playAutoSound() {
    if($trainingData.mode !== "write" && $settingsData.enableAutoPlaySound && ![LearningMode.REPETITION].includes($trainingData.type)) {
      playTextSound($trainingData.words[$trainingData.currentWordIndex].text, $settingsData.pronunciation)
    }
  }

  function nextWord() {
    if ($trainingData.words.length === $trainingData.currentWordIndex + 1 || ($settingsData.wordsLimit <= $statisticsData.learning && $trainingData.type === LearningMode.FILTER)) {
      if ($trainingData.type === LearningMode.FILTER) {
        recapitulationInfo.count = $trainingData.currentWordIndex + 1;
      }
      if ($trainingData.isTraining && $trainingData.mode === 'read') {
        $trainingData.currentWordIndex++;
      }
      showRecapitulation = true;
    } else {
      swiper.slideNext();
    }
  }

  function getTitle() {
    let title = $_('recapitulation.' + $trainingData.type + '.title')
    if ($trainingData.type === LearningMode.FILTER || $trainingData.type === LearningMode.REPETITION) {
      return title
    } else if ($trainingData.mode === "write" && $settingsData.enableQuiz && $trainingData.isTraining) {
      return title + ": " + $_('category.training_mode.quiz')
    } else {
      return title + ": " + $_('category.training_mode.' + $trainingData.mode)
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
