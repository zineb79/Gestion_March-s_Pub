export class SecurityMonitor {
    private static instance: SecurityMonitor;
    private constructor() {}

    public static getInstance(): SecurityMonitor {
        if (!SecurityMonitor.instance) {
            SecurityMonitor.instance = new SecurityMonitor();
        }
        return SecurityMonitor.instance;
    }

    public reportIncident(incident: {
        type: string;
        details?: string;
    }): void {
        console.error(`[SECURITY INCIDENT] Type: ${incident.type}`);
        if (incident.details) {
            console.error(`Details: ${incident.details}`);
        }
        // Here you could add actual monitoring/reporting logic
        // For example: send to an external monitoring service
    }
}