import { io, Socket } from "socket.io-client";
const SOCKET_URI = "http://localhost:3002?token=";

class SocketIOService {

    public socket: Socket | null = null;  

    connect(token: string){
        if (this.socket) {
            return;
        }

        this.socket = io(SOCKET_URI+token, {
            auth: {token},
            transports: ["websocket"], // React Native'de "polling" hatası almamak için şart
            forceNew: true,
        });

        this.socket.on("connect", () => {
            console.log("✅ Socket Sunucuya Bağlandı! ID:", this.socket?.id);
        });

        this.socket.on("connect_error", (err) => {
            console.log("❌ Bağlantı Hatası:", err.message);
        });
    }

    joinRoom(roomId: string){
        if (this.socket) {
            this.socket.emit("joinRoom", roomId);
            console.log(`🚪 ${roomId} odasına girildi.`);
        }
    }

    sendMessage(data: any){
        if (this.socket) {
            this.socket.emit("sendMessage", data);
        }
    }

    on(event: string, callback: (data: any) => void) {
        if (this.socket) {
            this.socket.on(event, callback);
        }
    }

    off(event: string) {
        if (this.socket) {
            this.socket.off(event);
        }
    }
    readMessage(conversationId: string){
        if (this.socket) {
            this.socket.emit("readMessage", {conversationId: conversationId});
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }
    
}


export default new SocketIOService();