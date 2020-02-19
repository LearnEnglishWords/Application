<Page name="Training">
  <Navbar title="LearnEnglishWords">
  <Subnavbar> 
    Training Words
  </Subnavbar> 
  </Navbar>              

  <Swiper init navigation params={{speed: 0, allowTouchMove: true, loop: true, followFinger: false}}>
    {#each $trainingData.words as word, id}
      <SwiperSlide>
        <WordDetailSlide {word}/>
      </SwiperSlide>
    {/each}
  </Swiper>


  <BlockTitle><center>Uz umis dane slovicko?</center></BlockTitle>
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

