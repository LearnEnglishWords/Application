<Popup class={name} animate={true}>
  <Header type="popup" popupName={name} title="Vyhledávání" />

  Zadejte anglické slovíčko, které si přejete vyhledat:
    <input bind:value={searchInput} type="text" autocomplete="off" placeholder="">
    <Button on:click={search}>
      Vyhledat
    </Button>


    {#if found === false}
      zadne takove slovicko nebylo nalezeno
    {:else if found}
      bylo nalezeno nasledujici slovicko:
      <WordReadDetail {word} />
    {/if}


    <Footer />
</Popup>

<script>
  import {
    Block, Popup, Button
  } from 'framework7-svelte';
  import Header  from '../components/Header.svelte';
  import Footer  from '../components/Footer.svelte';
  import SVGIcon  from '../components/SVGIcon.svelte';
  import WordReadDetail from '../components/word/ReadDetail.svelte';
  import DS from '../js/storages/data.js';
  import { _ } from 'svelte-i18n';
  
  export let name;

  let searchInput = "";
  let found = null;
  let word = null;

  function search() {
    if (searchInput === "") { return }
    if (searchInput === "hello") {
      DS.getWord(searchInput).then((w) => { 
        word = w;
        found = true;
      })
    } else {
      found = false;
    }
  }

</script>
