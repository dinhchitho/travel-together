export const API_NOTIFICATION_PATH = {
    NOTIFICATION: '/notifications',
    DELETE_NOTIFICATION: '/notification'
}

export interface Notification {
    id: string,
    content: string,
    thumbnail: string,
    isRead: boolean,
    permalink: string
}