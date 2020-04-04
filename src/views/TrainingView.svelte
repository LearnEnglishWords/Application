<Page name="Training">
  <Header>
    <div slot="subnavbar">
      <Subnavbar> 
        {$_('training.subtitle')}
      </Subnavbar> 
    </div>
  </Header>
  {currentWordIndex+1}/{$trainingData.words.length}

  <Swiper init navigation={isTraining} params={{speed: 0, allowTouchMove: true, loop: false, followFinger: false}}>
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
  import { trainingData, statisticsData, settingsData, collectionData, categoryDetailData, trainingModeStatisticsData } from '../js/store.js';
  import WordSlide from '../components/WordSlide.svelte';
  import Header from '../components/Header.svelte';
  import RecapitulationPopup from '../popups/RecapitulationPopup.svelte';
  import Collection from '../js/collection.js';
  import { isKnownForMode, getState, playSound } from '../js/utils.js'
  import { _ } from 'svelte-i18n';
  import { onMount } from 'svelte';

  export let f7router;

  let collection = new Collection();
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

  onMount(() => {
    f7.preloader.hide();
    swiper = f7.swiper.get('.swiper-container')
    swiper.on("slideNextTransitionStart", () => { 
      currentWordIndex += 1;
      playAutoSound($trainingData.words[currentWordIndex])
    })
    swiper.on("slidePrevTransitionStart", () => { 
      currentWordIndex -= 1 
      playAutoSound($trainingData.words[currentWordIndex])
    })
    playAutoSound($trainingData.words[currentWordIndex])
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

    if (word.learning[$trainingData.mode] !== state) {
      word.learning[$trainingData.mode] = state;
      collection.saveWord(word.text, word);
      statisticsData.updateData(word, previousState);
      trainingModeStatisticsData.updateData(word, [{mode: $trainingData.mode, prevState: isKnown}]);
    }
    collection.saveCategoryStatistics($collectionData.id, $categoryDetailData.id, $statisticsData);
  }

  function goToSlide(index) {
    if (!isTraining) { f7.sheet.open(".wall", false); }
    currentWordIndex = index-2;
    if(currentWordIndex < 0) { currentWordIndex = 1; }  
    swiper.slideTo(index);
  }

  function playAutoSound(word) {
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
      playAutoSound($trainingData.words[currentWordIndex])
    }
  }
</script>

<style>
  .arrow {
    font-size: 100px;
  }
</style>
