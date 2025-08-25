export default function dateTime() {
    const formatDate = (timestamp = 0, options = {}) => {
        const date = new Date(timestamp > 0 ? timestamp * 1000 : Date.now());
        return new Intl.DateTimeFormat(undefined, options).format(date);
    };

    return {
        format(timestamp = 0) {
            const date = new Date(timestamp);
            const [year, month, day, hours, minutes] = [date.getFullYear().toString().slice(2), ("0" + (date.getMonth() + 1)).slice(-2), ("0" + date.getDate()).slice(-2), ("0" + date.getHours()).slice(-2), ("0" + date.getMinutes()).slice(-2)];
            return `${day}.${month}.${year} ${hours}:${minutes}`;
        },
        fullDate(timestamp = 0) {
            return formatDate(timestamp, {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                timeZoneName: "short",
            });
        },
        date(timestamp = 0) {
            return formatDate(timestamp, {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        },
        dateISO(timestamp = 0) {
            const date = new Date(timestamp > 0 ? timestamp * 1000 : Date.now());
            const localDate = date.toISOString().slice(0, 10); // Формат YYYY-MM-DD
            const localTime = date.toTimeString().slice(0, 5); // Формат HH:MM
            return `${localDate}T${localTime}`;
        },
    };
}
