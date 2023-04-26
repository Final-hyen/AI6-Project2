import { getConnection, Repository } from 'typeorm';
import { injectable } from 'inversify';
import { User } from './user.entity';

@injectable()
export class UserRepository {
  async save(user: User): Promise<User> {
    return await user.save();
  }

  async findOneByEmail(email: string): Promise<User | null> {
    const connection = await getConnection();
    return await connection.getRepository(User).findOneBy({
      email: email,
    });
  }

  async findOneByNickname(nickname: string): Promise<User | null> {
    const connection = await getConnection();
    return await connection.getRepository(User).findOneBy({
      nickname: nickname,
    });
  }

  async findById(userId: number): Promise<User | null> {
    const connection = await getConnection();
    return await connection.getRepository(User).findOneBy({
      id: userId,
    });
  }

  async findManyByIds(idList: number[]): Promise<User[]> {
    const userRepository = await this.getRepository();

    return await userRepository.createQueryBuilder('user')
      .where('user.id IN (:...idList)', { idList })
      .getMany();
  }

  async deleteById(userId: number): Promise<User | null> {
     const foundUser = await this.findById(userId);

     if (!foundUser) return null;

     // soft-delete 정책 적용
     const targetUser = foundUser.softDelete();

     return await targetUser.save();
  }

  private async getRepository(): Promise<Repository<User>> {
    const connection = await getConnection();
    return connection.getRepository(User);
  }
}
