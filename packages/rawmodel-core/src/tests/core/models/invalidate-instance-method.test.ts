import { Spec } from '@hayspec/spec';
import { Model, ParserKind, prop } from '../../..';

const spec = new Spec();

spec.test('clears property errors', async (ctx) => {
  class Book extends Model {
    @prop()
    title: string;
  }
  class User extends Model {
    @prop()
    name: string;
    @prop({
      parse: {
        kind: ParserKind.MODEL,
        model: Book,
      },
    })
    book: Book;
    @prop({
      parse: {
        kind: ParserKind.ARRAY,
        parse: {
          kind: ParserKind.MODEL,
          model: Book,
        },
      },
    })
    books: Book[];
  }
  const user = new User({
    book: {},
    books: [null, {}]
  });
  user.applyErrors([
    { path: ['name'], errors: [100] },
    { path: ['book', 'title'], errors: [200] },
    { path: ['books', 1, 'title'], errors: [300] },
  ]);
  user.invalidate();
  ctx.deepEqual(user.getProp('name').getErrorCodes(), []);
  ctx.deepEqual(user.getProp('book', 'title').getErrorCodes(), []);
  ctx.deepEqual(user.getProp('books', 1, 'title').getErrorCodes(), []);
});

export default spec;