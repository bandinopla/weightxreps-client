export function ymd2Nice(dateString: string): string {
    const [year, month, day] = dateString.split('-').map(Number);

    const inputDate = new Date(year, month - 1, day);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isSameDay = 
        inputDate.getFullYear() === today.getFullYear() &&
        inputDate.getMonth() === today.getMonth() &&
        inputDate.getDate() === today.getDate();

        console.log( inputDate )

    const isYesterday = 
        inputDate.getFullYear() === yesterday.getFullYear() &&
        inputDate.getMonth() === yesterday.getMonth() &&
        inputDate.getDate() === yesterday.getDate();

    const isSameMonth = 
        inputDate.getFullYear() === today.getFullYear() &&
        inputDate.getMonth() === today.getMonth();

    const isSameYear = inputDate.getFullYear() === today.getFullYear();

    if (isSameDay) {
        return "Today";
    }
    if (isYesterday) {
        return "Yesterday";
    }
    if (isSameMonth) {
        return `${inputDate.toLocaleString('default', { weekday: 'long' }) } ${inputDate.getDate()}`;
    }
    if (isSameYear) {
        return `${inputDate.toLocaleString('default', { month: 'long' }) } ${inputDate.getDate()}`;
    }

    return inputDate.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}
