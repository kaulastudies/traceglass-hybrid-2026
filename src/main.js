import './style.css';
import {CASES,DATASET_VERSION} from './cases.js';
import {makePrompt,grade,summarize,evidenceExport,sha256,GRADER_VERSION} from './core.js';
import {configured,createRunner,CLOUD_MODEL} from './firebase-adapter.js';

const root=document.querySelector('#app');
root.innerHTML=`<header><a class="brand" href="#">◈ TraceGlass</a><span class="badge">HYBRID EVALUATION / 01</span><a href="#setup">Setup guide ↗</a></header>
<main><section class="hero"><div><p class="eyebrow">EVIDENCE BEFORE CONFIDENCE</p><h1>Same task.<br>Two places to think.</h1><p class="intro">Find out what changes when AI runs on your device or in the cloud. Inspect the answer, its evidence, and the source that actually ran.</p></div><aside><span class="orbit">◈</span><p>8 original controls</p><small>No private tickets. No production integrations.</small></aside></section>
<section class="metrics" aria-label="Run summary"><div><span id="attempts">0</span>Live attempts</div><div><span id="judged">0</span>Scored outputs</div><div><span id="passed">—</span>Pass rate</div><div><span id="errors">0</span>Infrastructure errors</div></section>
<section class="workspace"><div class="panel controls"><p class="eyebrow">01 / CHOOSE YOUR RUN</p><h2>Keep the comparison honest.</h2><label for="mode">Inference mode</label><select id="mode"><option value="ONLY_ON_DEVICE">On device only · no cloud inference</option><option value="PREFER_ON_DEVICE">Prefer device · allow cloud fallback</option><option value="ONLY_IN_CLOUD">Cloud only · comparison run</option></select><label class="check"><input id="consent" type="checkbox">Allow these displayed synthetic records to be sent to Firebase / Google for this batch.</label><p class="note">On-device mode is the default. Firebase initialization and App Check may contact Google; “on device” describes inference, not an entirely network-free app.</p><div class="buttons"><button id="run">Run 8 controls ↗</button><button id="stop" class="secondary" disabled>Stop after current</button></div><p id="status" role="status" aria-live="polite"></p><button id="control" class="textbutton">Check the scorer without calling AI</button><p id="control-result" role="status"></p><hr><p class="note">A reference-control check is not a model run. Live attempts are kept in memory until you export or close this page.</p></div><div class="panel"><p class="eyebrow">02 / INSPECT THE EVIDENCE</p><h2>Small cases. Specific failure modes.</h2><div id="cases"></div></div></section>
<section class="panel results"><div class="section-heading"><div><p class="eyebrow">03 / RESULTS</p><h2>Every attempt stays visible.</h2></div><button id="export" class="secondary" disabled>Export evidence JSON ↓</button></div><div class="table-wrap"><table><thead><tr><th>Case / attempt</th><th>Actual source</th><th>Result</th><th>Time</th><th>Inspect</th></tr></thead><tbody id="results"></tbody></table></div><p id="empty">No model has run. Configure the dedicated project, choose a mode, then start a batch.</p><p class="note">Pass rate includes valid failures and invalid outputs. Infrastructure errors are reported separately. These eight controls do not establish general model superiority.</p></section>
<section class="panel" id="setup"><p class="eyebrow">04 / SETUP & BOUNDARIES</p><h2>A project of its own.</h2><ol><li>Create a new Firebase project dedicated to TraceGlass. Enable AI Logic and App Check there.</li><li>Copy <code>.env.example</code> to <code>.env.local</code> and enter only that new project's web configuration and reCAPTCHA site key.</li><li>For localhost, enable the debug setting and safelist its generated App Check token in the new project. Never publish a debug token.</li><li>Use the official Firebase hybrid web setup for Chrome's on-device model. Restart only when you choose; this app never changes browser settings.</li><li>Run the same controls on device and in cloud. Export actual results and inspect disagreements.</li></ol><p>Live inference status: <strong id="config"></strong></p><p class="note">No repository, deployment, domain, account setting, or credential from another project is used. Live model verification and the hackathon demo video are still required before submission.</p><a href="https://firebase.google.com/docs/ai-logic/hybrid/web/get-started" target="_blank" rel="noopener noreferrer">Official Firebase setup ↗</a></section>
</main><footer>TraceGlass · An independent AI evaluation prototype · Original synthetic data · No winner or sponsor endorsement claimed</footer>`;

const $=id=>document.getElementById(id);
const runs=[];
let running=false,stop=false;
for(const task of CASES){
  const details=document.createElement('details');
  const summary=document.createElement('summary');summary.textContent=`${task.id}  /  ${task.name}`;details.append(summary);
  for(const record of task.records){const p=document.createElement('p');p.textContent=`${record.id}: ${record.text}`;details.append(p);}
  $('cases').append(details);
}
$('config').textContent=configured()?'Configured; live runs not yet verified.':'Not configured. Reference controls work without credentials.';
$('status').textContent='Ready. No model calls have been made.';
function refresh(){
  const s=summarize(runs);$('attempts').textContent=s.attempts;$('judged').textContent=s.judged;$('passed').textContent=s.passRate===null?'—':`${Math.round(s.passRate*100)}%`;$('errors').textContent=s.counts.INFRA_ERROR;
  $('export').disabled=!runs.length;$('empty').hidden=Boolean(runs.length);
}
function addRow(run){
  const tr=document.createElement('tr');
  for(const text of [`${run.caseId} / ${run.attemptId.slice(0,8)}`,run.actualSource,run.verdict,`${Math.round(run.durationMs)} ms`]){const td=document.createElement('td');td.textContent=text;tr.append(td);}
  tr.children[2].className=run.verdict==='PASS'?'pass':'warn';
  const td=document.createElement('td'),details=document.createElement('details'),summary=document.createElement('summary'),pre=document.createElement('pre');summary.textContent='Output & evidence';pre.textContent=JSON.stringify(run,null,2);details.append(summary,pre);td.append(details);tr.append(td);$('results').append(tr);refresh();
}
$('stop').onclick=()=>{stop=true;$('status').textContent='Stop requested. Waiting for the current request; no further cases will start.';};
$('run').onclick=async()=>{
  if(running)return;
  const mode=$('mode').value,consent=$('consent').checked;
  let runner;
  try{runner=createRunner(mode,consent,p=>{$('status').textContent=`Preparing device model: ${Math.round(p*100)}%`;});}
  catch(error){$('status').textContent=error.message;return;}
  running=true;stop=false;for(const id of ['run','mode','consent'])$(id).disabled=true;$('stop').disabled=false;
  const batchId=crypto.randomUUID();
  try{
    const datasetDigest=await sha256(JSON.stringify(CASES));
    for(const task of CASES){
      if(stop)break;
      $('status').textContent=`Running ${task.id}: ${task.name}`;
      const prompt=makePrompt(task), started=performance.now();
      const run={batchId,attemptId:crypto.randomUUID(),caseId:task.id,datasetVersion:DATASET_VERSION,datasetDigest,graderVersion:GRADER_VERSION,promptDigest:await sha256(prompt),requestedMode:mode,cloudConsent:consent,cloudModelAlias:CLOUD_MODEL,actualSource:'UNKNOWN',createdAt:new Date().toISOString(),rawOutput:null,usage:null};
      try{const result=await runner.run(prompt);Object.assign(run,{actualSource:result.source,rawOutput:result.text,usage:result.usage},grade(result.text,task));}
      catch(error){Object.assign(run,{verdict:'INFRA_ERROR',reasons:[String(error.message??error)]});}
      run.durationMs=performance.now()-started;runs.push(run);addRow(run);
      // Stop on infrastructure failure rather than repeat a failing or billable call.
      if(run.verdict==='INFRA_ERROR'){stop=true;break;}
    }
    $('status').textContent=stop?'Batch stopped. Completed attempts are preserved.':'Batch complete. Export the evidence or compare another mode.';
  }catch(error){$('status').textContent=`Batch could not complete: ${error.message}`;}
  finally{running=false;for(const id of ['run','mode','consent'])$(id).disabled=false;$('stop').disabled=true;$('consent').checked=false;}
};
$('control').onclick=()=>{
  const good=CASES.filter(task=>grade(JSON.stringify(task.expected),task).verdict==='PASS').length;
  const bad=CASES.filter(task=>grade('{"status":"resolved","action":"none","evidence":[]}',task).verdict!=='PASS').length;
  $('control-result').textContent=`Scorer controls: ${good}/8 reference answers accepted; ${bad}/8 unsupported answers rejected. No AI model was called.`;
};
$('export').onclick=async()=>{
  const bundle=evidenceExport(runs,{exportedAt:new Date().toISOString(),datasetVersion:DATASET_VERSION,graderVersion:GRADER_VERSION,datasetDigest:await sha256(JSON.stringify(CASES))});
  const blob=new Blob([JSON.stringify(bundle,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`traceglass-evidence-${Date.now()}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
};
