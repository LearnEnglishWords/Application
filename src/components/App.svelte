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
  import CategoryEditView from '../views/CategoryEditView.svelte';
  import TrainingView from '../views/TrainingView.svelte';
  import SettingsView from '../views/SettingsView.svelte';
  import SearchView from '../views/SearchView.svelte';
  import WordListView from '../views/WordListView.svelte';
  import WordSelectView from '../views/WordSelectView.svelte';
  import { downloadedCollections } from '../js/store.js';
  import { f7, f7ready, App, Views, View } from 'framework7-svelte';
  import { Device }  from 'framework7/framework7-lite.esm.bundle.js';
  import localforage from "localforage";
  import cordovaSQLiteDriver from "localforage-cordovasqlitedriver";

  import { waitLocale, addMessages, init, getLocaleFromNavigator } from 'svelte-i18n';
  import en from '../localization/en.json';
  import cs from '../localization/cs.json';
  import { defaultSettingsData, AppInfo, Collections, setActivity, trainingModes, WordsType } from '../js/utils.js';
  import { appName, appId, backendApiUrl } from '../js/config.js';
  import { lastCollectionId, settingsData, deviceUUID, allKnownWordsData, allNotKnownWordsData } from '../js/store.js';
  import CollectionStorage from '../js/storages/collections.js';

  import { _ } from 'svelte-i18n';
  import { get } from 'svelte/store';

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
            if (data.advancedUser !== undefined) {
              data.fastSelectingWords = data.advancedUser;
              data.advancedUser = undefined;
              DS.saveSettings(data);
            }
            if (data.backendApiUrl === undefined) {
              data.backendApiUrl = backendApiUrl;
              DS.saveSettings(data);
            }
            settingsData.set(data);
          }
        });
        DS.getAppInfo(AppInfo.LAST_ACTIVITY).then((data) => { 
          if (data === null) {
            DS.saveAppInfo(AppInfo.LAST_ACTIVITY, new Date().getDate()-1);
            setActivity($deviceUUID);
          } 
        });
        DS.getAppInfo(AppInfo.LAST_COLLECTION).then((collectionId) => {
          lastCollectionId.set(collectionId);
        });
        DS.getAppInfo(AppInfo.DOWNLOADED_COLLECTIONS).then((data) => { 
          var collectionStorage = new CollectionStorage();
          if (data === null) {
            downloadedCollections.set([ Collections.PERSONAL.id ]);
            DS.saveAppInfo(AppInfo.DOWNLOADED_COLLECTIONS, $downloadedCollections);
            collectionStorage.createPersonalCollection();
          } else {
            if (data.findIndex((colId) => colId === Collections.PERSONAL.id) === -1) {
              collectionStorage.createPersonalCollection();
              data.push(Collections.PERSONAL.id);
              DS.saveAppInfo(AppInfo.DOWNLOADED_COLLECTIONS, data);
            } 
            downloadedCollections.set(data);
          }
        });
      });
    });
  })

  // framework7 init:
  const f7params = {
    id: appId,
    name: appName,
    theme: 'md', 
    input: {
      scrollIntoViewOnFocus: Device.cordova && !Device.electron,
      scrollIntoViewCentered: Device.cordova && !Device.electron,
    },
    // Cordova Statusbar settings
    statusbar: {
      overlay: true,
      iosOverlaysWebView: false,
      androidOverlaysWebView: false,
      iosTextColor: "white",
      androidTextColor: "white",
      androidBackgroundColor: "#000000",
      iosBackgroundColor: "#000000",
    },
    dialog: {
      title: get(_)('app_name'),
      buttonOk: get(_)('dialog.yes'),
      buttonCancel: get(_)('dialog.no'),
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
        path: '/CategoryEdit',
        component: CategoryEditView
      },
      {
        path: '/Training',
        component: TrainingView
      },
      {
        path: '/Search',
        component: SearchView
      },
      {
        path: '/Settings',
        component: SettingsView
      },
      {
        path: '/WordList',
        component: WordListView
      },
      {
        path: '/WordSelect',
        component: WordSelectView
      }
    ]
  };
</script>
