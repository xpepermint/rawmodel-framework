import { Spec } from '@hayspec/spec';
import { Model, ParserKind, prop } from '../../..';

const spec = new Spec();

spec.test('sets properties to their fake values', (ctx) => {
  class Book extends Model {
    @prop({
      fakeValue: 'foo',
    })
    title: string;
  }
  class User extends Model {
    @prop({
      fakeValue: 'bar',
    })
    name: string;
    @prop({
      parse: {
        kind: ParserKind.MODEL,
        model: Book,
      },
      fakeValue: 'bar',
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
      fakeValue: [null, {}],
    })
    books: Book[];
  }
  const user = new User();
  user.fake();
  ctx.deepEqual(user.serialize(), {
    name: 'bar',
    book: {
      title: 'foo',
    },
    books: [
      null,
      {
        title: 'foo',
      },
    ],
  });
});

export default spec;
