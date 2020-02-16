<Page name="Training">
  <Navbar title="LearnEnglishWords">
  <Subnavbar> 
    Training Words
  </Subnavbar> 
  </Navbar>              
  <Toolbar position='bottom'>
    <Link on:click={prevWord}>Previous word</Link>
    <Link on:click={nextWord}>Next word</Link>
  </Toolbar>

  <Swiper init navigation params={{speed: 0, allowTouchMove: true, loop: true, followFinger: false}}>
    {#each $trainingData.words as word, id}
      <SwiperSlide>
        <Block>
          <WordDetailSlide {word}/>
        </Block>
      </SwiperSlide>
    {/each}
  </Swiper>


  <BlockTitle >Uz umis dane slovicko?</BlockTitle>
  <Row>
    <Col width="25">
    </Col>
    <Col width="25">
      <Button large fill color="red" on:click={prevWord}>Ne</Button>
    </Col>
    <Col width="25">
      <Button large fill color="green" on:click={nextWord}>Ano</Button>
    </Col>
    <Col width="25">
    </Col>
  </Row>

</Page>

<script>
  import { 
    f7, Page, PageContent, 
    Block, BlockTitle, BlockHeader, 
    Navbar, Subnavbar,
    Swiper, SwiperSlide,
    List, ListItem, AccordionContent,
    Row, Col, Button, Link,
    Sheet, Toolbar
  } from 'framework7-svelte';
  import { trainingData } from '../js/store.js';
  import WordDetailSlide from '../components/WordDetailSlide.svelte';
  import { _ } from 'svelte-i18n';


  function nextWord() {
    let swiper = f7.swiper.get('.swiper-container')
    swiper.slideNext();
  }
  function prevWord() {
    let swiper = f7.swiper.get('.swiper-container')
    swiper.slidePrev();
  }
</script>

<style>
</style>

