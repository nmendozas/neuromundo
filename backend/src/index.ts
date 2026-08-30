import { createApp } from './app';
import { env } from './config/env';
import { getDb } from './db';
import { deleteExpiredSessions } from './db/repos/sessions';

// Arranca la BD (ejecuta migraciones y seed del usuario admin).
getDb();
deleteExpiredSessions();

const app = createApp();

app.listen(env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`🚀 API NeuroMundo S.A.S escuchando en http://0.0.0.0:${env.PORT}`);
  // eslint-disable-next-line no-console
  console.log(`   Base de datos: ${env.DB_PATH}`);
});
