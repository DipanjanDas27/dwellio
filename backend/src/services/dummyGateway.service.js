import crypto from "crypto"
import { ApiError } from "../utils/apiError.js";
export const processDummyPayment = async ({
    amount,
    mode = "auto",
}) => {

    if (!amount || amount <= 0) {
        return { status: "failed", reason: "invalid amount" };
    }

    if (mode === "network_error") {
        return { status: "failed", reason: "network error" };
    }

    if (mode === "card_declined") {
        return { status: "failed", reason: "Card declined" };
    }
   
    if (mode === "auto") {
        const random = Math.random();

        if (random < 0.15) {
            return { status: "failed", reason: "Insufficient funds" };
        }

        if (random < 0.25) {
           return { status: "failed", reason: "network error" };
        }
    }
    const transactionId = crypto
        .randomBytes(8)
        .toString("hex");
        
    return {
        status: "success",
        transaction_id: transactionId,
    };
};
export const processDummyRefund = async ({
    transaction_id,
}) => {

    if (!transaction_id) {
        throw new ApiError(400, "Invalid transaction id");
    }

    return {
        status: "refunded",
        refund_id: transaction_id,
    };
};