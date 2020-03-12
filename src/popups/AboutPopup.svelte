<Popup class={name} animate={true} >
  <Header type="popup" popupName={name} title={$_('about.title')}/>
  <Block inset>
    <p>
      {$_('about.text1')}
    </p>
    <p>
      {$_('about.text2')}
    </p>
    <p>
      {$_('about.text3')}
    </p>
    <p>
      {$_('about.text4')}
    </p>

    <p>
      {$_('about.email_feedback')}
    <a href='mailto:feedback@learnenglishwords.com'>feedback@learnenglishwords.com</a>
    </p>
    <p>
    <a href=#>{$_('about.share')}</a>
    </p>

    <center>
      {$_('about.version')} v3.0.0 <br/>
      Copyright &copy; Learn English Words 2020
    </center>
  </Block>
</Popup>

<script>
  import {
    Navbar, NavRight, Link,
    Block, Popup, Icon
  } from 'framework7-svelte';
  import Header  from '../components/Header.svelte';
  import { _ } from 'svelte-i18n';
  
  export let name;
</script>
