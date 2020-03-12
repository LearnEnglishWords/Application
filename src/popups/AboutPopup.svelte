<Popup class={name} animate={true} >
  <Header type="popup" popupName={name} title={$_('about.title')}/>
  <Block inset>
    <p>
      {appName} {$_('about.text1')}
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
    <a href='mailto:{feedbackEmail}'>{feedbackEmail}</a>
    </p>
    <p>
    <a href=#>{$_('about.share')}</a>
    </p>

    <center>
      {$_('about.version')} {version} <br/>
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
  import { feedbackEmail, version, appName }  from '../js/config.js';
  import { _ } from 'svelte-i18n';
  
  export let name;
</script>
