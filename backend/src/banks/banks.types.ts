export type AccountType = {
    accountId: string;
    nickname: string;
    status: "Enabled" | "closed";
    accountSubType: "Checking" | "Savings";
    account: {
        identification: string;
    }[];
};

export type CreatedAccountType = {
    accountId: string;
    account_number: string;
    account_type: string;
    balance: number;
    status: 'active' | string;
}

export type ConsentResponseType = {
    consentId: string,
    status: "AwaitingAuthorization" | string,
    creationDateTime: string,
    statusUpdateDateTime: string,
    permissions: string[];
}

export type TransactionType = {
    accountId: string;
    transactionId: string;
    amount: {
        amount: string;
        currency: string;
    };
    transactionInformation: string;
    creditDebitIndicator: "Debit" | "Credit";
    status: "completed" | string;
    valueDateTime: string;
    merchant?: {
        mccCode: string;
    }
};

export type CreatedTransactionType = {
    paymentId: string;
    status: "AcceptedSettlementCompleted" | string;
    creationDateTime: string;
    statusUpdateDateTime: string;
    description: string;
    amount: string;
    "currency": string;
};

export type PaymentConsentType = {
    request_id: string;
    consent_id: string;
    status: "approved" | string;
    consent_type: "single_use" | "multi_use";
    auto_approved: boolean;
    message: string;
    valid_until: string;
};

export type CardType = {
    cardId: string;
    cardNumber: string;
}