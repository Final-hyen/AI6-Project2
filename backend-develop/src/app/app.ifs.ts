import { Express } from 'express';

export interface HttpApp {
  start: () => void;
  stop: () => Promise<void>;
  isShuttingDown: boolean;
  _app: Express;
}
