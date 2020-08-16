{#if mode === "read"}
  <ReadDetail {word} {mode} {learnType} {showPronunciation} {enableWallButton} on:nextWord on:updateWord />
{:else} 
  <WriteDetail {word} {mode} {learnType} on:nextWord on:updateWord />
{/if}
    
<script>
  import ReadDetail from './ReadDetail.svelte';
  import WriteDetail from './WriteDetail.svelte';

  export let word;
  export let mode;
  export let learnType;
  export let showPronunciation;
  export let enableWallButton;
</script>
