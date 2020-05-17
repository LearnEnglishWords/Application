<!-- App.svelte -->
<App params={f7params} themeDark={$settingsData.enableDarkMode}>

  <View main url="/"/>
</App>

<script>
  // Import pages components
  import { onMount } from 'svelte';
  import cordovaApp from '../js/cordova-app';
  import DS from '../js/storages/data.js';
  import CollectionListView from '../views/CollectionListView.svelte';
  import CategoryListView from '../views/CategoryListView.svelte';
  import CategoryDetailView from '../views/CategoryDetailView.svelte';
  import TrainingView from '../views/TrainingView.svelte';
  import SettingsView from '../views/SettingsView.svelte';
  import WordListView from '../views/WordListView.svelte';
  import { downloadedCollections } from '../js/store.js';
  import { f7, f7ready, App, Views, View } from 'framework7-svelte';
  import { Device }  from 'framework7/framework7-lite.esm.bundle.js';
  import localforage from "localforage";
  import cordovaSQLiteDriver from "localforage-cordovasqlitedriver";

  import { waitLocale, addMessages, init, getLocaleFromNavigator } from 'svelte-i18n';
  import en from '../localization/en.json';
  import cs from '../localization/cs.json';
  import { defaultSettingsData, AppInfo, setActivity, trainingModes } from '../js/utils.js';
  import { appName, appId} from '../js/config.js';
  import { settingsData, deviceUUID, allKnownWordsData } from '../js/store.js';


  // internationalization init:
  export async function preload() {
    addMessages('en', en);
    addMessages('cs', cs);
    init({
      fallbackLocale: 'cs',
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
          size: 8*1024*1024*100,
          name: 'lew',
          storeName: 'words',
          driver: [
            cordovaSQLiteDriver._driver, // <-- prefer cordovaSQLiteDriver
            localforage.INDEXEDDB,
            localforage.WEBSQL,
            localforage.LOCALSTORAGE
          ]
        });               
        deviceUUID.set(device.uuid);
                                    
        // App basic setup
        DS.getSettings().then((data) => { 
          if (data === null) {
            DS.saveSettings(defaultSettingsData);
            settingsData.set(defaultSettingsData);
          } else { 
            settingsData.set(data);
          }
        });
        DS.getAppInfo(AppInfo.LAST_ACTIVITY).then((data) => { 
          if (data === null) {
            DS.saveAppInfo(AppInfo.LAST_ACTIVITY, new Date().getDate()-1);
            setActivity($deviceUUID);
          } 
        });
        DS.getAppInfo(AppInfo.DOWNLOADED_COLLECTIONS).then((data) => { 
          if (data === null) {
            //downloadedCollections.set([ "personal" ]);
            downloadedCollections.set([]);
            DS.saveAppInfo(AppInfo.DOWNLOADED_COLLECTIONS, $downloadedCollections);
          } else {
            downloadedCollections.set(data);
          }
        });

        trainingModes.forEach((mode) => {
          DS.getAllKnownWords(mode.value).then((data) => { 
            if (data !== null) {
              $allKnownWordsData[mode.value] = data;
            }
          });
        });
      });
    });
  })

  // framework7 init:
  const f7params = {
    id: appId,
    name: appName,
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
      androidBackgroundColor: "#000000",
      iosBackgroundColor: "#000000",
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
      },
      {
        path: '/Settings',
        component: SettingsView
      },
      {
        path: '/WordList',
        component: WordListView
      }
    ]
  };
</script>
