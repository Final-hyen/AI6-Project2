import express from 'express';
import { researchRepository } from '../domain/research.repository';

class ResearchController {
  async insertResearch1(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    const result = await researchRepository.insertResearch1();
    res.locals.data = result;

    next();
  }
  async getAllResearch1(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    const result = await researchRepository.findAllResearch1();
    res.locals.data = result;

    next();
  }
  async insertResearch2(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    const result = await researchRepository.insertResearch2();
    res.locals.data = result;

    next();
  }
  async getAllResearch2(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    const result = await researchRepository.findAllResearch2();
    res.locals.data = result;

    next();
  }
  async insertResearch3(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    const result = await researchRepository.insertResearch3();
    res.locals.data = result;

    next();
  }
  async getAllResearch3(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    const result = await researchRepository.findAllResearch3();
    res.locals.data = result;

    next();
  }
}

const researchController = new ResearchController();
export { researchController };
