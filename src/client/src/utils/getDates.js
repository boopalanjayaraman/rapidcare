
const getDates = (startDate, endDate, days = []) => {
    let datesArr = [];

    // Strip hours minutes seconds etc.
    let currentDate = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate()
    );

    while (currentDate <= endDate) {
        let currentWeekDay = currentDate.toLocaleString('default', { weekday: 'short' });
        let currentDateStr = currentWeekDay
            + ' ' + currentDate.toLocaleString('default', { month: 'short' }) 
            + ' ' + currentDate.getDate() + ' ' + currentDate.getFullYear() + ' 00:00:00'


        if(days && days.length > 0){
            if(days.includes(currentWeekDay.toLowerCase())){
                datesArr.push(currentDateStr);    
            }
        }
        else {
            datesArr.push(currentDateStr);
        }

        currentDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate() + 1,  
        );
    }

    return datesArr; 
};

export default getDates;