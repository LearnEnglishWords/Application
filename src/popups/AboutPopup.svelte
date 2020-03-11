<Popup class={name} animate={true} >
  <Header type="popup" popupName={name} title="O aplikaci"/>
  <Block inset>
    <p>
    LearnEnglishWords je aplikace slouzici k procvicovani a uceni anglickych slovicek.
    </p>
    <p>
    S touto aplikaci se budete ucit anglicka slovicka snadno, rychle a s radosti.
    </p>
    <p>
    Nikdy pred tim nebylo uceni anglickych slovicek tak jednoduche!!
    </p>
    <p>
    Muzete procvicovat cteni, psani anebo poslech, aby jste meli jistotu, ze dane slovicko uz
    opravdu umite po vsech strankach ;)
    </p>

    <p>
    Svou zpetnou vazbu nebo navrhy na vylepseni muzete posilat na emailovou adresu:
    <a href='mailto:feedback@learnenglishwords.com'>feedback@learnenglishwords.com</a>
    </p>
    <p>
    <a href=#>Sdilejte tuto aplikaci se svymi prateli</a>
    </p>

    <center>
      Verze: v3.0.0 <br/>
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
  
  export let name;
</script>
