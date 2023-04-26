import { LetterInboxResponse } from './dto/response/letter.inbox.response';
import { UserRepository } from './../../user/domain/user.repository';
import { LetterOutboxResponse } from './dto/response/letter.outbox.response';
import { inject, injectable } from 'inversify';
import { Letter } from '../domain/letter.entity';
import { LetterCreateRequest } from './dto/request/letter.create.request';
import { Types } from '../../app/container/types.di';
import { LetterRepository } from '../domain/letter.repository';
import { LetterCreateResponse } from './dto/response/letter.create.response';
import { User } from '../../user/domain/user.entity';

@injectable()
export class LetterService {
  constructor(
    @inject(Types.LETTER_REPOSITORY)
    private readonly letterRepository: LetterRepository,
    @inject(Types.USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async create(
    createRequest: LetterCreateRequest,
    userId: number,
  ): Promise<LetterCreateResponse> {
    const newLetter: Letter = createRequest.toEntity(userId);

    const savedLetter = await this.letterRepository.create(newLetter);

    return LetterCreateResponse.fromEntity(savedLetter);
  }

  //받은 쪽지의 목록을 반환하는 메소드
  async getReceivedLetterList(
    receiverId: number,
    page: number,
    limit: number,
  ): Promise<[LetterInboxResponse[], number]> {
    const [letterList, totalElements] =
      await this.letterRepository.findReceivedLetters(receiverId, page, limit);

    // letterList가 비어있는 경우 빈 리스트와
    if (letterList.length === 0) {
      return [[], totalElements];
    }

    const inboxResponseList = await this.getInboxResponseList(letterList);

    return [inboxResponseList, totalElements];
  }

  // 보낸 쪽지의 목록을 반환하는 메소드
  async getSentLetterList(
    authorId: number,
    page: number,
    limit: number,
  ): Promise<[LetterOutboxResponse[], number]> {
    const [letterList, totalElements] =
      await this.letterRepository.findSentLetters(authorId, page, limit);

    // letterList가 비어있는 경우 빈 리스트와
    if (letterList.length === 0) {
      return [[], totalElements];
    }

    const outboxResponseList = await this.getOutboxResponseList(letterList);

    return [outboxResponseList, totalElements];
  }

  // 받은 쪽지를 삭제하는 메소드
  async deleteReceivedLetter(letterId: number): Promise<string | null> {
    const deletedLetter = await this.letterRepository.deleteReceivedLetter(
      letterId,
    );

    return deletedLetter ? 'OK' : null;
  }

  // 보낸 편지를 삭제하는 메소드
  async deleteSentLetter(letterId: number): Promise<string | null> {
    const deletedLetter = await this.letterRepository.deleteSentLetter(
      letterId,
    );

    return deletedLetter ? 'OK' : null;
  }

  // letter로부터 LetterInboxResponse를 뽑아오는 메소드
  private async getInboxResponseList(
    letterList: Letter[],
  ): Promise<LetterInboxResponse[]> {
    const authorIdList = letterList.map((letter) => letter.authorId);

    // id 중복 제거
    const uniqueAuthorIdList = this.getUniqueNumberList(authorIdList);

    const authorList = await this.userRepository.findManyByIds(
      uniqueAuthorIdList,
    );

    const userIdNameMap = this.getUserIdNameMap(authorList);

    return letterList.map(
      ({ id, authorId, receiverId, content, createdAt }) =>
        new LetterInboxResponse(
          id,
          authorId,
          userIdNameMap[authorId],
          receiverId,
          content,
          createdAt,
        ),
    );
  }

  // letterList로부터 LetterOutboxResponse를 뽑아오는 메소드
  private async getOutboxResponseList(
    letterList: Letter[],
  ): Promise<LetterOutboxResponse[]> {
    const receiverIdList = letterList.map((letter) => letter.receiverId);

    // id 중복 제거
    const uniqueReceiverIdList = this.getUniqueNumberList(receiverIdList);

    const receiverList = await this.userRepository.findManyByIds(
      uniqueReceiverIdList,
    );

    const userIdNameMap = this.getUserIdNameMap(receiverList);

    return letterList.map(
      ({ id, authorId, receiverId, content, createdAt }) =>
        new LetterOutboxResponse(
          id,
          authorId,
          receiverId,
          userIdNameMap[receiverId],
          content,
          createdAt,
        ),
    );
  }

  // number의 리스트에서 중복을 제거한 리스트를 반환해주는 메소드
  private getUniqueNumberList(numberList: number[]): number[] {
    const numberSet = new Set(numberList);

    return Array.from(numberSet);
  }

  // user의 id와 name 정보를 저장하는 객체를 반환하는 메소드
  private getUserIdNameMap(userList: User[]): { [key: number]: string } {
    const userIdNameMap: { [key: number]: string } = {};

    return userList.reduce((acc, user) => {
      acc[user.id] = user.nickname;
      return acc;
    }, userIdNameMap);
  }
}
