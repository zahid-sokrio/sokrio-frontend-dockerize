export default interface TaForm {
      travel_date: string;
      reason: string;
      transport: string;
      start_location: string;
      end_location: string;
      start_time: string;
      end_time: string;
      comment: string;
      photos: Array<File>;
      expense: string;
}
