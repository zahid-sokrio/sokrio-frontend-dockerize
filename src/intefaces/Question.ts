import Survey from '@/intefaces/Survey';

export default interface Question {
  id?: number;
  survey_id: string;
  survey?: null | Survey;
  title: string;
  type: 'radio' | 'checkbox' | 'textarea' | null;
  for: 'consumer' | 'outlet' | string;
  options: Array<string>;
}
