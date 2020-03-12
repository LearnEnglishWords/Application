# LearnEnglishWords

## Navod na instalaci:

nainstalovat nodejs: https://nodejs.org/en/download/
nainstalovat phonegap: npm install -g phonegap@latest
nainstalovat git

git clone git@github.com:Applemann/LearnEnglishWordsV3.git
cd LearnEnglishWordsV3
pustit: npm install
otevri config (vim src/js/config.js) a zmen develMode na true

stahnout a rozbalit java-jdk:  https://uloz.to/file/XkkyYjKl3HCI/java-jdk8-tgz
stahnout a rozbalit Android SDK:  https://uloz.to/file/LhVesd4j8jMJ/android-tgz
mel by obsahovat tyto slozky:
    martin at probook-pc Programs >>> ls Android/
        build-tools  emulator  fonts  licenses  patcher  platforms  platform-tools  skins  sources  system-images  tools


upravit script: `scripts/build-cordova-app` tak aby smeroval na spravne cesty
spustit script pro build

jit do slozky cordova a spustit: `phonegap serve`
mel by se spustit developersky nastroj pro vyvoj ve vebovem prohlizeci.

