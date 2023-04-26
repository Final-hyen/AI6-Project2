import { Research1, Research2, Research3 } from './research.entity';
import fs from 'fs';
import path from 'path';

export class ResearchRepository {
  async insertResearch1(): Promise<string> {
    const research1JSON = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, '../../../Data', '1인가구 데이터(서울).json'),
        'utf-8',
      ),
    );
    await Research1.create(research1JSON);

    return 'Ok';
  }
  async findAllResearch1(): Promise<object> {
    const research1 = await Research1.find({}).select('-_id -__v');

    return research1;
  }
  async insertResearch2(): Promise<string> {
    const research2JSON = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, '../../../Data', '참여하지 않는 이유(서울).json'),
        'utf-8',
      ),
    );
    await Research2.create(research2JSON);

    return 'Ok';
  }
  async findAllResearch2(): Promise<object> {
    const research2 = await Research2.find({}).select('-_id -__v');

    return research2;
  }
  async insertResearch3(): Promise<string> {
    const research3JSON = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, '../../../Data', '체육활동 참가 이유(서울).json'),
        'utf-8',
      ),
    );
    await Research3.create(research3JSON);

    return 'Ok';
  }
  async findAllResearch3(): Promise<object> {
    const research3 = await Research3.find({}).select('-_id -__v');

    return research3;
  }
}

const researchRepository = new ResearchRepository();
export { researchRepository };
