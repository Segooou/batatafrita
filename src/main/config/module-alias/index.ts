import { addAlias } from 'module-alias';
import { readdirSync } from 'fs';
import { resolve } from 'path';

const rootPath = 'src';

const layers = readdirSync(resolve(__dirname, '..', '..', '..', '..', rootPath));

layers.forEach((layer: string) => {
  addAlias(`${layer}`, resolve(`${rootPath}/${layer}`));
});
