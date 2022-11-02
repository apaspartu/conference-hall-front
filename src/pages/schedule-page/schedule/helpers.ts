import dayjs from 'dayjs';


// a and b is item's id of format 'YYYY-MM-DD/HH:mm' like '2022-10-10/10:10'
export function itemIdsComparator(a: string, b: string): 1 | 0 | -1 {
    const format = 'YYYY-MM-DD/HH:mm';
    let date_a = dayjs(a, format);
    let date_b = dayjs(b, format);

    if (date_a.isAfter(date_b)) {
        return 1;
    } else if (date_a.isBefore(date_b)) {
        return -1;
    } else {
        return 0;
    }
}

// check whether second item is the first plus step in minutes
export function isDirectNextItem(firstItemId: string, secondItemId: string, step: number): boolean {
    const format = 'YYYY-MM-DD/HH:mm';
    let date_a = dayjs(firstItemId, format);
    let date_b = dayjs(secondItemId, format);

    if (date_a.add(step, 'minute').isSame(date_b)) {
        return true;
    } else {
        return false;
    }
}