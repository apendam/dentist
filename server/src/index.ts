import { app } from './app';
import { env } from './config/env';

app.listen(env.port, () => {
  console.log(`Dentist CRM API listening on port ${env.port}`);
});
