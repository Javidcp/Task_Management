const shouldShowTask = (task, currentDate) => {
    const today = new Date(currentDate);
    const taskDate = new Date(task.date);
    const repeat = task.repeat || {};
    const repeatDays = repeat.days || [];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    if (today < taskDate) return false;

    let show = false;

    if (repeat.type === "Monthly" && repeat.dayOfMonth) {
        const taskDay = repeat.dayOfMonth;

        if (task.repeatInterval) {
            if (today >= taskDate && today.getDate() === taskDay) show = true;
        } else {
            const nextOccurrence = new Date(taskDate);
            if (taskDate.getDate() < taskDay) {
                nextOccurrence.setDate(taskDay);
            } else {
                nextOccurrence.setMonth(taskDate.getMonth() + 1);
                nextOccurrence.setDate(taskDay);
            }
            if (today.toDateString() === nextOccurrence.toDateString()) show = true;
        }
    }

    if (!show && repeatDays.length > 0) {
        const dayIndexSet = repeatDays.map(day => dayNames.indexOf(day));
        const todayIndex = today.getDay();

        if (task.repeatInterval) {
            if (dayIndexSet.includes(todayIndex)) show = true;
        } else {
            const nextOccurrences = dayIndexSet.map(dayIndex => {
                const tempDate = new Date(taskDate);
                while (tempDate.getDay() !== dayIndex) {
                    tempDate.setDate(tempDate.getDate() + 1);
                }
                return tempDate;
            });
            if (nextOccurrences.some(d => d.toDateString() === today.toDateString())) show = true;
        }
    }

    if (!show && repeatDays.length === 0 && (!repeat.type || repeat.type === "Daily")) {
        if (taskDate.toDateString() === today.toDateString()) show = true;
    }

    return show;
}


export default shouldShowTask;
