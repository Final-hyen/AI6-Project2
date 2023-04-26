import { UserController } from './../../user/presentation/user.controller';
import { UserService } from './../../user/application/user.service';
import { UserRepository } from '../../user/domain/user.repository';
import { BoardController } from '../../community/boards/presentation/board.controller';
import { BoardService } from '../../community/boards/application/board.service';
import { BoardRepository } from '../../community/boards/domain/board.repository';
import { CommentController } from '../../community/comments/presentation/comment.controller';
import { CommentService } from '../../community/comments/application/comment.service';
import { CommentRepository } from '../../community/comments/domain/comment.repository';

import { LetterRepository } from '../../letter/domain/letter.repository';
import { LetterController } from '../../letter/presentation/letter.controller';
import { LetterService } from '../../letter/application/letter.service';
import { Container } from 'inversify';
import { Types } from './types.di';

const container = new Container();

container
  .bind<UserRepository>(Types.USER_REPOSITORY)
  .to(UserRepository)
  .inSingletonScope();
container
  .bind<UserService>(Types.USER_SERVICE)
  .to(UserService)
  .inSingletonScope();
container
  .bind<UserController>(Types.USER_CONTROLLER)
  .to(UserController)
  .inSingletonScope();

container
  .bind<BoardRepository>(Types.BOARD_REPOSITORY)
  .to(BoardRepository)
  .inSingletonScope();
container
  .bind<BoardService>(Types.BOARD_SERVICE)
  .to(BoardService)
  .inSingletonScope();
container
  .bind<BoardController>(Types.BOARD_CONTROLLER)
  .to(BoardController)
  .inSingletonScope();

container
  .bind<CommentRepository>(Types.COMMENT_REPOSITORY)
  .to(CommentRepository)
  .inSingletonScope();
container
  .bind<CommentService>(Types.COMMENT_SERVICE)
  .to(CommentService)
  .inSingletonScope();
container
  .bind<CommentController>(Types.COMMENT_CONTROLLER)
  .to(CommentController)
  .inSingletonScope();

container
  .bind<LetterRepository>(Types.LETTER_REPOSITORY)
  .to(LetterRepository)
  .inSingletonScope();
container
  .bind<LetterController>(Types.LETTER_CONTROLLER)
  .to(LetterController)
  .inSingletonScope()

container
  .bind<LetterService>(Types.LETTER_SERVICE)
  .to(LetterService)
  .inSingletonScope()
export default container;
