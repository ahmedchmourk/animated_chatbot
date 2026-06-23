export type AppState = 'preloader' | 'selection' | 'chat';

export interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

export interface Avatar {
  id: string;
  name: string;
  face: string;
}
