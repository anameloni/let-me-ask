import { useHistory } from 'react-router-dom';
import{ FormEvent, useState } from 'react';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg';

import { database } from '../services/firebase';

import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';

import '../styles/auth.scss';


export function Home() {
  const history = useHistory();
  const {user, signInWithGoogle} = useAuth();
  const [roomCode, setRoomCode] = useState('');

  async function handleCreateRoom() {
    if (!user) {
      await signInWithGoogle();
    };

    history.push('/rooms/new');
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault();

    if(roomCode.trim() === '') {
      return;
    }

    let roomRef = await database.ref(`rooms/${roomCode}`).get();
    console.log('roomRef: '+ roomRef.exists());

    if(!roomRef.exists()) {
      alert(`Room "${roomCode}" does not exists.`);
      return;
    }

    if(roomRef.val().endedAt) {
      alert(`Room "${roomCode}" already closed.`);
      return;
    }

    history.push(`/rooms/${roomCode}`);
  }

  return (
    <div id="page-auth">
      <aside>
        <img src={illustrationImg} alt="perguntas e respostas"></img>
        <strong>Toda pergunta tem uma resposta </strong>
        <p>Aprenda e compartilha perguntas com outras pessoas</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logoImg} alt="logo da aplicação LetmeAsk"></img>
          <button 
            className="create-room" 
            onClick={handleCreateRoom}
          >
            <img src={googleIconImg} alt="Logo do Google"></img>
            Crie uma sala com seu login do Google
          </button>
          <div className="separator">ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              placeholder="Digite o código da sala"
              onChange={event => setRoomCode(event.target.value)}
              value={roomCode}
            />
            <Button type="submit">
              Entrar na sala
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}