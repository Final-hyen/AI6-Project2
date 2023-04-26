import { injectable } from 'inversify';
import { getConnection, Repository } from 'typeorm';
import { Letter } from './letter.entity';

@injectable()
export class LetterRepository {
  async create(letter: Letter): Promise<Letter> {
    return await letter.save();
  }

  //해당 메세지 찾기
  async findByMsg(id: number): Promise<Letter | null> {
    const connection = await getConnection();

    return await connection.getRepository(Letter).findOneBy({ id: id });
  }

  // 수신 메시지를 페이지네이션 기반으로 받아오는 메소드
  async findReceivedLetters(
    receiverId: number,
    page: number,
    limit: number,
  ): Promise<[Letter[], number]> {
    const letterRepository = await this.getLetterRepository();

    return await letterRepository
      .createQueryBuilder('letter')
      .where('letter.receiverId = :receiverId', { receiverId: receiverId })
      .andWhere('letter.isDeletedByReceiver = :isDeletedByReceiver', {
        isDeletedByReceiver: false,
      })
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('letter.createdAt', 'DESC')
      .getManyAndCount();
  }

  // 보낸 편지들을 페이지네이션 기반으로 받아오는 메소드
  async findSentLetters(
    authorId: number,
    page: number,
    limit: number,
  ): Promise<[Letter[], number]> {
    const letterRepository = await this.getLetterRepository();

    return await letterRepository
      .createQueryBuilder('letter')
      .where('letter.authorId = :authorId', { authorId: authorId })
      .andWhere('letter.isDeletedByAuthor = :isDeletedByAuthor', {
        isDeletedByAuthor: false,
      })
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('letter.createdAt', 'DESC')
      .getManyAndCount();
  }

  // 수신된 편지를 삭제 처리하는 메소드
  async deleteReceivedLetter(id: number): Promise<Letter | null> {
    const letterRepository = await this.getLetterRepository();

    const foundLetter = await letterRepository.findOneBy({ id: id });

    // 만약 편지가 존재하지 않으면 null을 바로 반환
    if (!foundLetter) return null;

    // 수신자에 의해 삭제된 편지를 반환해준다
    const deletedLetter = foundLetter.deleteByReceiver();

    return await deletedLetter.save();
  }

  async deleteSentLetter(id: number): Promise<Letter | null> {
    const letterRepository = await this.getLetterRepository();

    const foundLetter = await letterRepository.findOneBy({ id: id });

    // 만약 편지가 존재하지 않으면 null을 바로 반환
    if (!foundLetter) return null;

    // 발신자에 의해서 삭제된 편지를 반환해준다
    const deletedLetter = foundLetter.deleteByAuthor();

    return await deletedLetter.save();
  }

  // connection을 통해서 repository를 가져오는 메소드
  async getLetterRepository(): Promise<Repository<Letter>> {
    const connection = await getConnection();

    return connection.getRepository(Letter);
  }
}
