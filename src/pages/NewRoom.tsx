import { Link, useHistory } from 'react-router-dom';
import{ FormEvent, useState } from 'react';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';

import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';

import '../styles/auth.scss';
import { database } from '../services/firebase';

export function NewRoom() {
  const { user } = useAuth();
  const [newRoom, setNewRoom] = useState('');
  const history = useHistory();

  async function handleCreateRoom(event:FormEvent) {
    event.preventDefault();
    
    if(newRoom.trim() === '') {
      return;
    }

    const roomRef = database.ref('rooms');

    const firebaseRoom = await roomRef.push({
      title: newRoom,
      authorID: user?.id
    })

    history.push(`/rooms/${firebaseRoom.key}`);
  }

  return(
    <div id="page-auth">
      <aside>
        <img src={illustrationImg} alt="perguntas e respostas"></img>
        <strong>Toda pergunta tem uma resposta </strong>
        <p>Aprenda e compartilha perguntas com outras pessoas</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={ logoImg } alt="logo da aplicação LetMeAsk"></img>
          <h2>Criar uma nova sala</h2>
          <form onSubmit={ handleCreateRoom }>
            <input
              type="text"
              placeholder="Nome da sala"
              onChange={event => setNewRoom(event.target.value)}
              value={newRoom}
            />
            <Button type="submit">
              Criar sala
            </Button>
          </form>
          <p>Quer entrar em uma sala já existente? <Link to="/">Clique aqui</Link></p>
        </div>
      </main>
    </div>
  )
}