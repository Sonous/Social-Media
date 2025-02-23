import _ from 'lodash';

export function uniqueArr<T>(arr: T[]) {
    return arr.filter((obj, index, self) => index === self.findIndex((o) => _.isEqual(o, obj)));
}
