<slot></slot>
<div class="footer-container footer-singular">
  <div class="footer-content">
    <Button on:click class="page-button button-next">{$_('buttons.continue')}</Button>
  </div>
</div>

<script>
  import { Button } from 'framework7-svelte';
  import { _ } from 'svelte-i18n';
</script>
