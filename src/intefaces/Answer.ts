export default interface Answer {
  id?: number;
  question_id: null | number;
  participant: string | null;
  options: Array<string>;
}
