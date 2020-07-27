import { isDevel } from './local-config.js'

export const appName = "LearnEnglishWords";
export const appId = "'com.learnenglishwords'";
export const version = "3.4.0";

export const isProduction = !isDevel;

export const feedbackEmail = "feedback@learn-english-words.eu";
export const infoEmail = "info@learn-english-words.eu";
export const errorEmail = "error@learn-english-words.eu";

export const backendUrl = 'https://learn-english-words.eu';
export const backendApiUrl = 'https://api.learn-english-words.eu';
export const numberFilteringWords = 30;
