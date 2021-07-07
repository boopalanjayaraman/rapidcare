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
    payoutMethodTypes : {
        us: {
            card: [
                { text: "debit discover card", value: "us_debit_discover_card"},
                { text: "visa card", value: "us_visa_card"},
                { text: "mastercard card", value: "us_mastercard_card"},
                { text: "atmdebit card", value: "us_atmdebit_card"},
            ],
            bank : [
                { text: "ach bank", value: "us_ach_bank"},
            ]
        }   , //// includes both bank and card
        in : {
            card : [
                { text: "visa credit card", value: "in_visa_credit_card"},
                { text: "mastercard credit card", value: "in_mastercard_credit_card"},
                { text: "mastercard debit card", value: "in_mastercard_debit_card"},
                { text: "visa debit card", value: "in_visa_debit_card"},
                { text: "rupay credit card", value: "in_rupay_credit_card"},
                { text: "diners credit card", value: "in_diners_credit_card"},
                { text: "rupay debit card", value: "in_rupay_debit_card"},
                { text: "amex credit card", value: "in_amex_credit_card"},
                { text: "maestro debit card", value: "in_maestro_debit_card"},
                { text: "internationalcards card", value: "in_internationalcards_card"},
                { text: "debit visa card", value: "in_debit_visa_card"},
                { text: "debit rupay card", value: "in_debit_rupay_card"},
                { text: "debit mastercard card", value: "in_debit_mastercard_card"},
                { text: "credit visa card", value: "in_credit_visa_card"},
                { text: "credit rupay card", value: "in_credit_rupay_card"},
                { text: "credit mastercard card", value: "in_credit_mastercard_card"},
                { text: "amex card", value: "in_amex_card"},
            ],
            bank : [
                { text: "googlepay upi", value: "in_googlepay_upi_bank"}, // Bank & google pay upi
                { text: "idbi bank", value: "in_idbi_bank"},
                { text: "karur vysya bank", value: "in_karur_vysya_bank"},
                { text: "tamilnad mercantile bank", value: "in_tamilnad_mercantile_bank"},
                { text: "pnbretail bank", value: "in_pnbretail_bank"},
                { text: "lakshmivilasretail bank", value: "in_lakshmivilasretail_bank"},
                { text: "kotakmahindra bank", value: "in_kotakmahindra_bank"},
                { text: "idfc bank", value: "in_idfc_bank"},
                { text: "dhanlaxmi bank", value: "in_dhanlaxmi_bank"},
                { text: "upi bank", value: "in_upi_bank"},
                { text: "hdfc bank", value: "in_hdfc_bank"},
                { text: "karnataka bank", value: "in_karnataka_bank"},
                { text: "indianoverseas bank", value: "in_indianoverseas_bank"},
                { text: "federal bank", value: "in_federal_bank"},
                { text: "indian bank", value: "in_indian_bank"},
                { text: "karurvysya bank", value: "in_karurvysya_bank"},
                { text: "indusind bank", value: "in_indusind_bank"},
                { text: "canara bank", value: "in_canara_bank"},
                { text: "icici bank", value: "in_icici_bank"},
                { text: "andhra bank", value: "in_andhra_bank"},
            ]
        }
    }
};

export default commonData;