<Page name="Training">
  <Header>
    <div slot="subnavbar">
      <Subnavbar> 
        {#if isTraining}
          {$_('training.subtitle.trenink')}
        {:else}
          {$_('training.subtitle.testing')}
        {/if}
      </Subnavbar> 
    </div>
  </Header>
  {currentWordIndex+1}/{$trainingData.words.length}

  <Swiper init navigation={isTraining} params={{speed: $settingsData.swiperTransitionSpeed, allowTouchMove: false, loop: false, followFinger: false}}>
    {#each $trainingData.words as word, id}
      <SwiperSlide style="height: {swiperHeight}">
        <WordSlide {word} on:nextWord={nextWord} on:updateWord={(e) => updateWord(e.detail)} mode="{$trainingData.mode}"/>
      </SwiperSlide>
    {/each}
  </Swiper>


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
      <Toolbar position={'bottom'}>
        <Link on:click={() => goToSlide(0)}>{$_('training.toolbar.start')}</Link>
        <Link on:click={() => goToSlide($trainingData.words.length)}>{$_('training.toolbar.end')}</Link>
      </Toolbar>
        
      <WordDescriptionPopup word={$trainingData.words[currentWordIndex]} />
    {/if}
  {/if}

  <RecapitulationPopup info={recapitulationInfo} open={showRecapitulation} />
</Page>

<script>
  import { 
    f7, Page, PageContent, 
    Block, BlockTitle, BlockHeader, 
    Navbar, Subnavbar,
    Swiper, SwiperSlide, 
    List, ListItem, AccordionContent,
    Row, Col, Button, Link,
    Sheet, Toolbar, Popup
  } from 'framework7-svelte';
  import { 
    collectionData, trainingData, settingsData,
    categoryGroupData, categoryDetailData,
    statisticsData, trainingModeStatisticsData 
  } from '../js/store.js';
  import WordSlide from '../components/WordSlide.svelte';
  import Header from '../components/Header.svelte';
  import RecapitulationPopup from '../popups/RecapitulationPopup.svelte';
  import WordDescriptionPopup from '../popups/WordDescriptionPopup.svelte';
  import WordUpdater from '../js/entities/word-updater.js';
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
    swiper = f7.swiper.get('.swiper-container')
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

    // if is not same
    if (word.learning[$trainingData.mode] !== state) {  
      let prevLearningState = {...word.learning};
      word.learning[$trainingData.mode] = state;

      WordUpdater.update(word, prevLearningState);

      let currentCategory = $categoryGroupData;
      if (currentCategory === null) { currentCategory = $categoryDetailData }
      currentCategory.updateWords($trainingData.mode, [], [word.text]);

      WordUpdater.updateOtherCategories(word, prevLearningState, $trainingData.mode);
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
  .arrow {
    font-size: 100px;
  }
</style>
