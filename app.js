const projects = [
  {id:'parco',icon:'🌳',title:'Rigeneriamo il Parco GIADA',desc:'Verde, sedute, area bambini e piccoli interventi per rendere il parco più bello e vissuto.',raised:7350,target:12000,supporters:84,days:37,tone:'green'},
  {id:'festa',icon:'🎉',title:'Prima Festa di Quartiere',desc:'Un evento aperto a tutti con attività, musica, bambini e tavoli di comunità.',raised:1240,target:2000,supporters:46,days:18,tone:'terra'},
  {id:'sicurezza',icon:'💡',title:'Luce e sicurezza percepita',desc:'Mappatura dei punti critici, proposta al Comune e piccole azioni condivise sul territorio.',raised:2100,target:5000,supporters:31,days:52,tone:'beige'},
  {id:'ragazzi',icon:'🏀',title:'Spazio ragazzi',desc:'Attrezzature leggere e attività pomeridiane per adolescenti e famiglie.',raised:870,target:3500,supporters:22,days:64,tone:'green'}
];
const reports = [
  {title:'Lampione non funzionante',desc:'Tratto centrale di Via Caduti di Nassiriya · segnalato 2 giorni fa',status:'sent',label:'Inoltrata al Comune'},
  {title:'Ramo pericolante vicino al parco',desc:'Foto e posizione allegate · segnalato ieri',status:'open',label:'In verifica'},
  {title:'Rifiuti ingombranti',desc:'Area parcheggio · segnalato 5 giorni fa',status:'done',label:'Risolta'},
  {title:'Avvallamento del marciapiede',desc:'Accesso pedonale · segnalato 1 settimana fa',status:'open',label:'Aperta'}
];

const money = n => new Intl.NumberFormat('it-IT',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(n);
const pct = p => Math.min(100,Math.round(p.raised/p.target*100));
function renderProjects(){
  const dash=document.querySelector('#dashboardProjects');
  dash.innerHTML=projects.slice(0,3).map(p=>`<article class="project-row"><div class="project-icon">${p.icon}</div><div><h3>${p.title}</h3><small>${p.supporters} sostenitori · ${p.days} giorni</small><div class="progress"><i style="width:${pct(p)}%"></i></div></div><div class="project-money"><b>${money(p.raised)}</b><small>di ${money(p.target)}</small></div></article>`).join('');
  const grid=document.querySelector('#projectGrid');
  grid.innerHTML=projects.map(p=>`<article class="project-card"><div class="project-card-top ${p.tone}"><div class="project-big-icon">${p.icon}</div></div><div class="project-card-body"><span class="pill">${pct(p)}% finanziato</span><h3>${p.title}</h3><p>${p.desc}</p><div class="money-row"><strong>${money(p.raised)}</strong><span>obiettivo ${money(p.target)}</span></div><div class="progress"><i style="width:${pct(p)}%"></i></div><div class="project-meta"><span>${p.supporters} sostenitori</span><span>${p.days} giorni rimasti</span></div><button class="btn btn-primary full" data-donate="${p.id}">Contribuisci a questo progetto</button></div></article>`).join('');
}
function renderReports(){document.querySelector('#reportList').innerHTML=reports.map(r=>`<article class="report-item"><div><h3>${r.title}</h3><p>${r.desc}</p></div><span class="status ${r.status}">${r.label}</span></article>`).join('')}
renderProjects();renderReports();

const titles={dashboard:'Dashboard',perche:'Perché GIADA',progetti:'Progetti & raccolte',segnalazioni:'Segnalazioni',eventi:'Eventi',community:'Community',dati:'GIADA in numeri',trasparenza:'Trasparenza'};
function go(view){
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  document.querySelector('#view-'+view)?.classList.add('active');
  document.querySelectorAll('[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===view));
  document.querySelector('#pageTitle').textContent=titles[view]||'GIADA';
  document.querySelector('#sidebar').classList.remove('open');
  window.scrollTo({top:0,behavior:'smooth'});
}
document.addEventListener('click',e=>{const v=e.target.closest('[data-view]');if(v)go(v.dataset.view);const g=e.target.closest('[data-go]');if(g)go(g.dataset.go)});
document.querySelector('#menuBtn').addEventListener('click',()=>document.querySelector('#sidebar').classList.toggle('open'));

const modal=document.querySelector('#modalBackdrop'), content=document.querySelector('#modalContent');
function openModal(html){content.innerHTML=html;modal.hidden=false;document.body.style.overflow='hidden'}
function closeModal(){modal.hidden=true;document.body.style.overflow=''}
document.querySelector('#modalClose').onclick=closeModal;modal.addEventListener('click',e=>{if(e.target===modal)closeModal()});
function toast(msg){const t=document.querySelector('#toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2400)}

document.addEventListener('click',e=>{
  const d=e.target.closest('[data-donate]');
  if(d){const p=projects.find(x=>x.id===d.dataset.donate);openModal(`<span class="kicker">EROGAZIONE LIBERALE FINALIZZATA</span><h2>${p.icon} ${p.title}</h2><p>Il tuo contributo viene associato a questo progetto. Importi raccolti, impiego delle risorse e avanzamento saranno rendicontati pubblicamente nella sezione Trasparenza.</p><div class="amounts"><button class="active">€ 20</button><button>€ 50</button><button>€ 100</button><button>Altro</button></div><div class="form-grid" style="margin-top:16px"><label>Email<input type="email" placeholder="nome@email.it"></label><label>Nome (facoltativo)<input placeholder="Come vuoi apparire tra i sostenitori"></label><button class="btn btn-primary full" id="demoPay">Continua al pagamento</button><small>Demo: il pagamento reale potrà essere gestito da Stripe/PayPal sul sito definitivo.</small></div>`);setTimeout(()=>document.querySelector('#demoPay')?.addEventListener('click',()=>{closeModal();toast('Demo pagamento: flusso completato ✓')}),0)}
  const a=e.target.closest('[data-action]');if(!a)return;
  if(a.dataset.action==='report')openModal(`<span class="kicker">NUOVA SEGNALAZIONE</span><h2>Segnala qualcosa al Comitato</h2><p>Puoi allegare una foto e indicare se vuoi che il Comitato valuti l’inoltro al Comune.</p><div class="form-grid"><label>Categoria<select><option>Verde e parco</option><option>Illuminazione</option><option>Strade e marciapiedi</option><option>Rifiuti</option><option>Sicurezza</option><option>Altro</option></select></label><label>Descrizione<textarea placeholder="Descrivi il problema..."></textarea></label><label>Foto<input type="file" accept="image/*"></label><label>Posizione<input placeholder="Via / punto di riferimento"></label><button class="btn btn-primary full" id="sendReport">Invia segnalazione</button></div>`);
  if(a.dataset.action==='idea')openModal(`<span class="kicker">CASSETTA DELLE IDEE</span><h2>Proponi un’idea per GIADA</h2><div class="form-grid"><label>Titolo<input placeholder="Es. Panchine ombreggiate nel parco"></label><label>La tua proposta<textarea placeholder="Raccontaci l’idea, a chi serve e perché..."></textarea></label><button class="btn btn-primary full" id="sendIdea">Invia proposta</button></div>`);
  if(a.dataset.action==='participate')openModal(`<span class="kicker">PARTECIPA A GIADA</span><h2>Scegli come vuoi esserci</h2><p>Non serve decidere tutto subito. Puoi semplicemente seguire il quartiere, contribuire quando puoi oppure scegliere un ruolo più attivo.</p><div class="participation-grid"><button data-participation="community"><b>Entra nella Community</b><span>Ricevi aggiornamenti, partecipa agli eventi, proponi idee e segui i progetti.</span><small>Gratis · nessun obbligo</small></button><button data-participation="active"><b>Dai una mano</b><span>Metti a disposizione tempo, esperienza o una competenza quando puoi.</span><small>Partecipazione libera</small></button><button data-participation="member"><b>Diventa socio del Comitato</b><span>Partecipa formalmente alla vita associativa e alle decisioni previste dallo Statuto.</span><small>Domanda di ammissione</small></button><button data-go-modal="progetti"><b>Sostieni un progetto</b><span>Contribuisci direttamente a una iniziativa concreta e segui come vengono usate le risorse.</span><small>Contributo libero</small></button></div>`);
  if(a.dataset.action==='skills')openModal(`<span class="kicker">COMPETENZE GIADA</span><h2>Che cosa sai fare?</h2><p>Professionale o personale: ci interessa capire quali risorse esistono già nel quartiere. Dichiarare una competenza non significa assumere un impegno continuativo.</p><div class="form-grid"><label>Ambito<select><option>Tecnica e progettazione</option><option>Scuola e formazione</option><option>Digitale e comunicazione</option><option>Salute e sociale</option><option>Artigianato e manutenzione</option><option>Verde e ambiente</option><option>Eventi e cultura</option><option>Sport</option><option>Amministrazione e diritto</option><option>Altro</option></select></label><label>Competenza<input placeholder="Es. grafica, matematica, giardinaggio..."></label><label>Disponibilità<select><option>Solo censimento</option><option>Disponibile occasionalmente</option><option>Disponibile per un progetto specifico</option></select></label><button class="btn btn-primary full" id="sendSkill">Aggiungi competenza</button></div>`);

  const pc=e.target.closest('[data-participation]');
  if(pc){
    const type=pc.dataset.participation;
    if(type==='community') openModal(`<span class="kicker">COMMUNITY GIADA</span><h2>Entra nella Community</h2><p>Entrare nella Community è gratuito e non comporta l’iscrizione come socio del Comitato.</p><div class="form-grid"><label>Nome e cognome<input></label><label>Email<input type="email"></label><label><input type="checkbox"> Ho letto l’informativa privacy</label><button class="btn btn-primary full" id="sendCommunity">Entra nella Community</button></div>`);
    if(type==='active') openModal(`<span class="kicker">DAI UNA MANO</span><h2>Partecipa quando puoi</h2><p>Puoi mettere a disposizione tempo, esperienza o una competenza senza diventare socio e senza assumere un impegno continuativo.</p><div class="form-grid"><label>Come vorresti contribuire?<textarea placeholder="Raccontaci in cosa potresti dare una mano..."></textarea></label><button class="btn btn-primary full" id="sendActive">Invia disponibilità</button></div>`);
    if(type==='member') openModal(`<span class="kicker">SOCIO DEL COMITATO</span><h2>Diventare socio è una scelta formale</h2><p>Essere socio è diverso dall’entrare nella Community. Il socio condivide le finalità del Comitato, partecipa all’Assemblea ed esercita i diritti previsti dallo Statuto. La richiesta diventa efficace dopo la procedura di ammissione prevista.</p><div class="modal-actions"><button class="btn btn-outline" data-action="statute">Leggi lo Statuto</button><button class="btn btn-primary" id="membershipRequest">Presenta domanda di ammissione</button></div>`);
  }
  const gm=e.target.closest('[data-go-modal]');
  if(gm){closeModal();go(gm.dataset.goModal)}

  if(a.dataset.action==='communityTopic')toast(`Apertura area protetta: ${a.dataset.topic}`);
  if(['search','profile','proposeProject','newCommunity','statute'].includes(a.dataset.action))toast('Funzione presente nella demo · da attivare nella versione reale');
  setTimeout(()=>{document.querySelector('#sendReport')?.addEventListener('click',()=>{closeModal();toast('Segnalazione inviata ✓')});document.querySelector('#sendIdea')?.addEventListener('click',()=>{closeModal();toast('Idea ricevuta ✓')});document.querySelector('#sendCommunity')?.addEventListener('click',()=>{closeModal();toast('Benvenuto nella Community GIADA ✓')});document.querySelector('#sendActive')?.addEventListener('click',()=>{closeModal();toast('Disponibilità ricevuta ✓')});document.querySelector('#sendSkill')?.addEventListener('click',()=>{closeModal();toast('Competenza aggiunta ✓')});document.querySelector('#membershipRequest')?.addEventListener('click',()=>{openModal(`<span class="kicker">DOMANDA DI AMMISSIONE</span><h2>Richiesta di associazione</h2><p>La domanda sarà valutata secondo quanto previsto dallo Statuto. Questa demo non produce automaticamente l’ammissione come socio.</p><div class="form-grid"><label>Nome e cognome<input></label><label>Email<input type="email"></label><label>Indirizzo / relazione con il quartiere<input placeholder="Es. residente in Via Caduti di Nassiriya"></label><label><input type="checkbox"> Dichiaro di aver letto lo Statuto e l’informativa privacy</label><button class="btn btn-primary full" id="sendMember">Invia domanda</button></div>`);setTimeout(()=>document.querySelector('#sendMember')?.addEventListener('click',()=>{closeModal();toast('Domanda di ammissione inviata ✓')}),0)})},0)
});

document.addEventListener('click',e=>{if(e.target.matches('.amounts button')){e.target.parentElement.querySelectorAll('button').forEach(b=>b.classList.remove('active'));e.target.classList.add('active')}})
