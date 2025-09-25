export const isTaskRead = (task, date) => {
    const dateStr = new Date(date).toISOString().slice(0, 10);
    return task.isRead.includes(dateStr);
};