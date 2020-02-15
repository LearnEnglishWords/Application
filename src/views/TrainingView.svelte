<Page name="Training">
  <Navbar title="LearnEnglishWords">
    <Subnavbar> 
      Training Words
    </Subnavbar> 
  </Navbar>              

  <Swiper navigation>
    {#each words as {text, description}, id}
      <Block>
        <center>
          <SwiperSlide>{text}</SwiperSlide>
        <center>
      </Block>
    {/each}
  </Swiper>

</Page>

<script>
  import { 
    Page, 
    Block, 
    BlockTitle, 
    Navbar,
    Subnavbar,
    Swiper, SwiperSlide
    } from 'framework7-svelte';
  import { trainingData } from '../js/store.js';
  import { _ } from 'svelte-i18n';

  export const words = [
    {text: "test1", description: ""},
    {text: "test2", description: ""},
    {text: "test3", description: ""}
  ]

</script>

<style>
</style>

