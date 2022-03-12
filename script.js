import http from 'k6/http';
import { sleep, check } from 'k6';

export default function () {
  http.get('184.72.96.86:3000/qa/questions');
  sleep(1);
}
