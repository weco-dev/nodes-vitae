export type Document = {
  group: string;
    index: string;
    title: string;
    fileName: string;
}

  export const documents: Document[] = [
 {
   "group": "Impegno e condotta responsabile",
   "index": "1",
   "title": "Documento d’Impegno per i Diritti Umani e la Sostenibilità Ambientale",
   "fileName": "1-condotta-responsabile.pdf"
 },
 {
   "group": "Lavoro forzato",
   "index": "2",
   "title": "Policy per il reclutamento e il lavoro etico",
   "fileName": "2-policy-lavoro forzato.pdf"
 },
 {
   "group": "Lavoro forzato",
   "index": "2a",
   "title": "Indicatori di sfruttamento lavorativo",
   "fileName": "2a-indicatori-sfruttamento.pdf"
 },
 {
   "group": "Lavoro minorile",
   "index": "3",
   "title": "Policy per prevenire il lavoro minorile",
   "fileName": "3-lavoro-minorile.pdf"
 },
 {
   "group": "Discriminazione di genere",
   "index": "4",
   "title": "Policy per prevenire le discriminazioni di genere",
   "fileName": "4-policy-discriminazioni.pdf"
 },
 {
   "group": "Salute e sicurezza sul lavoro",
   "index": "5",
   "title": "Policy per garantire la salute e la sicurezza dei lavoratori",
   "fileName": "5-policy-salute-sicurezza.pdf"
 },
 {
   "group": "Anticorruzione e Anticoncussione",
   "index": "6",
   "title": "Policy per prevenire meccanismi di corruzione",
   "fileName": "6-policy-anticorruzione.pdf"
 },
 {
   "group": "Fornitori",
   "index": "7",
   "title": "Clausole contrattuali per i fornitori",
   "fileName": "7-clausole-fornitori.pdf"
 },
 {
   "group": "Linee guida",
   "index": "8a",
   "title": "Come si scrive una policy",
   "fileName": "8a-come-scrivere-policy.pdf"
 },
 {
   "group": "Linee guida",
   "index": "8b",
   "title": "Linee guida per la valutazione del rischio",
   "fileName": "8b-risk-assessment.pdf"
 },
 {
   "group": "Linee guida",
   "index": "8c",
   "title": "Linee guida per l'attuazione di un piano di risposta e rimedio",
   "fileName": "8c-risposta-rimedio.pdf"
 }
]

//extract the unique groups from the documents array
export const documentGroups = Array.from(new Set(documents.map(doc => doc.group)));