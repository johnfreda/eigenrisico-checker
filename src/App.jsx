import React, { useState } from 'react';

import { 
  ArrowRight,
  ArrowLeft,
  HeartHandshake,
  ShieldCheck,
  PiggyBank,
  RotateCcw,
  Info,
  Check,
  Smile, 
  AlertCircle,
  Activity, 
  Stethoscope,
  Sparkles // Nieuw icoon voor de intro
} from 'lucide-react';

export default function App() {
  // --- STATE ---
  const [step, setStep] = useState(0); // Start bij 0 (Introductie)
  // State voor Eigen Risico
  const [expectedCosts, setExpectedCosts] = useState(0);
  const [monthlyDiscount, setMonthlyDiscount] = useState(20); 
  // State voor Aanvullend
  const [dentalStatus, setDentalStatus] = useState(null); 
  const [physioStatus, setPhysioStatus] = useState(null); // 'none', 'low', 'high'
  // --- CONSTANTEN 2026 ---
  const VERPLICHT_RISICO = 385;
  const VRIJWILLIG_RISICO = 500;
  const MAX_RISICO = VERPLICHT_RISICO + VRIJWILLIG_RISICO;
  const BASIS_PREMIE = 145; 
  // --- BEREKENINGEN EIGEN RISICO ---
  const jaarKorting = monthlyDiscount * 12;
  const kostenLaag = Math.min(expectedCosts, VERPLICHT_RISICO);
  const totaalLaag = (BASIS_PREMIE * 12) + kostenLaag;
  const kostenHoog = Math.min(expectedCosts, MAX_RISICO);
  const totaalHoog = ((BASIS_PREMIE - monthlyDiscount) * 12) + kostenHoog;
  const verschil = totaalLaag - totaalHoog; 
  const besparing = Math.abs(verschil);
  const isHoogBeter = verschil > 0;
  // --- BEREKENINGEN TANDARTS (Indicatief) ---
  const TANDARTS_PREMIE_JAAR = 168; 
  const TANDARTS_KOSTEN_CONTROLE = 90; 

  // --- SCENARIOS ---
  const costScenarios = [
    { value: 0, label: "Bijna niks", desc: "Ik ben gezond en kom nooit in het ziekenhuis.", range: [0, 50] },
    { value: 150, label: "Beetje", desc: "Misschien af en toe medicijnen of bloedprikken.", range: [51, 250] },
    { value: 385, label: "Gemiddeld", desc: "Ik maak mijn eigen risico (€385) meestal wel op.", range: [251, 450] },
    { value: 650, label: "Meer", desc: "Ik verwacht specialistische zorg nodig te hebben.", range: [451, 850] },
    { value: 1000, label: "Veel", desc: "Ik heb een chronische aandoening of operatie gepland.", range: [851, 2000] }
  ];
  const activeScenarioIndex = costScenarios.findIndex(s => expectedCosts >= s.range[0] && expectedCosts <= s.range[1]);

  // --- NAVIGATIE ---
  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);
  const reset = () => { 
    setStep(0); 
    setExpectedCosts(0); 
    setDentalStatus(null);
    setPhysioStatus(null);
  };
  // Helper om te bepalen in welk 'hoofdstuk' we zitten
  const getPhase = () => {
    if (step === 0) return 'intro';
    if (step >= 1 && step <= 3) return 'basis'; // Eigen Risico
    if (step >= 4 && step <= 6) return 'aanvullend'; // Tandarts & Fysio
    if (step === 7) return 'totaal';
    return 'unknown';
  };
  const phase = getPhase();
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-4 font-sans text-slate-700 flex items-center justify-center">
      <div className="max-w-3xl w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-white/60 relative">
        {/* Progress Bar (Niet op intro) */}
        {step > 0 && (
          <div className="h-1.5 bg-slate-100 w-full flex">
            <div 
              className={`h-full transition-all duration-700 ease-in-out ${phase === 'basis' ? 'bg-sky-500' : 'bg-indigo-500'}`} 
              style={{ width: `${(step / 7) * 100}%` }}
            ></div>
          </div>
        )}
        {/* HEADER (Dynamisch per fase, niet op intro) */}
        {step > 0 && (
          <div className="p-6 md:p-8 pb-2">
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                {phase === 'basis' && <HeartHandshake className="text-sky-500 w-7 h-7" />}
                {phase === 'aanvullend' && <Smile className="text-indigo-500 w-7 h-7" />}
                {phase === 'totaal' && <ShieldCheck className="text-emerald-500 w-7 h-7" />}
                {phase === 'basis' && "Deel 1: Basisverzekering"}
                {phase === 'aanvullend' && "Deel 2: Aanvullend"}
                {phase === 'totaal' && "Jouw Zorgplan 2026"}
              </h1>
              <div className={`text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide
                ${phase === 'basis' ? 'bg-sky-50 text-sky-600' : ''}
                ${phase === 'aanvullend' ? 'bg-indigo-50 text-indigo-600' : ''}
                ${phase === 'totaal' ? 'bg-emerald-50 text-emerald-600' : ''}
              `}>
                Stap {step} / 7
              </div>
            </div>
          </div>
        )}
        {/* CONTENT AREA */}
        <div className={`${step === 0 ? 'p-0' : 'px-6 md:px-8 pb-8'} min-h-[450px] flex flex-col justify-between`}>
          {/* --- STAP 0: VERNIEUWDE INTRODUCTIE (VRIENDELIJK) --- */}
          {step === 0 && (
            <div className="flex flex-col h-full bg-white">
              {/* Friendly Header Section */}
              <div className="bg-gradient-to-b from-indigo-50 to-white p-8 md:p-10 text-center">
                <div className="inline-flex p-3 bg-white rounded-2xl shadow-sm mb-6 ring-1 ring-indigo-50">
                  <HeartHandshake className="w-10 h-10 text-indigo-500" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4 tracking-tight">
                  Zorgverzekering Hulp <span className="text-indigo-500">2026</span>
                </h1>
                <p className="text-lg text-slate-600 max-w-lg mx-auto leading-relaxed">
                  Een eerlijk advies over je eigen risico en aanvullende verzekeringen. We helpen je rustig de balans op te maken.
                </p>
              </div>
              {/* Content Section */}
              <div className="flex-1 px-8 pb-8 flex flex-col items-center max-w-xl mx-auto w-full">
                <div className="space-y-6 mb-10 w-full">
                  <div className="flex gap-4 items-start p-4 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="bg-green-100 p-2 rounded-full mt-1 flex-shrink-0">
                      <Sparkles className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg">Inzicht in je kosten</h3>
                      <p className="text-slate-500">We kijken samen of het voor jou slim is om je eigen risico aan te passen.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start p-4 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="bg-blue-100 p-2 rounded-full mt-1 flex-shrink-0">
                      <ShieldCheck className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg">Alleen wat nodig is</h3>
                      <p className="text-slate-500">Twijfel je over de tandarts of fysio? Wij helpen je objectief te kiezen.</p>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={nextStep}
                  className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 group text-lg"
                >
                  Start de Keuzehulp <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <div className="flex items-center gap-6 mt-6 text-xs font-medium text-slate-400 uppercase tracking-wider">
                  <span className="flex items-center gap-1"><Check className="w-3 h-3" /> Anoniem</span>
                  <span className="flex items-center gap-1"><Check className="w-3 h-3" /> ~2 Minuten</span>
                </div>
              </div>
            </div>
          )}
          {/* --- STAP 1: ZORGKOSTEN (BASIS) --- */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-2xl font-semibold text-slate-800 mb-2">Hoeveel zorgkosten verwacht je?</h2>
              <p className="text-slate-500 mb-6">
                Probeer in te schatten hoeveel zorg uit het basispakket je volgend jaar nodig hebt. <br/>
                <span className="text-sm font-medium text-indigo-600 flex items-center gap-1 mt-1">
                  <Info className="w-4 h-4"/> Goed om te weten: Huisartsbezoek is altijd gratis.
                </span>
              </p>
              <div className="bg-sky-50/50 rounded-2xl p-6 mb-6 border border-sky-100">
                <div className="flex justify-between items-end mb-4">
                  <label className="font-medium text-slate-700">Geschatte basiskosten:</label>
                  <span className="text-3xl font-bold text-sky-600">€ {expectedCosts}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="10"
                  value={expectedCosts}
                  onChange={(e) => setExpectedCosts(Number(e.target.value))}
                  className="w-full h-3 bg-slate-200 rounded-full appearance-none cursor-pointer accent-sky-500 hover:accent-sky-600 mb-8"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                  {costScenarios.map((scenario, index) => {
                    const isActive = activeScenarioIndex === index;
                    return (
                      <button
                        key={index}
                        onClick={() => setExpectedCosts(scenario.value)}
                        className={`
                          relative p-3 rounded-xl text-left border transition-all duration-200 flex flex-col gap-1 h-full
                          ${isActive 
                            ? 'bg-white border-sky-500 ring-2 ring-sky-200 shadow-md transform -translate-y-1' 
                            : 'bg-white/60 border-slate-200 hover:border-sky-300 hover:bg-white'
                          }
                        `}
                      >
                        {isActive && (
                          <div className="absolute -top-2 -right-2 bg-sky-500 text-white rounded-full p-0.5">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                        <span className={`text-xs font-bold uppercase tracking-wider ${isActive ? 'text-sky-600' : 'text-slate-400'}`}> {scenario.label}</span>
                        <span className="text-xs text-slate-600 leading-snug">
                          {scenario.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
          {/* --- STAP 2: KORTING (BASIS) --- */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-2xl font-semibold text-slate-800 mb-3">De 'Eigen Risico' Keuze</h2>
              <p className="text-slate-500 mb-8 leading-relaxed max-w-xl">
                Je kunt vrijwillig je eigen risico verhogen van €385 naar €885. In ruil daarvoor geven verzekeraars je korting op de maandpremie.
              </p>
              <div className="bg-emerald-50/50 rounded-2xl p-6 mb-6 border border-emerald-100">
                <div className="flex justify-between items-end mb-4">
                  <label className="font-medium text-slate-700">Korting per maand:</label>
                  <span className="text-2xl font-bold text-emerald-600">€ {monthlyDiscount}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  step="1"
                  value={monthlyDiscount}
                  onChange={(e) => setMonthlyDiscount(Number(e.target.value))}
                  className="w-full h-3 bg-slate-200 rounded-full appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-600 mb-4"
                />
                <p className="text-sm text-slate-600 flex items-center gap-2">
                  <PiggyBank className="w-4 h-4 text-emerald-500" />
                  Dit levert je <strong>€ {jaarKorting}</strong> vaste korting per jaar op.
                </p>
              </div>
            </div>
          )}
          {/* --- STAP 3: RESULTAAT BASIS (TUSSENSTOP) --- */}
          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 text-center flex flex-col items-center">
              <div className="bg-white border-2 border-slate-100 rounded-2xl p-1 mb-6 inline-block">
                 <div className="bg-slate-50 px-4 py-1 rounded-xl text-xs font-bold text-slate-400 uppercase tracking-widest">Tussenstand</div>
              </div>
              <h2 className="text-3xl font-bold text-slate-800 mb-4">
                {isHoogBeter ? "Verhogen lijkt voordelig" : "Standaard geeft meer zekerheid"}
              </h2>
              <div className={`p-6 rounded-3xl mb-8 max-w-md w-full border-2 ${isHoogBeter ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-sky-50 border-sky-200 text-sky-900'}`}>
                {isHoogBeter ? (
                   <>
                    <p className="font-medium text-lg mb-2">Overweeg €885 Eigen Risico</p>
                    <p className="text-sm opacity-80">Je verwacht weinig kosten. De premiekorting die je krijgt levert je waarschijnlijk <strong className="whitespace-nowrap">€{besparing.toFixed(0)} voordeel</strong> op.</p>
                   </>
                ) : (
                  <>
                    <p className="font-medium text-lg mb-2">Kies €385 Eigen Risico</p>
                    <p className="text-sm opacity-80">Omdat je zorgkosten verwacht, is het veiliger om je eigen risico laag te houden. Zo voorkom je onverwachte hoge kosten.</p>
                  </>
                )}
              </div>
              <div className="flex items-center gap-4 w-full max-w-md bg-indigo-50 p-4 rounded-xl border border-indigo-100 text-left">
                <div className="bg-white p-2 rounded-full text-indigo-500 shadow-sm"><ArrowRight className="w-5 h-5"/></div>
      <div>
                  <h3 className="font-bold text-indigo-900 text-sm">Volgende stap: Aanvullend</h3>
                  <p className="text-xs text-indigo-700">Laten we kijken naar de Tandarts en Fysio.</p>
                </div>
              </div>
            </div>
          )}
          {/* --- STAP 4: TANDARTS STATUS --- */}
          {step === 4 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
               <h2 className="text-2xl font-semibold text-slate-800 mb-2">Deel 2: De Tandarts</h2>
               <p className="text-slate-500 mb-6">
                 Een tandartsverzekering loont niet altijd. Hoe schat jij de staat van je gebit in?
               </p>
              <div className="grid gap-4">
                <button onClick={() => setDentalStatus('good')} className={`p-4 rounded-xl border-2 text-left flex items-center gap-4 transition-all ${dentalStatus === 'good' ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-white hover:border-indigo-300'}`}>
                  <div className={`p-3 rounded-full ${dentalStatus === 'good' ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-400'}`}><Smile className="w-6 h-6" /></div>
                  <div><div className="font-bold text-slate-800">Gezond</div><div className="text-sm text-slate-500">Alleen controle, zelden gaatjes.</div></div>
                </button>
                <button onClick={() => setDentalStatus('fair')} className={`p-4 rounded-xl border-2 text-left flex items-center gap-4 transition-all ${dentalStatus === 'fair' ? 'border-orange-400 bg-orange-50' : 'border-slate-200 bg-white hover:border-orange-300'}`}>
                  <div className={`p-3 rounded-full ${dentalStatus === 'fair' ? 'bg-orange-400 text-white' : 'bg-slate-100 text-slate-400'}`}><AlertCircle className="w-6 h-6" /></div>
                  <div><div className="font-bold text-slate-800">Matig</div><div className="text-sm text-slate-500">Soms een gaatje of mondhygiënist nodig.</div></div>
                </button>
                <button onClick={() => setDentalStatus('bad')} className={`p-4 rounded-xl border-2 text-left flex items-center gap-4 transition-all ${dentalStatus === 'bad' ? 'border-red-500 bg-red-50' : 'border-slate-200 bg-white hover:border-red-300'}`}>
                  <div className={`p-3 rounded-full ${dentalStatus === 'bad' ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-400'}`}><Stethoscope className="w-6 h-6" /></div>
                  <div><div className="font-bold text-slate-800">Groot onderhoud</div><div className="text-sm text-slate-500">Wortelkanaal, kronen of verstandskiezen.</div></div>
                </button>
              </div>
      </div>
          )}
          {/* --- STAP 5: FYSIO STATUS --- */}
          {step === 5 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
               <h2 className="text-2xl font-semibold text-slate-800 mb-2">Nog eentje: Fysiotherapie</h2>
               <p className="text-slate-500 mb-6">
                 Sport je veel of heb je fysieke klachten? Een losse behandeling kost vaak rond de €40.
               </p>
              <div className="grid gap-4">
                <button onClick={() => setPhysioStatus('none')} className={`p-4 rounded-xl border-2 text-left flex items-center gap-4 transition-all ${physioStatus === 'none' ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-white hover:border-indigo-300'}`}>
                  <div className={`p-3 rounded-full ${physioStatus === 'none' ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-400'}`}><Activity className="w-6 h-6" /></div>
                  <div><div className="font-bold text-slate-800">Niet nodig</div><div className="text-sm text-slate-500">Ik ga nooit naar de fysio.</div></div>
                </button>
                <button onClick={() => setPhysioStatus('low')} className={`p-4 rounded-xl border-2 text-left flex items-center gap-4 transition-all ${physioStatus === 'low' ? 'border-orange-400 bg-orange-50' : 'border-slate-200 bg-white hover:border-orange-300'}`}>
                  <div className={`p-3 rounded-full ${physioStatus === 'low' ? 'bg-orange-400 text-white' : 'bg-slate-100 text-slate-400'}`}><Activity className="w-6 h-6" /></div>
                  <div><div className="font-bold text-slate-800">Soms (Blessure risico)</div><div className="text-sm text-slate-500">Ik wil 6-9 behandelingen voor de zekerheid.</div></div>
                </button>
                <button onClick={() => setPhysioStatus('high')} className={`p-4 rounded-xl border-2 text-left flex items-center gap-4 transition-all ${physioStatus === 'high' ? 'bg-indigo-600 bg-indigo-100' : 'border-slate-200 bg-white hover:border-indigo-300'}`}>
                   <div className={`p-3 rounded-full ${physioStatus === 'high' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}><Activity className="w-6 h-6" /></div>
                  <div><div className="font-bold text-slate-800">Vaak</div><div className="text-sm text-slate-500">Ik heb chronische klachten (12+ keer).</div></div>
        </button>
              </div>
            </div>
          )}
          {/* --- STAP 6: TOTAAL OVERZICHT --- */}
          {step === 6 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
               <div className="text-center mb-6">
                 <h2 className="text-2xl font-bold text-slate-800">Jouw Zorgadvies 2026</h2>
               </div>
               <div className="grid md:grid-cols-3 gap-4 mb-6">
                 {/* 1. Basis */}
                 <div className={`p-5 rounded-2xl border flex flex-col justify-between ${isHoogBeter ? 'bg-emerald-50 border-emerald-200' : 'bg-sky-50 border-sky-200'}`}>
                   <div>
                     <div className="flex items-center gap-2 mb-2 text-slate-500 text-xs font-bold uppercase tracking-wider"><ShieldCheck className="w-4 h-4"/> Basisverzekering</div>
                     <div className="font-bold text-xl text-slate-800 mb-2">
                       {isHoogBeter ? 'Hoog Risico (€885)' : 'Standaard (€385)'}
                     </div>
                     <p className="text-sm text-slate-600 leading-snug">
                       {isHoogBeter 
                         ? 'Je bent gezond. Pak die premiekorting!' 
                         : 'Je verwacht kosten. Speel op safe.'}
                     </p>
                   </div>
                 </div>
                 {/* 2. Tandarts */}
                 <div className="p-5 rounded-2xl border bg-white border-slate-200 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2 text-slate-400 text-xs font-bold uppercase tracking-wider"><Smile className="w-4 h-4"/> Tandarts</div>
                      <div className={`font-bold text-xl mb-2 ${dentalStatus === 'good' ? 'text-emerald-600' : dentalStatus === 'bad' ? 'text-indigo-600' : 'text-orange-500'}`}>
                        {dentalStatus === 'good' ? 'Niet verzekeren' : dentalStatus === 'bad' ? 'Wel verzekeren' : 'Zelf sparen'}
                      </div>
                      <p className="text-sm text-slate-600 leading-snug">
                        {dentalStatus === 'good' && "De premie is hoger dan je kosten. Betaal controles zelf."}
                        {dentalStatus === 'fair' && "Twijfelgeval. Vaak is een potje maken voordeliger."}
                        {dentalStatus === 'bad' && "Met groot onderhoud haal je de premie er waarschijnlijk uit."}
                      </p>
                    </div>
                 </div>
                 {/* 3. Fysio */}
                 <div className="p-5 rounded-2xl border bg-white border-slate-200 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2 text-slate-400 text-xs font-bold uppercase tracking-wider"><Activity className="w-4 h-4"/> Fysio</div>
                      <div className={`font-bold text-xl mb-2 ${physioStatus === 'none' ? 'text-emerald-600' : 'text-indigo-600'}`}>
                        {physioStatus === 'none' ? 'Niet nodig' : physioStatus === 'low' ? 'Klein pakket' : 'Groot pakket'}
                      </div>
                      <p className="text-sm text-slate-600 leading-snug">
                        {physioStatus === 'none' && "Zonde van het geld als je nooit gaat."}
                        {physioStatus === 'low' && "Kies een klein pakket (6-9x) voor onverwachte blessures."}
                        {physioStatus === 'high' && "Je haalt de kosten er ruimschoots uit."}
                      </p>
                    </div>
                 </div>
               </div>
               <div className="bg-slate-100 p-4 rounded-xl flex gap-3 text-slate-600 text-sm">
                 <Info className="w-5 h-5 flex-shrink-0" />
                 <p>
                   <strong>Tip:</strong> Het geld dat je bespaart met je eigen risico en door géén tandartsverzekering te nemen, kun je het beste maandelijks opzij zetten. Zo bouw je je eigen buffer op.
                 </p>
               </div>
            </div>
          )}
          {/* FOOTER BUTTONS (Niet op intro) */}
          {step > 0 && (
            <div className="flex gap-4 mt-6 pt-4 border-t border-slate-100">
              {step > 1 && step < 6 && (
                <button 
                  onClick={prevStep}
                  className="px-6 py-3.5 rounded-xl font-bold text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              {/* Algemene Volgende Knop */}
              {step < 6 && (
                <button 
                  onClick={nextStep}
                  disabled={
                    (step === 4 && !dentalStatus) || 
                    (step === 5 && !physioStatus)
                  }
                  className={`flex-1 py-3.5 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2 group text-sm
                    ${phase === 'basis' ? 'bg-sky-500 hover:bg-sky-600 shadow-sky-100 text-white' : ''}
                    ${phase === 'aanvullend' ? 'bg-indigo-500 hover:bg-indigo-600 shadow-indigo-100 text-white' : ''}
                    ${(step === 4 && !dentalStatus) || (step === 5 && !physioStatus) ? '!bg-slate-200 !text-slate-400 !cursor-not-allowed !shadow-none' : ''}
                  `}
                >
                  {step === 3 ? "Naar Deel 2: Aanvullend" : "Volgende"} 
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              )}
              {step === 6 && (
                <button 
                  onClick={reset}
                  className="flex-1 bg-slate-100 text-slate-600 py-3.5 rounded-xl font-bold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <RotateCcw className="w-4 h-4" /> Doe de check opnieuw
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
