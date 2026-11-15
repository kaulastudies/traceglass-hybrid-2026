import { initializeApp } from 'firebase/app';
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check';
import { getAI, getGenerativeModel, GoogleAIBackend, InferenceMode } from 'firebase/ai';
import { assertMode, normalizeSource } from './core.js';

export const CLOUD_MODEL = 'gemini-3.5-flash-lite';
let ai;
export function configured() {
  return ['VITE_FIREBASE_API_KEY','VITE_FIREBASE_PROJECT_ID','VITE_FIREBASE_APP_ID','VITE_RECAPTCHA_SITE_KEY'].every(k=>Boolean(import.meta.env[k]));
}
export function createRunner(mode, consent, progress=()=>{}) {
  assertMode(mode, consent);
  if(!configured()) throw new Error('Live inference needs a new, dedicated Firebase project. See Setup; no existing project is used.');
  if(!ai) {
    const app=initializeApp({apiKey:import.meta.env.VITE_FIREBASE_API_KEY,projectId:import.meta.env.VITE_FIREBASE_PROJECT_ID,appId:import.meta.env.VITE_FIREBASE_APP_ID},'traceglass-hybrid');
    if(import.meta.env.DEV && ['localhost','127.0.0.1'].includes(location.hostname) && import.meta.env.VITE_APPCHECK_DEBUG==='true') self.FIREBASE_APPCHECK_DEBUG_TOKEN=true;
    initializeAppCheck(app,{provider:new ReCaptchaEnterpriseProvider(import.meta.env.VITE_RECAPTCHA_SITE_KEY),isTokenAutoRefreshEnabled:true});
    ai=getAI(app,{backend:new GoogleAIBackend()});
  }
  const model=getGenerativeModel(ai,{mode:InferenceMode[mode],inCloudParams:{model:CLOUD_MODEL,generationConfig:{temperature:0,maxOutputTokens:256}}});
  // This function is called directly by the Run button, preserving user activation.
  const initialization=mode==='ONLY_IN_CLOUD'?Promise.resolve():model.initializeDeviceModel(progress);
  const ready=initialization.catch(error=>{if(mode==='ONLY_ON_DEVICE') throw error; return null;});
  return {
    async run(prompt) {
      await ready;
      const result=await model.generateContent(prompt);
      const source=normalizeSource(result.response.inferenceSource);
      if(mode==='ONLY_ON_DEVICE' && source==='IN_CLOUD') throw new Error('Source contract violated: cloud response in device-only mode.');
      return {text:result.response.text(),source,usage:result.response.usageMetadata??null};
    }
  };
}
