import crypto from "crypto"
import { ApiError } from "../utils/apiError.js";
export const processDummyPayment = async ({
    amount,
    mode = "auto",
}) => {

    if (!amount || amount <= 0) {
        throw new ApiError(400, "Invalid amount");
    }

    if (mode === "network_error") {
        throw new ApiError(503, "Gateway timeout");
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
            throw new ApiError(503, "Network issue");
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