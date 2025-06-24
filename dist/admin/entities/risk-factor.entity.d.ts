export declare enum RiskLevel {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    CRITICAL = "critical"
}
export declare class RiskFactor {
    id: string;
    name: string;
    description: string;
    level: RiskLevel;
    createdAt: Date;
    updatedAt: Date;
}
