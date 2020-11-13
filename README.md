
# LearnEnglishWords

## Installation:

1) install nodejs: https://nodejs.org/en/download/
2) install apache cordova and phonegap: npm install -g cordova phonegap@latest
3) install git

4) run: git clone https://github.com/LearnEnglishWords/Application.git
5) cd Application
6) run: npm install
7) run: echo 'export const isDevel = true;' > src/js/config.js

8) download and unpack java-jdk:  https://uloz.to/file/XkkyYjKl3HCI/java-jdk8-tgz
9) download and unpack Android SDK:  https://mega.nz/#!kfg0zI4K!Po1Ng8a6p3nbfp7-Vk6z3nxwuQOj8pigqGzzzNDFtIs
10) should contain this folders:
        build-tools  emulator  fonts  licenses  patcher  platforms  platform-tools  skins  sources  system-images  tools

11) edit variables in script: `build-cordova-app` for right paths
12) run `build-cordova-app browser` script 
13) now you can run coogle chrome: http://localhost:3000 there should be running this application.
14) for run tests you need run: `npx cypress open`



