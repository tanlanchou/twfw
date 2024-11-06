import * as os from 'os';

export class NetworkUtils {
    static getLocalIpAddress(): string {
        const networkInterfaces = os.networkInterfaces();
        let ipAddress = '127.0.0.1'; // 默认使用本地回环地址

        for (const iface of Object.values(networkInterfaces)) {
            for (const details of iface) {
                if (details.family === 'IPv4' && !details.internal) {
                    ipAddress = details.address;
                    break;
                }
            }
            if (ipAddress !== '127.0.0.1') break;
        }

        return ipAddress;
    }
}