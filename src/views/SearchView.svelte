<Page name="Search">
  <!-- Navbar -->
  <Header {f7router} searchOpened={true} />

  {#await search(query)}
    <span class="search-failed">{$_('search.in_progress')}</span>
  {:then word}
    <WordReadDetail {word} learnType={LearningMode.SEARCH} on:saveWord={saveWord} on:cancelEdit={reload}/>
  {:catch error}
    <span class="search-failed">{$_('search.not_found')}</span>
  {/await}
</Page>

<script>
  import { f7, Page, Button } from 'framework7-svelte';
  import Header  from '../components/Header.svelte';
  import Footer  from '../components/Footer.svelte';
  import SVGIcon  from '../components/SVGIcon.svelte';
  import WordReadDetail from '../components/word/ReadDetail.svelte';
  import DS from '../js/storages/data.js';
  import { categoryDetailData, settingsData } from '../js/store.js';
  import { playTextSound, LearningMode } from '../js/utils.js'
  import { _ } from 'svelte-i18n';
  
  export let f7router;
  export let query;
  export let saveAnywhere = false;

  async function searchOnline(query) {
    const res = await fetch(`${$settingsData.backendApiUrl}/word/find?text=${query.replace(' ', '-')}`);
    if (!res.ok) {
      alert($_('errors.server_is_not_available'));
      return null;
    }
    let result = await res.json();
    return result.payload === undefined ? null : result.payload
  }

  function playSound(w) {
    if ($settingsData.enableAutoPlaySound) {
      playTextSound(w.text, $settingsData.pronunciation);
    }
    return true
  }

  function search(query) {
    return new Promise((success, error) => {
      if (query === "") { error() }
      DS.getWord(query.toLowerCase()).then((w) => { 
        if (w === null) {
          searchOnline(query.toLowerCase()).then((w) => { w === null ? error() : playSound(w) && success(w) })
        } else {
          success(w);
          playSound(w);
        }
      });
    });
  }
  
  function saveWord(e) {
    let word = e.detail.word;
    DS.saveWord(word.text, word);

    if (f7router.previousRoute.url === "/CategoryEdit" && !saveAnywhere) {
      $categoryDetailData.addWord(word); 
      f7router.back(f7router.history[f7router.history.length-2], { force: true });
    } else {
      f7router.navigate('/CategoryList', { props: { saveWord: word } });
    }
  }
  
  function reload() {
    f7router.navigate('/Search', { props: { query: query, saveAnywhere: saveAnywhere }, ignoreCache: true, reloadCurrent: true });
  }
</script>
