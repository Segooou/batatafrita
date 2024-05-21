import { DataSource } from './infra/database';
import { env } from './main/config/env';
import { errorLogger } from './main/utils';
import { http } from './main/config/app';

DataSource.$connect()
  .then(() => {
    http.listen(env.API_PORT, () => {
      console.info(`Server started at http://localhost:${env.API_PORT}/api-docs`);
    });
  })
  .catch((error: unknown) => {
    if (error instanceof Error) {
      console.error(`An error of type ${error.name} occurred. See the logs error...`);
      console.error(error);
    }
    errorLogger(error);
  });
