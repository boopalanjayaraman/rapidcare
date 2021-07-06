const commonData = {
    statuses: ['new', 'closed', 'expired', 'active'],
    billingUnits: [
        { text: 'Every Day', value: 'daily'},
        { text: 'Every Hour', value: 'hourly'}
    ],
    days: [
        { text: 'sun', value: 'sun' },
        { text: 'mon', value: 'mon' },
        { text: 'tue', value: 'tue' },
        { text: 'wed', value: 'wed' },
        { text: 'thu', value: 'thu' },
        { text: 'fri', value: 'fri' },
        { text: 'sat', value: 'sat' } ],
    countries: [
        { text: 'India', displayText: 'India (भारत)', value: 'in', defaultCurrency: 'INR'},
        { text: 'United States', displayText: 'United States of America', value: 'us', defaultCurrency: 'USD'}
    ],
    languages: [
        { text: 'English', value: 'en'},
        { text: 'தமிழ் (Tamil)', value: 'ta'}
    ],
    reviewStatuses: [
        { value: 'approved', text : 'Approved'},
        { value: 'needinfo', text : 'Needs more information'}
    ],
};

export default commonData;