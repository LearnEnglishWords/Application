
# LearnEnglishWords

## Navod na instalaci:

1) nainstalovat nodejs: https://nodejs.org/en/download/
2) nainstalovat cordovu a phonegap: npm install -g cordova phonegap@latest
3) nainstalovat git

4) git clone https://github.com/mjablecnik/LearnEnglishWordsV3.git
5) cd LearnEnglishWordsV3
6) pustit: npm install
7) otevri config (vim src/js/config.js) a zmen develMode na true

8) stahnout a rozbalit java-jdk:  https://uloz.to/file/XkkyYjKl3HCI/java-jdk8-tgz
9) stahnout a rozbalit Android SDK:  https://mega.nz/#!kfg0zI4K!Po1Ng8a6p3nbfp7-Vk6z3nxwuQOj8pigqGzzzNDFtIs
10) mel by obsahovat tyto slozky:
        build-tools  emulator  fonts  licenses  patcher  platforms  platform-tools  skins  sources  system-images  tools

11) upravit script: `build-cordova-app` tak, aby promenne smerovaly na spravne cesty
12) spustit `build-cordova-app browser` script 
13) nyni kdyz pujdes v browseru na stranku: http://localhost:3000 tak by se mela zobrazit dana aplikace.
14) pro spusteni testu je treba pustit `npx cypress open`



