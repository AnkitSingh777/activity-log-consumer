export interface QueueData {
  message: IActivityLog;
  receiptHandle: string;
}

export interface IActivityLog {
  ms_name: string;
  operation_type: string;
  user: string;
  data: string;
  api_name: string;
  id?: string;
  created_at?: string;
  additional_info: string;
  session_id: string;
  tracking_id: string;
  user_device: string;
}
