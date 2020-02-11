<!-- App.svelte -->
<App params={f7params}>
    <!-- Current View/Router, initial page will be loaded from home.svelte component -->
      <View main url="/" />
</App>
<script>
	// Import pages components
  import { onMount } from 'svelte';
  import cordovaApp from '../js/cordova-app';
  import CollectionListView from '../views/CollectionListView.svelte';
  import CategoryListView from '../views/CategoryListView.svelte';
  import { f7, f7ready, App, Views, View } from 'framework7-svelte';
  import { Device }  from 'framework7/framework7-lite.esm.bundle.js';
  import localforage from "localforage";
  import cordovaSQLiteDriver from "localforage-cordovasqlitedriver";

  onMount(() => {
    f7ready(() => {
      // Init cordova APIs (see cordova-app.js)
      if (Device.cordova) {
        cordovaApp.init(f7);

        localforage.defineDriver(cordovaSQLiteDriver).then(function() {
            window.appStorage = localforage.createInstance({
                version: 1.0,
                size: 8*1024*1024*50,
                name: 'my-app-name',
                storeName: 'setup',
                driver: [
                    cordovaSQLiteDriver._driver, // <-- prefer cordovaSQLiteDriver
                    localforage.INDEXEDDB,
                    localforage.WEBSQL,
                    localforage.LOCALSTORAGE
                ]
            });

            return appStorage.setItem('message', 'It worked!');
        })
        .then(function() {
            return appStorage.getItem('message');
        })
        .then(function(message){
            alert(message);
        });
      }
      // Call F7 APIs here
    });
  })

  const f7params = {
    id: 'eu.learn.english.words',
    name: 'LearnEnglishWords',
    theme: 'auto', // Automatic theme detection
    input: {
      scrollIntoViewOnFocus: Device.cordova && !Device.electron,
      scrollIntoViewCentered: Device.cordova && !Device.electron,
    },
    // Cordova Statusbar settings
    statusbar: {
      androidOverlaysWebView: true,
    },
    routes: [
      {
        path: '/',
        component: CollectionListView
      },
      {
        path: '/CollectionList',
        component: CollectionListView
      },
      {
        path: '/CategoryList',
        component: CategoryListView
      }
    ]
  };
</script>
