import { User } from '../users/user.entity';
export declare class Request {
    id: string;
    title: string;
    mda: string;
    amount: number;
    status: string;
    fundingSource: string;
    budgetLine: string;
    submittedDate: Date;
    lastUpdated: Date;
    createdById: string;
    createdBy: User;
    documents: any;
    notes: string;
    localContentPercentage: number;
    isJoint: boolean;
    partnerMda: string;
    mdaContribution: number;
    partnerContribution: number;
    reviewComments: any;
    riskScore: number;
    riskAnalysis: string;
}
