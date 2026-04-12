import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../../App.css';   
import './LoginForm.css';
import { person1 } from '../../users';

export default function LoginForm() {
    const navigate = useNavigate();

        const [username, setUsername] = useState('');
        const [password, setPassword] = useState('');
    
        // Проверка на минимальные значения
        function minValue(){
            if(username.length >= 8){
                if(password.length >= 6){
                     return true;
                } else{
                    alert('Пароль не может быть короче 6 символов!')
                    return false;
                }
            } else{
                alert('Юзернейм не может быть короче 8 символов!')
                return false;
            }
        }
    
    
        // Проверяет на максимальные значения
        function maxValue(){
            if(username.length <= 20){
                if(password.length <= 20){
                    return true;
                } else{
                    alert('Пароль не может быть длинне 20 символов!')
                    return false;
                }
            } else{
                alert('Юзернейм не может быть длиннее 20 символов!')
                return false;
            }
        }

        
    
    
    
    
        // Вызов и проверка всех функций
        function auth() {
        const results = {
            min: minValue(),
            max: maxValue()
        };
        
        console.log('minValue вернула:', results.min);
        console.log('maxValue вернула:', results.max);
        
        if (results.max === true && results.min === true) {
            if(username === person1.username && password == person1.password){
                console.log('Вход выполнен');
                navigate('/main')

            } else{
                console.log("Неверный юзернейм или пароль!");
                
            }
        } else{
            console.log('Имеются ошибки')
        }
    }

    return (
    <form className='form'>
        <div className='text'>Вход</div>
        <div className="countainer">
            <p>Имя пользователя</p>
            <input type="text" placeholder='Имя пользователя' className='startInput username' value={username} onChange={(e) => setUsername(e.target.value)}/>
        </div>

        <div className="countainer">
            <p>Пароль</p>
            <input type="text" placeholder='Пароль' className='startInput' value={password} onChange={(e) => setPassword(e.target.value)}/>
        </div>

        <button type='button' className='startButton' onClick={auth}>Вход</button>
        <div className="source">
            <Link to="/register" className='textSource' style={{cursor: 'pointer'}}>
                Нет аккаунта? Регистрация
            </Link>
        </div>
    </form>
);
}