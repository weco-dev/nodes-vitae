export type Document = {
    index: number;
    group: string;
    number: string;
    title: string;
    author: string;
    year: number;
    fileName: string;
}

  export const documents: Document[] = [
    {
    index:1,
    group: 'Documento di condotta responsabile dell’impresa e di impegno al rispetto dei diritti umani',
    number: 'Allegato 1',
    title: 'Documento d’Impegno per i Diritti Umani e la Sostenibilità Ambientale', 
    author: 'John Doe',
    year: 2020,
    fileName: 'test-file.pdf'
  },
  {
    index:2,
    group: 'Documento di condotta responsabile dell’impresa e di impegno al rispetto dei diritti umani',
    number: 'Allegato 1a',
    title: 'Come si scrive una policy',
    author: 'Jane Smith',
    year: 2019,
    fileName: 'test-file.pdf'
},
    {
    index:2,
    group: 'Lavoro forzato',
    number: 'Allegato 2',
    title: 'Policy per il reclutamento e il lavoro etico', 
    author: 'John Doe',
    year: 2020,
    fileName: 'test-file.pdf'
  },
  {
    index:4,
    group: 'Lavoro forzato',
    number: 'Allegato 2a',
    title: 'Indicatori di sfruttamento lavorativo',
    author: 'Jane Smith',
    year: 2019,
    fileName: 'test-file.pdf'
},
]

//extract the unique groups from the documents array
export const documentGroups = Array.from(new Set(documents.map(doc => doc.group)));