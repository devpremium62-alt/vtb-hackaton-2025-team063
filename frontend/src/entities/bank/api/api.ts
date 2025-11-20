import {Consent} from "@/entities/bank";
import universalFetch from "@/shared/lib/universalFetch";

export function getConsents(): Promise<Consent[]> {
    return universalFetch("/consents", {
        method: "GET"
    });
}

export function createConsent({bankId, clientId}: {bankId: string, clientId: string}): Promise<Consent> {
    return universalFetch(`/consents/${bankId}`, {
        method: "POST",
        body: {client_id: clientId}
    });
}

export async function deleteConsent(bankId: string): Promise<void> {
    await universalFetch(`/consents/${bankId}`, {
        method: "DELETE"
    });
}