module.exports = {
    userType_individual : "individual",
    userType_business : "business",
    userType_partnerdoctor : "partnerdoctor",
    idCounter_users: "users",
    idCounter_products: "products",
    idCounter_businesses: "businesses",
    idCounter_claims: "claims",
    idCounter_documents: "documents",
    idCounter_insuranceorders: "insuranceorders",
    idCounter_insuranceproducts: "insuranceproducts",
    idCounter_nominees: "nominees",
    idCounter_policyinfos: "policyinfos",
    scenario_unlockUsers: 'unlockUsers',
    scenario_browseProducts: 'browseProducts',
    scenario_getUserInsurances: 'getUserInsurances',
    rapydConstants : {
        http_get_method : 'get',
        http_post_method : 'post',
        http_checkout_url : '/v1/checkout',
        http_account_transfer_url : '/v1/account/transfer',
        http_account_transfer_response_url : '/v1/account/transfer/response',
        http_create_customer_url : '/v1/customers',
        http_create_beneficiary_url : '/v1/payouts/beneficiary',
        http_create_payout_url : '/v1/payouts',
        service_fee : 0.25,
        paymentTypeCategories : {
            us : [
                "card", "bank_transfer",
            ],
            in : [
                "bank_redirect", "bank_transfer", "card",
            ]
        },
        paymentTypes :{
            us: {
                    card: [
                        "us_debit_discover_card",
                        "us_visa_card",
                        "us_mastercard_card",
                        "us_atmdebit_card"
                    ],
                    bank : [
                        "us_ach_bank",
                    ]
                }   , //// includes both bank and card
            in : {
                card : [
                    "in_visa_credit_card",
                    "in_mastercard_credit_card",
                    "in_mastercard_debit_card",
                    "in_visa_debit_card",
                    "in_rupay_credit_card",
                    "in_diners_credit_card",
                    "in_rupay_debit_card",
                    "in_amex_credit_card",
                    "in_maestro_debit_card",
                    "in_internationalcards_card",
                    "in_debit_visa_card",
                    "in_debit_rupay_card",
                    "in_debit_mastercard_card",
                    "in_credit_visa_card",
                    "in_credit_rupay_card",
                    "in_credit_mastercard_card",
                    "in_amex_card",
                ],
                bank : [
                    "in_googlepay_upi_bank", // Bank & google pay upi
                    "in_idbi_bank",
                    "in_karur_vysya_bank",
                    "in_tamilnad_mercantile_bank",
                    "in_pnbretail_bank",
                    "in_lakshmivilasretail_bank",
                    "in_kotakmahindra_bank",
                    "in_idfc_bank",
                    "in_dhanlaxmi_bank",
                    "in_upi_bank",
                    "in_hdfc_bank",
                    "in_karnataka_bank",
                    "in_indianoverseas_bank",
                    "in_federal_bank",
                    "in_indian_bank",
                    "in_karurvysya_bank",
                    "in_indusind_bank",
                    "in_canara_bank",
                    "in_icici_bank",
                    "in_andhra_bank"
                ]
            }
        },
        beneficiary_category_card : 'card',
        beneficiary_category_bank : 'bank',
        beneficiary_category_rapyd_ewallet : 'rapyd_ewallet',
        beneficiary_entity_type_individual : 'individual',
        beneficiary_entity_type_company : 'company',
    }
};