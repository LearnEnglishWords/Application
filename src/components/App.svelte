<!-- App.svelte -->
<App params={f7params}>
    <!-- Current View/Router, initial page will be loaded from home.svelte component -->
    <View main url="/" />
</App>
<script>
	// Import pages components
  import { onMount } from 'svelte';
  import cordovaApp from '../js/cordova-app';
  import Collection from '../js/collection.js';
  import CollectionListView from '../views/CollectionListView.svelte';
  import CategoryListView from '../views/CategoryListView.svelte';
  import CategoryDetailView from '../views/CategoryDetailView.svelte';
  import TrainingView from '../views/TrainingView.svelte';
  import { downloadedCollections } from '../js/store.js';
  import { f7, f7ready, App, Views, View } from 'framework7-svelte';
  import { Device }  from 'framework7/framework7-lite.esm.bundle.js';
  import localforage from "localforage";
  import cordovaSQLiteDriver from "localforage-cordovasqlitedriver";

  import { waitLocale, addMessages, init, getLocaleFromNavigator } from 'svelte-i18n';
  import en from '../localization/en.json';


  // internationalization init:
  export async function preload() {
    addMessages('en', en);
    init({
      fallbackLocale: 'en',
      initialLocale: getLocaleFromNavigator(),
    })
    return waitLocale()
  }
  preload();

  onMount(() => {
    f7ready(() => {
      // cordova app init:
      cordovaApp.init(f7);

      // localforage init:
      localforage.defineDriver(cordovaSQLiteDriver).then(function() {
        window.appStorage = localforage.createInstance({
          version: 1.0,
          size: 8*1024*1024*50,
          name: 'lew',
          storeName: 'words',
          driver: [
            cordovaSQLiteDriver._driver, // <-- prefer cordovaSQLiteDriver
            localforage.INDEXEDDB,
            localforage.WEBSQL,
            localforage.LOCALSTORAGE
          ]
        });

        // LearnEnglishWords basic setup
        let collection = new Collection();
        collection.getAppInfo("downloadedCollections", (data) => { 
          if (data === null) {
            downloadedCollections.set([ "personal" ]);
            collection.saveAppInfo("downloadedCollections", $downloadedCollections);
          } else {
            downloadedCollections.set(data);
          }
        });
      })
    });
  })

  // framework7 init:
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
      overlay: true,
      iosOverlaysWebView: true,
      androidOverlaysWebView: false,
      iosTextColor: "white",
      androidTextColor: "white",
      androidBackgroundColor: "#0F51AB",
      iosBackgroundColor: "#0F51AB",
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
      },
      {
        path: '/CategoryDetail',
        component: CategoryDetailView
      },
      {
        path: '/Training',
        component: TrainingView
      }
    ]
  };
</script>
