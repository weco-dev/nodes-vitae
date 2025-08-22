export type Document = {
    id: string
  title: string;
  author: string;
  year: number;
  fileName: string;
}

  export const documents: Document[] = [
    {
    id:'01',
    title: 'Documento d’Impegno per i Diritti Umani e la Sostenibilità Ambientale', 
    author: 'John Doe',
    year: 2020,
    fileName: 'test-file.pdf'
  },
{id:'02',
    title: 'Advanced JavaScript',
    author: 'Jane Smith',
    year: 2019,
    fileName: 'advanced-javascript.pdf'
}]