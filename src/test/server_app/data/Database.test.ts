import { DataBase } from "../../../app/server_app/data/DataBase";
import * as IdGenerator from "../../../app/server_app/data/IdGenerator";

type someTypeWithId = {
    id: string,
    name: string,
    color: string
}

describe('Database test suite', () => {

    let sut : DataBase<someTypeWithId>;

    const fakeId = '1234';

    const someObject1 = {
        id: '',
        name: 'someName',
        color: 'someColor'
    };

    const someObject2 = {
        id: '',
        name: 'someOtherName',
        color: 'someColor'
    };

    beforeEach(() => {
        sut = new DataBase<someTypeWithId>();
        jest.spyOn(IdGenerator, 'generateRandomId').mockReturnValue(fakeId);
    });

    it('should return id after insert', async () => {
        const actual = await sut.insert({
            id: '',
        } as any);

        expect(actual).toBe(fakeId);
    });

    it('should return element after insert', async () => {
        const id = await sut.insert(someObject1);
        const actual = await sut.getBy('id', id);

        expect(actual).toEqual(someObject1);
    });

    it('should find all elements with the same property', async () => {
        await sut.insert(someObject1);
        await sut.insert(someObject2);

        const expected = [someObject1, someObject2];

        const actual = await sut.findAllBy('color', 'someColor');

        expect(actual).toEqual(expected);
    });

    it('should update a property of an element', async () => {
        const id = await sut.insert(someObject1);
        const expectedColor = 'someOtherColor';

        await sut.update(id, 'color', expectedColor);
        const object = await sut.getBy('id', id);
        const actualColor = object.color;

        expect(actualColor).toBe(expectedColor);
    });

    it('should delete an element', async () => {
        const id = await sut.insert(someObject1);

        await sut.delete(id);
        const actual = await sut.getBy('id', id);

        expect(actual).toBeUndefined();
    });

    it('should return all elements', async () => {
        await sut.insert(someObject1);
        await sut.insert(someObject2);

        const expected = [someObject1, someObject2];

        const actual = await sut.getAllElements();

        expect(actual).toEqual(expected);
    });
});